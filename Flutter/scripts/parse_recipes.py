#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
One-off migration script: parses the old Newstart Android app's
MealConstants.java (title identifier -> title string) and
DatabaseHelper.java (title -> HTML recipe content, via 1125
`db.execSQL("INSERT OR REPLACE INTO recipes VALUES(...)")` calls)
into clean JSON for the new Flutter "Panorama" app.

Also parses Fragment_Nutrition.java's 12 month arrays (mealSuggestionsPt*)
to build a day-of-month -> {breakfast, lunch, dinner} meal-plan mapping.

Outputs:
  assets/data/recipes.json    - {id, title, content, month, slot} records
  assets/data/meal_plan.json  - month -> [ {day, breakfast, lunch, dinner} ]

Read-only against the Newstart source tree; only writes into Panorama's
assets/data/ folder.
"""
import json
import re
from pathlib import Path

NEWSTART_DATA = Path(r"C:\Users\apspo\Igreja\Newstart\app\src\main\java\newstart\data")
NEWSTART_FRAGMENTS = Path(r"C:\Users\apspo\Igreja\Newstart\app\src\main\java\newstart\fragments")
MEAL_CONSTANTS_FILE = NEWSTART_DATA / "MealConstants.java"
DB_HELPER_FILE = NEWSTART_DATA / "DatabaseHelper.java"
FRAGMENT_NUTRITION_FILE = NEWSTART_FRAGMENTS / "Fragment_Nutrition.java"

OUT_DIR = Path(r"C:\Users\apspo\Igreja\Panorama\assets\data")
RECIPES_OUT = OUT_DIR / "recipes.json"
MEAL_PLAN_OUT = OUT_DIR / "meal_plan.json"

MONTH_ARRAY_TO_NUM = {
    "mealSuggestionsPtJan": 1, "mealSuggestionsPtFeb": 2, "mealSuggestionsPtMar": 3,
    "mealSuggestionsPtApr": 4, "mealSuggestionsPtMay": 5, "mealSuggestionsPtJun": 6,
    "mealSuggestionsPtJul": 7, "mealSuggestionsPtAgo": 8, "mealSuggestionsPtSet": 9,
    "mealSuggestionsPtOut": 10, "mealSuggestionsPtNov": 11, "mealSuggestionsPtDez": 12,
}
SLOT_NAMES = ["breakfast", "lunch", "dinner"]


def unescape_java_sql_string(raw: str) -> str:
    """Undo Java string-literal escaping (\\" -> ") and SQL single-quote
    escaping ('' -> ') as used by the original execSQL string building,
    plus a literal backslash-n escape (\\n -> real newline) found in one
    entry (PT_FEB_MASSA_ALHO_OLEO_VEG)."""
    s = raw
    s = s.replace('\\"', '"')
    s = s.replace("''", "'")
    s = s.replace('\\n', '\n')
    s = s.replace('\\\\', '\\')
    return s


# ---------------------------------------------------------------------------
# Part 1: MealConstants.java -> {identifier: title}
# ---------------------------------------------------------------------------
def parse_meal_constants(text: str) -> dict:
    pattern = re.compile(
        r'public\s+static\s+final\s+String\s+(\w+)\s*=\s*"((?:[^"\\]|\\.)*)"\s*;'
    )
    result = {}
    for m in pattern.finditer(text):
        ident, value = m.group(1), m.group(2)
        result[ident] = unescape_java_sql_string(value)
    return result


# ---------------------------------------------------------------------------
# Part 2: DatabaseHelper.java -> {identifier_or_literal_title: html_content}
# ---------------------------------------------------------------------------
def join_continuation_lines(lines):
    """Join Java string-literal concatenations split across physical lines,
    e.g. a line ending in `" +` followed by a line starting with `"`.
    There is exactly one such case in the source (PT_FEB_MASSA_ALHO_OLEO_VEG)
    but this is handled generically in case of others."""
    joined = []
    i = 0
    cont_re = re.compile(r'"\s*\+\s*$')
    while i < len(lines):
        line = lines[i]
        while cont_re.search(line) and i + 1 < len(lines):
            nxt = lines[i + 1].strip()
            # remove trailing `" +` (and surrounding space) from line
            line = cont_re.sub('', line)
            # remove leading `"` from next line's stripped content
            if nxt.startswith('"'):
                nxt = nxt[1:]
            line = line + nxt
            i += 1
        joined.append(line)
        i += 1
    return joined


def extract_insert_block(full_text: str) -> str:
    start_marker = "private void insertInitialRecipes(SQLiteDatabase db) {"
    start = full_text.index(start_marker)
    # The method ends at the matching closing brace; we know from inspection
    # it ends with `db.setTransactionSuccessful();\n        } finally {`
    end_marker = "db.setTransactionSuccessful();"
    end = full_text.index(end_marker, start)
    return full_text[start:end]


def parse_local_string_vars(block: str) -> dict:
    """Collect `String varName = "....";` declarations (not db.execSQL lines)."""
    result = {}
    pattern = re.compile(
        r'^\s*String\s+(\w+)\s*=\s*"((?:[^"\\]|\\.)*)"\s*;\s*$', re.MULTILINE
    )
    for m in pattern.finditer(block):
        varname, value = m.group(1), m.group(2)
        result[varname] = unescape_java_sql_string(value)
    return result


ID_CONST_RE = re.compile(r'^"\s*\+\s*MealConstants\.(\w+)\s*\+\s*"\',\s*\'(.*)$', re.DOTALL)
# after VALUES(' has been stripped, the remaining text starts either with
#   " + MealConstants.CONST_NAME + "', '<content-or-var-ref>');");
# or with
#   Literal Title Text', '<content-or-var-ref>');");


def parse_insert_statements(block: str):
    """Returns list of dicts: {id_type: 'const'|'literal', id_key: str, content: str}"""
    lines = block.split('\n')
    lines = join_continuation_lines(lines)

    records = []
    unmatched = []
    values_marker = "VALUES('"
    end_suffix = "');\");"

    for lineno, line in enumerate(lines, start=1):
        if 'db.execSQL("INSERT OR REPLACE INTO' not in line:
            continue
        idx = line.find(values_marker)
        if idx == -1:
            unmatched.append((lineno, line[:120]))
            continue
        rest = line[idx + len(values_marker):]
        rest_stripped = rest.rstrip()
        if not rest_stripped.endswith(end_suffix):
            unmatched.append((lineno, line[:120]))
            continue
        rest_stripped = rest_stripped[: -len(end_suffix)]

        # --- Determine ID part ---
        if rest_stripped.startswith('" + MealConstants.'):
            m = re.match(r'^"\s*\+\s*MealConstants\.(\w+)\s*\+\s*"\',\s*\'(.*)$', rest_stripped, re.DOTALL)
            if not m:
                unmatched.append((lineno, line[:120]))
                continue
            id_type = "const"
            id_key = m.group(1)
            content_region = m.group(2)
        else:
            # literal title up to `', '`
            m = re.match(r"^([^']*)',\s*'(.*)$", rest_stripped, re.DOTALL)
            if not m:
                unmatched.append((lineno, line[:120]))
                continue
            id_type = "literal"
            id_key = m.group(1)
            content_region = m.group(2)

        records.append({
            "id_type": id_type,
            "id_key": id_key,
            "content_region": content_region,
            "lineno": lineno,
        })

    return records, unmatched


def resolve_content(content_region: str, local_vars: dict):
    """content_region is either raw HTML (escaped) or a variable reference
    of the form `" + varName + "`."""
    m = re.match(r'^"\s*\+\s*(\w+)\s*\+\s*"$', content_region)
    if m:
        varname = m.group(1)
        if varname in local_vars:
            return local_vars[varname], varname
        else:
            return None, varname  # unresolved variable reference
    return unescape_java_sql_string(content_region), None


# ---------------------------------------------------------------------------
# Part 3: Fragment_Nutrition.java -> month arrays (day -> [breakfast, lunch, dinner])
# ---------------------------------------------------------------------------
def parse_meal_plan(text: str):
    plan = {}  # month_num -> list of {day, breakfast, lunch, dinner} (const identifiers)
    array_re = re.compile(
        r'private\s+final\s+String\[\]\[\]\s+(mealSuggestionsPt\w+)\s*=\s*\{(.*?)\};',
        re.DOTALL,
    )
    row_re = re.compile(r'\{([^{}]*)\}')
    for arr_m in array_re.finditer(text):
        array_name = arr_m.group(1)
        body = arr_m.group(2)
        if array_name not in MONTH_ARRAY_TO_NUM:
            continue
        month_num = MONTH_ARRAY_TO_NUM[array_name]
        rows = []
        for row_m in row_re.finditer(body):
            cols_raw = row_m.group(1)
            cols = [c.strip() for c in cols_raw.split(',')]
            const_names = []
            for c in cols:
                cm = re.match(r'MealConstants\.(\w+)', c)
                const_names.append(cm.group(1) if cm else None)
            rows.append(const_names)
        plan[month_num] = rows
    return plan


def main():
    meal_constants_text = MEAL_CONSTANTS_FILE.read_text(encoding="utf-8")
    db_helper_text = DB_HELPER_FILE.read_text(encoding="utf-8")
    fragment_text = FRAGMENT_NUTRITION_FILE.read_text(encoding="utf-8")

    # --- Part A data: title constants ---
    constants_map = parse_meal_constants(meal_constants_text)
    print(f"[MealConstants] identifiers found: {len(constants_map)}")

    # --- Part B data: recipe content ---
    insert_block = extract_insert_block(db_helper_text)
    local_vars = parse_local_string_vars(insert_block)
    print(f"[DatabaseHelper] local content variables found: {len(local_vars)} -> {sorted(local_vars.keys())}")

    raw_records, unmatched = parse_insert_statements(insert_block)
    print(f"[DatabaseHelper] INSERT statements parsed: {len(raw_records)}  (unmatched lines: {len(unmatched)})")
    if unmatched:
        for ln, snippet in unmatched:
            print(f"   UNMATCHED line {ln}: {snippet}")

    # Resolve content (const-keyed and literal-title-keyed separately)
    content_by_const = {}
    content_by_literal_title = {}
    unresolved_var_refs = []
    duplicate_const_inserts = []
    anomalies = []  # e.g. stray "HTML\n" prefix

    for rec in raw_records:
        content, varref = resolve_content(rec["content_region"], local_vars)
        if content is None:
            unresolved_var_refs.append((rec["lineno"], rec["id_key"], varref))
            continue
        if content.startswith("HTML\n"):
            anomalies.append((rec["id_type"], rec["id_key"], "content starts with stray literal 'HTML\\n' prefix"))
        if rec["id_type"] == "const":
            if rec["id_key"] in content_by_const:
                duplicate_const_inserts.append(rec["id_key"])
            content_by_const[rec["id_key"]] = content
        else:
            if rec["id_key"] in content_by_literal_title:
                duplicate_const_inserts.append(rec["id_key"])
            content_by_literal_title[rec["id_key"]] = content

    print(f"[DatabaseHelper] recipes keyed by MealConstants identifier: {len(content_by_const)}")
    print(f"[DatabaseHelper] recipes keyed by literal English title (legacy/unused, not in MealConstants): {len(content_by_literal_title)}")
    if unresolved_var_refs:
        print(f"[DatabaseHelper] UNRESOLVED variable references: {unresolved_var_refs}")
    if duplicate_const_inserts:
        print(f"[DatabaseHelper] DUPLICATE INSERT keys (later overwrote earlier, matching SQLite 'INSERT OR REPLACE' semantics): {duplicate_const_inserts}")
    if anomalies:
        print(f"[DatabaseHelper] content anomalies found: {anomalies}")

    # --- Part A data: meal plan (day -> recipe const ids) ---
    meal_plan_raw = parse_meal_plan(fragment_text)
    for month_num in sorted(meal_plan_raw):
        print(f"[Fragment_Nutrition] month {month_num:02d}: {len(meal_plan_raw[month_num])} day-rows")

    # --- Join: MealConstants identifiers <-> DatabaseHelper content ---
    const_ids = set(constants_map.keys())
    content_ids = set(content_by_const.keys())

    joined_ids = const_ids & content_ids
    only_in_constants = sorted(const_ids - content_ids)
    only_in_db = sorted(content_ids - const_ids)

    print(f"\n=== JOIN SUMMARY ===")
    print(f"MealConstants identifiers total: {len(const_ids)}")
    print(f"DatabaseHelper const-keyed INSERTs total: {len(content_ids)}")
    print(f"Successfully joined: {len(joined_ids)}")
    print(f"In MealConstants but NO recipe content in DatabaseHelper ({len(only_in_constants)}):")
    for x in only_in_constants:
        print(f"   - {x}  (title: {constants_map[x]!r})")
    print(f"In DatabaseHelper (const-keyed) but NOT declared in MealConstants ({len(only_in_db)}):")
    for x in only_in_db:
        print(f"   - {x}")

    # Which identifiers are actually referenced by the meal-plan (used in the app)?
    used_ids = set()
    for rows in meal_plan_raw.values():
        for row in rows:
            for cid in row:
                if cid:
                    used_ids.add(cid)
    used_but_no_constant = sorted(used_ids - const_ids)
    used_but_no_content = sorted(used_ids - content_ids)
    print(f"\nDistinct recipe identifiers referenced by the 12 month meal-plan arrays: {len(used_ids)}")
    if used_but_no_constant:
        print(f"  Referenced in meal-plan but MISSING from MealConstants ({len(used_but_no_constant)}): {used_but_no_constant}")
    if used_but_no_content:
        print(f"  Referenced in meal-plan but MISSING recipe content in DatabaseHelper ({len(used_but_no_content)}): {used_but_no_content}")

    # slot lookup: build const_id -> slot name based on position within meal-plan rows
    slot_of_id = {}
    month_of_id = {}
    for month_num, rows in meal_plan_raw.items():
        for row in rows:
            for slot_idx, cid in enumerate(row):
                if cid:
                    slot_of_id.setdefault(cid, set()).add(SLOT_NAMES[slot_idx])
                    month_of_id.setdefault(cid, set()).add(month_num)

    # --- Build recipes.json ---
    recipe_records = []
    for ident in sorted(joined_ids):
        title = constants_map[ident]
        content = content_by_const[ident]
        slots = sorted(slot_of_id.get(ident, []))
        months = sorted(month_of_id.get(ident, []))
        recipe_records.append({
            "id": ident,
            "title": title,
            "content": content,
            "slots": slots,     # which meal slot(s) this recipe appears as (breakfast/lunch/dinner)
            "months": months,   # which month array(s) (1-12) reference this recipe
        })

    # Also include MealConstants entries that have NO db content (so Flutter side
    # knows about the gap instead of silently missing a day's meal) with content=None
    for ident in only_in_constants:
        title = constants_map[ident]
        slots = sorted(slot_of_id.get(ident, []))
        months = sorted(month_of_id.get(ident, []))
        recipe_records.append({
            "id": ident,
            "title": title,
            "content": None,
            "slots": slots,
            "months": months,
        })

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    RECIPES_OUT.write_text(
        json.dumps(recipe_records, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"\nWrote {len(recipe_records)} recipe records -> {RECIPES_OUT}")

    # --- Build meal_plan.json ---
    # month -> [ {day, breakfast, lunch, dinner} ] using recipe id references only
    meal_plan_out = {}
    for month_num in sorted(meal_plan_raw):
        rows = meal_plan_raw[month_num]
        day_list = []
        for day_idx, row in enumerate(rows, start=1):
            day_list.append({
                "day": day_idx,
                "breakfast": row[0] if len(row) > 0 else None,
                "lunch": row[1] if len(row) > 1 else None,
                "dinner": row[2] if len(row) > 2 else None,
            })
        meal_plan_out[str(month_num)] = day_list

    MEAL_PLAN_OUT.write_text(
        json.dumps(meal_plan_out, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Wrote meal plan for {len(meal_plan_out)} months -> {MEAL_PLAN_OUT}")

    # --- Report the literal-title (legacy English) recipes separately, for visibility ---
    if content_by_literal_title:
        print(f"\n=== LEGACY / ORPHANED RECIPES (literal titles, not in MealConstants, not referenced by meal-plan) ===")
        for t in sorted(content_by_literal_title):
            print(f"   - {t!r}")


if __name__ == "__main__":
    main()

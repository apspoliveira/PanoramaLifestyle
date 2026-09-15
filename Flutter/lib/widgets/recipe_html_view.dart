import 'package:flutter/material.dart';
import 'package:html/dom.dart' as dom;
import 'package:html/parser.dart' as html_parser;

/// Renders the small, fixed subset of HTML used in the recipe library
/// (h3/h4/p/ul/ol/li/b/strong/i/br) as native widgets themed to match the
/// app, instead of pulling in a full HTML-rendering package for ~10 tags.
class RecipeHtmlView extends StatelessWidget {
  const RecipeHtmlView({super.key, required this.html, this.accentColor});

  final String html;
  final Color? accentColor;

  @override
  Widget build(BuildContext context) {
    // A few source entries carry a stray leading "HTML" literal (copy-paste
    // artifact from the original Java source); drop it rather than render it.
    var source = html.trim();
    if (source.startsWith('HTML')) {
      source = source.substring(4).trimLeft();
    }

    final document = html_parser.parse(source);
    final bodyNodes = document.body?.nodes ?? const <dom.Node>[];
    final textTheme = Theme.of(context).textTheme;
    final headingStyle = textTheme.titleMedium?.copyWith(
      color: accentColor,
      fontWeight: FontWeight.bold,
    );

    final children = <Widget>[];
    for (final node in bodyNodes) {
      final widget = _blockWidget(node, textTheme, headingStyle);
      if (widget == null) continue;
      if (children.isNotEmpty) children.add(const SizedBox(height: 12));
      children.add(widget);
    }

    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: children);
  }

  Widget? _blockWidget(
    dom.Node node,
    TextTheme textTheme,
    TextStyle? headingStyle,
  ) {
    if (node is! dom.Element) {
      final text = (node.text ?? '').trim();
      return text.isEmpty ? null : Text(text, style: textTheme.bodyMedium);
    }

    switch (node.localName) {
      case 'h3':
      case 'h4':
        return Text.rich(TextSpan(children: _inlineSpans(node, headingStyle)));
      case 'p':
        return Text.rich(
          TextSpan(children: _inlineSpans(node, textTheme.bodyMedium)),
        );
      case 'ul':
        return _list(node, textTheme, ordered: false);
      case 'ol':
        return _list(node, textTheme, ordered: true);
      default:
        // Unknown/unexpected top-level element: render its text plainly
        // rather than silently dropping content.
        final text = node.text.trim();
        return text.isEmpty ? null : Text(text, style: textTheme.bodyMedium);
    }
  }

  Widget _list(
    dom.Element listEl,
    TextTheme textTheme, {
    required bool ordered,
  }) {
    final items = listEl.children.where((e) => e.localName == 'li').toList();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (var i = 0; i < items.length; i++)
          Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                  width: 24,
                  child: Text(
                    ordered ? '${i + 1}.' : '•',
                    style: textTheme.bodyMedium,
                  ),
                ),
                Expanded(
                  child: Text.rich(
                    TextSpan(
                      children: _inlineSpans(items[i], textTheme.bodyMedium),
                    ),
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }

  List<InlineSpan> _inlineSpans(dom.Element el, TextStyle? baseStyle) {
    final spans = <InlineSpan>[];
    for (final node in el.nodes) {
      _appendInline(node, baseStyle, spans);
    }
    return spans;
  }

  void _appendInline(
    dom.Node node,
    TextStyle? style,
    List<InlineSpan> spans,
  ) {
    if (node is dom.Text) {
      if (node.text.isEmpty) return;
      spans.add(TextSpan(text: node.text, style: style));
      return;
    }
    if (node is! dom.Element) return;

    switch (node.localName) {
      case 'br':
        spans.add(const TextSpan(text: '\n'));
        return;
      case 'b':
      case 'strong':
        final boldStyle = (style ?? const TextStyle()).copyWith(
          fontWeight: FontWeight.bold,
        );
        for (final child in node.nodes) {
          _appendInline(child, boldStyle, spans);
        }
        return;
      case 'i':
        final italicStyle = (style ?? const TextStyle()).copyWith(
          fontStyle: FontStyle.italic,
        );
        for (final child in node.nodes) {
          _appendInline(child, italicStyle, spans);
        }
        return;
      default:
        for (final child in node.nodes) {
          _appendInline(child, style, spans);
        }
    }
  }
}

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// A single daily-goal checkbox row, with the same haptic feedback the
/// original fragments triggered on every checkbox tap.
class GoalCheckboxTile extends StatelessWidget {
  const GoalCheckboxTile({
    super.key,
    required this.label,
    required this.value,
    required this.onChanged,
    required this.activeColor,
  });

  final String label;
  final bool value;
  final ValueChanged<bool> onChanged;
  final Color activeColor;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 4),
      child: CheckboxListTile(
        title: Text(label),
        value: value,
        activeColor: activeColor,
        onChanged: (checked) {
          HapticFeedback.selectionClick();
          onChanged(checked ?? false);
        },
      ),
    );
  }
}

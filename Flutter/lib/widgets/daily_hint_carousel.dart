import 'dart:async';

import 'package:flutter/material.dart';

/// Rotates through a list of hint strings, replacing the original
/// `TextSwitcher` + `Handler.postDelayed` loop from the Java fragments.
class DailyHintCarousel extends StatefulWidget {
  const DailyHintCarousel({
    super.key,
    required this.hints,
    this.interval = const Duration(seconds: 6),
  });

  final List<String> hints;
  final Duration interval;

  @override
  State<DailyHintCarousel> createState() => _DailyHintCarouselState();
}

class _DailyHintCarouselState extends State<DailyHintCarousel> {
  int _index = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    if (widget.hints.length > 1) {
      _timer = Timer.periodic(widget.interval, (_) {
        setState(() => _index = (_index + 1) % widget.hints.length);
      });
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.hints.isEmpty) return const SizedBox.shrink();
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: AnimatedSwitcher(
        duration: const Duration(milliseconds: 400),
        child: Text(
          widget.hints[_index],
          key: ValueKey(_index),
          style: Theme.of(context).textTheme.bodyMedium,
        ),
      ),
    );
  }
}

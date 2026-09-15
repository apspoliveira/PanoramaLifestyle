import 'dart:math';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/pillar_goal.dart';
import '../../services/prefs_service.dart';
import '../../theme/app_theme.dart';
import '../../widgets/daily_hint_carousel.dart';
import '../../widgets/goal_checkbox_tile.dart';
import '../../widgets/youtube_embed.dart';

/// Generic screen for the four checklist-style pillars (Air, Rest,
/// Temperance, Workout, Trust's checklist portion): a hint carousel, then
/// one card per goal with a checkbox and a cued video, mirroring
/// Fragment_Air/_Rest/_Temperance/_Workout/_Trust.
///
/// [extraContent] lets a specific pillar (Trust) inject something above the
/// goal list (e.g. a Bible verse card) without needing its own copy of this
/// screen.
class PillarChecklistScreen extends StatefulWidget {
  const PillarChecklistScreen({
    super.key,
    required this.config,
    this.extraContent,
  });

  final PillarChecklistConfig config;
  final Widget? extraContent;

  @override
  State<PillarChecklistScreen> createState() => _PillarChecklistScreenState();
}

class _PillarChecklistScreenState extends State<PillarChecklistScreen> {
  late final List<String> _chosenVideoIds;
  final DateTime _today = DateTime.now();

  @override
  void initState() {
    super.initState();
    final random = Random();
    _chosenVideoIds = widget.config.goals
        .map((goal) => goal.videoIds[random.nextInt(goal.videoIds.length)])
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    final prefs = context.watch<PrefsService>();
    final config = widget.config;
    final accent = config.pillar.primary;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        DailyHintCarousel(
          hints: config.hints,
          interval: config.hintInterval,
        ),
        const SizedBox(height: 16),
        if (widget.extraContent != null) ...[
          widget.extraContent!,
          const SizedBox(height: 16),
        ],
        for (var i = 0; i < config.goals.length; i++)
          Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: Card(
              clipBehavior: Clip.antiAlias,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  GoalCheckboxTile(
                    label: config.goals[i].label,
                    value: prefs.getDailyBool(
                      config.storagePillar,
                      config.goals[i].storageKey,
                      _today,
                    ),
                    activeColor: accent,
                    onChanged: (value) {
                      prefs.setDailyBool(
                        config.storagePillar,
                        config.goals[i].storageKey,
                        _today,
                        value,
                      );
                      setState(() {});
                    },
                  ),
                  Padding(
                    padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
                    child: YoutubeEmbed(
                      videoId: _chosenVideoIds[i],
                      title: config.goals[i].label,
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}

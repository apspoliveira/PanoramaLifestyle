import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../../services/prefs_service.dart';
import '../../theme/app_theme.dart';
import '../../widgets/daily_hint_carousel.dart';
import '../../widgets/goal_checkbox_tile.dart';
import '../../widgets/youtube_embed.dart';

const _hints = [
  'Beber água ajuda a manter a concentração e o foco.',
  'A água é essencial para a desintoxicação do corpo.',
  'Drink water before you feel thirsty to avoid dehydration.',
  'A água ajuda a regular a temperatura do corpo.',
  'Substitua refrigerantes por água pura e fresca.',
];

const _drinkWaterVideoIds = ['AVSNiAndIGU', 'rlFRSJYCax8'];
const _hydrotherapyVideoIds = ['HfBWUzP2tYU', 'F2hIAOfw5h8'];

/// Ports Fragment_Water: a +/- glass counter plus a hydrotherapy checkbox.
class WaterScreen extends StatefulWidget {
  const WaterScreen({super.key});

  @override
  State<WaterScreen> createState() => _WaterScreenState();
}

class _WaterScreenState extends State<WaterScreen> {
  final DateTime _today = DateTime.now();
  late final String _drinkWaterVideoId;
  late final String _hydrotherapyVideoId;

  @override
  void initState() {
    super.initState();
    final random = Random();
    _drinkWaterVideoId =
        _drinkWaterVideoIds[random.nextInt(_drinkWaterVideoIds.length)];
    _hydrotherapyVideoId =
        _hydrotherapyVideoIds[random.nextInt(_hydrotherapyVideoIds.length)];
  }

  @override
  Widget build(BuildContext context) {
    final prefs = context.watch<PrefsService>();
    const accent = Pillar.water;
    final glasses = prefs.getDailyInt('water', 'glasses', _today);
    final hydro = prefs.getDailyBool('water', 'hydro', _today);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const DailyHintCarousel(hints: _hints),
        const SizedBox(height: 16),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Text(
                  '$glasses copos',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    color: accent.primary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    IconButton.filledTonal(
                      onPressed: glasses > 0
                          ? () {
                              HapticFeedback.selectionClick();
                              prefs.setDailyInt(
                                'water',
                                'glasses',
                                _today,
                                glasses - 1,
                              );
                              setState(() {});
                            }
                          : null,
                      icon: const Icon(Icons.remove),
                    ),
                    const SizedBox(width: 24),
                    IconButton.filled(
                      onPressed: () {
                        HapticFeedback.selectionClick();
                        prefs.setDailyInt(
                          'water',
                          'glasses',
                          _today,
                          glasses + 1,
                        );
                        setState(() {});
                      },
                      icon: const Icon(Icons.add),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                YoutubeEmbed(
                  videoId: _drinkWaterVideoId,
                  title: 'Beba pelo menos 8 copos de água',
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        Card(
          clipBehavior: Clip.antiAlias,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              GoalCheckboxTile(
                label: 'HIDROTERAPIA',
                value: hydro,
                activeColor: accent.primary,
                onChanged: (value) {
                  prefs.setDailyBool('water', 'hydro', _today, value);
                  setState(() {});
                },
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
                child: YoutubeEmbed(
                  videoId: _hydrotherapyVideoId,
                  title: 'Hidroterapia',
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

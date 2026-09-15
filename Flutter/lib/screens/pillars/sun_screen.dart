import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../../services/prefs_service.dart';
import '../../theme/app_theme.dart';
import '../../widgets/daily_hint_carousel.dart';
import '../../widgets/youtube_embed.dart';

const _hints = [
  'A luz solar é a melhor fonte natural de Vitamina D.',
  '15-20 minutos de exposição solar diária são ideais.',
  'A luz do sol ajuda a regular o seu sono e o ritmo circadiano.',
  'A exposição solar melhora o humor através da serotonina.',
  'O sol da manhã é o mais seguro e benéfico.',
];

const _sunGoalMinutes = 20;

/// Ports Fragment_Sun: a +/- 5-minute sun-exposure counter against a
/// hardcoded 20-minute daily goal.
class SunScreen extends StatefulWidget {
  const SunScreen({super.key});

  @override
  State<SunScreen> createState() => _SunScreenState();
}

class _SunScreenState extends State<SunScreen> {
  final DateTime _today = DateTime.now();

  @override
  Widget build(BuildContext context) {
    final prefs = context.watch<PrefsService>();
    const accent = Pillar.sun;
    final minutes = prefs.getDailyInt('sun', 'mins', _today);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const DailyHintCarousel(hints: _hints, interval: Duration(seconds: 5)),
        const SizedBox(height: 16),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Text(
                  '$minutes minutos',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    color: accent.primary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text('Meta: $_sunGoalMinutes min'),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    IconButton.filledTonal(
                      onPressed: minutes >= 5
                          ? () {
                              HapticFeedback.selectionClick();
                              prefs.setDailyInt(
                                'sun',
                                'mins',
                                _today,
                                minutes - 5,
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
                          'sun',
                          'mins',
                          _today,
                          minutes + 5,
                        );
                        setState(() {});
                      },
                      icon: const Icon(Icons.add),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        const YoutubeEmbed(videoId: '7SRE9963F9U', title: 'Luz Solar'),
        const SizedBox(height: 16),
        const YoutubeEmbed(videoId: '6_z2iK2W-4k', title: 'Vitamina D'),
      ],
    );
  }
}

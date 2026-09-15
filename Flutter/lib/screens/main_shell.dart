import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../data/pillar_configs.dart';
import '../services/prefs_service.dart';
import '../theme/app_theme.dart';
import 'pillars/nutrition_screen.dart';
import 'pillars/pillar_checklist_screen.dart';
import 'pillars/sun_screen.dart';
import 'pillars/water_screen.dart';
import 'settings_screen.dart';

class _Destination {
  const _Destination({
    required this.pillar,
    required this.icon,
    required this.title,
    required this.builder,
  });

  final Pillar pillar;
  final IconData icon;
  final String title;
  final WidgetBuilder builder;
}

final _destinations = <_Destination>[
  _Destination(
    pillar: Pillar.nutrition,
    icon: Icons.restaurant,
    title: 'Nutrição',
    builder: (_) => const NutritionScreen(),
  ),
  _Destination(
    pillar: Pillar.workout,
    icon: Icons.fitness_center,
    title: 'Exercício',
    builder: (_) => PillarChecklistScreen(config: workoutConfig),
  ),
  _Destination(
    pillar: Pillar.water,
    icon: Icons.water_drop,
    title: 'Água Pura',
    builder: (_) => const WaterScreen(),
  ),
  _Destination(
    pillar: Pillar.sun,
    icon: Icons.wb_sunny,
    title: 'Luz Solar',
    builder: (_) => const SunScreen(),
  ),
  _Destination(
    pillar: Pillar.temperance,
    icon: Icons.balance,
    title: 'Temperança',
    builder: (_) => PillarChecklistScreen(config: temperanceConfig),
  ),
  _Destination(
    pillar: Pillar.air,
    icon: Icons.air,
    title: 'Ar Puro',
    builder: (_) => PillarChecklistScreen(config: airConfig),
  ),
  _Destination(
    pillar: Pillar.rest,
    icon: Icons.bedtime,
    title: 'Descanso',
    builder: (_) => PillarChecklistScreen(config: restConfig),
  ),
  _Destination(
    pillar: Pillar.trust,
    icon: Icons.favorite,
    title: 'Confiança',
    builder: (_) => PillarChecklistScreen(config: trustConfig),
  ),
];

/// Ports Activity_Main: a drawer with the 8 pillars + Settings, swapping the
/// body between them (replaces `FragmentManager.replace`).
class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _selectedIndex = 0;
  bool _showingSettings = false;

  void _select(int index) {
    setState(() {
      _selectedIndex = index;
      _showingSettings = false;
    });
    Navigator.of(context).pop();
  }

  void _selectSettings() {
    setState(() => _showingSettings = true);
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final prefs = context.watch<PrefsService>();
    final destination = _destinations[_selectedIndex];
    final accent = _showingSettings ? Pillar.settings.primary : destination.pillar.primary;

    return Scaffold(
      appBar: AppBar(
        title: Text(_showingSettings ? 'Ajustes' : destination.title),
        backgroundColor: accent.withValues(alpha: 0.15),
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              decoration: BoxDecoration(color: accent.withValues(alpha: 0.2)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Text(
                    prefs.userName,
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${prefs.userAge} anos | ${prefs.userWeight.toStringAsFixed(1)} kg'
                    ' | ${prefs.userHeight.toStringAsFixed(0)} cm',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
            for (var i = 0; i < _destinations.length; i++)
              ListTile(
                leading: Icon(_destinations[i].icon),
                title: Text(_destinations[i].title),
                selected: !_showingSettings && i == _selectedIndex,
                selectedColor: _destinations[i].pillar.primary,
                onTap: () => _select(i),
              ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.settings),
              title: const Text('Ajustes'),
              selected: _showingSettings,
              selectedColor: Pillar.settings.primary,
              onTap: _selectSettings,
            ),
          ],
        ),
      ),
      body: _showingSettings
          ? const SettingsScreen()
          : Builder(builder: destination.builder),
    );
  }
}

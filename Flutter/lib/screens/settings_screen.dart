import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../services/prefs_service.dart';

const _notificationLabels = {
  'nutrition': 'Nutrição',
  'workout': 'Exercício',
  'water': 'Água',
  'sun': 'Luz Solar',
  'temperance': 'Temperança',
  'air': 'Ar Puro',
  'rest': 'Descanso',
  'trust': 'Confiança',
};

/// Ports Fragment_Settings: profile form, language choice, and per-pillar
/// notification toggles. Actual daily-reminder scheduling (the original's
/// AlarmManager calls) lands in Stage 3 with `notification_service.dart` —
/// for now these toggles just persist the preference.
class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  late final TextEditingController _nameController;
  late final TextEditingController _ageController;
  late final TextEditingController _heightController;
  late final TextEditingController _weightController;

  @override
  void initState() {
    super.initState();
    final prefs = context.read<PrefsService>();
    _nameController = TextEditingController(text: prefs.userName);
    _ageController = TextEditingController(text: prefs.userAge.toString());
    _heightController = TextEditingController(
      text: prefs.userHeight.toString(),
    );
    _weightController = TextEditingController(
      text: prefs.userWeight.toString(),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _ageController.dispose();
    _heightController.dispose();
    _weightController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    final prefs = context.read<PrefsService>();
    await prefs.saveProfile(
      name: _nameController.text.trim(),
      age: int.tryParse(_ageController.text.trim()) ?? prefs.userAge,
      weight:
          double.tryParse(_weightController.text.trim().replaceAll(',', '.')) ??
          prefs.userWeight,
      height:
          double.tryParse(_heightController.text.trim().replaceAll(',', '.')) ??
          prefs.userHeight,
    );
    if (!mounted) return;
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('Definições guardadas')));
  }

  @override
  Widget build(BuildContext context) {
    final prefs = context.watch<PrefsService>();

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text('Dados Gerais', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 12),
        TextField(
          controller: _nameController,
          decoration: const InputDecoration(labelText: 'Nome'),
        ),
        const SizedBox(height: 12),
        TextField(
          controller: _ageController,
          decoration: const InputDecoration(labelText: 'Idade'),
          keyboardType: TextInputType.number,
        ),
        const SizedBox(height: 12),
        TextField(
          controller: _heightController,
          decoration: const InputDecoration(labelText: 'Altura (cm)'),
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
        ),
        const SizedBox(height: 12),
        TextField(
          controller: _weightController,
          decoration: const InputDecoration(labelText: 'Peso (kg)'),
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
        ),
        const SizedBox(height: 24),
        Text('Idioma', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          initialValue: prefs.language,
          items: const [
            DropdownMenuItem(value: 'pt', child: Text('Português')),
            DropdownMenuItem(value: 'en', child: Text('Inglês')),
          ],
          onChanged: (value) {
            if (value != null) prefs.setLanguage(value);
            setState(() {});
          },
        ),
        const SizedBox(height: 24),
        Text('Notificações', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 8),
        for (final pillar in PrefsService.notificationPillars)
          SwitchListTile(
            title: Text(_notificationLabels[pillar] ?? pillar),
            value: prefs.getNotificationEnabled(pillar),
            onChanged: (value) {
              prefs.setNotificationEnabled(pillar, value);
              setState(() {});
            },
          ),
        const SizedBox(height: 24),
        FilledButton(
          onPressed: _save,
          child: const Padding(
            padding: EdgeInsets.symmetric(vertical: 12),
            child: Text('Guardar'),
          ),
        ),
      ],
    );
  }
}

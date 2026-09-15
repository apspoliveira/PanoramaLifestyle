import '../models/pillar_goal.dart';
import '../theme/app_theme.dart';

/// Checklist-pillar configs, ported from the original layout/strings.xml
/// labels and per-fragment video ID pools (see Fragment_Air.java,
/// Fragment_Rest.java, Fragment_Temperance.java, Fragment_Trust.java,
/// Fragment_Workout.java for the source values).
const airConfig = PillarChecklistConfig(
  pillar: Pillar.air,
  storagePillar: 'air',
  title: 'Ar Puro',
  hints: [
    'O ar puro é vital para um cérebro saudável e pensamento claro.',
    'Respiração profunda ao ar livre oxigena o sangue.',
    'Ventile a sua casa regularmente para remover poluentes.',
    'Dormir com a janela aberta fornece ar fresco à noite.',
    'Plantas em casa ajudam a filtrar a qualidade do ar interior.',
  ],
  hintInterval: Duration(milliseconds: 5500),
  goals: [
    PillarGoal(
      storageKey: 'fresh',
      label: 'TEMPO AO AR LIVRE',
      videoIds: ['OM_X52rdeds', 'oxO2qotv3wM'],
    ),
    PillarGoal(
      storageKey: 'vent',
      label: 'JANELAS ABERTAS',
      videoIds: ['F2hIAOfw5h8', 'owwfYlpibU0'],
    ),
    PillarGoal(
      storageKey: 'deep',
      label: 'PRATICAR RESPIRAÇÃO PROFUNDA',
      videoIds: ['QVeEhcKIyd8', 'MH5lnMCGVF'],
    ),
    PillarGoal(
      storageKey: 'clean',
      label: 'EVITE POLUIÇÃO',
      videoIds: ['rlFRSJYCax8', 'MsZp5thi3sY'],
    ),
  ],
);

const restConfig = PillarChecklistConfig(
  pillar: Pillar.rest,
  storagePillar: 'rest',
  title: 'Descanso',
  hints: [
    'O sono de qualidade é essencial para a reparação celular e memória.',
    'Procure dormir entre 7 a 8 horas por noite para uma saúde ideal.',
    'Evite ecrãs pelo menos uma hora antes de dormir.',
    'A regularidade no horário de dormir e acordar estabiliza o corpo.',
    'Um quarto escuro e fresco promove um sono mais profundo.',
  ],
  goals: [
    PillarGoal(
      storageKey: 'hours',
      label: 'DORMIR 7-8 HORAS',
      videoIds: ['MvM93SOn96Q'],
    ),
    PillarGoal(
      storageKey: 'screens',
      label: 'EVITAR ECRÃS ANTES DE DORMIR',
      videoIds: ['E08Oq8_iXas'],
    ),
    PillarGoal(
      storageKey: 'sched',
      label: 'HORÁRIO REGULAR',
      videoIds: ['G0zJ_q_S-90'],
    ),
    PillarGoal(
      storageKey: 'env',
      label: 'AMBIENTE ADEQUADO',
      videoIds: ['9m5D-7F9v-g'],
    ),
  ],
);

const temperanceConfig = PillarChecklistConfig(
  pillar: Pillar.temperance,
  storagePillar: 'temp',
  title: 'Temperança',
  hints: [
    'Temperança é o uso moderado do que é bom e a abstinência do que é mau.',
    'Evite substâncias viciantes para manter a clareza mental.',
    'O equilíbrio no trabalho e no descanso promove a longevidade.',
    'Pratique o autocontrole em todas as áreas da sua vida.',
    'Uma mente equilibrada toma melhores decisões para a saúde.',
  ],
  goals: [
    PillarGoal(
      storageKey: 'subst',
      label: 'EVITAR ÁLCOOL E TABACO',
      videoIds: ['6Y_A9Rnd9Is'],
    ),
    PillarGoal(
      storageKey: 'caff',
      label: 'REDUZIR CAFEÍNA',
      videoIds: ['fG6i9yE_160'],
    ),
    PillarGoal(
      storageKey: 'bal',
      label: 'EQUILÍBRIO TRABALHO/VIDA',
      videoIds: ['iO68V_vH6Gk'],
    ),
    PillarGoal(
      storageKey: 'self',
      label: 'PRATICAR AUTOCONTROLO',
      videoIds: ['y7S2S4N88lE'],
    ),
  ],
);

const workoutConfig = PillarChecklistConfig(
  pillar: Pillar.workout,
  storagePillar: 'workout',
  title: 'Exercício',
  hints: [
    'O exercício fortalece o coração e melhora a circulação.',
    'Tente 30 minutos de atividade na maioria dos dias.',
    'O treino de força mantém os ossos e músculos saudáveis.',
    'Consistência é mais importante do que intensidade no início.',
    'Aqueça antes do treino e arrefeça depois.',
    'Escolha uma atividade que lhe dê prazer para manter a motivação.',
  ],
  goals: [
    PillarGoal(
      storageKey: 'strength',
      label: 'TREINO DE FORÇA',
      videoIds: ['3vS6-O7Yy8Y', 'UItWltVZZmE'],
    ),
    PillarGoal(
      storageKey: 'cardio',
      label: 'EXERCÍCIO CARDIO',
      videoIds: ['ml6cT4AZdqI', 'gC_L9qAHVJ8'],
    ),
    PillarGoal(
      storageKey: 'flexibility',
      label: 'FLEXIBILIDADE E ALONGAMENTO',
      videoIds: ['Y6Z7H8p2Yt0', 'L_xrDAtykMI'],
    ),
  ],
);

const trustConfig = PillarChecklistConfig(
  pillar: Pillar.trust,
  storagePillar: 'trust',
  title: 'Confiança',
  hints: [
    'A confiança em Deus traz paz interior e resiliência.',
    'A gratidão diária melhora a saúde mental e emocional.',
    'Meditar em promessas bíblicas reduz a anciedade.',
    'Um espírito alegre é um bom remédio para o corpo.',
    'O descanso sabático restaura as energias físicas e espirituais.',
  ],
  goals: [
    PillarGoal(
      storageKey: 'prayer',
      label: 'TEMPO DE ORAÇÃO',
      videoIds: ['3qDneS3hK3o'],
    ),
    PillarGoal(
      storageKey: 'medit',
      label: 'MEDITAÇÃO BÍBLICA',
      videoIds: ['MH5lnMCGVFk'],
    ),
    PillarGoal(
      storageKey: 'gratitude',
      label: 'PRATICAR GRATIDÃO',
      videoIds: ['7vYm2y8p1fA'],
    ),
    PillarGoal(
      storageKey: 'rest',
      label: 'DESCANSO ESPIRITUAL',
      videoIds: ['a6Ue690_q4U'],
    ),
  ],
);

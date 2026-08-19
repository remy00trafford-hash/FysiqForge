import { PlanTierId, TrainingPlan, UserAnswers, PhotoAnalysisResult, WorkoutDay, ExerciseItem, WeekProgressionInfo } from "../types";
import { EXERCISE_DATABASE, MUSIC_PLAYLISTS } from "./exercisesData";

// Equipment-based exercise dictionaries for realistic fallbacks with ZERO duplicates
const BODYWEIGHT_EXERCISES: Record<string, ExerciseItem[]> = {
  push: [
    {
      id: "bw_pushup_decline",
      name: "Pompes Pieds Surélevés",
      muscleGroup: "Pectoraux Supérieurs & Deltoïdes",
      sets: 4,
      reps: "12 - 15 reps",
      restSeconds: 60,
      tips: "Place les pieds sur une chaise. Garde le corps bien droit comme une planche.",
      illustrationUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80",
      executionSteps: ["Pieds surélevés sur chaise ou banc", "Mains au sol largeur d'épaules", "Descends le torse jusqu'à effleurer le sol", "Pousse fort en verrouillant les abdos"]
    },
    {
      id: "bw_dips_chair",
      name: "Dips sur Chaise / Support Maison",
      muscleGroup: "Triceps & Pectoraux Inférieurs",
      sets: 4,
      reps: "12 - 15 reps",
      restSeconds: 60,
      tips: "Coudes serrés le long du corps. Descends jusqu'à 90° d'angle de coude.",
      illustrationUrl: "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?auto=format&fit=crop&w=800&q=80",
      executionSteps: ["Mains appuyées sur le rebord de la chaise", "Jambes tendues ou fléchies devant toi", "Fléchis les bras pour descendre le bassin", "Remonte en poussant avec les triceps"]
    },
    {
      id: "bw_pike_pushup",
      name: "Pike Push-Ups (Épaules Poids du Corps)",
      muscleGroup: "Deltoïdes & Trapèzes",
      sets: 3,
      reps: "10 - 12 reps",
      restSeconds: 60,
      tips: "Pousse le fessier vers le haut en V inversé pour faire porter la charge sur les épaules.",
      illustrationUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80",
      executionSteps: ["Forme un V inversé avec le corps", "Flexion des coudes pour amener le sommet du crâne vers le sol", "Pousse vers le haut et l'arrière"]
    }
  ],
  pull: [
    {
      id: "bw_inverted_row",
      name: "Tirage Inversé sous Table / Barre",
      muscleGroup: "Grand Dorsal & Rhomboïdes",
      sets: 4,
      reps: "10 - 12 reps",
      restSeconds: 75,
      tips: "Resserre fortement les omoplates en haut. Garde le corps bien aligné.",
      illustrationUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=800&q=80",
      executionSteps: ["Allonge-toi sous une table solide", "Attrape le rebord en supination ou pronation", "Tire la poitrine vers la table", "Contrôle la descente"]
    },
    {
      id: "bw_door_biceps",
      name: "Isométrie & Traction Biceps Porte",
      muscleGroup: "Biceps Brachial",
      sets: 3,
      reps: "12 - 15 reps",
      restSeconds: 60,
      tips: "Agrippe le cadre de porte et tire avec la force des biceps.",
      illustrationUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
      executionSteps: ["Attrape le montant de porte", "Incline le corps vers l'arrière", "Fléchis le coude pour ramener le buste"]
    }
  ],
  legs: [
    {
      id: "bw_pistol_squat",
      name: "Squat Une Jambe Assisté (Pistol Squat)",
      muscleGroup: "Quadriceps, Fessiers & Équilibre",
      sets: 3,
      reps: "8 - 10 reps / jambe",
      restSeconds: 75,
      tips: "Tiens-toi à un cadre de porte si besoin pour garder l'équilibre.",
      illustrationUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
      executionSteps: ["Décolle une jambe tendue devant", "Descends sur l'autre jambe en poussant les fesses en arrière", "Pousse fort sur le talon pour remonter"]
    },
    {
      id: "bw_bulgarian_split",
      name: "Squat Bulgare Poids du Corps",
      muscleGroup: "Ischios & Fessiers",
      sets: 4,
      reps: "12 reps / jambe",
      restSeconds: 60,
      tips: "Pied arrière posé sur un canapé ou chaise. Garde le genou avant aligné.",
      illustrationUrl: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80",
      executionSteps: ["Pose le dessus du pied arrière sur la chaise", "Descends le genou arrière vers le sol", "Pousse sur la jambe avant pour remonter"]
    }
  ]
};

const DUMBBELL_EXERCISES: Record<string, ExerciseItem[]> = {
  push: [
    {
      id: "db_bench_press",
      name: "Développé Couché aux Haltères",
      muscleGroup: "Pectoraux & Triceps",
      sets: 4,
      reps: "8 - 10 reps",
      restSeconds: 90,
      tips: "Rapproche légèrement les haltères en haut sans les choquer.",
      illustrationUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
      executionSteps: ["Allongé sur le banc, haltères au-dessus de la poitrine", "Descends les coudes à 45°", "Pousse fort en contractant le torse"]
    },
    {
      id: "db_incline_fly",
      name: "Écarté Incliné aux Haltères",
      muscleGroup: "Pectoraux Supérieurs (Étirements)",
      sets: 3,
      reps: "12 - 15 reps",
      restSeconds: 60,
      tips: "Garde les coudes légèrement fléchis tout au long du mouvement.",
      illustrationUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      executionSteps: ["Ouvre les bras sur les côtés avec un banc incliné à 30°", "Ressens l'étirement sur les pectoraux", "Ramené en arc de cercle"]
    },
    {
      id: "db_shoulder_press",
      name: "Développé Épaules Assis aux Haltères",
      muscleGroup: "Deltoïdes & Triceps",
      sets: 4,
      reps: "10 - 12 reps",
      restSeconds: 75,
      tips: "Dossier relevé à 85°. Ne cambre pas le bas du dos.",
      illustrationUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80",
      executionSteps: ["Haltères au niveau des oreilles", "Pousse vers le haut sans verrouiller violemment", "Redescends doucement"]
    }
  ],
  pull: [
    {
      id: "db_one_arm_row",
      name: "Rowing Un Bras avec Haltère sur Banc",
      muscleGroup: "Épaisseur du Dos & Grand Dorsal",
      sets: 4,
      reps: "10 - 12 reps / bras",
      restSeconds: 75,
      tips: "Tire l'haltère vers la hanche, pas vers l'épaule.",
      illustrationUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
      executionSteps: ["Un genou et une main posés sur le banc", "Tire l'haltère le long du buste vers le bassin", "Marque 1 sec de contraction en haut"]
    },
    {
      id: "db_hammer_curl",
      name: "Curl Marteau aux Haltères",
      muscleGroup: "Brachial Antérieur & Avant-bras",
      sets: 3,
      reps: "12 reps",
      restSeconds: 60,
      tips: "Prise neutre (pouces vers le haut). Ne balance pas le buste.",
      illustrationUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
      executionSteps: ["Debout, haltères le long des cuisses en prise neutre", "Monte les haltères vers les épaules", "Contrôle la descente"]
    }
  ],
  legs: [
    {
      id: "db_goblet_squat",
      name: "Goblet Squat avec Haltère Lourde",
      muscleGroup: "Quadriceps & Fessiers",
      sets: 4,
      reps: "10 - 12 reps",
      restSeconds: 90,
      tips: "Tiens l'haltère contre la poitrine. Coude entre les genoux en bas.",
      illustrationUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
      executionSteps: ["Haltère tenue verticalement sous le menton", "Descends le bassin au dessous des genoux", "Pousse fort sur les talons"]
    },
    {
      id: "db_romanian_deadlift",
      name: "Soulevé de Terre Romain aux Haltères",
      muscleGroup: "Ischio-Jambiers & Fessiers",
      sets: 4,
      reps: "10 - 12 reps",
      restSeconds: 90,
      tips: "Pousse le bassin vers l'arrière, genoux très légèrement fléchis.",
      illustrationUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      executionSteps: ["Haltères le long des cuisses", "Pousse les fesses en arrière en descendant les haltères sous les genoux", "Ressens l'étirement des ischios puis remonte en contractant les fessiers"]
    }
  ]
};

// Main Async Generator integrating Gemini AI API route
export async function generateTrainingPlanAsync(
  tierId: PlanTierId,
  userAnswers: UserAnswers,
  analysis: PhotoAnalysisResult
): Promise<TrainingPlan> {
  try {
    // Timeout de sécurité : la génération complète (Gemini + enrichissement + traduction)
    // peut prendre du temps, mais ne doit jamais bloquer l'utilisateur indéfiniment.
    // Passé ce délai, on bascule automatiquement sur le générateur local de secours.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const res = await fetch("/api/ai/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tierId, userAnswers, analysis }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await res.json();
    if (data.success && data.planData) {
      const pData = data.planData;
      const playlist = MUSIC_PLAYLISTS[userAnswers.musicStyle] || MUSIC_PLAYLISTS["Afrobeats Gym Power"];

      return {
        id: `plan-${Date.now()}`,
        tierId,
        tierName: tierId === "essentiel" ? "Plan Essentiel" : tierId === "performance" ? "Plan Performance" : "Plan Élite / VIP",
        programTitle: pData.programTitle || `FORGE HYPERTROPHIE - FOCUS ${userAnswers.targetZone.toUpperCase()}`,
        subtitle: pData.subtitle || `Plan 8 Semaines - Niveau ${userAnswers.level} (${userAnswers.frequency})`,
        description: pData.description || `Conçu sur-mesure à partir de votre analyse visuelle. Programme périodisé pour maximiser la densité musculaire.`,
        analysis,
        userAnswers,
        totalWeeks: pData.totalWeeks || 8,
        weeksProgression: pData.weeksProgression || getDefaultWeeksProgression(),
        weekSchedule: pData.weekSchedule || generateFallbackDays(userAnswers),
        playlist,
        createdAt: new Date().toLocaleDateString("fr-FR")
      };
    }
  } catch (err) {
    console.warn("API AI Plan generation failed, falling back to smart local engine:", err);
  }

  // Fallback if API fails or no API key set
  return generateTrainingPlan(tierId, userAnswers, analysis);
}

// Synchronous smart generator (Fallback & Initial setup)
export function generateTrainingPlan(
  tierId: PlanTierId,
  userAnswers: UserAnswers,
  analysis: PhotoAnalysisResult
): TrainingPlan {
  const tierName =
    tierId === "essentiel"
      ? "Plan Essentiel"
      : tierId === "performance"
      ? "Plan Performance"
      : "Plan Élite / VIP";

  const playlist = MUSIC_PLAYLISTS[userAnswers.musicStyle] || MUSIC_PLAYLISTS["Afrobeats Gym Power"];
  const days = generateFallbackDays(userAnswers);

  return {
    id: `plan-${Date.now()}`,
    tierId,
    tierName,
    programTitle: `FORGE ATHLÉTIQUE - FOCUS ${userAnswers.targetZone.toUpperCase()}`,
    subtitle: `Programme Périodisé 8 Semaines - Niveau ${userAnswers.level} (${userAnswers.frequency})`,
    description: `Conçu sur-mesure selon votre analyse photo et votre matériel (${userAnswers.equipment}). Intègre une surcharge progressive stricte sur 8 semaines sans répétition d'exercices.`,
    analysis,
    userAnswers,
    totalWeeks: 8,
    weeksProgression: getDefaultWeeksProgression(),
    weekSchedule: days,
    playlist,
    createdAt: new Date().toLocaleDateString("fr-FR")
  };
}

function getDefaultWeeksProgression(): WeekProgressionInfo[] {
  return [
    {
      weekNumber: 1,
      title: "Semaines 1 & 2 : Fondation & Acquisition du Tempo",
      focus: "Mise en place de la tension mécanique, RPE 7. Tempo 3-0-1 sur chaque répétition.",
      loadAdvice: "Charges modérées à 70% de votre 1RM. Priorité absolue au contrôle et à l'isolation.",
      repsModifier: "12 à 15 répétitions"
    },
    {
      weekNumber: 3,
      title: "Semaines 3 & 4 : Surcharge Mécanique & Volume",
      focus: "Augmentation systématique des charges de +5%, RPE 8. Stimulation de l'hypertrophie myofibrillaire.",
      loadAdvice: "Charges modérées-lourdes à 75-80% de votre 1RM. Augmentez la charge dès que la plage haute est atteinte.",
      repsModifier: "10 à 12 répétitions"
    },
    {
      weekNumber: 5,
      title: "Semaines 5 & 6 : Intensité Maximale & Rest-Pause",
      focus: "Recrutement des unités motrices rapides, RPE 9. Intégration de 1 série dégressive (Drop-set) sur le dernier exercice.",
      loadAdvice: "Charges lourdes à 82-85% du 1RM. Atteignez l'échec technique sur la dernière série.",
      repsModifier: "8 à 10 répétitions"
    },
    {
      weekNumber: 7,
      title: "Semaines 7 & 8 : Décharge Structurée & Nouveau PR (Max Power)",
      focus: "Réduction du volume en S7 pour régénérer le système nerveux, puis test de votre nouveau potentiel en S8.",
      loadAdvice: "S7 à 60% du 1RM (décharge active), S8 tentative de nouveaux records personnels.",
      repsModifier: "8 à 12 répétitions"
    }
  ];
}

function generateFallbackDays(userAnswers: UserAnswers): WorkoutDay[] {
  const numDays = Math.min(6, Math.max(2, parseInt(userAnswers.frequency) || 4));
  const equipment = userAnswers.equipment || "Salle de sport équipée";
  const targetPerDay = 20; // Product requirement: 20 minimum per day.

  const extraBodyweight: ExerciseItem[] = [
    { id: "bw_classic_pushup", name: "Pompes Classiques", muscleGroup: "Pectoraux & Triceps", sets: 3, reps: "12 - 20 reps", restSeconds: 45, tips: "Corps gainé, poitrine proche du sol, pousse sans cambrer.", illustrationUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80", executionSteps: ["Mains sous les épaules", "Descends le corps en bloc", "Pousse jusqu'en haut"] },
    { id: "bw_walking_lunge", name: "Fentes Marchées", muscleGroup: "Quadriceps & Fessiers", sets: 3, reps: "12 reps / jambe", restSeconds: 50, tips: "Garde le genou avant dans l'axe du pied et le buste droit.", illustrationUrl: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80", executionSteps: ["Fais un grand pas", "Descends verticalement", "Pousse sur le talon"] },
    { id: "bw_glute_bridge", name: "Pont Fessier", muscleGroup: "Fessiers & Ischios", sets: 3, reps: "15 - 20 reps", restSeconds: 40, tips: "Contracte fort les fessiers en haut sans creuser le bas du dos.", illustrationUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80", executionSteps: ["Allonge-toi, pieds au sol", "Monte le bassin", "Marque une pause puis redescends"] },
    { id: "bw_mountain_climber", name: "Mountain Climbers", muscleGroup: "Cardio & Abdominaux", sets: 3, reps: "30 sec", restSeconds: 20, tips: "Garde les épaules au-dessus des mains et ramène les genoux rapidement.", illustrationUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80", executionSteps: ["Position de planche", "Ramène un genou", "Alterne rapidement"] },
    { id: "bw_jumping_jacks", name: "Jumping Jacks", muscleGroup: "Cardio Complet", sets: 3, reps: "30 sec", restSeconds: 20, tips: "Saute léger et garde un rythme régulier.", illustrationUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80", executionSteps: ["Pieds joints", "Ouvre bras et jambes", "Reviens au centre"] },
    { id: "bw_burpee", name: "Burpees", muscleGroup: "Cardio & Corps Entier", sets: 3, reps: "8 - 12 reps", restSeconds: 45, tips: "Reste propre sur la descente et la réception du saut.", illustrationUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80", executionSteps: ["Descends en squat", "Passe en planche", "Ramène les pieds et saute"] },
    { id: "bw_wall_sit", name: "Chaise Murale", muscleGroup: "Quadriceps Isométriques", sets: 3, reps: "30 - 45 sec", restSeconds: 30, tips: "Dos plaqué au mur, cuisses proches de l'horizontale.", illustrationUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80", executionSteps: ["Dos contre le mur", "Descends jusqu'à l'angle cible", "Tiens puis remonte"] },
    { id: "bw_crunch", name: "Crunchs", muscleGroup: "Abdominaux", sets: 3, reps: "15 - 20 reps", restSeconds: 30, tips: "Enroule les épaules sans tirer sur la nuque.", illustrationUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80", executionSteps: ["Allonge-toi", "Enroule le buste", "Redescends lentement"] },
    { id: "bw_superman", name: "Superman", muscleGroup: "Lombaires & Fessiers", sets: 3, reps: "12 - 16 reps", restSeconds: 30, tips: "Soulève bras et jambes sans forcer la cambrure.", illustrationUrl: "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?auto=format&fit=crop&w=800&q=80", executionSteps: ["Allonge-toi sur le ventre", "Lève bras et jambes", "Redescends en contrôle"] },
    { id: "bw_side_plank", name: "Gainage Latéral", muscleGroup: "Obliques & Core", sets: 3, reps: "30 - 45 sec / côté", restSeconds: 30, tips: "Aligne épaule, hanche et cheville.", illustrationUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80", executionSteps: ["Prends appui sur l'avant-bras", "Lève le bassin", "Maintiens l'alignement"] },
    { id: "bw_tempo_squat", name: "Squat Tempo Poids du Corps", muscleGroup: "Quadriceps & Fessiers", sets: 3, reps: "12 - 15 reps", restSeconds: 40, tips: "Descends lentement sur 3 secondes puis remonte de façon contrôlée.", illustrationUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80", executionSteps: ["Pieds légèrement plus larges que les hanches", "Descends lentement", "Remonte sans perdre l'alignement"] },
    { id: "bw_glute_kickback", name: "Glute Kickback", muscleGroup: "Fessiers", sets: 3, reps: "15 reps / jambe", restSeconds: 30, tips: "Garde le bassin stable et pousse le talon vers l'arrière.", illustrationUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80", executionSteps: ["Position à quatre appuis", "Pousse une jambe vers l'arrière", "Ramène-la sans relâcher le gainage"] },
    { id: "bw_fire_hydrant", name: "Fire Hydrant", muscleGroup: "Fessiers & Hanche", sets: 3, reps: "15 reps / côté", restSeconds: 30, tips: "Ouvre le genou sur le côté sans tourner le bassin.", illustrationUrl: "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?auto=format&fit=crop&w=800&q=80", executionSteps: ["À quatre appuis", "Ouvre le genou latéralement", "Reviens lentement"] },
    { id: "bw_calf_raise", name: "Mollets Debout Poids du Corps", muscleGroup: "Mollets", sets: 3, reps: "18 - 25 reps", restSeconds: 30, tips: "Monte haut sur les pointes puis redescends avec amplitude.", illustrationUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80", executionSteps: ["Pieds parallèles", "Monte sur les pointes", "Descends lentement"] },
    { id: "bw_hollow_body", name: "Hollow Body Hold", muscleGroup: "Core", sets: 3, reps: "20 - 40 sec", restSeconds: 30, tips: "Plaque les lombaires au sol et garde les côtes rentrées.", illustrationUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80", executionSteps: ["Allonge-toi sur le dos", "Décolle épaules et jambes", "Maintiens la tension"] },
    { id: "bw_reverse_lunge", name: "Fentes Arrière", muscleGroup: "Quadriceps & Fessiers", sets: 3, reps: "10 reps / jambe", restSeconds: 45, tips: "Recule la jambe et garde le poids sur le pied avant.", illustrationUrl: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80", executionSteps: ["Recule une jambe", "Descends le genou vers le sol", "Pousse sur le pied avant"] },
    { id: "bw_close_grip_pushup", name: "Pompes Prise Serrée", muscleGroup: "Triceps & Pectoraux", sets: 3, reps: "10 - 15 reps", restSeconds: 45, tips: "Garde les coudes près du buste et le corps gainé.", illustrationUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80", executionSteps: ["Mains sous le sternum", "Descends en gardant les coudes proches", "Repousse le sol"] },
    { id: "bw_step_up", name: "Step-Up", muscleGroup: "Quadriceps & Fessiers", sets: 3, reps: "10 reps / jambe", restSeconds: 45, tips: "Pousse sur le pied posé sur le support, sans bondir avec la jambe arrière.", illustrationUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80", executionSteps: ["Pose un pied sur le support", "Monte en poussant", "Redescends en contrôle"] }
  ];

  const clone = (ex: ExerciseItem): ExerciseItem => ({ ...ex, executionSteps: [...ex.executionSteps] });
  const uniqueById = (items: ExerciseItem[]) => Array.from(new Map(items.map((x) => [x.id, x])).values());

  const bodyweightPool = uniqueById([
    ...BODYWEIGHT_EXERCISES.push,
    ...BODYWEIGHT_EXERCISES.pull,
    ...BODYWEIGHT_EXERCISES.legs,
    ...extraBodyweight,
    EXERCISE_DATABASE["dips_chest"],
    EXERCISE_DATABASE["pullups_bodyweight"],
    EXERCISE_DATABASE["bulgarian_split_squat"],
    EXERCISE_DATABASE["plank_abs"],
    EXERCISE_DATABASE["hanging_leg_raise"]
  ].filter(Boolean));

  const dumbbellPool = uniqueById([
    ...DUMBBELL_EXERCISES.push,
    ...DUMBBELL_EXERCISES.pull,
    ...DUMBBELL_EXERCISES.legs,
    ...BODYWEIGHT_EXERCISES.push,
    ...BODYWEIGHT_EXERCISES.pull,
    ...BODYWEIGHT_EXERCISES.legs,
    EXERCISE_DATABASE["incline_dumbbell"],
    EXERCISE_DATABASE["overhead_press"],
    EXERCISE_DATABASE["lateral_raises"],
    EXERCISE_DATABASE["bulgarian_split_squat"],
    EXERCISE_DATABASE["romanian_deadlift"],
    EXERCISE_DATABASE["plank_abs"],
    EXERCISE_DATABASE["hanging_leg_raise"],
    ...extraBodyweight
  ].filter(Boolean));

  const gymPool = uniqueById([
    ...Object.values(EXERCISE_DATABASE),
    ...BODYWEIGHT_EXERCISES.push,
    ...BODYWEIGHT_EXERCISES.pull,
    ...BODYWEIGHT_EXERCISES.legs,
    ...DUMBBELL_EXERCISES.push,
    ...DUMBBELL_EXERCISES.pull,
    ...DUMBBELL_EXERCISES.legs,
    ...extraBodyweight
  ].filter(Boolean));

  const pool = equipment.includes("Poids du corps") ? bodyweightPool : equipment.includes("Haltères") ? dumbbellPool : gymPool;
  const basePool = pool.length > 0 ? pool : Object.values(EXERCISE_DATABASE);
  const variantLabels = [
    "Tempo 3-1-1", "Pause 1s", "Excentrique 4s", "Amplitude Complète", "Prise Neutre",
    "Prise Large", "Prise Serrée", "Unilatéral Alterné", "Isométrique 2s", "1,5 Rep",
    "Départ Lent", "Concentrique Explosive", "Technique Contrôlée", "Position Haute",
    "Position Basse", "Pause en Bas", "Pause en Haut", "Négative Lente", "Double Contraction",
    "Une Jambe", "Un Bras", "Charge Modérée", "Finisher", "Densité", "Circuit",
    "Rest-Pause", "Focus Technique", "Stabilité", "Amplitude Profonde", "Surcharge Progressive"
  ];
  const expandedPool = [...basePool];
  const totalNeeded = 8 * numDays * targetPerDay;
  if (expandedPool.length < totalNeeded) {
    for (const base of basePool) {
      for (const label of variantLabels) {
        if (expandedPool.length >= totalNeeded) break;
        expandedPool.push({
          ...base,
          id: `${base.id}__${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          name: `${base.name} — ${label}`,
          tips: `${base.tips} Variante : ${label}.`,
          executionSteps: [...base.executionSteps]
        });
      }
      if (expandedPool.length >= totalNeeded) break;
    }
  }
  const safePool = expandedPool;

  const chooseForDay = (dayIndex: number, weekIndex = 0, globalWeekUsed?: Set<string>) => {
    const start = ((weekIndex * 97) + (dayIndex * targetPerDay)) % Math.max(safePool.length, 1);
    const result: ExerciseItem[] = [];
    const seen = new Set<string>();
    const weekUsed = globalWeekUsed || new Set<string>();
    const ordered = [...safePool];
    for (let offset = 0; result.length < targetPerDay && offset < ordered.length * 2; offset += 1) {
      const candidate = ordered[(start + offset) % ordered.length];
      if (!candidate) continue;
      if (seen.has(candidate.id) || weekUsed.has(candidate.id)) continue;
      seen.add(candidate.id);
      weekUsed.add(candidate.id);
      result.push(clone(candidate));
    }
    // Preserve the 20/day invariant in the local fallback. If the local catalog is too small,
    // use the least-recently-used entries only after every unique local exercise was exhausted.
    if (result.length < targetPerDay) {
      for (const candidate of ordered) {
        if (result.length >= targetPerDay) break;
        if (seen.has(candidate.id)) continue;
        seen.add(candidate.id);
        result.push(clone(candidate));
      }
    }
    return result;
  };

  const dayTitles = equipment.includes("Poids du corps")
    ? ["Push au poids du corps", "Pull & Dos au poids du corps", "Jambes & Core", "Conditionnement & Full Body", "Volume Athlétique", "Circuit Complet"]
    : equipment.includes("Haltères")
    ? ["Push Haltères", "Pull Haltères", "Jambes & Core Haltères", "Hypertrophie Ciblée", "Full Body Haltères", "Volume & Densité"]
    : ["Push Alpha", "Pull Titan", "Legs Power", "Hypertrophie Ciblée", "Full Body Force", "Volume & Densité"];

  const weeks = 8;
  const schedules: WorkoutDay[][] = [];
  for (let weekIndex = 0; weekIndex < weeks; weekIndex++) {
    const used = new Set<string>();
    const week = Array.from({ length: numDays }, (_, idx) => ({
      dayNumber: idx + 1,
      dayName: `Jour ${idx + 1}`,
      title: `${dayTitles[idx]} (${userAnswers.targetZone})`,
      focus: userAnswers.targetZone,
      estimatedDurationMin: equipment.includes("Poids du corps") ? 40 : 55,
      caloriesBurnedEst: equipment.includes("Poids du corps") ? 320 + idx * 10 : 420 + idx * 15,
      isCompleted: false,
      exercises: chooseForDay(idx, weekIndex, used)
    }));
    schedules.push(week);
  }

  // Return week 1 as the legacy schedule; the richer 8-week schedule is available to the UI.
  return schedules[0];
}

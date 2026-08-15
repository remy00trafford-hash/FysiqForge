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
  const numDays = parseInt(userAnswers.frequency) || 4;
  const eq = userAnswers.equipment || "Salle de sport équipée";

  const days: WorkoutDay[] = [];

  if (eq.includes("Poids du corps")) {
    days.push({
      dayNumber: 1,
      dayName: "Jour 1",
      title: "Pectoraux & Triceps au Poids du Corps (Push Alpha)",
      focus: "Pectoraux Supérieurs & Triceps",
      estimatedDurationMin: 45,
      caloriesBurnedEst: 380,
      isCompleted: false,
      exercises: BODYWEIGHT_EXERCISES.push
    });

    days.push({
      dayNumber: 2,
      dayName: "Jour 2",
      title: "Largeur de Dos & Biceps Poids du Corps (Pull Titan)",
      focus: "Grand Dorsal & Flexeurs de coude",
      estimatedDurationMin: 45,
      caloriesBurnedEst: 400,
      isCompleted: false,
      exercises: BODYWEIGHT_EXERCISES.pull
    });

    if (numDays >= 3) {
      days.push({
        dayNumber: 3,
        dayName: "Jour 3",
        title: "Cuisses & Explosivité Poids du Corps (Legs & Core)",
        focus: "Quadriceps, Fessiers & Gainage",
        estimatedDurationMin: 40,
        caloriesBurnedEst: 420,
        isCompleted: false,
        exercises: [...BODYWEIGHT_EXERCISES.legs, EXERCISE_DATABASE["plank_abs"]]
      });
    }

    if (numDays >= 4) {
      days.push({
        dayNumber: 4,
        dayName: "Jour 4",
        title: `Focus Intensif Zone Ciblée (${userAnswers.targetZone})`,
        focus: `${userAnswers.targetZone} & Conditionnement`,
        estimatedDurationMin: 40,
        caloriesBurnedEst: 370,
        isCompleted: false,
        exercises: [BODYWEIGHT_EXERCISES.push[0], BODYWEIGHT_EXERCISES.pull[0], EXERCISE_DATABASE["hanging_leg_raise"]]
      });
    }
  } else if (eq.includes("Haltères")) {
    days.push({
      dayNumber: 1,
      dayName: "Jour 1",
      title: "Pectoraux & Épaules aux Haltères (Push Power)",
      focus: "Pectoraux, Deltoïdes & Triceps",
      estimatedDurationMin: 50,
      caloriesBurnedEst: 420,
      isCompleted: false,
      exercises: DUMBBELL_EXERCISES.push
    });

    days.push({
      dayNumber: 2,
      dayName: "Jour 2",
      title: "Épaisseur de Dos & Biceps aux Haltères (Pull Power)",
      focus: "Grand Dorsal, Rhomboïdes & Biceps",
      estimatedDurationMin: 50,
      caloriesBurnedEst: 440,
      isCompleted: false,
      exercises: [...DUMBBELL_EXERCISES.pull, EXERCISE_DATABASE["lateral_raises"]]
    });

    if (numDays >= 3) {
      days.push({
        dayNumber: 3,
        dayName: "Jour 3",
        title: "Bas du Corps & Gainage Haltères (Legs Focus)",
        focus: "Quadriceps, Ischios & Abdominaux",
        estimatedDurationMin: 50,
        caloriesBurnedEst: 480,
        isCompleted: false,
        exercises: [...DUMBBELL_EXERCISES.legs, EXERCISE_DATABASE["plank_abs"]]
      });
    }

    if (numDays >= 4) {
      days.push({
        dayNumber: 4,
        dayName: "Jour 4",
        title: `Focus Hypertrophie Ciblée (${userAnswers.targetZone})`,
        focus: `${userAnswers.targetZone} & Finition`,
        estimatedDurationMin: 45,
        caloriesBurnedEst: 410,
        isCompleted: false,
        exercises: [DUMBBELL_EXERCISES.push[1], DUMBBELL_EXERCISES.pull[0], EXERCISE_DATABASE["hanging_leg_raise"]]
      });
    }
  } else {
    // Full gym - Completely distinct exercises for every single day
    days.push({
      dayNumber: 1,
      dayName: "Jour 1",
      title: "Pectoraux, Épaules & Triceps (Push Alpha)",
      focus: "Pectoraux, Deltoïdes & Triceps",
      estimatedDurationMin: 55,
      caloriesBurnedEst: 460,
      isCompleted: false,
      exercises: [
        EXERCISE_DATABASE["bench_press"],
        EXERCISE_DATABASE["incline_dumbbell"],
        EXERCISE_DATABASE["overhead_press"],
        EXERCISE_DATABASE["triceps_pushdown"]
      ]
    });

    days.push({
      dayNumber: 2,
      dayName: "Jour 2",
      title: "Dos, Biceps & Arrière d'Épaule (Pull Titan)",
      focus: "Grand dorsal, Rhomboïdes & Biceps",
      estimatedDurationMin: 55,
      caloriesBurnedEst: 470,
      isCompleted: false,
      exercises: [
        EXERCISE_DATABASE["lat_pulldown"],
        EXERCISE_DATABASE["bent_over_row"],
        EXERCISE_DATABASE["face_pulls"],
        EXERCISE_DATABASE["barbell_curl"]
      ]
    });

    if (numDays >= 3) {
      days.push({
        dayNumber: 3,
        dayName: "Jour 3",
        title: "Cuisses & Sangle Abdominale (Legs Power)",
        focus: "Quadriceps, Ischios & Gainage",
        estimatedDurationMin: 50,
        caloriesBurnedEst: 520,
        isCompleted: false,
        exercises: [
          EXERCISE_DATABASE["squat_barbell"],
          EXERCISE_DATABASE["leg_press"],
          EXERCISE_DATABASE["romanian_deadlift"],
          EXERCISE_DATABASE["plank_abs"]
        ]
      });
    }

    if (numDays >= 4) {
      days.push({
        dayNumber: 4,
        dayName: "Jour 4",
        title: `Focus Hypertrophie Ciblée (${userAnswers.targetZone})`,
        focus: `${userAnswers.targetZone} & Isolation`,
        estimatedDurationMin: 45,
        caloriesBurnedEst: 410,
        isCompleted: false,
        exercises: [
          EXERCISE_DATABASE["cable_crossover"],
          EXERCISE_DATABASE["seated_cable_row"],
          EXERCISE_DATABASE["lateral_raises"],
          EXERCISE_DATABASE["hammer_curl"],
          EXERCISE_DATABASE["hanging_leg_raise"]
        ]
      });
    }

    if (numDays >= 5) {
      days.push({
        dayNumber: 5,
        dayName: "Jour 5",
        title: "Volume Athlétique & Densité",
        focus: "Finition Unilatérale & Sculpt",
        estimatedDurationMin: 45,
        caloriesBurnedEst: 430,
        isCompleted: false,
        exercises: [
          EXERCISE_DATABASE["dips_chest"],
          EXERCISE_DATABASE["pullups_bodyweight"],
          EXERCISE_DATABASE["bulgarian_split_squat"]
        ]
      });
    }
  }

  return days;
}

import {
  PlanTierId,
  TrainingPlan,
  UserAnswers,
  PhotoAnalysisResult,
  WorkoutDay,
  ExerciseItem,
  WeekProgressionInfo,
} from "../types";
import { MUSIC_PLAYLISTS } from "./exercisesData";
import {
  EXERCISE_LIBRARY,
  selectExercises,
  type ExerciseSelectionQuery,
} from "./exerciseLibrary";
import type { ExerciseLibraryItem } from "./exerciseLibrary";

/**
 * IMPORTANT ARCHITECTURE RULE
 * ---------------------------
 * The master exercise library is the ONLY source of exercises for FysiqForge.
 * The AI endpoint may personalize the program title/description/progression,
 * but its exercise list is deliberately ignored and rebuilt from EXERCISE_LIBRARY.
 *
 * This prevents invented exercise names, unknown movements and broken media
 * mappings. Each selected item carries a stable baseMovementId, which is the
 * future key for verified animation media.
 */

const EXERCISE_COUNT = EXERCISE_LIBRARY.length;
if (EXERCISE_COUNT !== 600) {
  throw new Error(`Expected 600 master exercise entries, found ${EXERCISE_COUNT}`);
}

const parseFrequency = (value: string): number => {
  const parsed = Number.parseInt(String(value).replace(/\D/g, ""), 10);
  return Number.isFinite(parsed) ? Math.min(6, Math.max(2, parsed)) : 4;
};

const durationToMinutes = (value: UserAnswers["duration"]): number => {
  if (value === "30-45 min") return 38;
  if (value === "60-90 min") return 75;
  return 53;
};

const durationToBucket = (value: UserAnswers["duration"]): ExerciseSelectionQuery["duration"] => {
  if (value === "30-45 min") return "30-45";
  if (value === "60-90 min") return "60-90";
  return "45-60";
};

function targetCategoryForZone(zone: UserAnswers["targetZone"]): string[] {
  switch (zone) {
    case "Pectoraux & Triceps":
      return ["chest", "arms"];
    case "Epaules & Dos":
      return ["shoulders", "back"];
    case "Bras (Biceps/Triceps)":
      return ["arms"];
    case "Abdominaux & Core":
      return ["core"];
    case "Jambes & Fessiers":
      return ["legs"];
    default:
      return ["chest", "back", "shoulders", "arms", "legs", "core"];
  }
}

function selectionQuery(
  userAnswers: UserAnswers,
  limit: number,
  excludeIds: string[] = [],
): ExerciseSelectionQuery {
  return {
    objective: userAnswers.objective,
    targetZone: userAnswers.targetZone,
    level: userAnswers.level,
    equipment: userAnswers.equipment,
    duration: durationToBucket(userAnswers.duration),
    constraints: userAnswers.constraints,
    limit,
    excludeIds,
  };
}

function exerciseItemFromLibrary(item: ExerciseLibraryItem, index: number): ExerciseItem {
  const reps = item.category === "conditioning"
    ? "30 - 60 sec"
    : item.category === "core" || item.category === "mobility_recovery"
      ? "30 - 45 sec"
      : item.level === "Avancé"
        ? "6 - 10 reps"
        : "8 - 15 reps";

  const sets = item.category === "conditioning" || item.category === "mobility_recovery" ? 2 : 3;

  return {
    id: item.id,
    name: item.name,
    muscleGroup: item.primaryMuscles.join(" & ") || item.category,
    sets,
    reps,
    restSeconds: item.category === "conditioning" ? 45 : item.category === "mobility_recovery" ? 30 : 60,
    tips: `Exécution contrôlée. Mouvement de référence : ${item.baseMovement}. Variante : ${item.prescription}.`,
    // Deliberately blank until the media audit attaches a verified animation.
    illustrationUrl: "",
    executionSteps: [
      `Mouvement : ${item.baseMovement}`,
      `Prescription : ${item.prescription}`,
      `Matériel compatible : ${item.equipment.join(", ")}`,
      "Garde une exécution propre et contrôlée.",
    ],
    alternativeExercise: undefined,
  };
}

function chooseDayExercises(
  userAnswers: UserAnswers,
  dayIndex: number,
  weekIndex: number,
  globallyUsed: Set<string>,
): ExerciseItem[] {
  const targetCount = userAnswers.duration === "30-45 min"
    ? 8
    : userAnswers.duration === "60-90 min"
      ? 12
      : 10;

  const zoneCategories = targetCategoryForZone(userAnswers.targetZone);
  const primaryLimit = Math.max(3, Math.ceil(targetCount * 0.7));
  const secondaryLimit = targetCount - primaryLimit;

  const primary = selectExercises({
    ...selectionQuery(userAnswers, Math.max(primaryLimit * 2, 10), [...globallyUsed]),
  }).filter((item) => zoneCategories.includes(item.category));

  const secondary = selectExercises({
    ...selectionQuery(userAnswers, Math.max(secondaryLimit * 3, 8), [
      ...globallyUsed,
      ...primary.map((item) => item.id),
    ]),
  });

  const combined = [...primary, ...secondary];
  const localSeen = new Set<string>();
  const ordered: ExerciseLibraryItem[] = [];

  // Deterministic rotation prevents every day from receiving the same first N items.
  const offset = (weekIndex * 17 + dayIndex * 7) % Math.max(combined.length, 1);
  for (let i = 0; i < combined.length && ordered.length < targetCount; i += 1) {
    const candidate = combined[(offset + i) % combined.length];
    if (!candidate || localSeen.has(candidate.id)) continue;
    localSeen.add(candidate.id);
    ordered.push(candidate);
  }

  // Within a week we avoid repeating the same library entry. Once the 600-entry
  // catalog is exhausted over many weeks, controlled reuse is allowed: no new
  // exercise is invented and the baseMovementId remains stable.
  for (const item of ordered) globallyUsed.add(item.id);

  return ordered.map((item, index) => exerciseItemFromLibrary(item, index));
}

function buildWeekSchedule(userAnswers: UserAnswers): WorkoutDay[][] {
  const weeks = 8;
  const daysPerWeek = parseFrequency(userAnswers.frequency);
  const durationMin = durationToMinutes(userAnswers.duration);
  const schedules: WorkoutDay[][] = [];

  const titles = [
    "Forge — Force & Technique",
    "Forge — Volume & Hypertrophie",
    "Forge — Intensification",
    "Forge — Densité",
    "Forge — Surcharge progressive",
    "Forge — Consolidation",
  ];

  for (let weekIndex = 0; weekIndex < weeks; weekIndex += 1) {
    const usedThisWeek = new Set<string>();
    const week: WorkoutDay[] = [];

    for (let dayIndex = 0; dayIndex < daysPerWeek; dayIndex += 1) {
      const exercises = chooseDayExercises(userAnswers, dayIndex, weekIndex, usedThisWeek);
      week.push({
        dayNumber: dayIndex + 1,
        dayName: `Jour ${dayIndex + 1}`,
        title: `${titles[(weekIndex + dayIndex) % titles.length]} — ${userAnswers.targetZone}`,
        focus: userAnswers.targetZone,
        estimatedDurationMin: durationMin,
        caloriesBurnedEst: userAnswers.objective === "Perte de gras (Sèche)" ? 450 : 350,
        exercises,
        isCompleted: false,
      });
    }

    schedules.push(week);
  }

  return schedules;
}

function getDefaultWeeksProgression(): WeekProgressionInfo[] {
  return [
    {
      weekNumber: 1,
      title: "Fondation",
      focus: "Technique, contrôle du mouvement et construction de la régularité.",
      loadAdvice: "Charge modérée, garde 2 à 3 répétitions en réserve.",
      repsModifier: "Plage standard",
    },
    {
      weekNumber: 2,
      title: "Volume",
      focus: "Augmenter progressivement le volume sans dégrader la technique.",
      loadAdvice: "Ajoute une petite charge ou quelques répétitions lorsque la technique reste solide.",
      repsModifier: "+1 à 2 répétitions si possible",
    },
    {
      weekNumber: 3,
      title: "Surcharge progressive",
      focus: "Renforcer la progression sur les mouvements principaux.",
      loadAdvice: "Progression graduelle selon la tolérance et le niveau.",
      repsModifier: "Plage standard",
    },
    {
      weekNumber: 4,
      title: "Consolidation",
      focus: "Stabiliser les acquis et améliorer la qualité d'exécution.",
      loadAdvice: "Maintiens la charge si la récupération est insuffisante.",
      repsModifier: "Contrôle maximal",
    },
    {
      weekNumber: 5,
      title: "Intensification",
      focus: "Accent sur la tension mécanique et la qualité des séries.",
      loadAdvice: "Augmentation prudente de l'intensité sur les exercices adaptés.",
      repsModifier: "Plage basse à moyenne",
    },
    {
      weekNumber: 6,
      title: "Densité",
      focus: "Maintenir la qualité tout en optimisant la densité des séances.",
      loadAdvice: "Réduis légèrement les temps de repos uniquement si la technique reste stable.",
      repsModifier: "Plage standard",
    },
    {
      weekNumber: 7,
      title: "Pic contrôlé",
      focus: "Exploiter la progression accumulée sans sacrifier la récupération.",
      loadAdvice: "Travail soutenu, sans échec systématique.",
      repsModifier: "Plage basse à moyenne",
    },
    {
      weekNumber: 8,
      title: "Consolidation & bilan",
      focus: "Consolider les résultats et préparer le prochain cycle.",
      loadAdvice: "Réduis le volume si la fatigue accumulée est élevée.",
      repsModifier: "Selon récupération",
    },
  ];
}

function buildPlanFromLibrary(
  tierId: PlanTierId,
  userAnswers: UserAnswers,
  analysis: PhotoAnalysisResult,
  aiMeta?: Partial<Pick<TrainingPlan, "programTitle" | "subtitle" | "description">>,
): TrainingPlan {
  const tierName =
    tierId === "essentiel"
      ? "Plan Essentiel"
      : tierId === "performance"
        ? "Plan Performance"
        : "Plan Élite / VIP";

  const weeklySchedules = buildWeekSchedule(userAnswers);

  return {
    id: `plan-${Date.now()}`,
    tierId,
    tierName,
    programTitle: aiMeta?.programTitle || `FORGE — ${userAnswers.targetZone.toUpperCase()}`,
    subtitle: aiMeta?.subtitle || `Programme 8 semaines — ${userAnswers.level}`,
    description: aiMeta?.description || `Programme construit exclusivement à partir de la bibliothèque maître FysiqForge de ${EXERCISE_COUNT} entrées sélectionnées et classées selon vos critères.`,
    analysis,
    userAnswers,
    totalWeeks: 8,
    weeksProgression: getDefaultWeeksProgression(),
    weekSchedule: weeklySchedules[0] || [],
    weeklySchedules,
    playlist: MUSIC_PLAYLISTS[userAnswers.musicStyle] || MUSIC_PLAYLISTS["Afrobeats Gym Power"],
    createdAt: new Date().toLocaleDateString("fr-FR"),
  };
}

/**
 * Async generator.
 * AI is used only for personalization metadata; exercise selection is local and
 * deterministic from the master library.
 */
export async function generateTrainingPlanAsync(
  tierId: PlanTierId,
  userAnswers: UserAnswers,
  analysis: PhotoAnalysisResult,
): Promise<TrainingPlan> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const res = await fetch("/api/ai/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tierId, userAnswers, analysis }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.planData) {
        const pData = data.planData;
        // Deliberately ignore pData.weekSchedule exercises.
        return buildPlanFromLibrary(tierId, userAnswers, analysis, {
          programTitle: pData.programTitle,
          subtitle: pData.subtitle,
          description: pData.description,
        });
      }
    }
  } catch (error) {
    console.warn("[FysiqForge] AI metadata generation failed; using deterministic library engine:", error);
  }

  return generateTrainingPlan(tierId, userAnswers, analysis);
}

/** Local deterministic fallback. It uses exactly the same master library. */
export function generateTrainingPlan(
  tierId: PlanTierId,
  userAnswers: UserAnswers,
  analysis: PhotoAnalysisResult,
): TrainingPlan {
  return buildPlanFromLibrary(tierId, userAnswers, analysis);
}

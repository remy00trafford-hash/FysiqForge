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

/** The master exercise library is the ONLY source of exercises. AI exercise lists are ignored. */
const EXERCISE_COUNT = EXERCISE_LIBRARY.length;
if (EXERCISE_COUNT !== 600) throw new Error(`Expected 600 master exercise entries, found ${EXERCISE_COUNT}`);

const parseFrequency = (value: string): number => {
  const parsed = Number.parseInt(String(value).replace(/\D/g, ""), 10);
  return Number.isFinite(parsed) ? Math.min(6, Math.max(2, parsed)) : 4;
};

const durationToMinutes = (value: UserAnswers["duration"]): number =>
  value === "30-45 min" ? 38 : value === "60-90 min" ? 75 : 53;

const durationToBucket = (value: UserAnswers["duration"]): ExerciseSelectionQuery["duration"] =>
  value === "30-45 min" ? "30-45" : value === "60-90 min" ? "60-90" : "45-60";

function targetCategoryForZone(zone: UserAnswers["targetZone"]): string[] {
  switch (zone) {
    case "Pectoraux & Triceps": return ["chest", "arms"];
    case "Epaules & Dos": return ["shoulders", "back"];
    case "Bras (Biceps/Triceps)": return ["arms"];
    case "Abdominaux & Core": return ["core"];
    case "Jambes & Fessiers": return ["legs"];
    default: return ["chest", "back", "shoulders", "arms", "legs", "core"];
  }
}

function selectionQuery(userAnswers: UserAnswers, limit: number, excludeIds: string[] = []): ExerciseSelectionQuery {
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

function exerciseItemFromLibrary(item: ExerciseLibraryItem): ExerciseItem {
  const reps = item.category === "conditioning"
    ? "30 - 60 sec"
    : item.category === "core" || item.category === "mobility_recovery"
      ? "30 - 45 sec"
      : item.level === "Avancé" ? "6 - 10 reps" : "8 - 15 reps";
  const sets = item.category === "conditioning" || item.category === "mobility_recovery" ? 2 : 3;

  return {
    id: item.id,
    baseMovementId: item.baseMovementId,
    name: item.name,
    muscleGroup: item.primaryMuscles.join(" & ") || item.category,
    sets,
    reps,
    restSeconds: item.category === "conditioning" ? 45 : item.category === "mobility_recovery" ? 30 : 60,
    tips: `Exécution contrôlée. Mouvement de référence : ${item.baseMovement}. Variante : ${item.prescription}.`,
    illustrationUrl: "",
    executionSteps: [
      `Mouvement : ${item.baseMovement}`,
      `Prescription : ${item.prescription}`,
      `Matériel compatible : ${item.equipmentTags.join(", ")}`,
      "Garde une exécution propre et contrôlée.",
    ],
  };
}

function chooseDayExercises(userAnswers: UserAnswers, dayIndex: number, weekIndex: number, used: Set<string>): ExerciseItem[] {
  const targetCount = userAnswers.duration === "30-45 min" ? 8 : userAnswers.duration === "60-90 min" ? 12 : 10;
  const categories = targetCategoryForZone(userAnswers.targetZone);
  const primaryLimit = Math.max(3, Math.ceil(targetCount * 0.7));

  const primary = selectExercises(selectionQuery(userAnswers, Math.max(primaryLimit * 2, 10), [...used]))
    .filter((item) => categories.includes(item.category));
  const secondary = selectExercises(selectionQuery(userAnswers, Math.max((targetCount - primaryLimit) * 3, 8), [
    ...used,
    ...primary.map((item) => item.id),
  ]));

  const combined = [...primary, ...secondary];
  const ordered: ExerciseLibraryItem[] = [];
  const seen = new Set<string>();
  const offset = (weekIndex * 17 + dayIndex * 7) % Math.max(combined.length, 1);

  for (let i = 0; i < combined.length && ordered.length < targetCount; i += 1) {
    const item = combined[(offset + i) % combined.length];
    if (!item || seen.has(item.id)) continue;
    seen.add(item.id);
    ordered.push(item);
  }
  ordered.forEach((item) => used.add(item.id));
  return ordered.map(exerciseItemFromLibrary);
}

function buildWeekSchedule(userAnswers: UserAnswers): WorkoutDay[][] {
  const daysPerWeek = parseFrequency(userAnswers.frequency);
  const durationMin = durationToMinutes(userAnswers.duration);
  const schedules: WorkoutDay[][] = [];
  const titles = ["Forge — Force & Technique", "Forge — Volume & Hypertrophie", "Forge — Intensification", "Forge — Densité", "Forge — Surcharge progressive", "Forge — Consolidation"];

  for (let weekIndex = 0; weekIndex < 8; weekIndex += 1) {
    const used = new Set<string>();
    const week: WorkoutDay[] = [];
    for (let dayIndex = 0; dayIndex < daysPerWeek; dayIndex += 1) {
      week.push({
        dayNumber: dayIndex + 1,
        dayName: `Jour ${dayIndex + 1}`,
        title: `${titles[(weekIndex + dayIndex) % titles.length]} — ${userAnswers.targetZone}`,
        focus: userAnswers.targetZone,
        estimatedDurationMin: durationMin,
        caloriesBurnedEst: userAnswers.objective === "Perte de gras (Sèche)" ? 450 : 350,
        exercises: chooseDayExercises(userAnswers, dayIndex, weekIndex, used),
        isCompleted: false,
      });
    }
    schedules.push(week);
  }
  return schedules;
}

function getDefaultWeeksProgression(): WeekProgressionInfo[] {
  return [
    { weekNumber: 1, title: "Fondation", focus: "Technique et contrôle du mouvement.", loadAdvice: "Charge modérée, 2 à 3 répétitions en réserve.", repsModifier: "Plage standard" },
    { weekNumber: 2, title: "Volume", focus: "Augmentation progressive du volume.", loadAdvice: "Ajoute des répétitions ou une petite charge si la technique reste solide.", repsModifier: "+1 à 2 répétitions si possible" },
    { weekNumber: 3, title: "Surcharge progressive", focus: "Progression sur les mouvements principaux.", loadAdvice: "Progression graduelle selon la récupération.", repsModifier: "Plage standard" },
    { weekNumber: 4, title: "Consolidation", focus: "Stabilisation des acquis.", loadAdvice: "Maintiens la charge si la récupération est insuffisante.", repsModifier: "Contrôle maximal" },
    { weekNumber: 5, title: "Intensification", focus: "Accent sur la tension mécanique.", loadAdvice: "Augmentation prudente de l'intensité.", repsModifier: "Plage basse à moyenne" },
    { weekNumber: 6, title: "Densité", focus: "Optimisation de la densité sans dégrader la technique.", loadAdvice: "Réduis légèrement les repos seulement si la technique reste stable.", repsModifier: "Plage standard" },
    { weekNumber: 7, title: "Pic contrôlé", focus: "Exploiter la progression sans sacrifier la récupération.", loadAdvice: "Travail soutenu, sans échec systématique.", repsModifier: "Plage basse à moyenne" },
    { weekNumber: 8, title: "Consolidation & bilan", focus: "Consolider les résultats et préparer le prochain cycle.", loadAdvice: "Réduis le volume si la fatigue accumulée est élevée.", repsModifier: "Selon récupération" },
  ];
}

function buildPlanFromLibrary(tierId: PlanTierId, userAnswers: UserAnswers, analysis: PhotoAnalysisResult, aiMeta?: Partial<Pick<TrainingPlan, "programTitle" | "subtitle" | "description">>): TrainingPlan {
  const tierName = tierId === "essentiel" ? "Plan Essentiel" : tierId === "performance" ? "Plan Performance" : "Plan Élite / VIP";
  const weeklySchedules = buildWeekSchedule(userAnswers);
  return {
    id: `plan-${Date.now()}`,
    tierId,
    tierName,
    programTitle: aiMeta?.programTitle || `FORGE — ${userAnswers.targetZone.toUpperCase()}`,
    subtitle: aiMeta?.subtitle || `Programme 8 semaines — ${userAnswers.level}`,
    description: aiMeta?.description || `Programme construit exclusivement à partir de la bibliothèque maître FysiqForge de ${EXERCISE_COUNT} entrées.`,
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

/** AI supplies only plan copy; exercises always come from EXERCISE_LIBRARY. */
export async function generateTrainingPlanAsync(tierId: PlanTierId, userAnswers: UserAnswers, analysis: PhotoAnalysisResult): Promise<TrainingPlan> {
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

export function generateTrainingPlan(tierId: PlanTierId, userAnswers: UserAnswers, analysis: PhotoAnalysisResult): TrainingPlan {
  return buildPlanFromLibrary(tierId, userAnswers, analysis);
}

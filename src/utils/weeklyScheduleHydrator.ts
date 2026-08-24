import { ExerciseItem, TrainingPlan, UserAnswers, WorkoutDay } from "../types";
import { translateExerciseName } from "./translator";
import { loadExerciseGifDataset } from "../data/exerciseGifResolver";

function stableScore(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function norm(v: string) {
  return v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export async function hydrateWeeklySchedules(plan: TrainingPlan, answers: UserAnswers): Promise<TrainingPlan> {
  const weeks = Math.max(1, plan.totalWeeks || 8);
  const days = Math.min(6, Math.max(2, parseInt(String(answers.frequency || "4").replace(/\D/g, ""), 10) || 4));
  const response = await fetch(`/api/exercises?equipment=${encodeURIComponent(answers.equipment || "")}&limit=2000`);
  if (!response.ok) return plan;

  const data = await response.json();
  const catalog = Array.isArray(data.exercises) ? data.exercises : [];
  const pool = Array.from(
    new Map(
      catalog
        .filter((x: any) => x?.id && x?.name && x?.illustrationUrl)
        .map((x: any) => [x.id, x])
    ).values()
  );

  const required = weeks * days * 20;
  if (pool.length < required) {
    console.warn(`[FysiqForge] Catalogue insuffisant: ${pool.length} exercices uniques pour ${required} requis.`);
    return plan;
  }

  // Charge une seule fois la base GIF et construit un index exact par id/nom.
  // Aucun fuzzy match : un GIF n'est attribué que s'il correspond réellement à l'exercice.
  let gifByKey = new Map<string, string>();
  try {
    const gifDataset = await loadExerciseGifDataset();
    gifDataset.forEach((g: any) => {
      const url = String(g.gifUrl || "");
      if (!url) return;
      if (g.id) gifByKey.set(`id:${norm(String(g.id))}`, url);
      if (g.slug) gifByKey.set(`id:${norm(String(g.slug))}`, url);
      if (g.name) gifByKey.set(`name:${norm(String(g.name))}`, url);
    });
  } catch (e) {
    console.warn("[FysiqForge] GIF dataset indisponible, conservation des illustrations du catalogue.", e);
  }

  const findExactGif = (x: any): string | undefined =>
    gifByKey.get(`id:${norm(String(x.id))}`) || gifByKey.get(`name:${norm(String(x.name))}`);

  const sortedPool = [...pool].sort((a: any, b: any) => {
    const scoreA = stableScore(`${plan.id}:${a.id}:${answers.targetZone}`);
    const scoreB = stableScore(`${plan.id}:${b.id}:${answers.targetZone}`);
    return scoreA - scoreB;
  });

  const usedIds = new Set<string>();
  const usedIllustrations = new Set<string>();
  const schedules: WorkoutDay[][] = [];

  const makeExercise = (x: any): ExerciseItem => ({
    id: x.id,
    name: translateExerciseName(x.name, "FR"),
    muscleGroup: x.muscleGroup || "Musculation",
    sets: Number.isFinite(Number(x.sets)) ? Number(x.sets) : 3,
    reps: x.reps || (/plank|hold|stretch|wall sit|isometric|gainage/i.test(x.name) ? "30 - 45 sec" : "8 - 15 reps"),
    restSeconds: Number.isFinite(Number(x.restSeconds)) ? Number(x.restSeconds) : 60,
    tips: x.tips || x.executionSteps?.[0] || "Garde une exécution contrôlée et propre.",
    // GIF exact prioritaire ; illustration du catalogue seulement en secours.
    illustrationUrl: findExactGif(x) || x.illustrationUrl,
    executionSteps: Array.isArray(x.executionSteps) && x.executionSteps.length
      ? [...x.executionSteps]
      : [
          "Position de départ correcte",
          "Effectue le mouvement de façon contrôlée",
          "Reviens à la position de départ"
        ],
    alternativeExercise: x.alternativeExercise
  });

  for (let w = 0; w < weeks; w += 1) {
    const week: WorkoutDay[] = [];

    for (let d = 0; d < days; d += 1) {
      const exercises: ExerciseItem[] = [];
      const start = (w * days * 20 + d * 20) % sortedPool.length;

      for (let i = 0; i < sortedPool.length && exercises.length < 20; i += 1) {
        const candidate = sortedPool[(start + i) % sortedPool.length];
        const illustration = String(findExactGif(candidate) || candidate.illustrationUrl || "");
        if (usedIds.has(candidate.id) || usedIllustrations.has(illustration)) continue;
        usedIds.add(candidate.id);
        usedIllustrations.add(illustration);
        exercises.push(makeExercise(candidate));
      }

      for (let i = 0; i < sortedPool.length && exercises.length < 20; i += 1) {
        const candidate = sortedPool[(start + i) % sortedPool.length];
        if (usedIds.has(candidate.id)) continue;
        usedIds.add(candidate.id);
        exercises.push(makeExercise(candidate));
      }

      if (exercises.length !== 20) {
        console.warn(`[FysiqForge] Impossible de produire 20 exercices uniques pour S${w + 1} J${d + 1}.`);
        return plan;
      }

      const template = plan.weeklySchedules?.[w]?.[d] || plan.weekSchedule?.[d] || plan.weekSchedule?.[0];
      week.push({
        ...(template || {}),
        dayNumber: d + 1,
        dayName: template?.dayName || `Jour ${d + 1}`,
        title: template?.title || `Séance ${d + 1}`,
        focus: template?.focus || answers.targetZone || "Corps entier",
        exercises
      });
    }

    schedules.push(week);
  }

  return {
    ...plan,
    weeklySchedules: schedules,
    weekSchedule: schedules[0]
  } as TrainingPlan;
}

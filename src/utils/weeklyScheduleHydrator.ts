import { ExerciseItem, TrainingPlan, UserAnswers, WorkoutDay } from "../types";
import { translateExerciseName } from "./translator";

export async function hydrateWeeklySchedules(plan: TrainingPlan, answers: UserAnswers): Promise<TrainingPlan> {
  const weeks = plan.totalWeeks || 8;
  const days = Math.min(6, Math.max(2, parseInt(String(answers.frequency || "4").replace(/\D/g, ""), 10) || 4));
  const response = await fetch(`/api/exercises?equipment=${encodeURIComponent(answers.equipment || "")}&limit=1000`);
  if (!response.ok) return plan;
  const data = await response.json();
  const catalog = Array.isArray(data.exercises) ? data.exercises : [];
  const pool = Array.from(new Map(catalog.filter((x: any) => x?.id && x?.name && x?.illustrationUrl).map((x: any) => [x.id, x])).values());
  const required = weeks * days * 20;
  if (pool.length < required) return plan;
  pool.sort((a: any, b: any) => String(a.id).localeCompare(String(b.id)));

  const used = new Set<string>();
  const schedules: WorkoutDay[][] = [];
  const makeExercise = (x: any): ExerciseItem => ({
    id: x.id,
    name: translateExerciseName(x.name, "FR"),
    muscleGroup: x.muscleGroup || "Musculation",
    sets: 3,
    reps: /plank|hold|stretch|wall sit|isometric|gainage/i.test(x.name) ? "30 - 45 sec" : "8 - 15 reps",
    restSeconds: 60,
    tips: x.executionSteps?.[0] || "Garde une exécution contrôlée et propre.",
    illustrationUrl: x.illustrationUrl,
    executionSteps: Array.isArray(x.executionSteps) && x.executionSteps.length ? [...x.executionSteps] : ["Position de départ correcte", "Effectue le mouvement de façon contrôlée", "Reviens à la position de départ"]
  });

  for (let w = 0; w < weeks; w++) {
    const week: WorkoutDay[] = [];
    for (let d = 0; d < days; d++) {
      const exercises: ExerciseItem[] = [];
      const start = (w * days * 20 + d * 20) % pool.length;
      for (let i = 0; i < pool.length && exercises.length < 20; i++) {
        const candidate = pool[(start + i) % pool.length];
        if (used.has(candidate.id)) continue;
        used.add(candidate.id);
        exercises.push(makeExercise(candidate));
      }
      if (exercises.length !== 20) return plan;
      const template = plan.weeklySchedules?.[w]?.[d] || plan.weekSchedule?.[d] || plan.weekSchedule?.[0];
      week.push({ ...(template || {}), dayNumber: d + 1, dayName: template?.dayName || `Jour ${d + 1}`, title: template?.title || `Séance ${d + 1}`, focus: template?.focus || answers.targetZone || "Corps entier", exercises });
    }
    schedules.push(week);
  }
  return { ...plan, weeklySchedules: schedules, weekSchedule: schedules[0] } as TrainingPlan;
}

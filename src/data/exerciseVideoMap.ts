/**
 * Exact Vital video mappings only.
 *
 * Never add a mapping here unless the source video performs the same exercise.
 * The local /videos paths are intentionally used as the deployment contract;
 * production can override them with VITE_FYSIQFORGE_VIDEO_* environment vars.
 */
export const EXERCISE_VIDEO_MAP: Record<string, string> = {
  romanian_deadlift: import.meta.env.VITE_FYSIQFORGE_VIDEO_0060_URL || "/videos/0060.mp4",
  db_romanian_deadlift: import.meta.env.VITE_FYSIQFORGE_VIDEO_0060_URL || "/videos/0060.mp4",
  db_goblet_squat: import.meta.env.VITE_FYSIQFORGE_VIDEO_0064_URL || "/videos/0064.mp4",
};

export const getExerciseVideoSrc = (exerciseId?: string) =>
  exerciseId ? EXERCISE_VIDEO_MAP[exerciseId] : undefined;

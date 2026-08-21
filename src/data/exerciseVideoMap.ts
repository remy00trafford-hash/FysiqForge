/**
 * Exact Vital video mappings only.
 * No generic or approximate exercise is mapped here.
 */
export const EXERCISE_VIDEO_MAP: Record<string, string> = {
  romanian_deadlift:
    import.meta.env.VITE_FYSIQFORGE_VIDEO_0060_URL ||
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3IDyz2GWmGFUQVSICaxf4dd2EuB/a985c0aa-76dd-43d2-ab42-6cfaffdcbdff.mp4",
  db_romanian_deadlift:
    import.meta.env.VITE_FYSIQFORGE_VIDEO_0060_URL ||
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3IDyz2GWmGFUQVSICaxf4dd2EuB/a985c0aa-76dd-43d2-ab42-6cfaffdcbdff.mp4",
  db_goblet_squat:
    import.meta.env.VITE_FYSIQFORGE_VIDEO_0064_URL ||
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3IDyz2GWmGFUQVSICaxf4dd2EuB/4682f1e4-2ab5-463d-b201-1ad580548518.mp4",
};

export const getExerciseVideoSrc = (exerciseId?: string) =>
  exerciseId ? EXERCISE_VIDEO_MAP[exerciseId] : undefined;

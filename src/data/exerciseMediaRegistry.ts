// FysiqForge verified exercise media registry.
// Only entries with verified movement/source/license should be promoted to production.
// Missing entries intentionally remain absent rather than receiving approximate media.

export type ExerciseMedia = {
  animationKey: string;
  type: "video";
  url: string;
  source: "Wikimedia Commons" | "Pexels" | "Pixabay";
  license: string;
  attribution?: string;
  sourcePage: string;
  visualStatus: "verified-exact" | "candidate-review";
};

export const VERIFIED_EXERCISE_MEDIA: Record<string, ExerciseMedia> = {
  bench_press: {
    animationKey: "bench_press",
    type: "video",
    url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Bench_press_-_exercise_demonstration_video.webm",
    source: "Wikimedia Commons",
    license: "CC BY 3.0",
    attribution: "FitnessScape",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Bench_press_-_exercise_demonstration_video.webm",
    visualStatus: "verified-exact",
  },
  squat: {
    animationKey: "squat",
    type: "video",
    url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Squat_-_exercise_demonstration_video.webm",
    source: "Wikimedia Commons",
    license: "CC BY 3.0",
    attribution: "FitnessScape",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Squat_-_exercise_demonstration_video.webm",
    visualStatus: "verified-exact",
  },
  deadlift: {
    animationKey: "deadlift",
    type: "video",
    url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Deadlift_-_exercise_demonstration_video.webm",
    source: "Wikimedia Commons",
    license: "CC BY 3.0",
    attribution: "FitnessScape",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Deadlift_-_exercise_demonstration_video.webm",
    visualStatus: "verified-exact",
  },
  shoulder_press: {
    animationKey: "shoulder_press",
    type: "video",
    url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Shoulder_press_-_exercise_demonstration_video.webm",
    source: "Wikimedia Commons",
    license: "CC BY 3.0",
    attribution: "FitnessScape",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Shoulder_press_-_exercise_demonstration_video.webm",
    visualStatus: "verified-exact",
  },
};

export const getVerifiedExerciseMedia = (animationKey: string) =>
  VERIFIED_EXERCISE_MEDIA[animationKey] ?? null;

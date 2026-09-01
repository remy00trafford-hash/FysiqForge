/**
 * FysiqForge exercise media registry.
 *
 * Only media with a source-level license we can verify is admitted here.
 * Pexels currently allows free commercial use of photos/videos under its
 * license, but third-party marks/likeness rights still need to be respected.
 *
 * `visualStatus` is deliberately separate from `licenseStatus`: a source can
 * be legally usable while still requiring a visual form check before mapping.
 */
export type MediaType = "video" | "gif";
export type LicenseStatus = "verified-commercial";
export type VisualStatus = "visual-review-required";

export interface ExerciseMediaRecord {
  animationKey: string;
  exerciseName: string;
  mediaType: MediaType;
  source: "Pexels" | "Wikimedia Commons";
  sourcePage: string;
  license: LicenseStatus;
  visualStatus: VisualStatus;
  hosting: "download-and-host";
  notes?: string;
}

export const EXERCISE_MEDIA_REGISTRY: ExerciseMediaRecord[] = [
  {
    animationKey: "barbell_bench_press",
    exerciseName: "Barbell Bench Press",
    mediaType: "video",
    source: "Pexels",
    sourcePage: "https://www.pexels.com/video/a-person-doing-bench-press-workout-5320007/",
    license: "verified-commercial",
    visualStatus: "visual-review-required",
    hosting: "download-and-host",
  },
  {
    animationKey: "dumbbell_bench_press",
    exerciseName: "Dumbbell Bench Press",
    mediaType: "video",
    source: "Pexels",
    sourcePage: "https://www.pexels.com/video/intense-indoor-dumbbell-bench-press-workout-34568705/",
    license: "verified-commercial",
    visualStatus: "visual-review-required",
    hosting: "download-and-host",
  },
  {
    animationKey: "seated_cable_row",
    exerciseName: "Seated Cable Row",
    mediaType: "video",
    source: "Pexels",
    sourcePage: "https://www.pexels.com/video/a-man-doing-a-seated-cable-row-4367635/",
    license: "verified-commercial",
    visualStatus: "visual-review-required",
    hosting: "download-and-host",
  },
  {
    animationKey: "lat_pulldown",
    exerciseName: "Lat Pulldown",
    mediaType: "video",
    source: "Pexels",
    sourcePage: "https://www.pexels.com/video/a-working-out-at-the-gym-5983521/",
    license: "verified-commercial",
    visualStatus: "visual-review-required",
    hosting: "download-and-host",
  },
  {
    animationKey: "pull_up",
    exerciseName: "Pull-Up",
    mediaType: "video",
    source: "Pexels",
    sourcePage: "https://www.pexels.com/video/pull-up-bar-body-workout-14284164/",
    license: "verified-commercial",
    visualStatus: "visual-review-required",
    hosting: "download-and-host",
  },
  {
    animationKey: "standing_dumbbell_shoulder_press",
    exerciseName: "Standing Dumbbell Shoulder Press",
    mediaType: "video",
    source: "Pexels",
    sourcePage: "https://www.pexels.com/video/a-man-doing-dumbbell-shoulder-press-4367541/",
    license: "verified-commercial",
    visualStatus: "visual-review-required",
    hosting: "download-and-host",
  },
  {
    animationKey: "high_bar_back_squat",
    exerciseName: "High-Bar Back Squat",
    mediaType: "video",
    source: "Pexels",
    sourcePage: "https://www.pexels.com/video/man-doing-barbell-squats-5319755/",
    license: "verified-commercial",
    visualStatus: "visual-review-required",
    hosting: "download-and-host",
  },
  {
    animationKey: "barbell_bench_press_commons",
    exerciseName: "Barbell Bench Press — Wikimedia reference",
    mediaType: "video",
    source: "Wikimedia Commons",
    sourcePage: "https://commons.wikimedia.org/wiki/File%3ABench_press_-_exercise_demonstration_video.webm",
    license: "verified-commercial",
    visualStatus: "visual-review-required",
    hosting: "download-and-host",
    notes: "CC BY 3.0; attribution required. Kept as an alternative reference/source with explicit attribution metadata.",
  },
];

export const MEDIA_LICENSE_POLICY = {
  pexels: "https://www.pexels.com/license/",
  wikimediaCcBy3: "https://creativecommons.org/licenses/by/3.0/",
} as const;

export function getExerciseMedia(animationKey: string) {
  return EXERCISE_MEDIA_REGISTRY.find((item) => item.animationKey === animationKey) ?? null;
}

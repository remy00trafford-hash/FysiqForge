import manifest from "./verifiedExerciseMediaLot7.json" with { type: "json" };

export type VerifiedExerciseMedia = {
  exerciseName: string;
  animationKey: string;
  frame0Url: string;
  frame1Url: string;
  source: string;
  license: string;
  sourceFile: string;
  qualityGatePassed: true;
};

export const VERIFIED_EXERCISE_MEDIA: Record<string, VerifiedExerciseMedia> = Object.fromEntries(
  manifest.exercises.map((item: VerifiedExerciseMedia) => [item.animationKey, item])
) as Record<string, VerifiedExerciseMedia>;

export const VERIFIED_EXERCISE_MEDIA_BY_NAME: Record<string, VerifiedExerciseMedia> = Object.fromEntries(
  manifest.exercises.map((item: VerifiedExerciseMedia) => [normalize(item.exerciseName), item])
) as Record<string, VerifiedExerciseMedia>;

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function findVerifiedExerciseMedia(exerciseId?: string, exerciseName?: string): VerifiedExerciseMedia | null {
  if (exerciseId && VERIFIED_EXERCISE_MEDIA[exerciseId]) return VERIFIED_EXERCISE_MEDIA[exerciseId];
  const normalized = normalize(exerciseName || "");
  return VERIFIED_EXERCISE_MEDIA_BY_NAME[normalized] || null;
}

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

const VERIFIED_LIST: VerifiedExerciseMedia[] = [
  { exerciseName: "Cable Chest Fly", animationKey: "cable_chest_fly", frame0Url: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Flat_Bench_Cable_Flyes/0.jpg", frame1Url: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Flat_Bench_Cable_Flyes/1.jpg", source: "Free Exercise DB (yuhonas)", license: "Public Domain (Unlicense)", sourceFile: "exercises/Flat_Bench_Cable_Flyes.json", qualityGatePassed: true },
  { exerciseName: "Wide Push-Up", animationKey: "wide_push_up", frame0Url: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Push-Up_Wide/0.jpg", frame1Url: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Push-Up_Wide/1.jpg", source: "Free Exercise DB (yuhonas)", license: "Public Domain (Unlicense)", sourceFile: "exercises/Push-Up_Wide.json", qualityGatePassed: true },
  { exerciseName: "Close-Grip Push-Up", animationKey: "close_grip_push_up", frame0Url: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Push-Ups_-_Close_Triceps_Position/0.jpg", frame1Url: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Push-Ups_-_Close_Triceps_Position/1.jpg", source: "Free Exercise DB (yuhonas)", license: "Public Domain (Unlicense)", sourceFile: "exercises/Push-Ups_-_Close_Triceps_Position.json", qualityGatePassed: true },
  { exerciseName: "Triceps Dip", animationKey: "triceps_dip", frame0Url: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dips_-_Triceps_Version/0.jpg", frame1Url: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dips_-_Triceps_Version/1.jpg", source: "Free Exercise DB (yuhonas)", license: "Public Domain (Unlicense)", sourceFile: "exercises/Dips_-_Triceps_Version.json", qualityGatePassed: true },
  { exerciseName: "Bench Dip", animationKey: "bench_dip", frame0Url: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bench_Dips/0.jpg", frame1Url: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bench_Dips/1.jpg", source: "Free Exercise DB (yuhonas)", license: "Public Domain (Unlicense)", sourceFile: "exercises/Bench_Dips.json", qualityGatePassed: true },
  { exerciseName: "Dumbbell Lying Triceps Extension", animationKey: "dumbbell_lying_triceps_extension", frame0Url: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Dumbbell_Tricep_Extension/0.jpg", frame1Url: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Dumbbell_Tricep_Extension/1.jpg", source: "Free Exercise DB (yuhonas)", license: "Public Domain (Unlicense)", sourceFile: "exercises/Lying_Dumbbell_Tricep_Extension.json", qualityGatePassed: true },
  { exerciseName: "Dumbbell Kickback", animationKey: "dumbbell_kickback", frame0Url: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Tricep_Dumbbell_Kickback/0.jpg", frame1Url: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Tricep_Dumbbell_Kickback/1.jpg", source: "Free Exercise DB (yuhonas)", license: "Public Domain (Unlicense)", sourceFile: "exercises/Tricep_Dumbbell_Kickback.json", qualityGatePassed: true }
];

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export const VERIFIED_EXERCISE_MEDIA: Record<string, VerifiedExerciseMedia> = Object.fromEntries(
  VERIFIED_LIST.map((item) => [item.animationKey, item])
) as Record<string, VerifiedExerciseMedia>;

export const VERIFIED_EXERCISE_MEDIA_BY_NAME: Record<string, VerifiedExerciseMedia> = Object.fromEntries(
  VERIFIED_LIST.map((item) => [normalize(item.exerciseName), item])
) as Record<string, VerifiedExerciseMedia>;

export function findVerifiedExerciseMedia(exerciseId?: string, exerciseName?: string): VerifiedExerciseMedia | null {
  if (exerciseId && VERIFIED_EXERCISE_MEDIA[exerciseId]) return VERIFIED_EXERCISE_MEDIA[exerciseId];
  return VERIFIED_EXERCISE_MEDIA_BY_NAME[normalize(exerciseName || "")] || null;
}

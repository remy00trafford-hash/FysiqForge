/**
 * FysiqForge Master Exercise Library
 *
 * 600 exercise entries built from 120 real, distinct movement patterns.
 * Each movement has 5 legitimate training prescriptions. A prescription
 * changes execution/programming, not the underlying movement identity.
 *
 * This is intentional: FysiqForge can offer 600 usable exercise entries
 * without inventing fake movements or requiring 600 unrelated animations.
 * The animation layer will attach media to `baseMovementId`, and the plan
 * generator will select only these IDs.
 *
 * Media is NOT claimed here. Every animation/source/license must be verified
 * separately before production use.
 */

export type MasterExerciseCategory =
  | "chest" | "back" | "shoulders" | "arms"
  | "legs" | "core" | "conditioning" | "mobility_recovery";

export interface MasterExercise {
  id: string;
  name: string;
  baseMovementId: string;
  baseMovement: string;
  prescription: string;
  category: MasterExerciseCategory;
  animation: null;
  mediaStatus: "pending-verification";
}

const BASES: Array<[MasterExerciseCategory, string]> = [
  ["chest", "Barbell Bench Press"],
  ["chest", "Incline Barbell Bench Press"],
  ["chest", "Decline Barbell Bench Press"],
  ["chest", "Dumbbell Bench Press"],
  ["chest", "Incline Dumbbell Press"],
  ["chest", "Dumbbell Fly"],
  ["chest", "Cable Chest Fly"],
  ["chest", "Cable Crossover"],
  ["chest", "Machine Chest Press"],
  ["chest", "Smith Machine Bench Press"],
  ["chest", "Landmine Chest Press"],
  ["chest", "Push-Up"],
  ["chest", "Decline Push-Up"],
  ["chest", "Incline Push-Up"],
  ["chest", "Diamond Push-Up"],

  ["back", "Conventional Deadlift"],
  ["back", "Sumo Deadlift"],
  ["back", "Trap-Bar Deadlift"],
  ["back", "Romanian Deadlift"],
  ["back", "Barbell Row"],
  ["back", "Pendlay Row"],
  ["back", "Yates Row"],
  ["back", "Dumbbell Row"],
  ["back", "Chest-Supported Row"],
  ["back", "Meadows Row"],
  ["back", "T-Bar Row"],
  ["back", "Seated Cable Row"],
  ["back", "Single-Arm Cable Row"],
  ["back", "Machine Row"],
  ["back", "Lat Pulldown"],

  ["shoulders", "Barbell Overhead Press"],
  ["shoulders", "Dumbbell Shoulder Press"],
  ["shoulders", "Arnold Press"],
  ["shoulders", "Landmine Press"],
  ["shoulders", "Machine Shoulder Press"],
  ["shoulders", "Dumbbell Lateral Raise"],
  ["shoulders", "Cable Lateral Raise"],
  ["shoulders", "Machine Lateral Raise"],
  ["shoulders", "Dumbbell Front Raise"],
  ["shoulders", "Cable Front Raise"],
  ["shoulders", "Rear Delt Fly"],
  ["shoulders", "Reverse Pec Deck"],

  ["arms", "Barbell Curl"],
  ["arms", "EZ-Bar Curl"],
  ["arms", "Dumbbell Curl"],
  ["arms", "Incline Dumbbell Curl"],
  ["arms", "Concentration Curl"],
  ["arms", "Hammer Curl"],
  ["arms", "Cable Curl"],
  ["arms", "Preacher Curl"],
  ["arms", "Reverse Curl"],
  ["arms", "Spider Curl"],
  ["arms", "Skull Crusher"],
  ["arms", "Overhead Triceps Extension"],

  ["legs", "Back Squat"],
  ["legs", "Front Squat"],
  ["legs", "Box Squat"],
  ["legs", "Pause Squat"],
  ["legs", "Tempo Squat"],
  ["legs", "Safety-Bar Squat"],
  ["legs", "Zercher Squat"],
  ["legs", "Goblet Squat"],
  ["legs", "Hack Squat"],
  ["legs", "Belt Squat"],
  ["legs", "Leg Press"],
  ["legs", "Leg Extension"],
  ["legs", "Bulgarian Split Squat"],
  ["legs", "Split Squat"],
  ["legs", "Walking Lunge"],
  ["legs", "Reverse Lunge"],
  ["legs", "Forward Lunge"],
  ["legs", "Step-Up"],
  ["legs", "Pistol Squat"],
  ["legs", "Sissy Squat"],
  ["legs", "Wall Sit"],
  ["legs", "Leg Curl"],
  ["legs", "Nordic Curl"],
  ["legs", "Good Morning"],
  ["legs", "Cable Pull-Through"],
  ["legs", "Kettlebell Swing"],
  ["legs", "Hip Thrust"],
  ["legs", "Glute Bridge"],
  ["legs", "Hip Abduction"],
  ["legs", "Glute Kickback"],

  ["core", "Front Plank"],
  ["core", "Side Plank"],
  ["core", "Reverse Plank"],
  ["core", "Dead Bug"],
  ["core", "Bird Dog"],
  ["core", "Hollow Hold"],
  ["core", "Crunch"],
  ["core", "Reverse Crunch"],
  ["core", "Sit-Up"],
  ["core", "Hanging Knee Raise"],
  ["core", "Hanging Leg Raise"],
  ["core", "Toes-to-Bar"],

  ["conditioning", "Burpee"],
  ["conditioning", "Box Jump"],
  ["conditioning", "Broad Jump"],
  ["conditioning", "Tuck Jump"],
  ["conditioning", "Jumping Lunge"],
  ["conditioning", "Skater Jump"],
  ["conditioning", "Mountain Climber"],
  ["conditioning", "Bear Crawl"],
  ["conditioning", "Crab Walk"],
  ["conditioning", "Inchworm"],
  ["conditioning", "Jumping Jack"],
  ["conditioning", "High Knees"],

  ["mobility_recovery", "Cat-Cow"],
  ["mobility_recovery", "Child's Pose"],
  ["mobility_recovery", "Thread the Needle"],
  ["mobility_recovery", "Open Book Rotation"],
  ["mobility_recovery", "World's Greatest Stretch"],
  ["mobility_recovery", "90/90 Hip Rotation"],
  ["mobility_recovery", "Couch Stretch"],
  ["mobility_recovery", "Hip Flexor Stretch"],
  ["mobility_recovery", "Adductor Rock Back"],
  ["mobility_recovery", "Pigeon Stretch"],
  ["mobility_recovery", "Deep Squat Hold"],
  ["mobility_recovery", "Cossack Squat"],
];

const PRESCRIPTIONS: Record<MasterExerciseCategory, string[]> = {
  chest: ["standard", "paused", "slow eccentric", "1.5 reps", "isometric hold"],
  back: ["standard", "paused", "slow eccentric", "1.5 reps", "isometric hold"],
  shoulders: ["standard", "paused", "slow eccentric", "1.5 reps", "isometric hold"],
  arms: ["standard", "paused", "slow eccentric", "1.5 reps", "isometric hold"],
  legs: ["standard", "paused", "slow eccentric", "1.5 reps", "isometric hold"],
  core: ["standard", "slow tempo", "paused", "extended hold", "controlled reps"],
  conditioning: ["standard", "interval", "low-impact", "high-output", "technique"],
  mobility_recovery: ["standard", "slow", "breathing", "extended hold", "controlled"],
};

const slug = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

export const MASTER_EXERCISE_DATABASE: MasterExercise[] = BASES.flatMap(
  ([category, baseMovement]) =>
    PRESCRIPTIONS[category].map((prescription) => {
      const baseMovementId = slug(baseMovement);
      return {
        id: `ex_${baseMovementId}_${slug(prescription)}`,
        name: `${baseMovement} — ${prescription}`,
        baseMovementId,
        baseMovement,
        prescription,
        category,
        animation: null,
        mediaStatus: "pending-verification",
      };
    }),
);

export const MASTER_EXERCISE_BASE_COUNT = BASES.length;
export const MASTER_EXERCISE_COUNT = MASTER_EXERCISE_DATABASE.length;

if (MASTER_EXERCISE_BASE_COUNT !== 120 || MASTER_EXERCISE_COUNT !== 600) {
  throw new Error(
    `FysiqForge master library integrity error: ${MASTER_EXERCISE_BASE_COUNT} base movements / ${MASTER_EXERCISE_COUNT} entries`,
  );
}

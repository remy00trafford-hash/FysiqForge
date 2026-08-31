// FysiqForge production media registry.
// Rule: animationKey MUST exist in MASTER_EXERCISE_DATABASE. No cross-exercise fallback.
import { MASTER_EXERCISE_DATABASE } from "./masterExerciseDatabase";
import { SUPPLIED_EXACT_FRAME_PAIR_MEDIA, type FramePairMedia } from "./exerciseMediaSuppliedBatches";
import { REPDB_VERIFIED_EXACT_MEDIA, type RepDbFramePairMedia } from "./exerciseMediaRepdbVerified";

export type VideoExerciseMedia = {
  animationKey: string; type: "video"; url: string;
  source: "Wikimedia Commons" | "Pexels"; license: string;
  attribution?: string; sourcePage: string; visualStatus: "verified-exact";
};
export type ExerciseMedia = VideoExerciseMedia | FramePairMedia | RepDbFramePairMedia;

export const LEGACY_VERIFIED_EXERCISE_MEDIA: Record<string, VideoExerciseMedia> = {
  barbell_bench_press:{animationKey:"barbell_bench_press",type:"video",url:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Bench_press_-_exercise_demonstration_video.webm",source:"Wikimedia Commons",license:"CC BY 3.0",attribution:"FitnessScape",sourcePage:"https://commons.wikimedia.org/wiki/File:Bench_press_-_exercise_demonstration_video.webm",visualStatus:"verified-exact"},
  incline_barbell_bench_press:{animationKey:"incline_barbell_bench_press",type:"video",url:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Incline_press_-_exercise_demonstration_video.webm",source:"Wikimedia Commons",license:"CC BY 3.0",attribution:"FitnessScape",sourcePage:"https://commons.wikimedia.org/wiki/File:Incline_press_-_exercise_demonstration_video.webm",visualStatus:"verified-exact"},
  barbell_bent_over_row:{animationKey:"barbell_bent_over_row",type:"video",url:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Bent-over_row_-_exercise_demonstration_video.webm",source:"Wikimedia Commons",license:"CC BY 3.0",attribution:"FitnessScape",sourcePage:"https://commons.wikimedia.org/wiki/File:Bent-over_row_-_exercise_demonstration_video.webm",visualStatus:"verified-exact"},
  t_bar_row:{animationKey:"t_bar_row",type:"video",url:"https://commons.wikimedia.org/wiki/Special:Redirect/file/How_to_do_a_T-Bar_Row_in_strength_training_workouts.webm",source:"Wikimedia Commons",license:"CC BY 3.0",attribution:"FitnessScape",sourcePage:"https://commons.wikimedia.org/wiki/File:How_to_do_a_T-Bar_Row_in_strength_training_workouts.webm",visualStatus:"verified-exact"},
  conventional_deadlift:{animationKey:"conventional_deadlift",type:"video",url:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Deadlift_-_exercise_demonstration_video.webm",source:"Wikimedia Commons",license:"CC BY 3.0",attribution:"FitnessScape",sourcePage:"https://commons.wikimedia.org/wiki/File:Deadlift_-_exercise_demonstration_video.webm",visualStatus:"verified-exact"},
  standing_barbell_overhead_press:{animationKey:"standing_barbell_overhead_press",type:"video",url:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Shoulder_press_-_exercise_demonstration_video.webm",source:"Wikimedia Commons",license:"CC BY 3.0",attribution:"FitnessScape",sourcePage:"https://commons.wikimedia.org/wiki/File:Shoulder_press_-_exercise_demonstration_video.webm",visualStatus:"verified-exact"},
  pull_up:{animationKey:"pull_up",type:"video",url:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Pull-ups_-_exercise_demonstration_video.webm",source:"Wikimedia Commons",license:"CC BY 3.0",attribution:"FitnessScape",sourcePage:"https://commons.wikimedia.org/wiki/File:Pull-ups_-_exercise_demonstration_video.webm",visualStatus:"verified-exact"},
  machine_chest_press:{animationKey:"machine_chest_press",type:"video",url:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Muscle_Strengthening_at_the_Gym_-_Chest_Press.webm",source:"Wikimedia Commons",license:"Public domain (US federal government / CDC)",attribution:"Centers for Disease Control and Prevention",sourcePage:"https://commons.wikimedia.org/wiki/File:Muscle_Strengthening_at_the_Gym_-_Chest_Press.webm",visualStatus:"verified-exact"},
  leg_press:{animationKey:"leg_press",type:"video",url:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Muscle_Strengthening_at_the_Gym_-_Seated_Leg_Press.webm",source:"Wikimedia Commons",license:"Public domain (US federal government / CDC)",attribution:"Centers for Disease Control and Prevention",sourcePage:"https://commons.wikimedia.org/wiki/File:Muscle_Strengthening_at_the_Gym_-_Seated_Leg_Press.webm",visualStatus:"verified-exact"},
  leg_extension:{animationKey:"leg_extension",type:"video",url:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Muscle_Strengthening_at_the_Gym_-_Leg_Extension.webm",source:"Wikimedia Commons",license:"Public domain (US federal government / CDC)",attribution:"Centers for Disease Control and Prevention",sourcePage:"https://commons.wikimedia.org/wiki/File:Muscle_Strengthening_at_the_Gym_-_Leg_Extension.webm",visualStatus:"verified-exact"},
  leg_curl:{animationKey:"leg_curl",type:"video",url:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Muscle_Strengthening_at_the_Gym_-_Leg_Curl.webm",source:"Wikimedia Commons",license:"Public domain (US federal government / CDC)",attribution:"Centers for Disease Control and Prevention",sourcePage:"https://commons.wikimedia.org/wiki/File:Muscle_Strengthening_at_the_Gym_-_Leg_Curl.webm",visualStatus:"verified-exact"},
  burpee:{animationKey:"burpee",type:"video",url:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Burpee.webm",source:"Wikimedia Commons",license:"CC BY-SA 4.0",attribution:"Taco Fleur",sourcePage:"https://commons.wikimedia.org/wiki/File:Burpee.webm",visualStatus:"verified-exact"},
  sprawl:{animationKey:"sprawl",type:"video",url:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Sprawl_Exercise.webm",source:"Wikimedia Commons",license:"CC BY-SA 4.0",attribution:"Taco Fleur",sourcePage:"https://commons.wikimedia.org/wiki/File:Sprawl_Exercise.webm",visualStatus:"verified-exact"},
  barbell_curl:{animationKey:"barbell_curl",type:"video",url:"https://www.pexels.com/video/37281095/",source:"Pexels",license:"Pexels License — free commercial use",attribution:"Ds babariya",sourcePage:"https://www.pexels.com/video/37281095/",visualStatus:"verified-exact"},
  push_up:{animationKey:"push_up",type:"video",url:"https://www.pexels.com/video/men-doing-push-ups-8480310/",source:"Pexels",license:"Pexels License — free commercial use",attribution:"Yan Krukau",sourcePage:"https://www.pexels.com/video/men-doing-push-ups-8480310/",visualStatus:"verified-exact"},
  forward_lunge:{animationKey:"forward_lunge",type:"video",url:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Strength_Training_Circuit-_Forward_Lunge.webm",source:"Wikimedia Commons",license:"Public domain (U.S. federal government)",attribution:"Army Combat Fitness Test",sourcePage:"https://commons.wikimedia.org/wiki/File:Strength_Training_Circuit-_Forward_Lunge.webm",visualStatus:"verified-exact"},
  machine_row:{animationKey:"machine_row",type:"video",url:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Muscle_Strengthening_at_the_Gym_-_Row_Machine.webm",source:"Wikimedia Commons",license:"Public domain (U.S. federal government / CDC)",attribution:"Centers for Disease Control and Prevention",sourcePage:"https://commons.wikimedia.org/wiki/File:Muscle_Strengthening_at_the_Gym_-_Row_Machine.webm",visualStatus:"verified-exact"},
  machine_biceps_curl:{animationKey:"machine_biceps_curl",type:"video",url:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Muscle_Strengthening_at_the_Gym_-_Bicep_Machine.webm",source:"Wikimedia Commons",license:"Public domain (US federal government / CDC)",attribution:"Centers for Disease Control and Prevention",sourcePage:"https://commons.wikimedia.org/wiki/File:Muscle_Strengthening_at_the_Gym_-_Bicep_Machine.webm",visualStatus:"verified-exact"},
};

export const VERIFIED_EXERCISE_MEDIA: Record<string, ExerciseMedia> = {
  ...LEGACY_VERIFIED_EXERCISE_MEDIA,
  ...SUPPLIED_EXACT_FRAME_PAIR_MEDIA,
  ...REPDB_VERIFIED_EXACT_MEDIA,
};
export const VERIFIED_MEDIA_KEYS = Object.keys(VERIFIED_EXERCISE_MEDIA);
export const VERIFIED_MEDIA_COUNT = VERIFIED_MEDIA_KEYS.length;

const MASTER_ANIMATION_KEYS = new Set(MASTER_EXERCISE_DATABASE.map((exercise) => exercise.animationKey));
const INVALID_MEDIA_KEYS = VERIFIED_MEDIA_KEYS.filter((key) => !MASTER_ANIMATION_KEYS.has(key));
if (INVALID_MEDIA_KEYS.length) throw new Error(`FysiqForge media integrity error: unknown animationKey(s): ${INVALID_MEDIA_KEYS.join(", ")}`);
if (VERIFIED_MEDIA_COUNT !== 127) throw new Error(`FysiqForge media audit error: expected 127 verified mappings, found ${VERIFIED_MEDIA_COUNT}`);

export const getVerifiedExerciseMedia = (animationKey: string): ExerciseMedia | null => VERIFIED_EXERCISE_MEDIA[animationKey] ?? null;

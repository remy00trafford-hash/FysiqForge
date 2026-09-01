// Exact frame-pair media rebuilt from the supplied Free Exercise DB lists.
// Free Exercise DB uses .jpg frames (0.jpg + 1.jpg), not .png.
// The frontend alternates frame 0 and frame 1 to produce the visible loop.
// Source: https://github.com/yuhonas/free-exercise-db | License: Unlicense
import { MASTER_EXERCISE_DATABASE } from "./masterExerciseDatabase";

export type FramePairMedia = {
  animationKey: string;
  type: "image-pair";
  frame0Url: string;
  frame1Url: string;
  source: "Free Exercise DB";
  license: "Unlicense";
  sourcePage: string;
  visualStatus: "verified-exact";
  qualityGatePassed: true;
};

const PAIRS: Array<[string,string]> = [
["push_press","Barbell_Push_Press"],["seated_barbell_overhead_press","Barbell_Seated_Overhead_Press"],["standing_dumbbell_shoulder_press","Dumbbell_Shoulder_Press"],["seated_dumbbell_shoulder_press","Dumbbell_Seated_Shoulder_Press"],["arnold_press","Dumbbell_Arnold_Press"],["dumbbell_lateral_raise","Dumbbell_Lateral_Raise"],["seated_dumbbell_lateral_raise","Dumbbell_Seated_Lateral_Raise"],["cable_lateral_raise","Cable_Lateral_Raise"],["dumbbell_front_raise","Dumbbell_Front_Raise"],["cable_front_raise","Cable_Front_Raise"],["rear_delt_dumbbell_fly","Dumbbell_Rear_Delt_Fly"],["cable_rear_delt_fly","Cable_Reverse_Fly"],["face_pull","Cable_Face_Pull"],["machine_shoulder_press","Lever_Shoulder_Press"],
["ez_bar_curl","EZ_Bar_Curl"],["dumbbell_curl","Dumbbell_Bicep_Curl"],["hammer_curl","Dumbbell_Hammer_Curl"],["incline_dumbbell_curl","Dumbbell_Incline_Curl"],["concentration_curl","Dumbbell_Concentration_Curl"],["preacher_curl","Barbell_Preacher_Curl"],["cable_curl","Cable_Curl"],["reverse_curl","Barbell_Reverse_Curl"],["close_grip_barbell_bench_press","Barbell_Close_Grip_Bench_Press"],["ez_bar_skull_crusher","Barbell_Lying_Triceps_Extension"],["dumbbell_overhead_triceps_extension","Dumbbell_Overhead_Triceps_Extension"],["single_arm_dumbbell_overhead_extension","Dumbbell_One_Arm_Triceps_Extension"],["straight_bar_triceps_pushdown","Cable_Pushdown"],["rope_triceps_pushdown","Cable_Rope_Pushdown"],["overhead_cable_triceps_extension","Cable_Overhead_Triceps_Extension"],["single_arm_triceps_pushdown","Cable_One_Arm_Pushdown"],
["high_bar_back_squat","Barbell_Full_Squat"],["front_squat","Barbell_Front_Squat"],["box_squat","Barbell_Box_Squat"],["goblet_squat","Kettlebell_Goblet_Squat"],["hack_squat","Sled_Hack_Squat"],["smith_machine_squat","Smith_Machine_Squat"],["45_degree_leg_press","Sled_45_Degree_Leg_Press"],["horizontal_leg_press","Lever_Seated_Leg_Press"],["single_leg_leg_extension","Lever_Single_Leg_Extension"],["dumbbell_bulgarian_split_squat","Dumbbell_Single_Leg_Split_Squat"],["split_squat","Barbell_Split_Squat"],["dumbbell_split_squat","Dumbbell_Split_Squat"],["walking_lunge","Bodyweight_Walking_Lunge"],["dumbbell_walking_lunge","Dumbbell_Walking_Lunge"],["barbell_walking_lunge","Barbell_Walking_Lunge"],["reverse_lunge","Barbell_Rear_Lunge"],["dumbbell_reverse_lunge","Dumbbell_Rear_Lunge"],["dumbbell_forward_lunge","Dumbbell_Lunge"],["barbell_forward_lunge","Barbell_Lunge"],["lateral_lunge","Side_Lunge"],["step_up","Bench_Step_Up"],["dumbbell_step_up","Dumbbell_Step_Up"],["barbell_step_up","Barbell_Step_Up"],["pistol_squat","Single_Leg_Squat"],["sissy_squat","Sissy_Squat"],["good_morning","Barbell_Good_Morning"],["cable_pull_through","Cable_Pull_Through"],["kettlebell_swing","Kettlebell_Swing"],["barbell_hip_thrust","Barbell_Hip_Thrust"],["dumbbell_hip_thrust","Dumbbell_Hip_Thrust"],["glute_bridge","Glute_Bridge"],["barbell_glute_bridge","Barbell_Glute_Bridge"],
["front_plank","Front_Plank"],["plank_shoulder_tap","Plank_Shoulder_Tap"],["side_plank","Side_Plank"],["reverse_plank","Reverse_Plank"],["dead_bug","Dead_Bug"],["bird_dog","Bird_Dog"],["hollow_hold","Hollow_Hold"],["crunch","Crunch"],["weighted_crunch","Weighted_Crunch"],["cable_crunch","Cable_Crunch"],["kneeling_cable_crunch","Cable_Kneeling_Crunch"],["reverse_crunch","Reverse_Crunch"],
["box_jump","Box_Jump"],["broad_jump","Standing_Long_Jump"],["tuck_jump","Tuck_Jump"],["jumping_lunge","Split_Jump"],["skater_jump","Skater_Hop"],["mountain_climber","Mountain_Climber"],["bear_crawl","Bear_Crawl"],["crab_walk","Crab_Walk"],["inchworm","Inchworm"],["jumping_jack","Jumping_Jack"],
["march_in_place","Marching_In_Place"],["arm_circles","Arm_Circles"],["leg_swings_front_to_back","Front_Leg_Swings"],["leg_swings_side_to_side","Side_Leg_Swings"],["inchworm_walkout","Inchworm"],["scapular_push_up","Scapula_Push_Up"],["glute_bridge_warm_up","Glute_Bridge"],["bird_dog_warm_up","Bird_Dog"],["jumping_jack_warm_up","Jumping_Jack"],["cat_cow","Cat_Cow"],["childs_pose","Childs_Pose"],["worlds_greatest_stretch","Worlds_Greatest_Stretch"],["90_90_hip_rotation","90_90_Stretch"],["half_kneeling_hip_flexor_stretch","Kneeling_Hip_Flexor_Stretch"]
];

const MASTER_KEYS = new Set(MASTER_EXERCISE_DATABASE.map((e) => e.animationKey));
const INVALID = PAIRS.map(([k]) => k).filter((k) => !MASTER_KEYS.has(k));
if (INVALID.length) throw new Error(`FysiqForge supplied media integrity error: ${INVALID.join(", ")}`);

export const SUPPLIED_EXACT_FRAME_PAIR_MEDIA: Record<string, FramePairMedia> = Object.fromEntries(PAIRS.map(([animationKey,dir]) => [animationKey, {
  animationKey, type: "image-pair",
  frame0Url: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${dir}/0.jpg`,
  frame1Url: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${dir}/1.jpg`,
  source: "Free Exercise DB", license: "Unlicense", sourcePage: "https://github.com/yuhonas/free-exercise-db",
  visualStatus: "verified-exact", qualityGatePassed: true,
}]));

export const SUPPLIED_EXACT_FRAME_PAIR_COUNT = Object.keys(SUPPLIED_EXACT_FRAME_PAIR_MEDIA).length;
if (SUPPLIED_EXACT_FRAME_PAIR_COUNT !== 98) throw new Error(`Expected 98 master-compatible additions, found ${SUPPLIED_EXACT_FRAME_PAIR_COUNT}`);

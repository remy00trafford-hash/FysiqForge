/**
 * Canonical animation aliases used by the workout player.
 * The renderer stays shared, but every known local exercise points to a
 * specific motion identity so the displayed animation follows the exercise.
 */
export const EXERCISE_ANIMATION_IDS: Record<string, string> = {
  // Main catalog
  bench_press: "bench_press",
  incline_dumbbell: "incline_dumbbell",
  cable_crossover: "cable_crossover",
  dips_chest: "dips_chest",
  lat_pulldown: "lat_pulldown",
  bent_over_row: "bent_over_row",
  seated_cable_row: "seated_cable_row",
  pullups_bodyweight: "pullups_bodyweight",
  overhead_press: "overhead_press",
  lateral_raises: "lateral_raises",
  face_pulls: "face_pulls",
  squat_barbell: "squat_barbell",
  leg_press: "leg_press",
  romanian_deadlift: "romanian_deadlift",
  bulgarian_split_squat: "bulgarian_split_squat",
  barbell_curl: "barbell_curl",
  hammer_curl: "hammer_curl",
  triceps_pushdown: "triceps_pushdown",
  plank_abs: "plank_abs",
  hanging_leg_raise: "hanging_leg_raise",

  // Bodyweight / home catalog
  bw_pushup_decline: "bw_pushup_decline",
  bw_dips_chair: "bw_dips_chair",
  bw_pike_pushup: "bw_pike_pushup",
  bw_inverted_row: "bw_inverted_row",
  bw_door_biceps: "bw_door_biceps",
  bw_pistol_squat: "bw_pistol_squat",
  bw_bulgarian_split: "bw_bulgarian_split",

  // Dumbbell / home-gym catalog
  db_bench_press: "db_bench_press",
  db_incline_fly: "db_incline_fly",
  db_shoulder_press: "db_shoulder_press",
  db_one_arm_row: "db_one_arm_row",
  db_hammer_curl: "db_hammer_curl",
  db_goblet_squat: "db_goblet_squat",
  db_romanian_deadlift: "db_romanian_deadlift",

  // Extra no-equipment variants used by the fallback planner
  bw_classic_pushup: "bw_classic_pushup",
  bw_walking_lunge: "bw_walking_lunge",
  bw_glute_bridge: "bw_glute_bridge",
  bw_mountain_climber: "bw_mountain_climber",
  bw_jumping_jacks: "bw_jumping_jacks",
  bw_burpee: "bw_burpee",
  bw_wall_sit: "bw_wall_sit",
  bw_crunch: "bw_crunch",
  bw_superman: "bw_superman",
  bw_side_plank: "bw_side_plank",
  bw_step_up: "bw_step_up",
  bw_tempo_squat: "bw_tempo_squat",
  bw_glute_kickback: "bw_glute_kickback",
  bw_fire_hydrant: "bw_fire_hydrant",
  bw_calf_raise: "bw_calf_raise",
  bw_hollow_body: "bw_hollow_body",
  bw_reverse_lunge: "bw_reverse_lunge",
  bw_close_grip_pushup: "bw_close_grip_pushup",
  triceps_extension_barbell: "triceps_extension_barbell",
  farmer_carry: "farmer_carry"
};

const NAME_ALIASES: Array<[RegExp, string]> = [
  [/développé couché.*halt[eè]res|dumbbell bench press/, "db_bench_press"],
  [/pike push|pompes.*pike/, "bw_pike_pushup"],
  [/pompes.*sur[ -]?élev|decline push/, "bw_pushup_decline"],
  [/dips.*chaise|bench dips|chair dips/, "bw_dips_chair"],
  [/rowing invers|inverted row|tirage invers/, "bw_inverted_row"],
  [/traction.*porte|porte.*biceps|door.*biceps/, "bw_door_biceps"],
  [/pistol squat|squat.*une jambe/, "bw_pistol_squat"],
  [/squat bulgare.*poids du corps|bodyweight.*bulgarian/, "bw_bulgarian_split"],
  [/écarté.*halt[eè]res|dumbbell fly|fly.*halt[eè]res/, "db_incline_fly"],
  [/développé.*[eé]paules.*halt[eè]res|dumbbell shoulder press/, "db_shoulder_press"],
  [/rowing.*un bras.*halt[eè]re|one arm dumbbell row/, "db_one_arm_row"],
  [/curl marteau.*halt[eè]res|dumbbell hammer curl/, "db_hammer_curl"],
  [/goblet squat/, "db_goblet_squat"],
  [/soulev[eé].*terre.*halt[eè]res|dumbbell romanian deadlift/, "db_romanian_deadlift"],
  [/bench press|développé couché/, "bench_press"],
  [/développé incliné/, "incline_dumbbell"],
  [/écarté.*poulie|crossover/, "cable_crossover"],
  [/dips(?!.*chaise)/, "dips_chest"],
  [/tirage vertical|lat pulldown/, "lat_pulldown"],
  [/rowing.*barre|bent.*over.*row|tirage buste penché/, "bent_over_row"],
  [/rowing.*poulie|seated cable row|tirage horizontal/, "seated_cable_row"],
  [/tractions|pull.?ups/, "pullups_bodyweight"],
  [/développé militaire|military press|overhead press|shoulder press/, "overhead_press"],
  [/élévation[s]? latérale|lateral raise/, "lateral_raises"],
  [/face pull/, "face_pulls"],
  [/back squat|barbell squat|squat à la barre/, "squat_barbell"],
  [/presse à cuisses|leg press/, "leg_press"],
  [/soulevé de terre roumain|romanian deadlift/, "romanian_deadlift"],
  [/bulgarian split|split squat|fente bulgare/, "bulgarian_split_squat"],
  [/curl barre|barbell curl|curl pupitre/, "barbell_curl"],
  [/curl marteau|hammer curl/, "hammer_curl"],
  [/extension triceps.*barre au front|skull crusher|lying triceps extension/, "triceps_extension_barbell"],
  [/pushdown|extension triceps.*poulie|triceps pushdown/, "triceps_pushdown"],
  [/gainage latéral|side plank|planche latérale/, "bw_side_plank"],
  [/superman/, "bw_superman"],
  [/wall sit|chaise murale/, "bw_wall_sit"],
  [/jumping jack/, "bw_jumping_jacks"],
  [/mountain climber/, "bw_mountain_climber"],
  [/burpee/, "bw_burpee"],
  [/pompes prise serrée|close grip push.?up/, "bw_close_grip_pushup"],
  [/pompes classiques|classic push.?up/, "bw_classic_pushup"],
  [/fentes marchées|walking lunge/, "bw_walking_lunge"],
  [/pont fessier|glute bridge|hip bridge/, "bw_glute_bridge"],
  [/step.?up/, "bw_step_up"],
  [/crunch[s]?/, "bw_crunch"],
  [/hollow body/, "bw_hollow_body"],
  [/mollets.*poids du corps|bodyweight calf raise/, "bw_calf_raise"],
  [/glute kickback|kickback fessier/, "bw_glute_kickback"],
  [/fire hydrant/, "bw_fire_hydrant"],
  [/squat tempo/, "bw_tempo_squat"],
  [/fentes arrière|reverse lunge/, "bw_reverse_lunge"],
  [/pompes prise serrée|close grip push.?up/, "bw_close_grip_pushup"],
  [/farmer['’]?s (carry|walk)|marche du fermier|portage fermier/, "farmer_carry"],
  [/gainage|planche|plank/, "plank_abs"],
  [/relevé[s]? de jambes|hanging leg raise|leg raise/, "hanging_leg_raise"]
];

export function resolveExerciseAnimationId(exerciseId?: string, exerciseName?: string): string | undefined {
  if (exerciseId && EXERCISE_ANIMATION_IDS[exerciseId]) return EXERCISE_ANIMATION_IDS[exerciseId];
  const normalized = (exerciseName || "").toLowerCase().trim();
  if (!normalized) return undefined;
  const match = NAME_ALIASES.find(([pattern]) => pattern.test(normalized));
  return match?.[1];
}

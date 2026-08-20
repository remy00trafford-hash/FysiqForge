import React from "react";

export type MotionFamily =
  | "benchPress"
  | "inclinePress"
  | "pushup"
  | "dip"
  | "pulldown"
  | "row"
  | "pullup"
  | "shoulderPress"
  | "lateralRaise"
  | "curl"
  | "triceps"
  | "lyingTriceps"
  | "squat"
  | "lunge"
  | "stepUp"
  | "hinge"
  | "legPress"
  | "calfRaise"
  | "gluteBridge"
  | "gluteKickback"
  | "core"
  | "plank"
  | "legRaise"
  | "cardio"
  | "carry"
  | "unknown";

export interface PremiumMotionSpec { family: MotionFamily; label: string; muscle: string; }

export const EXERCISE_MOTIONS: Record<string, PremiumMotionSpec> = {
  bench_press: { family: "benchPress", label: "DÉVELOPPÉ COUCHÉ", muscle: "PECTORAUX" },
  incline_dumbbell: { family: "inclinePress", label: "DÉVELOPPÉ INCLINÉ", muscle: "PECTORAUX SUPÉRIEURS" },
  cable_crossover: { family: "benchPress", label: "ÉCARTÉ POULIE", muscle: "PECTORAUX" },
  dips_chest: { family: "dip", label: "DIPS PECTORAUX", muscle: "PECTORAUX / TRICEPS" },
  lat_pulldown: { family: "pulldown", label: "TIRAGE VERTICAL", muscle: "GRAND DORSAL" },
  bent_over_row: { family: "row", label: "ROWING BARRE", muscle: "DOS" },
  seated_cable_row: { family: "row", label: "ROWING POULIE", muscle: "DOS / BICEPS" },
  pullups_bodyweight: { family: "pullup", label: "TRACTIONS", muscle: "DOS / BICEPS" },
  overhead_press: { family: "shoulderPress", label: "DÉVELOPPÉ MILITAIRE", muscle: "DELTOÏDES" },
  lateral_raises: { family: "lateralRaise", label: "ÉLÉVATIONS LATÉRALES", muscle: "DELTOÏDE LATÉRAL" },
  face_pulls: { family: "row", label: "FACE PULL", muscle: "ARRIÈRE D'ÉPAULE" },
  squat_barbell: { family: "squat", label: "BACK SQUAT", muscle: "QUADRICEPS / FESSIERS" },
  leg_press: { family: "legPress", label: "PRESSE À CUISSES", muscle: "QUADRICEPS" },
  romanian_deadlift: { family: "hinge", label: "SOULEVÉ DE TERRE ROUMAIN", muscle: "ISCHIOS / FESSIERS" },
  bulgarian_split_squat: { family: "lunge", label: "SQUAT BULGARE", muscle: "FESSIERS / QUADRICEPS" },
  barbell_curl: { family: "curl", label: "CURL BARRE", muscle: "BICEPS" },
  hammer_curl: { family: "curl", label: "CURL MARTEAU", muscle: "BICEPS / AVANT-BRAS" },
  triceps_pushdown: { family: "triceps", label: "PUSH-DOWN TRICEPS", muscle: "TRICEPS" },
  plank_abs: { family: "plank", label: "GAINAGE", muscle: "CORE" },
  hanging_leg_raise: { family: "legRaise", label: "RELEVÉ DE JAMBES", muscle: "ABDOMINAUX" },
  bw_pushup_decline: { family: "pushup", label: "POMPES PIEDS SURÉLEVÉS", muscle: "PECTORAUX SUPÉRIEURS" },
  bw_dips_chair: { family: "dip", label: "DIPS SUR CHAISE", muscle: "TRICEPS / PECTORAUX" },
  bw_pike_pushup: { family: "pushup", label: "PIKE PUSH-UP", muscle: "ÉPAULES" },
  bw_inverted_row: { family: "row", label: "ROWING INVERSÉ", muscle: "DOS / BICEPS" },
  bw_pistol_squat: { family: "lunge", label: "PISTOL SQUAT", muscle: "QUADRICEPS / FESSIERS" },
  bw_bulgarian_split: { family: "lunge", label: "SQUAT BULGARE AU POIDS DU CORPS", muscle: "JAMBES / FESSIERS" },
  db_bench_press: { family: "benchPress", label: "DÉVELOPPÉ COUCHÉ HALTÈRES", muscle: "PECTORAUX / TRICEPS" },
  db_incline_fly: { family: "inclinePress", label: "ÉCARTÉ INCLINÉ HALTÈRES", muscle: "PECTORAUX SUPÉRIEURS" },
  db_shoulder_press: { family: "shoulderPress", label: "DÉVELOPPÉ ÉPAULES HALTÈRES", muscle: "DELTOÏDES" },
  db_one_arm_row: { family: "row", label: "ROWING UN BRAS HALTÈRE", muscle: "GRAND DORSAL" },
  db_hammer_curl: { family: "curl", label: "CURL MARTEAU HALTÈRES", muscle: "BICEPS / AVANT-BRAS" },
  db_goblet_squat: { family: "squat", label: "GOBLET SQUAT", muscle: "QUADRICEPS / FESSIERS" },
  db_romanian_deadlift: { family: "hinge", label: "RDL HALTÈRES", muscle: "ISCHIOS / FESSIERS" },
  bw_classic_pushup: { family: "pushup", label: "POMPES CLASSIQUES", muscle: "PECTORAUX / TRICEPS" },
  bw_close_grip_pushup: { family: "pushup", label: "POMPES PRISE SERRÉE", muscle: "TRICEPS / PECTORAUX" },
  bw_walking_lunge: { family: "lunge", label: "FENTES MARCHÉES", muscle: "QUADRICEPS / FESSIERS" },
  bw_reverse_lunge: { family: "lunge", label: "FENTES ARRIÈRE", muscle: "QUADRICEPS / FESSIERS" },
  bw_step_up: { family: "stepUp", label: "STEP-UP", muscle: "QUADRICEPS / FESSIERS" },
  bw_glute_bridge: { family: "gluteBridge", label: "PONT FESSIER", muscle: "FESSIERS / ISCHIOS" },
  bw_glute_kickback: { family: "gluteKickback", label: "GLUTE KICKBACK", muscle: "FESSIERS" },
  bw_calf_raise: { family: "calfRaise", label: "MOLLETS DEBOUT", muscle: "MOLLETS" },
  bw_crunch: { family: "core", label: "CRUNCHS", muscle: "ABDOMINAUX" },
  bw_side_plank: { family: "plank", label: "GAINAGE LATÉRAL", muscle: "OBLIQUES / CORE" },
  bw_hollow_body: { family: "core", label: "HOLLOW BODY HOLD", muscle: "CORE" },
  bw_mountain_climber: { family: "cardio", label: "MOUNTAIN CLIMBERS", muscle: "CORE / CARDIO" },
  bw_jumping_jacks: { family: "cardio", label: "JUMPING JACKS", muscle: "CARDIO" },
  bw_burpee: { family: "cardio", label: "BURPEES", muscle: "FULL BODY / CARDIO" },
  bw_wall_sit: { family: "squat", label: "CHAISE MURALE", muscle: "QUADRICEPS" },
  triceps_extension_barbell: { family: "lyingTriceps", label: "BARRE AU FRONT", muscle: "TRICEPS" },
  farmer_carry: { family: "carry", label: "FARMER'S CARRY", muscle: "PRISE / TRAPÈZES" },
};

export function classifyExerciseMotion(exerciseId?: string, exerciseName = "", muscleGroup = ""): PremiumMotionSpec {
  if (exerciseId && EXERCISE_MOTIONS[exerciseId]) return EXERCISE_MOTIONS[exerciseId];
  const text = `${exerciseName} ${muscleGroup}`.toLowerCase();
  if (/skull|barre au front|lying triceps|triceps extension.*bench|triceps.*couché|band skull/.test(text)) return { family: "lyingTriceps", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() || "TRICEPS" };
  if (/bench|développé couché|press.*barre|press.*halt/.test(text)) return { family: "benchPress", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/incliné|incline|écarté|fly|crossover/.test(text)) return { family: "inclinePress", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/pompe|push-up|push up|pike/.test(text)) return { family: "pushup", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/dip/.test(text)) return { family: "dip", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/tirage vertical|lat pulldown|pulldown/.test(text)) return { family: "pulldown", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/rowing|row|tirage horizontal|face pull|tirage/.test(text)) return { family: "row", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/traction|pull-up|pull up/.test(text)) return { family: "pullup", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/militaire|overhead|shoulder press|développé épaules/.test(text)) return { family: "shoulderPress", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/élévation latérale|lateral raise|oiseau|reverse fly/.test(text)) return { family: "lateralRaise", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/curl|biceps/.test(text)) return { family: "curl", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/triceps|pushdown/.test(text)) return { family: "triceps", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/presse à cuisses|leg press/.test(text)) return { family: "legPress", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/squat|wall sit|chaise murale|goblet/.test(text)) return { family: "squat", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/fente|lunge|split squat|pistol/.test(text)) return { family: "lunge", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/step-up|step up/.test(text)) return { family: "stepUp", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/deadlift|soulevé de terre|romanian|rdl|good morning|hinge/.test(text)) return { family: "hinge", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/mollet|calf/.test(text)) return { family: "calfRaise", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/pont fessier|glute bridge|bridge/.test(text)) return { family: "gluteBridge", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/kickback|donkey kick/.test(text)) return { family: "gluteKickback", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/crunch|abdo|rotation russe|russian twist|hollow/.test(text)) return { family: "core", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/gainage|plank|planche/.test(text)) return { family: "plank", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/relevé de jambes|leg raise|hanging/.test(text)) return { family: "legRaise", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/jumping jack|mountain climber|burpee|cardio|saut|jump|running|course/.test(text)) return { family: "cardio", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  if (/farmer|carry|walk|portage|préhension|grip/.test(text)) return { family: "carry", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
  return { family: "unknown", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() || "MOUVEMENT" };
}

export interface PremiumExerciseIllustrationProps { exerciseId?: string; exerciseName?: string; muscleGroup?: string; className?: string; }

export const PremiumExerciseIllustration: React.FC<PremiumExerciseIllustrationProps> = ({ exerciseId, exerciseName = "Exercice", muscleGroup = "Mouvement", className = "" }) => {
  const spec = classifyExerciseMotion(exerciseId, exerciseName, muscleGroup);
  return (
    <div className={`w-full h-full rounded-2xl border border-slate-200 bg-slate-50 p-4 ${className}`}>
      <div className="text-xs font-black uppercase tracking-wider text-slate-500">{spec.label}</div>
      <div className="mt-1 text-sm font-bold text-slate-800">{spec.muscle}</div>
      <div className="mt-4 flex h-24 items-center justify-center rounded-xl bg-white text-xs font-semibold text-slate-500">Animation guidée disponible dans le lecteur de séance.</div>
    </div>
  );
};
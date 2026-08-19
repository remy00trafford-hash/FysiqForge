import React, { useMemo } from "react";

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

export interface PremiumMotionSpec {
  family: MotionFamily;
  label: string;
  muscle: string;
}

export const EXERCISE_MOTIONS: Record<string, PremiumMotionSpec> = {
  bench_press: { family: "benchPress", label: "DÉVELOPPÉ COUCHÉ", muscle: "PECTORAUX" },
  incline_dumbbell: { family: "inclinePress", label: "DÉVELOPPÉ INCLINÉ", muscle: "PECTORAUX SUPÉRIEURS" },
  cable_crossover: { family: "benchPress", label: "ÉCARTÉ POULIE", muscle: "PECTORAUX" },
  dips_chest: { family: "dip", label: "DIPS PECTORAUX", muscle: "PECTORAUX / TRICEPS" },
  lat_pulldown: { family: "pulldown", label: "TIRAGE VERTICAL", muscle: "GRAND DORSAL" },
  bent_over_row: { family: "row", label: "ROWING BARRE", muscle: "DOS" },
  seated_cable_row: { family: "row", label: "ROWING POULIE", muscle: "DOS" },
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
  triceps_extension_barbell: { family: "triceps", label: "BARRE AU FRONT", muscle: "TRICEPS" },
  farmer_carry: { family: "carry", label: "FARMER'S CARRY", muscle: "PRISE / TRAPÈZES" }
};

export function classifyExerciseMotion(exerciseId?: string, exerciseName = "", muscleGroup = ""): PremiumMotionSpec {
  if (exerciseId && EXERCISE_MOTIONS[exerciseId]) return EXERCISE_MOTIONS[exerciseId];
  const text = `${exerciseName} ${muscleGroup}`.toLowerCase();
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
  if (/triceps|pushdown|barre au front|skull/.test(text)) return { family: "triceps", label: exerciseName.toUpperCase(), muscle: muscleGroup.toUpperCase() };
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

export function classifyExercisePose(name: string, muscleGroup?: string) {
  const text = `${name} ${muscleGroup || ""}`.toLowerCase();
  if (/push|pompe|bench|développé|dip|pector/.test(text)) return "push" as const;
  if (/row|rowing|tirage|traction|pull/.test(text)) return "pull" as const;
  if (/fente|lunge|split|step-up/.test(text)) return "lunge" as const;
  if (/squat|leg press|chaise/.test(text)) return "squat" as const;
  if (/deadlift|soulevé|hinge|rdl|good morning/.test(text)) return "hinge" as const;
  if (/shoulder|militaire|élévation|face pull/.test(text)) return "shoulder" as const;
  if (/curl|biceps|triceps/.test(text)) return "arm" as const;
  if (/gainage|plank|crunch|abdo|core/.test(text)) return "core" as const;
  if (/jump|burpee|cardio|mountain/.test(text)) return "cardio" as const;
  return "stretch" as const;
}

const COLORS = {
  bg: "#0E1218",
  panel: "#141C25",
  panel2: "#1A2531",
  skin: "#F3C9AE",
  skinDark: "#C98569",
  shirt: "#253342",
  shirt2: "#34485D",
  orange: "#FF6A1A",
  orangeSoft: "#FF9A62",
  white: "#F8FBFF",
  muted: "#8FA1B3",
  steel: "#B8C4D0",
  steelDark: "#5D6A77",
  muscle: "#FF5A2D"
};

const Joint: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 4 }) => (
  <circle cx={x} cy={y} r={r} fill={COLORS.skin} stroke={COLORS.skinDark} strokeWidth="1.2" />
);

const Head: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <circle cx={x} cy={y} r="10" fill={COLORS.skin} stroke={COLORS.skinDark} strokeWidth="1.8" />
    <circle cx={x + 3.1} cy={y - 1.5} r="1.2" fill="#342119" />
    <path d={`M ${x - 7} ${y - 5} Q ${x} ${y - 11} ${x + 7} ${y - 5}`} fill="none" stroke="#8B503A" strokeWidth="1.5" strokeLinecap="round" />
  </g>
);

const MuscleGlow: React.FC<{ path: string }> = ({ path }) => (
  <path d={path} fill={COLORS.muscle} opacity="0.9">
    <animate attributeName="opacity" values="0.55;1;0.55" dur="1.1s" repeatCount="indefinite" />
  </path>
);

const Floor: React.FC = () => (
  <g>
    <ellipse cx="100" cy="208" rx="66" ry="8" fill="#06090D" opacity="0.75" />
    <line x1="32" y1="206" x2="168" y2="206" stroke="#344150" strokeWidth="2" />
  </g>
);

const Timeline: React.FC = () => (
  <g>
    <line x1="31" y1="222" x2="169" y2="222" stroke="#364554" strokeWidth="2.5" strokeLinecap="round" />
    {[31, 77, 123, 169].map((x, i) => (
      <g key={x}>
        <circle cx={x} cy="222" r="4" fill={i === 0 ? COLORS.orange : "#718293"} />
        <text x={x} y="237" fill={COLORS.muted} fontSize="6.2" textAnchor="middle" fontWeight="700">
          {i === 0 ? "DÉPART" : i === 1 ? "MOUVEMENT" : i === 2 ? "FIN" : "RETOUR"}
        </text>
      </g>
    ))}
    <circle cx="31" cy="222" r="5.5" fill={COLORS.orange} opacity="0.25">
      <animate attributeName="cx" values="31;77;123;169;123;77;31" dur="2.8s" repeatCount="indefinite" />
    </circle>
  </g>
);

const Badge: React.FC<{ spec: PremiumMotionSpec }> = ({ spec }) => (
  <g>
    <rect x="10" y="10" width="180" height="48" rx="12" fill="#0A0D12" opacity="0.92" stroke="#263443" />
    <rect x="10" y="10" width="4" height="48" rx="2" fill={COLORS.orange} />
    <text x="21" y="29" fill={COLORS.white} fontSize="8.2" fontWeight="900" letterSpacing="0.8">{spec.label}</text>
    <circle cx="176" cy="26" r="4" fill={COLORS.muscle} />
    <text x="21" y="44" fill={COLORS.orangeSoft} fontSize="7" fontWeight="800">{spec.muscle}</text>
  </g>
);

const StandingMan: React.FC<{
  groupTransform?: string;
  armMode?: "down" | "press" | "side" | "curl" | "pushdown" | "carry";
  crouch?: number;
  dumbbells?: boolean;
  barbell?: boolean;
  highlight?: "chest" | "shoulders" | "biceps" | "triceps" | "legs" | "none";
}> = ({ groupTransform = "", armMode = "down", crouch = 0, dumbbells = false, barbell = false, highlight = "none" }) => {
  const hip = 151 + crouch;
  const shoulder = 92 + crouch;
  const head = 66 + crouch;
  return (
    <g transform={groupTransform}>
      {barbell && (
        <g>
          <line x1="52" y1={shoulder - 5} x2="148" y2={shoulder - 5} stroke={COLORS.steel} strokeWidth="5" strokeLinecap="round" />
          <circle cx="52" cy={shoulder - 5} r="7" fill={COLORS.steelDark} /><circle cx="148" cy={shoulder - 5} r="7" fill={COLORS.steelDark} />
        </g>
      )}
      <Head x={100} y={head} />
      <path d={`M86 ${shoulder} Q100 ${shoulder - 9} 114 ${shoulder} L118 ${118 + crouch} Q100 ${128 + crouch} 82 ${118 + crouch} Z`} fill={COLORS.shirt} stroke="#476078" strokeWidth="1.5" />
      {highlight === "chest" && <MuscleGlow path={`M89 ${shoulder + 7} Q100 ${shoulder + 1} 111 ${shoulder + 7} L108 ${111 + crouch} Q100 ${116 + crouch} 92 ${111 + crouch} Z`} />}
      {highlight === "shoulders" && <MuscleGlow path={`M87 ${shoulder + 2} Q92 ${shoulder - 1} 98 ${shoulder + 4} Q100 ${shoulder - 2} 102 ${shoulder + 4} Q108 ${shoulder - 1} 113 ${shoulder + 2} L110 ${104 + crouch} Q100 ${99 + crouch} 90 ${104 + crouch} Z`} />}
      {highlight === "biceps" && <><MuscleGlow path={`M88 ${shoulder + 8} L78 ${112 + crouch} L86 ${117 + crouch} L96 ${102 + crouch} Z`} /><MuscleGlow path={`M112 ${shoulder + 8} L122 ${112 + crouch} L114 ${117 + crouch} L104 ${102 + crouch} Z`} /></>}
      {highlight === "triceps" && <><MuscleGlow path={`M86 ${shoulder + 8} L78 ${112 + crouch} L84 ${116 + crouch} L92 ${103 + crouch} Z`} /><MuscleGlow path={`M114 ${shoulder + 8} L122 ${112 + crouch} L116 ${116 + crouch} L108 ${103 + crouch} Z`} /></>}
      {highlight === "legs" && <><MuscleGlow path={`M92 ${hip} L80 ${190 + crouch} L89 ${194 + crouch} L102 ${158 + crouch} Z`} /><MuscleGlow path={`M108 ${hip} L120 ${190 + crouch} L111 ${194 + crouch} L98 ${158 + crouch} Z`} /></>}
      <line x1="100" y1={118 + crouch} x2="100" y2={hip} stroke={COLORS.skinDark} strokeWidth="8" strokeLinecap="round" />
      <Joint x={100} y={shoulder} /><Joint x={100} y={hip} />

      {armMode === "down" && <>
        <line x1="92" y1={shoulder + 4} x2="77" y2={120 + crouch} stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round" />
        <line x1="108" y1={shoulder + 4} x2="123" y2={120 + crouch} stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round" />
        <Joint x={77} y={120 + crouch} /><Joint x={123} y={120 + crouch} />
        {dumbbells && <><circle cx="73" cy={129 + crouch} r="6" fill={COLORS.steelDark} /><circle cx="127" cy={129 + crouch} r="6" fill={COLORS.steelDark} /></>}
      </>}

      {armMode === "press" && <g>
        <line x1="92" y1={shoulder + 5} x2="80" y2={75 + crouch} stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round">
          <animateTransform attributeName="transform" type="translate" values="0 11;0 -3;0 11" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="108" y1={shoulder + 5} x2="120" y2={75 + crouch} stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round">
          <animateTransform attributeName="transform" type="translate" values="0 11;0 -3;0 11" dur="1.8s" repeatCount="indefinite" />
        </line>
        <Joint x={80} y={75 + crouch} /><Joint x={120} y={75 + crouch} />
        {dumbbells && <><circle cx="80" cy={74 + crouch} r="6" fill={COLORS.steelDark} /><circle cx="120" cy={74 + crouch} r="6" fill={COLORS.steelDark} /></>}
      </g>}

      {armMode === "side" && <g>
        <line x1="92" y1={shoulder + 4} x2="68" y2={104 + crouch} stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round"><animateTransform attributeName="transform" type="translate" values="0 0;0 -22;0 0" dur="1.6s" repeatCount="indefinite" /></line>
        <line x1="108" y1={shoulder + 4} x2="132" y2={104 + crouch} stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round"><animateTransform attributeName="transform" type="translate" values="0 0;0 -22;0 0" dur="1.6s" repeatCount="indefinite" /></line>
        <Joint x={68} y={104 + crouch} /><Joint x={132} y={104 + crouch} />
        {dumbbells && <><circle cx="68" cy={102 + crouch} r="6" fill={COLORS.steelDark} /><circle cx="132" cy={102 + crouch} r="6" fill={COLORS.steelDark} /></>}
      </g>}

      {armMode === "curl" && <g>
        <line x1="92" y1={shoulder + 4} x2="77" y2={121 + crouch} stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round" />
        <line x1="77" y1={121 + crouch} x2="91" y2={94 + crouch} stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" values="0 77 121;-70 77 121;0 77 121" dur="1.5s" repeatCount="indefinite" /></line>
        <line x1="108" y1={shoulder + 4} x2="123" y2={121 + crouch} stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round" />
        <line x1="123" y1={121 + crouch} x2="109" y2={94 + crouch} stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" values="0 123 121;70 123 121;0 123 121" dur="1.5s" repeatCount="indefinite" /></line>
        {dumbbells && <><circle cx="91" cy={94 + crouch} r="6" fill={COLORS.steelDark} /><circle cx="109" cy={94 + crouch} r="6" fill={COLORS.steelDark} /></>}
        {barbell && <line x1="70" y1={129 + crouch} x2="130" y2={129 + crouch} stroke={COLORS.steel} strokeWidth="5" strokeLinecap="round"><animate attributeName="y1" values={`${129 + crouch};${94 + crouch};${129 + crouch}`} dur="1.5s" repeatCount="indefinite" /><animate attributeName="y2" values={`${129 + crouch};${94 + crouch};${129 + crouch}`} dur="1.5s" repeatCount="indefinite" /></line>}
      </g>}

      {armMode === "pushdown" && <g>
        <line x1="92" y1={shoulder + 4} x2="77" y2={112 + crouch} stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round" />
        <line x1="108" y1={shoulder + 4} x2="123" y2={112 + crouch} stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round" />
        <line x1="77" y1={112 + crouch} x2="84" y2={145 + crouch} stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round"><animateTransform attributeName="transform" type="translate" values="0 -8;0 10;0 -8" dur="1.4s" repeatCount="indefinite" /></line>
        <line x1="123" y1={112 + crouch} x2="116" y2={145 + crouch} stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round"><animateTransform attributeName="transform" type="translate" values="0 -8;0 10;0 -8" dur="1.4s" repeatCount="indefinite" /></line>
        <line x1="92" y1="55" x2="108" y2="55" stroke={COLORS.steel} strokeWidth="4" />
      </g>}

      {armMode === "carry" && <g>
        <line x1="92" y1={shoulder + 4} x2="78" y2={132 + crouch} stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round" />
        <line x1="108" y1={shoulder + 4} x2="122" y2={132 + crouch} stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round" />
        <circle cx="72" cy={142 + crouch} r="7" fill={COLORS.steelDark} /><circle cx="128" cy={142 + crouch} r="7" fill={COLORS.steelDark} />
        <animateTransform attributeName="transform" type="translate" values="0 0;7 0;0 0;-7 0;0 0" dur="1.8s" repeatCount="indefinite" />
      </g>}

      <line x1="90" y1={hip} x2="77" y2={190 + crouch} stroke={COLORS.skin} strokeWidth="9" strokeLinecap="round" />
      <line x1="110" y1={hip} x2="123" y2={190 + crouch} stroke={COLORS.skin} strokeWidth="9" strokeLinecap="round" />
      <line x1="77" y1={190 + crouch} x2="73" y2="210" stroke={COLORS.skinDark} strokeWidth="8" strokeLinecap="round" />
      <line x1="123" y1={190 + crouch} x2="127" y2="210" stroke={COLORS.skinDark} strokeWidth="8" strokeLinecap="round" />
      <path d="M66 210 q8 -4 17 0" fill="none" stroke={COLORS.white} strokeWidth="4" strokeLinecap="round" />
      <path d="M117 210 q8 -4 17 0" fill="none" stroke={COLORS.white} strokeWidth="4" strokeLinecap="round" />
      <Joint x={77} y={190 + crouch} /><Joint x={123} y={190 + crouch} />
    </g>
  );

const BenchPose: React.FC<{ incline?: number; dumbbells?: boolean }> = ({ incline = 0, dumbbells = false }) => (
  <g transform={`rotate(${incline} 100 165)`}>
    <rect x="45" y="166" width="110" height="12" rx="6" fill={COLORS.steelDark} />
    <rect x="52" y="160" width="96" height="10" rx="5" fill="#8795A4" />
    <line x1="58" y1="178" x2="58" y2="207" stroke={COLORS.steelDark} strokeWidth="7" />
    <line x1="142" y1="178" x2="142" y2="207" stroke={COLORS.steelDark} strokeWidth="7" />
    <Head x={70} y={141} />
    <path d="M75 151 Q96 141 120 153 L126 169 L82 169 Z" fill={COLORS.shirt} stroke="#476078" strokeWidth="1.5" />
    <MuscleGlow path="M84 154 Q98 148 111 155 L108 166 L88 165 Z" />
    <line x1="88" y1="158" x2="66" y2="137" stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round" />
    <line x1="112" y1="158" x2="134" y2="137" stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round" />
    <line x1="66" y1="137" x2="58" y2="111" stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" values="0 66 137;-25 66 137;0 66 137" dur="1.8s" repeatCount="indefinite" /></line>
    <line x1="134" y1="137" x2="142" y2="111" stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" values="0 134 137;25 134 137;0 134 137" dur="1.8s" repeatCount="indefinite" /></line>
    {dumbbells ? <><circle cx="58" cy="111" r="6" fill={COLORS.steelDark} /><circle cx="142" cy="111" r="6" fill={COLORS.steelDark} /></> : <><line x1="42" y1="107" x2="158" y2="107" stroke={COLORS.steel} strokeWidth="5" strokeLinecap="round" /><circle cx="42" cy="107" r="7" fill={COLORS.steelDark} /><circle cx="158" cy="107" r="7" fill={COLORS.steelDark} /></>}
    <line x1="84" y1="167" x2="77" y2="198" stroke={COLORS.skinDark} strokeWidth="9" /><line x1="114" y1="167" x2="121" y2="198" stroke={COLORS.skinDark} strokeWidth="9" />
  </g>
);

const PushupPose: React.FC = () => (
  <g>
    <Head x={63} y={124} />
    <path d="M73 132 Q106 122 137 140 L148 153 L93 154 L73 143 Z" fill={COLORS.shirt} stroke="#476078" strokeWidth="1.5" />
    <MuscleGlow path="M87 131 L121 129 L129 140 L98 146 Z" />
    <line x1="91" y1="142" x2="83" y2="176" stroke={COLORS.skin} strokeWidth="9" strokeLinecap="round" />
    <line x1="133" y1="144" x2="146" y2="176" stroke={COLORS.skin} strokeWidth="9" strokeLinecap="round" />
    <line x1="83" y1="176" x2="60" y2="176" stroke={COLORS.skinDark} strokeWidth="8" strokeLinecap="round" />
    <line x1="146" y1="176" x2="169" y2="176" stroke={COLORS.skinDark} strokeWidth="8" strokeLinecap="round" />
    <line x1="91" y1="136" x2="106" y2="115" stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" values="0 91 136;24 91 136;0 91 136" dur="1.6s" repeatCount="indefinite" /></line>
    <line x1="125" y1="139" x2="117" y2="116" stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" values="0 125 139;-24 125 139;0 125 139" dur="1.6s" repeatCount="indefinite" /></line>
    <Joint x={91} y={136} /><Joint x={125} y={139} />
    <g transform="translate(0 8)"><animateTransform attributeName="transform" type="translate" values="0 0;0 9;0 0" dur="1.6s" repeatCount="indefinite" /></g>
  </g>
);

const RowPose: React.FC = () => (
  <g transform="rotate(-17 100 145)">
    <Head x={100} y={86} />
    <path d="M88 98 Q100 90 112 98 L117 138 L83 138 Z" fill={COLORS.shirt} stroke="#476078" strokeWidth="1.5" />
    <MuscleGlow path="M91 104 L109 101 L110 122 L90 122 Z" />
    <line x1="92" y1="106" x2="70" y2="126" stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round" />
    <line x1="108" y1="106" x2="130" y2="126" stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round" />
    <line x1="70" y1="126" x2="88" y2="114" stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round"><animateTransform attributeName="transform" type="translate" values="0 5;0 -10;0 5" dur="1.7s" repeatCount="indefinite" /></line>
    <line x1="130" y1="126" x2="112" y2="114" stroke={COLORS.skin} strokeWidth="8" strokeLinecap="round"><animateTransform attributeName="transform" type="translate" values="0 5;0 -10;0 5" dur="1.7s" repeatCount="indefinite" /></line>
    <line x1="85" y1="138" x2="74" y2="206" stroke={COLORS.skinDark} strokeWidth="9" />
    <line x1="115" y1="138" x2="126" y2="206" stroke={COLORS.skinDark} strokeWidth="9" />
    <line x1="50" y1="113" x2="150" y2="113" stroke={COLORS.steel} strokeWidth="5" strokeLinecap="round" />
  </g>
);

const PulldownPose: React.FC = () => (
  <g>
    <line x1="40" y1="50" x2="160" y2="50" stroke={COLORS.steelDark} strokeWidth="7" />
    <line x1="100" y1="50" x2="100" y2="65" stroke={COLORS.steelDark} strokeWidth="4" />
    <line x1="58" y1="56" x2="142" y2="56" stroke={COLORS.steel} strokeWidth="5" />
    <rect x="74" y="172" width="52" height="8" rx="4" fill={COLORS.steelDark} />
    <Head x={100} y={107} />
    <path d="M88 119 Q100 110 112 119 L115 157 L85 157 Z" fill={COLORS.shirt} stroke="#476078" strokeWidth="1.5" />
    <MuscleGlow path="M91 126 L109 123 L109 145 L91 145 Z" />
    <line x1="92" y1="128" x2="76" y2="91" stroke={COLORS.skin} strokeWidth="8" />
    <line x1="108" y1="128" x2="124" y2="91" stroke={COLORS.skin} strokeWidth="8" />
    <line x1="76" y1="91" x2="76" y2="56" stroke={COLORS.skin} strokeWidth="8"><animateTransform attributeName="transform" type="rotate" values="0 76 91;-17 76 91;0 76 91" dur="1.8s" repeatCount="indefinite" /></line>
    <line x1="124" y1="91" x2="124" y2="56" stroke={COLORS.skin} strokeWidth="8"><animateTransform attributeName="transform" type="rotate" values="0 124 91;17 124 91;0 124 91" dur="1.8s" repeatCount="indefinite" /></line>
    <line x1="86" y1="157" x2="84" y2="180" stroke={COLORS.skinDark} strokeWidth="9" /><line x1="114" y1="157" x2="116" y2="180" stroke={COLORS.skinDark} strokeWidth="9" />
  </g>
);

const CorePose: React.FC<{ legRaise?: boolean }> = ({ legRaise = false }) => (
  <g>
    <line x1="65" y1="178" x2="145" y2="178" stroke={COLORS.steelDark} strokeWidth="9" strokeLinecap="round" />
    <Head x={62} y={153} />
    <path d="M71 160 Q104 144 133 163 L140 180 L83 183 Z" fill={COLORS.shirt} stroke="#476078" strokeWidth="1.5" />
    <MuscleGlow path="M86 157 Q108 148 127 162 L122 175 L94 176 Z" />
    <line x1="91" y1="176" x2="75" y2="202" stroke={COLORS.skinDark} strokeWidth="9" />
    <line x1="117" y1="177" x2="138" y2="202" stroke={COLORS.skinDark} strokeWidth="9" />
    {legRaise ? <g><line x1="77" y1="202" x2="62" y2="167" stroke={COLORS.skinDark} strokeWidth="9"><animateTransform attributeName="transform" type="rotate" values="0 77 202;-22 77 202;0 77 202" dur="1.8s" repeatCount="indefinite" /></line><line x1="138" y1="202" x2="153" y2="167" stroke={COLORS.skinDark} strokeWidth="9"><animateTransform attributeName="transform" type="rotate" values="0 138 202;22 138 202;0 138 202" dur="1.8s" repeatCount="indefinite" /></line></g> : <g><animateTransform attributeName="transform" type="rotate" values="0 111 175;-12 111 175;0 111 175" dur="1.5s" repeatCount="indefinite" /></g>}
  </g>
);

const SquatPose: React.FC<{ lunge?: boolean; step?: boolean }> = ({ lunge = false, step = false }) => (
  <g>
    <rect x="130" y="174" width="42" height="26" rx="3" fill={COLORS.steelDark} opacity={step ? 1 : 0} />
    <g>
      <StandingMan crouch={lunge ? 10 : 0} armMode="down" dumbbells={lunge} barbell={!lunge && !step} highlight="legs" />
      <animateTransform attributeName="transform" type="translate" values="0 0;0 24;0 0" dur={lunge ? "1.8s" : step ? "1.7s" : "1.9s"} repeatCount="indefinite" />
    </g>
    {lunge && <line x1="104" y1="154" x2="149" y2="188" stroke={COLORS.skinDark} strokeWidth="9"><animateTransform attributeName="transform" type="translate" values="0 0;12 10;0 0" dur="1.8s" repeatCount="indefinite" /></line>}
    {step && <line x1="108" y1="151" x2="138" y2="177" stroke={COLORS.skinDark} strokeWidth="9"><animateTransform attributeName="transform" type="translate" values="0 15;0 0;0 15" dur="1.7s" repeatCount="indefinite" /></line>}
  </g>
);

const HingePose: React.FC = () => (
  <g>
    <g><StandingMan groupTransform="rotate(18 100 151)" armMode="down" dumbbells highlight="legs" /><animateTransform attributeName="transform" type="rotate" values="0 100 151;10 100 151;0 100 151; -10 100 151;0 100 151" dur="1.9s" repeatCount="indefinite" /></g>
    <line x1="60" y1="188" x2="140" y2="188" stroke={COLORS.steel} strokeWidth="5" /><circle cx="60" cy="188" r="7" fill={COLORS.steelDark}/><circle cx="140" cy="188" r="7" fill={COLORS.steelDark}/>
  </g>
);

const CardioPose: React.FC = () => (
  <g>
    <g><StandingMan armMode="side" highlight="legs" /><animateTransform attributeName="transform" type="scale" values="1 1;1.05 1.04;1 1" dur="1.0s" repeatCount="indefinite" /></g>
    <g opacity="0.55"><path d="M52 76 Q38 66 30 48" fill="none" stroke={COLORS.orange} strokeWidth="2.5" strokeDasharray="5 4"><animate attributeName="opacity" values="0.15;0.8;0.15" dur="1s" repeatCount="indefinite" /></path><path d="M148 76 Q162 66 170 48" fill="none" stroke={COLORS.orange} strokeWidth="2.5" strokeDasharray="5 4"><animate attributeName="opacity" values="0.8;0.15;0.8" dur="1s" repeatCount="indefinite" /></path></g>
  </g>
);

const CarryPose: React.FC = () => (
  <g><StandingMan armMode="carry" highlight="shoulders" /><path d="M58 191 H170" stroke={COLORS.orange} strokeWidth="2" strokeDasharray="4 5"><animate attributeName="strokeDashoffset" values="0;-36" dur="0.8s" repeatCount="indefinite" /></path></g>
);

export interface PremiumExerciseIllustrationProps {
  exerciseId?: string;
  exerciseName?: string;
  muscleGroup?: string;
  className?: string;
}

export const PremiumExerciseIllustration: React.FC<PremiumExerciseIllustrationProps> = ({ exerciseId, exerciseName = "Exercice", muscleGroup = "Mouvement", className = "" }) => {
  const spec = useMemo(() => classifyExerciseMotion(exerciseId, exerciseName, muscleGroup), [exerciseId, exerciseName, muscleGroup]);

  const visual = (() => {
    switch (spec.family) {
      case "benchPress": return <BenchPose dumbbells={/halt/i.test(spec.label)} />;
      case "inclinePress": return <BenchPose incline={-16} dumbbells />;
      case "pushup": return <PushupPose />;
      case "dip": return <g transform="translate(0 2)"><line x1="62" y1="66" x2="62" y2="190" stroke={COLORS.steel} strokeWidth="7"/><line x1="138" y1="66" x2="138" y2="190" stroke={COLORS.steel} strokeWidth="7"/><line x1="56" y1="82" x2="144" y2="82" stroke={COLORS.steel} strokeWidth="7"/><g><Head x={100} y={106}/><path d="M89 119 Q100 112 111 119 L116 155 L84 155 Z" fill={COLORS.shirt}/><MuscleGlow path="M90 126 Q100 120 110 126 L108 140 L92 140 Z"/><line x1="90" y1="126" x2="76" y2="101" stroke={COLORS.skin} strokeWidth="8"/><line x1="110" y1="126" x2="124" y2="101" stroke={COLORS.skin} strokeWidth="8"/><line x1="84" y1="155" x2="70" y2="190" stroke={COLORS.skinDark} strokeWidth="9"/><line x1="116" y1="155" x2="130" y2="190" stroke={COLORS.skinDark} strokeWidth="9"/><animateTransform attributeName="transform" type="translate" values="0 0;0 18;0 0" dur="1.6s" repeatCount="indefinite"/></g></g>;
      case "pulldown": return <PulldownPose />;
      case "row": return <RowPose />;
      case "pullup": return <g><line x1="42" y1="54" x2="158" y2="54" stroke={COLORS.steel} strokeWidth="7"/><g><Head x={100} y={95}/><path d="M88 108 Q100 100 112 108 L116 148 L84 148 Z" fill={COLORS.shirt}/><MuscleGlow path="M91 116 L109 112 L108 135 L92 135 Z"/><line x1="92" y1="114" x2="77" y2="72" stroke={COLORS.skin} strokeWidth="8"/><line x1="108" y1="114" x2="123" y2="72" stroke={COLORS.skin} strokeWidth="8"/><line x1="84" y1="148" x2="74" y2="190" stroke={COLORS.skinDark} strokeWidth="9"/><line x1="116" y1="148" x2="126" y2="190" stroke={COLORS.skinDark} strokeWidth="9"/><animateTransform attributeName="transform" type="translate" values="0 14;0 -6;0 14" dur="1.8s" repeatCount="indefinite"/></g></g>;
      case "shoulderPress": return <StandingMan armMode="press" dumbbells={/halt/i.test(spec.label)} barbell={!/halt/i.test(spec.label)} highlight="shoulders" />;
      case "lateralRaise": return <StandingMan armMode="side" dumbbells highlight="shoulders" />;
      case "curl": return <StandingMan armMode="curl" dumbbells={/halt/i.test(spec.label)} barbell={!/halt/i.test(spec.label)} highlight="biceps" />;
      case "triceps": return <StandingMan armMode="pushdown" highlight="triceps" />;
      case "squat": return <SquatPose />;
      case "lunge": return <SquatPose lunge />;
      case "stepUp": return <SquatPose step />;
      case "hinge": return <HingePose />;
      case "legPress": return <g><path d="M44 188 L72 110 L146 110 L166 188 Z" fill={COLORS.panel2} stroke={COLORS.steelDark} strokeWidth="3"/><Head x={76} y={132}/><path d="M76 145 Q92 137 109 147 L118 167 L88 169 Z" fill={COLORS.shirt}/><MuscleGlow path="M89 147 Q101 141 110 148 L105 160 L94 161 Z"/><line x1="110" y1="154" x2="140" y2="139" stroke={COLORS.skin} strokeWidth="9"><animateTransform attributeName="transform" type="translate" values="0 0;-14 12;0 0" dur="1.9s" repeatCount="indefinite" /></line><line x1="140" y1="139" x2="158" y2="122" stroke={COLORS.skinDark} strokeWidth="9"><animateTransform attributeName="transform" type="translate" values="0 0;-14 12;0 0" dur="1.9s" repeatCount="indefinite" /></line><circle cx="156" cy="116" r="14" fill={COLORS.steelDark}/></g>;
      case "calfRaise": return <StandingMan armMode="down" highlight="legs" />;
      case "gluteBridge": return <g><Head x={52} y={166}/><path d="M63 160 Q98 146 128 164 L138 179 L78 182 Z" fill={COLORS.shirt}/><MuscleGlow path="M84 157 Q109 149 126 165 L118 176 L91 177 Z"/><line x1="87" y1="178" x2="70" y2="203" stroke={COLORS.skinDark} strokeWidth="9"/><line x1="119" y1="178" x2="141" y2="203" stroke={COLORS.skinDark} strokeWidth="9"/><animateTransform attributeName="transform" type="translate" values="0 8;0 -10;0 8" dur="1.6s" repeatCount="indefinite"/></g>;
      case "gluteKickback": return <g><StandingMan armMode="down"/><line x1="100" y1="151" x2="143" y2="184" stroke={COLORS.skinDark} strokeWidth="9"><animateTransform attributeName="transform" type="rotate" values="0 100 151;-25 100 151;0 100 151" dur="1.5s" repeatCount="indefinite"/></line><MuscleGlow path="M90 146 Q104 141 113 149 L107 161 L94 158 Z"/></g>;
      case "core": return <CorePose />;
      case "plank": return <g transform="translate(0 -4)"><path d="M54 154 L145 127" stroke={COLORS.skin} strokeWidth="12" strokeLinecap="round"/><Head x={153} y={124}/><MuscleGlow path="M86 143 L126 131 L130 143 L92 154 Z"/><line x1="70" y1="150" x2="52" y2="178" stroke={COLORS.skinDark} strokeWidth="9"/><line x1="92" y1="143" x2="70" y2="180" stroke={COLORS.skinDark} strokeWidth="9"/><line x1="141" y1="130" x2="164" y2="154" stroke={COLORS.skinDark} strokeWidth="8"/><animateTransform attributeName="transform" type="translate" values="0 0;0 -2;0 0" dur="2.2s" repeatCount="indefinite"/></g>;
      case "legRaise": return <CorePose legRaise />;
      case "cardio": return <CardioPose />;
      case "carry": return <CarryPose />;
      default: return <StandingMan armMode="down" highlight="none" />;
    }
  })();

  return (
    <div className={`w-full h-full rounded-3xl overflow-hidden ${className}`}>
      <svg viewBox="0 0 200 250" className="w-full h-full" role="img" aria-label={`${spec.label} — animation premium`}>
        <defs>
          <linearGradient id="premiumBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0F151C" />
            <stop offset="100%" stopColor="#1B2430" />
          </linearGradient>
          <radialGradient id="premiumSpot" cx="70%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#FF6A1A" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#FF6A1A" stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="200" height="250" fill="url(#premiumBg)" />
        <circle cx="150" cy="68" r="74" fill="url(#premiumSpot)" />
        <path d="M16 204 H184" stroke="#2D3B49" strokeWidth="2" strokeDasharray="4 5" />
        <Badge spec={spec} />
        <g filter="url(#softGlow)">{visual}</g>
        <Floor />
        <Timeline />
      </svg>
    </div>
  );
};

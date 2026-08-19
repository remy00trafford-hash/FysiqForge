import React, { useMemo } from "react";
import { resolveExerciseAnimationId } from "../data/exerciseAnimationMap";

export type PoseCategory =
  | "push"
  | "pull"
  | "squat"
  | "lunge"
  | "core"
  | "hinge"
  | "cardio"
  | "stretch"
  | "shoulder"
  | "arm";

const BG = "#17110D";
const PANEL = "#25180F";
const BODY = "#F6D7C1";
const BODY_DARK = "#D89A79";
const CLOTH = "#DDE6F5";
const ACCENT = "#FF8A3D";
const ACCENT_SOFT = "#FF6B2C";
const EQUIP = "#C8D0DA";
const EQUIP_DARK = "#66707A";
const MUSCLE = "#FF5D2A";
const GRID = "#3B2B20";

type MotionKind =
  | "barbellCurl"
  | "bench"
  | "bentRow"
  | "bodyBulgarian"
  | "bulgarian"
  | "burpee"
  | "calfRaise"
  | "chairDip"
  | "classicPushup"
  | "closeGripPushup"
  | "crossover"
  | "crunch"
  | "dips"
  | "doorCurl"
  | "dumbbellBench"
  | "dumbbellFly"
  | "dumbbellHammer"
  | "dumbbellRdl"
  | "dumbbellShoulder"
  | "facePull"
  | "farmerCarry"
  | "fireHydrant"
  | "gluteBridge"
  | "gluteKickback"
  | "gobletSquat"
  | "hammerCurl"
  | "hollowBody"
  | "inclinePress"
  | "invertedRow"
  | "jumpingJack"
  | "latPulldown"
  | "lateralRaise"
  | "legPress"
  | "legRaise"
  | "mountainClimber"
  | "oneArmRow"
  | "overheadPress"
  | "pikePushup"
  | "pistol"
  | "plank"
  | "pullups"
  | "pushUp"
  | "rdl"
  | "reverseLunge"
  | "seatedRow"
  | "sidePlank"
  | "squat"
  | "stepUp"
  | "superman"
  | "tempoSquat"
  | "tricepsExtension"
  | "tricepsPushdown"
  | "walkingLunge"
  | "wallSit"
;
interface ExerciseMotionSpec {
  kind: MotionKind;
  label: string;
  muscle: string;
  duration: string;
}

/**
 * Each exercise in the current database gets its own animation spec.
 * The rendering engine is shared for safety/maintainability, but the motion,
 * body position, equipment and highlighted target are exercise-specific.
 */
const EXERCISE_MOTIONS: Record<string, ExerciseMotionSpec> = {
  bench_press: { kind: "bench", label: "DÉVELOPPÉ COUCHÉ", muscle: "PECTORAUX", duration: "1.8s" },
  incline_dumbbell: { kind: "inclinePress", label: "DÉVELOPPÉ INCLINÉ", muscle: "PECTORAUX SUP.", duration: "1.8s" },
  cable_crossover: { kind: "crossover", label: "ÉCARTÉ POULIE", muscle: "PECTORAUX", duration: "1.8s" },
  dips_chest: { kind: "dips", label: "DIPS PECTORaux", muscle: "PECTORAUX / TRICEPS", duration: "1.6s" },
  lat_pulldown: { kind: "latPulldown", label: "TIRAGE VERTICAL", muscle: "GRAND DORSAL", duration: "1.8s" },
  bent_over_row: { kind: "bentRow", label: "ROWING BARRE", muscle: "DOS", duration: "1.8s" },
  seated_cable_row: { kind: "seatedRow", label: "ROWING POULIE", muscle: "DOS", duration: "1.8s" },
  pullups_bodyweight: { kind: "pullups", label: "TRACTIONS", muscle: "DOS / BICEPS", duration: "1.8s" },
  overhead_press: { kind: "overheadPress", label: "DÉVELOPPÉ MILITAIRE", muscle: "ÉPAULES", duration: "1.8s" },
  lateral_raises: { kind: "lateralRaise", label: "ÉLÉVATIONS LATÉRALES", muscle: "DELTOÏDES", duration: "1.5s" },
  face_pulls: { kind: "facePull", label: "FACE PULL", muscle: "ARRIÈRE ÉPAULE", duration: "1.7s" },
  squat_barbell: { kind: "squat", label: "BACK SQUAT", muscle: "QUADRICEPS / FESSIERS", duration: "1.9s" },
  leg_press: { kind: "legPress", label: "PRESSE À CUISSES", muscle: "QUADRICEPS", duration: "1.9s" },
  romanian_deadlift: { kind: "rdl", label: "SOULEVÉ DE TERRE", muscle: "ISCHIOS / FESSIERS", duration: "1.9s" },
  bulgarian_split_squat: { kind: "bulgarian", label: "SPLIT SQUAT", muscle: "JAMBES", duration: "1.8s" },
  barbell_curl: { kind: "barbellCurl", label: "CURL BARRE", muscle: "BICEPS", duration: "1.5s" },
  hammer_curl: { kind: "hammerCurl", label: "CURL MARTEAU", muscle: "BICEPS / AVANT-BRAS", duration: "1.5s" },
  triceps_pushdown: { kind: "tricepsPushdown", label: "PUSH-DOWN TRICEPS", muscle: "TRICEPS", duration: "1.4s" },
  plank_abs: { kind: "plank", label: "GAINAGE", muscle: "CORE", duration: "2.2s" },
  hanging_leg_raise: { kind: "legRaise", label: "RELEVÉ DE JAMBES", muscle: "ABDOS", duration: "1.8s" },

  // Home / dumbbell variants: each exercise gets its own animation identity.
  bw_pushup_decline: { kind: "pushUp", label: "POMPES PIEDS SURÉLEVÉS", muscle: "PECTORAUX SUP.", duration: "1.7s" },
  bw_dips_chair: { kind: "chairDip", label: "DIPS SUR CHAISE", muscle: "TRICEPS / PECTORAUX", duration: "1.6s" },
  bw_pike_pushup: { kind: "pikePushup", label: "PIKE PUSH-UP", muscle: "ÉPAULES", duration: "1.7s" },
  bw_inverted_row: { kind: "invertedRow", label: "ROWING INVERSÉ", muscle: "DOS / BICEPS", duration: "1.7s" },
  bw_door_biceps: { kind: "doorCurl", label: "TRACTION BICEPS À LA PORTE", muscle: "BICEPS", duration: "1.6s" },
  bw_pistol_squat: { kind: "pistol", label: "PISTOL SQUAT ASSISTÉ", muscle: "QUADRICEPS / FESSIERS", duration: "1.9s" },
  bw_bulgarian_split: { kind: "bodyBulgarian", label: "SQUAT BULGARE AU POIDS DU CORPS", muscle: "JAMBES / FESSIERS", duration: "1.8s" },
  db_bench_press: { kind: "dumbbellBench", label: "DÉVELOPPÉ COUCHÉ HALTÈRES", muscle: "PECTORAUX / TRICEPS", duration: "1.8s" },
  db_incline_fly: { kind: "dumbbellFly", label: "ÉCARTÉ INCLINÉ HALTÈRES", muscle: "PECTORAUX SUP.", duration: "1.8s" },
  db_shoulder_press: { kind: "dumbbellShoulder", label: "DÉVELOPPÉ ÉPAULES HALTÈRES", muscle: "DELTOÏDES / TRICEPS", duration: "1.8s" },
  db_one_arm_row: { kind: "oneArmRow", label: "ROWING UN BRAS HALTÈRE", muscle: "GRAND DORSAL", duration: "1.7s" },
  db_hammer_curl: { kind: "dumbbellHammer", label: "CURL MARTEAU HALTÈRES", muscle: "BICEPS / AVANT-BRAS", duration: "1.5s" },
  db_goblet_squat: { kind: "gobletSquat", label: "GOBLET SQUAT", muscle: "QUADRICEPS / FESSIERS", duration: "1.9s" },
  db_romanian_deadlift: { kind: "dumbbellRdl", label: "SOULÈVEMENT DE TERRE ROUMAIN HALTÈRES", muscle: "ISCHIOS / FESSIERS", duration: "1.9s" },
  bw_classic_pushup: { kind: "classicPushup", label: "POMPES CLASSIQUES", muscle: "PECTORAUX / TRICEPS", duration: "1.6s" },
  bw_walking_lunge: { kind: "walkingLunge", label: "FENTES MARCHÉES", muscle: "QUADRICEPS / FESSIERS", duration: "1.8s" },
  bw_glute_bridge: { kind: "gluteBridge", label: "PONT FESSIER", muscle: "FESSIERS / ISCHIOS", duration: "1.6s" },
  bw_mountain_climber: { kind: "mountainClimber", label: "MOUNTAIN CLIMBERS", muscle: "CORE / CARDIO", duration: "1.2s" },
  bw_jumping_jacks: { kind: "jumpingJack", label: "JUMPING JACKS", muscle: "CARDIO", duration: "1.0s" },
  bw_burpee: { kind: "burpee", label: "BURPEES", muscle: "FULL BODY / CARDIO", duration: "1.8s" },
  bw_wall_sit: { kind: "wallSit", label: "CHAISE MURALE", muscle: "QUADRICEPS", duration: "2.2s" },
  bw_crunch: { kind: "crunch", label: "CRUNCHS", muscle: "ABDOMINAUX", duration: "1.5s" },
  bw_superman: { kind: "superman", label: "SUPERMAN", muscle: "LOMBAIRES / FESSIERS", duration: "1.6s" },
  bw_side_plank: { kind: "sidePlank", label: "GAINAGE LATÉRAL", muscle: "OBLIQUES / CORE", duration: "2.0s" },
  bw_step_up: { kind: "stepUp", label: "STEP-UP", muscle: "QUADRICEPS / FESSIERS", duration: "1.7s" },
  bw_tempo_squat: { kind: "tempoSquat", label: "SQUAT TEMPO", muscle: "QUADRICEPS / FESSIERS", duration: "2.4s" },
  bw_glute_kickback: { kind: "gluteKickback", label: "GLUTE KICKBACK", muscle: "FESSIERS", duration: "1.5s" },
  bw_fire_hydrant: { kind: "fireHydrant", label: "FIRE HYDRANT", muscle: "FESSIERS / HANCHE", duration: "1.5s" },
  bw_calf_raise: { kind: "calfRaise", label: "MOLLETS DEBOUT", muscle: "MOLLETS", duration: "1.4s" },
  bw_hollow_body: { kind: "hollowBody", label: "HOLLOW BODY HOLD", muscle: "CORE", duration: "2.0s" },
  bw_reverse_lunge: { kind: "reverseLunge", label: "FENTES ARRIÈRE", muscle: "QUADRICEPS / FESSIERS", duration: "1.8s" },
  bw_close_grip_pushup: { kind: "closeGripPushup", label: "POMPES PRISE SERRÉE", muscle: "TRICEPS / PECTORAUX", duration: "1.6s" },
  triceps_extension_barbell: { kind: "tricepsExtension", label: "EXTENSION TRICEPS BARRE AU FRONT", muscle: "TRICEPS", duration: "1.6s" },
  farmer_carry: { kind: "farmerCarry", label: "FARMER'S CARRY", muscle: "PRISE / TRAPÈZES", duration: "1.4s" }
};

export function classifyExercisePose(name: string, muscleGroup?: string): PoseCategory {
  const nameText = name.toLowerCase();
  const muscleText = (muscleGroup || "").toLowerCase();
  const text = `${nameText} ${muscleText}`;

  if (/curl de poignet|wrist curl|poignet curl|flexion de poignet|extension de poignet/.test(nameText)) return "stretch";
  if (/curl marteau|hammer curl|curl biceps|biceps curl|curl à la barre|curl aux haltères|curl|biceps|triceps|pushdown|extension triceps|triceps extension|skull crusher|kickback/.test(nameText)) return "arm";
  if (/avant-bras|forearm|poignet|wrist|portage|carry|farmer['’]?s (carry|walk)|walk|préhension|grip/.test(text)) return "stretch";
  if (/mollet|calf/.test(text)) return "stretch";
  if (/fente|lunge|split squat|squat bulgare|bulgarian split squat|step[- ]?up/.test(nameText)) return "lunge";
  if (/kettlebell|swing|snatch|clean|arraché/.test(text)) return "hinge";
  if (/soulevé de terre|deadlift|hinge|romanian|good morning|hip thrust|pont fessier|bridge/.test(text)) return "hinge";
  if (/développé militaire|military press|overhead press|shoulder press|arnold press|élévation[s]? latérale|lateral raise[s]?|front raise[s]?|élévation[s]? frontale|oiseau|reverse fly|face pull|shrug|haussement d'épaule/.test(nameText)) return "shoulder";
  if (/trapèze|shrug|haussement d'épaule/.test(text)) return "shoulder";
  if (/leg press|presse à cuisses|hack squat|sissy squat/.test(nameText)) return "squat";
  if (/développé|bench|incliné|incline|décliné|decline|push[- ]?up|pompe|dip|dips|pectoraux|chest|pec deck|écarté|crossover|presse à poitrine/.test(nameText)) return "push";
  if (/tirage|row|rowing|pulldown|pull-up|pull up|traction|lat pulldown/.test(nameText) || /dorsal|dos/.test(muscleText)) return "pull";
  if (/squat|wall sit|chaise murale/.test(nameText) || /quadriceps|fessiers|ischio/.test(muscleText)) return "squat";
  if (/gainage|plank|planche|crunch|abdo|core|obliq|russian twist|rotation russe|relevé de jambes|leg raise/.test(nameText) || /abdominal|transverse|sangle abdominale|grand droit|oblique/.test(muscleText)) return "core";
  if (/jumping jack|mountain climber|cardio|saut|jump|burpee|corde|vélo|cycling|rameur|running|course/.test(text)) return "cardio";
  return "stretch";
}

interface ExercisePoseIllustrationProps {
  pose: PoseCategory;
  exerciseId?: string;
  exerciseName?: string;
  muscleGroup?: string;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const Joint: React.FC<{ cx: number; cy: number; r?: number }> = ({ cx, cy, r = 4.2 }) => (
  <circle cx={cx} cy={cy} r={r} fill={BODY} stroke="#9B5A3D" strokeWidth="1.4" />
);

const Head: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <circle cx={cx} cy={cy} r="11" fill={BODY} stroke="#9B5A3D" strokeWidth="2" />
);

const MusclePatch: React.FC<{ d: string; opacity?: number }> = ({ d, opacity = 0.92 }) => (
  <path d={d} fill={MUSCLE} opacity={opacity} />
);

const Legend: React.FC<{ label: string; muscle: string }> = ({ label, muscle }) => (
  <g>
    <rect x="12" y="12" width="176" height="42" rx="12" fill="#0D0B09" opacity="0.88" />
    <text x="22" y="29" fill="#fff" fontSize="8.5" fontWeight="900" letterSpacing="1.1">{label}</text>
    <circle cx="174" cy="26" r="4" fill={MUSCLE} />
    <text x="22" y="43" fill="#F2C7AE" fontSize="7.2" fontWeight="700">{muscle}</text>
  </g>
);

const MotionDots: React.FC = ({}) => (
  <g>
    <line x1="30" y1="224" x2="170" y2="224" stroke={GRID} strokeWidth="3" strokeLinecap="round" />
    <circle cx="30" cy="224" r="4" fill={ACCENT} />
    <circle cx="100" cy="224" r="4" fill="#6C7A86" />
    <circle cx="170" cy="224" r="4" fill="#6C7A86" />
    <circle cx="30" cy="224" r="5" fill={ACCENT} opacity="0.15">
      <animate attributeName="cx" values="30;100;170;100;30" dur="2s" repeatCount="indefinite" />
    </circle>
  </g>
);

const ArrowCue: React.FC<{ x: number; y1: number; y2: number; flip?: boolean }> = ({ x, y1, y2, flip }) => (
  <g opacity="0.85">
    <line x1={x} y1={y1} x2={x} y2={y2} stroke={ACCENT} strokeWidth="3" strokeLinecap="round">
      <animate attributeName="y2" values={`${y2};${flip ? y2 - 5 : y2 + 5};${y2}`} dur="1.2s" repeatCount="indefinite" />
    </line>
    <polyline points={`${x - 5},${y2 - (flip ? 7 : 0)} ${x},${y2} ${x + 5},${y2 - (flip ? 7 : 0)}`} fill="none" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

const BenchBody: React.FC<{ incline?: number; animation?: "press" | "crossover" | "dips" }> = ({ incline = 0, animation = "press" }) => (
  <g transform={`rotate(${incline} 105 165)`}>
    <rect x="52" y="170" width="105" height="12" rx="6" fill={EQUIP_DARK} />
    <rect x="57" y="165" width="96" height="9" rx="4" fill="#9098A1" />
    <line x1="65" y1="182" x2="65" y2="214" stroke={EQUIP_DARK} strokeWidth="7" />
    <line x1="145" y1="182" x2="145" y2="214" stroke={EQUIP_DARK} strokeWidth="7" />
  </g>
);

const SvgFrame: React.FC<{ spec: ExerciseMotionSpec; children: React.ReactNode }> = ({ spec, children }) => (
  <div className="w-full h-full flex items-center justify-center bg-[#1A120C]">
    <svg viewBox="0 0 200 240" className="w-56 h-56 sm:w-64 sm:h-64" role="img" aria-label={`${spec.label} – animation instructive`}>
      <defs>
        <filter id="premiumGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect x="0" y="0" width="200" height="240" rx="18" fill={BG} />
      <circle cx="156" cy="76" r="54" fill={PANEL} opacity="0.82" />
      <path d="M18 206 H182" stroke={GRID} strokeWidth="2" strokeDasharray="4 4" />
      {children}
      <Legend label={spec.label} muscle={spec.muscle} />
      <MotionDots />
    </svg>
  </div>
);

const StandingBody: React.FC<{ crouch?: number; lean?: number; arms: "down" | "press" | "side" | "curl" | "pushdown"; dumbbells?: boolean; barbell?: boolean }> = ({ crouch = 0, lean = 0, arms, dumbbells = false, barbell = false }) => {
  const torsoY = 118 + crouch;
  const hipY = 150 + crouch;
  const shoulderY = 88 + crouch;
  const headY = 62 + crouch;
  return (
    <g transform={`rotate(${lean} 100 ${hipY})`}>
      {barbell && <>
        <line x1="55" y1={shoulderY - 4} x2="145" y2={shoulderY - 4} stroke={EQUIP} strokeWidth="5" strokeLinecap="round" filter="url(#premiumGlow)" />
        <circle cx="55" cy={shoulderY - 4} r="8" fill={EQUIP_DARK} /><circle cx="145" cy={shoulderY - 4} r="8" fill={EQUIP_DARK} />
      </>}
      <Head cx={100} cy={headY} />
      <path d={`M88 ${shoulderY} Q100 ${shoulderY - 8} 112 ${shoulderY} L118 ${torsoY} Q100 ${torsoY + 10} 82 ${torsoY} Z`} fill={CLOTH} stroke="#8E9DAF" strokeWidth="1.5" />
      <MusclePatch d={`M91 ${shoulderY + 5} Q100 ${shoulderY - 2} 109 ${shoulderY + 5} L106 ${torsoY - 10} Q100 ${torsoY - 14} 94 ${torsoY - 10} Z`} />
      <line x1="100" y1={torsoY} x2="100" y2={hipY} stroke={BODY_DARK} strokeWidth="8" strokeLinecap="round" />
      <Joint cx={100} cy={shoulderY} /><Joint cx={100} cy={hipY} />
      {arms === "down" && <>
        <line x1="92" y1={shoulderY + 3} x2="76" y2={118 + crouch} stroke={BODY} strokeWidth="7" strokeLinecap="round" />
        <line x1="108" y1={shoulderY + 3} x2="124" y2={118 + crouch} stroke={BODY} strokeWidth="7" strokeLinecap="round" />
        <Joint cx={76} cy={118 + crouch} /><Joint cx={124} cy={118 + crouch} />
        {dumbbells && <><circle cx="74" cy={130 + crouch} r="5" fill={EQUIP} /><circle cx="126" cy={130 + crouch} r="5" fill={EQUIP} /></>}
      </>}
      {arms === "press" && <>
        <g>
          <line x1="92" y1={shoulderY + 4} x2="82" y2={70 + crouch} stroke={BODY} strokeWidth="7" strokeLinecap="round">
            <animateTransform attributeName="transform" type="translate" values="0 12;0 -2;0 12" dur="1.8s" repeatCount="indefinite" />
          </line>
          <line x1="108" y1={shoulderY + 4} x2="118" y2={70 + crouch} stroke={BODY} strokeWidth="7" strokeLinecap="round">
            <animateTransform attributeName="transform" type="translate" values="0 12;0 -2;0 12" dur="1.8s" repeatCount="indefinite" />
          </line>
          <Joint cx={82} cy={70 + crouch} /><Joint cx={118} cy={70 + crouch} />
        </g>
      </>}
      {arms === "side" && <>
        <g>
          <line x1="92" y1={shoulderY + 3} x2="70" y2={105 + crouch} stroke={BODY} strokeWidth="7" strokeLinecap="round">
            <animateTransform attributeName="transform" type="translate" values="0 0; 0 -25; 0 0" dur="1.5s" repeatCount="indefinite" />
          </line>
          <line x1="108" y1={shoulderY + 3} x2="130" y2={105 + crouch} stroke={BODY} strokeWidth="7" strokeLinecap="round">
            <animateTransform attributeName="transform" type="translate" values="0 0; 0 -25; 0 0" dur="1.5s" repeatCount="indefinite" />
          </line>
          <Joint cx={70} cy={105 + crouch} /><Joint cx={130} cy={105 + crouch} />
        </g>
      </>}
      {arms === "curl" && <>
        <g>
          <line x1="92" y1={shoulderY + 4} x2="76" y2={118 + crouch} stroke={BODY} strokeWidth="7" strokeLinecap="round" />
          <line x1="76" y1={118 + crouch} x2="91" y2={92 + crouch} stroke={BODY} strokeWidth="7" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" values="0 76 118; -72 76 118; 0 76 118" dur="1.5s" repeatCount="indefinite" />
          </line>
          <line x1="108" y1={shoulderY + 4} x2="124" y2={118 + crouch} stroke={BODY} strokeWidth="7" strokeLinecap="round" />
          <line x1="124" y1={118 + crouch} x2="109" y2={92 + crouch} stroke={BODY} strokeWidth="7" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" values="0 124 118; 72 124 118; 0 124 118" dur="1.5s" repeatCount="indefinite" />
          </line>
        </g>
        {dumbbells && <><circle cx="91" cy="91" r="5" fill={EQUIP} /><circle cx="109" cy="91" r="5" fill={EQUIP} /></>}
      </>}
      {arms === "pushdown" && <>
        <line x1="92" y1={shoulderY + 4} x2="78" y2={111 + crouch} stroke={BODY} strokeWidth="7" strokeLinecap="round" />
        <line x1="108" y1={shoulderY + 4} x2="122" y2={111 + crouch} stroke={BODY} strokeWidth="7" strokeLinecap="round" />
        <line x1="78" y1={111 + crouch} x2="84" y2={140 + crouch} stroke={BODY} strokeWidth="7" strokeLinecap="round">
          <animateTransform attributeName="transform" type="translate" values="0 -10;0 8;0 -10" dur="1.4s" repeatCount="indefinite" />
        </line>
        <line x1="122" y1={111 + crouch} x2="116" y2={140 + crouch} stroke={BODY} strokeWidth="7" strokeLinecap="round">
          <animateTransform attributeName="transform" type="translate" values="0 -10;0 8;0 -10" dur="1.4s" repeatCount="indefinite" />
        </line>
        <circle cx="84" cy={143 + crouch} r="4" fill={EQUIP} /><circle cx="116" cy={143 + crouch} r="4" fill={EQUIP} />
      </>}
      <line x1="90" y1={hipY} x2="76" y2={188 + crouch} stroke={BODY} strokeWidth="8" strokeLinecap="round" />
      <line x1="110" y1={hipY} x2="124" y2={188 + crouch} stroke={BODY} strokeWidth="8" strokeLinecap="round" />
      <line x1="76" y1={188 + crouch} x2="73" y2={218} stroke={BODY_DARK} strokeWidth="7" strokeLinecap="round" />
      <line x1="124" y1={188 + crouch} x2="127" y2={218} stroke={BODY_DARK} strokeWidth="7" strokeLinecap="round" />
      <Joint cx={76} cy={188 + crouch} /><Joint cx={124} cy={188 + crouch} />
    </g>
  );
};

const RenderMotion: React.FC<{ spec: ExerciseMotionSpec }> = ({ spec }) => {
  switch (spec.kind) {
    case "bench":
      return <>
        <BenchBody />
        <g>
          <Head cx={72} cy={143} />
          <path d="M70 158 Q90 148 108 158 L116 170 L76 170 Z" fill={CLOTH} />
          <MusclePatch d="M79 157 Q92 152 104 158 L100 166 L82 166 Z" />
          <line x1="104" y1="160" x2="128" y2="138" stroke={BODY} strokeWidth="7" strokeLinecap="round" />
          <line x1="128" y1="138" x2="138" y2="116" stroke={BODY} strokeWidth="7" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" values="0 128 138; -28 128 138; 0 128 138" dur={spec.duration} repeatCount="indefinite" />
          </line>
          <line x1="82" y1="160" x2="60" y2="139" stroke={BODY} strokeWidth="7" strokeLinecap="round" />
          <line x1="60" y1="139" x2="50" y2="116" stroke={BODY} strokeWidth="7" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" values="0 60 139; 28 60 139; 0 60 139" dur={spec.duration} repeatCount="indefinite" />
          </line>
          <line x1="45" y1="110" x2="155" y2="110" stroke={EQUIP} strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="45" cy="110" r="7" fill={EQUIP_DARK} /><circle cx="155" cy="110" r="7" fill={EQUIP_DARK} />
        </g>
        <ArrowCue x={166} y1={88} y2={122} />
      </>;
    case "inclinePress":
      return <>
        <BenchBody incline={-18} />
        <Head cx={70} cy={128} /><path d="M72 144 Q94 133 116 144 L122 158 L78 158 Z" fill={CLOTH} />
        <MusclePatch d="M83 140 Q96 136 108 142 L104 151 L86 151 Z" />
        <g>
          <line x1="86" y1="145" x2="76" y2="111" stroke={BODY} strokeWidth="7" strokeLinecap="round" />
          <line x1="76" y1="111" x2="82" y2="82" stroke={BODY} strokeWidth="7" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" values="0 76 111; -18 76 111; 0 76 111" dur={spec.duration} repeatCount="indefinite" /></line>
          <line x1="106" y1="145" x2="116" y2="111" stroke={BODY} strokeWidth="7" strokeLinecap="round" />
          <line x1="116" y1="111" x2="110" y2="82" stroke={BODY} strokeWidth="7" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" values="0 116 111; 18 116 111; 0 116 111" dur={spec.duration} repeatCount="indefinite" /></line>
          <circle cx="82" cy="80" r="5" fill={EQUIP} /><circle cx="110" cy="80" r="5" fill={EQUIP} />
        </g>
        <ArrowCue x={162} y1={78} y2={118} />
      </>;
    case "crossover":
      return <>
        <StandingBody arms="down" />
        <path d="M66 100 Q43 92 29 78" fill="none" stroke={EQUIP_DARK} strokeWidth="3" />
        <path d="M134 100 Q157 92 171 78" fill="none" stroke={EQUIP_DARK} strokeWidth="3" />
        <path d="M28 78 Q27 73 30 70" fill="none" stroke={EQUIP} strokeWidth="4" />
        <path d="M172 78 Q173 73 170 70" fill="none" stroke={EQUIP} strokeWidth="4" />
        <g>
          <line x1="70" y1="105" x2="92" y2="126" stroke={BODY} strokeWidth="7"><animateTransform attributeName="transform" type="rotate" values="0 70 105; -22 70 105; 0 70 105" dur={spec.duration} repeatCount="indefinite" /></line>
          <line x1="130" y1="105" x2="108" y2="126" stroke={BODY} strokeWidth="7"><animateTransform attributeName="transform" type="rotate" values="0 130 105; 22 130 105; 0 130 105" dur={spec.duration} repeatCount="indefinite" /></line>
        </g>
        <ArrowCue x={170} y1={100} y2={145} />
      </>;
    case "dips":
      return <>
        <line x1="62" y1="70" x2="62" y2="188" stroke={EQUIP} strokeWidth="7" /><line x1="138" y1="70" x2="138" y2="188" stroke={EQUIP} strokeWidth="7" />
        <line x1="56" y1="84" x2="144" y2="84" stroke={EQUIP} strokeWidth="7" />
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 18; 0 0" dur={spec.duration} repeatCount="indefinite" />
          <Head cx={100} cy={108} /><path d="M90 121 Q100 114 110 121 L116 155 L84 155 Z" fill={CLOTH} /><MusclePatch d="M88 126 Q100 120 112 126 L109 138 L91 138 Z" />
          <line x1="90" y1="126" x2="76" y2="100" stroke={BODY} strokeWidth="7" /><line x1="110" y1="126" x2="124" y2="100" stroke={BODY} strokeWidth="7" />
          <line x1="84" y1="155" x2="70" y2="190" stroke={BODY} strokeWidth="8" /><line x1="116" y1="155" x2="130" y2="190" stroke={BODY} strokeWidth="8" />
        </g>
        <ArrowCue x={164} y1={94} y2={132} />
      </>;
    case "latPulldown":
      return <>
        <line x1="44" y1="54" x2="156" y2="54" stroke={EQUIP} strokeWidth="6" /><circle cx="42" cy="54" r="5" fill={EQUIP_DARK} /><circle cx="158" cy="54" r="5" fill={EQUIP_DARK} />
        <rect x="78" y="164" width="46" height="10" rx="5" fill={EQUIP_DARK} /><rect x="82" y="171" width="6" height="32" fill={EQUIP_DARK} /><rect x="112" y="171" width="6" height="32" fill={EQUIP_DARK} />
        <Head cx={100} cy={103} /><path d="M88 116 Q100 108 112 116 L116 156 L84 156 Z" fill={CLOTH} /><MusclePatch d="M91 122 Q100 116 109 122 L106 146 L94 146 Z" />
        <line x1="92" y1="126" x2="76" y2="88" stroke={BODY} strokeWidth="7" /><line x1="108" y1="126" x2="124" y2="88" stroke={BODY} strokeWidth="7" />
        <line x1="76" y1="88" x2="76" y2="57" stroke={BODY} strokeWidth="7"><animateTransform attributeName="transform" type="rotate" values="0 76 88; -14 76 88; 0 76 88" dur={spec.duration} repeatCount="indefinite" /></line>
        <line x1="124" y1="88" x2="124" y2="57" stroke={BODY} strokeWidth="7"><animateTransform attributeName="transform" type="rotate" values="0 124 88; 14 124 88; 0 124 88" dur={spec.duration} repeatCount="indefinite" /></line>
        <line x1="64" y1="56" x2="136" y2="56" stroke={EQUIP} strokeWidth="4" />
        <ArrowCue x={166} y1={70} y2={120} />
      </>;
    case "bentRow":
      return <>
        <g transform="rotate(-18 100 145)"><Head cx={100} cy={82} /><path d="M88 95 Q100 88 112 95 L118 142 L82 142 Z" fill={CLOTH} /><MusclePatch d="M90 101 Q100 95 110 101 L109 124 L91 124 Z" />
          <line x1="92" y1="101" x2="73" y2="124" stroke={BODY} strokeWidth="7" /><line x1="108" y1="101" x2="127" y2="124" stroke={BODY} strokeWidth="7" />
          <line x1="73" y1="124" x2="92" y2="115" stroke={BODY} strokeWidth="7"><animateTransform attributeName="transform" type="translate" values="0 0; 0 -10; 0 0" dur={spec.duration} repeatCount="indefinite" /></line>
          <line x1="127" y1="124" x2="108" y2="115" stroke={BODY} strokeWidth="7"><animateTransform attributeName="transform" type="translate" values="0 0; 0 -10; 0 0" dur={spec.duration} repeatCount="indefinite" /></line>
          <line x1="82" y1="142" x2="72" y2="205" stroke={BODY_DARK} strokeWidth="8" /><line x1="118" y1="142" x2="128" y2="205" stroke={BODY_DARK} strokeWidth="8" />
        </g>
        <line x1="54" y1="111" x2="146" y2="111" stroke={EQUIP} strokeWidth="4.5" /><circle cx="54" cy="111" r="6" fill={EQUIP_DARK} /><circle cx="146" cy="111" r="6" fill={EQUIP_DARK} />
        <ArrowCue x={166} y1={95} y2={128} />
      </>;
    case "seatedRow":
      return <>
        <rect x="66" y="166" width="70" height="10" rx="5" fill={EQUIP_DARK} /><line x1="82" y1="176" x2="82" y2="210" stroke={EQUIP_DARK} strokeWidth="6" /><line x1="120" y1="176" x2="120" y2="210" stroke={EQUIP_DARK} strokeWidth="6" />
        <Head cx={100} cy={116} /><path d="M88 128 Q100 120 112 128 L117 160 L83 160 Z" fill={CLOTH} /><MusclePatch d="M91 133 Q100 128 109 133 L108 148 L92 148 Z" />
        <line x1="86" y1="135" x2="73" y2="154" stroke={BODY} strokeWidth="7" /><line x1="114" y1="135" x2="127" y2="154" stroke={BODY} strokeWidth="7" />
        <line x1="73" y1="154" x2="92" y2="141" stroke={BODY} strokeWidth="7"><animateTransform attributeName="transform" type="translate" values="0 0; 11 0; 0 0" dur={spec.duration} repeatCount="indefinite" /></line>
        <line x1="127" y1="154" x2="108" y2="141" stroke={BODY} strokeWidth="7"><animateTransform attributeName="transform" type="translate" values="0 0; -11 0; 0 0" dur={spec.duration} repeatCount="indefinite" /></line>
        <line x1="42" y1="146" x2="68" y2="146" stroke={EQUIP_DARK} strokeWidth="3" /><line x1="132" y1="146" x2="158" y2="146" stroke={EQUIP_DARK} strokeWidth="3" />
        <ArrowCue x={166} y1={112} y2={150} />
      </>;
    case "pullups":
      return <>
        <line x1="40" y1="64" x2="160" y2="64" stroke={EQUIP} strokeWidth="7" /><line x1="56" y1="64" x2="56" y2="44" stroke={EQUIP_DARK} strokeWidth="5" /><line x1="144" y1="64" x2="144" y2="44" stroke={EQUIP_DARK} strokeWidth="5" />
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 15; 0 -6; 0 15" dur={spec.duration} repeatCount="indefinite" />
          <Head cx={100} cy={100} /><path d="M88 112 Q100 104 112 112 L116 151 L84 151 Z" fill={CLOTH} /><MusclePatch d="M90 117 Q100 110 110 117 L108 138 L92 138 Z" />
          <line x1="92" y1="116" x2="77" y2="78" stroke={BODY} strokeWidth="7" /><line x1="108" y1="116" x2="123" y2="78" stroke={BODY} strokeWidth="7" />
          <line x1="84" y1="151" x2="74" y2="193" stroke={BODY_DARK} strokeWidth="8" /><line x1="116" y1="151" x2="126" y2="193" stroke={BODY_DARK} strokeWidth="8" />
        </g>
        <ArrowCue x={166} y1={96} y2={142} />
      </>;
    case "overheadPress":
      return <>
        <StandingBody arms="press" />
        <g><line x1="56" y1="75" x2="144" y2="75" stroke={EQUIP} strokeWidth="5" /><circle cx="56" cy="75" r="7" fill={EQUIP_DARK}/><circle cx="144" cy="75" r="7" fill={EQUIP_DARK}/><animateTransform attributeName="transform" type="translate" values="0 12;0 -2;0 12" dur={spec.duration} repeatCount="indefinite" /></g>
        <ArrowCue x={164} y1={112} y2={64} flip />
      </>;
    case "lateralRaise":
      return <>
        <StandingBody arms="side" dumbbells />
        <g>
          <circle cx="68" cy="104" r="5" fill={EQUIP}><animate attributeName="cy" values="104;80;104" dur={spec.duration} repeatCount="indefinite" /></circle>
          <circle cx="132" cy="104" r="5" fill={EQUIP}><animate attributeName="cy" values="104;80;104" dur={spec.duration} repeatCount="indefinite" /></circle>
        </g>
        <ArrowCue x={164} y1={132} y2={86} flip />
      </>;
    case "facePull":
      return <>
        <StandingBody arms="down" />
        <line x1="166" y1="84" x2="130" y2="98" stroke={EQUIP_DARK} strokeWidth="3" />
        <g>
          <line x1="130" y1="98" x2="114" y2="86" stroke={BODY} strokeWidth="7"><animateTransform attributeName="transform" type="translate" values="0 0;-9 0;0 0" dur={spec.duration} repeatCount="indefinite" /></line>
          <line x1="130" y1="98" x2="114" y2="110" stroke={BODY} strokeWidth="7"><animateTransform attributeName="transform" type="translate" values="0 0;-9 0;0 0" dur={spec.duration} repeatCount="indefinite" /></line>
          <circle cx="112" cy="98" r="4" fill={EQUIP} />
        </g>
        <ArrowCue x={166} y1={80} y2={106} />
      </>;
    case "squat":
      return <>
        <g>
          <StandingBody crouch={0} arms="down" barbell />
          <animateTransform attributeName="transform" type="translate" values="0 0;0 25;0 0" dur={spec.duration} repeatCount="indefinite" />
        </g>
        <ArrowCue x={164} y1={96} y2={142} />
      </>;
    case "legPress":
      return <>
        <path d="M40 190 L70 110 L138 110 L165 190 Z" fill="#20252B" stroke={EQUIP_DARK} strokeWidth="3" />
        <line x1="78" y1="156" x2="126" y2="156" stroke={CLOTH} strokeWidth="14" strokeLinecap="round" /><Head cx={75} cy={133} /><path d="M75 145 Q92 138 108 148 L116 164 L88 170 Z" fill={CLOTH} />
        <MusclePatch d="M88 148 Q99 143 109 149 L104 160 L92 162 Z" />
        <g>
          <line x1="110" y1="156" x2="140" y2="139" stroke={BODY} strokeWidth="9" strokeLinecap="round"><animateTransform attributeName="transform" type="translate" values="0 0;-13 13;0 0" dur={spec.duration} repeatCount="indefinite" /></line>
          <line x1="140" y1="139" x2="158" y2="122" stroke={BODY_DARK} strokeWidth="8" strokeLinecap="round"><animateTransform attributeName="transform" type="translate" values="0 0;-13 13;0 0" dur={spec.duration} repeatCount="indefinite" /></line>
        </g>
        <circle cx="153" cy="116" r="14" fill={EQUIP_DARK} />
        <ArrowCue x={168} y1={108} y2={72} flip />
      </>;
    case "rdl":
      return <>
        <g>
          <StandingBody lean={20} arms="down" />
          <line x1="58" y1="184" x2="142" y2="184" stroke={EQUIP} strokeWidth="5" /><circle cx="58" cy="184" r="7" fill={EQUIP_DARK}/><circle cx="142" cy="184" r="7" fill={EQUIP_DARK}/>
          <animateTransform attributeName="transform" type="rotate" values="0 100 150;12 100 150;0 100 150" dur={spec.duration} repeatCount="indefinite" />
        </g>
        <ArrowCue x={164} y1={88} y2={126} />
      </>;
    case "bulgarian":
      return <>
        <rect x="44" y="178" width="40" height="10" rx="5" fill={EQUIP_DARK} /><line x1="54" y1="188" x2="50" y2="210" stroke={EQUIP_DARK} strokeWidth="6" />
        <StandingBody crouch={0} arms="down" dumbbells />
        <g>
          <line x1="104" y1="150" x2="144" y2="186" stroke={BODY_DARK} strokeWidth="8" /><line x1="144" y1="186" x2="160" y2="214" stroke={BODY_DARK} strokeWidth="8" />
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 14; 0 0" dur={spec.duration} repeatCount="indefinite" />
        </g>
        <ArrowCue x={166} y1={100} y2={146} />
      </>;
    case "barbellCurl":
      return <>
        <StandingBody arms="curl" />
        <line x1="72" y1="139" x2="128" y2="139" stroke={EQUIP} strokeWidth="4.5"><animate attributeName="y1" values="139;102;139" dur={spec.duration} repeatCount="indefinite"/><animate attributeName="y2" values="139;102;139" dur={spec.duration} repeatCount="indefinite"/></line>
        <circle cx="72" cy="139" r="6" fill={EQUIP_DARK} /><circle cx="128" cy="139" r="6" fill={EQUIP_DARK} />
        <ArrowCue x={166} y1={144} y2={98} flip />
      </>;
    case "hammerCurl":
      return <>
        <StandingBody arms="curl" dumbbells />
        <g><circle cx="91" cy="91" r="5" fill={EQUIP} /><circle cx="109" cy="91" r="5" fill={EQUIP} /><animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur={spec.duration} repeatCount="indefinite" /></g>
        <ArrowCue x={166} y1={144} y2={98} flip />
      </>;
    case "pushUp":
    case "classicPushup":
    case "closeGripPushup":
      return <>
        <g>
          <Head cx={86} cy={116} />
          <path d="M92 125 L132 136 L146 152 L104 151 Z" fill={CLOTH} />
          <MusclePatch d="M101 130 L128 136 L126 147 L105 143 Z" />
          <line x1="136" y1="146" x2="156" y2="169" stroke={BODY} strokeWidth="8" strokeLinecap="round" />
          <line x1="106" y1="143" x2="91" y2="170" stroke={BODY} strokeWidth="8" strokeLinecap="round" />
          <line x1="156" y1="169" x2="174" y2="169" stroke={BODY_DARK} strokeWidth="7" strokeLinecap="round" />
          <line x1="91" y1="170" x2="72" y2="170" stroke={BODY_DARK} strokeWidth="7" strokeLinecap="round" />
          <line x1="133" y1="136" x2="126" y2="117" stroke={BODY} strokeWidth="7" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" values="0 133 136;25 133 136;0 133 136" dur={spec.duration} repeatCount="indefinite" /></line>
          <line x1="105" y1="137" x2="111" y2="117" stroke={BODY} strokeWidth="7" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" values="0 105 137;-25 105 137;0 105 137" dur={spec.duration} repeatCount="indefinite" /></line>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 8;0 0" dur={spec.duration} repeatCount="indefinite" />
        </g>
        <ArrowCue x={170} y1={148} y2={180} />
      </>;
    case "chairDip":
      return <>
        <rect x="55" y="150" width="12" height="55" fill={EQUIP_DARK}/><rect x="55" y="145" width="62" height="10" rx="4" fill={EQUIP}/>
        <g><Head cx={112} cy={96}/><path d="M108 108 Q121 103 134 112 L140 143 L115 150 L101 130 Z" fill={CLOTH}/><MusclePatch d="M110 110 Q121 106 132 114 L130 126 L114 126 Z"/>
          <line x1="109" y1="114" x2="88" y2="139" stroke={BODY} strokeWidth="7"/><line x1="131" y1="115" x2="116" y2="139" stroke={BODY} strokeWidth="7"/>
          <line x1="88" y1="139" x2="74" y2="145" stroke={BODY} strokeWidth="7"/><line x1="116" y1="139" x2="102" y2="145" stroke={BODY} strokeWidth="7"/>
          <line x1="121" y1="149" x2="146" y2="176" stroke={BODY_DARK} strokeWidth="8"/><line x1="130" y1="149" x2="154" y2="176" stroke={BODY_DARK} strokeWidth="8"/>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 18;0 0" dur={spec.duration} repeatCount="indefinite"/></g><ArrowCue x={168} y1={96} y2={132}/>
      </>;
    case "pikePushup":
      return <>
        <g><Head cx={148} cy={106}/><path d="M119 117 L150 112 L124 148 L93 139 Z" fill={CLOTH}/><MusclePatch d="M124 119 L146 115 L132 133 L112 130 Z"/>
          <line x1="122" y1="129" x2="106" y2="161" stroke={BODY} strokeWidth="8"/><line x1="106" y1="161" x2="89" y2="176" stroke={BODY_DARK} strokeWidth="7"/>
          <line x1="137" y1="130" x2="151" y2="161" stroke={BODY} strokeWidth="8"/><line x1="151" y1="161" x2="169" y2="176" stroke={BODY_DARK} strokeWidth="7"/>
          <line x1="124" y1="146" x2="104" y2="169" stroke={BODY} strokeWidth="7"/><line x1="104" y1="169" x2="90" y2="169" stroke={BODY_DARK} strokeWidth="6"/>
          <line x1="133" y1="145" x2="146" y2="168" stroke={BODY} strokeWidth="7"/><line x1="146" y1="168" x2="160" y2="168" stroke={BODY_DARK} strokeWidth="6"/>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 10;0 0" dur={spec.duration} repeatCount="indefinite"/></g><ArrowCue x={165} y1={142} y2={170}/>
      </>;
    case "invertedRow":
      return <>
        <line x1="45" y1="74" x2="155" y2="74" stroke={EQUIP} strokeWidth="6"/>
        <g><Head cx={62} cy={126}/><path d="M72 136 L120 132 L142 145 L92 154 Z" fill={CLOTH}/><MusclePatch d="M82 137 L114 133 L126 143 L96 148 Z"/>
          <line x1="111" y1="136" x2="116" y2="103" stroke={BODY} strokeWidth="7"/><line x1="116" y1="103" x2="106" y2="83" stroke={BODY} strokeWidth="7"/>
          <line x1="100" y1="138" x2="96" y2="103" stroke={BODY} strokeWidth="7"/><line x1="96" y1="103" x2="87" y2="83" stroke={BODY} strokeWidth="7"/>
          <line x1="130" y1="145" x2="157" y2="170" stroke={BODY_DARK} strokeWidth="8"/><line x1="91" y1="146" x2="67" y2="172" stroke={BODY_DARK} strokeWidth="8"/>
          <animateTransform attributeName="transform" type="translate" values="0 5;0 -10;0 5" dur={spec.duration} repeatCount="indefinite"/></g><ArrowCue x={170} y1={108} y2={78} flip/>
      </>;
    case "doorCurl":
      return <>
        <rect x="145" y="54" width="12" height="152" fill={EQUIP_DARK}/><rect x="134" y="58" width="30" height="7" fill={EQUIP}/>
        <g><StandingBody arms="curl"/><circle cx="145" cy="68" r="4" fill={EQUIP}/><line x1="92" y1="118" x2="145" y2="70" stroke={EQUIP_DARK} strokeWidth="3"/>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -4;0 0" dur={spec.duration} repeatCount="indefinite"/></g><ArrowCue x={168} y1={145} y2={102} flip/>
      </>;
    case "pistol":
      return <>
        <g><StandingBody arms="down"/><line x1="100" y1="150" x2="143" y2="184" stroke={BODY_DARK} strokeWidth="8"/><line x1="143" y1="184" x2="168" y2="192" stroke={BODY_DARK} strokeWidth="7"/>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 14;0 0" dur={spec.duration} repeatCount="indefinite"/></g><ArrowCue x={170} y1={116} y2={156}/>
      </>;
    case "bodyBulgarian":
      return <><rect x="42" y="182" width="42" height="10" rx="4" fill={EQUIP_DARK}/><g><StandingBody arms="down"/><line x1="108" y1="150" x2="139" y2="181" stroke={BODY_DARK} strokeWidth="8"/><line x1="139" y1="181" x2="154" y2="208" stroke={BODY_DARK} strokeWidth="7"/><animateTransform attributeName="transform" type="translate" values="0 0;0 14;0 0" dur={spec.duration} repeatCount="indefinite"/></g><ArrowCue x={168} y1={110} y2={146}/></>;
    case "dumbbellBench":
      return <><BenchBody/><g><line x1="104" y1="160" x2="128" y2="138" stroke={BODY} strokeWidth="7"/><line x1="128" y1="138" x2="138" y2="116" stroke={BODY} strokeWidth="7"><animateTransform attributeName="transform" type="rotate" values="0 128 138;-28 128 138;0 128 138" dur={spec.duration} repeatCount="indefinite"/></line><circle cx="140" cy="114" r="6" fill={EQUIP}/><line x1="82" y1="160" x2="60" y2="139" stroke={BODY} strokeWidth="7"/><line x1="60" y1="139" x2="50" y2="116" stroke={BODY} strokeWidth="7"><animateTransform attributeName="transform" type="rotate" values="0 60 139;28 60 139;0 60 139" dur={spec.duration} repeatCount="indefinite"/></line><circle cx="48" cy="114" r="6" fill={EQUIP}/></g><ArrowCue x={168} y1={90} y2={125}/></>;
    case "dumbbellFly":
      return <><BenchBody incline={-18}/><g><line x1="90" y1="145" x2="65" y2="116" stroke={BODY} strokeWidth="7"><animateTransform attributeName="transform" type="rotate" values="0 90 145;18 90 145;0 90 145" dur={spec.duration} repeatCount="indefinite"/></line><line x1="110" y1="145" x2="135" y2="116" stroke={BODY} strokeWidth="7"><animateTransform attributeName="transform" type="rotate" values="0 110 145;-18 110 145;0 110 145" dur={spec.duration} repeatCount="indefinite"/></line><circle cx="65" cy="116" r="5" fill={EQUIP}/><circle cx="135" cy="116" r="5" fill={EQUIP}/></g><ArrowCue x={168} y1={110} y2={80}/></>;
    case "dumbbellShoulder":
      return <><StandingBody arms="press" dumbbells/><ArrowCue x={168} y1={128} y2={70}/></>;
    case "oneArmRow":
      return <><g><StandingBody lean={24} arms="down" dumbbells/><line x1="105" y1="116" x2="130" y2="98" stroke={BODY} strokeWidth="7"><animateTransform attributeName="transform" type="translate" values="0 0;0 -18;0 0" dur={spec.duration} repeatCount="indefinite"/></line><circle cx="130" cy="98" r="5" fill={EQUIP}/></g><ArrowCue x={168} y1={100} y2={74}/></>;
    case "dumbbellHammer":
      return <><StandingBody arms="curl" dumbbells/><ArrowCue x={168} y1={145} y2={100} flip/></>;
    case "gobletSquat":
      return <><g><StandingBody crouch={0} arms="down"/><circle cx="100" cy="118" r="9" fill={EQUIP}/><animateTransform attributeName="transform" type="translate" values="0 0;0 22;0 0" dur={spec.duration} repeatCount="indefinite"/></g><ArrowCue x={168} y1={96} y2={144}/></>;
    case "dumbbellRdl":
      return <><g><StandingBody arms="down" dumbbells/><animateTransform attributeName="transform" type="rotate" values="0 100 150;18 100 150;0 100 150" dur={spec.duration} repeatCount="indefinite"/></g><ArrowCue x={168} y1={90} y2={125}/></>;
    case "walkingLunge":
      return <><g><StandingBody arms="down" dumbbells/><line x1="100" y1="150" x2="142" y2="176" stroke={BODY_DARK} strokeWidth="8"><animateTransform attributeName="transform" type="translate" values="0 0;8 10;0 0" dur={spec.duration} repeatCount="indefinite"/></line><animateTransform attributeName="transform" type="translate" values="0 0;10 0;0 0" dur={spec.duration} repeatCount="indefinite"/></g><ArrowCue x={168} y1={170} y2={145}/></>;
    case "gluteBridge":
      return <><g><line x1="66" y1="172" x2="145" y2="170" stroke={BODY_DARK} strokeWidth="10"/><Head cx={56} cy={166}/><path d="M64 160 Q96 145 124 164 L136 178 L80 181 Z" fill={CLOTH}/><line x1="90" y1="178" x2="72" y2="202" stroke={BODY_DARK} strokeWidth="9"/><line x1="120" y1="178" x2="142" y2="202" stroke={BODY_DARK} strokeWidth="9"/><animateTransform attributeName="transform" type="translate" values="0 8;0 -10;0 8" dur={spec.duration} repeatCount="indefinite"/></g><ArrowCue x={168} y1={184} y2={144}/></>;
    case "mountainClimber":
      return <><g><path d="M58 150 L126 128 L150 147" stroke={BODY} strokeWidth="10" fill="none"/><Head cx={154} cy={116}/><line x1="72" y1="150" x2="48" y2="178" stroke={BODY_DARK} strokeWidth="8"/><line x1="98" y1="142" x2="122" y2="173" stroke={BODY_DARK} strokeWidth="8"/><line x1="98" y1="140" x2="80" y2="173" stroke={BODY_DARK} strokeWidth="8"><animateTransform attributeName="transform" type="translate" values="0 0;25 -8;0 0" dur={spec.duration} repeatCount="indefinite"/></line></g><ArrowCue x={168} y1={176} y2={146}/></>;
    case "jumpingJack":
      return <><g><StandingBody arms="side"/><animateTransform attributeName="transform" type="scale" values="1 1;1.08 1.02;1 1" dur={spec.duration} repeatCount="indefinite"/></g><ArrowCue x={168} y1={72} y2={124}/></>;
    case "burpee":
      return <><g><StandingBody arms="down"/><animateTransform attributeName="transform" type="translate" values="0 0;-20 32;0 0" dur={spec.duration} repeatCount="indefinite"/></g><path d="M145 125 L172 151" stroke={BODY_DARK} strokeWidth="8"/><ArrowCue x={170} y1={90} y2={140}/></>;
    case "wallSit":
      return <><rect x="50" y="55" width="8" height="160" fill={EQUIP_DARK}/><g><StandingBody crouch={40} arms="down"/><animateTransform attributeName="transform" type="translate" values="0 10;0 0;0 10" dur={spec.duration} repeatCount="indefinite"/></g><ArrowCue x={168} y1={105} y2={136}/></>;
    case "crunch":
      return <><g><Head cx={150} cy={150}/><path d="M74 175 Q113 142 145 160 L150 180 L95 188 Z" fill={CLOTH}/><MusclePatch d="M102 160 Q122 150 139 160 L132 174 L108 176 Z"/><line x1="88" y1="180" x2="61" y2="206" stroke={BODY_DARK} strokeWidth="9"/><line x1="120" y1="177" x2="150" y2="202" stroke={BODY_DARK} strokeWidth="9"/><animateTransform attributeName="transform" type="rotate" values="0 120 178;-12 120 178;0 120 178" dur={spec.duration} repeatCount="indefinite"/></g><ArrowCue x={168} y1={177} y2={145}/></>;
    case "superman":
      return <><g><Head cx={145} cy={139}/><path d="M65 162 Q104 145 141 148 L146 166 L84 178 Z" fill={CLOTH}/><MusclePatch d="M92 152 L128 149 L130 164 L98 169 Z"/><line x1="72" y1="161" x2="38" y2="145" stroke={BODY_DARK} strokeWidth="8"><animateTransform attributeName="transform" type="translate" values="0 0;-6 -10;0 0" dur={spec.duration} repeatCount="indefinite"/></line><line x1="130" y1="152" x2="163" y2="133" stroke={BODY_DARK} strokeWidth="8"><animateTransform attributeName="transform" type="translate" values="0 0;6 -10;0 0" dur={spec.duration} repeatCount="indefinite"/></line><animateTransform attributeName="transform" type="translate" values="0 0;0 -5;0 0" dur={spec.duration} repeatCount="indefinite"/></g><ArrowCue x={168} y1={144} y2={118}/></>;
    case "sidePlank":
      return <><g><circle cx="80" cy="116" r="10" fill={BODY}/><path d="M84 128 L140 150" stroke={BODY} strokeWidth="12"/><line x1="105" y1="142" x2="78" y2="179" stroke={BODY_DARK} strokeWidth="8"/><line x1="132" y1="150" x2="160" y2="180" stroke={BODY_DARK} strokeWidth="8"/><line x1="118" y1="142" x2="140" y2="112" stroke={BODY_DARK} strokeWidth="7"/><animateTransform attributeName="transform" type="rotate" values="-2 115 150;2 115 150;-2 115 150" dur={spec.duration} repeatCount="indefinite"/></g><ArrowCue x={168} y1={120} y2={96}/></>;
    case "stepUp":
      return <><rect x="110" y="160" width="50" height="28" fill={EQUIP_DARK}/><g><StandingBody arms="down"/><line x1="105" y1="150" x2="132" y2="164" stroke={BODY_DARK} strokeWidth="8"><animateTransform attributeName="transform" type="translate" values="0 18;0 0;0 18" dur={spec.duration} repeatCount="indefinite"/></line><animateTransform attributeName="transform" type="translate" values="0 12;0 -6;0 12" dur={spec.duration} repeatCount="indefinite"/></g><ArrowCue x={168} y1={162} y2={130}/></>;
    case "tempoSquat":
      return <><g><StandingBody crouch={0} arms="down" barbell/><animateTransform attributeName="transform" type="translate" values="0 0;0 28;0 0" dur="2.6s" repeatCount="indefinite"/></g><ArrowCue x={168} y1={96} y2={144}/></>;
    case "gluteKickback":
      return <><g><StandingBody arms="down"/><line x1="102" y1="150" x2="138" y2="180" stroke={BODY_DARK} strokeWidth="8"><animateTransform attributeName="transform" type="rotate" values="0 102 150;-28 102 150;0 102 150" dur={spec.duration} repeatCount="indefinite"/></line></g><ArrowCue x={168} y1={154} y2={190}/></>;
    case "fireHydrant":
      return <><g><path d="M60 145 L120 132 L145 145" stroke={BODY} strokeWidth="10" fill="none"/><Head cx={150} cy={128}/><line x1="78" y1="144" x2="55" y2="174" stroke={BODY_DARK} strokeWidth="8"/><line x1="112" y1="140" x2="101" y2="174" stroke={BODY_DARK} strokeWidth="8"/><line x1="120" y1="142" x2="150" y2="160" stroke={BODY_DARK} strokeWidth="8"><animateTransform attributeName="transform" type="rotate" values="0 120 142;35 120 142;0 120 142" dur={spec.duration} repeatCount="indefinite"/></line></g><ArrowCue x={168} y1={148} y2={118}/></>;
    case "calfRaise":
      return <><g><StandingBody arms="down"/><animateTransform attributeName="transform" type="translate" values="0 0;0 -10;0 0" dur={spec.duration} repeatCount="indefinite"/></g><ArrowCue x={168} y1={198} y2={175} flip/></>;
    case "hollowBody":
      return <><g><Head cx={58} cy={154}/><path d="M64 164 Q104 147 137 163" stroke={BODY} strokeWidth="12" fill="none"/><line x1="74" y1="160" x2="44" y2="135" stroke={BODY_DARK} strokeWidth="8"/><line x1="88" y1="158" x2="60" y2="126" stroke={BODY_DARK} strokeWidth="8"/><line x1="130" y1="162" x2="160" y2="184" stroke={BODY_DARK} strokeWidth="8"/><line x1="140" y1="162" x2="172" y2="184" stroke={BODY_DARK} strokeWidth="8"/><animateTransform attributeName="transform" type="rotate" values="-2 105 160;2 105 160;-2 105 160" dur={spec.duration} repeatCount="indefinite"/></g><ArrowCue x={168} y1={132} y2={114}/></>;
    case "reverseLunge":
      return <><g><StandingBody arms="down"/><line x1="100" y1="150" x2="62" y2="184" stroke={BODY_DARK} strokeWidth="8"><animateTransform attributeName="transform" type="translate" values="0 0;-8 8;0 0" dur={spec.duration} repeatCount="indefinite"/></line><animateTransform attributeName="transform" type="translate" values="0 0;0 14;0 0" dur={spec.duration} repeatCount="indefinite"/></g><ArrowCue x={168} y1={110} y2={150}/></>;
    case "tricepsPushdown":
      return <>
        <StandingBody arms="pushdown" />
        <line x1="100" y1="54" x2="100" y2="74" stroke={EQUIP_DARK} strokeWidth="4" /><line x1="86" y1="60" x2="114" y2="60" stroke={EQUIP} strokeWidth="4" />
        <path d="M86 60 Q100 66 114 60" fill="none" stroke={EQUIP} strokeWidth="3" />
        <ArrowCue x={166} y1={96} y2={146} />
      </>;
    case "tricepsExtension":
      return <>
        <BenchBody />
        <g>
          <Head cx={76} cy={144} />
          <path d="M82 154 Q105 145 126 160 L138 174 L104 180 L82 168 Z" fill={CLOTH} />
          <MusclePatch d="M95 157 Q108 153 119 161 L116 173 L101 172 Z" />
          <line x1="102" y1="158" x2="114" y2="126" stroke={BODY} strokeWidth="8" strokeLinecap="round" />
          <line x1="114" y1="126" x2="130" y2="115" stroke={BODY_DARK} strokeWidth="8" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" values="0 114 126;28 114 126;0 114 126" dur={spec.duration} repeatCount="indefinite" />
          </line>
          <line x1="128" y1="114" x2="151" y2="114" stroke={EQUIP} strokeWidth="5" strokeLinecap="round" />
        </g>
        <ArrowCue x={168} y1={112} y2={92} />
      </>;
    case "farmerCarry":
      return <>
        <g>
          <StandingBody arms="down" dumbbells />
          <line x1="78" y1="137" x2="74" y2="190" stroke={BODY_DARK} strokeWidth="8">
            <animateTransform attributeName="transform" type="rotate" values="0 78 137;-8 78 137;0 78 137;8 78 137;0 78 137" dur={spec.duration} repeatCount="indefinite" />
          </line>
          <line x1="122" y1="137" x2="126" y2="190" stroke={BODY_DARK} strokeWidth="8">
            <animateTransform attributeName="transform" type="rotate" values="0 122 137;8 122 137;0 122 137;-8 122 137;0 122 137" dur={spec.duration} repeatCount="indefinite" />
          </line>
          <circle cx="68" cy="194" r="7" fill={EQUIP_DARK} /><circle cx="132" cy="194" r="7" fill={EQUIP_DARK} />
          <animateTransform attributeName="transform" type="translate" values="0 0;6 0;0 0;-6 0;0 0" dur={spec.duration} repeatCount="indefinite" />
        </g>
        <ArrowCue x={168} y1={176} y2={146} />
      </>;
    case "plank":
      return <>
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -2;0 0" dur={spec.duration} repeatCount="indefinite" />
          <circle cx="160" cy="124" r="10" fill={BODY} stroke="#9B5A3D" strokeWidth="2" />
          <path d="M70 145 L150 124" stroke={BODY} strokeWidth="12" strokeLinecap="round" />
          <MusclePatch d="M92 138 L125 130 L127 142 L96 150 Z" />
          <line x1="70" y1="145" x2="52" y2="172" stroke={BODY_DARK} strokeWidth="9" /><line x1="90" y1="142" x2="68" y2="178" stroke={BODY_DARK} strokeWidth="9" />
          <line x1="142" y1="126" x2="165" y2="152" stroke={BODY_DARK} strokeWidth="7" /><line x1="149" y1="128" x2="177" y2="148" stroke={BODY_DARK} strokeWidth="7" />
        </g>
        <ArrowCue x={42} y1={116} y2={96} flip />
      </>;
    case "legRaise":
      return <>
        <line x1="100" y1="42" x2="100" y2="72" stroke={EQUIP} strokeWidth="7" />
        <line x1="78" y1="42" x2="122" y2="42" stroke={EQUIP} strokeWidth="7" />
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur={spec.duration} repeatCount="indefinite" />
          <Head cx={100} cy={92} /><path d="M90 105 Q100 98 110 105 L114 148 L86 148 Z" fill={CLOTH} /><MusclePatch d="M92 112 Q100 106 108 112 L106 138 L94 138 Z" />
          <line x1="92" y1="111" x2="80" y2="78" stroke={BODY} strokeWidth="7" /><line x1="108" y1="111" x2="120" y2="78" stroke={BODY} strokeWidth="7" />
          <line x1="88" y1="146" x2="66" y2="176" stroke={BODY_DARK} strokeWidth="8" /><line x1="112" y1="146" x2="134" y2="176" stroke={BODY_DARK} strokeWidth="8" />
          <line x1="66" y1="176" x2="76" y2="198" stroke={BODY_DARK} strokeWidth="8" /><line x1="134" y1="176" x2="124" y2="198" stroke={BODY_DARK} strokeWidth="8" />
          <Joint cx={66} cy={176} /><Joint cx={134} cy={176} />
          <animateTransform attributeName="transform" type="rotate" values="0 100 150; -18 100 150; 0 100 150" dur={spec.duration} repeatCount="indefinite" />
        </g>
        <ArrowCue x={166} y1={176} y2={120} flip />
      </>;
  }
};

export const ExercisePoseIllustration: React.FC<ExercisePoseIllustrationProps> = ({ pose, exerciseId, exerciseName = "Exercice", muscleGroup }) => {
  const spec = useMemo(() => {
    const resolvedId = resolveExerciseAnimationId(exerciseId, exerciseName);
    if (resolvedId && EXERCISE_MOTIONS[resolvedId]) return EXERCISE_MOTIONS[resolvedId];
    const fallbackLabel = exerciseName.toUpperCase();
    return {
      kind: pose === "push" ? "bench" : pose === "pull" ? "latPulldown" : pose === "squat" ? "squat" : pose === "hinge" ? "rdl" : pose === "core" ? "plank" : pose === "shoulder" ? "overheadPress" : pose === "arm" ? "barbellCurl" : "squat",
      label: fallbackLabel,
      muscle: (muscleGroup || "MOUVEMENT").split(" & ")[0].toUpperCase(),
      duration: "1.8s"
    } as ExerciseMotionSpec;
  }, [exerciseId, exerciseName, muscleGroup, pose]);

  return <SvgFrame spec={spec}><RenderMotion spec={spec} /></SvgFrame>;
};

export { EXERCISE_MOTIONS };

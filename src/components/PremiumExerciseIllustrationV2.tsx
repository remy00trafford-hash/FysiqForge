import React, { useMemo } from "react";
import { classifyExerciseMotion, EXERCISE_MOTIONS } from "./PremiumExerciseIllustration";
import type { MotionFamily, PremiumMotionSpec } from "./PremiumExerciseIllustration";

const COLORS = {
  bg: "#F7FAFD",
  panel: "#FFFFFF",
  ink: "#13233A",
  muted: "#5E7085",
  line: "#D5DEE7",
  steel: "#718293",
  skin: "#F4C8AD",
  shirt: "#34485D",
  muscle: "#F05A32",
  accent: "#F26122",
};

type Stage = 0 | 1 | 2 | 3;
const progress = (stage: Stage) => [0, 0.5, 1, 0.5][stage];

const Segment: React.FC<{ x1: number; y1: number; x2: number; y2: number; width?: number; color?: string }> = ({ x1, y1, x2, y2, width = 7, color = COLORS.skin }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" />
);

const PersonHead: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <circle cx={x} cy={y} r={9} fill={COLORS.skin} stroke="#C98569" strokeWidth={1.5} />
);

const Muscle: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({ x, y, w = 20, h = 10 }) => (
  <rect x={x} y={y} width={w} height={h} rx={5} fill={COLORS.muscle} opacity={0.9}>
    <animate attributeName="opacity" values="0.45;1;0.45" dur="1.1s" repeatCount="indefinite" />
  </rect>
);

const Floor = () => <line x1={24} y1={194} x2={176} y2={194} stroke="#C7D2DC" strokeWidth={2} />;

function Standing(stage: Stage, family: MotionFamily) {
  const p = progress(stage);
  const squat = family === "squat" || family === "lunge" || family === "stepUp";
  const down = squat ? p * 18 : 0;
  const shoulder = 70 + down;
  const hip = 112 + down;
  const head = 54 + down;

  if (family === "calfRaise") {
    const heel = p * 10;
    return <g>
      <PersonHead x={100} y={head} />
      <path d={`M84 ${shoulder} Q100 ${shoulder - 8} 116 ${shoulder} L118 ${hip} Q100 ${hip + 10} 82 ${hip} Z`} fill={COLORS.shirt} />
      <Muscle x={91} y={124} />
      <Segment x1={92} y1={hip} x2={78} y2={170 - heel} />
      <Segment x1={108} y1={hip} x2={122} y2={170 - heel} />
      <Segment x1={78} y1={170 - heel} x2={73} y2={190 - heel} color={COLORS.skin} />
      <Segment x1={122} y1={170 - heel} x2={127} y2={190 - heel} color={COLORS.skin} />
      <Segment x1={91} y1={shoulder + 6} x2={80} y2={128} />
      <Segment x1={109} y1={shoulder + 6} x2={120} y2={128} />
      <Floor />
    </g>;
  }

  if (family === "carry") {
    const walk = p * 10;
    return <g transform={`translate(${walk} 0)`}>
      <PersonHead x={100} y={head} />
      <path d={`M84 ${shoulder} Q100 ${shoulder - 8} 116 ${shoulder} L118 ${hip} Q100 ${hip + 10} 82 ${hip} Z`} fill={COLORS.shirt} />
      <Muscle x={90} y={86} />
      <Segment x1={90} y1={shoulder + 6} x2={80} y2={130} />
      <Segment x1={110} y1={shoulder + 6} x2={120} y2={130} />
      <circle cx={74} cy={138} r={9} fill={COLORS.steel} />
      <circle cx={126} cy={138} r={9} fill={COLORS.steel} />
      <Segment x1={91} y1={hip} x2={78 - p * 5} y2={170} />
      <Segment x1={109} y1={hip} x2={122 + p * 5} y2={170} />
      <Segment x1={78 - p * 5} y1={170} x2={72 - p * 2} y2={190} color={COLORS.skin} />
      <Segment x1={122 + p * 5} y1={170} x2={128 + p * 2} y2={190} color={COLORS.skin} />
      <path d="M35 182 H165" stroke={COLORS.accent} strokeWidth={2.5} strokeDasharray="5 5">
        <animate attributeName="strokeDashoffset" values="0;-30" dur="0.7s" repeatCount="indefinite" />
      </path>
    </g>;
  }

  if (family === "shoulderPress" || family === "lateralRaise" || family === "curl" || family === "triceps") {
    const handY = family === "shoulderPress" ? 120 - p * 75 : family === "lateralRaise" ? 120 - p * 40 : family === "curl" ? 132 - p * 34 : 132 + p * 24;
    return <g>
      <PersonHead x={100} y={head} />
      <path d={`M84 ${shoulder} Q100 ${shoulder - 8} 116 ${shoulder} L118 ${hip} Q100 ${hip + 10} 82 ${hip} Z`} fill={COLORS.shirt} />
      <Muscle x={90} y={84} />
      <Segment x1={90} y1={shoulder + 6} x2={78} y2={handY} />
      <Segment x1={110} y1={shoulder + 6} x2={122} y2={handY} />
      <circle cx={78} cy={handY} r={6} fill={COLORS.steel} />
      <circle cx={122} cy={handY} r={6} fill={COLORS.steel} />
      <Segment x1={92} y1={hip} x2={80} y2={190} color={COLORS.skin} />
      <Segment x1={108} y1={hip} x2={120} y2={190} color={COLORS.skin} />
    </g>;
  }

  if (family === "hinge") {
    const bend = p * 22;
    return <g transform={`rotate(${bend} 100 120)`}>
      <PersonHead x={100} y={54} />
      <path d="M84 70 Q100 62 116 70 L118 116 Q100 126 82 116 Z" fill={COLORS.shirt} />
      <Muscle x={91} y={81} />
      <Segment x1={90} y1={76} x2={74} y2={112} />
      <Segment x1={110} y1={76} x2={126} y2={112} />
      <circle cx={72} cy={118} r={8} fill={COLORS.steel} />
      <circle cx={128} cy={118} r={8} fill={COLORS.steel} />
      <Segment x1={91} y1={116} x2={77} y2={171} color={COLORS.skin} />
      <Segment x1={109} y1={116} x2={123} y2={171} color={COLORS.skin} />
    </g>;
  }

  if (family === "squat" || family === "lunge" || family === "stepUp") {
    const lunge = family === "lunge";
    const step = family === "stepUp";
    return <g>
      {family === "squat" && <line x1={62} y1={58 + down} x2={138} y2={58 + down} stroke={COLORS.steel} strokeWidth={5} strokeLinecap="round" />}
      {step && <rect x={116} y={154} width={42} height={28} rx={4} fill={COLORS.steel} opacity={0.75} />}
      <PersonHead x={100} y={head} />
      <path d={`M84 ${shoulder} Q100 ${shoulder - 8} 116 ${shoulder} L118 ${hip} Q100 ${hip + 10} 82 ${hip} Z`} fill={COLORS.shirt} />
      <Muscle x={89} y={120 + down} />
      {lunge ? <>
        <Segment x1={92} y1={hip} x2={74 + p * 18} y2={164} />
        <Segment x1={74 + p * 18} y1={164} x2={54 + p * 18} y2={188} color={COLORS.skin} />
        <Segment x1={108} y1={hip} x2={132 - p * 12} y2={154} />
        <Segment x1={132 - p * 12} y1={154} x2={146 - p * 12} y2={190} color={COLORS.skin} />
      </> : step ? <>
        <Segment x1={92} y1={hip} x2={112} y2={154 - p * 18} />
        <Segment x1={112} y1={154 - p * 18} x2={128} y2={152} color={COLORS.skin} />
        <Segment x1={108} y1={hip} x2={80} y2={170} />
        <Segment x1={80} y1={170} x2={74} y2={188} color={COLORS.skin} />
      </> : <>
        <Segment x1={92} y1={hip} x2={78} y2={164 + down} />
        <Segment x1={78} y1={164 + down} x2={72} y2={190} color={COLORS.skin} />
        <Segment x1={108} y1={hip} x2={122} y2={164 + down} />
        <Segment x1={122} y1={164 + down} x2={128} y2={190} color={COLORS.skin} />
      </>}
      <Floor />
    </g>;
  }

  return <g>
    <PersonHead x={100} y={head} />
    <path d={`M84 ${shoulder} Q100 ${shoulder - 8} 116 ${shoulder} L118 ${hip} Q100 ${hip + 10} 82 ${hip} Z`} fill={COLORS.shirt} />
    <Segment x1={92} y1={hip} x2={80} y2={190} color={COLORS.skin} />
    <Segment x1={108} y1={hip} x2={120} y2={190} color={COLORS.skin} />
    <Floor />
  </g>;
}

function Bench(stage: Stage, incline = false, fly = false) {
  const p = progress(stage);
  const barY = fly ? 90 + p * 34 : incline ? 78 - p * 20 : 96 - p * 28;
  return <g transform={incline ? "rotate(-12 100 150)" : undefined}>
    <rect x={40} y={146} width={120} height={10} rx={5} fill={COLORS.steel} />
    <line x1={54} y1={156} x2={54} y2={190} stroke={COLORS.steel} strokeWidth={6} />
    <line x1={146} y1={156} x2={146} y2={190} stroke={COLORS.steel} strokeWidth={6} />
    <PersonHead x={70} y={124} />
    <path d="M77 132 Q100 120 124 133 L130 146 L76 146 Z" fill={COLORS.shirt} />
    <Muscle x={90} y={130} w={22} />
    {fly ? <>
      <Segment x1={88} y1={135} x2={64 - p * 8} y2={barY} />
      <Segment x1={112} y1={135} x2={136 + p * 8} y2={barY} />
      <circle cx={64 - p * 8} cy={barY} r={6} fill={COLORS.steel} />
      <circle cx={136 + p * 8} cy={barY} r={6} fill={COLORS.steel} />
    </> : <>
      <Segment x1={88} y1={134} x2={72} y2={116} />
      <Segment x1={112} y1={134} x2={128} y2={116} />
      <Segment x1={72} y1={116} x2={64} y2={barY} />
      <Segment x1={128} y1={116} x2={136} y2={barY} />
      <line x1={48} y1={barY} x2={152} y2={barY} stroke={COLORS.steel} strokeWidth={5} />
      <circle cx={48} cy={barY} r={7} fill={COLORS.ink} />
      <circle cx={152} cy={barY} r={7} fill={COLORS.ink} />
    </>}
  </g>;
}

function PushUp(stage: Stage, pike = false) {
  const p = progress(stage);
  const y = 118 + p * 18;
  return <g>
    <circle cx={42} cy={y - 34} r={8} fill={COLORS.skin} />
    <path d={pike ? `M48 ${y - 28} L94 ${y - 5} L124 ${y - 34}` : `M50 ${y - 29} Q88 ${y - 20} 122 ${y - 12} L126 ${y + 4} L55 ${y - 8} Z`} fill={COLORS.shirt} />
    <Muscle x={70} y={y - 26} w={26} />
    <Segment x1={58} y1={y - 20} x2={70} y2={y + 12} />
    <Segment x1={106} y1={y - 15} x2={116} y2={y + 12} />
    <Segment x1={70} y1={y + 12} x2={54} y2={y + 30} color={COLORS.skin} />
    <Segment x1={116} y1={y + 12} x2={138} y2={y + 28} color={COLORS.skin} />
    <Floor />
  </g>;
}

function Pull(stage: Stage, family: MotionFamily) {
  const p = progress(stage);
  if (family === "pullup") {
    const lift = p * 20;
    return <g>
      <line x1={30} y1={38} x2={170} y2={38} stroke={COLORS.steel} strokeWidth={7} />
      <PersonHead x={100} y={72 - lift} />
      <path d={`M84 ${86 - lift} Q100 ${78 - lift} 116 ${86 - lift} L118 ${124 - lift} L82 ${124 - lift} Z`} fill={COLORS.shirt} />
      <Muscle x={89} y={92 - lift} />
      <Segment x1={89} y1={88 - lift} x2={71} y2={45} />
      <Segment x1={111} y1={88 - lift} x2={129} y2={45} />
      <Segment x1={87} y1={124 - lift} x2={78} y2={184 - lift} color={COLORS.skin} />
      <Segment x1={113} y1={124 - lift} x2={122} y2={184 - lift} color={COLORS.skin} />
    </g>;
  }
  const barY = 56 + p * 28;
  return <g>
    <line x1={35} y1={36} x2={165} y2={36} stroke={COLORS.steel} strokeWidth={6} />
    <line x1={100} y1={36} x2={100} y2={barY - 10} stroke={COLORS.steel} strokeWidth={3} />
    <line x1={64} y1={barY} x2={136} y2={barY} stroke={COLORS.steel} strokeWidth={5} />
    <PersonHead x={100} y={98} />
    <path d="M84 110 Q100 101 116 110 L118 144 L82 144 Z" fill={COLORS.shirt} />
    <Muscle x={90} y={118} />
    <Segment x1={88} y1={118} x2={76} y2={barY} />
    <Segment x1={112} y1={118} x2={124} y2={barY} />
    <Segment x1={86} y1={144} x2={82} y2={182} color={COLORS.skin} />
    <Segment x1={114} y1={144} x2={118} y2={182} color={COLORS.skin} />
  </g>;
}

function Core(stage: Stage, family: MotionFamily) {
  const p = progress(stage);
  if (family === "plank") return <g>
    <line x1={35} y1={164} x2={165} y2={164} stroke="#C7D2DC" strokeWidth={3} />
    <circle cx={53} cy={126 - p * 3} r={8} fill={COLORS.skin} />
    <line x1={61} y1={130 - p * 3} x2={126} y2={142 - p * 3} stroke={COLORS.shirt} strokeWidth={13} strokeLinecap="round" />
    <Muscle x={82} y={133 - p * 3} w={24} />
    <Segment x1={70} y1={134 - p * 3} x2={57} y2={164} />
    <Segment x1={126} y1={142 - p * 3} x2={150} y2={164} color={COLORS.skin} />
  </g>;
  const lift = p * 28;
  return <g>
    <line x1={35} y1={160} x2={165} y2={160} stroke="#C7D2DC" strokeWidth={3} />
    <circle cx={54} cy={122} r={8} fill={COLORS.skin} />
    <path d="M62 128 Q92 114 120 130 L128 148 L74 150 Z" fill={COLORS.shirt} />
    <Muscle x={80} y={126} w={24} />
    <Segment x1={116} y1={140} x2={138 - lift} y2={124 - lift} />
    <Segment x1={138 - lift} y1={124 - lift} x2={158 - lift} y2={90 - lift} color={COLORS.skin} />
    <Segment x1={120} y1={146} x2={148 - lift} y2={136 - lift} />
    <Segment x1={148 - lift} y1={136 - lift} x2={170 - lift} y2={102 - lift} color={COLORS.skin} />
  </g>;
}

function Cardio(stage: Stage, label: string) {
  const p = progress(stage);
  if (/mountain/i.test(label)) return <g>
    <circle cx={50} cy={104} r={8} fill={COLORS.skin} />
    <line x1={57} y1={110} x2={118} y2={124} stroke={COLORS.shirt} strokeWidth={13} strokeLinecap="round" />
    <Muscle x={78} y={116} w={25} />
    <Segment x1={112} y1={124} x2={136 - p * 20} y2={146} />
    <Segment x1={136 - p * 20} y1={146} x2={153 - p * 20} y2={126} color={COLORS.skin} />
    <Segment x1={112} y1={126} x2={135 + p * 20} y2={142} />
    <Segment x1={135 + p * 20} y1={142} x2={151 + p * 20} y2={122} color={COLORS.skin} />
    <Floor />
  </g>;
  const open = p >= 0.5;
  return <g>
    <PersonHead x={100} y={58} />
    <path d="M84 72 Q100 64 116 72 L118 112 L82 112 Z" fill={COLORS.shirt} />
    <Muscle x={90} y={82} />
    <Segment x1={90} y1={78} x2={open ? 58 : 78} y2={open ? 52 : 118} />
    <Segment x1={110} y1={78} x2={open ? 142 : 122} y2={open ? 52 : 118} />
    <Segment x1={91} y1={112} x2={open ? 72 : 84} y2={172} />
    <Segment x1={109} y1={112} x2={open ? 128 : 116} y2={172} />
    <Floor />
  </g>;
}

const Pose: React.FC<{ stage: Stage; spec: PremiumMotionSpec }> = ({ stage, spec }) => {
  const label = spec.label;
  if (spec.family === "benchPress") return Bench(stage, false, /écarté|crossover/i.test(label));
  if (spec.family === "inclinePress") return Bench(stage, true, /écarté|fly/i.test(label));
  if (spec.family === "pushup") return PushUp(stage, /pike/i.test(label));
  if (spec.family === "pulldown" || spec.family === "row" || spec.family === "pullup") return Pull(stage, spec.family);
  if (spec.family === "core" || spec.family === "plank" || spec.family === "legRaise") return Core(stage, spec.family);
  if (spec.family === "cardio") return Cardio(stage, label);
  return Standing(stage, spec.family);
};

export const PremiumExerciseIllustrationV2: React.FC<{ exerciseId?: string; exerciseName?: string; muscleGroup?: string }> = ({ exerciseId, exerciseName = "Exercice", muscleGroup = "Mouvement" }) => {
  const spec = useMemo<PremiumMotionSpec>(() => {
    if (exerciseId && EXERCISE_MOTIONS[exerciseId]) return EXERCISE_MOTIONS[exerciseId];
    return classifyExerciseMotion(exerciseId, exerciseName, muscleGroup);
  }, [exerciseId, exerciseName, muscleGroup]);

  const labels = ["POSITION DE DÉPART", "MOUVEMENT", "POSITION FINALE", "RETOUR"];
  const stages: Stage[] = [0, 1, 2, 3];

  return <div className="w-full h-full rounded-2xl overflow-hidden border border-[#D5DEE7] bg-[#F7FAFD]">
    <svg viewBox="0 0 720 430" className="w-full h-full" role="img" aria-label={`${spec.label}: position de départ, mouvement, position finale et retour`}>
      <rect width={720} height={430} fill={COLORS.bg} />
      <text x={24} y={34} fill={COLORS.ink} fontSize={22} fontWeight={900}>{spec.label}</text>
      <text x={696} y={34} textAnchor="end" fill={COLORS.muscle} fontSize={12} fontWeight={900}>{spec.muscle}</text>
      {stages.map((stage) => {
        const x = 12 + stage * 174;
        return <g key={stage} transform={`translate(${x} 52)`}>
          <rect x={4} y={4} width={166} height={280} rx={16} fill={COLORS.panel} stroke={COLORS.line} />
          <text x={87} y={26} textAnchor="middle" fill={stage === 1 || stage === 2 ? COLORS.accent : COLORS.muted} fontSize={10} fontWeight={900}>{labels[stage]}</text>
          <g transform="translate(8 35) scale(1.05)"><Pose stage={stage} spec={spec} /></g>
          {stage < 3 && <text x={160} y={148} fill="#6C88A5" fontSize={25} fontWeight={900}>→</text>}
        </g>;
      })}
      <line x1={42} y1={367} x2={678} y2={367} stroke="#9AAEC2" strokeWidth={4} strokeLinecap="round" />
      {[42, 254, 466, 678].map((x, index) => <circle key={x} cx={x} cy={367} r={8} fill={index === 0 ? COLORS.ink : COLORS.steel} />)}
      <circle cx={42} cy={367} r={12} fill={COLORS.accent} opacity={0.22}>
        <animate attributeName="cx" values="42;254;466;678;466;254;42" dur="3.4s" repeatCount="indefinite" />
      </circle>
      <text x={24} y={400} fill={COLORS.muted} fontSize={11} fontWeight={700}>Départ → mouvement → fin → retour : la boucle indique clairement le geste à reproduire.</text>
    </svg>
  </div>;
};

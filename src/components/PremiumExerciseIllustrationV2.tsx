import React, { useMemo } from "react";
import { classifyExerciseMotion, EXERCISE_MOTIONS, MotionFamily, PremiumMotionSpec } from "./PremiumExerciseIllustration";

const C = {
  navy: "#13233A",
  ink: "#17263A",
  muted: "#5E7085",
  line: "#D5DEE7",
  steel: "#718293",
  skin: "#E7AD8C",
  skin2: "#F4C8AD",
  shirt: "#34485D",
  muscle: "#F05A32",
  orange: "#F26122",
  white: "#FFFFFF",
  bg: "#F7FAFD",
};

type Stage = 0 | 1 | 2 | 3;
const phase = (stage: Stage) => [0, 1, 2, 1][stage];

const Line: React.FC<{ x1: number; y1: number; x2: number; y2: number; w?: number; color?: string }> = ({ x1, y1, x2, y2, w = 7, color = C.skin }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeLinecap="round" />
);

const Head: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <circle cx={x} cy={y} r="9" fill={C.skin2} stroke={C.skin} strokeWidth="1.5" />
    <circle cx={x + 3} cy={y - 1.5} r="1.1" fill={C.ink} />
  </g>
);

const Highlight: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({ x, y, w = 18, h = 10 }) => (
  <rect x={x} y={y} width={w} height={h} rx="5" fill={C.muscle} opacity="0.95">
    <animate attributeName="opacity" values="0.45;1;0.45" dur="1.1s" repeatCount="indefinite" />
  </rect>
);

const Ground: React.FC = () => <line x1="24" y1="194" x2="156" y2="194" stroke="#C7D2DC" strokeWidth="2" />;

function StandingPose(stage: Stage, family: MotionFamily) {
  const q = phase(stage);
  const crouch = ["squat", "lunge", "stepUp"].includes(family) ? q * 18 : 0;
  const hipY = 112 + crouch;
  const shoulderY = 70 + crouch;
  const headY = 55 + crouch;

  if (family === "calfRaise") {
    const heel = q * 10;
    return (
      <g>
        <Head x={100} y={headY} />
        <path d={`M84 ${shoulderY} Q100 ${shoulderY - 8} 116 ${shoulderY} L118 ${hipY} Q100 ${hipY + 10} 82 ${hipY} Z`} fill={C.shirt} />
        <Highlight x={90} y={124 + crouch} w={20} h={10} />
        <Line x1={91} y1={hipY} x2={78} y2={170 - heel} color={C.skin} />
        <Line x1={109} y1={hipY} x2={122} y2={170 - heel} color={C.skin} />
        <Line x1={78} y1={170 - heel} x2={73} y2={190 - heel} color={C.skin2} />
        <Line x1={122} y1={170 - heel} x2={127} y2={190 - heel} color={C.skin2} />
        <path d={`M65 ${190 - heel} q8 -4 16 0 M119 ${190 - heel} q8 -4 16 0`} fill="none" stroke={C.ink} strokeWidth="4" strokeLinecap="round" />
        <Line x1={92} y1={shoulderY + 6} x2={80} y2={126 + crouch} />
        <Line x1={108} y1={shoulderY + 6} x2={120} y2={126 + crouch} />
      </g>
    );
  }

  if (family === "carry") {
    const walkX = q * 9;
    return (
      <g>
        <g transform={`translate(${walkX} 0)`}>
          <Head x={100} y={headY} />
          <path d={`M84 ${shoulderY} Q100 ${shoulderY - 8} 116 ${shoulderY} L118 ${hipY} Q100 ${hipY + 10} 82 ${hipY} Z`} fill={C.shirt} />
          <Highlight x={89} y={86 + crouch} w={22} h={10} />
          <Line x1={90} y1={shoulderY + 5} x2={80} y2={130 + crouch} />
          <Line x1={110} y1={shoulderY + 5} x2={120} y2={130 + crouch} />
          <circle cx="74" cy={138 + crouch} r="9" fill={C.steel} />
          <circle cx="126" cy={138 + crouch} r="9" fill={C.steel} />
          <Line x1={90} y1={hipY} x2={82 - q * 4} y2={171} />
          <Line x1={110} y1={hipY} x2={118 + q * 4} y2={171} />
          <Line x1={82 - q * 4} y1={171} x2={75 - q * 2} y2={190} color={C.skin2} />
          <Line x1={118 + q * 4} y1={171} x2={125 + q * 2} y2={190} color={C.skin2} />
        </g>
        <path d="M35 182 H165" stroke={C.orange} strokeWidth="2.5" strokeDasharray="5 5"><animate attributeName="strokeDashoffset" values="0;-30" dur="0.7s" repeatCount="indefinite" /></path>
      </g>
    );
  }

  if (family === "shoulderPress" || family === "lateralRaise" || family === "curl" || family === "triceps") {
    const armY = family === "shoulderPress" ? 52 - q * 25 : family === "lateralRaise" ? 120 - q * 40 : family === "curl" ? 130 - q * 34 : 132 + q * 24;
    return (
      <g>
        <Head x={100} y={headY} />
        <path d={`M84 ${shoulderY} Q100 ${shoulderY - 8} 116 ${shoulderY} L118 ${hipY} Q100 ${hipY + 10} 82 ${hipY} Z`} fill={C.shirt} />
        <Highlight x={89} y={83 + crouch} w={22} h={10} />
        <Line x1={90} y1={shoulderY + 6} x2={78} y2={armY} />
        <Line x1={110} y1={shoulderY + 6} x2={122} y2={armY} />
        <circle cx="78" cy={armY} r="6" fill={C.steel} />
        <circle cx="122" cy={armY} r="6" fill={C.steel} />
        {family === "triceps" && (
          <g opacity="0.9">
            <line x1="76" y1="50" x2="124" y2="50" stroke={C.steel} strokeWidth="4" />
            <line x1="100" y1="50" x2="100" y2="90" stroke={C.steel} strokeWidth="2" strokeDasharray="4 4" />
          </g>
        )}
        <Line x1={91} y1={hipY} x2={80} y2={190} color={C.skin2} />
        <Line x1={109} y1={hipY} x2={120} y2={190} color={C.skin2} />
      </g>
    );
  }

  if (family === "hinge") {
    const bend = q * 18;
    return (
      <g transform={`rotate(${bend} 100 120)`}>
        <Head x={100} y={55} />
        <path d="M84 70 Q100 62 116 70 L118 116 Q100 126 82 116 Z" fill={C.shirt} />
        <Highlight x={91} y={80} w={18} h={10} />
        <Line x1="90" y1="76" x2="74" y2="110" />
        <Line x1="110" y1="76" x2="126" y2="110" />
        <circle cx="72" cy="117" r="8" fill={C.steel} />
        <circle cx="128" cy="117" r="8" fill={C.steel} />
        <Line x1="91" y1="116" x2="77" y2="171" color={C.skin2} />
        <Line x1="109" y1="116" x2="123" y2="171" color={C.skin2} />
      </g>
    );
  }

  if (["squat", "lunge", "stepUp"].includes(family)) {
    const rearOffset = family === "lunge" ? q * 18 : 0;
    return (
      <g>
        {family === "squat" && <line x1="62" y1={headY + 5} x2="138" y2={headY + 5} stroke={C.steel} strokeWidth="5" strokeLinecap="round" />}
        {family === "stepUp" && <rect x="112" y="152" width="42" height="30" rx="4" fill={C.steel} opacity="0.7" />}
        <Head x={100} y={headY} />
        <path d={`M84 ${shoulderY} Q100 ${shoulderY - 8} 116 ${shoulderY} L118 ${hipY} Q100 ${hipY + 10} 82 ${hipY} Z`} fill={C.shirt} />
        <Highlight x={88} y={120 + crouch} w={22} h={10} />
        {family === "lunge" ? (
          <>
            <Line x1="92" y1={hipY} x2={74 + rearOffset} y2="164" />
            <Line x1="74" y1="164" x2="54 + rearOffset" y2="188" color={C.skin2} />
            <Line x1="108" y1={hipY} x2={132 - rearOffset} y2="154" />
            <Line x1={132 - rearOffset} y1="154" x2={146 - rearOffset} y2="190" color={C.skin2} />
          </>
        ) : family === "stepUp" ? (
          <>
            <Line x1="92" y1={hipY} x2={112} y2={154 - q * 16} />
            <Line x1="112" y1={154 - q * 16} x2={128} y2="152" color={C.skin2} />
            <Line x1="108" y1={hipY} x2={80} y2="170" />
            <Line x1="80" y1="170" x2={74} y2="188" color={C.skin2} />
          </>
        ) : (
          <>
            <Line x1="92" y1={hipY} x2="78" y2={164 + crouch} />
            <Line x1="78" y1={164 + crouch} x2="72" y2="190" color={C.skin2} />
            <Line x1="108" y1={hipY} x2="122" y2={164 + crouch} />
            <Line x1="122" y1={164 + crouch} x2="128" y2="190" color={C.skin2} />
          </>
        )}
      </g>
    );
  }

  return (
    <g>
      <Head x={100} y={headY} />
      <path d={`M84 ${shoulderY} Q100 ${shoulderY - 8} 116 ${shoulderY} L118 ${hipY} Q100 ${hipY + 10} 82 ${hipY} Z`} fill={C.shirt} />
      <Line x1={91} y1={hipY} x2={80} y2={190} color={C.skin2} />
      <Line x1={109} y1={hipY} x2={120} y2={190} color={C.skin2} />
    </g>
  );
}

const BenchPress: React.FC<{ stage: Stage; incline?: boolean; fly?: boolean }> = ({ stage, incline = false, fly = false }) => {
  const q = phase(stage);
  const handY = fly ? 92 + q * 32 : (incline ? 78 : 95 - q * 28);
  const dx = fly ? 24 + q * 22 : 16;
  return (
    <g transform={incline ? "rotate(-12 100 150)" : undefined}>
      <rect x="40" y="146" width="120" height="10" rx="5" fill={C.steel} />
      <line x1="54" y1="156" x2="54" y2="190" stroke={C.steel} strokeWidth="6" />
      <line x1="146" y1="156" x2="146" y2="190" stroke={C.steel} strokeWidth="6" />
      <Head x={70} y={124} />
      <path d="M77 132 Q100 120 124 133 L130 146 L76 146 Z" fill={C.shirt} />
      <Highlight x={90} y={130} w={22} h={11} />
      {fly ? (
        <>
          <Line x1="88" y1="135" x2={64 - q * 8} y2={handY} />
          <Line x1="112" y1="135" x2={136 + q * 8} y2={handY} />
          <circle cx={64 - q * 8} cy={handY} r="6" fill={C.steel} />
          <circle cx={136 + q * 8} cy={handY} r="6" fill={C.steel} />
        </>
      ) : (
        <>
          <Line x1="88" y1="134" x2={72 - dx * 0.2} y2={116} />
          <Line x1="112" y1="134" x2={128 + dx * 0.2} y2={116} />
          <Line x1={72 - dx * 0.2} y1={116} x2={64} y2={handY} />
          <Line x1={128 + dx * 0.2} y1={116} x2={136} y2={handY} />
          <line x1="48" y1={handY} x2="152" y2={handY} stroke={C.steel} strokeWidth="5" />
          <circle cx="48" cy={handY} r="7" fill={C.ink} />
          <circle cx="152" cy={handY} r="7" fill={C.ink} />
        </>
      )}
    </g>
  );
};

const PushUp: React.FC<{ stage: Stage; decline?: boolean; pike?: boolean }> = ({ stage, decline = false, pike = false }) => {
  const q = phase(stage);
  const y = 118 + q * 15;
  return (
    <g>
      {decline && <rect x="125" y="136" width="30" height="18" rx="3" fill={C.steel} />}
      <circle cx={42} cy={y - 34} r="8" fill={C.skin2} />
      <path d={pike ? `M48 ${y - 28} L95 ${y - 5} L124 ${y - 35}` : `M50 ${y - 29} Q88 ${y - 20} 122 ${y - 12} L126 ${y + 4} L55 ${y - 8} Z`} fill={C.shirt} />
      <Highlight x={70} y={y - 26} w={26} h={10} />
      <Line x1="58" y1={y - 20} x2="70" y2={y + 12} />
      <Line x1="106" y1={y - 15} x2="116" y2={y + 12} />
      <Line x1="70" y1={y + 12} x2="54" y2={y + 30} color={C.skin2} />
      <Line x1="116" y1={y + 12} x2="138" y2={y + 28} color={C.skin2} />
      <line x1="24" y1="150" x2="160" y2="150" stroke="#C7D2DC" strokeWidth="2" />
    </g>
  );
};

const Dip: React.FC<{ stage: Stage }> = ({ stage }) => {
  const q = phase(stage);
  const y = 88 + q * 16;
  return (
    <g>
      <line x1="42" y1="42" x2="42" y2="182" stroke={C.steel} strokeWidth="7" />
      <line x1="158" y1="42" x2="158" y2="182" stroke={C.steel} strokeWidth="7" />
      <line x1="35" y1="64" x2="82" y2="64" stroke={C.steel} strokeWidth="5" />
      <line x1="118" y1="64" x2="165" y2="64" stroke={C.steel} strokeWidth="5" />
      <Head x={100} y={74 + q * 8} />
      <path d={`M86 ${86 + q * 8} Q100 ${78 + q * 8} 114 ${86 + q * 8} L118 ${124 + q * 8} L82 ${124 + q * 8} Z`} fill={C.shirt} />
      <Highlight x={90} y={92 + q * 8} w={20} h={10} />
      <Line x1="89" y1={92 + q * 8} x2="73" y2="68" />
      <Line x1="111" y1={92 + q * 8} x2="127" y2="68" />
      <Line x1="86" y1={124 + q * 8} x2="76" y2="174" color={C.skin2} />
      <Line x1="114" y1={124 + q * 8} x2="124" y2="174" color={C.skin2} />
    </g>
  );
};

const Pulling: React.FC<{ stage: Stage; family: MotionFamily }> = ({ stage, family }) => {
  const q = phase(stage);
  if (family === "pullup") {
    const lift = q * 18;
    return (
      <g>
        <line x1="30" y1="38" x2="170" y2="38" stroke={C.steel} strokeWidth="7" />
        <Head x={100} y={72 - lift} />
        <path d={`M84 ${86 - lift} Q100 ${78 - lift} 116 ${86 - lift} L118 ${124 - lift} L82 ${124 - lift} Z`} fill={C.shirt} />
        <Highlight x={89} y={92 - lift} w={22} h={10} />
        <Line x1={89} y1={88 - lift} x2={71} y2="45" />
        <Line x1={111} y1={88 - lift} x2={129} y2="45" />
        <Line x1={87} y1={124 - lift} x2={78} y2={184 - lift} color={C.skin2} />
        <Line x1={113} y1={124 - lift} x2={122} y2={184 - lift} color={C.skin2} />
      </g>
    );
  }

  if (family === "pulldown") {
    const barY = 56 + q * 28;
    return (
      <g>
        <line x1="35" y1="36" x2="165" y2="36" stroke={C.steel} strokeWidth="6" />
        <line x1="100" y1="36" x2="100" y2={barY - 10} stroke={C.steel} strokeWidth="3" />
        <line x1="64" y1={barY} x2="136" y2={barY} stroke={C.steel} strokeWidth="5" />
        <Head x={100} y={98} />
        <path d="M84 110 Q100 101 116 110 L118 144 L82 144 Z" fill={C.shirt} />
        <Highlight x={90} y={118} w={20} h={10} />
        <Line x1="88" y1="118" x2="76" y2={barY} />
        <Line x1="112" y1="118" x2="124" y2={barY} />
        <Line x1="86" y1="144" x2="82" y2="182" color={C.skin2} />
        <Line x1="114" y1="144" x2="118" y2="182" color={C.skin2} />
      </g>
    );
  }

  const reach = 18 + q * 16;
  return (
    <g transform="rotate(-14 100 135)">
      <Head x={100} y={78} />
      <path d="M86 90 Q100 82 114 90 L118 132 L82 132 Z" fill={C.shirt} />
      <Highlight x={91} y={96} w={18} h={10} />
      <Line x1="89" y1="102" x2={64 + reach} y2="122" />
      <Line x1="111" y1="102" x2={136 - reach} y2="122" />
      <circle cx={64 + reach} cy="122" r="5" fill={C.steel} />
      <circle cx={136 - reach} cy="122" r="5" fill={C.steel} />
      <Line x1="86" y1="132" x2="78" y2="190" color={C.skin2} />
      <Line x1="114" y1="132" x2="122" y2="190" color={C.skin2} />
    </g>
  );
};

const CorePose: React.FC<{ stage: Stage; family: MotionFamily }> = ({ stage, family }) => {
  const q = phase(stage);
  if (family === "legRaise") {
    const lift = q * 22;
    return (
      <g>
        <line x1="35" y1="160" x2="165" y2="160" stroke="#C7D2DC" strokeWidth="3" />
        <circle cx="54" cy="122" r="8" fill={C.skin2} />
        <path d="M62 128 Q92 114 120 130 L128 148 L74 150 Z" fill={C.shirt} />
        <Highlight x={80} y={126} w={24} h={10} />
        <Line x1="116" y1="140" x2={138 - lift} y2="124 - lift" />
        <Line x1={138 - lift} y1="124 - lift" x2={158 - lift} y2="90 - lift" color={C.skin2} />
        <Line x1="120" y1="146" x2={148 - lift} y2="136 - lift" />
        <Line x1={148 - lift} y1={136 - lift} x2={170 - lift} y2="102 - lift" color={C.skin2} />
      </g>
    );
  }

  if (family === "plank") {
    const rise = q * 3;
    return (
      <g>
        <line x1="36" y1="164" x2="165" y2="164" stroke="#C7D2DC" strokeWidth="3" />
        <circle cx="53" cy={126 - rise} r="8" fill={C.skin2} />
        <line x1="61" y1={130 - rise} x2="126" y2={142 - rise} stroke={C.shirt} strokeWidth="13" strokeLinecap="round" />
        <Highlight x={82} y={133 - rise} w={24} h={10} />
        <Line x1="70" y1={134 - rise} x2="57" y2="164" />
        <Line x1="86" y1={138 - rise} x2="75" y2="164" />
        <Line x1="126" y1={142 - rise} x2="150" y2="164" color={C.skin2} />
      </g>
    );
  }

  const curl = q * 16;
  return (
    <g>
      <line x1="35" y1="167" x2="165" y2="167" stroke="#C7D2DC" strokeWidth="3" />
      <circle cx="55" cy="120" r="8" fill={C.skin2} />
      <path d="M63 126 Q92 114 122 132 L127 149 L74 151 Z" fill={C.shirt} />
      <Highlight x={84} y={128} w={24} h={10} />
      <Line x1="114" y1="142" x2={138 - curl} y2={156 - curl} />
      <Line x1={138 - curl} y1={156 - curl} x2={158 - curl} y2={176 - curl} color={C.skin2} />
      <Line x1="116" y1="145" x2={147 - curl} y2={158 - curl} />
      <Line x1={147 - curl} y1={158 - curl} x2={168 - curl} y2={180 - curl} color={C.skin2} />
    </g>
  );
};

const CardioPose: React.FC<{ stage: Stage; label: string }> = ({ stage, label }) => {
  const q = phase(stage);
  const isBurpee = /burpee/i.test(label);
  const isMountain = /mountain/i.test(label);
  if (isBurpee) {
    const down = q * 22;
    return (
      <g>
        {q < 1 ? <>
          <Head x={100} y={58} />
          <path d="M84 72 Q100 64 116 72 L118 112 L82 112 Z" fill={C.shirt} />
          <Highlight x={89} y={80} w={22} h={10} />
          <Line x1="90" y1="112" x2="78" y2="162 - down" />
          <Line x1="110" y1="112" x2="122" y2="162 - down" />
        </> : <PushUp stage={stage} />}
        {q === 1 && <text x="100" y="188" textAnchor="middle" fill={C.orange} fontSize="10" fontWeight="900">DESCENTE → APPUI → REMONTÉE</text>}
      </g>
    );
  }
  if (isMountain) {
    return (
      <g>
        <circle cx="50" cy="104" r="8" fill={C.skin2} />
        <line x1="57" y1="110" x2="118" y2="124" stroke={C.shirt} strokeWidth="13" strokeLinecap="round" />
        <Highlight x={78} y={116} w={25} h={10} />
        <Line x1="112" y1="124" x2={136 - q * 20} y2="146" />
        <Line x1={136 - q * 20} y1="146" x2={153 - q * 20} y2="126" color={C.skin2} />
        <Line x1="112" y1="126" x2={135 + q * 20} y2="142" />
        <Line x1={135 + q * 20} y1="142" x2={151 + q * 20} y2="122" color={C.skin2} />
        <line x1="26" y1="164" x2="165" y2="164" stroke="#C7D2DC" strokeWidth="3" />
      </g>
    );
  }
  const open = q === 1;
  return (
    <g>
      <Head x={100} y={58} />
      <path d="M84 72 Q100 64 116 72 L118 112 L82 112 Z" fill={C.shirt} />
      <Highlight x={90} y={82} w={20} h={10} />
      <Line x1="90" y1="78" x2={open ? 58 : 78} y2={open ? 52 : 118} />
      <Line x1="110" y1="78" x2={open ? 142 : 122} y2={open ? 52 : 118} />
      <Line x1="91" y1="112" x2={open ? 72 : 84} y2="172" />
      <Line x1="109" y1="112" x2={open ? 128 : 116} y2="172" />
      <Line x1={open ? 72 : 84} y1="172" x2={open ? 62 : 78} y2="190" color={C.skin2} />
      <Line x1={open ? 128 : 116} y1="172" x2={open ? 138 : 122} y2="190" color={C.skin2} />
    </g>
  );
};

const Pose: React.FC<{ stage: Stage; family: MotionFamily; label: string }> = ({ stage, family, label }) => {
  if (family === "benchPress") return <BenchPress stage={stage} fly={/écarté|crossover/i.test(label)} />;
  if (family === "inclinePress") return <BenchPress stage={stage} incline fly={/écarté|fly/i.test(label)} />;
  if (family === "pushup") return <PushUp stage={stage} decline={/surélev|decline/i.test(label)} pike={/pike/i.test(label)} />;
  if (family === "dip") return <Dip stage={stage} />;
  if (family === "pulldown" || family === "row" || family === "pullup") return <Pulling stage={stage} family={family} />;
  if (family === "core" || family === "plank" || family === "legRaise") return <CorePose stage={stage} family={family} />;
  if (family === "cardio") return <CardioPose stage={stage} label={label} />;
  return StandingPose(stage, family);
};

export const PremiumExerciseIllustrationV2: React.FC<{ exerciseId?: string; exerciseName?: string; muscleGroup?: string }> = ({ exerciseId, exerciseName = "Exercice", muscleGroup = "Mouvement" }) => {
  const spec = useMemo<PremiumMotionSpec>(
    () => (exerciseId && EXERCISE_MOTIONS[exerciseId] ? EXERCISE_MOTIONS[exerciseId] : classifyExerciseMotion(exerciseId, exerciseName, muscleGroup)),
    [exerciseId, exerciseName, muscleGroup]
  );

  const labels = ["POSITION DE DÉPART", "MOUVEMENT", "POSITION FINALE", "RETOUR"];

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-[#D5DEE7] bg-[#F7FAFD]">
      <svg viewBox="0 0 720 430" className="w-full h-full" role="img" aria-label={`${spec.label}: départ, mouvement, position finale, retour`}>
        <rect width="720" height="430" fill={C.bg} />
        <text x="24" y="34" fill={C.navy} fontSize="22" fontWeight="900">{spec.label}</text>
        <text x="696" y="34" textAnchor="end" fill={C.muscle} fontSize="12" fontWeight="900">{spec.muscle}</text>
        {[0, 1, 2, 3].map((stage) => {
          const x = 12 + stage * 174;
          return (
            <g key={stage} transform={`translate(${x} 52)`}>
              <rect x="4" y="4" width="166" height="280" rx="16" fill={C.white} stroke={C.line} />
              <text x="87" y="26" textAnchor="middle" fill={stage === 1 || stage === 2 ? C.orange : C.muted} fontSize="10" fontWeight="900">{labels[stage]}</text>
              <g transform="translate(8 35) scale(1.05)">
                <Pose stage={stage as Stage} family={spec.family} label={spec.label} />
              </g>
              {stage < 3 && <text x="160" y="148" fill="#6C88A5" fontSize="25" fontWeight="900">→</text>}
              <circle cx="87" cy="263" r="6" fill={stage === 0 ? C.navy : C.steel} />
            </g>
          );
        })}
        <line x1="42" y1="367" x2="678" y2="367" stroke="#9AAEC2" strokeWidth="4" strokeLinecap="round" />
        {[42, 254, 466, 678].map((x, i) => <circle key={x} cx={x} cy="367" r="8" fill={i === 0 ? C.navy : C.steel} />)}
        <circle cx="42" cy="367" r="12" fill={C.orange} opacity="0.22">
          <animate attributeName="cx" values="42;254;466;678;466;254;42" dur="3.4s" repeatCount="indefinite" />
        </circle>
        <text x="24" y="400" fill={C.muted} fontSize="11" fontWeight="700">Départ → mouvement → fin → retour. La boucle montre ce que l'utilisateur doit reproduire.</text>
      </svg>
    </div>
  );
};

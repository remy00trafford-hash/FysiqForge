import React, { useMemo } from "react";
import { PremiumExerciseIllustrationV2 } from "./PremiumExerciseIllustrationV2";
import { classifyExerciseMotion } from "./PremiumExerciseIllustration";

const C = { bg: "#F7FAFD", panel: "#FFFFFF", ink: "#13233A", muted: "#5E7085", line: "#D5DEE7", steel: "#718293", skin: "#F4C8AD", shirt: "#34485D", muscle: "#F05A32", accent: "#F26122" };
type Stage = 0 | 1 | 2 | 3;
const phase = (s: Stage) => [0, 1, 0, 0.5][s];

const Seg = ({x1,y1,x2,y2,w=7,color=C.skin}:{x1:number;y1:number;x2:number;y2:number;w?:number;color?:string}) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeLinecap="round" />;
const Head = ({x,y}:{x:number;y:number}) => <circle cx={x} cy={y} r={8} fill={C.skin} stroke="#C98569" strokeWidth="1.5" />;
const Muscle = ({x,y,w=22}:{x:number;y:number;w?:number}) => <rect x={x} y={y} width={w} height={8} rx={4} fill={C.muscle} opacity=".9" />;

function LyingTriceps(stage: Stage, band: boolean) {
  const p = phase(stage);
  const elbow = 72 + p * 18;
  const handY = 62 + p * 38;
  return <g>
    <rect x={38} y={154} width={124} height={10} rx={5} fill={C.steel} />
    <line x1={52} y1={164} x2={52} y2={190} stroke={C.steel} strokeWidth={6} />
    <line x1={148} y1={164} x2={148} y2={190} stroke={C.steel} strokeWidth={6} />
    <Head x={66} y={126} />
    <path d="M74 134 Q100 122 126 135 L132 154 L70 154 Z" fill={C.shirt} />
    <Muscle x={88} y={134} />
    {band ? <>
      <path d={`M96 130 Q100 78 100 42`} fill="none" stroke={C.accent} strokeWidth={3} strokeDasharray="6 4" />
      <circle cx={100} cy={38} r={5} fill={C.accent} />
    </> : <line x1={100} y1={38} x2={100} y2={42} stroke={C.steel} strokeWidth={5} />}
    <Seg x1={86} y1={136} x2={elbow} y2={handY + 18} />
    <Seg x1={114} y1={136} x2={200 - elbow} y2={handY + 18} />
    <Seg x1={elbow} y1={handY + 18} x2={100} y2={handY} />
    <Seg x1={200 - elbow} y1={handY + 18} x2={100} y2={handY} />
    <circle cx={100} cy={handY} r={6} fill={C.steel} />
    <line x1={100} y1={handY - 2} x2={100} y2={42} stroke={band ? C.accent : C.steel} strokeWidth={band ? 2 : 4} strokeDasharray={band ? "5 4" : undefined} />
    <line x1={35} y1={194} x2={165} y2={194} stroke="#C7D2DC" strokeWidth={2} />
  </g>;
}

export const PremiumExerciseIllustrationV3: React.FC<{ exerciseId?: string; exerciseName?: string; muscleGroup?: string }> = ({ exerciseId, exerciseName = "Exercice", muscleGroup = "Mouvement" }) => {
  const spec = useMemo(() => classifyExerciseMotion(exerciseId, exerciseName, muscleGroup), [exerciseId, exerciseName, muscleGroup]);
  if (spec.family !== "lyingTriceps") return <PremiumExerciseIllustrationV2 exerciseId={exerciseId} exerciseName={exerciseName} muscleGroup={muscleGroup} />;
  const stages: Stage[] = [0,1,2,3];
  const labels = ["POSITION DE DÉPART", "DESCENTE", "POSITION FINALE", "RETOUR"];
  return <div className="w-full h-full rounded-2xl overflow-hidden border border-[#D5DEE7] bg-[#F7FAFD]">
    <svg viewBox="0 0 720 430" className="w-full h-full" role="img" aria-label={`${spec.label}: allongé sur un banc, plier les coudes puis tendre les bras`}>
      <rect width="720" height="430" fill={C.bg} />
      <text x="24" y="34" fill={C.ink} fontSize="22" fontWeight="900">{spec.label}</text>
      <text x="696" y="34" textAnchor="end" fill={C.muscle} fontSize="12" fontWeight="900">{spec.muscle}</text>
      {stages.map((s) => { const x = 12 + s * 174; return <g key={s} transform={`translate(${x} 52)`}>
        <rect x="4" y="4" width="166" height="280" rx="16" fill={C.panel} stroke={C.line} />
        <text x="87" y="26" textAnchor="middle" fill={s === 1 || s === 2 ? C.accent : C.muted} fontSize="10" fontWeight="900">{labels[s]}</text>
        <g transform="translate(8 35) scale(1.05)"><LyingTriceps stage={s} band={/band/i.test(spec.label)} /></g>
        {s < 3 && <text x="160" y="148" fill="#6C88A5" fontSize="25" fontWeight="900">→</text>}
      </g>; })}
      <line x1="42" y1="367" x2="678" y2="367" stroke="#9AAEC2" strokeWidth="4" strokeLinecap="round" />
      {[42,254,466,678].map((x,i)=><circle key={x} cx={x} cy={367} r={8} fill={i===0?C.ink:C.steel} />)}
      <circle cx="42" cy="367" r="12" fill={C.accent} opacity=".22"><animate attributeName="cx" values="42;254;466;678;466;254;42" dur="3.4s" repeatCount="indefinite" /></circle>
      <text x="24" y="400" fill={C.muted} fontSize="11" fontWeight="700">Allongé → plier les coudes → tendre les bras → retour. Les mains suivent la trajectoire de l'exercice.</text>
    </svg>
  </div>;
};
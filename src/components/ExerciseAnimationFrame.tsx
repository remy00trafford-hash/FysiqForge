import React, { useMemo, useState } from "react";
import { Info, Repeat2, PlayCircle } from "lucide-react";
import { PremiumExerciseIllustrationV3 } from "./PremiumExerciseIllustrationV3";
import { classifyExerciseMotion, type MotionFamily } from "./PremiumExerciseIllustration";

interface ExerciseAnimationFrameProps {
  exerciseId?: string;
  exerciseName?: string;
  muscleGroup?: string;
  reps?: string;
  videoSrc?: string;
}

const familyGuidance: Record<MotionFamily, string> = {
  benchPress: "Descends la charge vers la poitrine, puis pousse jusqu'à la position de départ.",
  inclinePress: "Descends les haltères sous contrôle, puis pousse vers le haut sans perdre l'angle du banc.",
  pushup: "Garde le corps gainé, descends la poitrine, puis repousse le sol jusqu'à la position de départ.",
  dip: "Descends en contrôlant les coudes, puis pousse pour revenir bras tendus sans à-coup.",
  pulldown: "Tire les coudes vers le bas, amène la barre vers le haut de la poitrine, puis remonte sous contrôle.",
  row: "Tire les coudes vers l'arrière, rapproche les omoplates, puis laisse revenir la charge lentement.",
  pullup: "Monte la poitrine vers la barre, puis redescends de façon contrôlée jusqu'à la position de départ.",
  shoulderPress: "Pousse les charges au-dessus de la tête, puis redescends-les sous contrôle vers les épaules.",
  lateralRaise: "Élève les bras sur les côtés jusqu'à la hauteur des épaules, puis redescends lentement.",
  curl: "Garde les coudes stables, fléchis les bras pour rapprocher les charges des épaules, puis redescends.",
  triceps: "Garde les coudes près du corps, tends les avant-bras, puis reviens lentement à la position de départ.",
  lyingTriceps: "Allongé, fléchis les coudes pour rapprocher la charge du front, puis tends les bras sans déplacer les coudes.",
  squat: "Descends en contrôlant les genoux et les hanches, puis pousse dans le sol pour remonter.",
  lunge: "Fais descendre le bassin entre les jambes, garde le genou stable, puis pousse pour revenir.",
  stepUp: "Pose un pied sur la plateforme, pousse dans ce pied pour monter, puis redescends avec contrôle.",
  hinge: "Repousse les hanches vers l'arrière en gardant le dos neutre, puis serre les fessiers pour remonter.",
  legPress: "Fléchis les genoux en contrôlant la descente, puis pousse le plateau sans verrouiller brutalement les genoux.",
  calfRaise: "Monte sur la pointe des pieds, marque une courte contraction, puis redescends complètement.",
  gluteBridge: "Pousse les hanches vers le haut en serrant les fessiers, puis redescends sous contrôle.",
  gluteKickback: "Garde le bassin stable, pousse la jambe vers l'arrière, puis ramène-la sans cambrer le dos.",
  core: "Effectue le mouvement sans élan et garde le tronc contrôlé pendant toute la répétition.",
  plank: "Garde le corps aligné, les abdos contractés et respire sans laisser tomber le bassin.",
  legRaise: "Lève les jambes avec le contrôle des abdominaux, puis redescends sans balancer le corps.",
  cardio: "Réalise le mouvement en continu en gardant une amplitude confortable et un rythme régulier.",
  carry: "Garde le buste droit, serre les charges et avance avec des pas contrôlés.",
  unknown: "Suis le mouvement animé et réalise chaque répétition lentement et sous contrôle.",
};

const phaseLabels: Record<MotionFamily, string> = {
  benchPress: "DESCENTE → POUSSÉE", inclinePress: "DESCENTE → POUSSÉE", pushup: "DESCENTE → POUSSÉE", dip: "DESCENTE → REMONTÉE",
  pulldown: "TIRAGE → RETOUR", row: "TIRAGE → RETOUR", pullup: "MONTÉE → DESCENTE", shoulderPress: "POUSSÉE → DESCENTE",
  lateralRaise: "MONTÉE → DESCENTE", curl: "FLEXION → EXTENSION", triceps: "EXTENSION → RETOUR", lyingTriceps: "DESCENTE → EXTENSION",
  squat: "DESCENTE → REMONTÉE", lunge: "DESCENTE → POUSSÉE", stepUp: "MONTER → REDESCENDRE", hinge: "HANCHES ARRIÈRE → REMONTÉE",
  legPress: "DESCENTE → POUSSÉE", calfRaise: "MONTÉE → DESCENTE", gluteBridge: "HANCHES HAUT → BAS", gluteKickback: "EXTENSION → RETOUR",
  core: "CONTRACTION → RETOUR", plank: "TENUE ISOMÉTRIQUE", legRaise: "MONTÉE → DESCENTE", cardio: "MOUVEMENT CONTINU",
  carry: "MARCHE CONTRÔLÉE", unknown: "MOUVEMENT CONTRÔLÉ",
};

const isFrontSquat = (name: string) => /front squat|squat avant|squat frontal/i.test(name);

const FrontSquatAnimation: React.FC = () => (
  <div className="absolute inset-0 bg-[#F7FAFD]">
    <svg viewBox="0 0 720 430" className="h-full w-full" role="img" aria-label="Animation premium du squat avant : barre en position avant, descente puis remontée">
      <rect width="720" height="430" fill="#F7FAFD" />
      <text x="24" y="34" fill="#13233A" fontSize="22" fontWeight="900">SQUAT AVANT À LA BARRE</text>
      <text x="696" y="34" textAnchor="end" fill="#F05A32" fontSize="12" fontWeight="900">QUADRICEPS / CORE</text>
      {[0,1,2,3].map((stage) => {
        const p = [0, .5, 1, .5][stage];
        const y = 70 + p * 20;
        const hip = 128 + p * 24;
        const knee = 170 + p * 18;
        const handY = 84 + p * 8;
        return <g key={stage} transform={`translate(${stage * 174 + 12} 52)`}>
          <rect x="4" y="4" width="166" height="280" rx="16" fill="#fff" stroke="#D5DEE7" />
          <text x="87" y="26" textAnchor="middle" fill={stage === 1 || stage === 2 ? "#F26122" : "#5E7085"} fontSize="10" fontWeight="900">
            {["DÉPART","DESCENTE","FIN","RETOUR"][stage]}
          </text>
          <circle cx="87" cy={y} r="10" fill="#F4C8AD" stroke="#C98569" strokeWidth="1.5" />
          <path d={`M70 ${y+12} Q87 ${y+2} 104 ${y+12} L106 ${hip} Q87 ${hip+12} 68 ${hip} Z`} fill="#34485D" />
          <rect x="80" y={y+24} width="15" height="8" rx="4" fill="#F05A32">
            <animate attributeName="opacity" values=".45;1;.45" dur="1.1s" repeatCount="indefinite" />
          </rect>
          <line x1="62" y1={handY} x2="112" y2={handY} stroke="#718293" strokeWidth="5" strokeLinecap="round" />
          <circle cx="64" cy={handY} r="6" fill="#718293" /><circle cx="110" cy={handY} r="6" fill="#718293" />
          <line x1="74" y1={y+18} x2="64" y2={handY+8} stroke="#F4C8AD" strokeWidth="7" strokeLinecap="round" />
          <line x1="100" y1={y+18} x2="110" y2={handY+8} stroke="#F4C8AD" strokeWidth="7" strokeLinecap="round" />
          <line x1="74" y1={hip} x2="66" y2={knee} stroke="#F4C8AD" strokeWidth="8" strokeLinecap="round" />
          <line x1="100" y1={hip} x2="110" y2={knee} stroke="#F4C8AD" strokeWidth="8" strokeLinecap="round" />
          <line x1="66" y1={knee} x2="62" y2="206" stroke="#F4C8AD" strokeWidth="8" strokeLinecap="round" />
          <line x1="110" y1={knee} x2="116" y2="206" stroke="#F4C8AD" strokeWidth="8" strokeLinecap="round" />
          <line x1="48" y1="214" x2="130" y2="214" stroke="#C7D2DC" strokeWidth="2" />
          {stage < 3 && <text x="156" y="150" fill="#6C88A5" fontSize="25" fontWeight="900">→</text>}
        </g>;
      })}
      <line x1="42" y1="367" x2="678" y2="367" stroke="#9AAEC2" strokeWidth="4" strokeLinecap="round" />
      {[42,254,466,678].map((x,i) => <circle key={x} cx={x} cy="367" r="8" fill={i===0 ? "#13233A" : "#718293"} />)}
      <circle cx="42" cy="367" r="12" fill="#F26122" opacity=".22"><animate attributeName="cx" values="42;254;466;678;466;254;42" dur="3.4s" repeatCount="indefinite" /></circle>
      <text x="24" y="400" fill="#5E7085" fontSize="11" fontWeight="700">Barre en avant → descente contrôlée → cuisses parallèles → poussée par les talons → retour.</text>
    </svg>
  </div>
);

export const ExerciseAnimationFrame: React.FC<ExerciseAnimationFrameProps> = ({ exerciseId, exerciseName = "Exercice", muscleGroup = "Mouvement", reps, videoSrc }) => {
  const spec = useMemo(() => classifyExerciseMotion(exerciseId, exerciseName, muscleGroup), [exerciseId, exerciseName, muscleGroup]);
  const guidance = familyGuidance[spec.family];
  const phase = phaseLabels[spec.family];
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[280px] overflow-hidden rounded-2xl bg-[#F7FAFD]">
      {videoSrc && !videoFailed ? (
        <div className="absolute inset-0 bg-white">
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoFailed(true)}
            className="h-full w-full object-contain"
            aria-label={`Démonstration vidéo en boucle : ${exerciseName}`}
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-lg bg-black/65 px-2 py-1.5 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur-sm">
            <PlayCircle className="h-3.5 w-3.5 text-[#FF6A00]" /> Démo en boucle
          </div>
        </div>
      ) : isFrontSquat(exerciseName) ? (
        <FrontSquatAnimation />
      ) : (
        <PremiumExerciseIllustrationV3 exerciseId={exerciseId} exerciseName={exerciseName} muscleGroup={muscleGroup} />
      )}

      <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
        <div className="rounded-xl border border-white/80 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#13233A]"><Repeat2 className="h-3.5 w-3.5 text-[#F26122]" />{phase}</div>
        </div>
        {reps && <div className="rounded-xl border border-[#F26122]/20 bg-[#FFF7F2]/95 px-3 py-2 text-right shadow-sm backdrop-blur-sm"><div className="text-[9px] font-black uppercase tracking-wider text-[#7B8794]">Objectif</div><div className="text-xs font-black text-[#13233A]">{reps}</div></div>}
      </div>

      <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-xl border border-white/80 bg-white/94 px-3 py-2.5 shadow-sm backdrop-blur-sm">
        <div className="flex items-start gap-2"><Info className="mt-0.5 h-4 w-4 shrink-0 text-[#F26122]" /><div><p className="text-[10px] font-black uppercase tracking-wider text-[#13233A]">Comment faire</p><p className="mt-0.5 text-[11px] font-semibold leading-4 text-[#5E7085]">{guidance}</p></div></div>
      </div>
    </div>
  );
};
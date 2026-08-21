import React, { useMemo } from "react";
import { PremiumExerciseIllustrationV2 } from "./PremiumExerciseIllustrationV2";
import { classifyExerciseMotion } from "./PremiumExerciseIllustration";

const hints: Record<string,string> = {
  gluteKickback: "Pousse le talon vers l'arrière et légèrement vers le haut, sans creuser le bas du dos.",
  gluteBridge: "Monte le bassin en contractant les fessiers, puis redescends sous contrôle.",
  benchPress: "Descends la charge vers la poitrine, puis repousse verticalement.",
  squat: "Recule les hanches, fléchis les genoux, puis pousse le sol pour remonter.",
  lunge: "Descends en gardant le genou aligné, puis pousse dans le pied avant.",
  hinge: "Recule les hanches en gardant le dos neutre, puis ramène les hanches vers l'avant.",
  legPress: "Fléchis les genoux vers la poitrine, puis pousse la plateforme sans verrouiller brutalement.",
};

const clamp = (n:number,min:number,max:number) => Math.max(min,Math.min(max,n));
const Segment:React.FC<{x1:number;y1:number;x2:number;y2:number;color?:string;width?:number}> = ({x1,y1,x2,y2,color="#F4C4AA",width=12}) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round"/>;
const Dot:React.FC<{x:number;y:number;r?:number}> = ({x,y,r=7}) => <circle cx={x} cy={y} r={r} fill="#F4C4AA" stroke="#A96F5D" strokeWidth="2"/>;

function KickbackScene({phase}:{phase:number}) {
  const t = phase===0?0:phase===1?1:phase===2?1:0;
  const footX = 100 + t*88;
  const footY = 171 - t*50;
  return <g>
    <ellipse cx="103" cy="190" rx="86" ry="9" fill="#B9C7D4" opacity=".28"/>
    <rect x="26" y="173" width="150" height="17" rx="8" fill="#26313D"/>
    <Dot x={52} y={91} r={11}/>
    <path d="M63 103 Q89 92 120 107 L119 136 Q92 142 67 133 Z" fill="#344B61"/>
    <path d="M68 108 Q88 101 103 108 L101 120 Q84 116 70 121 Z" fill="#FF6840" opacity=".95"/>
    <Segment x1={70} y1={129} x2={63} y2={168}/>
    <Segment x1={111} y1={130} x2={101} y2={154}/>
    <Segment x1={101} y1={154} x2={footX} y2={footY}/>
    <Segment x1={117} y1={125} x2={127} y2={164}/>
    <Segment x1={127} y1={164} x2={142} y2={173}/>
    <circle cx={footX} cy={footY} r="6" fill="#FF6840"/>
    <path d={`M 101 151 Q ${footX-20} ${footY-25} ${footX-8} ${footY-8}`} fill="none" stroke="#FF6A00" strokeWidth="5" strokeLinecap="round" strokeDasharray="8 7"/>
    <path d={`M ${footX-8} ${footY-8} l -13 -4 l 8 12 z`} fill="#FF6A00"/>
    <text x="102" y="37" textAnchor="middle" fill="#FF8A3D" fontSize="11" fontWeight="900" letterSpacing="2">TRAJECTOIRE DU TALON</text>
  </g>;
}

function GenericScene({family}:{family:string}) {
  return <g>
    <circle cx="100" cy="58" r="12" fill="#F4C4AA"/>
    <path d="M82 75 Q100 64 118 75 L118 130 Q100 139 82 130 Z" fill="#344B61"/>
    <rect x="90" y="88" width="20" height="12" rx="6" fill="#FF6840"/>
    <Segment x1={91} y1={126} x2={82} y2={187}/><Segment x1={109} y1={126} x2={120} y2={187}/>
    <line x1="28" y1="190" x2="172" y2="190" stroke="#526171" strokeWidth="4" strokeLinecap="round"/>
    <text x="100" y="35" textAnchor="middle" fill="#FF8A3D" fontSize="10" fontWeight="900">{family.toUpperCase()}</text>
  </g>;
}

export const PremiumExerciseIllustrationV4: React.FC<{exerciseId?:string;exerciseName?:string;muscleGroup?:string}> = ({exerciseId,exerciseName="Exercice",muscleGroup="Mouvement"}) => {
  const spec = useMemo(() => classifyExerciseMotion(exerciseId,exerciseName,muscleGroup),[exerciseId,exerciseName,muscleGroup]);
  const custom = spec.family === "gluteKickback";
  const hint = hints[spec.family] || "Suis la trajectoire indiquée et garde un mouvement contrôlé.";
  return <div className="relative w-full h-full overflow-hidden rounded-3xl border border-white/15 bg-[#0B1118] shadow-[0_24px_70px_rgba(0,0,0,.32)]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,106,0,.14),transparent_35%),radial-gradient(circle_at_80%_90%,rgba(255,255,255,.06),transparent_40%)] pointer-events-none"/>
    <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[.04]">
      <div><div className="text-[9px] font-black uppercase tracking-[.2em] text-[#FF8A3D]">Animation guidée premium</div><div className="mt-1 text-sm font-black uppercase text-white truncate max-w-[70vw]">{exerciseName}</div></div>
      <div className="text-right"><div className="text-[8px] font-black uppercase text-white/40">Zone ciblée</div><div className="text-[10px] font-black uppercase text-white/80">{muscleGroup}</div></div>
    </div>
    <div className="relative h-[calc(100%-112px)] min-h-0 p-3">
      {custom ? <div className="h-full rounded-2xl overflow-hidden border border-[#D5DEE7] bg-[#F7FAFD] shadow-inner">
        <svg viewBox="0 0 200 220" className="w-full h-full" role="img" aria-label={`${exerciseName}: mouvement de jambe vers l'arrière`}>
          <defs><linearGradient id="kickBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F8FBFE"/><stop offset="1" stopColor="#E9EFF5"/></linearGradient></defs>
          <rect width="200" height="220" fill="url(#kickBg)"/>
          {[0,1,2,3].map(i=><g key={i} transform={`translate(${i*50} 0)`}><rect x="4" y="10" width="42" height="178" rx="10" fill="#FFFFFF" stroke="#D7E0E8"/><text x="25" y="25" textAnchor="middle" fontSize="5.5" fontWeight="900" fill={i===1||i===2?"#FF6A00":"#64748B"}>{["DÉPART","MONTÉE","FIN","RETOUR"][i]}</text><g transform="translate(-0 18)"><KickbackScene phase={i}/></g></g>)}
          <rect x="12" y="195" width="176" height="17" rx="8" fill="#101720"/><text x="100" y="206" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#FFFFFF">DÉPART → POUSSER LE TALON → RETOUR</text>
        </svg>
      </div> : <div className="h-full overflow-hidden rounded-2xl border border-[#D5DEE7] bg-[#F7FAFD]"><PremiumExerciseIllustrationV2 exerciseId={exerciseId} exerciseName={exerciseName} muscleGroup={muscleGroup}/></div>}
    </div>
    <div className="relative z-10 px-4 pb-3"><div className="rounded-xl border border-[#FF6A00]/20 bg-[#FF6A00]/[.07] px-3 py-2"><div className="text-[9px] font-black uppercase text-[#FF8A3D]">🎯 Repère technique</div><div className="mt-0.5 text-[10px] font-semibold leading-4 text-white/80">{hint}</div></div></div>
  </div>;
};

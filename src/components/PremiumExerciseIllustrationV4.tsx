import React, { useMemo } from "react";
import { PremiumExerciseIllustrationV2 } from "./PremiumExerciseIllustrationV2";
import { classifyExerciseMotion } from "./PremiumExerciseIllustration";

const familyHints: Record<string, { cue: string; color: string }> = {
  benchPress: { cue: "Descendre contrôlé → pousser", color: "#F26122" },
  inclinePress: { cue: "Descendre → pousser vers le haut", color: "#F26122" },
  pushup: { cue: "Descendre le buste → repousser le sol", color: "#F26122" },
  dip: { cue: "Descendre → repousser", color: "#F26122" },
  pulldown: { cue: "Tirer les coudes vers le bas → retour", color: "#3B82F6" },
  row: { cue: "Tirer vers le buste → retour contrôlé", color: "#3B82F6" },
  pullup: { cue: "Monter vers la barre → descendre", color: "#3B82F6" },
  shoulderPress: { cue: "Pousser au-dessus de la tête → descendre", color: "#8B5CF6" },
  lateralRaise: { cue: "Élever les bras → redescendre", color: "#8B5CF6" },
  curl: { cue: "Fléchir le coude → redescendre", color: "#10B981" },
  triceps: { cue: "Tendre les bras → retour contrôlé", color: "#10B981" },
  lyingTriceps: { cue: "Plier les coudes → tendre les bras", color: "#10B981" },
  squat: { cue: "Hanches vers le bas → pousser le sol", color: "#F59E0B" },
  lunge: { cue: "Descendre en fente → pousser pour remonter", color: "#F59E0B" },
  stepUp: { cue: "Monter sur le support → redescendre", color: "#F59E0B" },
  hinge: { cue: "Hanches vers l'arrière → remonter", color: "#F59E0B" },
  legPress: { cue: "Fléchir → pousser la plateforme", color: "#F59E0B" },
  calfRaise: { cue: "Monter sur la pointe → redescendre", color: "#F59E0B" },
  gluteBridge: { cue: "Monter les hanches → redescendre", color: "#EC4899" },
  gluteKickback: { cue: "Pousser la jambe arrière → retour", color: "#EC4899" },
  core: { cue: "Contracter le centre → relâcher sous contrôle", color: "#EF4444" },
  plank: { cue: "Maintenir le corps aligné", color: "#EF4444" },
  legRaise: { cue: "Lever les jambes → redescendre sans élan", color: "#EF4444" },
  cardio: { cue: "Mouvement continu à rythme régulier", color: "#06B6D4" },
  carry: { cue: "Marcher droit → pas contrôlés", color: "#64748B" },
  unknown: { cue: "Suivre le mouvement animé lentement", color: "#64748B" },
};

export const PremiumExerciseIllustrationV4: React.FC<{ exerciseId?: string; exerciseName?: string; muscleGroup?: string }> = ({ exerciseId, exerciseName = "Exercice", muscleGroup = "Mouvement" }) => {
  const spec = useMemo(() => classifyExerciseMotion(exerciseId, exerciseName, muscleGroup), [exerciseId, exerciseName, muscleGroup]);
  const hint = familyHints[spec.family] || familyHints.unknown;

  return (
    <div className="relative w-full h-full overflow-hidden rounded-3xl border border-white/15 bg-[#0B1118] shadow-[0_24px_70px_rgba(0,0,0,.32)]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,.10),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(242,97,34,.12),transparent_34%)]" />
      <div className="relative z-10 flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: hint.color, boxShadow: `0 0 14px ${hint.color}` }} />
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/55">Animation guidée premium</span>
          </div>
          <div className="mt-1 truncate text-sm font-black uppercase tracking-wide text-white">{spec.label}</div>
        </div>
        <div className="shrink-0 rounded-xl border border-white/10 bg-black/20 px-3 py-1.5 text-right">
          <div className="text-[9px] font-black uppercase tracking-wider text-white/40">Zone ciblée</div>
          <div className="text-[10px] font-black uppercase text-white/80">{spec.muscle}</div>
        </div>
      </div>

      <div className="relative h-[calc(100%-106px)] min-h-0 p-2 sm:p-3">
        <div className="relative h-full overflow-hidden rounded-2xl border border-[#D5DEE7] bg-[#F7FAFD] shadow-inner">
          <PremiumExerciseIllustrationV2 exerciseId={exerciseId} exerciseName={exerciseName} muscleGroup={muscleGroup} />
          <div className="pointer-events-none absolute left-3 top-3 rounded-xl border border-slate-200/80 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm">
            <div className="text-[9px] font-black uppercase tracking-wider text-slate-400">Geste</div>
            <div className="mt-0.5 max-w-[260px] text-[11px] font-extrabold leading-4 text-slate-800">{hint.cue}</div>
          </div>
          <div className="pointer-events-none absolute right-3 bottom-3 rounded-xl border border-white/80 bg-slate-950/90 px-3 py-2 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-white/55">
              <span className="inline-flex h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: hint.color }} />
              Boucle continue
            </div>
            <div className="mt-0.5 text-[10px] font-bold text-white/90">Départ → mouvement → fin → retour</div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-2 px-4 pb-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/3 rounded-full animate-[premiumProgress_3.4s_ease-in-out_infinite]" style={{ background: `linear-gradient(90deg, ${hint.color}, rgba(255,255,255,.85))` }} />
        </div>
        <span className="text-[9px] font-black uppercase tracking-wider text-white/40">Répète le geste</span>
      </div>

      <style>{`@keyframes premiumProgress{0%{transform:translateX(-115%)}50%{transform:translateX(145%)}100%{transform:translateX(-115%)}}`}</style>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { findVerifiedExerciseMedia, type VerifiedExerciseMedia } from "../data/verifiedExerciseMedia";
import { DUOTONE_IMAGE_STYLE, DUOTONE_OVERLAY_STYLE } from "../data/exerciseMediaResolver";

type Props = { exerciseId?: string; exerciseName?: string; muscleGroup?: string; reps?: string };

export const ExerciseMediaAnimation: React.FC<Props> = ({ exerciseId = "", exerciseName = "Exercice", muscleGroup = "Mouvement", reps }) => {
  const [verified, setVerified] = useState<VerifiedExerciseMedia | null>(null);
  const [frame, setFrame] = useState<0 | 1>(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const exact = findVerifiedExerciseMedia(exerciseId, exerciseName);
    setVerified(exact);
    setFrame(0);
    setFailed(false);
  }, [exerciseId, exerciseName]);

  useEffect(() => {
    if (!verified) return;
    const timer = window.setInterval(() => setFrame((current) => current === 0 ? 1 : 0), 650);
    return () => window.clearInterval(timer);
  }, [verified]);

  const placeholder = (
    <div className="relative flex h-full min-h-[280px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#070B10]">
      <div className="mx-5 max-w-sm rounded-2xl border border-white/10 bg-black/40 px-5 py-6 text-center">
        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">Démonstration indisponible</div>
        <div className="mt-2 text-sm font-semibold text-white/80">Aucune animation validée n'est disponible pour cet exercice.</div>
      </div>
    </div>
  );

  if (!verified || failed) return placeholder;

  const currentFrame = frame === 0 ? verified.frame0Url : verified.frame1Url;
  return (
    <div className="relative flex h-full min-h-[280px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#070B10]">
      <img
        src={currentFrame}
        alt={`Démonstration de ${exerciseName}`}
        onError={() => setFailed(true)}
        className="h-full w-full object-contain p-5 sm:p-8"
        style={DUOTONE_IMAGE_STYLE}
        loading="eager"
        decoding="async"
      />
      <div className="pointer-events-none absolute inset-0" style={DUOTONE_OVERLAY_STYLE} />
      <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
        <div className="rounded-xl border border-white/10 bg-black/65 px-3 py-2 backdrop-blur-md">
          <div className="text-[9px] font-black uppercase tracking-[0.16em] text-[#FF6A00]">Démonstration • 2 frames</div>
          <div className="mt-0.5 max-w-[230px] truncate text-xs font-black text-white">{verified.exerciseName}</div>
        </div>
        {reps && <div className="rounded-xl border border-white/10 bg-black/65 px-3 py-2 text-right"><div className="text-[8px] font-black uppercase text-white/50">Objectif</div><div className="text-xs font-black text-white">{reps}</div></div>}
      </div>
      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
        <div className="rounded-lg bg-black/70 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider text-white/80">{muscleGroup}</div>
        <div className="rounded-lg bg-black/70 px-2.5 py-1.5 text-[9px] font-black text-white/70">Frame {frame} • Média validé</div>
      </div>
    </div>
  );
};

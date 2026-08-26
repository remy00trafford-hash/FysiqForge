import React, { useEffect, useState } from "react";
import { findExerciseMedia, DUOTONE_IMAGE_STYLE, DUOTONE_OVERLAY_STYLE, type ExerciseMediaAsset } from "../data/exerciseMediaResolver";
import { PremiumWhiteHumanExerciseAnimation } from "./PremiumWhiteHumanExerciseAnimation";

type Props = { exerciseId?: string; exerciseName?: string; muscleGroup?: string; reps?: string };

export const ExerciseMediaAnimation: React.FC<Props> = ({ exerciseId = "", exerciseName = "Exercice", muscleGroup = "Mouvement", reps }) => {
  const [media, setMedia] = useState<ExerciseMediaAsset | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    setMedia(null); setLoading(true); setFailed(false);
    findExerciseMedia(exerciseId, exerciseName)
      .then((result) => { if (alive) setMedia(result); })
      .catch(() => { if (alive) setMedia(null); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [exerciseId, exerciseName]);

  if (loading) return <div className="relative flex h-full min-h-[280px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#070B10]"><div className="rounded-full border border-white/10 bg-black/60 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white/70">Chargement de la démonstration</div></div>;

  if (media && !failed) {
    return (
      <div className="relative flex h-full min-h-[280px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#070B10]">
        <div className="relative h-full w-full">
          <img src={media.images[0]} alt={`Démonstration de ${exerciseName}`} onError={() => setFailed(true)} className="h-full w-full object-contain p-5 sm:p-8" style={DUOTONE_IMAGE_STYLE} loading="eager" decoding="async" />
          <div className="pointer-events-none absolute inset-0" style={DUOTONE_OVERLAY_STYLE} />
        </div>
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="rounded-xl border border-white/10 bg-black/65 px-3 py-2 backdrop-blur-md"><div className="text-[9px] font-black uppercase tracking-[0.16em] text-[#FF6A00]">Démonstration</div><div className="mt-0.5 max-w-[230px] truncate text-xs font-black text-white">{media.name}</div></div>
          {reps && <div className="rounded-xl border border-white/10 bg-black/65 px-3 py-2 text-right"><div className="text-[8px] font-black uppercase text-white/50">Objectif</div><div className="text-xs font-black text-white">{reps}</div></div>}
        </div>
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between gap-2"><div className="rounded-lg bg-black/70 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider text-white/80">{muscleGroup}</div><div className="rounded-lg bg-black/70 px-2.5 py-1.5 text-[9px] font-black text-white/70">{media.source === "wger.de" ? "Source : wger.de" : "Free Exercise DB"}</div></div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[280px] w-full overflow-hidden rounded-2xl bg-[#070B10]">
      <PremiumWhiteHumanExerciseAnimation exerciseId={exerciseId} exerciseName={exerciseName} muscleGroup={muscleGroup} />
      <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2"><div className="rounded-xl border border-white/10 bg-black/65 px-3 py-2 backdrop-blur-md"><div className="text-[9px] font-black uppercase tracking-[0.16em] text-[#FF6A00]">Démonstration</div><div className="mt-0.5 max-w-[230px] truncate text-xs font-black text-white">{exerciseName}</div></div>{reps && <div className="rounded-xl border border-white/10 bg-black/65 px-3 py-2 text-right"><div className="text-[8px] font-black uppercase text-white/50">Objectif</div><div className="text-xs font-black text-white">{reps}</div></div>}</div>
      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between"><div className="rounded-lg bg-black/70 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider text-white/80">{muscleGroup}</div><div className="rounded-lg bg-black/70 px-2.5 py-1.5 text-[9px] font-black text-white/70">Animation FysiqForge</div></div>
    </div>
  );
};
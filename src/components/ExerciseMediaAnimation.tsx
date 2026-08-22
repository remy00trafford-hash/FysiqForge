import React, { useEffect, useMemo, useState } from "react";
import { findExerciseMedia, exercisePlaceholderUrl, type ExerciseMediaAsset } from "../data/exerciseMediaResolver";

type Props = { exerciseId?: string; exerciseName?: string; muscleGroup?: string; reps?: string };

export const ExerciseMediaAnimation: React.FC<Props> = ({ exerciseId = "", exerciseName = "Exercice", muscleGroup = "Mouvement", reps }) => {
  const [media, setMedia] = useState<ExerciseMediaAsset | null>(null);
  const [failed, setFailed] = useState(false);
  const [frame, setFrame] = useState(0);
  const placeholder = useMemo(() => exercisePlaceholderUrl(exerciseName), [exerciseName]);

  useEffect(() => {
    let alive = true;
    setMedia(null);
    setFailed(false);
    setFrame(0);
    findExerciseMedia(exerciseId, exerciseName)
      .then((result) => { if (alive) setMedia(result); })
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, [exerciseId, exerciseName]);

  useEffect(() => {
    if (!media || media.images.length < 2) return;
    const interval = window.setInterval(() => setFrame((current) => (current + 1) % media.images.length), 650);
    return () => window.clearInterval(interval);
  }, [media]);

  const src = failed || !media ? placeholder : media.images[frame] || media.images[0];

  return (
    <div className="relative flex h-full min-h-[280px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#070B10]">
      <img
        src={src}
        alt={`Démonstration de ${exerciseName}`}
        onError={() => setFailed(true)}
        className="h-full w-full object-contain p-5 sm:p-8"
        loading="eager"
        decoding="async"
      />
      <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
        <div className="rounded-xl border border-white/10 bg-black/65 px-3 py-2 backdrop-blur-md">
          <div className="text-[9px] font-black uppercase tracking-[0.16em] text-[#FF6A00]">Démonstration</div>
          <div className="mt-0.5 max-w-[230px] truncate text-xs font-black text-white">{media?.name || exerciseName}</div>
        </div>
        {reps && <div className="rounded-xl border border-white/10 bg-black/65 px-3 py-2 text-right backdrop-blur-md"><div className="text-[8px] font-black uppercase text-white/50">Objectif</div><div className="text-xs font-black text-white">{reps}</div></div>}
      </div>
      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
        <div className="rounded-lg bg-black/70 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider text-white/80 backdrop-blur-md">{muscleGroup}</div>
        {media && <div className="rounded-lg bg-black/70 px-2.5 py-1.5 text-[9px] font-black text-white/60 backdrop-blur-md">{media.images.length > 1 ? "Animation automatique" : "Démonstration"}</div>}
      </div>
    </div>
  );
};

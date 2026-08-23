import React, { useEffect, useMemo, useState } from "react";
import { findExerciseGif, type ExerciseGifAsset } from "../data/exerciseGifResolver";
import { findExerciseMedia, exercisePlaceholderUrl, type ExerciseMediaAsset } from "../data/exerciseMediaResolver";

type Props = { exerciseId?: string; exerciseName?: string; muscleGroup?: string; reps?: string };

export const ExerciseMediaAnimation: React.FC<Props> = ({ exerciseId = "", exerciseName = "Exercice", muscleGroup = "Mouvement", reps }) => {
  const [gif, setGif] = useState<ExerciseGifAsset | null>(null);
  const [media, setMedia] = useState<ExerciseMediaAsset | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const placeholder = useMemo(() => exercisePlaceholderUrl(exerciseName), [exerciseName]);

  useEffect(() => {
    let alive = true;
    setGif(null);
    setMedia(null);
    setFailed(false);
    setLoading(true);

    findExerciseGif(exerciseId, exerciseName)
      .then((result) => {
        if (!alive) return;
        if (result) setGif(result);
        else return findExerciseMedia(exerciseId, exerciseName).then((fallback) => {
          if (alive) setMedia(fallback);
        });
      })
      .catch(() => {
        return findExerciseMedia(exerciseId, exerciseName)
          .then((fallback) => { if (alive) setMedia(fallback); })
          .catch(() => undefined);
      })
      .finally(() => { if (alive) setLoading(false); });

    return () => { alive = false; };
  }, [exerciseId, exerciseName]);

  const src = failed ? placeholder : gif?.gifUrl || media?.images?.[0] || placeholder;
  const isAnimated = Boolean(gif?.gifUrl);
  const displayName = gif?.name || media?.name || exerciseName;

  return (
    <div className="relative flex h-full min-h-[280px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#070B10]">
      <img
        src={src}
        alt={`Démonstration de ${exerciseName}`}
        onLoad={() => setLoading(false)}
        onError={() => { setFailed(true); setLoading(false); }}
        className="h-full w-full object-contain p-5 sm:p-8"
        loading="eager"
        decoding="async"
      />
      {loading && !failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#070B10]/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white/70">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF6A00]" />
            Chargement de la démonstration
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
        <div className="rounded-xl border border-white/10 bg-black/65 px-3 py-2 backdrop-blur-md">
          <div className="text-[9px] font-black uppercase tracking-[0.16em] text-[#FF6A00]">Démonstration</div>
          <div className="mt-0.5 max-w-[230px] truncate text-xs font-black text-white">{displayName}</div>
        </div>
        {reps && <div className="rounded-xl border border-white/10 bg-black/65 px-3 py-2 text-right backdrop-blur-md"><div className="text-[8px] font-black uppercase text-white/50">Objectif</div><div className="text-xs font-black text-white">{reps}</div></div>}
      </div>
      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
        <div className="rounded-lg bg-black/70 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider text-white/80 backdrop-blur-md">{muscleGroup}</div>
        <div className="rounded-lg bg-black/70 px-2.5 py-1.5 text-[9px] font-black text-white/60 backdrop-blur-md">
          {isAnimated ? "GIF • démonstration animée" : media ? "Démonstration" : "Visuel de secours"}
        </div>
      </div>
    </div>
  );
};
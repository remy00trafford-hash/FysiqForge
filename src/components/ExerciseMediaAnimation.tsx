import React, { useEffect, useMemo, useState } from "react";
import { findExerciseMedia, DUOTONE_IMAGE_STYLE, DUOTONE_OVERLAY_STYLE, type ExerciseMediaAsset } from "../data/exerciseMediaResolver";

type Props = { exerciseId?: string; exerciseName?: string; muscleGroup?: string; reps?: string };

const FRAME_INTERVAL_MS = 850;

export const ExerciseMediaAnimation: React.FC<Props> = ({ exerciseId = "", exerciseName = "Exercice", muscleGroup = "Mouvement", reps }) => {
  const [media, setMedia] = useState<ExerciseMediaAsset | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    let alive = true;
    setMedia(null);
    setLoading(true);
    setFailed(false);
    setFrameIndex(0);

    findExerciseMedia(exerciseId, exerciseName)
      .then((result) => {
        if (!alive) return;
        setMedia(result);
      })
      .catch(() => {
        if (alive) setMedia(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [exerciseId, exerciseName]);

  const frames = useMemo(() => {
    const urls = media?.images ?? [];
    return Array.from(new Set(urls.filter(Boolean))).slice(0, 2);
  }, [media]);

  useEffect(() => {
    if (frames.length < 2 || failed) return;

    let alive = true;
    const timer = window.setInterval(() => {
      if (alive) setFrameIndex((current) => (current + 1) % frames.length);
    }, FRAME_INTERVAL_MS);

    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, [frames, failed]);

  if (loading) {
    return <div className="relative flex h-full min-h-[280px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#070B10]" aria-busy="true" />;
  }

  if (!media || failed || frames.length === 0) {
    return <div className="h-full min-h-[280px] w-full rounded-2xl bg-[#070B10]" aria-label={`Animation indisponible pour ${exerciseName}`} />;
  }

  const activeFrame = frames[Math.min(frameIndex, frames.length - 1)];

  return (
    <div className="relative flex h-full min-h-[280px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#070B10]">
      <div className="relative h-full w-full">
        <img
          src={activeFrame}
          alt={`Démonstration de ${exerciseName}`}
          onError={() => setFailed(true)}
          className="h-full w-full object-contain p-5 sm:p-8"
          style={DUOTONE_IMAGE_STYLE}
          loading="eager"
          decoding="async"
        />
        {frames.length > 1 && (
          <img
            src={frames[(frameIndex + 1) % frames.length]}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-contain p-5 opacity-0 sm:p-8"
            loading="eager"
            decoding="async"
          />
        )}
        <div className="pointer-events-none absolute inset-0" style={DUOTONE_OVERLAY_STYLE} />
      </div>
      <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
        <div className="rounded-xl border border-white/10 bg-black/65 px-3 py-2 backdrop-blur-md">
          <div className="text-[9px] font-black uppercase tracking-[0.16em] text-[#FF6A00]">Démonstration</div>
          <div className="mt-0.5 max-w-[230px] truncate text-xs font-black text-white">{media.name}</div>
        </div>
        {reps && (
          <div className="rounded-xl border border-white/10 bg-black/65 px-3 py-2 text-right">
            <div className="text-[8px] font-black uppercase text-white/50">Objectif</div>
            <div className="text-xs font-black text-white">{reps}</div>
          </div>
        )}
      </div>
      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
        <div className="rounded-lg bg-black/70 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider text-white/80">{muscleGroup}</div>
        <div className="rounded-lg bg-black/70 px-2.5 py-1.5 text-[9px] font-black text-white/70">
          {media.source === "wger.de" ? "Source : wger.de" : "Free Exercise DB"}
        </div>
      </div>
    </div>
  );
};
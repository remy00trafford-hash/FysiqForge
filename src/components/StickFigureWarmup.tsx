import React, { useEffect, useState } from "react";
import { findExerciseGif } from "../data/exerciseGifResolver";
import { WARMUP_MEDIA_ATTRIBUTION } from "../data/warmupAttribution";

type WarmupMove = "shoulders" | "jacks" | "chest";
interface StickFigureWarmupProps { move: WarmupMove; }

const SEARCH: Record<WarmupMove, string> = {
  shoulders: "Standing Arms Circling",
  jacks: "Jumping Jack",
  chest: "Dynamic Chest Stretch (male)"
};

const FALLBACK_URLS: Record<WarmupMove, string> = {
  shoulders: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Shoulder_motion_with_rotator_cuff_%28supraspinatus%29.gif",
  jacks: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Jumping_jack_Animation.gif",
  chest: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Chest_stretch-CDC_strength_training_for_older_adults.gif"
};

const LABEL: Record<WarmupMove, string> = {
  shoulders: "Rotations Épaules & Coudes",
  jacks: "Jumping Jacks",
  chest: "Ouverture de Cage Thoracique"
};

const ATTRIBUTION: Record<WarmupMove, string> = {
  shoulders: WARMUP_MEDIA_ATTRIBUTION.shoulderRotation,
  jacks: WARMUP_MEDIA_ATTRIBUTION.jumpingJack,
  chest: WARMUP_MEDIA_ATTRIBUTION.chestStretch
};

export const StickFigureWarmup: React.FC<StickFigureWarmupProps> = ({ move }) => {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [fallbackTried, setFallbackTried] = useState(false);

  useEffect(() => {
    let alive = true;
    setSrc(null);
    setFailed(false);
    setFallbackTried(false);
    findExerciseGif(undefined, SEARCH[move])
      .then(asset => { if (alive && asset) setSrc(asset.gifUrl); })
      .catch(() => undefined);
    return () => { alive = false; };
  }, [move]);

  const handleError = () => {
    if (!fallbackTried) {
      setFallbackTried(true);
      setFailed(false);
      setSrc(FALLBACK_URLS[move]);
      return;
    }
    setFailed(true);
  };

  return (
    <div className="relative flex h-full min-h-[210px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#070B10] sm:min-h-[280px]">
      {src && !failed ? (
        <img
          src={src}
          alt={`Démonstration : ${LABEL[move]}`}
          onError={handleError}
          className="h-full w-full object-contain p-3 sm:p-6"
          loading="eager"
          decoding="async"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm font-black uppercase tracking-wider text-white/70">
          {src === null ? "Chargement de la démonstration…" : "Animation indisponible"}
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-2 bottom-2 flex items-center justify-between gap-2 sm:inset-x-3 sm:bottom-3">
        <div className="rounded-lg bg-black/70 px-2 py-1.5 text-[8px] font-black uppercase tracking-wider text-white/80 backdrop-blur-md sm:px-2.5 sm:text-[9px]">Échauffement</div>
        <div className="rounded-lg bg-black/70 px-2 py-1.5 text-[8px] font-black text-white/60 backdrop-blur-md sm:px-2.5 sm:text-[9px]">{ATTRIBUTION[move]}</div>
      </div>
    </div>
  );
};
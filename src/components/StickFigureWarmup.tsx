import React, { useEffect, useState } from "react";
import { findExerciseGif } from "../data/exerciseGifResolver";

type WarmupMove = "shoulders" | "jacks" | "chest";
interface StickFigureWarmupProps { move: WarmupMove; }

const SEARCH: Record<WarmupMove, string> = {
  shoulders: "Standing Arms Circling",
  jacks: "Jumping Jack",
  chest: "Dynamic Chest Stretch (male)"
};

const LABEL: Record<WarmupMove, string> = {
  shoulders: "Rotations Épaules & Coudes",
  jacks: "Jumping Jacks",
  chest: "Ouverture de Cage Thoracique"
};

export const StickFigureWarmup: React.FC<StickFigureWarmupProps> = ({ move }) => {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    setSrc(null);
    setFailed(false);
    findExerciseGif(undefined, SEARCH[move])
      .then(asset => { if (alive && asset) setSrc(asset.gifUrl); })
      .catch(() => undefined);
    return () => { alive = false; };
  }, [move]);

  return (
    <div className="relative flex h-full min-h-[210px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#070B10] sm:min-h-[280px]">
      {src && !failed ? (
        <img
          src={src}
          alt={`Démonstration : ${LABEL[move]}`}
          onError={() => setFailed(true)}
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
        <div className="rounded-lg bg-black/70 px-2 py-1.5 text-[8px] font-black text-white/60 backdrop-blur-md sm:px-2.5 sm:text-[9px]">GIF • démonstration</div>
      </div>
    </div>
  );
};
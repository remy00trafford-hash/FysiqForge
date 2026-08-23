import React, { useEffect, useState } from "react";
import { findExerciseGif } from "../data/exerciseGifResolver";
import { exercisePlaceholderUrl } from "../data/exerciseMediaResolver";

type WarmupMove = "shoulders" | "jacks" | "chest";
interface StickFigureWarmupProps { move: WarmupMove; }

const WARMUP_SEARCH: Record<WarmupMove, string> = {
  shoulders: "arm circles",
  jacks: "jumping jack",
  chest: "chest stretch"
};

const WARMUP_LABEL: Record<WarmupMove, string> = {
  shoulders: "Rotations des épaules",
  jacks: "Jumping jacks",
  chest: "Ouverture de poitrine"
};

// Exact ExerciseDB/ExerciseGymGifsDB jumping-jack asset (Jack Jump Male, id 3224).
const EXACT_WARMUP_GIFS: Partial<Record<WarmupMove, string>> = {
  jacks: "https://d205bpvrqc9yn1.cloudfront.net/3224.gif"
};

export const StickFigureWarmup: React.FC<StickFigureWarmupProps> = ({ move }) => {
  const [gif, setGif] = useState<string | null>(EXACT_WARMUP_GIFS[move] || null);
  const [failed, setFailed] = useState(false);
  const fallback = exercisePlaceholderUrl(WARMUP_LABEL[move]);

  useEffect(() => {
    let alive = true;
    setFailed(false);
    const exact = EXACT_WARMUP_GIFS[move];
    if (exact) {
      setGif(exact);
      return () => { alive = false; };
    }
    setGif(null);
    findExerciseGif(undefined, WARMUP_SEARCH[move])
      .then((result) => { if (alive && result) setGif(result.gifUrl); })
      .catch(() => undefined);
    return () => { alive = false; };
  }, [move]);

  return (
    <div className="relative flex h-full min-h-[220px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#070B10]">
      <img
        src={failed ? fallback : gif || fallback}
        alt={`Démonstration : ${WARMUP_LABEL[move]}`}
        onError={() => setFailed(true)}
        className="h-full w-full object-contain p-5 sm:p-8"
        loading="lazy"
        decoding="async"
      />
      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
        <div className="rounded-lg bg-black/70 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider text-white/80 backdrop-blur-md">Échauffement</div>
        <div className="rounded-lg bg-black/70 px-2.5 py-1.5 text-[9px] font-black text-white/60 backdrop-blur-md">{gif ? "GIF • démonstration" : "Préparation"}</div>
      </div>
    </div>
  );
};
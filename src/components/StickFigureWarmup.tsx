import React, { useEffect, useState } from "react";
import { findExerciseGif } from "../data/exerciseGifResolver";
import { exercisePlaceholderUrl } from "../data/exerciseMediaResolver";

type WarmupMove = "shoulders" | "jacks" | "chest";
interface StickFigureWarmupProps { move: WarmupMove; }

const WARMUP_SEARCHES: Record<WarmupMove, string[]> = {
  shoulders: ["standing arms circling", "standing alternate arms circling"],
  jacks: ["jumping jack"],
  chest: ["dynamic chest stretch (male)", "chest and front of shoulder stretch"]
};

const WARMUP_LABEL: Record<WarmupMove, string> = {
  shoulders: "Rotations des épaules",
  jacks: "Jumping jacks",
  chest: "Ouverture de poitrine"
};

const EXACT_WARMUP_GIFS: Partial<Record<WarmupMove, string>> = {
  jacks: "https://d205bpvrqc9yn1.cloudfront.net/3224.gif",
  chest: "https://d205bpvrqc9yn1.cloudfront.net/1167.gif"
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
    const tryNext = (index: number) => {
      if (index >= WARMUP_SEARCHES[move].length) return;
      findExerciseGif(undefined, WARMUP_SEARCHES[move][index])
        .then((result) => {
          if (!alive) return;
          if (result) setGif(result.gifUrl);
          else tryNext(index + 1);
        })
        .catch(() => { if (alive) tryNext(index + 1); });
    };
    tryNext(0);
    return () => { alive = false; };
  }, [move]);

  return (
    <div className="relative flex min-h-[210px] h-[min(44vh,360px)] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#070B10] sm:min-h-[280px] sm:h-full">
      <img
        src={failed ? fallback : gif || fallback}
        alt={`Démonstration : ${WARMUP_LABEL[move]}`}
        onError={() => setFailed(true)}
        className="h-full w-full object-contain p-2 sm:p-6"
        loading="eager"
        decoding="async"
      />
      <div className="pointer-events-none absolute inset-x-2 bottom-2 flex items-center justify-between gap-2 sm:inset-x-3 sm:bottom-3">
        <div className="rounded-lg bg-black/70 px-2 py-1.5 text-[8px] font-black uppercase tracking-wider text-white/80 backdrop-blur-md sm:px-2.5 sm:text-[9px]">Échauffement</div>
        <div className="rounded-lg bg-black/70 px-2 py-1.5 text-[8px] font-black text-white/60 backdrop-blur-md sm:px-2.5 sm:text-[9px]">{gif ? "GIF • démonstration" : "Préparation"}</div>
      </div>
    </div>
  );
};
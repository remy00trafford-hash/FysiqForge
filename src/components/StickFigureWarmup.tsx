import React, { useState } from "react";
import { WARMUP_MEDIA_ATTRIBUTION } from "../data/warmupAttribution";

type WarmupMove = "shoulders" | "jacks" | "chest";
interface StickFigureWarmupProps { move: WarmupMove; }

const MEDIA: Record<WarmupMove, { url: string; label: string; attribution: string }> = {
  shoulders: {
    url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Shoulder_motion_with_rotator_cuff_%28supraspinatus%29.gif",
    label: "Rotation / abduction de l'épaule",
    attribution: WARMUP_MEDIA_ATTRIBUTION.shoulderRotation
  },
  jacks: {
    url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Jumpingjacks.gif",
    label: "Jumping Jacks",
    attribution: WARMUP_MEDIA_ATTRIBUTION.jumpingJack
  },
  chest: {
    url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Chest_stretch-CDC_strength_training_for_older_adults.gif",
    label: "Ouverture de cage thoracique",
    attribution: WARMUP_MEDIA_ATTRIBUTION.chestStretch
  }
};

const LABEL: Record<WarmupMove, string> = {
  shoulders: "Rotations épaules",
  jacks: "Jumping Jacks",
  chest: "Ouverture de cage thoracique"
};

export const StickFigureWarmup: React.FC<StickFigureWarmupProps> = ({ move }) => {
  const [failed, setFailed] = useState(false);
  const media = MEDIA[move];

  return (
    <div className="relative flex h-full min-h-[210px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#070B10] sm:min-h-[280px]">
      {!failed ? (
        <img
          src={media.url}
          alt={`Démonstration : ${LABEL[move]}`}
          onError={() => setFailed(true)}
          className="h-full w-full object-contain p-3 sm:p-6"
          loading="eager"
          decoding="async"
          draggable={false}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm font-black uppercase tracking-wider text-white/70">
          Animation indisponible
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-2 top-2 sm:inset-x-3 sm:top-3">
        <div className="inline-flex rounded-lg border border-white/10 bg-black/70 px-2.5 py-1.5 text-[8px] font-black uppercase tracking-wider text-white/85 backdrop-blur-md sm:text-[9px]">
          Échauffement • animation réelle
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-2 bottom-2 flex items-center justify-between gap-2 sm:inset-x-3 sm:bottom-3">
        <div className="rounded-lg bg-black/70 px-2 py-1.5 text-[8px] font-black uppercase tracking-wider text-white/80 backdrop-blur-md sm:text-[9px]">
          {LABEL[move]}
        </div>
        <div className="max-w-[52%] truncate rounded-lg bg-black/70 px-2 py-1.5 text-[8px] font-black text-white/60 backdrop-blur-md sm:text-[9px]">
          {media.attribution}
        </div>
      </div>
    </div>
  );
};

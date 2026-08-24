import React from "react";
import { ExerciseMediaAnimation } from "./ExerciseMediaAnimation";
import { PremiumExerciseIllustrationV7 } from "./PremiumExerciseIllustrationV7";
import { EXERCISE_ANIMATION_IDS } from "../data/exerciseAnimationMap";

interface ExerciseAnimationFrameProps { exerciseId?: string; exerciseName?: string; muscleGroup?: string; reps?: string; videoSrc?: string; }

export const ExerciseAnimationFrame: React.FC<ExerciseAnimationFrameProps> = ({ exerciseId, exerciseName = "Exercice", muscleGroup = "Mouvement", reps, videoSrc }) => {
  const curated = Boolean(exerciseId && EXERCISE_ANIMATION_IDS[exerciseId]);
  if (curated) return (
    <div className="relative h-full min-h-[210px] w-full overflow-hidden rounded-2xl bg-[#070B10]">
      <PremiumExerciseIllustrationV7 exerciseId={exerciseId} exerciseName={exerciseName} muscleGroup={muscleGroup} />
      <div className="pointer-events-none absolute inset-x-2 top-2 flex items-center justify-between gap-2 sm:inset-x-3 sm:top-3">
        <div className="max-w-[72%] truncate rounded-xl border border-white/10 bg-black/65 px-2.5 py-2 text-[9px] font-black uppercase tracking-wider text-white/80 backdrop-blur-md sm:px-3 sm:text-[10px]">Animation humaine • mouvement adapté</div>
        {reps && <div className="shrink-0 rounded-xl border border-white/10 bg-black/65 px-2.5 py-2 text-[10px] font-black text-white backdrop-blur-md sm:px-3 sm:text-xs">{reps}</div>}
      </div>
    </div>
  );
  if (videoSrc) return (
    <div className="relative h-full min-h-[210px] w-full overflow-hidden rounded-2xl bg-[#070B10]">
      <video src={videoSrc} autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-contain" aria-label={`Démonstration vidéo : ${exerciseName}`} />
    </div>
  );
  return <ExerciseMediaAnimation exerciseId={exerciseId} exerciseName={exerciseName} muscleGroup={muscleGroup} reps={reps} />;
};
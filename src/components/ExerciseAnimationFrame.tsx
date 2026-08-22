import React from "react";
import { ExerciseMediaAnimation } from "./ExerciseMediaAnimation";

interface ExerciseAnimationFrameProps {
  exerciseId?: string;
  exerciseName?: string;
  muscleGroup?: string;
  reps?: string;
  videoSrc?: string;
}

export const ExerciseAnimationFrame: React.FC<ExerciseAnimationFrameProps> = ({ exerciseId, exerciseName = "Exercice", muscleGroup = "Mouvement", reps, videoSrc }) => {
  if (videoSrc) {
    return (
      <div className="relative h-full min-h-[280px] w-full overflow-hidden rounded-2xl bg-[#070B10]">
        <video src={videoSrc} autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-contain" aria-label={`Démonstration vidéo : ${exerciseName}`} />
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          <div className="rounded-xl border border-white/10 bg-black/65 px-3 py-2 text-xs font-black text-white backdrop-blur-md">Démonstration — {exerciseName}</div>
          {reps && <div className="rounded-xl border border-white/10 bg-black/65 px-3 py-2 text-xs font-black text-white backdrop-blur-md">{reps}</div>}
        </div>
      </div>
    );
  }

  return <ExerciseMediaAnimation exerciseId={exerciseId} exerciseName={exerciseName} muscleGroup={muscleGroup} reps={reps} />;
};

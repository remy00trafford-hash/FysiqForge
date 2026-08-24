import React, { useState } from "react";
import { getExerciseVideoSrc } from "../data/exerciseVideoMap";
import { ExerciseAnimationFrame } from "./ExerciseAnimationFrame";

interface Props {
  exerciseId?: string;
  exerciseName: string;
  muscleGroup?: string;
  reps?: string;
}

export const ExactExerciseVideo: React.FC<Props> = ({ exerciseId, exerciseName, muscleGroup, reps }) => {
  const [failed, setFailed] = useState(false);
  const src = getExerciseVideoSrc(exerciseId);

  if (!src || failed) {
    return <ExerciseAnimationFrame exerciseId={exerciseId} exerciseName={exerciseName} muscleGroup={muscleGroup} reps={reps} />;
  }

  return (
    <div className="relative w-full min-h-[210px] h-[min(52vh,520px)] sm:min-h-[280px] sm:h-full overflow-hidden rounded-2xl bg-[#070B10]">
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onError={() => setFailed(true)}
        className="absolute inset-0 h-full w-full object-contain"
        aria-label={`Démonstration vidéo : ${exerciseName}`}
      />
      <div className="pointer-events-none absolute inset-x-2 top-2 flex items-center justify-between gap-2 sm:inset-x-3 sm:top-3">
        <div className="max-w-[72%] truncate rounded-xl border border-white/10 bg-black/65 px-2.5 py-2 text-[10px] font-black text-white backdrop-blur-md sm:px-3 sm:text-xs">Démonstration — {exerciseName}</div>
        {reps && <div className="shrink-0 rounded-xl border border-white/10 bg-black/65 px-2.5 py-2 text-[10px] font-black text-white backdrop-blur-md sm:px-3 sm:text-xs">{reps}</div>}
      </div>
    </div>
  );
};
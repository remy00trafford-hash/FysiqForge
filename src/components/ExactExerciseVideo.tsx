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
    <div className="relative w-full h-full min-h-[280px] overflow-hidden rounded-2xl bg-[#F7FAFD]">
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
        className="h-full w-full object-contain"
        aria-label={`Démonstration vidéo : ${exerciseName}`}
      />
      <div className="absolute right-3 bottom-3 rounded-lg bg-black/70 px-2 py-1.5 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur-sm">
        Démo exacte · boucle
      </div>
    </div>
  );
};

import React, { useEffect, useMemo, useState } from "react";
import { Dumbbell, ImageOff } from "lucide-react";
import { findVerifiedExerciseMedia } from "../data/verifiedExerciseMedia";

export type PoseCategory = "push" | "pull" | "squat" | "lunge" | "core" | "hinge" | "cardio" | "stretch" | "shoulder" | "arm";

export function classifyExercisePose(name: string, muscleGroup?: string): PoseCategory {
  const text = `${name} ${muscleGroup || ""}`.toLowerCase();
  if (/lunge|split squat|pistol|step[- ]?up/.test(text)) return "lunge";
  if (/deadlift|romanian|rdl|good morning|hinge/.test(text)) return "hinge";
  if (/squat|leg press|wall sit/.test(text)) return "squat";
  if (/plank|crunch|abdo|core|leg raise|rollout/.test(text)) return "core";
  if (/jumping jack|mountain climber|burpee|cardio|jump|running/.test(text)) return "cardio";
  if (/overhead|shoulder press|lateral raise|face pull|shrug|viking|y raise/.test(text)) return "shoulder";
  if (/curl|biceps|triceps|pushdown|extension|kickback/.test(text)) return "arm";
  if (/row|rowing|pulldown|traction|pull-up|pull up/.test(text)) return "pull";
  if (/bench|incline|push-up|push up|pompe|dip|chest|fly|press/.test(text)) return "push";
  return "stretch";
}

interface ExercisePoseIllustrationProps {
  pose: PoseCategory;
  exerciseId?: string;
  exerciseName?: string;
  muscleGroup?: string;
  reps?: string;
}

export const ExercisePoseIllustration: React.FC<ExercisePoseIllustrationProps> = ({
  exerciseId,
  exerciseName = "Exercice",
  muscleGroup = "Mouvement",
  reps
}) => {
  const media = useMemo(() => findVerifiedExerciseMedia(exerciseId, exerciseName), [exerciseId, exerciseName]);
  const [frame, setFrame] = useState<0 | 1>(0);
  const [mediaError, setMediaError] = useState(false);

  useEffect(() => {
    setFrame(0);
    setMediaError(false);
  }, [media?.frame0Url, media?.frame1Url]);

  useEffect(() => {
    if (!media || mediaError) return;
    const timer = window.setInterval(() => setFrame((value) => value === 0 ? 1 : 0), 650);
    return () => window.clearInterval(timer);
  }, [media, mediaError]);

  const showMedia = Boolean(media && !mediaError);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0E0E14]">
      {showMedia && media ? (
        <>
          <img
            key={frame}
            src={frame === 0 ? media.frame0Url : media.frame1Url}
            alt={`${exerciseName} — démonstration du mouvement`}
            className="absolute inset-0 h-full w-full object-contain select-none transition-opacity duration-300"
            loading="lazy"
            draggable={false}
            onError={() => setMediaError(true)}
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0E0E14]/90 to-transparent pointer-events-none" />
          <div className="absolute left-2.5 top-2.5 rounded-full border border-white/10 bg-black/65 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">Démonstration</div>
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold text-white">{exerciseName}</p>
              <p className="truncate text-[9px] text-white/55">{muscleGroup}</p>
            </div>
            {reps ? <span className="shrink-0 rounded-full border border-white/10 bg-black/60 px-2 py-1 text-[9px] font-bold text-white/80">{reps}</span> : null}
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <div className="max-w-[180px] space-y-3">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              {mediaError ? <ImageOff className="h-5 w-5 text-white/35" /> : <Dumbbell className="h-5 w-5 text-white/35" />}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-white/80">Démonstration indisponible</p>
              <p className="mt-1 text-[9px] leading-relaxed text-white/40">Aucune animation validée n'est disponible pour cet exercice.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const EXERCISE_MOTIONS: Record<string, PoseCategory> = {};
export function classifyExerciseMotion(name: string, muscleGroup?: string) { return classifyExercisePose(name, muscleGroup); }

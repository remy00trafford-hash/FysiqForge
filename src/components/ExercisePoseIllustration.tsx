import React, { useEffect, useMemo, useState } from "react";

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
  if (/bench|incline|push-up|push up|pompe|dip|chest|fly|fly|press/.test(text)) return "push";
  return "stretch";
}

type FramePair = { frame0: string; frame1: string };

const VERIFIED_FRAME_PAIRS: Array<{ test: RegExp; frames: FramePair }> = [
  { test: /cable chest fly/i, frames: { frame0: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Bench_Press/0.png", frame1: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Bench_Press/1.png" } },
  { test: /wide push[- ]?up/i, frames: { frame0: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide_Hand_Push-Up/0.png", frame1: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide_Hand_Push-Up/1.png" } },
  { test: /close[- ]grip push[- ]?up/i, frames: { frame0: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-grip_push-up/0.png", frame1: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-grip_push-up/1.png" } },
  { test: /triceps dip/i, frames: { frame0: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dips_-_Triceps_Version/0.png", frame1: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dips_-_Triceps_Version/1.png" } },
  { test: /bench dip/i, frames: { frame0: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bench_Dip_-_Triceps_Version/0.png", frame1: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bench_Dip_-_Triceps_Version/1.png" } },
  { test: /dumbbell lying triceps extension/i, frames: { frame0: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lying_Triceps_Extension/0.png", frame1: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lying_Triceps_Extension/1.png" } },
  { test: /dumbbell kickback/i, frames: { frame0: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Kickback/0.png", frame1: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Kickback/1.png" } }
];

function resolveFrames(exerciseName: string): FramePair | undefined {
  return VERIFIED_FRAME_PAIRS.find(({ test }) => test.test(exerciseName))?.frames;
}

interface ExercisePoseIllustrationProps {
  pose: PoseCategory;
  exerciseId?: string;
  exerciseName?: string;
  muscleGroup?: string;
  reps?: string;
}

export const ExercisePoseIllustration: React.FC<ExercisePoseIllustrationProps> = ({ pose, exerciseName = "Exercice", muscleGroup = "Mouvement", reps }) => {
  const frames = useMemo(() => resolveFrames(exerciseName), [exerciseName]);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!frames) return;
    const timer = window.setInterval(() => setFrame((value) => value === 0 ? 1 : 0), 650);
    return () => window.clearInterval(timer);
  }, [frames]);

  if (frames) {
    return (
      <div className="absolute inset-0 bg-[#0E0E14] flex items-center justify-center overflow-hidden">
        <img
          src={frame === 0 ? frames.frame0 : frames.frame1}
          alt={`${exerciseName} — animation mouvement`}
          className="w-full h-full object-contain select-none"
          loading="lazy"
          draggable={false}
        />
        <div className="absolute bottom-2 right-2 rounded-md bg-black/65 border border-white/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white/80">
          Animation
        </div>
      </div>
    );
  }

  const motion = {
    push: "translateY(6px) rotate(-3deg)",
    pull: "translateY(-2px) rotate(4deg)",
    squat: "translateY(9px)",
    lunge: "translateX(7px) rotate(-5deg)",
    hinge: "translateY(7px) rotate(10deg)",
    core: "translateY(4px) rotate(-8deg)",
    cardio: "translateY(-7px)",
    stretch: "translateY(2px) rotate(-10deg)",
    shoulder: "translateY(-3px)",
    arm: "translateY(0)"
  }[pose];

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#171720] to-[#0B0B10] flex items-center justify-center overflow-hidden">
      <div className="relative w-24 h-36 animate-pulse" style={{ transform: motion }}>
        <div className="absolute left-1/2 top-1 w-7 h-7 -translate-x-1/2 rounded-full border-2 border-white/75" />
        <div className="absolute left-1/2 top-9 h-16 w-2 -translate-x-1/2 rounded-full bg-white/75" />
        <div className="absolute left-1/2 top-12 h-2 w-16 -translate-x-1/2 rounded-full bg-white/60" />
        <div className="absolute left-1/2 top-[72px] h-14 w-2 -translate-x-1/2 rounded-full bg-white/65" />
        <div className="absolute left-[34px] top-[72px] h-14 w-2 rounded-full bg-white/55 rotate-[12deg] origin-top" />
        <div className="absolute right-[34px] top-[72px] h-14 w-2 rounded-full bg-white/55 -rotate-[12deg] origin-top" />
      </div>
      <span className="absolute bottom-2 right-2 rounded-md bg-black/65 border border-white/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white/60">Mouvement</span>
    </div>
  );
};

export const EXERCISE_MOTIONS: Record<string, PoseCategory> = {};
export function classifyExerciseMotion(name: string, muscleGroup?: string) { return classifyExercisePose(name, muscleGroup); }

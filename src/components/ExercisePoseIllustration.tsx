import React from "react";
import {
  PremiumExerciseIllustration,
  classifyExerciseMotion,
  EXERCISE_MOTIONS as PREMIUM_EXERCISE_MOTIONS
} from "./PremiumExerciseIllustration";

export type PoseCategory = "push" | "pull" | "squat" | "lunge" | "core" | "hinge" | "cardio" | "stretch" | "shoulder" | "arm";

export function classifyExercisePose(name: string, muscleGroup?: string): PoseCategory {
  const text = `${name} ${muscleGroup || ""}`.toLowerCase();
  if (/fente|lunge|split squat|pistol|step[- ]?up/.test(text)) return "lunge";
  if (/deadlift|soulevé de terre|romanian|rdl|good morning|hinge/.test(text)) return "hinge";
  if (/squat|leg press|chaise murale|wall sit/.test(text)) return "squat";
  if (/gainage|plank|crunch|abdo|core|oblique|relevé de jambes|leg raise/.test(text)) return "core";
  if (/jumping jack|mountain climber|burpee|cardio|saut|jump|running|course/.test(text)) return "cardio";
  if (/militaire|overhead|shoulder press|élévation|lateral raise|oiseau|face pull|shrug/.test(text)) return "shoulder";
  if (/curl|biceps|triceps|pushdown|barre au front|skull/.test(text)) return "arm";
  if (/tirage|row|rowing|pulldown|traction|pull-up|pull up/.test(text)) return "pull";
  if (/développé|bench|incliné|incline|push[- ]?up|pompe|dip|pectoraux|chest|écarté|crossover/.test(text)) return "push";
  return "stretch";
}

interface ExercisePoseIllustrationProps {
  pose: PoseCategory;
  exerciseId?: string;
  exerciseName?: string;
  muscleGroup?: string;
}

export const ExercisePoseIllustration: React.FC<ExercisePoseIllustrationProps> = ({ exerciseId, exerciseName = "Exercice", muscleGroup = "Mouvement" }) => (
  <PremiumExerciseIllustration exerciseId={exerciseId} exerciseName={exerciseName} muscleGroup={muscleGroup} />
);

export const EXERCISE_MOTIONS = PREMIUM_EXERCISE_MOTIONS;
export { classifyExerciseMotion };

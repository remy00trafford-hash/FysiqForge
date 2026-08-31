import type { CSSProperties } from "react";
import { MASTER_EXERCISE_DATABASE } from "./masterExerciseDatabase";
import { getVerifiedExerciseMedia, type ExerciseMedia } from "./exerciseMediaRegistry";

export type ExerciseMediaSource = "free-exercise-db" | "RepDB" | "Wikimedia Commons" | "Pexels";
export type ExerciseMediaAsset = {
  id: string;
  name: string;
  images: string[];
  videoUrl?: string;
  score: number;
  source: ExerciseMediaSource;
  attribution?: string;
};

export const DUOTONE_IMAGE_STYLE: CSSProperties = { filter: "grayscale(1) contrast(1.35) brightness(.98)" };
export const DUOTONE_OVERLAY_STYLE: CSSProperties = { background: "linear-gradient(135deg,rgba(255,106,0,.78),rgba(11,15,20,.88))", mixBlendMode: "color" };

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function resolveMasterExercise(exerciseId = "", exerciseName = "") {
  if (exerciseId) {
    const byId = MASTER_EXERCISE_DATABASE.find((exercise) => exercise.id === exerciseId);
    if (byId) return byId;
  }
  const wanted = normalize(exerciseName);
  if (!wanted) return null;
  return MASTER_EXERCISE_DATABASE.find((exercise) => normalize(exercise.name) === wanted) ?? null;
}

function verifiedToAsset(exerciseName: string, media: ExerciseMedia): ExerciseMediaAsset {
  if (media.type === "image-pair") {
    return {
      id: `verified-${media.animationKey}`,
      name: exerciseName,
      images: [media.frame0Url, media.frame1Url],
      score: 1000,
      source: media.source === "RepDB" ? "RepDB" : "free-exercise-db",
      attribution: media.source === "RepDB"
        ? "RepDB — Free tier, commercial in-app use with attribution"
        : "Free Exercise DB — Unlicense",
    };
  }
  return {
    id: `verified-${media.animationKey}`,
    name: exerciseName,
    images: [],
    videoUrl: media.url,
    score: 1000,
    source: media.source,
    attribution: media.attribution ? `${media.source} — ${media.attribution}` : media.source,
  };
}

/**
 * Production rule: the master library is the only exercise source.
 * Media is returned only when the exact master's animationKey has a verified mapping.
 * There is deliberately NO fuzzy exercise search and NO cross-exercise fallback.
 */
export async function findExerciseMedia(exerciseId?: string, exerciseName?: string): Promise<ExerciseMediaAsset | null> {
  const master = resolveMasterExercise(exerciseId, exerciseName);
  if (!master) return null;
  const media = getVerifiedExerciseMedia(master.animationKey);
  if (!media) return null;
  return verifiedToAsset(master.name, media);
}

export function exercisePlaceholderUrl(exerciseName: string) {
  const label = encodeURIComponent((exerciseName || "Exercice").slice(0, 42));
  return `https://placehold.co/960x640/0B0F14/FF6A00/png?text=${label}`;
}

export const MEDIA_RESOLVER_RULES = {
  masterLibraryOnly: true,
  fuzzyMatching: false,
  crossExerciseFallback: false,
  missingMediaBehavior: "no-animation" as const,
  imagePairRequiresBothFrames: true,
};

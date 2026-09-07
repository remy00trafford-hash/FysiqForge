import type { ExerciseMediaAsset } from "./exerciseMediaResolver";
import {
  CANONICAL_MOTION_MAP,
  CANONICAL_ASSET_SLUGS,
  VERIFIED_127_EXERCISE_MAPPINGS,
} from "./verified127ExerciseMappings";

type WorkoutGuideFrame = { index: number; path: string; format?: string };
type WorkoutGuideExercise = {
  id: string;
  slug: string;
  name: string;
  equipment?: string;
  primaryMuscle?: string;
  secondaryMuscles?: string[];
  frames: WorkoutGuideFrame[];
};

const MANIFEST_URL = "https://cdn.jsdelivr.net/npm/@bryllim/workout-guide@1.0.0/manifest.json";
const ASSET_BASE = "https://cdn.jsdelivr.net/npm/@bryllim/workout-guide@1.0.0/";
const CACHE_KEY = "fysiqforge.workout-guide-manifest.v2";
let manifestPromise: Promise<WorkoutGuideExercise[]> | null = null;

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

const VERIFIED_BY_NAME = new Map(
  VERIFIED_127_EXERCISE_MAPPINGS.map((entry) => [normalize(entry.exerciseName), entry.canonicalTarget]),
);

// Never substitute a visually different movement just to fill a card.
const UNSAFE_GENERIC_TARGETS = new Set([
  "Cable Chest Press",
  "Rear Delt Row",
  "Hamstring Curl",
  "Landmine Rotation",
  "Kettlebell Snatch",
  "Clean and Press",
  "Thruster",
  "Wall Ball",
  "Tibialis Raise",
  "Thoracic Extension",
  "Thread the Needle",
  "Thoracic Rotation",
  "Ankle Mobility",
  "Shoulder Dislocate",
  "Pigeon Stretch",
  "Frog Stretch",
]);

function canonicalTargetFor(exerciseName: string) {
  return CANONICAL_MOTION_MAP[exerciseName] ?? VERIFIED_BY_NAME.get(normalize(exerciseName));
}

async function loadManifest() {
  if (manifestPromise) return manifestPromise;
  manifestPromise = fetch(MANIFEST_URL, { cache: "force-cache" })
    .then(async (response) => {
      if (!response.ok) throw new Error(`Workout Guide manifest HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Workout Guide manifest invalide");
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
      return data as WorkoutGuideExercise[];
    })
    .catch((error) => {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          if (Array.isArray(data)) return data as WorkoutGuideExercise[];
        }
      } catch {}
      manifestPromise = null;
      throw error;
    });
  return manifestPromise;
}

export async function findWorkoutGuideMedia(exerciseName: string): Promise<ExerciseMediaAsset | null> {
  const canonicalTarget = canonicalTargetFor(exerciseName);
  if (!canonicalTarget || UNSAFE_GENERIC_TARGETS.has(canonicalTarget)) return null;

  const canonicalSlug = CANONICAL_ASSET_SLUGS[canonicalTarget];
  if (!canonicalSlug) return null;

  const catalog = await loadManifest();
  const item = catalog.find((candidate) => normalize(candidate.slug) === normalize(canonicalSlug));
  if (!item || item.frames.length < 3) return null;

  const frames = item.frames.slice().sort((a, b) => a.index - b.index).slice(0, 3).map((frame) => `${ASSET_BASE}${frame.path}`);
  if (frames.length !== 3 || frames.some((url) => !url.endsWith(".svg"))) return null;

  return {
    id: `workout-guide-${item.id}`,
    name: item.name,
    images: frames,
    equipment: item.equipment,
    primaryMuscles: item.primaryMuscle ? [item.primaryMuscle] : [],
    score: 1000,
    source: "workout-guide" as ExerciseMediaAsset["source"],
    attribution: "Original exercise artwork by Everkinetic, expanded by Bryl Lim, licensed under CC BY-SA 4.0.",
  };
}

export function workoutGuideLicense() {
  return "CC BY-SA 4.0";
}

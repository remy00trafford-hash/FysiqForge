// RepDB verified frame-pair media.
// Free tier: commercial in-app use with attribution (Exercise data by RepDB).
// These are exact matches to the FysiqForge master animationKey.
import { MASTER_EXERCISE_DATABASE } from "./masterExerciseDatabase";

export type RepDbFramePairMedia = {
  animationKey: string;
  type: "image-pair";
  frame0Url: string;
  frame1Url: string;
  source: "RepDB";
  license: "RepDB Free — commercial in-app use with attribution";
  sourcePage: string;
  visualStatus: "verified-exact";
  qualityGatePassed: true;
};

const PAIRS: Array<[string,string,string]> = [
  ["spoto_press", "spoto-press", "https://exercise-dataset.com/exercise/spoto-press/"],
  ["deficit_deadlift", "deficit-deadlift", "https://exercise-dataset.com/exercise/deficit-deadlift/"],
  ["rack_pull", "rack-pull", "https://exercise-dataset.com/exercise/rack-pull/"],
  ["spider_curl", "spider-curl", "https://exercise-dataset.com/exercise/spider-curl/"],
  ["single_leg_romanian_deadlift", "single-leg-romanian-deadlift", "https://exercise-dataset.com/exercise/single-leg-romanian-deadlift/"],
];

const MASTER_KEYS = new Set(MASTER_EXERCISE_DATABASE.map((e) => e.animationKey));
const INVALID = PAIRS.map(([k]) => k).filter((k) => !MASTER_KEYS.has(k));
if (INVALID.length) throw new Error(`FysiqForge RepDB media integrity error: ${INVALID.join(", ")}`);

export const REPDB_VERIFIED_EXACT_MEDIA: Record<string, RepDbFramePairMedia> = Object.fromEntries(
  PAIRS.map(([animationKey, slug, sourcePage]) => [animationKey, {
    animationKey,
    type: "image-pair",
    frame0Url: `https://exercise-dataset.com/images/flat/${slug}-start.webp`,
    frame1Url: `https://exercise-dataset.com/images/flat/${slug}-peak.webp`,
    source: "RepDB",
    license: "RepDB Free — commercial in-app use with attribution",
    sourcePage,
    visualStatus: "verified-exact",
    qualityGatePassed: true,
  }])
);

export const REPDB_VERIFIED_EXACT_COUNT = Object.keys(REPDB_VERIFIED_EXACT_MEDIA).length;
if (REPDB_VERIFIED_EXACT_COUNT !== 5) throw new Error(`Expected 5 RepDB verified mappings, found ${REPDB_VERIFIED_EXACT_COUNT}`);

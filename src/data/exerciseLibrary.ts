/**
 * FysiqForge exercise library selection engine.
 *
 * The master database contains 600 selectable entries built from 120 standard
 * movement identities and five explicit programming prescriptions per identity.
 * This module turns those entries into a deterministic selection layer for the
 * questionnaire: objective, target zone, experience level, equipment, session
 * duration and user constraints.
 *
 * Design rule: the plan generator selects existing exercise IDs; it must not
 * invent exercise names or IDs. Media is attached later to baseMovementId,
 * after independent visual + licence verification.
 *
 * Programming principles used here are deliberately conservative: match the
 * exercise to the user's goal and available equipment, prioritize major muscle
 * groups, and scale training progressively rather than relying on arbitrary
 * complexity. These principles are consistent with current ACSM resistance-
 * training guidance and WHO physical-activity guidance.
 */

import {
  MASTER_EXERCISE_DATABASE,
  type MasterExercise,
  type MasterExerciseCategory,
} from "./masterExerciseDatabase";

export type ExerciseObjective =
  | "Prise de masse (Hypertrophie)"
  | "Perte de gras (Sèche)"
  | "Tonification & Définition"
  | "Force & Athlétisme";

export type ExerciseTargetZone =
  | "Tout le corps"
  | "Pectoraux & Triceps"
  | "Epaules & Dos"
  | "Bras (Biceps/Triceps)"
  | "Abdominaux & Core"
  | "Jambes & Fessiers";

export type ExerciseLevel = "Débutant" | "Intermédiaire" | "Avancé";

export type ExerciseEquipment =
  | "Salle de sport équipée"
  | "Haltères + Banc maison"
  | "Poids du corps (Sans matériel)";

export interface ExerciseSelectionQuery {
  objective: ExerciseObjective;
  targetZone: ExerciseTargetZone;
  level: ExerciseLevel;
  equipment: ExerciseEquipment;
  duration: "30-45" | "45-60" | "60-90";
  constraints?: string;
  limit?: number;
  excludeIds?: string[];
}

export interface ExerciseLibraryItem extends MasterExercise {
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipmentTags: string[];
  objectiveTags: string[];
  targetZoneTags: string[];
  durationFit: Array<"30-45" | "45-60" | "60-90">;
  constraintTags: string[];
  movementFamily: string;
}

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const includesAny = (value: string, terms: string[]) =>
  terms.some((term) => value.includes(term));

const BODYWEIGHT_TERMS = ["push-up", "push up", "plank", "pull-up", "pull up", "chin-up", "chin up", "dip", "lunge", "squat", "crawl", "burpee", "jump", "mountain climber", "inchworm", "bird dog", "dead bug", "hollow", "crunch", "sit-up", "sit up", "bridge", "fire hydrant", "pistol", "wall sit"];

function deriveMetadata(entry: MasterExercise): Omit<ExerciseLibraryItem, keyof MasterExercise> {
  const text = normalize(`${entry.baseMovement} ${entry.variant}`);
  const category = entry.category;

  let primaryMuscles: string[];
  let secondaryMuscles: string[];

  if (category === "chest") {
    primaryMuscles = ["pectoraux"];
    secondaryMuscles = ["triceps", "deltoides_anterior"];
  } else if (category === "back") {
    primaryMuscles = ["dos"];
    secondaryMuscles = ["biceps", "trapezes"];
  } else if (category === "shoulders") {
    primaryMuscles = ["epaules"];
    secondaryMuscles = ["triceps", "haut_du_dos"];
  } else if (category === "arms") {
    primaryMuscles = includesAny(text, ["tricep", "pushdown", "skull crusher", "overhead triceps", "kickback"])
      ? ["triceps"]
      : ["biceps"];
    secondaryMuscles = ["avant_bras"];
  } else if (category === "legs") {
    if (includesAny(text, ["curl", "nordic", "romanian", "stiff leg", "good morning", "pull through"])) {
      primaryMuscles = ["ischio_jambiers"];
      secondaryMuscles = ["fessiers"];
    } else if (includesAny(text, ["hip thrust", "glute", "kickback", "fire hydrant", "abduction"])) {
      primaryMuscles = ["fessiers"];
      secondaryMuscles = ["ischio_jambiers", "quadriceps"];
    } else if (includesAny(text, ["calf", "tibialis"])) {
      primaryMuscles = ["mollets"];
      secondaryMuscles = ["tibial_anterieur"];
    } else {
      primaryMuscles = ["quadriceps"];
      secondaryMuscles = ["fessiers", "ischio_jambiers"];
    }
  } else if (category === "core") {
    primaryMuscles = ["core"];
    secondaryMuscles = ["abdominaux", "obliques"];
  } else if (category === "conditioning") {
    primaryMuscles = ["corps_entier"];
    secondaryMuscles = ["systeme_cardiorespiratoire"];
  } else {
    primaryMuscles = ["mobilite"];
    secondaryMuscles = ["recuperation"];
  }

  const equipmentTags = new Set<string>(["bodyweight"]);
  if (includesAny(text, ["barbell", "ez-bar"])) equipmentTags.add("barbell");
  if (includesAny(text, ["dumbbell"])) equipmentTags.add("dumbbell");
  if (includesAny(text, ["cable"])) equipmentTags.add("cable");
  if (includesAny(text, ["machine", "pec deck", "leg press"])) equipmentTags.add("machine");
  if (includesAny(text, ["smith"])) equipmentTags.add("smith_machine");
  if (includesAny(text, ["landmine"])) equipmentTags.add("landmine");
  if (includesAny(text, ["kettlebell"])) equipmentTags.add("kettlebell");
  if (includesAny(text, ["band"])) equipmentTags.add("resistance_band");
  if (includesAny(text, ["ring"])) equipmentTags.add("rings");
  if (includesAny(text, ["sled"])) equipmentTags.add("sled");
  if (includesAny(text, ["med ball"])) equipmentTags.add("medicine_ball");
  if (includesAny(text, ["trap-bar"])) equipmentTags.add("trap_bar");
  if (includesAny(text, ["bench"])) equipmentTags.add("bench");

  const objectiveTags = category === "conditioning"
    ? ["Perte de gras (Sèche)", "Force & Athlétisme", "Tonification & Définition"]
    : category === "mobility_recovery"
      ? ["Tonification & Définition", "Force & Athlétisme"]
      : ["Prise de masse (Hypertrophie)", "Force & Athlétisme", "Tonification & Définition"];

  const targetZoneTags = category === "chest"
    ? ["Tout le corps", "Pectoraux & Triceps"]
    : category === "back"
      ? ["Tout le corps", "Epaules & Dos"]
      : category === "shoulders"
        ? ["Tout le corps", "Epaules & Dos"]
        : category === "arms"
          ? ["Tout le corps", "Pectoraux & Triceps", "Bras (Biceps/Triceps)", "Epaules & Dos"]
          : category === "legs"
            ? ["Tout le corps", "Jambes & Fessiers"]
            : category === "core"
              ? ["Tout le corps", "Abdominaux & Core"]
              : ["Tout le corps"];

  const durationFit = category === "conditioning"
    ? ["30-45", "45-60", "60-90"]
    : category === "mobility_recovery"
      ? ["30-45", "45-60"]
      : ["30-45", "45-60", "60-90"];

  const constraintTags = [
    "requires_no_special_medical_clearance",
    ...(includesAny(text, ["jump", "burpee", "broad jump", "box jump", "sprint", "skater"])
      ? ["high_impact"]
      : ["low_impact"]),
    ...(BODYWEIGHT_TERMS.some((term) => text.includes(term)) ? ["home_friendly"] : []),
    ...(entry.category === "mobility_recovery" ? ["recovery_friendly"] : []),
  ];

  const movementFamily = entry.baseMovement;

  return {
    primaryMuscles,
    secondaryMuscles,
    equipmentTags: [...equipmentTags],
    objectiveTags,
    targetZoneTags,
    durationFit,
    constraintTags,
    movementFamily,
  };
}

export const EXERCISE_LIBRARY: ExerciseLibraryItem[] = MASTER_EXERCISE_DATABASE.map((entry) => ({
  ...entry,
  ...deriveMetadata(entry),
}));

export const EXERCISE_LIBRARY_COUNT = EXERCISE_LIBRARY.length;

export function exerciseMatchesEquipment(item: ExerciseLibraryItem, equipment: ExerciseEquipment): boolean {
  if (equipment === "Salle de sport équipée") return true;
  if (equipment === "Haltères + Banc maison") {
    return item.equipmentTags.every((tag) => ["bodyweight", "dumbbell", "bench"].includes(tag));
  }
  return item.equipmentTags.every((tag) => tag === "bodyweight");
}

function matchesConstraints(item: ExerciseLibraryItem, constraints: string): boolean {
  const c = normalize(constraints || "");
  if (!c) return true;

  if (includesAny(c, ["genou", "knee"]) && includesAny(item.name.toLowerCase(), ["jump", "box jump", "jumping lunge", "sprint"])) return false;
  if (includesAny(c, ["dos", "lombaire", "lower back"]) && includesAny(item.baseMovement.toLowerCase(), ["deadlift", "good morning", "bent-over row"])) return false;
  if (includesAny(c, ["epaule", "shoulder"]) && includesAny(item.baseMovement.toLowerCase(), ["overhead press", "behind-the-neck"])) return false;
  if (includesAny(c, ["impact", "sans impact", "low impact"]) && item.constraintTags.includes("high_impact")) return false;
  return true;
}

function levelScore(item: ExerciseLibraryItem, requested: ExerciseLevel): number {
  const text = normalize(`${item.baseMovement} ${item.variant}`);
  const isAdvancedPattern = includesAny(text, ["pistol", "nordic", "toes-to-bar", "weighted", "deficit", "zercher", "jerk", "jump"]);
  const isBeginnerFriendly = includesAny(text, ["assisted", "supported", "incline push-up", "bodyweight", "machine"]);

  if (requested === "Débutant") return isBeginnerFriendly ? 10 : isAdvancedPattern ? 0 : 5;
  if (requested === "Avancé") return isAdvancedPattern ? 10 : 5;
  return isBeginnerFriendly ? 7 : isAdvancedPattern ? 7 : 10;
}

function equipmentScore(item: ExerciseLibraryItem, requested: ExerciseEquipment): number {
  return exerciseMatchesEquipment(item, requested) ? 10 : 0;
}

export function scoreExercise(item: ExerciseLibraryItem, query: ExerciseSelectionQuery): number {
  let score = 0;
  if (item.objectiveTags.includes(query.objective)) score += 25;
  if (item.targetZoneTags.includes(query.targetZone)) score += 30;
  score += levelScore(item, query.level);
  score += equipmentScore(item, query.equipment);
  if (item.durationFit.includes(query.duration)) score += 10;
  if (matchesConstraints(item, query.constraints || "")) score += 10;
  else return -Infinity;
  if (item.category === "conditioning" && query.targetZone !== "Tout le corps") score -= 4;
  if (item.category === "mobility_recovery" && query.objective === "Prise de masse (Hypertrophie)") score -= 8;
  return score;
}

export function selectExercises(query: ExerciseSelectionQuery): ExerciseLibraryItem[] {
  const excluded = new Set(query.excludeIds || []);
  const limit = Math.min(30, Math.max(1, query.limit || 8));

  return EXERCISE_LIBRARY
    .filter((item) => !excluded.has(item.id))
    .map((item) => ({ item, score: scoreExercise(item, query) }))
    .filter(({ score }) => Number.isFinite(score) && score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
    .slice(0, limit)
    .map(({ item }) => item);
}

export function getLibraryDistribution() {
  return EXERCISE_LIBRARY.reduce<Record<MasterExerciseCategory, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {
    chest: 0,
    back: 0,
    shoulders: 0,
    arms: 0,
    legs: 0,
    core: 0,
    conditioning: 0,
    mobility_recovery: 0,
  });
}

if (EXERCISE_LIBRARY_COUNT !== 600) {
  throw new Error(`Expected 600 exercise library entries, found ${EXERCISE_LIBRARY_COUNT}`);
}

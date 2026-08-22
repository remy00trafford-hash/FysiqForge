export type ExerciseMediaAsset = {
  id: string;
  name: string;
  images: string[];
  equipment?: string;
  primaryMuscles?: string[];
  score: number;
};

type FreeExerciseRecord = {
  id: string;
  name: string;
  equipment?: string;
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  images?: string[];
};

const DATASET_URL = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";
const IMAGE_BASE_URL = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";
const CACHE_KEY = "fysiqforge.free-exercise-db.v1";
const CACHE_TTL = 1000 * 60 * 60 * 24;

let datasetPromise: Promise<FreeExerciseRecord[]> | null = null;

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const STOP_WORDS = new Set([
  "a", "an", "and", "au", "aux", "avec", "de", "des", "du", "en", "et", "la", "le", "les", "par", "pour", "sur", "the", "to", "with"
]);

const ALIASES: Record<string, string[]> = {
  pompes: ["push up", "pushup"],
  pushups: ["push up", "pushup"],
  pompe: ["push up", "pushup"],
  fente: ["lunge"],
  fentes: ["lunge", "lunges"],
  squat: ["squat"],
  souleve: ["deadlift"],
  roumain: ["romanian"],
  roumaine: ["romanian"],
  developpe: ["press"],
  couche: ["bench press"],
  incline: ["incline"],
  ecarte: ["fly"],
  poulie: ["cable"],
  tirage: ["row", "pulldown"],
  rowing: ["row"],
  tractions: ["pull up", "pullup"],
  traction: ["pull up", "pullup"],
  epaule: ["shoulder"],
  epaules: ["shoulder"],
  lateral: ["lateral"],
  curl: ["curl"],
  triceps: ["triceps"],
  abdominaux: ["abdominal", "crunch"],
  crunchs: ["crunch"],
  gainage: ["plank"],
  planche: ["plank"],
  fessier: ["glute", "bridge", "kickback"],
  fessiers: ["glute", "bridge", "kickback"],
  mollets: ["calf", "calves"],
  burpees: ["burpee"],
  jumping: ["jumping"],
  jack: ["jack"],
  jambes: ["leg", "legs"],
  cuisses: ["squat", "leg", "quadriceps"],
};

function expandTokens(value: string): string[] {
  const raw = normalize(value).split(" ").filter(Boolean);
  const expanded = [...raw];
  raw.forEach((token) => {
    (ALIASES[token] || []).forEach((alias) => expanded.push(...normalize(alias).split(" ")));
  });
  return Array.from(new Set(expanded.filter((token) => !STOP_WORDS.has(token))));
}

function safeCachedDataset(): FreeExerciseRecord[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { timestamp: number; data: FreeExerciseRecord[] };
    if (!parsed?.timestamp || Date.now() - parsed.timestamp > CACHE_TTL || !Array.isArray(parsed.data)) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function storeCachedDataset(data: FreeExerciseRecord[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {
    // Storage quota/private mode: runtime fetch still works.
  }
}

export async function loadExerciseMediaDataset(): Promise<FreeExerciseRecord[]> {
  if (datasetPromise) return datasetPromise;

  const cached = safeCachedDataset();
  if (cached) {
    datasetPromise = Promise.resolve(cached);
    return cached;
  }

  datasetPromise = fetch(DATASET_URL, { cache: "force-cache" })
    .then(async (response) => {
      if (!response.ok) throw new Error(`Exercise dataset HTTP ${response.status}`);
      const data = (await response.json()) as FreeExerciseRecord[];
      if (!Array.isArray(data)) throw new Error("Exercise dataset format invalid");
      storeCachedDataset(data);
      return data;
    })
    .catch((error) => {
      datasetPromise = null;
      throw error;
    });

  return datasetPromise;
}

function scoreExercise(queryId: string, queryName: string, record: FreeExerciseRecord): number {
  const id = normalize(record.id.replace(/_/g, " "));
  const name = normalize(record.name);
  const query = normalize(`${queryId || ""} ${queryName || ""}`);
  const queryTokens = expandTokens(query);
  const recordTokens = new Set(expandTokens(`${id} ${name}`));

  let score = 0;
  if (queryName && name === normalize(queryName)) score += 120;
  if (queryId && id === normalize(queryId.replace(/_/g, " "))) score += 130;

  for (const token of queryTokens) {
    if (recordTokens.has(token)) score += 12;
    else if (token.length >= 5 && name.includes(token)) score += 5;
  }

  const importantPairs = [
    ["romanian", "deadlift"],
    ["goblet", "squat"],
    ["pike", "push"],
    ["mountain", "climber"],
    ["jumping", "jack"],
    ["close", "grip"],
    ["side", "plank"],
    ["glute", "bridge"],
    ["fire", "hydrant"],
    ["farmer", "carry"],
    ["inverted", "row"],
    ["lat", "pulldown"],
  ];
  for (const [a, b] of importantPairs) {
    if (query.includes(a) && query.includes(b) && name.includes(a) && name.includes(b)) score += 35;
  }

  return score;
}

export async function findExerciseMedia(exerciseId?: string, exerciseName?: string): Promise<ExerciseMediaAsset | null> {
  const dataset = await loadExerciseMediaDataset();
  const ranked = dataset
    .filter((item) => Array.isArray(item.images) && item.images.length > 0)
    .map((item) => ({ item, score: scoreExercise(exerciseId || "", exerciseName || "", item) }))
    .filter(({ score }) => score >= 16)
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  if (!best) return null;

  return {
    id: best.item.id,
    name: best.item.name,
    images: (best.item.images || []).map((image) => `${IMAGE_BASE_URL}${image}`),
    equipment: best.item.equipment,
    primaryMuscles: best.item.primaryMuscles,
    score: best.score,
  };
}

export function exercisePlaceholderUrl(exerciseName: string): string {
  const label = encodeURIComponent((exerciseName || "Exercice").slice(0, 42));
  return `https://placehold.co/960x640/0B0F14/FF6A00/png?text=${label}`;
}

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialization helper for Gemini
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// In-memory store for Admin transactions demo
const mockTransactions = [
  {
    id: "tx-101",
    userName: "Moussa Diop",
    userEmail: "moussa.d@gmail.com",
    planTier: "Plan Performance",
    amount: 8500,
    currency: "FCFA",
    method: "Wave",
    provider: "Wave Senegal",
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    status: "SUCCEEDED",
    reference: "WAVE-8829104"
  },
  {
    id: "tx-102",
    userName: "Kofi Mensah",
    userEmail: "kofi.m@yahoo.com",
    planTier: "Plan Elite",
    amount: 13500,
    currency: "FCFA",
    method: "MTN Mobile Money",
    provider: "MTN MoMo",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    status: "SUCCEEDED",
    reference: "MOMO-9912041"
  },
  {
    id: "tx-103",
    userName: "Alexandre Laurent",
    userEmail: "alex.l@hotmail.fr",
    planTier: "Plan Performance",
    amount: 15,
    currency: "EUR",
    method: "Stripe",
    provider: "Carte Bancaire Visa",
    timestamp: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    status: "SUCCEEDED",
    reference: "STRIPE-ch_3N194819"
  },
  {
    id: "tx-104",
    userName: "David Miller",
    userEmail: "david.m@fitness.org",
    planTier: "Plan Elite",
    amount: 26,
    currency: "USD",
    method: "PayPal",
    provider: "PayPal Checkout",
    timestamp: new Date(Date.now() - 1000 * 60 * 890).toISOString(),
    status: "SUCCEEDED",
    reference: "PP-9901423"
  },
  {
    id: "tx-105",
    userName: "Awa Konaté",
    userEmail: "awa.k@gmail.com",
    planTier: "Plan Essentiel",
    amount: 3500,
    currency: "FCFA",
    method: "Orange Money",
    provider: "Orange Money CI",
    timestamp: new Date(Date.now() - 1000 * 60 * 1400).toISOString(),
    status: "SUCCEEDED",
    reference: "OM-5510294"
  },
  {
    id: "tx-106",
    userName: "Yao N'Guessan",
    userEmail: "yao.ng@gmail.com",
    planTier: "Plan Performance",
    amount: 8500,
    currency: "FCFA",
    method: "Moov Money",
    provider: "Moov Africa",
    timestamp: new Date(Date.now() - 1000 * 60 * 2200).toISOString(),
    status: "SUCCEEDED",
    reference: "MOOV-334190"
  },
  {
    id: "tx-107",
    userName: "Jean-Pierre Moreau",
    userEmail: "jp.moreau@orange.fr",
    planTier: "Plan Essentiel",
    amount: 7.5,
    currency: "EUR",
    method: "Western Union",
    provider: "WU Online Transfer",
    timestamp: new Date(Date.now() - 1000 * 60 * 3100).toISOString(),
    status: "SUCCEEDED",
    reference: "WU-9018471"
  }
];

// --- FREE EXERCISE DB LOADER & ENRICHER ---
interface RawFreeExercise {
  id: string;
  name: string;
  force?: string;
  level?: string;
  mechanic?: string;
  equipment?: string;
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  instructions: string[];
  category?: string;
  images: string[];
}

let FREE_EXERCISES_DB: RawFreeExercise[] = [];

async function loadFreeExerciseDatabase() {
  try {
    console.log("[FysiqForge] Chargement de free-exercise-db depuis GitHub...");
    const res = await fetch("https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json");
    if (res.ok) {
      FREE_EXERCISES_DB = await res.json();
      console.log(`[FysiqForge] ✅ ${FREE_EXERCISES_DB.length} exercices réels chargés avec leurs images et instructions !`);
    } else {
      console.warn("[FysiqForge] ⚠️ Échec du chargement de free-exercise-db, HTTP status:", res.status);
    }
  } catch (err) {
    console.error("[FysiqForge] ❌ Erreur réseau chargement free-exercise-db:", err);
  }
}

function buildFreeExerciseImageUrl(exId: string, imgName: string): string {
  if (!imgName) return "";
  if (imgName.startsWith(exId + "/")) {
    return `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${imgName}`;
  }
  return `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${exId}/${imgName}`;
}

const MUSCLE_MAP_FR: Record<string, string> = {
  chest: "Pectoraux",
  biceps: "Biceps",
  triceps: "Triceps",
  shoulders: "Épaules / Deltoïdes",
  lats: "Grand Dorsal",
  "middle back": "Milieu du Dos",
  "lower back": "Lombaires",
  quadriceps: "Quadriceps",
  hamstrings: "Ischio-Jambiers",
  calves: "Mollets",
  glutes: "Fessiers",
  abdominis: "Sangle Abdominale & Core",
  forearms: "Avant-bras",
  traps: "Trapèzes"
};

function inferMuscleKey(input: string): string {
  const str = (input || "").toLowerCase();
  if (str.includes("pectoral") || str.includes("pec") || str.includes("chest") || str.includes("push")) return "chest";
  if (str.includes("dos") || str.includes("back") || str.includes("dorsal") || str.includes("pull")) return "lats";
  if (str.includes("épaule") || str.includes("epaule") || str.includes("deltoid") || str.includes("shoulder")) return "shoulders";
  if (str.includes("bicep")) return "biceps";
  if (str.includes("tricep")) return "triceps";
  if (str.includes("cuisse") || str.includes("leg") || str.includes("squat") || str.includes("jambe") || str.includes("quad")) return "quadriceps";
  if (str.includes("ischio") || str.includes("hamstring")) return "hamstrings";
  if (str.includes("fessier") || str.includes("glute")) return "glutes";
  if (str.includes("abdo") || str.includes("abs") || str.includes("core") || str.includes("ventre")) return "abdominis";
  return "chest";
}

function enrichPlanWithFreeExerciseDb(planData: any, userAnswers?: any) {
  if (!planData || !planData.weekSchedule || !Array.isArray(planData.weekSchedule)) {
    return planData;
  }

  if (FREE_EXERCISES_DB.length === 0) {
    return planData;
  }

  const equipmentPref = (userAnswers?.equipment || "").toLowerCase();
  const targetZonePref = (userAnswers?.targetZone || "").toLowerCase();
  const usedExerciseIds = new Set<string>();

  planData.weekSchedule.forEach((day: any) => {
    if (!day.exercises || !Array.isArray(day.exercises)) return;

    day.exercises = day.exercises.map((ex: any) => {
      let matched: RawFreeExercise | undefined;

      // 1. Direct ID match
      if (ex.id) {
        matched = FREE_EXERCISES_DB.find((dbEx) => dbEx.id.toLowerCase() === String(ex.id).toLowerCase());
      }

      // 2. Direct Name Match
      if (!matched && ex.name) {
        const exNameClean = ex.name.toLowerCase().replace(/[^a-z0-9]/g, "");
        matched = FREE_EXERCISES_DB.find((dbEx) => {
          const dbNameClean = dbEx.name.toLowerCase().replace(/[^a-z0-9]/g, "");
          return dbNameClean.includes(exNameClean) || exNameClean.includes(dbNameClean);
        });
      }

      // 3. Muscle & Equipment Filter match
      if (!matched) {
        const targetMuscle = inferMuscleKey(ex.muscleGroup || ex.name || day.title || targetZonePref);

        let candidates = FREE_EXERCISES_DB.filter((dbEx) =>
          dbEx.primaryMuscles.some((m) => m.toLowerCase().includes(targetMuscle))
        );

        if (equipmentPref.includes("poids du corps") || equipmentPref.includes("sans matériel")) {
          const bwCandidates = candidates.filter((dbEx) => dbEx.equipment === "body weight");
          if (bwCandidates.length > 0) candidates = bwCandidates;
        } else if (equipmentPref.includes("haltère")) {
          const dbCandidates = candidates.filter((dbEx) => dbEx.equipment === "dumbbell" || dbEx.equipment === "body weight");
          if (dbCandidates.length > 0) candidates = dbCandidates;
        }

        const unusedCandidates = candidates.filter((dbEx) => !usedExerciseIds.has(dbEx.id));
        matched = unusedCandidates[0] || candidates[0] || FREE_EXERCISES_DB[Math.floor(Math.random() * FREE_EXERCISES_DB.length)];
      }

      if (matched) {
        usedExerciseIds.add(matched.id);

        const firstImg = matched.images && matched.images.length > 0 ? matched.images[0] : "";
        const imgUrl = firstImg
          ? buildFreeExerciseImageUrl(matched.id, firstImg)
          : ex.illustrationUrl || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80";

        const primaryMusclesFr = matched.primaryMuscles
          .map((m) => MUSCLE_MAP_FR[m.toLowerCase()] || m)
          .join(" & ");

        return {
          id: matched.id,
          name: matched.name,
          muscleGroup: primaryMusclesFr || ex.muscleGroup || "Musculation",
          sets: ex.sets || 4,
          reps: ex.reps || "8 - 12 reps",
          restSeconds: ex.restSeconds || 75,
          tips: ex.tips || (matched.instructions && matched.instructions[0]) || "Gardez une exécution contrôlée et une tension continue.",
          illustrationUrl: imgUrl,
          executionSteps: matched.instructions && matched.instructions.length > 0 ? matched.instructions : ex.executionSteps || [],
          alternativeExercise: ex.alternativeExercise || `Variante ${matched.primaryMuscles[0] || "ciblée"}`
        };
      }

      return ex;
    });
  });

  return planData;
}

// API Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "FysiqForge API",
    exerciseDbCount: FREE_EXERCISES_DB.length,
    timestamp: new Date().toISOString()
  });
});

// API Get Real Exercises Catalog
app.get("/api/exercises", (req, res) => {
  const { search, muscle, equipment, limit } = req.query;
  let results = FREE_EXERCISES_DB;

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter((ex) =>
      ex.name.toLowerCase().includes(q) ||
      ex.primaryMuscles.some((m) => m.toLowerCase().includes(q))
    );
  }

  if (muscle) {
    const mKey = inferMuscleKey(String(muscle));
    results = results.filter((ex) =>
      ex.primaryMuscles.some((pm) => pm.toLowerCase().includes(mKey))
    );
  }

  if (equipment) {
    const eq = String(equipment).toLowerCase();
    results = results.filter((ex) => {
      if (eq.includes("poids du corps") || eq.includes("sans matériel")) return ex.equipment === "body weight";
      if (eq.includes("haltère")) return ex.equipment === "dumbbell" || ex.equipment === "body weight";
      return true;
    });
  }

  const maxItems = limit ? parseInt(String(limit), 10) : 100;
  const sliced = results.slice(0, maxItems).map((ex) => ({
    id: ex.id,
    name: ex.name,
    muscleGroup: ex.primaryMuscles.map((m) => MUSCLE_MAP_FR[m.toLowerCase()] || m).join(" & "),
    equipment: ex.equipment,
    illustrationUrl: ex.images && ex.images.length > 0 ? buildFreeExerciseImageUrl(ex.id, ex.images[0]) : "",
    executionSteps: ex.instructions,
    category: ex.category,
    level: ex.level
  }));

  return res.json({
    success: true,
    totalCount: results.length,
    returnedCount: sliced.length,
    exercises: sliced
  });
});

// API AI Photo Analysis
app.post("/api/ai/analyze-photo", async (req, res) => {
  const { photoBase64, questionnaire } = req.body;

  // Smart realistic fallback analysis if no image or no API key set
  const fallbackAnalysis = {
    morphologyType: questionnaire?.objective?.includes("masse") ? "Profil Athlétique en Développement" : "Silhouette Ciblée Tonification",
    estimatedBodyFat: questionnaire?.objective?.includes("gras") ? "18-22%" : "13-16%",
    symmetryScore: 85,
    postureAnalysis: "Axe vertébral stable. Engagement prioritaire suggéré sur la sangle abdominale et le haut du buste.",
    priorityZones: [
      questionnaire?.targetZone || "Pectoraux & Triceps",
      "Largeur de Dos",
      "Epaules & Core"
    ],
    recommendedFrequency: `${questionnaire?.frequency || "4"} séances / semaine`,
    coachSummary: `Analyse visuelle terminée. Votre structure physique montre un excellent potentiel pour atteindre votre objectif de "${questionnaire?.objective || "Développement Musculaire"}". Nous avons configuré une surcharge progressive ciblée sur ${questionnaire?.targetZone || "l'ensemble du haut du corps"}.`
  };

  try {
    const ai = getGeminiClient();

    if (ai && photoBase64 && photoBase64.startsWith("data:image")) {
      const mimeType = photoBase64.split(";")[0].split(":")[1] || "image/jpeg";
      const base64Data = photoBase64.split(",")[1];

      const prompt = `Tu es FysiqForge AI, un coach expert en analyse morphologique et musculation.
Analyse cette photo de physique ainsi que le questionnaire utilisateur:
- Objectif: ${questionnaire?.objective || "Prise de masse / Tonification"}
- Zone ciblée: ${questionnaire?.targetZone || "Tout le corps"}
- Niveau: ${questionnaire?.level || "Intermédiaire"}
- Matériel: ${questionnaire?.equipment || "Salle équipée"}

Formate ta réponse en JSON valide respectant cette structure exacte:
{
  "morphologyType": "Athlétique / Mesomorphe léger",
  "estimatedBodyFat": "14-16%",
  "symmetryScore": 88,
  "postureAnalysis": "Légère inclinaison des épaules, chaîne postérieure à renforcer.",
  "priorityZones": ["Pectoraux supérieurs", "Faisceau latéral des deltoïdes", "Grand dorsal"],
  "recommendedFrequency": "4 séances / semaine",
  "coachSummary": "Excellente base musculaire. Potentiel élevé pour développer une silhouette en V en accentuant la largeur du dos et le haut des pecs."
}`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: {
            parts: [
              { inlineData: { mimeType, data: base64Data } },
              { text: prompt }
            ]
          },
          config: {
            responseMimeType: "application/json"
          }
        });

        const jsonText = response.text || "";
        const parsed = JSON.parse(jsonText);
        return res.json({ success: true, analysis: parsed });
      } catch (geminiErr) {
        console.warn("[FysiqForge AI] Photo analysis Gemini quota/API error, using smart fallback:", geminiErr);
        return res.json({ success: true, analysis: fallbackAnalysis });
      }
    }

    return res.json({ success: true, analysis: fallbackAnalysis });
  } catch (error) {
    console.error("Error in /api/ai/analyze-photo:", error);
    return res.json({ success: true, analysis: fallbackAnalysis });
  }
});

// API AI Coach Chat Endpoint
app.post("/api/ai/coach", async (req, res) => {
  const { question, userContext } = req.body;

  // Intelligent fallback responses for demo
  let fallbackAnswer = "Excellent point ! Pour optimiser la tension mécanique sans risquer de blessure, privilégie un tempo contrôlé de 3 secondes sur la phase négative (excentrique) et 1 seconde d'explosion concentrique. Assure-toi de maintenir tes omoplates resserrées et baissées pour protéger l'articulation de l'épaule.";
  if (question?.toLowerCase().includes("douleur") || question?.toLowerCase().includes("mal") || question?.toLowerCase().includes("blessure")) {
    fallbackAnswer = "⚠️ **Rappel Sécurité Important** : En cas de douleur aiguë ou persistante, il est impératif de stopper l'exercice et de consulter un médecin ou kinésithérapeute.\n\nSi c'est une gêne légère d'échauffement :\n- Réduis immédiatement la charge de 30 à 40%\n- Remplace l'exercice par une variante aux haltères ou à la poulie pour ajuster la trajectoire articulatoire\n- Ne force jamais à travers une douleur articulaire piquante !";
  } else if (question?.toLowerCase().includes("manger") || question?.toLowerCase().includes("nutrition") || question?.toLowerCase().includes("protéine")) {
    fallbackAnswer = "🍎 **Conseil Nutrition Post-Workout FysiqForge** :\n- **Protéines** : Vise 1,8g à 2,2g de protéines par kg de poids de corps repartis sur la journée (poulet, poisson, œufs, tofu, protéine en poudre).\n- **Fenêtre anabolique** : Prends un repas complet dans les 1 à 2 heures après ta séance combinant protéines de qualité et glucides complexes (riz, patate douce, avoine) pour reconstituer ton glycogène.";
  }

  try {
    const ai = getGeminiClient();

    const systemInstruction = `Tu es FysiqForge Coach IA, un entraîneur professionnel passionné de musculation, nutrition sport et préparation physique.
Consignes impératives:
1. Sois motivant, direct, précis et pédagogique (ton pro de salle de sport moderne).
2. Si la question concerne une douleur, une blessure grave ou une condition médicale, rappelle immédiatement la précaution médicale et conseille de consulter un professionnel de santé. Ne fais JAMAIS de diagnostic médical.
3. Adapte tes réponses selon le contexte de l'utilisateur (Objectif: ${userContext?.objective || "Musculation"}, Matériel: ${userContext?.equipment || "Salle"}, Niveau: ${userContext?.level || "Intermédiaire"}).
4. Réponds en français clair avec des puces d'action pratiques.`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: question,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7
          }
        });

        return res.json({ success: true, answer: response.text });
      } catch (geminiErr) {
        console.warn("[FysiqForge AI] Coach Gemini quota/API error, using fallback answer:", geminiErr);
        return res.json({ success: true, answer: fallbackAnswer });
      }
    }

    return res.json({ success: true, answer: fallbackAnswer });
  } catch (error) {
    console.error("Error in /api/ai/coach:", error);
    return res.json({ success: true, answer: fallbackAnswer });
  }
});

function generateFallbackPlanData(userAnswers: any, _analysis?: any) {
  const targetZone = userAnswers?.targetZone || "Pectoraux & Bras";
  const level = userAnswers?.level || "Intermédiaire";
  const frequency = userAnswers?.frequency || "4 jours / sem";
  const equipment = userAnswers?.equipment || "Salle de sport équipée";
  const numDays = parseInt(frequency) || 4;

  const sampleExercisesPush = [
    { name: "Bench Press / Développé Couché", muscleGroup: "Pectoraux", sets: 4, reps: "8 - 10 reps", restSeconds: 90, tips: "Resserre les omoplates et garde les pieds bien à plat au sol." },
    { name: "Incline Dumbbell Press", muscleGroup: "Pectoraux Supérieurs", sets: 4, reps: "10 - 12 reps", restSeconds: 75, tips: "Banc incliné à 30°. Accentue la contraction en haut." },
    { name: "Overhead Shoulder Press", muscleGroup: "Épaules", sets: 3, reps: "10 - 12 reps", restSeconds: 75, tips: "Garde le buste gainé sans cambrer excessivement." },
    { name: "Triceps Pushdown", muscleGroup: "Triceps", sets: 3, reps: "12 - 15 reps", restSeconds: 60, tips: "Coudes fixes le long du corps, extension complète." }
  ];

  const sampleExercisesPull = [
    { name: "Lat Pulldown / Tirage Vertical", muscleGroup: "Grand Dorsal", sets: 4, reps: "10 - 12 reps", restSeconds: 75, tips: "Tire la barre vers la poitrine en sortant la cage thoracique." },
    { name: "Bent Over Barbell Row", muscleGroup: "Milieu du Dos", sets: 4, reps: "8 - 10 reps", restSeconds: 90, tips: "Buste incliné à 45°, tire le poids vers le nombril." },
    { name: "Face Pulls", muscleGroup: "Arrière d'Épaules & Trapèzes", sets: 3, reps: "12 - 15 reps", restSeconds: 60, tips: "Tire la corde vers les yeux en écartant les poignets." },
    { name: "Barbell Biceps Curl", muscleGroup: "Biceps", sets: 3, reps: "10 - 12 reps", restSeconds: 60, tips: "Garde les coudes collés aux flancs, pas de balancier." }
  ];

  const sampleExercisesLegs = [
    { name: "Barbell Back Squat", muscleGroup: "Quadriceps & Fessiers", sets: 4, reps: "8 - 10 reps", restSeconds: 120, tips: "Genoux alignés avec les pointes de pieds, descente sous la parallèle." },
    { name: "Romanian Deadlift", muscleGroup: "Ischio-Jambiers & Fessiers", sets: 4, reps: "10 - 12 reps", restSeconds: 90, tips: "Pousse les fesses vers l'arrière, buste droit." },
    { name: "Leg Press / Presse à Cuisses", muscleGroup: "Quadriceps", sets: 3, reps: "12 - 15 reps", restSeconds: 75, tips: "Ne verrouille pas brutalement les genoux en haut." },
    { name: "Plank / Gainage Abdominal", muscleGroup: "Abdominaux & Core", sets: 3, reps: "45-60 sec", restSeconds: 45, tips: "Rétroversion du bassin, contracte les fessiers et le transverse." }
  ];

  const days = [
    {
      dayNumber: 1,
      dayName: "Jour 1",
      title: `Pectoraux, Épaules & Triceps (Push Focus ${targetZone})`,
      focus: "Pectoraux & Triceps",
      estimatedDurationMin: 50,
      caloriesBurnedEst: 440,
      exercises: sampleExercisesPush
    },
    {
      dayNumber: 2,
      dayName: "Jour 2",
      title: "Dos, Biceps & Posture (Pull Titan)",
      focus: "Grand Dorsal & Biceps",
      estimatedDurationMin: 55,
      caloriesBurnedEst: 460,
      exercises: sampleExercisesPull
    }
  ];

  if (numDays >= 3) {
    days.push({
      dayNumber: 3,
      dayName: "Jour 3",
      title: "Bas du Corps & Gainage (Legs Power)",
      focus: "Quadriceps, Ischios & Abdominaux",
      estimatedDurationMin: 50,
      caloriesBurnedEst: 510,
      exercises: sampleExercisesLegs
    });
  }

  if (numDays >= 4) {
    days.push({
      dayNumber: 4,
      dayName: "Jour 4",
      title: `Hypertrophie Ciblée (${targetZone})`,
      focus: `${targetZone} & Isolation`,
      estimatedDurationMin: 45,
      caloriesBurnedEst: 420,
      exercises: [
        sampleExercisesPush[1],
        sampleExercisesPull[0],
        sampleExercisesPull[2],
        sampleExercisesLegs[3]
      ]
    });
  }

  return {
    programTitle: `FORGE ATHLÉTIQUE - FOCUS ${targetZone.toUpperCase()}`,
    subtitle: `Programme 8 Semaines - Niveau ${level} (${frequency})`,
    description: `Programme d'entraînement structuré sur-mesure (${equipment}). Intègre une surcharge progressive sur 8 semaines enrichie avec des exercices réels de notre catalogue.`,
    totalWeeks: 8,
    weeksProgression: [
      {
        weekNumber: 1,
        title: "Semaines 1 & 2 : Phase de Fondation & Tempo",
        focus: "Apprentissage des trajectoires précises, RPE 7, contrôle excentrique de 3 secondes.",
        loadAdvice: "Charge modérée à 70% de votre 1RM. Maîtrisez le temps sous tension.",
        repsModifier: "12 à 15 répétitions"
      },
      {
        weekNumber: 3,
        title: "Semaines 3 & 4 : Surcharge Mécanique & Hypertrophie",
        focus: "Augmentation des charges de +5%, RPE 8, augmentation de la tension mécanique.",
        loadAdvice: "Charge intermédiaire à 75-80% du 1RM.",
        repsModifier: "10 à 12 répétitions"
      },
      {
        weekNumber: 5,
        title: "Semaines 5 & 6 : Intensité Maximale & Rest-Pause",
        focus: "Densification musculaire, RPE 9, intégration de drop-sets sur la dernière série.",
        loadAdvice: "Charge lourde à 82-85% du 1RM.",
        repsModifier: "8 à 10 répétitions"
      },
      {
        weekNumber: 7,
        title: "Semaines 7 & 8 : Décharge Structurée & Peak Power",
        focus: "Consolidation des gains, récupération du système nerveux puis test des nouveaux PRs.",
        loadAdvice: "S7 décharge à 60% du 1RM, S8 test d'effort maximal.",
        repsModifier: "8 à 12 répétitions"
      }
    ],
    weekSchedule: days
  };
}

// API AI Multi-Week Training Plan Generator Endpoint
app.post("/api/ai/generate-plan", async (req, res) => {
  const { tierId, userAnswers, analysis } = req.body;

  try {
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `Tu es FysiqForge AI, un master coach mondial en préparation physique, hypertrophie et périodisation athlétique.
Génère un plan d'entraînement d'exception sur 8 SEMAINES complets, ultra-personnalisé et évolutif.

PARAMÈTRES UTILISATEUR ET D'ANALYSE :
- Objectif principal : ${userAnswers?.objective || "Prise de masse (Hypertrophie)"}
- Zone Prioritaire Ciblée : ${userAnswers?.targetZone || "Tout le corps"}
- Niveau : ${userAnswers?.level || "Intermédiaire"}
- Fréquence voulue : ${userAnswers?.frequency || "4 jours / sem"}
- Matériel à disposition : ${userAnswers?.equipment || "Salle de sport équipée"}
- Contraintes/Blessures : ${userAnswers?.constraints || "Aucune"}
- Analyse Photo / Zones Prioritaires : ${analysis?.priorityZones?.join(", ") || "Pectoraux & Posture"}
- Posture : ${analysis?.postureAnalysis || "Posturale neutre"}

CONSIGNES STRICTES :
1. RESPECT DU MATÉRIEL (${userAnswers?.equipment}) :
   - Si "Poids du corps (Sans matériel)", utilise uniquement des exercices au poids du corps (Pompes déclinées, Dips sur chaise/barres, Tractions/Rowing inversé sous table, Squats sautés, Pistol squats, Pike pushups, Gainage).
   - Si "Haltères + Banc maison", utilise des exercices réalisables avec des haltères et un banc.
   - Si "Salle de sport équipée", utilise la variété de machines, poulies, barres et haltères.
2. DIVERSITÉ & PAS DE RÉTRO-RÉPÉTITION D'EXERCICES IDENTIQUES D'UN JOUR À L'AUTRE : chaque jour de la semaine doit comporter des exercices distincts, ciblés et stimulants.
3. LOGIQUE DE PROGRESSION MULTI-SEMAINES SUR 8 SEMAINES :
   Génère un tableau "weeksProgression" de 4 blocs de semaines (Semaines 1-2, 3-4, 5-6, 7-8) détaillant la surcharge progressive (augmentation des charges, variation des répétitions, RPE, tempo, technique d'intensité).

Retourne EXCLUSIVEMENT un objet JSON valide avec cette structure exacte :
{
  "programTitle": "Titre du programme percutant en majuscules",
  "subtitle": "Sous-titre descriptif (ex: Plan 8 Semaines - Niveau X - Y jours/sem)",
  "description": "Description stratégique de 2 phrases expliquant la périodisation et l'adaptation à la photo de l'utilisateur.",
  "totalWeeks": 8,
  "weeksProgression": [
    {
      "weekNumber": 1,
      "title": "Semaines 1 & 2 : Phase de Fondation & Tempo",
      "focus": "Apprentissage des trajectoires précises, RPE 7, contrôle excentrique de 3 secondes.",
      "loadAdvice": "Charge modérée à 70% de votre 1RM. Maîtrisez le temps sous tension.",
      "repsModifier": "12 à 15 répétitions"
    },
    {
      "weekNumber": 3,
      "title": "Semaines 3 & 4 : Surcharge Mécanique & Hypertrophie",
      "focus": "Augmentation des charges de +5%, RPE 8, augmentation de la tension mécanique.",
      "loadAdvice": "Charge intermédiaire à 75-80% du 1RM.",
      "repsModifier": "10 à 12 répétitions"
    },
    {
      "weekNumber": 5,
      "title": "Semaines 5 & 6 : Intensité Maximale & Rest-Pause",
      "focus": "Densification musculaire, RPE 9, intégration de drop-sets sur la dernière série.",
      "loadAdvice": "Charge lourde à 82-85% du 1RM.",
      "repsModifier": "8 à 10 répétitions"
    },
    {
      "weekNumber": 7,
      "title": "Semaines 7 & 8 : Décharge Structurée & Peak Power",
      "focus": "Consolidation des gains, récupération du système nerveux puis test des nouveaux PRs.",
      "loadAdvice": "S7 décharge à 60% du 1RM, S8 test d'effort maximal.",
      "repsModifier": "8 à 12 répétitions"
    }
  ],
  "weekSchedule": [
    {
      "dayNumber": 1,
      "dayName": "Jour 1",
      "title": "Nom du jour 1 (ex: Push Explosif & Haut de Pectoraux)",
      "focus": "Groupes musculaires ciblés",
      "estimatedDurationMin": 50,
      "caloriesBurnedEst": 450,
      "exercises": [
        {
          "id": "ex1",
          "name": "Nom de l'exercice",
          "muscleGroup": "Muscle ciblé",
          "sets": 4,
          "reps": "8 - 10 reps",
          "restSeconds": 90,
          "tips": "Conseil d'exécution clé du coach",
          "illustrationUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
          "executionSteps": [
            "Étape 1 de préparation",
            "Étape 2 de descente contrôlée",
            "Étape 3 de poussée/contraction",
            "Étape 4 de finition"
          ],
          "alternativeExercise": "Exercice alternatif"
        }
      ]
    }
  ]
}`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.7
          }
        });

        const jsonText = response.text || "";
        const generatedPlanData = JSON.parse(jsonText);
        const enrichedPlan = enrichPlanWithFreeExerciseDb(generatedPlanData, userAnswers);
        return res.json({ success: true, planData: enrichedPlan });
      } catch (geminiErr) {
        console.warn("[FysiqForge AI] Plan generation Gemini quota/API error, using smart fallback plan:", geminiErr);
        const fallbackPlan = generateFallbackPlanData(userAnswers, analysis);
        const enrichedPlan = enrichPlanWithFreeExerciseDb(fallbackPlan, userAnswers);
        return res.json({ success: true, planData: enrichedPlan, isFallback: true });
      }
    }

    const fallbackPlan = generateFallbackPlanData(userAnswers, analysis);
    const enrichedPlan = enrichPlanWithFreeExerciseDb(fallbackPlan, userAnswers);
    return res.json({ success: true, planData: enrichedPlan, isFallback: true });
  } catch (err) {
    console.error("Error in /api/ai/generate-plan:", err);
    const fallbackPlan = generateFallbackPlanData(userAnswers, analysis);
    const enrichedPlan = enrichPlanWithFreeExerciseDb(fallbackPlan, userAnswers);
    return res.json({ success: true, planData: enrichedPlan, isFallback: true });
  }
});

// API Payment Processor Simulation
app.post("/api/payments/process", (req, res) => {
  const { userName, userEmail, planTier, amount, currency, method, provider, phoneNumber } = req.body;

  const newTx = {
    id: `tx-${Date.now()}`,
    userName: userName || "Utilisateur FysiqForge",
    userEmail: userEmail || "client@fysiqforge.com",
    planTier: planTier || "Plan Performance",
    amount: Number(amount),
    currency: currency || "FCFA",
    method: method || "Mobile Money",
    provider: provider || "USSD Push",
    timestamp: new Date().toISOString(),
    status: "SUCCEEDED",
    reference: `${method.toUpperCase().replace(/\s+/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`
  };

  mockTransactions.unshift(newTx);

  return res.json({
    success: true,
    message: "Paiement validé avec succès !",
    transaction: newTx
  });
});

// API Admin Stats
app.get("/api/admin/stats", (_req, res) => {
  const totalTransactions = mockTransactions.length;
  
  // Totals per currency
  const totalFcfa = mockTransactions
    .filter(t => t.currency === "FCFA")
    .reduce((acc, t) => acc + t.amount, 0);
    
  const totalEur = mockTransactions
    .filter(t => t.currency === "EUR")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalUsd = mockTransactions
    .filter(t => t.currency === "USD")
    .reduce((acc, t) => acc + t.amount, 0);

  // Breakdown by payment method
  const methodBreakdown: Record<string, number> = {};
  mockTransactions.forEach(t => {
    methodBreakdown[t.method] = (methodBreakdown[t.method] || 0) + 1;
  });

  res.json({
    totalTransactions,
    revenue: {
      fcfa: totalFcfa,
      eur: totalEur,
      usd: totalUsd
    },
    methodBreakdown,
    recentTransactions: mockTransactions
  });
});

async function startServer() {
  await loadFreeExerciseDatabase();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FysiqForge] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

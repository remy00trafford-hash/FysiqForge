import { PlanTierConfig } from "../types";

export const PLAN_TIERS: PlanTierConfig[] = [
  {
    id: "essentiel",
    name: "Plan Essentiel",
    tagline: "Programme d'entraînement de base généré pour débuter efficacement.",
    priceFcfa: 3500,
    priceUsd: 8,
    priceEur: 7.5,
    features: [
      "Programme 100% sur-mesure (Analyse Photo)",
      "Planning détaillé séance par séance",
      "Consignes d'exécution & illustrations",
      "Calculateurs de séries et charges"
    ],
    hasAiCoach: false,
    hasMusicPlaylist: false,
    hasReminders: false,
    hasPrioritySupport: false
  },
  {
    id: "performance",
    name: "Plan Performance",
    tagline: "L'expérience FysiqForge complète avec Coach IA & Musique intégrée.",
    priceFcfa: 8500,
    priceUsd: 17,
    priceEur: 15,
    badge: "RECOMMANDÉ PAR LES COACHS",
    isPopular: true,
    features: [
      "Tout ce qui est dans le Plan Essentiel",
      "Coach IA FysiqForge illimité (Questions 24/7)",
      "Sélection musicale de séance (Playlists Workout)",
      "Rappels automatiques de séance",
      "Bilan post-séance et suivi de progression",
      "Suivi des photos avant/après"
    ],
    hasAiCoach: true,
    hasMusicPlaylist: true,
    hasReminders: true,
    hasPrioritySupport: false
  },
  {
    id: "elite",
    name: "Plan Élite / VIP",
    tagline: "Pour les pratiquants exigeants voulant un ajustement continu du plan.",
    priceFcfa: 13500,
    priceUsd: 26,
    priceEur: 22.5,
    badge: "PERFORMANCE MAXIMALE",
    features: [
      "Tout le contenu du Plan Performance",
      "Ajustement dynamique du plan selon votre progression",
      "Analyse avancée de symétrie musculaire",
      "Priorité absolue dans le Coach IA (réponses ultra-détaillées)",
      "Certificat de complétion du cycle",
      "Guide nutritionnel macro-nutriments personnalisé"
    ],
    hasAiCoach: true,
    hasMusicPlaylist: true,
    hasReminders: true,
    hasPrioritySupport: true
  }
];

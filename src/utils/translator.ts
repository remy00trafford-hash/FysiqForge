// French / English translation dictionary and text processing helpers for exercises and UI

export type Language = "FR" | "EN";

export const UI_LABELS = {
  FR: {
    appTitle: "FYSIQFORGE PRO",
    appSub: "Coaching Musculation & Analyse Photo IA",
    navLanding: "1. Accueil",
    navPhoto: "2. Photo & Questionnaire",
    navPreview: "3. Aperçu Plan",
    navFullPlan: "4. Espace Coaching",
    startWorkout: "DÉMARRER LA SÉANCE GUIDÉE",
    startWorkoutSub: "Lancer le chrono automatique avec visuels & instructions",
    viewVideo: "Voir la vidéo",
    checkEquipment: "As-tu cet outil ? (Vérifier / Remplacer)",
    nutritionGuide: "Guide Nutrition",
    faqSupport: "FAQ & Support",
    printPlan: "Imprimer",
    remindersActive: "Rappels Actifs",
    enableReminders: "Activer Rappels",
    todayWorkouts: "1. Mes Séances du Jour",
    aiCoach: "2. Coach IA FysiqForge 24/7",
    progressTracker: "3. Suivi & Progression",
    periodizationTitle: "Périodisation 8 Semaines (Surcharge Progressive)",
    currentObjective: "Target Objectif Actuel",
    coachAdvice: "Consigne du Coach",
    finishDay: "TERMINER LA SÉANCE DU JOUR",
    warmupPhase: "ÉCHAUFFEMENT ARTICULAIRE & CARDIO",
    warmupDesc: "Mobilisez vos articulations, déroulez la colonne et élevez votre fréquence cardiaque avant les séries de travail.",
    exercisePhase: "EXERCICE ACTIF",
    restPhase: "REPOS & HYDRATATION",
    restDesc: "Inspirez profondément par le nez, relâchez la tension musculaire et buvez une gorgée d'eau.",
    nextUp: "Prochain exercice",
    nextSet: "Prochaine série",
    pause: "Pause",
    resume: "Reprendre",
    skip: "Passer l'étape",
    previous: "Étape précédente",
    workoutComplete: "SÉANCE TERMINÉE !",
    workoutCompleteDesc: "Félicitations ! Vous avez accompli l'ensemble des séries avec succès.",
    saveBilan: "Enregistrer mon bilan de séance",
    coachVoice: "Voix du Coach",
    stopVoice: "Arrêter la voix",
    sets: "Séries",
    reps: "Répétitions",
    rest: "Repos",
    targetMuscle: "Muscle ciblé",
    tips: "Conseil du Coach",
    executionSteps: "Étapes d'Exécution",
    voiceActive: "Coach IA FysiqForge (Voix Active)",
    askQuestion: "Posez votre question au Coach IA...",
    quickQuestions: "Questions Fréquentes Rapides :",
    openCoachChat: "Chat Coach IA 24/7"
  },
  EN: {
    appTitle: "FYSIQFORGE PRO",
    appSub: "Bodybuilding Coaching & AI Photo Scanner",
    navLanding: "1. Home",
    navPhoto: "2. Photo & Quiz",
    navPreview: "3. Plan Preview",
    navFullPlan: "4. Coaching Hub",
    startWorkout: "START GUIDED WORKOUT",
    startWorkoutSub: "Launch auto-advancing timer with visual guides",
    viewVideo: "Watch Video",
    checkEquipment: "Check / Swap Equipment",
    nutritionGuide: "Nutrition Guide",
    faqSupport: "FAQ & Support",
    printPlan: "Print Plan",
    remindersActive: "Reminders Active",
    enableReminders: "Enable Reminders",
    todayWorkouts: "1. Today's Workouts",
    aiCoach: "2. 24/7 AI Coach",
    progressTracker: "3. Progress & History",
    periodizationTitle: "8-Week Periodization (Progressive Overload)",
    currentObjective: "Current Phase Objective",
    coachAdvice: "Coach's Tip",
    finishDay: "COMPLETE TODAY'S WORKOUT",
    warmupPhase: "WARMUP & MOBILITY",
    warmupDesc: "Mobilize joints, roll spine, and gradually raise heart rate before working sets.",
    exercisePhase: "ACTIVE EXERCISE",
    restPhase: "REST & HYDRATION",
    restDesc: "Take deep nasal breaths, release muscle tension, and sip water.",
    nextUp: "Next up",
    nextSet: "Next set",
    pause: "Pause",
    resume: "Resume",
    skip: "Skip Step",
    previous: "Previous Step",
    workoutComplete: "WORKOUT COMPLETED!",
    workoutCompleteDesc: "Congratulations! You completed all working sets with proper form.",
    saveBilan: "Save Workout Log",
    coachVoice: "Coach Voice",
    stopVoice: "Stop Voice",
    sets: "Sets",
    reps: "Reps",
    rest: "Rest",
    targetMuscle: "Target Muscle",
    tips: "Coach Tip",
    executionSteps: "Execution Steps",
    voiceActive: "FysiqForge AI Coach (Voice Enabled)",
    askQuestion: "Ask your question to the AI Coach...",
    quickQuestions: "Quick Suggested Questions:",
    openCoachChat: "24/7 AI Coach Chat"
  }
};

// Muscle dictionary translation map
const MUSCLE_TRANSLATIONS: Record<string, string> = {
  abdominals: "Abdominaux & Core",
  abdominis: "Sangle Abdominale",
  chest: "Pectoraux",
  biceps: "Biceps",
  triceps: "Triceps",
  shoulders: "Épaules & Deltoïdes",
  lats: "Grand Dorsal",
  "middle back": "Milieu du Dos",
  "lower back": "Lombaires",
  quadriceps: "Quadriceps",
  hamstrings: "Ischio-Jambiers",
  calves: "Mollets",
  glutes: "Fessiers",
  forearms: "Avant-bras",
  traps: "Trapèzes"
};

// Exercise name translation mapping for English free-exercise-db titles
const EXERCISE_NAME_MAP: Record<string, string> = {
  "3/4 Sit-Up": "Relevé de Buste 3/4 (Abdominaux)",
  "90/90 Hamstring": "Étirement Ischio-Jambiers 90/90",
  "Ab Crunch Machine": "Crunch Abdominal à la Machine",
  "Ab Roller": "Roulette Abdominale",
  "Adductor": "Adducteurs à la Machine",
  "Air Bike": "Air Bike Cardio",
  "Alternate Incline Dumbbell Curl": "Curl Biceps Incliné Alterné",
  "Alternate Leg Diagonal Bound": "Fentes Diagonales Dynamiques",
  "Alternating Deltoid Raise": "Élévations Frontales Alternées",
  "Alternating Dumbbell Press": "Développé Épaules Alterné aux Haltères",
  "Band Assisted Pull-Up": "Tractions Assistées avec Élastique",
  "Barbell Curl": "Curl Biceps à la Barre",
  "Barbell Bench Press": "Développé Couché à la Barre",
  "Barbell Squat": "Squat à la Barre",
  "Barbell Deadlift": "Soulevé de Terre à la Barre",
  "Bench Dips": "Dips sur Banc",
  "Bent Over Barbell Row": "Rowing Buste Penché à la Barre",
  "Bent-Arm Barbell Pullover": "Pullover Buste Penché à la Barre",
  "Bent-Arm Dumbbell Pullover": "Pullover Buste Penché aux Haltères",
  "Bodyweight Flyes": "Écartés Pectoraux au Poids du Corps",
  "Cable Crossover": "Écartés Vis-à-Vis à la Poulie",
  "Incline Dumbbell Press": "Développé Incliné aux Haltères",
  "Lat Pulldown": "Tirage Vertical Poitrine",
  "Leg Extension": "Leg Extension à la Machine",
  "Leg Press": "Presse à Cuisses",
  "Lying Leg Curl": "Leg Curl Allongé",
  "Overhead Shoulder Press": "Développé Militaire aux Haltères",
  "Push-Ups": "Pompes au Sol",
  "Romanian Deadlift": "Soulevé de Terre Roumain",
  "Seated Cable Row": "Tirage Horizontal à la Poulie",
  "Triceps Pushdown": "Extension Triceps à la Poulie Haute"
};

// Common sentence instruction translation replacements
const INSTRUCTION_PATTERNS: Array<[RegExp, string]> = [
  [/Lie down on the floor and secure your feet\.?/gi, "Allongez-vous au sol et calez vos pieds."],
  [/Your legs should be bent at the knees\.?/gi, "Vos jambes doivent être fléchies au niveau des genoux."],
  [/Place your hands behind or to the side of your head\.?/gi, "Placez vos mains derrière ou sur les côtés de votre tête."],
  [/You will begin with your back on the ground\.?/gi, "Commencez le dos bien à plat sur le sol."],
  [/This will be your starting position\.?/gi, "Ceci constitue votre position de départ."],
  [/Flex your hips and spine to raise your torso toward your knees\.?/gi, "Contractez la sangle abdominale pour relever le buste vers vos genoux."],
  [/At the top of the contraction your torso should be perpendicular to the ground\.?/gi, "En haut du mouvement, votre buste forme un angle vertical."],
  [/Reverse the motion, going only ¾ of the way down\.?/gi, "Inversez le mouvement en freinant la descente."],
  [/Repeat for the recommended amount of repetitions\.?/gi, "Répétez pour le nombre de répétitions recommandé."],
  [/Repeat for 10-20 repetitions, and then switch to the other leg\.?/gi, "Effectuez 10 à 20 répétitions puis changez de jambe."],
  [/Select a light resistance and sit down on the ab machine placing your feet under the pads provided and grabbing the top handles\.?/gi, "Sélectionnez une charge adaptée, asseyez-vous sur la machine et saisissez les poignées."],
  [/At the same time, begin to lift the legs up as you crunch your upper torso\.?/gi, "Enroulez le buste en contractant fortement les abdominaux."],
  [/Breathe out as you perform this movement\.?/gi, "Expirez pendant la phase d'effort."],
  [/Slowly return to the starting position as you breathe in\.?/gi, "Revenez lentement à la position initiale en inspirant."],
  [/Stand up with your torso upright while holding a barbell at a shoulder-width grip\.?/gi, "Tenez-vous droit en saisissant la barre largeur d'épaules."],
  [/While holding the upper arms stationary, curl the weights forward while contracting the biceps as you breathe out\.?/gi, "Gardez les coudes fixes et montez la charge en contractant les biceps."],
  [/Hold the contracted position for a second and squeeze the biceps hard\.?/gi, "Maintenez la contraction maximale une seconde en haut."],
  [/Keep your elbows close to your torso\.?/gi, "Gardez les coudes bien collés au buste."],
  [/Inhale during this portion of the motion\.?/gi, "Inspirez lors de la descente ou du retour."],
  [/Exhale as you perform this movement\.?/gi, "Expirez lors de la poussée."],
  [/Lower the weight slowly in an arc behind your head\.?/gi, "Descendez la charge lentement en arc de cercle derrière la tête."],
  [/Ensure your core is tight and back is supported\.?/gi, "Garde le gainage abdominal bien engagé et le dos protégé."]
];

export function translateExerciseName(name: string, lang: Language): string {
  if (lang === "EN") return name;
  if (EXERCISE_NAME_MAP[name]) return EXERCISE_NAME_MAP[name];

  // Pattern translations
  let frName = name;
  if (frName.includes("Sit-Up")) frName = frName.replace("Sit-Up", "Relevé de buste");
  if (frName.includes("Curl")) frName = frName.replace("Curl", "Curl Biceps");
  if (frName.includes("Press")) frName = frName.replace("Press", "Développé");
  if (frName.includes("Flyes")) frName = frName.replace("Flyes", "Écartés");
  if (frName.includes("Pullover")) frName = frName.replace("Pullover", "Pullover Musculaire");
  if (frName.includes("Row")) frName = frName.replace("Row", "Rowing Dos");
  if (frName.includes("Pull-Up")) frName = frName.replace("Pull-Up", "Tractions");

  return frName;
}

export function translateMuscleGroup(muscleGroup: string, lang: Language): string {
  if (lang === "EN") return muscleGroup;
  const lower = muscleGroup.toLowerCase();
  return MUSCLE_TRANSLATIONS[lower] || muscleGroup;
}

export function translateInstructionStep(stepText: string, lang: Language): string {
  if (lang === "EN") return stepText;

  let translated = stepText;
  INSTRUCTION_PATTERNS.forEach(([regex, frReplacement]) => {
    translated = translated.replace(regex, frReplacement);
  });

  // Basic fallback check if text remains purely English
  if (translated === stepText && stepText.length > 10) {
    // Basic structural translation
    translated = stepText
      .replace(/position/gi, "position")
      .replace(/repeat/gi, "répétez")
      .replace(/hands/gi, "mains")
      .replace(/feet/gi, "pieds")
      .replace(/arms/gi, "bras")
      .replace(/legs/gi, "jambes")
      .replace(/elbows/gi, "coudes")
      .replace(/knees/gi, "genoux")
      .replace(/back/gi, "dos")
      .replace(/chest/gi, "poitrine")
      .replace(/breathe/gi, "respirez")
      .replace(/slowly/gi, "lentement")
      .replace(/straight/gi, "droit");
  }

  return translated;
}

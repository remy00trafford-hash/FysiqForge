// French / English translation dictionary and text processing helpers for exercises and UI

export type Language = "FR" | "EN";

export const UI_LABELS = {
  FR: {
    appTitle: "FYSIQFORGE PRO", appSub: "Coaching Musculation & Analyse Photo IA", navLanding: "1. Accueil", navPhoto: "2. Photo & Questionnaire", navPreview: "3. Aperçu Plan", navFullPlan: "4. Espace Coaching", startWorkout: "DÉMARRER LA SÉANCE GUIDÉE", startWorkoutSub: "Lancer le chrono automatique avec visuels & instructions", viewVideo: "Voir la vidéo", checkEquipment: "As-tu cet outil ? (Vérifier / Remplacer)", nutritionGuide: "Guide Nutrition", faqSupport: "FAQ & Support", printPlan: "Imprimer", remindersActive: "Rappels Actifs", enableReminders: "Activer Rappels", todayWorkouts: "1. Mes Séances du Jour", aiCoach: "2. Coach IA FysiqForge 24/7", progressTracker: "3. Suivi & Progression", periodizationTitle: "Périodisation 8 Semaines (Surcharge Progressive)", currentObjective: "Target Objectif Actuel", coachAdvice: "Consigne du Coach", finishDay: "TERMINER LA SÉANCE DU JOUR", warmupPhase: "ÉCHAUFFEMENT ARTICULAIRE & CARDIO", warmupDesc: "Mobilisez vos articulations, déroulez la colonne et élevez votre fréquence cardiaque avant les séries de travail.", exercisePhase: "EXERCICE ACTIF", restPhase: "REPOS & HYDRATATION", restDesc: "Inspirez profondément par le nez, relâchez la tension musculaire et buvez une gorgée d'eau.", nextUp: "Prochain exercice", nextSet: "Prochaine série", pause: "Pause", resume: "Reprendre", skip: "Passer l'étape", previous: "Étape précédente", workoutComplete: "SÉANCE TERMINÉE !", workoutCompleteDesc: "Félicitations ! Vous avez accompli l'ensemble des séries avec succès.", saveBilan: "Enregistrer mon bilan de séance", coachVoice: "Voix du Coach", stopVoice: "Arrêter la voix", sets: "Séries", reps: "Répétitions", rest: "Repos", targetMuscle: "Muscle ciblé", tips: "Conseil du Coach", executionSteps: "Étapes d'Exécution", voiceActive: "Coach IA FysiqForge (Voix Active)", askQuestion: "Posez votre question au Coach IA...", quickQuestions: "Questions Fréquentes Rapides :", openCoachChat: "Chat Coach IA 24/7"
  },
  EN: {
    appTitle: "FYSIQFORGE PRO", appSub: "Bodybuilding Coaching & AI Photo Scanner", navLanding: "1. Home", navPhoto: "2. Photo & Quiz", navPreview: "3. Plan Preview", navFullPlan: "4. Coaching Hub", startWorkout: "START GUIDED WORKOUT", startWorkoutSub: "Launch auto-advancing timer with visual guides", viewVideo: "Watch Video", checkEquipment: "Check / Swap Equipment", nutritionGuide: "Nutrition Guide", faqSupport: "FAQ & Support", printPlan: "Print Plan", remindersActive: "Reminders Active", enableReminders: "Enable Reminders", todayWorkouts: "1. Today's Workouts", aiCoach: "2. 24/7 AI Coach", progressTracker: "3. Progress & History", periodizationTitle: "8-Week Periodization (Progressive Overload)", currentObjective: "Current Phase Objective", coachAdvice: "Coach's Tip", finishDay: "COMPLETE TODAY'S WORKOUT", warmupPhase: "WARMUP & MOBILITY", warmupDesc: "Mobilize joints, roll spine, and gradually raise heart rate before working sets.", exercisePhase: "ACTIVE EXERCISE", restPhase: "REST & HYDRATION", restDesc: "Take deep nasal breaths, release muscle tension, and sip water.", nextUp: "Next up", nextSet: "Next set", pause: "Pause", resume: "Resume", skip: "Skip Step", previous: "Previous Step", workoutComplete: "WORKOUT COMPLETED!", workoutCompleteDesc: "Congratulations! You completed all working sets with proper form.", saveBilan: "Save Workout Log", coachVoice: "Coach Voice", stopVoice: "Stop Voice", sets: "Sets", reps: "Reps", rest: "Rest", targetMuscle: "Target Muscle", tips: "Coach Tip", executionSteps: "Execution Steps", voiceActive: "FysiqForge AI Coach (Voice Enabled)", askQuestion: "Ask your question to the AI Coach...", quickQuestions: "Quick Suggested Questions:", openCoachChat: "24/7 AI Coach Chat"
  }
};

const MUSCLE_TRANSLATIONS: Record<string, string> = {
  abdominals: "Abdominaux & Core", abdominis: "Sangle Abdominale", chest: "Pectoraux", biceps: "Biceps", triceps: "Triceps", shoulders: "Épaules & Deltoïdes", lats: "Grand Dorsal", "middle back": "Milieu du Dos", "lower back": "Lombaires", quadriceps: "Quadriceps", hamstrings: "Ischio-Jambiers", calves: "Mollets", glutes: "Fessiers", forearms: "Avant-bras", traps: "Trapèzes", deltoids: "Deltoïdes", obliques: "Obliques"
};

const EXERCISE_NAME_MAP: Record<string, string> = {
  "3/4 Sit-Up": "Relevé de Buste 3/4 (Abdominaux)", "90/90 Hamstring": "Étirement Ischio-Jambiers 90/90", "Ab Crunch Machine": "Crunch Abdominal à la Machine", "Ab Roller": "Roulette Abdominale", Adductor: "Adducteurs à la Machine", "Air Bike": "Air Bike Cardio", "Alternate Incline Dumbbell Curl": "Curl Biceps Incliné Alterné", "Alternate Leg Diagonal Bound": "Fentes Diagonales Dynamiques", "Alternating Deltoid Raise": "Élévations Frontales Alternées", "Alternating Dumbbell Press": "Développé Épaules Alterné aux Haltères", "Band Assisted Pull-Up": "Tractions Assistées avec Élastique", "Barbell Curl": "Curl Biceps à la Barre", "Barbell Bench Press": "Développé Couché à la Barre", "Barbell Squat": "Squat à la Barre", "Barbell Deadlift": "Soulevé de Terre à la Barre", "Bench Dips": "Dips sur Banc", "Bent Over Barbell Row": "Rowing Buste Penché à la Barre", "Bent-Arm Barbell Pullover": "Pullover à la Barre", "Bent-Arm Dumbbell Pullover": "Pullover aux Haltères", "Bodyweight Flyes": "Écartés Pectoraux au Poids du Corps", "Cable Crossover": "Écartés Vis-à-Vis à la Poulie", "Incline Dumbbell Press": "Développé Incliné aux Haltères", "Lat Pulldown": "Tirage Vertical Poitrine", "Leg Extension": "Extension des Jambes à la Machine", "Leg Press": "Presse à Cuisses", "Lying Leg Curl": "Leg Curl Allongé", "Overhead Shoulder Press": "Développé Militaire aux Haltères", "Push-Ups": "Pompes au Sol", "Romanian Deadlift": "Soulevé de Terre Roumain", "Seated Cable Row": "Tirage Horizontal à la Poulie", "Triceps Pushdown": "Extension Triceps à la Poulie Haute"
};

const NAME_TOKEN_MAP: Array<[RegExp, string]> = [
  [/\bbarbell\b/gi, "à la barre"], [/\bdumbbell(s)?\b/gi, "aux haltères"], [/\bcable\b/gi, "à la poulie"], [/\bmachine\b/gi, "à la machine"], [/\bseated\b/gi, "assis"], [/\bstanding\b/gi, "debout"], [/\blying\b/gi, "allongé"], [/\bsupine\b/gi, "sur le dos"], [/\bprone\b/gi, "ventre au sol"], [/\bincline\b/gi, "incliné"], [/\bdecline\b/gi, "décliné"], [/\balternate(d)?\b/gi, "alterné"], [/\balternating\b/gi, "alterné"], [/\bsingle\s*arm\b/gi, "un bras"], [/\bsingle\s*leg\b/gi, "une jambe"], [/\bfront\b/gi, "frontal"], [/\brear\b/gi, "arrière"], [/\breverse\b/gi, "inversé"], [/\blateral\b/gi, "latéral"], [/\braise(s)?\b/gi, "élévation"], [/\bextension\b/gi, "extension"], [/\bpress\b/gi, "développé"], [/\brow\b/gi, "rowing"], [/\brower\b/gi, "rameur"], [/\bcurl\b/gi, "curl"], [/\bsquat\b/gi, "squat"], [/\bdeadlift\b/gi, "soulevé de terre"], [/\bpulldown\b/gi, "tirage vertical"], [/\bpull[ -]?up(s)?\b/gi, "tractions"], [/\bchin[ -]?up(s)?\b/gi, "tractions supination"], [/\bdip(s)?\b/gi, "dips"], [/\bpush[ -]?up(s)?\b/gi, "pompes"], [/\bcrunch(es)?\b/gi, "crunch"], [/\bplank\b/gi, "gainage"], [/\blunge(s)?\b/gi, "fente"], [/\bstep[ -]?up(s)?\b/gi, "montée sur banc"], [/\bkickback(s)?\b/gi, "extension arrière"], [/\bflyes?\b/gi, "écartés"], [/\bpullover\b/gi, "pullover"], [/\bcalf\b/gi, "mollet"], [/\bleg(s)?\b/gi, "jambe"], [/\bhamstring(s)?\b/gi, "ischio-jambiers"], [/\bglute(s)?\b/gi, "fessier"], [/\bshoulder(s)?\b/gi, "épaule"], [/\bchest\b/gi, "pectoraux"], [/\bback\b/gi, "dos"], [/\barm(s)?\b/gi, "bras"], [/\btorso\b/gi, "buste"], [/\bbodyweight\b/gi, "poids du corps"], [/\bresistance\s*band\b/gi, "élastique"], [/\bband\b/gi, "élastique"], [/\bassisted\b/gi, "assisté"], [/\bwide\b/gi, "large"], [/\bclose\s*grip\b/gi, "prise serrée"], [/\bgrip\b/gi, "prise"], [/\bweighted\b/gi, "lesté"]
];

const INSTRUCTION_PATTERNS: Array<[RegExp, string]> = [
  [/Lie down on the floor and secure your feet\.?/gi, "Allongez-vous au sol et calez vos pieds."], [/Your legs should be bent at the knees\.?/gi, "Vos jambes doivent être fléchies au niveau des genoux."], [/Place your hands behind or to the side of your head\.?/gi, "Placez vos mains derrière ou sur les côtés de votre tête."], [/You will begin with your back on the ground\.?/gi, "Commencez le dos bien à plat sur le sol."], [/This will be your starting position\.?/gi, "Ceci constitue votre position de départ."], [/Flex your hips and spine to raise your torso toward your knees\.?/gi, "Contractez la sangle abdominale pour relever le buste vers vos genoux."], [/At the top of the contraction your torso should be perpendicular to the ground\.?/gi, "En haut du mouvement, votre buste forme un angle vertical."], [/Reverse the motion, going only ¾ of the way down\.?/gi, "Inversez le mouvement en freinant la descente."], [/Repeat for the recommended amount of repetitions\.?/gi, "Répétez pour le nombre de répétitions recommandé."], [/Repeat for 10-20 repetitions, and then switch to the other leg\.?/gi, "Effectuez 10 à 20 répétitions puis changez de jambe."], [/Exhale as you perform this movement\.?/gi, "Expirez lors de la phase d'effort."], [/Inhale during this portion of the motion\.?/gi, "Inspirez lors du retour."], [/Keep your elbows close to your torso\.?/gi, "Gardez les coudes proches du buste."], [/Slowly return to the starting position as you breathe in\.?/gi, "Revenez lentement à la position initiale en inspirant."]
];

function normalizeForKey(value: string) {
  return value.trim().replace(/\s+/g, " ").replace(/[–—]/g, "-");
}

function containsObviousEnglish(text: string) {
  const englishMarkers = /\b(barbell|dumbbell|cable|machine|seated|standing|lying|incline|decline|alternate|alternating|raise|press|row|curl|squat|deadlift|pulldown|pull-up|push-up|crunch|plank|lunge|step-up|kickback|fly|calf|hamstring|glute|shoulder|chest|back|bodyweight|assisted|weighted|grip)\b/i;
  return englishMarkers.test(text);
}

export function translateExerciseName(name: string, lang: Language): string {
  if (lang === "EN") return name;
  const normalized = normalizeForKey(name);
  if (EXERCISE_NAME_MAP[normalized]) return EXERCISE_NAME_MAP[normalized];

  let frName = normalized;
  for (const [regex, replacement] of NAME_TOKEN_MAP) frName = frName.replace(regex, replacement);

  frName = frName
    .replace(/\s+/g, " ")
    .replace(/\s+,/g, ",")
    .replace(/,\s*,/g, ",")
    .replace(/\s+à la barre\s+à la barre/gi, " à la barre")
    .replace(/\s+aux haltères\s+aux haltères/gi, " aux haltères")
    .trim();

  // Legacy patterns used by the generator.
  if (frName.includes("Sit-Up")) frName = frName.replace(/Sit-Up/gi, "Relevé de buste");
  if (frName.includes("Flyes")) frName = frName.replace(/Flyes/gi, "Écartés");

  // Never knowingly expose an obvious English exercise title in the FR interface.
  if (containsObviousEnglish(frName)) {
    return "Exercice guidé FysiqForge";
  }
  return frName;
}

export function translateMuscleGroup(muscleGroup: string, lang: Language): string {
  if (lang === "EN") return muscleGroup;
  const lower = muscleGroup.trim().toLowerCase();
  if (MUSCLE_TRANSLATIONS[lower]) return MUSCLE_TRANSLATIONS[lower];
  return lower
    .replace(/\bmiddle back\b/gi, "Milieu du dos")
    .replace(/\blower back\b/gi, "Lombaires")
    .replace(/\bchest\b/gi, "Pectoraux")
    .replace(/\bback\b/gi, "Dos")
    .replace(/\bshoulders?\b/gi, "Épaules")
    .replace(/\bglutes?\b/gi, "Fessiers")
    .replace(/\bhamstrings?\b/gi, "Ischio-jambiers")
    .replace(/\bquadriceps?\b/gi, "Quadriceps")
    .replace(/\bcalves?\b/gi, "Mollets")
    .replace(/\babdominals?\b/gi, "Abdominaux");
}

export function translateInstructionStep(stepText: string, lang: Language): string {
  if (lang === "EN") return stepText;

  let translated = stepText;
  INSTRUCTION_PATTERNS.forEach(([regex, frReplacement]) => { translated = translated.replace(regex, frReplacement); });

  // Light cleanup for the most common English leftovers from free-exercise-db.
  translated = translated
    .replace(/\bposition\b/gi, "position")
    .replace(/\brepeat\b/gi, "répéter")
    .replace(/\brepetitions?\b/gi, "répétitions")
    .replace(/\bhands\b/gi, "mains")
    .replace(/\bfeet\b/gi, "pieds")
    .replace(/\barms?\b/gi, "bras")
    .replace(/\blegs?\b/gi, "jambes")
    .replace(/\belbows?\b/gi, "coudes")
    .replace(/\bknees?\b/gi, "genoux")
    .replace(/\bback\b/gi, "dos")
    .replace(/\bchest\b/gi, "poitrine")
    .replace(/\bshoulders?\b/gi, "épaules")
    .replace(/\bhips?\b/gi, "hanches")
    .replace(/\bslowly\b/gi, "lentement")
    .replace(/\bstraight\b/gi, "droit")
    .replace(/\bbreathe out\b/gi, "expirez")
    .replace(/\bbreathe in\b/gi, "inspirez")
    .replace(/\bstart(ing)? position\b/gi, "position de départ");

  return translated;
}

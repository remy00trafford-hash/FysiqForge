export type Step =
  | "LANDING"
  | "PHOTO"
  | "QUESTIONNAIRE"
  | "GENERATING"
  | "AHA_PREVIEW"
  | "PAYWALL"
  | "FULL_PLAN"
  | "ADMIN";

export type PlanTierId = "essentiel" | "performance" | "elite";

export interface PlanTierConfig {
  id: PlanTierId;
  name: string;
  tagline: string;
  priceFcfa: number;
  priceUsd: number;
  priceEur: number;
  badge?: string;
  isPopular?: boolean;
  features: string[];
  hasAiCoach: boolean;
  hasMusicPlaylist: boolean;
  hasReminders: boolean;
  hasPrioritySupport: boolean;
}

export interface UserAnswers {
  objective: "Prise de masse (Hypertrophie)" | "Perte de gras (Sèche)" | "Tonification & Définition" | "Force & Athlétisme";
  targetZone: "Tout le corps" | "Pectoraux & Triceps" | "Epaules & Dos" | "Bras (Biceps/Triceps)" | "Abdominaux & Core" | "Jambes & Fessiers";
  frequency: "2 jours / sem" | "3 jours / sem" | "4 jours / sem" | "5 jours / sem" | "6 jours / sem";
  duration: "30-45 min" | "45-60 min" | "60-90 min";
  level: "Débutant" | "Intermédiaire" | "Avancé";
  musicStyle: "Afrobeats Gym Power" | "Hip-Hop Trap Workout" | "Synthwave Pump" | "Metal / Rock Heavy" | "Electro EDM Focus";
  equipment: "Salle de sport équipée" | "Haltères + Banc maison" | "Poids du corps (Sans matériel)";
  constraints: string; // Injuries or limitations
  healthConsent: boolean;
  photoUrl?: string;
  preferredWorkoutTime?: string; // Heure habituelle de séance, format "HH:MM", pour caler les rappels
}

export interface PhotoAnalysisResult {
  morphologyType: string;
  estimatedBodyFat: string;
  symmetryScore: number;
  postureAnalysis: string;
  priorityZones: string[];
  recommendedFrequency: string;
  coachSummary: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  restSeconds: number;
  tips: string;
  illustrationUrl: string;
  executionSteps: string[];
  alternativeExercise?: string;
}

export interface WorkoutDay {
  dayNumber: number;
  dayName: string;
  title: string;
  focus: string;
  estimatedDurationMin: number;
  caloriesBurnedEst: number;
  exercises: ExerciseItem[];
  isCompleted?: boolean;
}

export interface MusicTrack {
  title: string;
  duration: string;
  bpm: number;
  youtubeVideoId?: string;
  audioUrl?: string;
}

export interface MusicPlaylist {
  genre: string;
  title: string;
  artistOrMix: string;
  coverUrl: string;
  spotifyOrYoutubeUrl: string;
  youtubeVideoId?: string;
  tracks: MusicTrack[];
}

export interface WeekProgressionInfo {
  weekNumber: number;
  title: string;
  focus: string;
  loadAdvice: string;
  repsModifier: string;
}

export interface TrainingPlan {
  id: string;
  tierId: PlanTierId;
  tierName: string;
  programTitle: string;
  subtitle: string;
  description: string;
  analysis: PhotoAnalysisResult;
  userAnswers: UserAnswers;
  totalWeeks?: number;
  weeksProgression?: WeekProgressionInfo[];
  weekSchedule: WorkoutDay[];
  /** Full 8-week schedule. weekSchedule remains week 1 for backward compatibility. */
  weeklySchedules?: WorkoutDay[][];
  playlist: MusicPlaylist;
  createdAt: string;
  unlockedAt?: string;
}

export interface PaymentTransaction {
  id: string;
  userName: string;
  userEmail: string;
  planTier: string;
  amount: number;
  currency: "FCFA" | "USD" | "EUR";
  method: string;
  provider: string;
  timestamp: string;
  status: "SUCCEEDED" | "PENDING" | "FAILED";
  reference: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
  isMedicalWarning?: boolean;
}

export interface WorkoutLog {
  id: string;
  date: string;
  dayNumber: number;
  dayTitle: string;
  durationMinutes: number;
  feelingRating: number; // 1-5
  notes: string;
  caloriesBurned: number;
}

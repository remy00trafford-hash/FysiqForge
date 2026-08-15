import React, { useState, useEffect, useRef } from "react";
import { WorkoutDay, ExerciseItem } from "../types";
import { StickFigureWarmup } from "./StickFigureWarmup";
import { ExercisePoseIllustration, classifyExercisePose } from "./ExercisePoseIllustration";
import {
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  RotateCcw,
  Plus,
  Minus,
  CheckCircle2,
  Award,
  Flame,
  Dumbbell,
  Sparkles,
  Heart,
  Timer
} from "lucide-react";
import {
  Language,
  UI_LABELS,
  translateExerciseName,
  translateMuscleGroup
} from "../utils/translator";
import { speakText, stopSpeech } from "../utils/speechUtils";

interface GuidedWorkoutPlayerProps {
  workoutDay: WorkoutDay;
  initialExerciseIdx?: number;
  language: Language;
  onClose: () => void;
  onWorkoutCompleted: () => void;
  onCheckEquipment?: (exercise: ExerciseItem) => void;
}

type WorkoutPhase = "WARMUP" | "EXERCISE" | "REST" | "COMPLETE";

const REST_IMAGE = "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80";

// Échauffement décomposé en sous-étapes réelles, chacune avec son propre visuel
// et sa propre durée, pour que l'utilisateur sache exactement quoi faire à chaque instant.
interface WarmupStep {
  name: string;
  durationSec: number;
  description: string;
  stickFigureMove: "shoulders" | "jacks" | "chest";
}

const WARMUP_STEPS: WarmupStep[] = [
  {
    name: "Rotations Épaules & Coudes",
    durationSec: 30,
    description: "Fais tourner tes épaules vers l'avant puis vers l'arrière, bras détendus. Enchaîne avec des rotations de coudes pour lubrifier les articulations.",
    stickFigureMove: "shoulders"
  },
  {
    name: "Jumping Jacks",
    durationSec: 30,
    description: "Sauts écartés bras/jambes pour élever ton rythme cardiaque et préparer tout le corps à l'effort.",
    stickFigureMove: "jacks"
  },
  {
    name: "Ouverture de Cage Thoracique",
    durationSec: 30,
    description: "Étirement dynamique de la poitrine et du haut du dos : bras écartés, ouvre et ferme la cage thoracique en respirant profondément.",
    stickFigureMove: "chest"
  }
];

export const GuidedWorkoutPlayer: React.FC<GuidedWorkoutPlayerProps> = ({
  workoutDay,
  initialExerciseIdx = 0,
  language,
  onClose,
  onWorkoutCompleted,
  onCheckEquipment
}) => {
  const t = UI_LABELS[language];
  const exercises = workoutDay.exercises || [];

  // Flow State
  const [phase, setPhase] = useState<WorkoutPhase>("WARMUP");
  const [currentExIdx, setCurrentExIdx] = useState(initialExerciseIdx);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentWarmupIdx, setCurrentWarmupIdx] = useState(0);

  // Timer State
  const [timeLeft, setTimeLeft] = useState(WARMUP_STEPS[0].durationSec);
  const [isRunning, setIsRunning] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // --- COACH IA PROACTIF ---
  // Le coach intervient tout seul à des moments clés de la séance, sans que l'utilisateur
  // ait besoin d'aller le chercher dans le chat. Ça rend la séance vivante, comme un vrai coach présent.
  // File d'attente : si plusieurs messages se déclenchent au même moment, ils s'affichent
  // l'un après l'autre au lieu de s'écraser silencieusement.
  interface CoachQueueItem {
    text: string;
    isEquipmentCheck?: boolean;
  }
  const [coachMessage, setCoachMessage] = useState<string | null>(null);
  const coachQueueRef = useRef<CoachQueueItem[]>([]);
  const coachTimeoutRef = useRef<number | null>(null);
  const firedCoachEventsRef = useRef<Set<string>>(new Set());
  const [isCoachSpeaking, setIsCoachSpeaking] = useState(false);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [awaitingEquipmentConfirm, setAwaitingEquipmentConfirm] = useState(false);

  const runPreStartCountdown = () => {
    setCountdownValue(3);
    playBeep(500, 0.12);
    let n = 3;
    const step = () => {
      n -= 1;
      if (n > 0) {
        setCountdownValue(n);
        playBeep(500, 0.12);
        window.setTimeout(step, 700);
      } else {
        playBeep(900, 0.2);
        setCountdownValue(null);
      }
    };
    window.setTimeout(step, 700);
  };

  const handleAfterCoachSpeech = (wasEquipmentCheck: boolean) => {
    if (coachQueueRef.current.length > 0) {
      showNextCoachMessage();
      return;
    }
    setIsCoachSpeaking(false);
    if (wasEquipmentCheck) {
      // On ne lance PAS le décompte tout de suite : on attend une vraie réponse
      // de l'utilisateur (boutons) avant de reprendre la séance.
      setAwaitingEquipmentConfirm(true);
    } else {
      setCoachMessage(null);
      runPreStartCountdown();
    }
  };

  const showNextCoachMessage = () => {
    const next = coachQueueRef.current.shift();
    if (!next) {
      setCoachMessage(null);
      coachTimeoutRef.current = null;
      setIsCoachSpeaking(false);
      runPreStartCountdown();
      return;
    }
    setCoachMessage(next.text);
    setIsCoachSpeaking(true);
    const isLastInQueueAfterThis = coachQueueRef.current.length === 0;
    const spoke = speakText(
      next.text,
      () => setIsCoachSpeaking(true),
      () => handleAfterCoachSpeech(!!next.isEquipmentCheck && isLastInQueueAfterThis),
      () => {
        // La synthèse vocale a échoué (navigateur non compatible) — on ne bloque pas
        // l'utilisateur pour autant, on laisse le message affiché quelques secondes.
        window.setTimeout(() => handleAfterCoachSpeech(!!next.isEquipmentCheck && isLastInQueueAfterThis), 3000);
      }
    );
    if (!spoke) {
      // Speech Synthesis indisponible dans ce navigateur : on affiche le message
      // le temps de le lire, puis on enchaîne comme si la voix avait parlé.
      window.setTimeout(() => handleAfterCoachSpeech(!!next.isEquipmentCheck && isLastInQueueAfterThis), 3200);
    }
  };

  const triggerCoachMessage = (text: string, eventKey?: string, isEquipmentCheck?: boolean) => {
    if (eventKey) {
      if (firedCoachEventsRef.current.has(eventKey)) return;
      firedCoachEventsRef.current.add(eventKey);
    }
    coachQueueRef.current.push({ text, isEquipmentCheck });
    if (!isCoachSpeaking && coachMessage === null && countdownValue === null && !awaitingEquipmentConfirm) {
      showNextCoachMessage();
    }
  };

  const handleEquipmentConfirmYes = () => {
    setAwaitingEquipmentConfirm(false);
    setCoachMessage(null);
    runPreStartCountdown();
  };

  const handleEquipmentConfirmNo = () => {
    setAwaitingEquipmentConfirm(false);
    setCoachMessage(null);
    if (onCheckEquipment && currentExercise) {
      onCheckEquipment(currentExercise);
    }
    // On laisse le temps à l'utilisateur de consulter l'alternative proposée,
    // puis on reprend normalement la séance.
    runPreStartCountdown();
  };

  // Message d'accueil au tout début de l'échauffement
  useEffect(() => {
    triggerCoachMessage(
      "C'est parti ! On commence en douceur avec l'échauffement, respire bien et prépare ton corps.",
      "intro"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Interventions automatiques déclenchées par les changements de phase / progression
  useEffect(() => {
    if (phase === "EXERCISE" && currentSet === 1) {
      // Vérification du matériel AVANT chaque nouvel exercice — le coach le demande
      // à voix haute au lieu de laisser l'utilisateur découvrir seul qu'il n'a pas l'outil.
      const exName = exercises[currentExIdx]?.name || "cet exercice";
      triggerCoachMessage(
        `Prochain mouvement : ${exName}. As-tu tout le matériel nécessaire ?`,
        `equipment-check-${currentExIdx}`,
        true
      );
    }

    if (phase === "EXERCISE" && currentExIdx === 0 && currentSet === 1) {
      triggerCoachMessage("Premier exercice ! Concentre-toi sur la technique avant la charge.", "first-exercise");
    }

    if (phase === "EXERCISE" && exercises.length > 2) {
      const midpoint = Math.floor(exercises.length / 2);
      if (currentExIdx === midpoint) {
        triggerCoachMessage("Tu es à la moitié de ta séance, garde ce rythme, c'est du solide.", "midpoint");
      }
    }

    if (phase === "EXERCISE" && currentExIdx === exercises.length - 1) {
      triggerCoachMessage("Dernier exercice de la séance, donne tout ce qu'il te reste !", "last-exercise");
    }

    if (phase === "REST" && currentExIdx === exercises.length - 1) {
      triggerCoachMessage("Récupère bien, respire profondément, la séance touche à sa fin.", "final-rest");
    }

    if (phase === "COMPLETE") {
      triggerCoachMessage("Séance forgée avec succès ! Ton corps te remerciera demain.", "complete");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentExIdx]);

  useEffect(() => {
    return () => {
      if (coachTimeoutRef.current) window.clearTimeout(coachTimeoutRef.current);
    };
  }, []);

  // Audio beep generator using Web Audio API
  const playBeep = (freq = 800, duration = 0.15) => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // AudioContext fallback
    }
  };

  const currentExercise: ExerciseItem | undefined = exercises[currentExIdx];

  // Helper to set timer according to phase
  // Calcule un temps réaliste selon le TYPE d'exercice : si c'est déjà exprimé en temps
  // ("30 sec", "40 sec"), on garde ce temps tel quel. Si c'est un nombre de répétitions
  // ("15 reps", "12 reps (8/jambe)"), on estime une durée réaliste (~2,3 sec par répétition,
  // tempo contrôlé) au lieu d'un chrono fixe de 45 sec qui ne correspondait à rien.
  const estimateExerciseDurationSec = (repsLabel?: string): number => {
    if (!repsLabel) return 45;
    const lower = repsLabel.toLowerCase();

    const secMatch = lower.match(/(\d+)\s*sec/);
    if (secMatch) {
      return Math.max(10, parseInt(secMatch[1], 10));
    }
    const minMatch = lower.match(/(\d+)\s*min/);
    if (minMatch) {
      return Math.max(10, parseInt(minMatch[1], 10) * 60);
    }

    const repsMatch = lower.match(/(\d+)/);
    if (repsMatch) {
      const repsCount = parseInt(repsMatch[1], 10);
      // Tempo moyen contrôlé (montée + descente) ~2.3 sec par répétition
      const estimated = Math.round(repsCount * 2.3);
      return Math.min(90, Math.max(15, estimated));
    }

    return 45;
  };

  const setupPhaseTimer = (newPhase: WorkoutPhase, exIdx: number, setNum: number, warmupIdx: number = 0) => {
    if (newPhase === "WARMUP") {
      setTimeLeft(WARMUP_STEPS[warmupIdx]?.durationSec || 30);
    } else if (newPhase === "EXERCISE") {
      const ex = exercises[exIdx];
      setTimeLeft(estimateExerciseDurationSec(ex?.reps));
    } else if (newPhase === "REST") {
      const ex = exercises[exIdx];
      setTimeLeft(ex?.restSeconds || 45);
    }
  };

  // Automatic Timer Countdown Logic — se met en PAUSE tant que le coach parle ou que
  // le décompte 3-2-1 est en cours, pour que l'utilisateur ne soit jamais pris de court.
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0 && phase !== "COMPLETE" && !isCoachSpeaking && countdownValue === null && !awaitingEquipmentConfirm) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 4 || prev === 3 || prev === 2) {
            playBeep(600, 0.1);
          } else if (prev === 1) {
            playBeep(1200, 0.3);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (isRunning && timeLeft === 0 && phase !== "COMPLETE" && !isCoachSpeaking && countdownValue === null && !awaitingEquipmentConfirm) {
      // AUTOMATIC ADVANCE WITHOUT CLICKS!
      handleAutoAdvancePhase();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, phase, currentExIdx, currentSet, isCoachSpeaking, countdownValue, awaitingEquipmentConfirm]);

  // Handle Automatic Phase Transitions
  const handleAutoAdvancePhase = () => {
    stopSpeech();

    if (phase === "WARMUP") {
      if (currentWarmupIdx < WARMUP_STEPS.length - 1) {
        // Passe au mouvement d'échauffement suivant
        const nextWarmupIdx = currentWarmupIdx + 1;
        setCurrentWarmupIdx(nextWarmupIdx);
        setupPhaseTimer("WARMUP", 0, 1, nextWarmupIdx);
      } else {
        // Tous les mouvements d'échauffement sont faits -> premier exercice
        setPhase("EXERCISE");
        setCurrentExIdx(0);
        setCurrentSet(1);
        setupPhaseTimer("EXERCISE", 0, 1);
      }
    } else if (phase === "EXERCISE") {
      // Move from Exercise -> Rest
      setPhase("REST");
      setupPhaseTimer("REST", currentExIdx, currentSet);
    } else if (phase === "REST") {
      const ex = exercises[currentExIdx];
      const totalSets = ex?.sets || 3;

      if (currentSet < totalSets) {
        // Next set of current exercise
        const nextSet = currentSet + 1;
        setCurrentSet(nextSet);
        setPhase("EXERCISE");
        setupPhaseTimer("EXERCISE", currentExIdx, nextSet);
      } else if (currentExIdx < exercises.length - 1) {
        // Move to Next Exercise
        const nextExIdx = currentExIdx + 1;
        setCurrentExIdx(nextExIdx);
        setCurrentSet(1);
        setPhase("EXERCISE");
        setupPhaseTimer("EXERCISE", nextExIdx, 1);
      } else {
        // All exercises completed!
        setPhase("COMPLETE");
        setIsRunning(false);
        playBeep(1000, 0.5);
      }
    }
  };

  // Manual Skip to Next Step
  const handleSkipNext = () => {
    handleAutoAdvancePhase();
  };

  // Manual Go Back to Previous Step
  const handleGoPrevious = () => {
    stopSpeech();
    if (phase === "REST") {
      setPhase("EXERCISE");
      setupPhaseTimer("EXERCISE", currentExIdx, currentSet);
    } else if (phase === "EXERCISE") {
      if (currentSet > 1) {
        setCurrentSet(currentSet - 1);
        setPhase("EXERCISE");
        setupPhaseTimer("EXERCISE", currentExIdx, currentSet - 1);
      } else if (currentExIdx > 0) {
        const prevExIdx = currentExIdx - 1;
        const prevEx = exercises[prevExIdx];
        setCurrentExIdx(prevExIdx);
        setCurrentSet(prevEx?.sets || 3);
        setPhase("EXERCISE");
        setupPhaseTimer("EXERCISE", prevExIdx, prevEx?.sets || 3);
      } else {
        setPhase("WARMUP");
        setCurrentWarmupIdx(WARMUP_STEPS.length - 1);
        setupPhaseTimer("WARMUP", 0, 1, WARMUP_STEPS.length - 1);
      }
    } else if (phase === "WARMUP" && currentWarmupIdx > 0) {
      const prevWarmupIdx = currentWarmupIdx - 1;
      setCurrentWarmupIdx(prevWarmupIdx);
      setupPhaseTimer("WARMUP", 0, 1, prevWarmupIdx);
    } else if (phase === "COMPLETE") {
      setPhase("EXERCISE");
      setupPhaseTimer("EXERCISE", exercises.length - 1, 1);
    }
  };

  const handleAdjustTime = (deltaSeconds: number) => {
    setTimeLeft((prev) => Math.max(5, prev + deltaSeconds));
  };

  const handleToggleVoice = () => {
    if (isVoiceActive) {
      stopSpeech();
      setIsVoiceActive(false);
    } else {
      if (currentExercise && phase === "EXERCISE") {
        const textToSpeak = `${translateExerciseName(currentExercise.name, language)}. ${t.sets}: ${currentSet} sur ${currentExercise.sets}. ${currentExercise.tips}`;
        setIsVoiceActive(true);
        speakText(
          textToSpeak,
          () => setIsVoiceActive(true),
          () => setIsVoiceActive(false),
          () => setIsVoiceActive(false)
        );
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Calculate overall workout percentage
  const totalStepsInWorkout = exercises.length * 2 + 1; // warmup + (ex+rest)
  const completedSteps = phase === "WARMUP" ? 0 : currentExIdx * 2 + (phase === "REST" ? 2 : 1);
  const progressPercent = Math.min(100, Math.round((completedSteps / totalStepsInWorkout) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0E] text-white flex flex-col h-screen overflow-hidden select-none animate-in fade-in zoom-in-95">
      {/* Bannière Coach IA Proactif — apparaît automatiquement, sans action de l'utilisateur */}
      {coachMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] max-w-md w-[92%] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-gradient-to-r from-[#FF5500] to-[#FF8A00] rounded-2xl px-4 py-3 shadow-2xl shadow-[#FF5500]/30">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className={`text-sm ${isCoachSpeaking ? "animate-pulse" : ""}`}>🤖</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-wider text-black/70 mb-0.5">
                  Coach IA FysiqForge {isCoachSpeaking && "· en train de parler..."}
                </p>
                <p className="text-sm font-bold text-black leading-snug">{coachMessage}</p>
              </div>
            </div>

            {/* Vraie bulle interactive : le coach attend une réponse avant de continuer */}
            {awaitingEquipmentConfirm && (
              <div className="flex gap-2 mt-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <button
                  onClick={handleEquipmentConfirmYes}
                  className="flex-1 bg-black text-white font-bold text-xs py-2.5 rounded-xl hover:bg-black/80 transition-colors cursor-pointer"
                >
                  ✅ J'ai tout, c'est bon
                </button>
                <button
                  onClick={handleEquipmentConfirmNo}
                  className="flex-1 bg-white text-black font-bold text-xs py-2.5 rounded-xl hover:bg-white/80 transition-colors cursor-pointer"
                >
                  ❌ Il me manque un truc
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Décompte 3-2-1 avant la reprise du chrono, une fois que le coach a fini de parler */}
      {countdownValue !== null && (
        <div className="absolute inset-0 z-[70] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 animate-in fade-in duration-200">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FF8A3D]">C'est parti dans</p>
          <div
            key={countdownValue}
            className="text-[120px] font-black text-white leading-none animate-in zoom-in-50 duration-300"
          >
            {countdownValue}
          </div>
        </div>
      )}

      {/* Top Guided Workout Navigation Header */}
      <header className="bg-[#121218]/90 border-b border-white/10 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF5500] flex items-center justify-center font-bold text-white shadow-lg shadow-[#FF5500]/20">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#FF5500] uppercase tracking-wider">
                {workoutDay.dayName} — {t.startWorkout}
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-500/30">
                AUTO-CHRONO ACTIVE
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-extrabold uppercase truncate max-w-[280px] sm:max-w-md">
              {workoutDay.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mute/Sound Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              isMuted ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-white/5 text-gray-300 border-white/10"
            }`}
            title="Activer / Désactiver les signaux sonores"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#FF5500]" />}
          </button>

          {/* Close / Exit Button */}
          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-gray-300 hover:text-white transition-colors cursor-pointer"
            title="Fermer la séance"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Global Progress Line Bar */}
      <div className="w-full bg-white/5 h-1.5 shrink-0">
        <div
          className="bg-gradient-to-r from-[#FF5500] to-emerald-400 h-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* MAIN GUIDED STAGE AREA */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 gap-6 overflow-y-auto">
        {/* LEFT / CENTER VISUAL STAGE */}
        <div className="w-full lg:w-1/2 max-w-xl flex flex-col items-center text-center space-y-4">
          {/* PHASE BADGE INDICATOR */}
          <div className="flex items-center gap-2">
            {phase === "WARMUP" && (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                <Flame className="w-4 h-4 text-amber-400" />
                {t.warmupPhase}
              </span>
            )}

            {phase === "EXERCISE" && (
              <span className="bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/30 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-[#FF5500]" />
                {t.exercisePhase} — EXERCICE {currentExIdx + 1} / {exercises.length}
              </span>
            )}

            {phase === "REST" && (
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                <Timer className="w-4 h-4 text-blue-400" />
                {t.restPhase}
              </span>
            )}

            {phase === "COMPLETE" && (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                {t.workoutComplete}
              </span>
            )}
          </div>

          {/* MAIN VISUAL DISPLAY IMAGE WITH ANIMATED FRAME */}
          <div
            key={`img-${phase}-${currentExIdx}-${currentSet}`}
            className="relative w-full h-64 sm:h-80 rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl bg-black group animate-fade-slide"
          >
            {phase === "WARMUP" ? (
              <StickFigureWarmup
                key={`stick-${currentWarmupIdx}`}
                move={WARMUP_STEPS[currentWarmupIdx]?.stickFigureMove || "shoulders"}
              />
            ) : phase === "REST" ? (
              <div className="w-full h-full flex items-center justify-center bg-[#1A120C]">
                <span className="text-6xl animate-pulse">😮‍💨</span>
              </div>
            ) : (
              <ExercisePoseIllustration
                key={`pose-${currentExIdx}`}
                pose={classifyExercisePose(currentExercise?.name || "", currentExercise?.muscleGroup)}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* OVERLAY TIMER DISPLAY */}
            {phase !== "COMPLETE" && (
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="bg-black/80 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#FF5500] animate-ping" />
                  <span className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-white">
                    {formatTime(timeLeft)}
                  </span>
                </div>

                {phase === "EXERCISE" && currentExercise && (
                  <div className="bg-[#FF5500] text-white px-3.5 py-2 rounded-2xl font-black text-xs sm:text-sm shadow-xl">
                    {t.sets} {currentSet} / {currentExercise.sets}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* BIG COUNTDOWN TIMER & CONTROL BUTTONS */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => handleAdjustTime(-15)}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 flex items-center gap-1 cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" /> 15s
            </button>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl cursor-pointer transition-transform active:scale-95 ${
                isRunning
                  ? "bg-amber-500 hover:bg-amber-400 text-black"
                  : "bg-[#FF5500] hover:bg-[#FF6611] text-white"
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{isRunning ? t.pause : t.resume}</span>
            </button>

            <button
              onClick={() => handleAdjustTime(+15)}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> 15s
            </button>
          </div>
        </div>

        {/* RIGHT DETAILS / INSTRUCTIONS PANEL WITH FADE-SLIDE TRANSITION */}
        <div
          key={`panel-${phase}-${currentExIdx}-${currentSet}`}
          className="w-full lg:w-1/2 max-w-xl bg-[#16161E] border border-white/10 rounded-3xl p-6 space-y-5 shadow-2xl animate-fade-slide"
        >
          {/* PHASE 1: WARMUP CONTENT — décomposé en sous-étapes, une par mouvement */}
          {phase === "WARMUP" && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Échauffement — Mouvement {currentWarmupIdx + 1} sur {WARMUP_STEPS.length}
                </span>
                <h3 className="text-2xl font-black uppercase text-white font-display">
                  {WARMUP_STEPS[currentWarmupIdx]?.name}
                </h3>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed bg-[#121218] p-4 rounded-2xl border border-white/5">
                {WARMUP_STEPS[currentWarmupIdx]?.description}
              </p>

              {/* Mini indicateur des 3 mouvements pour visualiser où on en est */}
              <div className="flex items-center gap-2">
                {WARMUP_STEPS.map((step, idx) => (
                  <div
                    key={step.name}
                    className={`flex-1 h-1.5 rounded-full transition-colors ${
                      idx < currentWarmupIdx
                        ? "bg-amber-500"
                        : idx === currentWarmupIdx
                        ? "bg-amber-400 animate-pulse"
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-200">
                <p className="font-extrabold uppercase mb-1">🔥 Prochain mouvement :</p>
                <p className="opacity-90">
                  {currentWarmupIdx < WARMUP_STEPS.length - 1
                    ? WARMUP_STEPS[currentWarmupIdx + 1].name
                    : "Premier exercice de la séance"}
                </p>
              </div>
            </div>
          )}

          {/* PHASE 2: EXERCISE CONTENT */}
          {phase === "EXERCISE" && currentExercise && (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-[#FF5500] uppercase tracking-wider">
                    {t.targetMuscle} : {translateMuscleGroup(currentExercise.muscleGroup, language)}
                  </span>
                  <h3 className="text-2xl font-black uppercase text-white font-display">
                    {translateExerciseName(currentExercise.name, language)}
                  </h3>
                </div>

                <button
                  onClick={handleToggleVoice}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isVoiceActive
                      ? "bg-[#FF5500] text-white border-[#FF5500] animate-pulse"
                      : "bg-white/5 text-[#FF5500] border-[#FF5500]/30"
                  }`}
                  title="Lire les consignes à haute voix"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Targets Pill Banner */}
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/30 px-3 py-1.5 rounded-xl">
                  {t.sets} : {currentSet} / {currentExercise.sets}
                </span>
                <span className="bg-white/5 border border-white/10 text-gray-300 px-3 py-1.5 rounded-xl">
                  {t.reps} : {currentExercise.reps}
                </span>
              </div>

              {/* Execution Steps */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                <h4 className="text-xs font-extrabold uppercase text-gray-400">{t.executionSteps} :</h4>
                <ol className="space-y-1.5 text-xs text-gray-300">
                  {currentExercise.executionSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-[#121218] p-2.5 rounded-xl border border-white/5">
                      <span className="w-4 h-4 rounded-full bg-[#FF5500]/20 text-[#FF5500] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Coach Tips */}
              <div className="p-3 bg-[#FF5500]/10 border border-[#FF5500]/30 rounded-2xl text-xs text-gray-200">
                <strong className="text-[#FF5500] uppercase block mb-1">💡 {t.tips} :</strong>
                <p className="leading-relaxed">{currentExercise.tips}</p>
              </div>
            </div>
          )}

          {/* PHASE 3: REST CONTENT */}
          {phase === "REST" && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Phase de Récupération
                </span>
                <h3 className="text-2xl font-black uppercase text-white font-display">
                  {t.restPhase}
                </h3>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed bg-[#121218] p-4 rounded-2xl border border-white/5">
                {t.restDesc}
              </p>

              {/* NEXT UP PREVIEW BOX */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl space-y-2">
                <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">
                  👀 {t.nextUp} :
                </span>

                {currentExercise && currentSet < currentExercise.sets ? (
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>{translateExerciseName(currentExercise.name, language)}</span>
                    <span className="bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-lg">
                      {t.nextSet} {currentSet + 1} / {currentExercise.sets}
                    </span>
                  </div>
                ) : exercises[currentExIdx + 1] ? (
                  <div className="flex items-center justify-between gap-3 text-xs font-bold text-white">
                    <div className="flex items-center gap-3">
                      <img
                        src={exercises[currentExIdx + 1].illustrationUrl}
                        alt="Next"
                        className="w-12 h-12 rounded-xl object-cover border border-white/10"
                      />
                      <div>
                        <p className="font-extrabold">{translateExerciseName(exercises[currentExIdx + 1].name, language)}</p>
                        <p className="text-[10px] text-emerald-400 font-semibold">
                          {translateMuscleGroup(exercises[currentExIdx + 1].muscleGroup, language)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs font-extrabold text-emerald-400">
                    Dernière ligne droite ! Prochaine étape : Fin de séance 🎉
                  </p>
                )}
              </div>
            </div>
          )}

          {/* PHASE 4: COMPLETE CONTENT */}
          {phase === "COMPLETE" && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-2xl">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-black uppercase text-white font-display">
                  {t.workoutComplete}
                </h3>
                <p className="text-xs text-gray-300 mt-1">{t.workoutCompleteDesc}</p>
              </div>

              <button
                onClick={() => {
                  onWorkoutCompleted();
                  onClose();
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-wider shadow-xl cursor-pointer transition-all"
              >
                {t.saveBilan} ✓
              </button>
            </div>
          )}

          {/* NAVIGATION FOOTER CONTROLS */}
          {phase !== "COMPLETE" && (
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={handleGoPrevious}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <SkipBack className="w-4 h-4" />
                <span>{t.previous}</span>
              </button>

              <button
                onClick={handleSkipNext}
                className="px-5 py-2.5 bg-[#FF5500] hover:bg-[#FF6611] text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-lg transition-transform active:scale-95"
              >
                <span>{t.skip}</span>
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

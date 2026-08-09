import React, { useState, useEffect, useRef } from "react";
import { WorkoutDay, ExerciseItem } from "../types";
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
  translateMuscleGroup,
  translateInstructionStep
} from "../utils/translator";
import { speakText, stopSpeech } from "../utils/speechUtils";

interface GuidedWorkoutPlayerProps {
  workoutDay: WorkoutDay;
  initialExerciseIdx?: number;
  language: Language;
  onClose: () => void;
  onWorkoutCompleted: () => void;
}

type WorkoutPhase = "WARMUP" | "EXERCISE" | "REST" | "COMPLETE";

const WARMUP_IMAGE = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80";
const REST_IMAGE = "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80";

export const GuidedWorkoutPlayer: React.FC<GuidedWorkoutPlayerProps> = ({
  workoutDay,
  initialExerciseIdx = 0,
  language,
  onClose,
  onWorkoutCompleted
}) => {
  const t = UI_LABELS[language];
  const exercises = workoutDay.exercises || [];

  // Flow State
  const [phase, setPhase] = useState<WorkoutPhase>("WARMUP");
  const [currentExIdx, setCurrentExIdx] = useState(initialExerciseIdx);
  const [currentSet, setCurrentSet] = useState(1);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(60); // 60s warmup initial
  const [isRunning, setIsRunning] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

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
  const setupPhaseTimer = (newPhase: WorkoutPhase, exIdx: number, setNum: number) => {
    if (newPhase === "WARMUP") {
      setTimeLeft(60);
    } else if (newPhase === "EXERCISE") {
      // 45 seconds duration per set exercise work
      setTimeLeft(45);
    } else if (newPhase === "REST") {
      const ex = exercises[exIdx];
      setTimeLeft(ex?.restSeconds || 45);
    }
  };

  // Automatic Timer Countdown Logic
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0 && phase !== "COMPLETE") {
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
    } else if (isRunning && timeLeft === 0 && phase !== "COMPLETE") {
      // AUTOMATIC ADVANCE WITHOUT CLICKS!
      handleAutoAdvancePhase();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, phase, currentExIdx, currentSet]);

  // Handle Automatic Phase Transitions
  const handleAutoAdvancePhase = () => {
    stopSpeech();

    if (phase === "WARMUP") {
      // Move from Warmup -> Exercise 0 (Set 1)
      setPhase("EXERCISE");
      setCurrentExIdx(0);
      setCurrentSet(1);
      setupPhaseTimer("EXERCISE", 0, 1);
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
        setupPhaseTimer("WARMUP", 0, 1);
      }
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
            <img
              key={`src-${phase}-${currentExIdx}`}
              src={
                phase === "WARMUP"
                  ? WARMUP_IMAGE
                  : phase === "REST"
                  ? REST_IMAGE
                  : currentExercise?.illustrationUrl || WARMUP_IMAGE
              }
              alt={currentExercise?.name || "Exercise"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 animate-image-fade"
            />
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
          {/* PHASE 1: WARMUP CONTENT */}
          {phase === "WARMUP" && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Étape 1 sur {exercises.length + 1}
                </span>
                <h3 className="text-2xl font-black uppercase text-white font-display">
                  {t.warmupPhase}
                </h3>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed bg-[#121218] p-4 rounded-2xl border border-white/5">
                {t.warmupDesc}
              </p>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-2 text-xs text-amber-200">
                <p className="font-extrabold uppercase">🔥 Exercices de Préparation Suggestion :</p>
                <ul className="list-disc list-inside space-y-1 opacity-90">
                  <li>Rotations des épaules & coudes : 20 répétitions</li>
                  <li>Jumping Jacks ou Montées de genoux : 30 secondes</li>
                  <li>Ouverture de cage thoracique & étirement dynamique</li>
                </ul>
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
                      <span>{translateInstructionStep(step, language)}</span>
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

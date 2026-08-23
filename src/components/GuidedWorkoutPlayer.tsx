import React, { useEffect, useRef, useState } from "react";
import { WorkoutDay, ExerciseItem } from "../types";
import { StickFigureWarmup } from "./StickFigureWarmup";
import { ExerciseAnimationFrame } from "./ExerciseAnimationFrame";
import { X, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Plus, Minus, CheckCircle2, Award, Dumbbell } from "lucide-react";
import { Language, UI_LABELS, translateExerciseName, translateMuscleGroup } from "../utils/translator";
import { speakText, stopSpeech } from "../utils/speechUtils";

interface GuidedWorkoutPlayerProps { workoutDay: WorkoutDay; initialExerciseIdx?: number; language: Language; onClose: () => void; onWorkoutCompleted: () => void; onCheckEquipment?: (exercise: ExerciseItem) => void; }
type WorkoutPhase = "WARMUP" | "EXERCISE" | "REST" | "COMPLETE";
interface WarmupStep { name: string; durationSec: number; description: string; stickFigureMove: "shoulders" | "jacks" | "chest"; }
const WARMUP_STEPS: WarmupStep[] = [
  { name: "Rotations Épaules & Coudes", durationSec: 30, description: "Fais tourner tes épaules vers l'avant puis vers l'arrière, bras détendus.", stickFigureMove: "shoulders" },
  { name: "Jumping Jacks", durationSec: 30, description: "Sauts écartés bras et jambes pour élever progressivement le rythme cardiaque.", stickFigureMove: "jacks" },
  { name: "Ouverture de Cage Thoracique", durationSec: 30, description: "Ouvre et ferme la cage thoracique avec un mouvement dynamique et contrôlé.", stickFigureMove: "chest" }
];

function estimateExerciseDurationSec(repsLabel?: string) {
  if (!repsLabel) return 40;
  const lower = repsLabel.toLowerCase();
  const sec = lower.match(/(\d+)\s*sec/); if (sec) return Math.max(10, Math.min(120, Number(sec[1])));
  const min = lower.match(/(\d+)\s*min/); if (min) return Math.max(15, Math.min(180, Number(min[1]) * 60));
  const reps = lower.match(/\d+/); if (reps) return Math.max(15, Math.min(75, Math.round(Number(reps[0]) * 2)));
  return 40;
}

export const GuidedWorkoutPlayer: React.FC<GuidedWorkoutPlayerProps> = ({ workoutDay, initialExerciseIdx = 0, language, onClose, onWorkoutCompleted, onCheckEquipment }) => {
  const t = UI_LABELS[language];
  const exercises = workoutDay.exercises || [];
  const [phase, setPhase] = useState<WorkoutPhase>("WARMUP");
  const [currentExIdx, setCurrentExIdx] = useState(Math.min(Math.max(0, initialExerciseIdx), Math.max(0, exercises.length - 1)));
  const [currentSet, setCurrentSet] = useState(1);
  const [currentWarmupIdx, setCurrentWarmupIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(WARMUP_STEPS[0].durationSec);
  const [isRunning, setIsRunning] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const timerAnchorRef = useRef<number | null>(null);
  const pausedRemainingRef = useRef<number>(timeLeft);
  const autoAdvanceLockRef = useRef(false);
  const [coachMessage, setCoachMessage] = useState<string | null>(null);
  const [awaitingEquipmentConfirm, setAwaitingEquipmentConfirm] = useState(false);

  const currentExercise = exercises[currentExIdx] as ExerciseItem | undefined;

  const clearCountdown = () => {
    if (countdownTimerRef.current !== null) { window.clearTimeout(countdownTimerRef.current); countdownTimerRef.current = null; }
    setCountdownValue(null);
  };

  const playBeep = (freq = 800, duration = 0.12) => {
    if (isMuted || typeof window === "undefined") return;
    try {
      const Ctx = (window.AudioContext || (window as any).webkitAudioContext);
      if (!Ctx) return;
      const ctx = new Ctx(); const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.frequency.value = freq; gain.gain.setValueAtTime(0.16, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + duration);
    } catch {}
  };

  const startCountdown = () => {
    clearCountdown();
    let n = 3;
    setCountdownValue(n); playBeep(500);
    const tick = () => {
      n -= 1;
      if (n <= 0) { setCountdownValue(null); countdownTimerRef.current = null; playBeep(900, 0.18); return; }
      setCountdownValue(n); playBeep(500); countdownTimerRef.current = window.setTimeout(tick, 700);
    };
    countdownTimerRef.current = window.setTimeout(tick, 700);
  };

  const setPhaseTimer = (nextPhase: WorkoutPhase, exIdx = currentExIdx, setNum = currentSet, warmupIdx = currentWarmupIdx) => {
    let next = 30;
    if (nextPhase === "WARMUP") next = WARMUP_STEPS[warmupIdx]?.durationSec || 30;
    else if (nextPhase === "EXERCISE") next = estimateExerciseDurationSec(exercises[exIdx]?.reps);
    else if (nextPhase === "REST") next = exercises[exIdx]?.restSeconds || 40;
    setPhase(nextPhase); if (nextPhase !== "COMPLETE") setTimeLeft(next); pausedRemainingRef.current = next; timerAnchorRef.current = isRunning ? performance.now() : null; autoAdvanceLockRef.current = false;
  };

  const advance = () => {
    if (autoAdvanceLockRef.current) return; autoAdvanceLockRef.current = true; clearCountdown(); stopSpeech();
    if (phase === "WARMUP") {
      if (currentWarmupIdx < WARMUP_STEPS.length - 1) { const next = currentWarmupIdx + 1; setCurrentWarmupIdx(next); setPhaseTimer("WARMUP", 0, 1, next); }
      else { setCurrentExIdx(Math.max(0, Math.min(currentExIdx, exercises.length - 1))); setCurrentSet(1); setPhaseTimer("EXERCISE", currentExIdx, 1); }
    } else if (phase === "EXERCISE") {
      setPhaseTimer("REST", currentExIdx, currentSet);
    } else if (phase === "REST") {
      const ex = exercises[currentExIdx]; const totalSets = ex?.sets || 3;
      if (currentSet < totalSets) { const s = currentSet + 1; setCurrentSet(s); setPhaseTimer("EXERCISE", currentExIdx, s); }
      else if (currentExIdx < exercises.length - 1) { const e = currentExIdx + 1; setCurrentExIdx(e); setCurrentSet(1); setPhaseTimer("EXERCISE", e, 1); }
      else { setPhase("COMPLETE"); setIsRunning(false); timerAnchorRef.current = null; playBeep(1100, 0.35); onWorkoutCompleted(); }
    }
  };

  const goPrevious = () => {
    clearCountdown(); stopSpeech(); autoAdvanceLockRef.current = false;
    if (phase === "REST") setPhaseTimer("EXERCISE", currentExIdx, currentSet);
    else if (phase === "EXERCISE") {
      if (currentSet > 1) { const s = currentSet - 1; setCurrentSet(s); setPhaseTimer("EXERCISE", currentExIdx, s); }
      else if (currentExIdx > 0) { const e = currentExIdx - 1; const prev = exercises[e]; setCurrentExIdx(e); setCurrentSet(prev?.sets || 3); setPhaseTimer("EXERCISE", e, prev?.sets || 3); }
      else { setCurrentWarmupIdx(WARMUP_STEPS.length - 1); setPhaseTimer("WARMUP", 0, 1, WARMUP_STEPS.length - 1); }
    } else if (phase === "WARMUP" && currentWarmupIdx > 0) {
      const w = currentWarmupIdx - 1; setCurrentWarmupIdx(w); setPhaseTimer("WARMUP", 0, 1, w);
    }
  };

  useEffect(() => {
    return () => { clearCountdown(); stopSpeech(); };
  }, []);

  useEffect(() => {
    if (!isRunning || phase === "COMPLETE" || countdownValue !== null || awaitingEquipmentConfirm) { timerAnchorRef.current = null; return; }
    timerAnchorRef.current = performance.now();
    const id = window.setInterval(() => {
      const anchor = timerAnchorRef.current; if (anchor === null) return;
      const elapsed = Math.floor((performance.now() - anchor) / 1000);
      const remaining = Math.max(0, pausedRemainingRef.current - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) { timerAnchorRef.current = null; advance(); }
    }, 200);
    return () => window.clearInterval(id);
  }, [isRunning, phase, countdownValue, awaitingEquipmentConfirm]);

  useEffect(() => { pausedRemainingRef.current = timeLeft; }, [timeLeft]);

  const toggleRunning = () => {
    if (phase === "COMPLETE") return;
    if (isRunning) { pausedRemainingRef.current = timeLeft; timerAnchorRef.current = null; setIsRunning(false); }
    else { timerAnchorRef.current = performance.now(); setIsRunning(true); }
  };
  const adjustTime = (delta: number) => { const next = Math.max(0, Math.min(599, timeLeft + delta)); pausedRemainingRef.current = next; setTimeLeft(next); if (isRunning) timerAnchorRef.current = performance.now(); if (next === 0) advance(); };
  const toggleVoice = () => {
    if (!isVoiceActive) {
      if (!currentExercise || phase !== "EXERCISE") return;
      const text = `${translateExerciseName(currentExercise.name, language)}. ${t.sets}: ${currentSet} sur ${currentExercise.sets}. À faire : ${currentExercise.reps}. ${currentExercise.tips}`;
      setIsVoiceActive(true); speakText(text, () => setIsVoiceActive(true), () => setIsVoiceActive(false), () => setIsVoiceActive(false));
    } else { stopSpeech(); setIsVoiceActive(false); }
  };

  useEffect(() => {
    if (phase === "EXERCISE" && currentExercise && currentSet === 1) {
      setCoachMessage(`Prochain mouvement : ${translateExerciseName(currentExercise.name, language)}.`);
    } else if (phase === "COMPLETE") setCoachMessage("Séance terminée. Bravo !"); else setCoachMessage(null);
  }, [phase, currentExIdx, currentSet, language]);

  const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
  const progressTotal = Math.max(1, exercises.length * 2 + 1);
  const progressStep = phase === "WARMUP" ? 0 : currentExIdx * 2 + (phase === "REST" ? 2 : 1);
  const progress = Math.min(100, Math.round((progressStep / progressTotal) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0E] text-white flex flex-col h-screen overflow-hidden select-none">
      {countdownValue !== null && <div className="absolute inset-0 z-[80] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center"><p className="text-sm font-bold uppercase tracking-widest text-[#FF8A3D]">C'est parti dans</p><div className="text-[120px] font-black">{countdownValue}</div></div>}
      {coachMessage && <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] w-[92%] max-w-md"><div className="bg-gradient-to-r from-[#FF5500] to-[#FF8A00] rounded-2xl px-4 py-3 shadow-2xl"><p className="text-sm font-bold text-black">{coachMessage}</p>{phase === "EXERCISE" && currentSet === 1 && currentExercise && onCheckEquipment && <div className="mt-2"><button onClick={() => onCheckEquipment(currentExercise)} className="text-[11px] bg-white/90 text-black rounded-lg px-3 py-2 font-bold">Vérifier le matériel</button></div>}</div></div>}
      <header className="bg-[#121218]/95 border-b border-white/10 px-4 py-3 flex items-center justify-between shrink-0"><div className="flex items-center gap-3 min-w-0"><div className="w-9 h-9 rounded-xl bg-[#FF5500] flex items-center justify-center"><Dumbbell className="w-5 h-5"/></div><div className="min-w-0"><div className="text-[10px] text-[#FF5500] font-black uppercase tracking-wider truncate">{workoutDay.dayName} — {t.startWorkout}</div><h2 className="font-extrabold uppercase truncate max-w-[260px] sm:max-w-md">{workoutDay.title}</h2></div></div><button onClick={onClose} className="p-2 rounded-xl bg-white/5 border border-white/10"><X className="w-5 h-5"/></button></header>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6"><div className="max-w-5xl mx-auto space-y-4">
        <div className="bg-[#15151C] border border-white/10 rounded-2xl p-4"><div className="flex justify-between items-center gap-3"><div><div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{phase === "WARMUP" ? "Échauffement" : phase === "EXERCISE" ? "Exercice" : phase === "REST" ? "Repos" : "Terminé"}</div><div className="text-5xl sm:text-6xl font-black tabular-nums tracking-tight">{formatTime(timeLeft)}</div></div><div className="flex items-center gap-2 flex-wrap justify-end"><button onClick={() => adjustTime(-15)} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black flex items-center gap-1"><Minus className="w-4 h-4"/>15s</button><button onClick={toggleRunning} className="px-4 py-2 rounded-xl bg-[#FF5500] text-xs font-black flex items-center gap-1">{isRunning?<Pause className="w-4 h-4"/>:<Play className="w-4 h-4"/>}{isRunning?"Pause":"Reprendre"}</button><button onClick={() => adjustTime(15)} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black flex items-center gap-1"><Plus className="w-4 h-4"/>15s</button></div></div><div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-[#FF5500] transition-[width] duration-300" style={{width:`${progress}%`}}/></div></div>

        <div className="bg-[#15151C] border border-white/10 rounded-3xl p-4 sm:p-6"><div className="flex items-center justify-between gap-3 mb-4"><div><div className="text-xs text-[#FF5500] font-black uppercase">{phase === "WARMUP" ? WARMUP_STEPS[currentWarmupIdx]?.name : currentExercise ? translateExerciseName(currentExercise.name, language) : "Séance"}</div>{phase === "EXERCISE" && currentExercise && <div className="text-xs text-emerald-400 font-semibold mt-1">{translateMuscleGroup(currentExercise.muscleGroup, language)} · Série {currentSet}/{currentExercise.sets}</div>}</div><div className="flex gap-2"><button onClick={() => setIsMuted(v=>!v)} className="p-2 rounded-xl bg-white/5 border border-white/10" title="Son">{isMuted?<VolumeX className="w-4 h-4"/>:<Volume2 className="w-4 h-4"/>}</button>{phase === "EXERCISE" && <button onClick={toggleVoice} className={`p-2 rounded-xl border ${isVoiceActive?"bg-[#FF5500] border-[#FF5500]":"bg-white/5 border-white/10"}`} title="Coach vocal"><Volume2 className="w-4 h-4"/></button>}</div></div>
          <div className="aspect-video max-h-[58vh] rounded-2xl overflow-hidden bg-[#070B10]">{phase === "WARMUP" ? <StickFigureWarmup move={WARMUP_STEPS[currentWarmupIdx].stickFigureMove}/> : phase === "EXERCISE" && currentExercise ? <ExerciseAnimationFrame exercise={currentExercise}/> : <div className="h-full flex items-center justify-center text-center p-6"><div><div className="text-4xl mb-3">{phase === "REST" ? "🧘" : "🏆"}</div><p className="text-lg font-black">{phase === "REST" ? "Récupère et respire" : "Séance forgée"}</p></div></div>}</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between"><button onClick={goPrevious} disabled={phase === "WARMUP" && currentWarmupIdx === 0} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold disabled:opacity-40 flex items-center justify-center gap-2"><SkipBack className="w-4 h-4"/>Précédent</button><button onClick={advance} disabled={phase === "COMPLETE"} className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#FF2200] text-sm font-black flex items-center justify-center gap-2 disabled:opacity-40"><SkipForward className="w-4 h-4"/>Suivant</button></div>
        {phase === "COMPLETE" && <div className="flex items-center justify-center"><button onClick={onWorkoutCompleted} className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-black flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/>Terminer la séance</button></div>}
      </div></main>
    </div>
  );
};
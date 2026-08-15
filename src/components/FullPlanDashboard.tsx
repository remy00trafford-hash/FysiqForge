import React, { useState, useEffect, useCallback } from "react";
import { TrainingPlan, WorkoutLog, ExerciseItem } from "../types";
import { WorkoutAudioPlayer } from "./WorkoutAudioPlayer";
import { GuidedWorkoutPlayer } from "./GuidedWorkoutPlayer";
import { PostWorkoutBilanModal } from "./PostWorkoutBilanModal";
import { EquipmentCheckModal } from "./EquipmentCheckModal";
import { FaqAndSupportModal } from "./FaqAndSupportModal";
import { NutritionGuideModal } from "./NutritionGuideModal";
import { AiCoachChat } from "./AiCoachChat";
import { ProgressTracker } from "./ProgressTracker";
import { MedicalDisclaimerBanner } from "./MedicalDisclaimerBanner";
import { NotificationCenter } from "./NotificationCenter";
import { Dumbbell, Calendar, Music, Bot, TrendingUp, CheckCircle, Flame, Bell, Award, Sparkles, HelpCircle, Utensils, Printer, Play } from "lucide-react";
import { Language, UI_LABELS, translateExerciseName, translateMuscleGroup } from "../utils/translator";

interface FullPlanDashboardProps {
  plan: TrainingPlan;
  userEmail: string;
  language: Language;
}

export const FullPlanDashboard: React.FC<FullPlanDashboardProps> = ({
  plan: initialPlan,
  userEmail,
  language
}) => {
  const [plan, setPlan] = useState<TrainingPlan>(initialPlan);
  const [activeTab, setActiveTab] = useState<"WORKOUTS" | "COACH" | "PROGRESS">("WORKOUTS");
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [selectedWeekIdx, setSelectedWeekIdx] = useState(0);
  const [currentProgramWeek, setCurrentProgramWeek] = useState(1);
  const [weekTransitionBanner, setWeekTransitionBanner] = useState<number | null>(null);
  const [workoutIdsForWeek, setWorkoutIdsForWeek] = useState<string[]>([]);

  // Date de début du programme — fixée une seule fois au premier déblocage, persistée
  // pour rester stable même après rechargement de la page.
  const [programStartDate] = useState<Date>(() => {
    const key = `fysiqforge_program_start_${userEmail}`;
    let stored = localStorage.getItem(key);
    if (!stored) {
      stored = new Date().toISOString();
      localStorage.setItem(key, stored);
    }
    return new Date(stored);
  });
  const totalProgramWeeks = plan.totalWeeks || 8;
  const programEndDate = new Date(programStartDate);
  programEndDate.setDate(programEndDate.getDate() + totalProgramWeeks * 7);
  const formatFrDate = (d: Date) =>
    d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  // Enregistre automatiquement le programme généré auprès du système de rappels —
  // UNE SEULE FOIS par utilisateur (pas à chaque rechargement de page).
  useEffect(() => {
    const registerKey = `fysiqforge_reminders_registered_${userEmail}`;
    if (!userEmail || localStorage.getItem(registerKey)) return;

    fetch("/api/reminders/register-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        weekSchedule: plan.weekSchedule,
        preferredTime: plan.userAnswers?.preferredWorkoutTime || "18:00",
        objective: plan.userAnswers?.objective || "Transformation physique"
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.workoutIds) {
          setWorkoutIdsForWeek(data.workoutIds);
          localStorage.setItem(registerKey, "1");
        }
      })
      .catch((e) => console.warn("Enregistrement des rappels impossible:", e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  const handleMarkWorkoutDoneFromNotif = useCallback((workoutId: string) => {
    fetch("/api/reminders/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, workoutId })
    }).catch(() => {});
  }, [userEmail]);

  const handleRescheduleWorkoutFromNotif = useCallback((workoutId: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    fetch("/api/reminders/reschedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, workoutId, newDateTimeISO: tomorrow.toISOString() })
    }).catch(() => {});
  }, [userEmail]);

  // Active Guided Workout Player state
  const [isGuidedWorkoutActive, setIsGuidedWorkoutActive] = useState(false);
  const [startExerciseIdx, setStartExerciseIdx] = useState(0);

  // Equipment Check modal state
  const [checkingEquipmentExercise, setCheckingEquipmentExercise] = useState<ExerciseItem | null>(null);

  // Modals
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showBilanModal, setShowBilanModal] = useState(false);

  // Completed workouts state
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([
    {
      id: "log-demo-1",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toLocaleDateString(language === "FR" ? "fr-FR" : "en-US"),
      dayNumber: 1,
      dayTitle: plan.weekSchedule[0]?.title || "Jour 1: Push Alpha",
      durationMinutes: 52,
      feelingRating: 5,
      notes: "Superbe congestion sur les pectoraux ! Sensation de puissance.",
      caloriesBurned: 440
    }
  ]);

  const t = UI_LABELS[language];
  const currentDay = plan.weekSchedule[activeDayIdx] || plan.weekSchedule[0];

  const handleStartGuidedWorkout = (exIdx = 0) => {
    setStartExerciseIdx(exIdx);
    setIsGuidedWorkoutActive(true);
  };

  const handleMarkDayComplete = () => {
    setShowBilanModal(true);
  };

  const handleSaveBilan = (newLog: WorkoutLog) => {
    setWorkoutLogs((prev) => [newLog, ...prev]);
    if (!completedDays.includes(currentDay.dayNumber)) {
      setCompletedDays((prev) => [...prev, currentDay.dayNumber]);
    }
    setShowBilanModal(false);

    // Informe le système de rappels que cette séance est bien faite — le rappel
    // et les notifications liées se referment automatiquement côté serveur.
    const workoutId = workoutIdsForWeek[activeDayIdx];
    if (workoutId && userEmail) {
      fetch("/api/reminders/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, workoutId })
      }).catch(() => {});
    }

    // Enchaînement automatique : après le bilan, on montre le conseil nutrition
    // avant de basculer vers le jour suivant — l'utilisateur n'a rien à cliquer.
    setShowNutritionModal(true);
  };

  // Appelée à la fermeture du conseil nutrition : bascule automatiquement vers le jour
  // suivant. Si on vient de terminer le dernier jour de la semaine, on revient au jour 1
  // en signalant clairement le passage à la semaine suivante du programme.
  const handleAdvanceToNextDayAfterNutrition = () => {
    setShowNutritionModal(false);
    const isLastDayOfWeek = activeDayIdx >= plan.weekSchedule.length - 1;

    if (isLastDayOfWeek) {
      const nextWeek = currentProgramWeek + 1;
      setCurrentProgramWeek(nextWeek);
      setActiveDayIdx(0);
      setWeekTransitionBanner(nextWeek);
      window.setTimeout(() => setWeekTransitionBanner(null), 5000);
    } else {
      setActiveDayIdx((prev) => prev + 1);
    }
  };

  // Replace exercise in plan schedule
  const handleReplaceExerciseInPlan = (originalExerciseId: string, newExercise: ExerciseItem) => {
    const updatedSchedule = plan.weekSchedule.map((day) => {
      const updatedExercises = day.exercises.map((ex) =>
        ex.id === originalExerciseId ? newExercise : ex
      );
      return { ...day, exercises: updatedExercises };
    });

    setPlan({
      ...plan,
      weekSchedule: updatedSchedule
    });
  };

  return (
    <div className="min-h-screen bg-[#0D0D11] text-white pb-16">
      <MedicalDisclaimerBanner />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Unlocked Program Title Bar */}
        <div className="bg-gradient-to-r from-[#16161E] via-[#1A1A24] to-[#0D0D11] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Espace Coaching Actif — Accès Débloqué</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black uppercase font-display text-white">
                {plan.programTitle}
              </h1>
              <p className="text-xs text-gray-400">
                Membre : <strong className="text-gray-200">{userEmail}</strong> · Formule {plan.tierName}
              </p>
            </div>

            <NotificationCenter
              userEmail={userEmail || ""}
              onMarkWorkoutDone={handleMarkWorkoutDoneFromNotif}
              onRescheduleWorkout={handleRescheduleWorkoutFromNotif}
            />
          </div>

          {/* Actions Bar — groupée et simplifiée */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => setShowNutritionModal(true)}
              className="bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Utensils className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.nutritionGuide}</span>
            </button>

            <button
              onClick={() => setShowFaqModal(true)}
              className="bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.faqSupport}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Imprimer le programme"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.printPlan}</span>
            </button>
          </div>
        </div>

        {/* Top Workout Music Player Sticky Ribbon */}
        <WorkoutAudioPlayer playlist={plan.playlist} />

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab("WORKOUTS")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "WORKOUTS"
                ? "bg-[#FF5500] text-white shadow-lg shadow-[#FF5500]/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>{t.todayWorkouts}</span>
          </button>

          <button
            onClick={() => setActiveTab("COACH")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "COACH"
                ? "bg-[#FF5500] text-white shadow-lg shadow-[#FF5500]/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>{t.aiCoach}</span>
          </button>

          <button
            onClick={() => setActiveTab("PROGRESS")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "PROGRESS"
                ? "bg-[#FF5500] text-white shadow-lg shadow-[#FF5500]/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t.progressTracker}</span>
          </button>
        </div>

        {/* TAB 1: WORKOUTS SCHEDULE */}
        {activeTab === "WORKOUTS" && (
          <div className="space-y-6">
            {/* Calendrier de suivi — début / fin du programme */}
            <div className="bg-[#15151C] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF5500]/15 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-[#FF5500]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Début du programme</p>
                  <p className="text-sm font-bold text-white">{formatFrDate(programStartDate)}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-white/10 hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Fin prévue</p>
                  <p className="text-sm font-bold text-white">{formatFrDate(programEndDate)}</p>
                </div>
              </div>
              <div className="ml-auto text-[11px] font-bold text-gray-400 bg-white/[0.06] px-3 py-1.5 rounded-full">
                Semaine {currentProgramWeek} / {totalProgramWeeks}
              </div>
            </div>

            {/* 8-Week Progressive Overload Phase Selector */}
            {plan.weeksProgression && plan.weeksProgression.length > 0 && (
              <div className="bg-[#16161E] border border-white/10 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#FF5500]" />
                    <span className="text-xs font-black uppercase text-white tracking-wider">
                      {t.periodizationTitle}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                    {plan.totalWeeks || 8} Semaines de Suivi Structuré
                  </span>
                </div>

                {/* Week Blocks Selector Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {plan.weeksProgression.map((wp, idx) => {
                    const isActive = selectedWeekIdx === idx;
                    return (
                      <button
                        key={wp.weekNumber}
                        onClick={() => setSelectedWeekIdx(idx)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#FF5500]/20 border-[#FF5500] text-white shadow-lg"
                            : "bg-[#121218] border-white/5 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-black">
                          <span className={isActive ? "text-[#FF5500]" : "text-gray-400"}>
                            BLOC {idx + 1}
                          </span>
                          <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded">
                            {wp.repsModifier}
                          </span>
                        </div>
                        <p className="font-extrabold text-xs mt-1 text-white truncate">{wp.title}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Active Week Phase Objective Details */}
                {plan.weeksProgression[selectedWeekIdx] && (
                  <div className="bg-[#121218] border border-[#FF5500]/30 rounded-2xl p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[#FF5500] font-bold">
                      <span>🎯 {t.currentObjective} : {plan.weeksProgression[selectedWeekIdx].title}</span>
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                        Cible : {plan.weeksProgression[selectedWeekIdx].repsModifier}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {plan.weeksProgression[selectedWeekIdx].focus}
                    </p>
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl font-medium">
                      💡 <strong>{t.coachAdvice} :</strong> {plan.weeksProgression[selectedWeekIdx].loadAdvice}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Days Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {plan.weekSchedule.map((day, idx) => {
                const isDone = completedDays.includes(day.dayNumber);
                return (
                  <button
                    key={day.dayNumber}
                    onClick={() => setActiveDayIdx(idx)}
                    className={`px-4 py-3 rounded-2xl border text-left shrink-0 transition-all cursor-pointer ${
                      activeDayIdx === idx
                        ? "bg-[#FF5500] text-white border-[#FF5500] shadow-xl"
                        : "bg-[#16161E] text-gray-300 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-black uppercase">{day.dayName}</span>
                      {isDone && <CheckCircle className="w-3.5 h-3.5 text-emerald-300 fill-current" />}
                    </div>
                    <p className="font-extrabold text-xs mt-1 max-w-[120px] truncate">{day.title}</p>
                  </button>
                );
              })}
            </div>

            {/* Current Day Header */}
            <div className="bg-[#16161E] border border-white/10 rounded-3xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs text-[#FF5500] font-black uppercase tracking-wider">
                    {currentDay.dayName} — Focus : {currentDay.focus}
                  </span>
                  <h2 className="text-2xl font-black uppercase text-white font-display">
                    {currentDay.title}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* MAIN GUIDED WORKOUT PLAYER CTA BUTTON */}
                  <button
                    onClick={() => handleStartGuidedWorkout(0)}
                    className="bg-gradient-to-r from-[#FF5500] to-[#FF2200] hover:scale-105 text-white font-black px-6 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-2xl shadow-[#FF5500]/30 cursor-pointer transition-all uppercase tracking-wider"
                  >
                    <Play className="w-4 h-4 fill-current animate-pulse" />
                    <span>{t.startWorkout}</span>
                  </button>

                  <button
                    onClick={handleMarkDayComplete}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-5 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{t.finishDay}</span>
                  </button>
                </div>
              </div>

              {/* Exercises Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {currentDay.exercises.map((ex, idx) => (
                  <div
                    key={ex.id || idx}
                    className="bg-[#121218] border border-white/10 hover:border-[#FF5500] rounded-2xl p-4 space-y-3 group transition-all"
                  >
                    <div
                      onClick={() => handleStartGuidedWorkout(idx)}
                      className="h-44 rounded-xl overflow-hidden relative cursor-pointer"
                    >
                      <img
                        src={ex.illustrationUrl}
                        alt={ex.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <span className="absolute top-2 left-2 bg-[#FF5500] text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                        {ex.sets} {t.sets} x {ex.reps}
                      </span>
                      
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <span className="bg-gradient-to-r from-[#FF5500] to-[#FF2200] text-white text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                          <Play className="w-3 h-3 fill-current" />
                          <span>Lancer la séance →</span>
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="font-extrabold text-sm text-white group-hover:text-[#FF5500] transition-colors">
                          {translateExerciseName(ex.name, language)}
                        </p>
                        <p className="text-xs text-emerald-400 font-semibold">
                          {translateMuscleGroup(ex.muscleGroup, language)}
                        </p>
                      </div>

                      {/* Equipment Check Interactive Trigger Bubble */}
                      <button
                        onClick={() => setCheckingEquipmentExercise(ex)}
                        className="w-full bg-[#FF5500]/15 hover:bg-[#FF5500]/25 border border-[#FF5500]/30 text-[#FF5500] text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{t.checkEquipment}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI COACH CHAT */}
        {activeTab === "COACH" && (
          <AiCoachChat userAnswers={plan.userAnswers} tierId={plan.tierId} />
        )}

        {/* TAB 3: PROGRESS TRACKER */}
        {activeTab === "PROGRESS" && (
          <ProgressTracker logs={workoutLogs} plan={plan} />
        )}
      </div>

      {/* FULL-SCREEN INTERACTIVE GUIDED WORKOUT PLAYER (REPLACES OLD STATIC MODAL) */}
      {isGuidedWorkoutActive && (
        <GuidedWorkoutPlayer
          workoutDay={currentDay}
          initialExerciseIdx={startExerciseIdx}
          language={language}
          onClose={() => setIsGuidedWorkoutActive(false)}
          onCheckEquipment={(exercise) => setCheckingEquipmentExercise(exercise)}
          onWorkoutCompleted={() => {
            if (!completedDays.includes(currentDay.dayNumber)) {
              setCompletedDays([...completedDays, currentDay.dayNumber]);
            }
            setShowBilanModal(true);
          }}
        />
      )}

      {/* Equipment Check Interactive Bubble Modal */}
      {checkingEquipmentExercise && (
        <EquipmentCheckModal
          exercise={checkingEquipmentExercise}
          onClose={() => setCheckingEquipmentExercise(null)}
          onReplaceExercise={handleReplaceExerciseInPlan}
        />
      )}

      {/* Post Workout Bilan Modal */}
      {showBilanModal && (
        <PostWorkoutBilanModal
          dayTitle={currentDay.title}
          dayNumber={currentDay.dayNumber}
          onSaveBilan={handleSaveBilan}
          onClose={() => setShowBilanModal(false)}
        />
      )}

      {/* FAQ & Support Modal */}
      {showFaqModal && (
        <FaqAndSupportModal onClose={() => setShowFaqModal(false)} />
      )}

      {/* Nutrition Guide Modal */}
      {showNutritionModal && (
        <NutritionGuideModal
          userAnswers={plan.userAnswers}
          onClose={handleAdvanceToNextDayAfterNutrition}
        />
      )}

      {/* Notification de changement de semaine — apparaît automatiquement en enchaînement */}
      {weekTransitionBanner !== null && (
        <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-[#1A1A24] to-[#0D0D11] border border-[#FF5500]/40 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl shadow-[#FF5500]/20 animate-in zoom-in-95 duration-300">
            <div className="text-5xl">🔥</div>
            <h2 className="text-2xl font-black uppercase text-white">
              Semaine {weekTransitionBanner} commence !
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Nouveau bloc de progression : intensité et exercices ajustés pour continuer à
              transformer ton physique. Tu avances, continue comme ça 💪
            </p>
            <button
              onClick={() => setWeekTransitionBanner(null)}
              className="w-full bg-[#FF5500] hover:bg-[#FF6A1F] text-white font-bold px-4 py-3 rounded-xl text-sm transition-colors cursor-pointer"
            >
              C'est parti
            </button>
          </div>
        </div>
      )}
    </div>
  );
};



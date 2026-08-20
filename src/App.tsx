import React, { useState, useEffect } from "react";
import { Step, UserAnswers, TrainingPlan, PlanTierId } from "./types";
import { Header } from "./components/Header";
import { LandingHero } from "./components/LandingHero";
import { PhotoUploadStep } from "./components/PhotoUploadStep";
import { QuestionnaireStep } from "./components/QuestionnaireStep";
import { AhaPreviewStep } from "./components/AhaPreviewStep";
import { PaywallModal } from "./components/PaywallModal";
import { FullPlanDashboard } from "./components/FullPlanDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { AiCoachChat } from "./components/AiCoachChat";
import { FaqAndSupportModal } from "./components/FaqAndSupportModal";
import { GeneratingPlanScreen } from "./components/GeneratingPlanScreen";
import { Language } from "./utils/translator";
import { generateTrainingPlanAsync } from "./data/mockPlanGenerator";
import { hydrateWeeklySchedules } from "./utils/weeklyScheduleHydrator";
import { Bot, X } from "lucide-react";

const PLAN_SESSION_VERSION = 4;
const SESSION_STORAGE_KEY = "fysiqforge_unlocked_session";

/** Never persist a base64/photo payload in localStorage: it can exceed browser quotas and
 * unnecessarily retain a sensitive image. The photo remains available only for the active flow. */
function getPersistablePlan(plan: TrainingPlan): TrainingPlan {
  const { photoUrl: _photoUrl, ...persistableAnswers } = plan.userAnswers || {};
  return { ...plan, userAnswers: persistableAnswers as UserAnswers };
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>("LANDING");
  const [selectedCurrency, setSelectedCurrency] = useState<"FCFA" | "USD" | "EUR">("FCFA");
  const [language, setLanguage] = useState<Language>("FR");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showCoachChatModal, setShowCoachChatModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({ objective: "Prise de masse (Hypertrophie)", targetZone: "Pectoraux & Triceps", frequency: "4 jours / sem", duration: "45-60 min", level: "Intermédiaire", musicStyle: "Afrobeats Gym Power", equipment: "Salle de sport équipée", constraints: "", healthConsent: true });
  const [generatedPlan, setGeneratedPlan] = useState<TrainingPlan | null>(null);
  const [generationFailed, setGenerationFailed] = useState(false);
  const [lastSubmittedAnswers, setLastSubmittedAnswers] = useState<UserAnswers | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      const firstWeek = Array.isArray(parsed?.plan?.weeklySchedules) ? parsed.plan.weeklySchedules[0] : parsed?.plan?.weekSchedule;
      const firstDay = Array.isArray(firstWeek) ? firstWeek[0] : null;
      const count = Array.isArray(firstDay?.exercises) ? firstDay.exercises.length : 0;
      if (parsed?.sessionVersion === PLAN_SESSION_VERSION && parsed?.plan && parsed?.email && count >= 20) {
        setGeneratedPlan(parsed.plan);
        setUserEmail(parsed.email);
        setIsUnlocked(true);
        localStorage.setItem("fysiqforge_plan_tier", String(parsed.plan.tierId || "performance"));
        setCurrentStep("FULL_PLAN");
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        localStorage.removeItem("fysiqforge_plan_tier");
      }
    } catch {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem("fysiqforge_plan_tier");
    }
  }, []);

  const handleStartFlow = () => setCurrentStep("PHOTO");
  const handlePhotoSelected = (photoUrl: string) => { setSelectedPhotoUrl(photoUrl); setUserAnswers((p) => ({ ...p, photoUrl })); setCurrentStep("QUESTIONNAIRE"); };

  const handleQuestionnaireSubmit = async (answers: UserAnswers) => {
    setUserAnswers(answers); setLastSubmittedAnswers(answers); setGenerationFailed(false); setCurrentStep("GENERATING");
    // If the AI service is unavailable, never present fabricated body-fat/symmetry numbers as
    // if they were measured from the user's photo. The plan can still be generated from the questionnaire.
    let analysisData: any = {
      morphologyType: "Analyse visuelle indisponible",
      estimatedBodyFat: "Non estimé",
      symmetryScore: 0,
      postureAnalysis: "L'analyse photo IA n'est pas disponible actuellement.",
      priorityZones: [answers.targetZone],
      recommendedFrequency: answers.frequency,
      coachSummary: "Programme généré à partir de tes réponses. Une analyse photo IA sera ajoutée lorsqu'elle sera disponible."
    };
    if (selectedPhotoUrl) {
      try {
        const controller = new AbortController(); const timer = window.setTimeout(() => controller.abort(), 20000);
        const res = await fetch("/api/ai/analyze-photo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ photoBase64: selectedPhotoUrl, questionnaire: answers }), signal: controller.signal });
        window.clearTimeout(timer);
        if (!res.ok) throw new Error(`Analyse photo HTTP ${res.status}`);
        const data = await res.json(); if (data.analysis) analysisData = data.analysis;
      } catch (e) { console.warn("Analyse photo indisponible:", e); }
    }
    try {
      const rawPlan = await generateTrainingPlanAsync("performance", answers, analysisData);
      const hydratedPlan = await hydrateWeeklySchedules(rawPlan, answers);
      setGeneratedPlan(hydratedPlan); setCurrentStep("AHA_PREVIEW");
    } catch (err) { console.error("Échec de génération:", err); setGenerationFailed(true); }
  };

  const handleRetryGeneration = () => lastSubmittedAnswers ? handleQuestionnaireSubmit(lastSubmittedAnswers) : setCurrentStep("QUESTIONNAIRE");
  const handleOpenPaywall = () => setCurrentStep("PAYWALL");

  const handlePaymentSuccess = (email: string, tierId: PlanTierId) => {
    setUserEmail(email); setIsUnlocked(true);
    localStorage.setItem("fysiqforge_plan_tier", tierId);
    if (generatedPlan) {
      const unlockedPlan: TrainingPlan = {
        ...generatedPlan,
        tierId,
        tierName: tierId === "essentiel" ? "Plan Essentiel" : tierId === "performance" ? "Plan Performance" : "Plan Élite / VIP",
        playlist: tierId === "essentiel" ? { ...generatedPlan.playlist, title: "Musique non incluse", tracks: [] } : generatedPlan.playlist,
        unlockedAt: new Date().toISOString()
      };
      setGeneratedPlan(unlockedPlan);
      try {
        const persistablePlan = getPersistablePlan(unlockedPlan);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ sessionVersion: PLAN_SESSION_VERSION, email, plan: persistablePlan, unlockedAt: Date.now() }));
      } catch (error) {
        console.warn("Session locale non persistée : quota de stockage atteint.", error);
      }
    }
    setCurrentStep("FULL_PLAN");
  };

  const canUsePremiumCoach = Boolean(isUnlocked && generatedPlan && generatedPlan.tierId !== "essentiel");

  return (
    <div className="min-h-screen bg-[#0D0D11] text-white font-sans antialiased selection:bg-[#FF5500] selection:text-white relative">
      <Header currentStep={currentStep} onNavigateStep={setCurrentStep} selectedCurrency={selectedCurrency} onCurrencyChange={setSelectedCurrency} language={language} onLanguageChange={setLanguage} userEmail={userEmail} onOpenAdmin={() => setShowAdminModal(true)} onOpenCoachChat={() => setShowCoachChatModal(true)} onOpenFaq={() => setShowFaqModal(true)} isUnlocked={isUnlocked} />
      <main>
        {currentStep === "LANDING" && <LandingHero onStartClick={handleStartFlow} language={language} />}
        {currentStep === "PHOTO" && <PhotoUploadStep onPhotoSelected={handlePhotoSelected} onBack={() => setCurrentStep("LANDING")} language={language} />}
        {currentStep === "QUESTIONNAIRE" && <QuestionnaireStep initialAnswers={userAnswers} onSubmitQuestionnaire={handleQuestionnaireSubmit} onBack={() => setCurrentStep("PHOTO")} language={language} />}
        {currentStep === "GENERATING" && <GeneratingPlanScreen hasError={generationFailed} onRetry={handleRetryGeneration} />}
        {currentStep === "AHA_PREVIEW" && generatedPlan && <AhaPreviewStep plan={generatedPlan} onUnlockClick={handleOpenPaywall} language={language} />}
        {currentStep === "PAYWALL" && <PaywallModal onPaymentSuccess={handlePaymentSuccess} onBack={() => setCurrentStep("AHA_PREVIEW")} selectedCurrency={selectedCurrency} />}
        {currentStep === "FULL_PLAN" && generatedPlan && <FullPlanDashboard plan={generatedPlan} userEmail={userEmail || "membre.fysiq@gmail.com"} language={language} />}
      </main>
      {canUsePremiumCoach && (
        <button onClick={() => setShowCoachChatModal(true)} className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#FF5500] to-[#FF2200] hover:scale-110 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-2.5 cursor-pointer border border-white/20" title="Coach IA 24/7"><Bot className="w-6 h-6"/><span className="font-black text-xs uppercase hidden sm:inline">{language === "FR" ? "Coach IA 24/7" : "24/7 AI Coach"}</span></button>
      )}
      {showCoachChatModal && <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"><div className="max-w-2xl w-full relative"><button onClick={() => setShowCoachChatModal(false)} className="absolute -top-12 right-0 bg-white/10 text-white p-2 rounded-xl"><X className="w-5 h-5"/></button><AiCoachChat userAnswers={userAnswers} tierId={generatedPlan?.tierId || "performance"}/></div></div>}
      {showAdminModal && <AdminDashboard onClose={() => setShowAdminModal(false)} />}
      {showFaqModal && <FaqAndSupportModal onClose={() => setShowFaqModal(false)} />}
    </div>
  );
}

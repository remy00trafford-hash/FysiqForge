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
import { generateTrainingPlan, generateTrainingPlanAsync } from "./data/mockPlanGenerator";
import { Bot, X } from "lucide-react";

const PLAN_SESSION_VERSION = 2;

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>("LANDING");
  const [selectedCurrency, setSelectedCurrency] = useState<"FCFA" | "USD" | "EUR">("FCFA");
  const [language, setLanguage] = useState<Language>("FR");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showCoachChatModal, setShowCoachChatModal] = useState<boolean>(false);
  const [showFaqModal, setShowFaqModal] = useState<boolean>(false);

  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({
    objective: "Prise de masse (Hypertrophie)",
    targetZone: "Pectoraux & Triceps",
    frequency: "4 jours / sem",
    duration: "45-60 min",
    level: "Intermédiaire",
    musicStyle: "Afrobeats Gym Power",
    equipment: "Salle de sport équipée",
    constraints: "",
    healthConsent: true
  });

  const [generatedPlan, setGeneratedPlan] = useState<TrainingPlan | null>(null);
  const [generationFailed, setGenerationFailed] = useState(false);
  const [lastSubmittedAnswers, setLastSubmittedAnswers] = useState<UserAnswers | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("fysiqforge_unlocked_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        const firstWeek = Array.isArray(parsed?.plan?.weeklySchedules)
          ? parsed.plan.weeklySchedules[0]
          : parsed?.plan?.weekSchedule;
        const firstDay = Array.isArray(firstWeek) ? firstWeek[0] : null;
        const exerciseCount = Array.isArray(firstDay?.exercises) ? firstDay.exercises.length : 0;
        const isCurrentSchema = parsed?.sessionVersion === PLAN_SESSION_VERSION;

        if (isCurrentSchema && parsed?.plan && parsed?.email && exerciseCount >= 20) {
          setGeneratedPlan(parsed.plan);
          setUserEmail(parsed.email);
          setIsUnlocked(true);
          setCurrentStep("FULL_PLAN");
        } else {
          localStorage.removeItem("fysiqforge_unlocked_session");
        }
      }
    } catch (e) {
      localStorage.removeItem("fysiqforge_unlocked_session");
      console.warn("Impossible de restaurer la session précédente:", e);
    }
  }, []);

  const handleStartFlow = () => setCurrentStep("PHOTO");

  const handlePhotoSelected = (photoUrl: string) => {
    setSelectedPhotoUrl(photoUrl);
    setUserAnswers((prev) => ({ ...prev, photoUrl }));
    setCurrentStep("QUESTIONNAIRE");
  };

  const handleQuestionnaireSubmit = async (answers: UserAnswers) => {
    setUserAnswers(answers);
    setLastSubmittedAnswers(answers);
    setGenerationFailed(false);
    setCurrentStep("GENERATING");

    const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs: number) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      try {
        return await fetch(url, { ...options, signal: controller.signal });
      } finally {
        clearTimeout(timeoutId);
      }
    };

    let analysisData = {
      morphologyType: "Athlétique / Mesomorphe Ciblé",
      estimatedBodyFat: "14-16%",
      symmetryScore: 88,
      postureAnalysis: "Structure vertébrale stable. Engagement conseillé sur la zone supérieure de la cage thoracique.",
      priorityZones: [answers.targetZone, "Largeur de Dos", "Core / Sangle Abdominale"],
      recommendedFrequency: answers.frequency,
      coachSummary: `Analyse visuelle complétée avec succès. Potentiel élevé pour développer une silhouette athlétique en surcharge progressive sur ${answers.targetZone}.`
    };

    if (selectedPhotoUrl) {
      try {
        const res = await fetchWithTimeout("/api/ai/analyze-photo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photoBase64: selectedPhotoUrl, questionnaire: answers })
        }, 20000);
        const data = await res.json();
        if (data.analysis) analysisData = data.analysis;
      } catch (err) {
        console.warn("Analyse photo indisponible, on continue avec les valeurs par défaut:", err);
      }
    }

    try {
      const newPlan = await generateTrainingPlanAsync("performance", answers, analysisData);
      setGeneratedPlan(newPlan);
      setCurrentStep("AHA_PREVIEW");
    } catch (err) {
      console.error("Échec de la génération du plan:", err);
      setGenerationFailed(true);
    }
  };

  const handleRetryGeneration = () => {
    if (lastSubmittedAnswers) handleQuestionnaireSubmit(lastSubmittedAnswers);
    else setCurrentStep("QUESTIONNAIRE");
  };

  const handleOpenPaywall = () => setCurrentStep("PAYWALL");

  const handlePaymentSuccess = (email: string, tierId: PlanTierId, transaction: any) => {
    setUserEmail(email);
    setIsUnlocked(true);

    if (generatedPlan) {
      const unlockedPlan: TrainingPlan = {
        ...generatedPlan,
        tierId,
        tierName: tierId === "essentiel" ? "Plan Essentiel" : tierId === "performance" ? "Plan Performance" : "Plan Élite / VIP",
        // Music is an entitlement: Essential gets an explicit empty playlist so the UI
        // cannot silently fall back to a public/default track.
        playlist: tierId === "essentiel"
          ? { ...generatedPlan.playlist, title: "Musique non incluse", tracks: [] }
          : generatedPlan.playlist,
        unlockedAt: new Date().toLocaleTimeString()
      };
      setGeneratedPlan(unlockedPlan);

      try {
        localStorage.setItem(
          "fysiqforge_unlocked_session",
          JSON.stringify({ sessionVersion: PLAN_SESSION_VERSION, email, plan: unlockedPlan, unlockedAt: Date.now() })
        );
      } catch (e) {
        console.warn("Impossible de sauvegarder la session localement:", e);
      }
    }

    setCurrentStep("FULL_PLAN");
  };

  return (
    <div className="min-h-screen bg-[#0D0D11] text-white font-sans antialiased selection:bg-[#FF5500] selection:text-white relative">
      <Header
        currentStep={currentStep}
        onNavigateStep={setCurrentStep}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
        language={language}
        onLanguageChange={setLanguage}
        userEmail={userEmail}
        onOpenAdmin={() => setShowAdminModal(true)}
        onOpenCoachChat={() => setShowCoachChatModal(true)}
        onOpenFaq={() => setShowFaqModal(true)}
        isUnlocked={isUnlocked}
      />

      <main>
        {currentStep === "LANDING" && <LandingHero onStartClick={handleStartFlow} language={language} />}
        {currentStep === "PHOTO" && <PhotoUploadStep onPhotoSelected={handlePhotoSelected} onBack={() => setCurrentStep("LANDING")} language={language} />}
        {currentStep === "QUESTIONNAIRE" && <QuestionnaireStep initialAnswers={userAnswers} onSubmitQuestionnaire={handleQuestionnaireSubmit} onBack={() => setCurrentStep("PHOTO")} language={language} />}
        {currentStep === "GENERATING" && <GeneratingPlanScreen hasError={generationFailed} onRetry={handleRetryGeneration} />}
        {currentStep === "AHA_PREVIEW" && generatedPlan && <AhaPreviewStep plan={generatedPlan} onUnlockClick={handleOpenPaywall} language={language} />}
        {currentStep === "PAYWALL" && <PaywallModal onPaymentSuccess={handlePaymentSuccess} onBack={() => setCurrentStep("AHA_PREVIEW")} selectedCurrency={selectedCurrency} />}
        {currentStep === "FULL_PLAN" && generatedPlan && <FullPlanDashboard plan={generatedPlan} userEmail={userEmail || "membre.fysiq@gmail.com"} language={language} />}
      </main>

      <button
        onClick={() => setShowCoachChatModal(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#FF5500] to-[#FF2200] hover:scale-110 text-white p-4 rounded-2xl shadow-2xl shadow-[#FF5500]/40 flex items-center gap-2.5 cursor-pointer transition-all border border-white/20 group"
        title="Ouvrir le Chat avec le Coach IA FysiqForge"
      >
        <div className="relative">
          <Bot className="w-6 h-6 animate-bounce" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0D0D11] animate-ping" />
        </div>
        <span className="font-black text-xs uppercase tracking-wider hidden sm:inline">{language === "FR" ? "Coach IA 24/7" : "24/7 AI Coach"}</span>
      </button>

      {showCoachChatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full relative animate-in fade-in zoom-in-95 my-auto">
            <button onClick={() => setShowCoachChatModal(false)} className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <AiCoachChat userAnswers={userAnswers} tierId={generatedPlan?.tierId || "performance"} />
          </div>
        </div>
      )}

      {showAdminModal && <AdminDashboard onClose={() => setShowAdminModal(false)} />}
      {showFaqModal && <FaqAndSupportModal onClose={() => setShowFaqModal(false)} />}
    </div>
  );
}

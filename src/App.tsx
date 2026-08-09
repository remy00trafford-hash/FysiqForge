import React, { useState } from "react";
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
import { Language } from "./utils/translator";
import { generateTrainingPlan, generateTrainingPlanAsync } from "./data/mockPlanGenerator";
import { Bot, X } from "lucide-react";

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>("LANDING");
  const [selectedCurrency, setSelectedCurrency] = useState<"FCFA" | "USD" | "EUR">("FCFA");
  const [language, setLanguage] = useState<Language>("FR");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showCoachChatModal, setShowCoachChatModal] = useState<boolean>(false);

  // User State Data
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

  // Current Generated Training Plan
  const [generatedPlan, setGeneratedPlan] = useState<TrainingPlan | null>(null);

  // Step 1 -> Step 2 (Photo)
  const handleStartFlow = () => {
    setCurrentStep("PHOTO");
  };

  // Step 2 (Photo) -> Step 3 (Questionnaire)
  const handlePhotoSelected = (photoUrl: string) => {
    setSelectedPhotoUrl(photoUrl);
    setUserAnswers((prev) => ({ ...prev, photoUrl }));
    setCurrentStep("QUESTIONNAIRE");
  };

  // Step 3 (Questionnaire) -> Step 4 (Aha Preview)
  const handleQuestionnaireSubmit = async (answers: UserAnswers) => {
    setUserAnswers(answers);

    // Trigger AI photo analysis API call
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
        const res = await fetch("/api/ai/analyze-photo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            photoBase64: selectedPhotoUrl,
            questionnaire: answers
          })
        });
        const data = await res.json();
        if (data.analysis) {
          analysisData = data.analysis;
        }
      } catch (err) {
        console.error("AI photo scan error:", err);
      }
    }

    const newPlan = await generateTrainingPlanAsync("performance", answers, analysisData);
    setGeneratedPlan(newPlan);
    setCurrentStep("AHA_PREVIEW");
  };

  // Step 4 (Aha Preview) -> Step 5 (Paywall)
  const handleOpenPaywall = () => {
    setCurrentStep("PAYWALL");
  };

  // Step 5 (Paywall Payment Success) -> Step 6 (Full Plan Portal)
  const handlePaymentSuccess = (email: string, tierId: PlanTierId, transaction: any) => {
    setUserEmail(email);
    setIsUnlocked(true);

    if (generatedPlan) {
      setGeneratedPlan({
        ...generatedPlan,
        tierId,
        unlockedAt: new Date().toLocaleTimeString()
      });
    }

    setCurrentStep("FULL_PLAN");
  };

  return (
    <div className="min-h-screen bg-[#0D0D11] text-white font-sans antialiased selection:bg-[#FF5500] selection:text-white relative">
      {/* Universal Header */}
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
        isUnlocked={isUnlocked}
      />

      {/* Main Content Router */}
      <main>
        {currentStep === "LANDING" && (
          <LandingHero
            onStartClick={handleStartFlow}
            language={language}
          />
        )}

        {currentStep === "PHOTO" && (
          <PhotoUploadStep
            onPhotoSelected={handlePhotoSelected}
            onBack={() => setCurrentStep("LANDING")}
            language={language}
          />
        )}

        {currentStep === "QUESTIONNAIRE" && (
          <QuestionnaireStep
            initialAnswers={userAnswers}
            onSubmitQuestionnaire={handleQuestionnaireSubmit}
            onBack={() => setCurrentStep("PHOTO")}
            language={language}
          />
        )}

        {currentStep === "AHA_PREVIEW" && generatedPlan && (
          <AhaPreviewStep
            plan={generatedPlan}
            onUnlockClick={handleOpenPaywall}
            language={language}
          />
        )}

        {currentStep === "PAYWALL" && (
          <PaywallModal
            onPaymentSuccess={handlePaymentSuccess}
            onBack={() => setCurrentStep("AHA_PREVIEW")}
            selectedCurrency={selectedCurrency}
          />
        )}

        {currentStep === "FULL_PLAN" && generatedPlan && (
          <FullPlanDashboard
            plan={generatedPlan}
            userEmail={userEmail || "membre.fysiq@gmail.com"}
            language={language}
          />
        )}
      </main>

      {/* PERSISTENT FLOATING ACTION BUTTON (FAB) FOR COACH IA CHAT */}
      <button
        onClick={() => setShowCoachChatModal(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#FF5500] to-[#FF2200] hover:scale-110 text-white p-4 rounded-2xl shadow-2xl shadow-[#FF5500]/40 flex items-center gap-2.5 cursor-pointer transition-all border border-white/20 group"
        title="Ouvrir le Chat avec le Coach IA FysiqForge"
      >
        <div className="relative">
          <Bot className="w-6 h-6 animate-bounce" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0D0D11] animate-ping" />
        </div>
        <span className="font-black text-xs uppercase tracking-wider hidden sm:inline">
          {language === "FR" ? "Coach IA 24/7" : "24/7 AI Coach"}
        </span>
      </button>

      {/* GLOBAL PERSISTENT COACH IA CHAT DRAWER / MODAL */}
      {showCoachChatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full relative animate-in fade-in zoom-in-95 my-auto">
            <button
              onClick={() => setShowCoachChatModal(false)}
              className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <AiCoachChat
              userAnswers={userAnswers}
              tierId={generatedPlan?.tierId || "performance"}
            />
          </div>
        </div>
      )}

      {/* Admin Dashboard Overlay Modal */}
      {showAdminModal && (
        <AdminDashboard onClose={() => setShowAdminModal(false)} />
      )}
    </div>
  );
}

import React, { useState } from "react";
import { Dumbbell, Sparkles, User, Lock, Award, Bot, ChevronDown, Settings, Menu, X, Globe, Coins } from "lucide-react";
import { Step } from "../types";
import { Language } from "../utils/translator";

interface HeaderProps {
  currentStep: Step;
  onNavigateStep: (step: Step) => void;
  selectedCurrency: "FCFA" | "USD" | "EUR";
  onCurrencyChange: (curr: "FCFA" | "USD" | "EUR") => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  userEmail: string | null;
  onOpenAdmin: () => void;
  onOpenCoachChat: () => void;
  onOpenFaq: () => void;
  isUnlocked: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onNavigateStep,
  selectedCurrency,
  onCurrencyChange,
  language,
  onLanguageChange,
  userEmail,
  onOpenAdmin,
  onOpenCoachChat,
  onOpenFaq,
  isUnlocked
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0D0D11]/95 backdrop-blur-md border-b border-white/10 px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigateStep("LANDING")}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF5500] to-[#FF2200] flex items-center justify-center shadow-lg shadow-[#FF5500]/20 group-hover:scale-105 transition-transform">
            <Dumbbell className="w-5 h-5 text-white transform -rotate-12" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-wider text-white uppercase font-display">
                FYSIQ<span className="text-[#FF5500]">FORGE</span>
              </span>
              <span className="bg-[#FF5500]/20 text-[#FF5500] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border border-[#FF5500]/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-gray-400 hidden sm:block">
              {language === "FR" ? "Coaching Musculation & Analyse Photo IA" : "AI Bodybuilding & Photo Analysis"}
            </p>
          </div>
        </button>

        {/* Step Progression Bar (Middle) */}
        <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs">
          <span
            className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
              currentStep === "LANDING"
                ? "bg-[#FF5500] text-white"
                : "text-gray-400 hover:text-white cursor-pointer"
            }`}
            onClick={() => onNavigateStep("LANDING")}
          >
            {language === "FR" ? "1. Accueil" : "1. Home"}
          </span>
          <span className="text-gray-600">→</span>
          <span
            className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
              currentStep === "PHOTO" || currentStep === "QUESTIONNAIRE"
                ? "bg-[#FF5500] text-white"
                : "text-gray-400"
            }`}
          >
            {language === "FR" ? "2. Photo & Quiz" : "2. Photo & Quiz"}
          </span>
          <span className="text-gray-600">→</span>
          <span
            className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
              currentStep === "AHA_PREVIEW"
                ? "bg-[#FF5500] text-white"
                : "text-gray-400"
            }`}
          >
            {language === "FR" ? "3. Aperçu Plan" : "3. Preview"}
          </span>
          <span className="text-gray-600">→</span>
          <span
            className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
              currentStep === "FULL_PLAN"
                ? "bg-emerald-500 text-white font-bold"
                : "text-gray-400"
            }`}
          >
            {language === "FR" ? "4. Espace Coaching" : "4. Coaching"} {isUnlocked && "✓"}
          </span>
        </div>

        {/* Right Section: Vertical Stacked Control Bar */}
        <div className="relative flex items-center gap-2">
          {/* Main Action Buttons Row */}
          <div className="flex items-center gap-2">
            {/* Compte connecté — toujours visible dans la barre principale une fois payé,
                plus caché dans le menu "Options" comme avant. Icône Google pour un rendu soigné. */}
            {isUnlocked && (
              <button
                onClick={() => onNavigateStep("FULL_PLAN")}
                className="hidden sm:flex items-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                title={userEmail || "Compte connecté"}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span className="max-w-[110px] truncate">{userEmail || "Connecté"}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              </button>
            )}

            {/* FAQ & Support — toujours visible, sur tous les écrans, même avant tout paiement */}
            <button
              onClick={onOpenFaq}
              className="hidden sm:flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              title={language === "FR" ? "Foire Aux Questions & Support" : "FAQ & Support"}
            >
              <span className="text-sm">❓</span>
              <span>FAQ</span>
            </button>

            {/* AI Coach Button */}
            <button
              onClick={onOpenCoachChat}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#FF5500] to-[#FF2200] text-white font-black px-3 py-1.5 rounded-lg text-xs shadow-lg shadow-[#FF5500]/20 hover:scale-105 transition-all cursor-pointer"
              title="Ouvrir le Chat avec le Coach IA FysiqForge"
            >
              <Bot className="w-4 h-4 animate-bounce" />
              <span>Coach IA</span>
            </button>

            {/* Menu Toggle for Vertical Controls Panel */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4 text-[#FF5500]" />
              <span className="hidden sm:inline">Options</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* VERTICAL CONTROLS DROPDOWN PANEL */}
          {isMenuOpen && (
            <div className="absolute right-0 top-12 w-64 bg-[#14141B] border border-white/15 rounded-2xl p-4 shadow-2xl z-50 flex flex-col gap-4 animate-fade-slide text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-gray-300 font-bold uppercase tracking-wider text-[11px]">
                <span>Paramètres & Préférences</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-md transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* 1. Langue (Vertical Stack) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-gray-400 font-medium">
                  <Globe className="w-3.5 h-3.5 text-[#FF5500]" />
                  <span>Langue / Language :</span>
                </div>
                <div className="flex flex-col gap-1">
                  {(["FR", "EN"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        onLanguageChange(lang);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center justify-between transition-all cursor-pointer ${
                        language === lang
                          ? "bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/20"
                          : "bg-white/5 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      <span>{lang === "FR" ? "Français (FR)" : "English (EN)"}</span>
                      {language === lang && <span className="text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Devise / Currency (Vertical Stack) */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-gray-400 font-medium">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>Devise / Currency :</span>
                </div>
                <div className="flex flex-col gap-1">
                  {(
                    [
                      { id: "FCFA", label: "FCFA (XAF/XOF) — Afrique" },
                      { id: "USD", label: "USD ($) — International" },
                      { id: "EUR", label: "EUR (€) — Europe" }
                    ] as const
                  ).map((curr) => (
                    <button
                      key={curr.id}
                      onClick={() => {
                        onCurrencyChange(curr.id);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center justify-between transition-all cursor-pointer ${
                        selectedCurrency === curr.id
                          ? "bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/20"
                          : "bg-white/5 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      <span>{curr.label}</span>
                      {selectedCurrency === curr.id && <span className="text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Account / Status (Vertical Stack) */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                {isUnlocked ? (
                  <button
                    onClick={() => {
                      onNavigateStep("FULL_PLAN");
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-2 rounded-xl font-bold hover:bg-emerald-500/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span>{language === "FR" ? "Mon Plan Débloqué" : "My Unlocked Plan"}</span>
                    </div>
                    <span>→</span>
                  </button>
                ) : userEmail ? (
                  <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                    <User className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span className="truncate">{userEmail}</span>
                  </div>
                ) : null}

                {/* FAQ & Support — visible ici aussi pour les écrans mobiles (bouton principal caché en dessous de sm:) */}
                <button
                  onClick={() => {
                    onOpenFaq();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 px-3 py-2 rounded-xl font-bold transition-all cursor-pointer sm:hidden"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">❓</span>
                    <span>{language === "FR" ? "FAQ & Support" : "FAQ & Support"}</span>
                  </div>
                </button>

                {/* Admin Access Button */}
                <button
                  onClick={() => {
                    onOpenAdmin();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 px-3 py-2 rounded-xl font-bold transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-yellow-500" />
                    <span>Dashboard Admin</span>
                  </div>
                  <span className="text-gray-500 text-[10px]">Paiements</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


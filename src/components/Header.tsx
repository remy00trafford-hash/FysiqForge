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


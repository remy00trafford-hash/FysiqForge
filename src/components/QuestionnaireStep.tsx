import React, { useState } from "react";
import { UserAnswers } from "../types";
import { Target, Dumbbell, Calendar, Clock, Music, ShieldCheck, Heart, ArrowRight } from "lucide-react";
import { Language } from "../utils/translator";

interface QuestionnaireStepProps {
  initialAnswers: UserAnswers;
  onSubmitQuestionnaire: (answers: UserAnswers) => void;
  onBack: () => void;
  language: Language;
}

export const QuestionnaireStep: React.FC<QuestionnaireStepProps> = ({
  initialAnswers,
  onSubmitQuestionnaire,
  onBack,
  language
}) => {
  const isFr = language === "FR";
  const [answers, setAnswers] = useState<UserAnswers>(initialAnswers);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answers.healthConsent) {
      alert("Veuillez valider l'engagement de santé de bon sens avant de continuer.");
      return;
    }
    onSubmitQuestionnaire(answers);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-[#FF5500]/10 border border-[#FF5500]/30 px-3 py-1 rounded-full text-xs font-semibold text-[#FF5500]">
          <Target className="w-4 h-4" />
          <span>{isFr ? "Étape 3 / 5 — Profil & Préférences d'Entraînement" : "Step 3 / 5 — Profile & Training Preferences"}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black uppercase font-display">
          {isFr ? "Personnalise Tes Paramètres de Séance" : "Customize Your Workout Preferences"}
        </h2>
        <p className="text-gray-400 text-sm sm:text-base">
          {isFr
            ? "Ces réponses permettent à l'IA d'ajuster le volume, le tempo et le style de tes séances."
            : "These answers allow the AI to optimize workout volume, tempo, and exercise selection."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#16161E] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
        {/* 1. Objectif Principal */}
        <div className="space-y-3">
          <label className="block text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <Target className="w-4 h-4 text-[#FF5500]" /> 1. Quel est ton objectif prioritaire ?
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Prise de masse (Hypertrophie)",
              "Perte de gras (Sèche)",
              "Tonification & Définition",
              "Force & Athlétisme"
            ].map((obj) => (
              <button
                type="button"
                key={obj}
                onClick={() => setAnswers({ ...answers, objective: obj as any })}
                className={`p-4 rounded-xl text-left border text-sm font-bold transition-all cursor-pointer ${
                  answers.objective === obj
                    ? "bg-[#FF5500] text-white border-[#FF5500] shadow-lg shadow-[#FF5500]/20"
                    : "bg-[#121218] text-gray-300 border-white/10 hover:border-white/30"
                }`}
              >
                {obj}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Zone Ciblée */}
        <div className="space-y-3">
          <label className="block text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-[#FF5500]" /> 2. Zone musculaire prioritaire à développer ?
          </label>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              "Tout le corps",
              "Pectoraux & Triceps",
              "Epaules & Dos",
              "Bras (Biceps/Triceps)",
              "Abdominaux & Core",
              "Jambes & Fessiers"
            ].map((zone) => (
              <button
                type="button"
                key={zone}
                onClick={() => setAnswers({ ...answers, targetZone: zone as any })}
                className={`p-3 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                  answers.targetZone === zone
                    ? "bg-[#FF5500] text-white border-[#FF5500]"
                    : "bg-[#121218] text-gray-300 border-white/10 hover:border-white/30"
                }`}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Disponibilité (Fréquence & Durée) */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#FF5500]" /> Fréquence par semaine
            </label>
            <select
              value={answers.frequency}
              onChange={(e) => setAnswers({ ...answers, frequency: e.target.value as any })}
              className="w-full bg-[#121218] border border-white/15 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-[#FF5500]"
            >
              <option value="2 jours / sem">2 jours / semaine (Maintenance)</option>
              <option value="3 jours / sem">3 jours / semaine (Full Body / Upper-Lower)</option>
              <option value="4 jours / sem">4 jours / semaine (Split Musculation Ideal)</option>
              <option value="5 jours / sem">5 jours / semaine (Push-Pull-Legs)</option>
              <option value="6 jours / sem">6 jours / semaine (Intensité Pro)</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF5500]" /> Temps par séance
            </label>
            <select
              value={answers.duration}
              onChange={(e) => setAnswers({ ...answers, duration: e.target.value as any })}
              className="w-full bg-[#121218] border border-white/15 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-[#FF5500]"
            >
              <option value="30-45 min">30 à 45 minutes (Express)</option>
              <option value="45-60 min">45 à 60 minutes (Standard)</option>
              <option value="60-90 min">60 à 90 minutes (Séance Complète)</option>
            </select>
          </div>
        </div>

        {/* 4. Matériel & Niveau */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-sm font-bold uppercase tracking-wider text-gray-300">
              Lieu / Matériel disponible
            </label>
            <select
              value={answers.equipment}
              onChange={(e) => setAnswers({ ...answers, equipment: e.target.value as any })}
              className="w-full bg-[#121218] border border-white/15 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-[#FF5500]"
            >
              <option value="Salle de sport équipée">Salle de sport équipée (Barres, Poulies, Machines)</option>
              <option value="Haltères + Banc maison">Maison : Haltères & Banc</option>
              <option value="Poids du corps (Sans matériel)">Maison : Poids du corps uniquement</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold uppercase tracking-wider text-gray-300">
              Style de Musique de Séance
            </label>
            <select
              value={answers.musicStyle}
              onChange={(e) => setAnswers({ ...answers, musicStyle: e.target.value as any })}
              className="w-full bg-[#121218] border border-white/15 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-[#FF5500]"
            >
              <option value="Afrobeats Gym Power">🎵 Afrobeats Gym Power (Burna, Rema, Asake)</option>
              <option value="Hip-Hop Trap Workout">🔥 Hip-Hop Trap Workout (Bass Heavy)</option>
              <option value="Synthwave Pump">⚡ Synthwave Pump (Cyber Neon Focus)</option>
              <option value="Metal / Rock Heavy">🎸 Heavy Metal & Hardcore Iron</option>
              <option value="Electro EDM Focus">🎧 Electro EDM & House Beat</option>
            </select>
          </div>
        </div>

        {/* 5. Health Consent & Disclaimer (IMPORTANT PRECAUTION) */}
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-amber-200">
              <p className="font-bold uppercase tracking-wide text-amber-300">
                Engagement de Bonne Santé & Sécurité
              </p>
              <p>
                Avant de débuter tout entraînement physique, assurez-vous de ne pas avoir de contre-indication médicale.
                En cas de douleur inhabituelle ou de problème de santé, stoppez l'exercice et consultez un médecin.
              </p>
            </div>
          </div>
          <label className="flex items-center gap-3 pt-2 text-xs font-semibold text-white cursor-pointer">
            <input
              type="checkbox"
              checked={answers.healthConsent}
              onChange={(e) => setAnswers({ ...answers, healthConsent: e.target.checked })}
              className="w-4 h-4 rounded text-[#FF5500] focus:ring-[#FF5500] bg-black border-white/30"
            />
            <span>Je confirme être en bonne santé physique et prêt(e) à commencer.</span>
          </label>
        </div>

        {/* Submit CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
          >
            ← Retour à l'étape photo
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto bg-gradient-to-r from-[#FF5500] to-[#FF3E00] hover:from-[#FF6611] hover:to-[#FF4411] text-white font-extrabold px-8 py-4 rounded-xl text-base shadow-xl shadow-[#FF5500]/30 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>GÉNÉRER L'APERÇU MON PLAN (GRATUIT)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

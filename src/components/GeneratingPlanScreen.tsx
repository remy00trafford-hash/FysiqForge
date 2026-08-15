import React, { useEffect, useState } from "react";

interface GeneratingPlanScreenProps {
  hasError: boolean;
  onRetry: () => void;
}

const STEPS_MESSAGES = [
  "Analyse de ton profil...",
  "Lecture de ta morphologie...",
  "Sélection des meilleurs exercices...",
  "Construction de ta progression sur 8 semaines...",
  "Finalisation de ton plan..."
];

export const GeneratingPlanScreen: React.FC<GeneratingPlanScreenProps> = ({ hasError, onRetry }) => {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    if (hasError) return;
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1 < STEPS_MESSAGES.length ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [hasError]);

  if (hasError) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center gap-5">
        <div className="text-5xl">⚠️</div>
        <h2 className="text-xl font-black uppercase text-white">La génération a pris trop de temps</h2>
        <p className="text-sm text-gray-400 max-w-sm">
          Ça arrive parfois quand le serveur se réveille après une pause. Réessaie, ça ne prendra
          que quelques secondes cette fois.
        </p>
        <button
          onClick={onRetry}
          className="bg-gradient-to-r from-[#FF5500] to-[#FF3E00] text-white font-extrabold px-8 py-4 rounded-xl text-base shadow-xl shadow-[#FF5500]/30 hover:scale-105 transition-all cursor-pointer"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center gap-6">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-white/10" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FF5500] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-3xl">🔥</div>
      </div>
      <h2 className="text-xl font-black uppercase text-white">On forge ton plan</h2>
      <p className="text-sm text-gray-400 min-h-[20px] transition-all">{STEPS_MESSAGES[msgIdx]}</p>
      <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#FF5500] to-[#FF8A00] rounded-full transition-all duration-700"
          style={{ width: `${((msgIdx + 1) / STEPS_MESSAGES.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

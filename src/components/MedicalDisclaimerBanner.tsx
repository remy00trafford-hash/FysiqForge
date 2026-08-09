import React, { useState } from "react";
import { ShieldAlert, X, HeartPulse } from "lucide-react";

export const MedicalDisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-950/40 border-b border-amber-500/30 text-amber-200 px-4 py-2 text-xs flex items-center justify-between gap-3">
      <div className="max-w-7xl mx-auto flex items-center gap-2.5">
        <HeartPulse className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
        <p className="leading-snug">
          <strong className="text-amber-300 font-semibold uppercase tracking-wide mr-1.5">
            Avertissement Santé & Précaution
          </strong>
          Consultez un professionnel de santé avant de démarrer un programme d'entraînement intense.
          Le Coach IA FysiqForge fournit des conseils d'entraînement et de forme physiques mais ne remplace pas un avis médical.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-400 hover:text-white p-1 rounded transition-colors"
        aria-label="Fermer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

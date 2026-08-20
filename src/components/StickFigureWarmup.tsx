import React from "react";

// Illustration vectorielle animée pour guider visuellement chaque mouvement
d'echauffement sans dépendre d'une ressource externe.

type WarmupMove = "shoulders" | "jacks" | "chest";

interface StickFigureWarmupProps {
  move: WarmupMove;
}

const STROKE = "#FF8A3D";
const STROKE_BG = "#3A2418";

export const StickFigureWarmup: React.FC<StickFigureWarmupProps> = ({ move }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#1A120C]">
      <svg viewBox="0 0 240 260" className="w-56 h-56 sm:w-64 sm:h-64" fill="none" role="img" aria-label={move === "jacks" ? "Jumping jacks" : move === "chest" ? "Ouverture de cage thoracique" : "Rotations épaules et coudes"}>
        <line x1="28" y1="228" x2="212" y2="228" stroke={STROKE_BG} strokeWidth="4" strokeLinecap="round" />
        <circle cx="120" cy="42" r="18" stroke={STROKE} strokeWidth="6" />
        <line x1="120" y1="60" x2="120" y2="154" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />

        {move === "shoulders" && (
          <>
            <line x1="120" y1="154" x2="88" y2="226" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <line x1="120" y1="154" x2="152" y2="226" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <g>
              <line x1="120" y1="82" x2="72" y2="98" stroke={STROKE} strokeWidth="6" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" values="0 120 82; -45 120 82; 35 120 82; 0 120 82" dur="2.4s" repeatCount="indefinite" />
              </line>
              <line x1="120" y1="82" x2="168" y2="98" stroke={STROKE} strokeWidth="6" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" values="0 120 82; 45 120 82; -35 120 82; 0 120 82" dur="2.4s" repeatCount="indefinite" />
              </line>
            </g>
            <text x="120" y="248" textAnchor="middle" fill="#FFC58C" fontSize="11" fontWeight="800">ÉPAULES : CERCLES AVANT → ARRIÈRE</text>
          </>
        )}

        {move === "jacks" && (
          <>
            <g>
              <line x1="120" y1="154" x2="120" y2="226" stroke={STROKE} strokeWidth="6" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" values="0 120 154; -28 120 154; 0 120 154" dur="0.7s" repeatCount="indefinite" />
              </line>
              <line x1="120" y1="154" x2="120" y2="226" stroke={STROKE} strokeWidth="6" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" values="0 120 154; 28 120 154; 0 120 154" dur="0.7s" repeatCount="indefinite" />
              </line>
            </g>
            <g>
              <line x1="120" y1="82" x2="120" y2="42" stroke={STROKE} strokeWidth="6" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" values="20 120 82; -150 120 82; 20 120 82" dur="0.7s" repeatCount="indefinite" />
              </line>
              <line x1="120" y1="82" x2="120" y2="42" stroke={STROKE} strokeWidth="6" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" values="-20 120 82; 150 120 82; -20 120 82" dur="0.7s" repeatCount="indefinite" />
              </line>
            </g>
            <text x="120" y="248" textAnchor="middle" fill="#FFC58C" fontSize="11" fontWeight="800">JUMPING JACKS : OUVRE → FERME</text>
          </>
        )}

        {move === "chest" && (
          <>
            <line x1="120" y1="154" x2="88" y2="226" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <line x1="120" y1="154" x2="152" y2="226" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <g>
              <line x1="120" y1="88" x2="62" y2="112" stroke={STROKE} strokeWidth="7" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" values="-42 120 88; 12 120 88; -42 120 88" dur="1.8s" repeatCount="indefinite" />
              </line>
              <line x1="120" y1="88" x2="178" y2="112" stroke={STROKE} strokeWidth="7" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" values="42 120 88; -12 120 88; 42 120 88" dur="1.8s" repeatCount="indefinite" />
              </line>
              <circle cx="62" cy="112" r="5" fill={STROKE}>
                <animate attributeName="cx" values="62;88;62" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="cy" values="112;96;112" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="178" cy="112" r="5" fill={STROKE}>
                <animate attributeName="cx" values="178;152;178" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="cy" values="112;96;112" dur="1.8s" repeatCount="indefinite" />
              </circle>
            </g>
            <path d="M74 104 Q120 76 166 104" stroke="#FFC58C" strokeWidth="2" strokeDasharray="5 5" opacity="0.9">
              <animate attributeName="opacity" values="0.45;1;0.45" dur="1.8s" repeatCount="indefinite" />
            </path>
            <text x="120" y="248" textAnchor="middle" fill="#FFC58C" fontSize="11" fontWeight="800">POITRINE : OUVRE GRAND → RAMÈNE DEVANT</text>
          </>
        )}
      </svg>
    </div>
  );
};
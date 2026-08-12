import React from "react";

// Illustration vectorielle animée (vrai "bonhomme" en mouvement, pas une photo statique)
// pour guider visuellement chaque mouvement d'échauffement, sans dépendre d'aucune
// ressource externe — tout est du SVG généré ici, donc ça marche à 100% du temps.

type WarmupMove = "shoulders" | "jacks" | "chest";

interface StickFigureWarmupProps {
  move: WarmupMove;
}

const STROKE = "#FF8A3D";
const STROKE_BG = "#3A2418";

export const StickFigureWarmup: React.FC<StickFigureWarmupProps> = ({ move }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#1A120C]">
      <svg viewBox="0 0 200 240" className="w-56 h-56 sm:w-64 sm:h-64" fill="none">
        {/* Sol */}
        <line x1="30" y1="220" x2="170" y2="220" stroke={STROKE_BG} strokeWidth="4" strokeLinecap="round" />

        {/* Tête */}
        <circle cx="100" cy="45" r="18" stroke={STROKE} strokeWidth="6" />

        {/* Tronc */}
        <line x1="100" y1="63" x2="100" y2="150" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />

        {move === "shoulders" && (
          <>
            {/* Jambes fixes, légèrement écartées */}
            <line x1="100" y1="150" x2="75" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <line x1="100" y1="150" x2="125" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            {/* Bras qui font des rotations d'épaules (rotation autour de l'épaule) */}
            <g>
              <line x1="100" y1="80" x2="60" y2="100" stroke={STROKE} strokeWidth="6" strokeLinecap="round">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="0 100 80; -40 100 80; 40 100 80; 0 100 80"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </line>
              <line x1="100" y1="80" x2="140" y2="100" stroke={STROKE} strokeWidth="6" strokeLinecap="round">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="0 100 80; 40 100 80; -40 100 80; 0 100 80"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </line>
            </g>
          </>
        )}

        {move === "jacks" && (
          <>
            {/* Jambes qui s'écartent et se referment */}
            <g>
              <line x1="100" y1="150" x2="100" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="0 100 150; -28 100 150; 0 100 150"
                  dur="0.7s"
                  repeatCount="indefinite"
                />
              </line>
              <line x1="100" y1="150" x2="100" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="0 100 150; 28 100 150; 0 100 150"
                  dur="0.7s"
                  repeatCount="indefinite"
                />
              </line>
            </g>
            {/* Bras qui montent et descendent en même temps que les jambes */}
            <g>
              <line x1="100" y1="80" x2="100" y2="40" stroke={STROKE} strokeWidth="6" strokeLinecap="round">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="20 100 80; -150 100 80; 20 100 80"
                  dur="0.7s"
                  repeatCount="indefinite"
                />
              </line>
              <line x1="100" y1="80" x2="100" y2="40" stroke={STROKE} strokeWidth="6" strokeLinecap="round">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="-20 100 80; 150 100 80; -20 100 80"
                  dur="0.7s"
                  repeatCount="indefinite"
                />
              </line>
            </g>
          </>
        )}

        {move === "chest" && (
          <>
            {/* Jambes fixes, légèrement écartées pour l'équilibre */}
            <line x1="100" y1="150" x2="75" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <line x1="100" y1="150" x2="125" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            {/* Bras qui s'ouvrent en grand (étirement pectoraux) puis se referment devant */}
            <g>
              <line x1="100" y1="85" x2="145" y2="85" stroke={STROKE} strokeWidth="6" strokeLinecap="round">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="-70 100 85; 0 100 85; -70 100 85"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </line>
              <line x1="100" y1="85" x2="55" y2="85" stroke={STROKE} strokeWidth="6" strokeLinecap="round">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="70 100 85; 0 100 85; 70 100 85"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </line>
            </g>
          </>
        )}
      </svg>
    </div>
  );
};

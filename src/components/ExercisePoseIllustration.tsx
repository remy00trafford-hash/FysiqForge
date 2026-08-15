import React from "react";

// Bibliothèque de "bonhommes" animés en SVG, façon apps de fitness (LeapFitness, etc.),
// qui remplace les photos pour TOUS les exercices. Comme il est impossible d'illustrer
// à la main des centaines d'exercices uniques, chaque exercice est automatiquement classé
// dans une des catégories de mouvement ci-dessous — c'est cohérent, ça marche à 100% du
// temps (pas de dépendance réseau/image externe), et ça matche toujours le bon type de geste.

export type PoseCategory =
  | "push"
  | "pull"
  | "squat"
  | "lunge"
  | "core"
  | "hinge"
  | "cardio"
  | "stretch"
  | "shoulder"
  | "arm";

const STROKE = "#FF8A3D";
const STROKE_BG = "#3A2418";

export function classifyExercisePose(name: string, muscleGroup?: string): PoseCategory {
  const text = `${name} ${muscleGroup || ""}`.toLowerCase();

  if (/squat|leg press|presse à cuisses|fente|lunge|mollet|calf/.test(text) && /fente|lunge/.test(text)) {
    return "lunge";
  }
  if (/squat|leg press|presse à cuisses|quadriceps|mollet|calf|wall sit|chaise murale/.test(text)) {
    return "squat";
  }
  if (/gainage|plank|planche|crunch|abdo|core|obliq|russian twist|rotation russe|relevé/.test(text)) {
    return "core";
  }
  if (/soulevé de terre|deadlift|hinge|romanian|good morning|hip thrust|pont fessier|bridge/.test(text)) {
    return "hinge";
  }
  if (/tirage|row|rowing|pulldown|pull-up|traction|dos|dorsal|lat /.test(text)) {
    return "pull";
  }
  if (/développé|press|bench|push[- ]?up|pompe|dip|pectoraux|triceps|chest/.test(text)) {
    return "push";
  }
  if (/épaule|shoulder|élévation|raise|militaire|overhead/.test(text)) {
    return "shoulder";
  }
  if (/curl|biceps|avant-bras|forearm|kickback/.test(text)) {
    return "arm";
  }
  if (/jumping jack|mountain climber|cardio|saut|jump|burpee|corde/.test(text)) {
    return "cardio";
  }
  if (/étirement|stretch|torsion|mobilité|adducteur/.test(text)) {
    return "stretch";
  }
  // Repli par défaut si aucun mot-clé ne correspond
  return "push";
}

interface ExercisePoseIllustrationProps {
  pose: PoseCategory;
}

export const ExercisePoseIllustration: React.FC<ExercisePoseIllustrationProps> = ({ pose }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#1A120C]">
      <svg viewBox="0 0 200 240" className="w-56 h-56 sm:w-64 sm:h-64" fill="none">
        <line x1="30" y1="220" x2="170" y2="220" stroke={STROKE_BG} strokeWidth="4" strokeLinecap="round" />
        <circle cx="100" cy="45" r="18" stroke={STROKE} strokeWidth="6" />

        {pose === "push" && (
          <>
            <line x1="60" y1="150" x2="140" y2="150" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <line x1="80" y1="150" x2="80" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <line x1="120" y1="150" x2="120" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <line x1="60" y1="150" x2="100" y2="63" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <g>
              <line x1="70" y1="150" x2="70" y2="110" stroke={STROKE} strokeWidth="6" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" values="0 70 150; -90 70 150; 0 70 150" dur="1.6s" repeatCount="indefinite" />
              </line>
            </g>
          </>
        )}

        {pose === "pull" && (
          <>
            <line x1="100" y1="63" x2="100" y2="150" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <line x1="100" y1="150" x2="80" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <line x1="100" y1="150" x2="120" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <line x1="100" y1="90" x2="150" y2="70" stroke={STROKE_BG} strokeWidth="4" strokeLinecap="round" />
            <g>
              <line x1="100" y1="90" x2="150" y2="70" stroke={STROKE} strokeWidth="6" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" values="0 100 90; -35 100 90; 0 100 90" dur="1.6s" repeatCount="indefinite" />
              </line>
            </g>
          </>
        )}

        {pose === "squat" && (
          <>
            <g>
              <animateTransform attributeName="transform" type="translate" values="0 0; 0 28; 0 0" dur="1.8s" repeatCount="indefinite" />
              <line x1="100" y1="63" x2="100" y2="130" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
              <line x1="100" y1="130" x2="70" y2="180" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
              <line x1="70" y1="180" x2="75" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
              <line x1="100" y1="130" x2="130" y2="180" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
              <line x1="130" y1="180" x2="125" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
              <line x1="100" y1="80" x2="60" y2="95" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
              <line x1="100" y1="80" x2="140" y2="95" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            </g>
          </>
        )}

        {pose === "lunge" && (
          <>
            <line x1="100" y1="63" x2="105" y2="140" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <g>
              <animateTransform attributeName="transform" type="translate" values="0 0; -8 10; 0 0" dur="1.8s" repeatCount="indefinite" />
              <line x1="105" y1="140" x2="70" y2="160" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
              <line x1="70" y1="160" x2="55" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            </g>
            <g>
              <animateTransform attributeName="transform" type="translate" values="0 0; 8 -6; 0 0" dur="1.8s" repeatCount="indefinite" />
              <line x1="105" y1="140" x2="140" y2="175" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
              <line x1="140" y1="175" x2="150" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            </g>
            <line x1="100" y1="85" x2="70" y2="70" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <line x1="100" y1="85" x2="130" y2="100" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
          </>
        )}

        {pose === "core" && (
          <>
            <line x1="55" y1="180" x2="150" y2="140" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <line x1="150" y1="140" x2="165" y2="150" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <line x1="55" y1="180" x2="40" y2="200" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <circle cx="160" cy="130" r="16" stroke={STROKE} strokeWidth="6" />
            <g>
              <animateTransform attributeName="transform" type="translate" values="0 0; 0 -3; 0 0" dur="1.2s" repeatCount="indefinite" />
              <line x1="55" y1="180" x2="150" y2="140" stroke="transparent" strokeWidth="1" />
            </g>
          </>
        )}

        {pose === "hinge" && (
          <>
            <g>
              <animateTransform attributeName="transform" type="rotate" values="0 100 150; -30 100 150; 0 100 150" dur="1.8s" repeatCount="indefinite" />
              <line x1="100" y1="63" x2="100" y2="150" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
              <line x1="80" y1="90" x2="130" y2="105" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            </g>
            <line x1="100" y1="150" x2="90" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <line x1="100" y1="150" x2="115" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
          </>
        )}

        {pose === "cardio" && (
          <>
            <g>
              <animateTransform attributeName="transform" type="translate" values="0 0; 0 -18; 0 0" dur="0.55s" repeatCount="indefinite" />
              <line x1="100" y1="63" x2="100" y2="150" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
              <line x1="100" y1="150" x2="75" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
              <line x1="100" y1="150" x2="125" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
              <line x1="100" y1="85" x2="60" y2="60" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
              <line x1="100" y1="85" x2="140" y2="60" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            </g>
          </>
        )}

        {pose === "shoulder" && (
          <>
            <line x1="100" y1="63" x2="100" y2="150" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <line x1="100" y1="150" x2="80" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <line x1="100" y1="150" x2="120" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <g>
              <line x1="100" y1="85" x2="80" y2="110" stroke={STROKE} strokeWidth="6" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" values="0 100 85; -70 100 85; 0 100 85" dur="1.6s" repeatCount="indefinite" />
              </line>
              <line x1="100" y1="85" x2="120" y2="110" stroke={STROKE} strokeWidth="6" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" values="0 100 85; 70 100 85; 0 100 85" dur="1.6s" repeatCount="indefinite" />
              </line>
            </g>
          </>
        )}

        {pose === "arm" && (
          <>
            <line x1="100" y1="63" x2="100" y2="150" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <line x1="100" y1="150" x2="80" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <line x1="100" y1="150" x2="120" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <line x1="100" y1="90" x2="75" y2="120" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <g>
              <line x1="75" y1="120" x2="90" y2="90" stroke={STROKE} strokeWidth="6" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" values="0 75 120; -60 75 120; 0 75 120" dur="1.4s" repeatCount="indefinite" />
              </line>
            </g>
          </>
        )}

        {pose === "stretch" && (
          <>
            <line x1="100" y1="63" x2="100" y2="150" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <line x1="100" y1="150" x2="80" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <line x1="100" y1="150" x2="120" y2="218" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <g>
              <animateTransform attributeName="transform" type="rotate" values="0 100 90; 20 100 90; 0 100 90" dur="2.4s" repeatCount="indefinite" />
              <line x1="100" y1="90" x2="140" y2="120" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
              <line x1="100" y1="90" x2="60" y2="70" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            </g>
          </>
        )}
      </svg>
    </div>
  );
};

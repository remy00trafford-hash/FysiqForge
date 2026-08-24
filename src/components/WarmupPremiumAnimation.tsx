import React from "react";

type WarmupMove = "shoulders" | "jacks" | "chest";

const COLORS = {
  bg0: "#121B25",
  bg1: "#05080C",
  white: "#F7FAFC",
  white2: "#DCE5EB",
  outline: "#7C8B97",
  dark: "#202A34",
  muscle: "#FF4B3E",
  shadow: "#020509",
  accent: "#FF6A00",
  muted: "#A8B3BF"
};

export const WarmupPremiumAnimation: React.FC<{ move: WarmupMove }> = ({ move }) => {
  const label = move === "shoulders" ? "ROTATIONS ÉPAULES & COUDES" : move === "jacks" ? "JUMPING JACKS" : "OUVERTURE DE CAGE THORACIQUE";

  return (
    <div className="relative flex h-full min-h-[210px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#070B10] sm:min-h-[280px]">
      <svg viewBox="0 0 760 520" className="h-full w-full" role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="warm-bg-v2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={COLORS.bg0} />
            <stop offset="1" stopColor={COLORS.bg1} />
          </linearGradient>
          <linearGradient id="human-white-v2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.55" stopColor={COLORS.white2} />
            <stop offset="1" stopColor="#AAB7C2" />
          </linearGradient>
          <linearGradient id="human-shadow-v2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.24" />
            <stop offset="1" stopColor="#6B7782" stopOpacity="0.08" />
          </linearGradient>
          <filter id="warm-glow-v2"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        <rect width="760" height="520" fill="url(#warm-bg-v2)" />
        <text x="30" y="34" fill={COLORS.accent} fontSize="11" fontWeight="900" letterSpacing="2.8">FYSIQFORGE • ÉCHAUFFEMENT</text>
        <text x="30" y="67" fill={COLORS.white} fontSize="24" fontWeight="900">{label}</text>

        <ellipse cx="380" cy="455" rx="140" ry="16" fill={COLORS.shadow} opacity="0.86" />

        <g transform="translate(380 265)">
          {/* head */}
          <circle cx="0" cy="-142" r="32" fill="url(#human-white-v2)" stroke={COLORS.outline} strokeWidth="3" />
          <path d="M-28 -148 Q0 -181 30 -148 Q18 -163 0 -163 Q-18 -163 -28 -148Z" fill="#6F7D88" opacity="0.72" />
          <circle cx="-10" cy="-141" r="2.8" fill="#25313B" />
          <circle cx="10" cy="-141" r="2.8" fill="#25313B" />
          <path d="M-10 -128 Q0 -122 10 -128" fill="none" stroke="#83919B" strokeWidth="2.5" strokeLinecap="round" />

          {/* torso */}
          <path d="M-62 -108 Q-45 -132 0 -134 Q45 -132 62 -108 L74 34 Q55 70 0 82 Q-55 70 -74 34Z" fill="url(#human-white-v2)" stroke={COLORS.outline} strokeWidth="4" />
          {/* abdominal definition */}
          <path d="M0 -34 V56 M-28 -12 Q0 -2 28 -12 M-28 12 Q0 22 28 12 M-24 37 Q0 46 24 37" stroke="#8D9AA4" strokeWidth="3" opacity="0.7" fill="none" />

          {/* shorts */}
          <path d="M-72 30 Q0 54 72 30 L58 115 L10 110 L0 62 L-10 110 L-58 115Z" fill={COLORS.dark} stroke="#111820" strokeWidth="3" />

          {/* muscle markers */}
          {(move === "shoulders" || move === "chest") && <>
            <ellipse cx="-39" cy="-82" rx="17" ry="11" fill={COLORS.muscle} opacity="0.82"><animate attributeName="opacity" values="0.35;0.95;0.35" dur="1.5s" repeatCount="indefinite" /></ellipse>
            <ellipse cx="39" cy="-82" rx="17" ry="11" fill={COLORS.muscle} opacity="0.82"><animate attributeName="opacity" values="0.35;0.95;0.35" dur="1.5s" repeatCount="indefinite" /></ellipse>
          </>}
          {move === "jacks" && <>
            <ellipse cx="-18" cy="-65" rx="17" ry="10" fill={COLORS.muscle} opacity="0.82"><animate attributeName="opacity" values="0.35;0.95;0.35" dur="1s" repeatCount="indefinite" /></ellipse>
            <ellipse cx="18" cy="-65" rx="17" ry="10" fill={COLORS.muscle} opacity="0.82"><animate attributeName="opacity" values="0.35;0.95;0.35" dur="1s" repeatCount="indefinite" /></ellipse>
          </>}

          {/* shoulders / arms */}
          <g className={move === "shoulders" ? "warmup-shoulders-arms" : move === "chest" ? "warmup-chest-arms" : "warmup-jack-arms"}>
            <g className="left-arm" transform="translate(-58 -86)">
              <line x1="0" y1="0" x2="-74" y2="-8" stroke="url(#human-white-v2)" strokeWidth="25" strokeLinecap="round" />
              <circle cx="-76" cy="-9" r="12" fill="url(#human-white-v2)" stroke={COLORS.outline} strokeWidth="2.4" />
              <line x1="-76" y1="-9" x2="-122" y2="52" stroke="url(#human-white-v2)" strokeWidth="23" strokeLinecap="round" />
              <circle cx="-124" cy="54" r="11" fill="url(#human-white-v2)" stroke={COLORS.outline} strokeWidth="2.2" />
            </g>
            <g className="right-arm" transform="translate(58 -86)">
              <line x1="0" y1="0" x2="74" y2="-8" stroke="url(#human-white-v2)" strokeWidth="25" strokeLinecap="round" />
              <circle cx="76" cy="-9" r="12" fill="url(#human-white-v2)" stroke={COLORS.outline} strokeWidth="2.4" />
              <line x1="76" y1="-9" x2="122" y2="52" stroke="url(#human-white-v2)" strokeWidth="23" strokeLinecap="round" />
              <circle cx="124" cy="54" r="11" fill="url(#human-white-v2)" stroke={COLORS.outline} strokeWidth="2.2" />
            </g>
          </g>

          {/* legs */}
          <g className={move === "jacks" ? "warmup-jack-legs" : "warmup-static-legs"}>
            <g className="left-leg">
              <line x1="-34" y1="88" x2="-44" y2="205" stroke="url(#human-white-v2)" strokeWidth="36" strokeLinecap="round" />
              <circle cx="-44" cy="208" r="13" fill="url(#human-white-v2)" stroke={COLORS.outline} strokeWidth="2.3" />
              <line x1="-44" y1="208" x2="-54" y2="330" stroke="url(#human-white-v2)" strokeWidth="31" strokeLinecap="round" />
              <path d="M-65 337 Q-54 324 -28 332 L-18 349 L-71 349Z" fill={COLORS.white} stroke={COLORS.outline} strokeWidth="2.5" />
            </g>
            <g className="right-leg">
              <line x1="34" y1="88" x2="44" y2="205" stroke="url(#human-white-v2)" strokeWidth="36" strokeLinecap="round" />
              <circle cx="44" cy="208" r="13" fill="url(#human-white-v2)" stroke={COLORS.outline} strokeWidth="2.3" />
              <line x1="44" y1="208" x2="54" y2="330" stroke="url(#human-white-v2)" strokeWidth="31" strokeLinecap="round" />
              <path d="M65 337 Q54 324 28 332 L18 349 L71 349Z" fill={COLORS.white} stroke={COLORS.outline} strokeWidth="2.5" />
            </g>
          </g>
        </g>

        <text x="30" y="497" fill={COLORS.muted} fontSize="11" fontWeight="800">FIGURINE HUMANISTE • ANIMATION DÉDIÉE • MUSCLES CIBLÉS</text>
        <style>{`
          .warmup-static-legs { transform-origin: 0 88px; }
          .warmup-shoulders-arms .left-arm { transform-origin: 58px 86px; animation: shoulderCircle 2.2s ease-in-out infinite; }
          .warmup-shoulders-arms .right-arm { transform-origin: -58px 86px; animation: shoulderCircleR 2.2s ease-in-out infinite; }
          .warmup-chest-arms .left-arm { transform-origin: 58px 86px; animation: chestOpen 1.8s ease-in-out infinite alternate; }
          .warmup-chest-arms .right-arm { transform-origin: -58px 86px; animation: chestOpenR 1.8s ease-in-out infinite alternate; }
          .warmup-jack-arms { animation: jackArms 1s ease-in-out infinite alternate; transform-origin: 380px 179px; }
          .warmup-jack-legs { animation: jackLegs 1s ease-in-out infinite alternate; transform-origin: 380px 353px; }
          @keyframes shoulderCircle { 0%{transform:rotate(-35deg)}25%{transform:rotate(35deg)}50%{transform:rotate(105deg)}75%{transform:rotate(35deg)}100%{transform:rotate(-35deg)} }
          @keyframes shoulderCircleR { 0%{transform:rotate(35deg)}25%{transform:rotate(-35deg)}50%{transform:rotate(-105deg)}75%{transform:rotate(-35deg)}100%{transform:rotate(35deg)} }
          @keyframes chestOpen { from{transform:rotate(58deg)} to{transform:rotate(-10deg)} }
          @keyframes chestOpenR { from{transform:rotate(-58deg)} to{transform:rotate(10deg)} }
          @keyframes jackArms { from{transform:scaleY(0.86)} to{transform:scaleY(1.18)} }
          @keyframes jackLegs { from{transform:scaleX(0.82)} to{transform:scaleX(1.18)} }
        `}</style>
      </svg>
    </div>
  );
};

import React from "react";

type WarmupMove = "shoulders" | "jacks" | "chest";

export const WarmupPremiumAnimation: React.FC<{ move: WarmupMove }> = ({ move }) => {
  const label = move === "shoulders" ? "ROTATIONS ÉPAULES & COUDES" : move === "jacks" ? "JUMPING JACKS" : "OUVERTURE DE CAGE THORACIQUE";
  return (
    <div className="relative flex h-full min-h-[210px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#070B10] sm:min-h-[280px]">
      <svg viewBox="0 0 600 420" className="h-full w-full" role="img" aria-label={label}>
        <defs>
          <linearGradient id="warmup-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#111A24" />
            <stop offset="1" stopColor="#05080C" />
          </linearGradient>
          <linearGradient id="warmup-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.55" stopColor="#E9EEF2" />
            <stop offset="1" stopColor="#AAB7C2" />
          </linearGradient>
          <filter id="warmup-glow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <rect width="600" height="420" fill="url(#warmup-bg)" />
        <text x="28" y="34" fill="#FF6A00" fontSize="11" fontWeight="900" letterSpacing="2.4">FYSIQFORGE • ÉCHAUFFEMENT</text>
        <text x="28" y="60" fill="#F7F9FB" fontSize="22" fontWeight="900">{label}</text>
        <ellipse cx="300" cy="376" rx="120" ry="13" fill="#020509" opacity=".9" />
        <g transform="translate(300 208)">
          <circle cx="0" cy="-112" r="24" fill="url(#warmup-body)" stroke="#9EABB6" strokeWidth="2.5" />
          <path d="M-21 -120 Q0 -141 21 -120" fill="none" stroke="#6E7D88" strokeWidth="3" strokeLinecap="round" />
          <path d="M-42 -86 Q0 -112 42 -86 L34 16 Q0 42 -34 16 Z" fill="url(#warmup-body)" stroke="#9EABB6" strokeWidth="3" />
          <path d="M-34 10 L-20 72 L-4 72 L0 18 L4 72 L20 72 L34 10" fill="url(#warmup-body)" stroke="#9EABB6" strokeWidth="3" strokeLinejoin="round" />
          <g className={move === "shoulders" ? "animate-[spin_2.6s_linear_infinite] origin-0_-76" : ""}>
            <line x1="-28" y1="-78" x2="-78" y2="-28" stroke="url(#warmup-body)" strokeWidth="22" strokeLinecap="round" />
            <line x1="-78" y1="-28" x2="-108" y2="22" stroke="url(#warmup-body)" strokeWidth="20" strokeLinecap="round" />
            <line x1="28" y1="-78" x2="78" y2="-28" stroke="url(#warmup-body)" strokeWidth="22" strokeLinecap="round" />
            <line x1="78" y1="-28" x2="108" y2="22" stroke="url(#warmup-body)" strokeWidth="20" strokeLinecap="round" />
          </g>
          {move === "jacks" && <>
            <g className="animate-[warmupJackArms_1s_ease-in-out_infinite_alternate] origin-0_-78"><line x1="-28" y1="-78" x2="-100" y2="-145" stroke="url(#warmup-body)" strokeWidth="22" strokeLinecap="round"/><line x1="28" y1="-78" x2="100" y2="-145" stroke="url(#warmup-body)" strokeWidth="22" strokeLinecap="round"/></g>
            <g className="animate-[warmupJackLegs_1s_ease-in-out_infinite_alternate] origin-0_18"><line x1="-18" y1="12" x2="-82" y2="92" stroke="url(#warmup-body)" strokeWidth="26" strokeLinecap="round"/><line x1="18" y1="12" x2="82" y2="92" stroke="url(#warmup-body)" strokeWidth="26" strokeLinecap="round"/></g>
          </>}
          {move === "chest" && <>
            <g className="animate-[warmupChest_1.8s_ease-in-out_infinite_alternate] origin-0_-78"><line x1="-28" y1="-78" x2="-118" y2="-12" stroke="url(#warmup-body)" strokeWidth="22" strokeLinecap="round"/><line x1="28" y1="-78" x2="118" y2="-12" stroke="url(#warmup-body)" strokeWidth="22" strokeLinecap="round"/></g>
            <circle cx="-22" cy="-50" r="10" fill="#FF4936" opacity=".88"><animate attributeName="opacity" values=".35;.95;.35" dur="1.8s" repeatCount="indefinite" /></circle>
            <circle cx="22" cy="-50" r="10" fill="#FF4936" opacity=".88"><animate attributeName="opacity" values=".35;.95;.35" dur="1.8s" repeatCount="indefinite" /></circle>
          </>}
          {move === "shoulders" && <>
            <circle cx="-31" cy="-76" r="11" fill="#FF4936" opacity=".9"><animate attributeName="r" values="9;13;9" dur="1.3s" repeatCount="indefinite" /></circle>
            <circle cx="31" cy="-76" r="11" fill="#FF4936" opacity=".9"><animate attributeName="r" values="9;13;9" dur="1.3s" repeatCount="indefinite" /></circle>
          </>}
        </g>
        <text x="28" y="398" fill="#A8B3BF" fontSize="11" fontWeight="800">MOUVEMENT CONTINU • FIGURINE HUMANISTE • MUSCLES CIBLÉS</text>
        <style>{`@keyframes warmupJackArms{from{transform:rotate(-8deg)}to{transform:rotate(18deg)}}@keyframes warmupJackLegs{from{transform:rotate(-6deg)}to{transform:rotate(10deg)}}@keyframes warmupChest{from{transform:rotate(-18deg)}to{transform:rotate(18deg)}}`}</style>
      </svg>
    </div>
  );
};
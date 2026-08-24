import React from "react";

type WarmupMove = "shoulders" | "jacks" | "chest";

const DATA = {
  shoulders: { title: "ROTATIONS ÉPAULES & COUDES", duration: "2.2s" },
  jacks: { title: "JUMPING JACKS", duration: "1s" },
  chest: { title: "OUVERTURE DE CAGE THORACIQUE", duration: "1.8s" },
} as const;

export const WarmupPremiumAnimation: React.FC<{ move: WarmupMove }> = ({ move }) => {
  const d = DATA[move];
  return (
    <div className="relative flex h-full min-h-[210px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#070B10] sm:min-h-[280px]">
      <svg viewBox="0 0 760 520" className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={d.title}>
        <defs>
          <linearGradient id="wp-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#14202B"/><stop offset="1" stopColor="#05080C"/></linearGradient>
          <linearGradient id="wp-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFFFF"/><stop offset="0.55" stopColor="#E7EDF1"/><stop offset="1" stopColor="#AAB6C0"/></linearGradient>
          <linearGradient id="wp-shorts" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#263543"/><stop offset="1" stopColor="#101820"/></linearGradient>
        </defs>
        <rect width="760" height="520" fill="url(#wp-bg)"/>
        <text x="30" y="34" fill="#FF6A00" fontSize="11" fontWeight="900" letterSpacing="2.8">FYSIQFORGE • ÉCHAUFFEMENT</text>
        <text x="30" y="67" fill="#F7F9FB" fontSize="24" fontWeight="900">{d.title}</text>
        <ellipse cx="380" cy="469" rx="130" ry="13" fill="#020509" opacity=".9"/>
        <g transform="translate(380 0)">
          {/* head and neck */}
          <circle cx="0" cy="126" r="31" fill="url(#wp-body)" stroke="#7D8B96" strokeWidth="3"/>
          <path d="M-27 119 Q0 83 28 119 Q15 102 0 102 Q-15 102 -27 119Z" fill="#65727C" opacity=".75"/>
          <rect x="-12" y="151" width="24" height="27" rx="9" fill="url(#wp-body)"/>
          {/* torso — broad chest / waist, muscular silhouette */}
          <path d="M-67 172 Q-48 150 0 151 Q48 150 67 172 L79 307 Q60 342 0 351 Q-60 342 -79 307Z" fill="url(#wp-body)" stroke="#7D8B96" strokeWidth="4"/>
          {/* chest and abs definition */}
          <path d="M-48 205 Q-25 187 0 204 Q25 187 48 205" fill="none" stroke="#8C9AA4" strokeWidth="4" opacity=".7"/>
          <path d="M0 220 V315 M-31 244 Q0 254 31 244 M-30 273 Q0 283 30 273 M-24 301 Q0 309 24 301" fill="none" stroke="#8C9AA4" strokeWidth="3" opacity=".62"/>
          {/* shorts */}
          <path d="M-73 300 Q0 325 73 300 L61 374 L11 367 L0 325 L-11 367 L-61 374Z" fill="url(#wp-shorts)" stroke="#0B1218" strokeWidth="3"/>
          {/* highlighted muscles */}
          {(move === "shoulders" || move === "chest") && <><ellipse cx="-53" cy="188" rx="18" ry="12" fill="#FF4936"/><ellipse cx="53" cy="188" rx="18" ry="12" fill="#FF4936"/></>}
          {move === "jacks" && <><ellipse cx="-22" cy="235" rx="17" ry="10" fill="#FF4936"/><ellipse cx="22" cy="235" rx="17" ry="10" fill="#FF4936"/><ellipse cx="-41" cy="340" rx="18" ry="11" fill="#FF4936"/><ellipse cx="41" cy="340" rx="18" ry="11" fill="#FF4936"/></>}

          {/* animated arms */}
          <g className={`wp-arms wp-${move}`}>
            <g className="wp-left-arm"><line x1="-61" y1="184" x2="-118" y2="238" stroke="url(#wp-body)" strokeWidth="27" strokeLinecap="round"/><circle cx="-121" cy="242" r="13" fill="url(#wp-body)" stroke="#7D8B96" strokeWidth="2"/><line x1="-121" y1="242" x2="-142" y2="315" stroke="url(#wp-body)" strokeWidth="24" strokeLinecap="round"/><circle cx="-144" cy="319" r="11" fill="url(#wp-body)" stroke="#7D8B96" strokeWidth="2"/></g>
            <g className="wp-right-arm"><line x1="61" y1="184" x2="118" y2="238" stroke="url(#wp-body)" strokeWidth="27" strokeLinecap="round"/><circle cx="121" cy="242" r="13" fill="url(#wp-body)" stroke="#7D8B96" strokeWidth="2"/><line x1="121" y1="242" x2="142" y2="315" stroke="url(#wp-body)" strokeWidth="24" strokeLinecap="round"/><circle cx="144" cy="319" r="11" fill="url(#wp-body)" stroke="#7D8B96" strokeWidth="2"/></g>
          </g>

          {/* animated legs */}
          <g className={`wp-legs wp-${move}`}>
            <g className="wp-left-leg"><line x1="-34" y1="355" x2="-45" y2="421" stroke="url(#wp-body)" strokeWidth="36" strokeLinecap="round"/><circle cx="-45" cy="425" r="13" fill="url(#wp-body)" stroke="#7D8B96" strokeWidth="2"/><line x1="-45" y1="425" x2="-52" y2="477" stroke="url(#wp-body)" strokeWidth="31" strokeLinecap="round"/><path d="M-68 484 Q-48 472 -20 483 L-12 497 L-72 497Z" fill="#F7F9FB" stroke="#7D8B96" strokeWidth="2"/></g>
            <g className="wp-right-leg"><line x1="34" y1="355" x2="45" y2="421" stroke="url(#wp-body)" strokeWidth="36" strokeLinecap="round"/><circle cx="45" cy="425" r="13" fill="url(#wp-body)" stroke="#7D8B96" strokeWidth="2"/><line x1="45" y1="425" x2="52" y2="477" stroke="url(#wp-body)" strokeWidth="31" strokeLinecap="round"/><path d="M68 484 Q48 472 20 483 L12 497 L72 497Z" fill="#F7F9FB" stroke="#7D8B96" strokeWidth="2"/></g>
          </g>
        </g>
        <text x="30" y="498" fill="#A8B3BF" fontSize="11" fontWeight="800">FIGURINE HUMANISTE • MUSCLES CIBLÉS • MOUVEMENT DÉDIÉ</text>
        <style>{`
          .wp-shoulders .wp-left-arm { transform-origin: -61px 184px; animation: wpShoulderL 2.2s ease-in-out infinite; }
          .wp-shoulders .wp-right-arm { transform-origin: 61px 184px; animation: wpShoulderR 2.2s ease-in-out infinite; }
          .wp-chest .wp-left-arm { transform-origin: -61px 184px; animation: wpChestL 1.8s ease-in-out infinite alternate; }
          .wp-chest .wp-right-arm { transform-origin: 61px 184px; animation: wpChestR 1.8s ease-in-out infinite alternate; }
          .wp-jacks.wp-arms { animation: wpJackArms 1s ease-in-out infinite alternate; transform-origin: 380px 184px; }
          .wp-jacks.wp-legs { animation: wpJackLegs 1s ease-in-out infinite alternate; transform-origin: 380px 355px; }
          @keyframes wpShoulderL {0%{transform:rotate(-55deg)}25%{transform:rotate(30deg)}50%{transform:rotate(115deg)}75%{transform:rotate(30deg)}100%{transform:rotate(-55deg)}}
          @keyframes wpShoulderR {0%{transform:rotate(55deg)}25%{transform:rotate(-30deg)}50%{transform:rotate(-115deg)}75%{transform:rotate(-30deg)}100%{transform:rotate(55deg)}}
          @keyframes wpChestL {from{transform:rotate(55deg)}to{transform:rotate(-15deg)}}
          @keyframes wpChestR {from{transform:rotate(-55deg)}to{transform:rotate(15deg)}}
          @keyframes wpJackArms {from{transform:rotate(-4deg) scaleY(.78)}to{transform:rotate(4deg) scaleY(1.25)}}
          @keyframes wpJackLegs {from{transform:scaleX(.76)}to{transform:scaleX(1.22)}}
        `}</style>
      </svg>
    </div>
  );
};

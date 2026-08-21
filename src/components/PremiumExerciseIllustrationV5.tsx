import React, { useMemo } from "react";
import { classifyExerciseMotion, type MotionFamily } from "./PremiumExerciseIllustration";

type Point = [number, number];

type Pose = {
  head: Point;
  neck: Point;
  hip: Point;
  leftShoulder: Point;
  rightShoulder: Point;
  leftElbow: Point;
  rightElbow: Point;
  leftWrist: Point;
  rightWrist: Point;
  leftKnee: Point;
  rightKnee: Point;
  leftAnkle: Point;
  rightAnkle: Point;
};

const COLORS = {
  bg: "#070B10",
  panel: "#0D131B",
  panel2: "#121B25",
  line: "#263544",
  text: "#F7FAFC",
  muted: "#9AA8B6",
  orange: "#FF6A00",
  orangeSoft: "#FF9B5A",
  skin: "#E1A98D",
  skin2: "#F0C4A8",
  shirt: "#26394B",
  shirtHi: "#3D566D",
  shorts: "#18232E",
  white: "#F4F7FA",
  metal: "#98A7B6",
  metalDark: "#25313D",
  floor: "#334455",
  muscle: "#FF4E38",
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mixPoint = (a: Point, b: Point, t: number): Point => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

const standing: Pose = {
  head: [350, 86], neck: [350, 112], hip: [350, 220],
  leftShoulder: [323, 126], rightShoulder: [377, 126],
  leftElbow: [304, 165], rightElbow: [396, 165],
  leftWrist: [298, 210], rightWrist: [402, 210],
  leftKnee: [327, 276], rightKnee: [373, 276],
  leftAnkle: [321, 337], rightAnkle: [379, 337],
};

const squat: Pose = {
  head: [350, 115], neck: [350, 140], hip: [350, 245],
  leftShoulder: [321, 151], rightShoulder: [379, 151],
  leftElbow: [291, 172], rightElbow: [409, 172],
  leftWrist: [275, 168], rightWrist: [425, 168],
  leftKnee: [306, 286], rightKnee: [394, 286],
  leftAnkle: [286, 340], rightAnkle: [414, 340],
};

const lunge: Pose = {
  head: [332, 100], neck: [333, 126], hip: [352, 230],
  leftShoulder: [306, 137], rightShoulder: [360, 137],
  leftElbow: [286, 172], rightElbow: [390, 170],
  leftWrist: [282, 210], rightWrist: [402, 212],
  leftKnee: [305, 282], rightKnee: [402, 264],
  leftAnkle: [267, 340], rightAnkle: [430, 322],
};

const hinge: Pose = {
  head: [400, 110], neck: [378, 132], hip: [315, 235],
  leftShoulder: [357, 145], rightShoulder: [407, 156],
  leftElbow: [340, 198], rightElbow: [430, 216],
  leftWrist: [327, 245], rightWrist: [448, 255],
  leftKnee: [300, 286], rightKnee: [350, 292],
  leftAnkle: [280, 340], rightAnkle: [370, 340],
};

const pushup: Pose = {
  head: [210, 176], neck: [230, 190], hip: [395, 225],
  leftShoulder: [247, 194], rightShoulder: [260, 205],
  leftElbow: [270, 232], rightElbow: [285, 242],
  leftWrist: [278, 286], rightWrist: [306, 290],
  leftKnee: [404, 273], rightKnee: [422, 278],
  leftAnkle: [500, 305], rightAnkle: [516, 312],
};

const row: Pose = {
  head: [368, 111], neck: [357, 137], hip: [315, 246],
  leftShoulder: [332, 148], rightShoulder: [382, 155],
  leftElbow: [300, 186], rightElbow: [430, 178],
  leftWrist: [274, 141], rightWrist: [454, 137],
  leftKnee: [295, 289], rightKnee: [346, 293],
  leftAnkle: [279, 340], rightAnkle: [368, 340],
};

const plank: Pose = {
  head: [198, 184], neck: [221, 195], hip: [380, 237],
  leftShoulder: [240, 203], rightShoulder: [251, 213],
  leftElbow: [258, 235], rightElbow: [270, 240],
  leftWrist: [272, 276], rightWrist: [289, 280],
  leftKnee: [391, 272], rightKnee: [408, 277],
  leftAnkle: [500, 309], rightAnkle: [515, 316],
};

const stepUp: Pose = {
  head: [335, 96], neck: [336, 122], hip: [350, 226],
  leftShoulder: [309, 132], rightShoulder: [362, 132],
  leftElbow: [290, 175], rightElbow: [392, 175],
  leftWrist: [285, 216], rightWrist: [397, 216],
  leftKnee: [312, 281], rightKnee: [391, 245],
  leftAnkle: [302, 340], rightAnkle: [465, 294],
};

const carry: Pose = {
  ...standing,
  leftWrist: [286, 234], rightWrist: [414, 234],
  leftAnkle: [312, 337], rightAnkle: [388, 337],
};

const familyPose = (family: MotionFamily, phase: number): Pose => {
  const t = phase === 0 ? 0 : phase === 1 ? 0.55 : phase === 2 ? 1 : 0.55;
  const start = family === "squat" || family === "legPress" ? standing :
    family === "lunge" ? lunge :
    family === "stepUp" ? standing :
    family === "hinge" ? standing :
    family === "row" || family === "pulldown" || family === "pullup" ? row :
    family === "pushup" || family === "dip" ? pushup :
    family === "plank" ? plank :
    family === "carry" ? standing : standing;

  const end = family === "squat" ? squat :
    family === "legPress" ? squat :
    family === "lunge" ? lunge :
    family === "stepUp" ? stepUp :
    family === "hinge" ? hinge :
    family === "row" ? row :
    family === "pulldown" ? { ...row, leftWrist: [300, 94], rightWrist: [400, 94] } :
    family === "pullup" ? { ...row, head: [350, 88], neck: [350, 113], hip: [350, 245], leftWrist: [285, 72], rightWrist: [415, 72] } :
    family === "pushup" ? pushup :
    family === "dip" ? { ...standing, leftWrist: [290, 215], rightWrist: [410, 215], leftElbow: [302, 185], rightElbow: [398, 185] } :
    family === "plank" ? plank :
    family === "carry" ? carry : standing;

  const pose: Pose = {} as Pose;
  (Object.keys(start) as Array<keyof Pose>).forEach((k) => { pose[k] = mixPoint(start[k], end[k], t); });
  return pose;
};

const Line = ({ a, b, width = 13, color = COLORS.skin2 }: { a: Point; b: Point; width?: number; color?: string }) => (
  <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={color} strokeWidth={width} strokeLinecap="round" />
);

const Joint = ({ p }: { p: Point }) => <circle cx={p[0]} cy={p[1]} r="5.5" fill={COLORS.skin2} stroke="#A56D59" strokeWidth="1.5" />;

const Muscle = ({ x, y, rx, ry }: { x: number; y: number; rx: number; ry: number }) => (
  <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={COLORS.muscle} opacity="0.88">
    <animate attributeName="opacity" values="0.35;0.95;0.35" dur="1.25s" repeatCount="indefinite" />
  </ellipse>
);

function Human({ pose, family }: { pose: Pose; family: MotionFamily }) {
  const torsoPath = `M${pose.leftShoulder[0]} ${pose.leftShoulder[1]} Q${pose.neck[0]} ${pose.neck[1] - 16} ${pose.rightShoulder[0]} ${pose.rightShoulder[1]} L${pose.rightHip?.[0] ?? pose.hip[0] + 24} ${pose.hip[1] - 4} Q${pose.hip[0]} ${pose.hip[1] + 18} ${pose.leftHip?.[0] ?? pose.hip[0] - 24} ${pose.hip[1] - 4} Z`;
  return (
    <g>
      <circle cx={pose.head[0]} cy={pose.head[1]} r="18" fill={COLORS.skin2} stroke="#A56D59" strokeWidth="2" />
      <path d={`M${pose.head[0]-15} ${pose.head[1]-3} Q${pose.head[0]} ${pose.head[1]-24} ${pose.head[0]+17} ${pose.head[1]-3} Q${pose.head[0]+3} ${pose.head[1]-9} ${pose.head[0]-15} ${pose.head[1]-3}`} fill="#202832" />
      <path d={torsoPath} fill={COLORS.shirtHi} stroke="#1B2A38" strokeWidth="2" />

      <Line a={pose.leftShoulder} b={pose.leftElbow} width={15} />
      <Line a={pose.leftElbow} b={pose.leftWrist} width={14} />
      <Line a={pose.rightShoulder} b={pose.rightElbow} width={15} />
      <Line a={pose.rightElbow} b={pose.rightWrist} width={14} />
      <Joint p={pose.leftElbow} /><Joint p={pose.rightElbow} />

      <path d={`M${pose.hip[0]-25} ${pose.hip[1]-4} Q${pose.hip[0]} ${pose.hip[1]-14} ${pose.hip[0]+25} ${pose.hip[1]-4} L${pose.hip[0]+18} ${pose.hip[1]+38} L${pose.hip[0]+4} ${pose.hip[1]+34} L${pose.hip[0]} ${pose.hip[1]+2} L${pose.hip[0]-4} ${pose.hip[1]+34} L${pose.hip[0]-18} ${pose.hip[1]+38} Z`} fill={COLORS.shorts} />

      <Line a={pose.leftKnee} b={pose.leftAnkle} width={17} />
      <Line a={pose.rightKnee} b={pose.rightAnkle} width={17} />
      <Line a={pose.hip} b={pose.leftKnee} width={18} color="#E4B099" />
      <Line a={pose.hip} b={pose.rightKnee} width={18} color="#E4B099" />
      <Joint p={pose.leftKnee} /><Joint p={pose.rightKnee} />

      <path d={`M${pose.leftAnkle[0]-10} ${pose.leftAnkle[1]-2} q20 -5 30 5 l5 8 h-37z`} fill={COLORS.white} stroke="#A8B5C1" strokeWidth="2" />
      <path d={`M${pose.rightAnkle[0]-2} ${pose.rightAnkle[1]-2} q20 -5 30 5 l5 8 h-37z`} fill={COLORS.white} stroke="#A8B5C1" strokeWidth="2" />

      {(family === "benchPress" || family === "inclinePress") && <Muscle x={350} y={164} rx={25} ry={11} />}
      {(family === "row" || family === "pulldown" || family === "pullup") && <Muscle x={355} y={190} rx={22} ry={12} />}
      {(family === "squat" || family === "lunge" || family === "stepUp" || family === "legPress") && <><Muscle x={322} y={260} rx={18} ry={11} /><Muscle x={378} y={260} rx={18} ry={11} /></>}
      {(family === "hinge" || family === "gluteBridge") && <Muscle x={350} y={247} rx={25} ry={11} />}
      {(family === "curl" || family === "triceps" || family === "shoulderPress" || family === "lateralRaise" || family === "dip") && <><Muscle x={320} y={150} rx={10} ry={8} /><Muscle x={380} y={150} rx={10} ry={8} /></>}
      {(family === "core" || family === "plank" || family === "legRaise") && <Muscle x={350} y={205} rx={24} ry={9} />}
    </g>
  );
}

function Equipment({ family, phase }: { family: MotionFamily; phase: number }) {
  if (family === "benchPress" || family === "inclinePress") {
    return <g>
      <rect x="170" y="327" width="360" height="12" rx="6" fill={COLORS.metalDark} stroke={COLORS.metal} strokeWidth="3" />
      <line x1="200" y1="337" x2="200" y2="370" stroke={COLORS.metal} strokeWidth="7" />
      <line x1="500" y1="337" x2="500" y2="370" stroke={COLORS.metal} strokeWidth="7" />
      <line x1="188" y1="125" x2="512" y2="125" stroke={COLORS.metal} strokeWidth="8" />
      <circle cx="188" cy="125" r="13" fill={COLORS.metalDark} /><circle cx="512" cy="125" r="13" fill={COLORS.metalDark} />
    </g>;
  }
  if (family === "squat" || family === "lunge") {
    return <g>
      <line x1="205" y1="92" x2="495" y2="92" stroke={COLORS.metal} strokeWidth="8" />
      <circle cx="205" cy="92" r="16" fill={COLORS.metalDark} /><circle cx="495" cy="92" r="16" fill={COLORS.metalDark} />
    </g>;
  }
  if (family === "row" || family === "pulldown" || family === "pullup") {
    return <g>
      <line x1="520" y1="60" x2="520" y2="340" stroke={COLORS.metalDark} strokeWidth="12" />
      <line x1="250" y1="90" x2="450" y2="90" stroke={COLORS.metal} strokeWidth="7" />
      {family === "pulldown" && <line x1="260" y1={phase === 2 ? 145 : 90} x2="440" y2={phase === 2 ? 145 : 90} stroke={COLORS.metal} strokeWidth="8" />}
    </g>;
  }
  if (family === "legPress") return <path d="M500 115 L620 320" stroke={COLORS.metal} strokeWidth="14" strokeLinecap="round" opacity=".65" />;
  if (family === "carry") return <g><rect x="265" y="236" width="28" height="52" rx="10" fill={COLORS.metalDark} stroke={COLORS.metal} strokeWidth="3" /><rect x="407" y="236" width="28" height="52" rx="10" fill={COLORS.metalDark} stroke={COLORS.metal} strokeWidth="3" /></g>;
  return null;
}

const guidance: Partial<Record<MotionFamily, string>> = {
  benchPress: "Descendre la barre vers la poitrine, puis pousser en gardant les poignets alignés.",
  inclinePress: "Descendre les charges sous contrôle, puis pousser vers le haut sans perdre l'angle du banc.",
  row: "Tirer les coudes vers l'arrière et rapprocher les omoplates, puis contrôler le retour.",
  pulldown: "Tirer la barre vers le haut de la poitrine en gardant les épaules basses.",
  pullup: "Tirer la poitrine vers la barre, puis redescendre lentement sans relâcher le gainage.",
  squat: "Reculer les hanches, fléchir les genoux, puis pousser dans le sol pour remonter.",
  lunge: "Descendre le bassin entre les jambes, puis pousser dans le pied avant pour remonter.",
  stepUp: "Monter sur la plateforme avec un pied, pousser fort, puis redescendre avec contrôle.",
  hinge: "Repousser les hanches vers l'arrière en gardant le dos neutre, puis serrer les fessiers.",
  legPress: "Fléchir les genoux en contrôlant la descente, puis repousser le plateau.",
  curl: "Garder les coudes fixes et fléchir l'avant-bras sans élan.",
  triceps: "Garder les coudes près du corps et étendre l'avant-bras sans bouger les épaules.",
  shoulderPress: "Pousser les charges au-dessus de la tête, puis revenir sous contrôle vers les épaules.",
  lateralRaise: "Lever les bras sur les côtés jusqu'à la hauteur des épaules, puis redescendre lentement.",
  pushup: "Garder le corps gainé, descendre la poitrine, puis repousser le sol.",
  dip: "Descendre en contrôlant les coudes, puis pousser jusqu'à la position de départ.",
  plank: "Maintenir une ligne droite entre épaules, hanches et chevilles.",
  core: "Bouger avec le tronc, sans élan, et garder la contraction pendant toute la répétition.",
  gluteBridge: "Pousser les hanches vers le haut en serrant les fessiers, puis redescendre.",
  gluteKickback: "Garder le bassin stable, pousser la jambe vers l'arrière, puis ramener sans cambrer.",
  calfRaise: "Monter sur la pointe des pieds, marquer la contraction, puis redescendre complètement.",
  cardio: "Répéter le mouvement en continu à un rythme régulier et contrôlé.",
  carry: "Garder le buste droit et marcher avec des pas courts et maîtrisés.",
};

const phaseLabels = ["DÉPART", "DESCENTE / CHARGE", "POSITION FINALE", "RETOUR"];

export const PremiumExerciseIllustrationV5: React.FC<{ exerciseId?: string; exerciseName?: string; muscleGroup?: string }> = ({ exerciseId, exerciseName = "Exercice", muscleGroup = "Mouvement" }) => {
  const spec = useMemo(() => classifyExerciseMotion(exerciseId, exerciseName, muscleGroup), [exerciseId, exerciseName, muscleGroup]);
  const panels = [0, 1, 2, 3];
  return (
    <div className="relative h-full w-full min-h-[300px] overflow-hidden rounded-3xl border border-white/10 bg-[#070B10] shadow-[0_24px_80px_rgba(0,0,0,.45)]">
      <svg viewBox="0 0 1200 760" className="h-full w-full" role="img" aria-label={`${exerciseName} — 4 phases du mouvement`}>
        <defs>
          <linearGradient id="ffBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#111925"/><stop offset="1" stopColor="#070B10"/></linearGradient>
          <radialGradient id="ffHalo"><stop offset="0" stopColor="#223243" stopOpacity=".62"/><stop offset="1" stopColor="#0A0F15" stopOpacity="0"/></radialGradient>
          <filter id="ffGlow"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <rect width="1200" height="760" fill="url(#ffBg)" />
        <circle cx="600" cy="330" r="310" fill="url(#ffHalo)" />

        <text x="46" y="50" fill={COLORS.orange} fontSize="14" fontWeight="900" letterSpacing="3">FYSIQFORGE • GUIDAGE</text>
        <text x="46" y="90" fill={COLORS.text} fontSize="30" fontWeight="900">{spec.label}</text>
        <text x="46" y="118" fill={COLORS.muted} fontSize="15" fontWeight="700">MUSCLES CIBLÉS • {spec.muscle}</text>

        <rect x="905" y="36" width="250" height="62" rx="18" fill="#111923" stroke="#314154" />
        <text x="928" y="61" fill={COLORS.muted} fontSize="11" fontWeight="900" letterSpacing="2">PHASES</text>
        <text x="928" y="84" fill={COLORS.text} fontSize="18" fontWeight="900">4 MOUVEMENTS CLÉS</text>

        {panels.map((phase, idx) => {
          const x = 38 + idx * 291;
          const active = idx === 1;
          const pose = familyPose(spec.family, phase);
          return (
            <g key={phase}>
              <rect x={x} y="150" width="268" height="438" rx="26" fill={active ? "#131F2B" : COLORS.panel} stroke={active ? COLORS.orange : "#223140"} strokeWidth={active ? 3 : 2} />
              <text x={x + 22} y="183" fill={active ? COLORS.orangeSoft : COLORS.muted} fontSize="11" fontWeight="900" letterSpacing="2">0{idx + 1}</text>
              <text x={x + 52} y="183" fill={COLORS.text} fontSize="13" fontWeight="900">{phaseLabels[idx]}</text>
              <line x1={x + 22} y1="204" x2={x + 246} y2="204" stroke="#263645" />
              <g transform={`translate(${x - 250}, 0)`}>
                <Equipment family={spec.family} phase={phase} />
                <Human pose={pose} family={spec.family} />
              </g>
              {idx < 3 && <text x={x + 257} y="382" fill={COLORS.orange} fontSize="28" fontWeight="900">›</text>}
              <circle cx={x + 134} cy="548" r="18" fill="#0B1016" stroke="#334556" strokeWidth="2" />
              <circle cx={x + 134} cy="548" r="7" fill={active ? COLORS.orange : "#788A9B"} filter={active ? "url(#ffGlow)" : undefined} />
            </g>
          );
        })}

        <line x1="80" y1="634" x2="1120" y2="634" stroke="#273747" strokeWidth="4" strokeLinecap="round" />
        <circle cx="600" cy="634" r="10" fill={COLORS.orange}>
          <animate attributeName="cx" values="80;600;1120;600;80" dur="4s" repeatCount="indefinite" />
        </circle>
        <text x="48" y="681" fill={COLORS.muted} fontSize="14" fontWeight="800">TRAJECTOIRE DU MOUVEMENT</text>
        <text x="48" y="711" fill={COLORS.text} fontSize="18" fontWeight="800">{guidance[spec.family] || "Effectue chaque phase lentement et garde le mouvement sous contrôle."}</text>
        <text x="1138" y="711" textAnchor="end" fill={COLORS.orangeSoft} fontSize="13" fontWeight="900">BOUCLE • 4 PHASES</text>
      </svg>
    </div>
  );
};

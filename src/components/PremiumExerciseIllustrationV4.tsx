import React, { useMemo } from "react";
import { EXERCISE_MOTIONS, classifyExerciseMotion } from "./PremiumExerciseIllustration";

type Family = string;

const C = {
  bg: "#090E14",
  panel: "#111821",
  panel2: "#17212B",
  line: "#2E3A47",
  text: "#F6F8FA",
  muted: "#9DABB9",
  accent: "#FF6500",
  accent2: "#FF9C51",
  skin: "#D59A7C",
  skinLight: "#F0BFA3",
  hair: "#24292F",
  top: "#27394B",
  topHi: "#3C5870",
  shorts: "#1B252F",
  shoe: "#F0F3F6",
  metal: "#8796A7",
  metalDark: "#27313D",
  muscle: "#FF5A38",
  floor: "#384958",
};

const Head = ({ x, y, r = 14 }: { x: number; y: number; r?: number }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={C.skinLight} stroke="#A96F5A" strokeWidth="1.8" />
    <path d={`M${x-r+2} ${y-4} q6 -${r+10} ${r*2-4} -4 q8 3 ${r+3} 13 q-8 -7 -${r+3} -4z`} fill={C.hair} />
  </g>
);

const Limb = ({ x1, y1, x2, y2, width = 14, color = C.skinLight }: { x1:number;y1:number;x2:number;y2:number;width?:number;color?:string }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" />
);

const Joint = ({ x, y }: { x: number; y: number }) => <circle cx={x} cy={y} r={5.5} fill={C.skinLight} stroke="#A96F5A" strokeWidth="1.3" />;

const Shoe = ({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) => (
  <path d={flip ? `M${x} ${y} q18 -2 28 7 q5 5 2 10 h-30 z` : `M${x} ${y} q18 -2 28 7 q5 5 2 10 h-30 z`} fill={C.shoe} stroke="#A9B4BF" strokeWidth="1.8" />
);

const Torso = ({ cx, cy = 120, lean = 0, shorts = true }: { cx:number;cy?:number;lean?:number;shorts?:boolean }) => (
  <g transform={`rotate(${lean} ${cx} ${cy})`}>
    <path d={`M${cx-33} ${cy-18} Q${cx} ${cy-34} ${cx+33} ${cy-18} L${cx+27} ${cy+43} Q${cx} ${cy+55} ${cx-27} ${cy+43} Z`} fill={C.topHi} stroke="#21313F" strokeWidth="2" />
    <path d={`M${cx-22} ${cy-3} Q${cx} ${cy-11} ${cx+22} ${cy-3}`} stroke="#6E8799" strokeWidth="2" opacity="0.45" />
    <ellipse cx={cx-13} cy={cy+8} rx={10} ry={7} fill={C.muscle} opacity="0.82" />
    <ellipse cx={cx+13} cy={cy+8} rx={10} ry={7} fill={C.muscle} opacity="0.82" />
    {shorts && <path d={`M${cx-28} ${cy+39} Q${cx} ${cy+30} ${cx+28} ${cy+39} L${cx+22} ${cy+70} L${cx+2} ${cy+67} L${cx} ${cy+43} L${cx-2} ${cy+67} L${cx-22} ${cy+70} Z`} fill={C.shorts} />}
  </g>
);

const Muscle = ({ x, y, rx = 16, ry = 9 }: { x:number;y:number;rx?:number;ry?:number }) => (
  <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={C.muscle} opacity="0.86">
    <animate attributeName="opacity" values="0.35;0.95;0.35" dur="1.3s" repeatCount="indefinite" />
  </ellipse>
);

const Floor = () => <line x1="35" y1="345" x2="665" y2="345" stroke={C.floor} strokeWidth="5" strokeLinecap="round" />;
const Arrow = ({ x1, y1, x2, y2 }: { x1:number;y1:number;x2:number;y2:number }) => (
  <g opacity="0.95">
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.accent} strokeWidth="5" strokeDasharray="10 8" strokeLinecap="round" />
    <path d={`M${x2} ${y2} l-14 -8 l4 17 z`} fill={C.accent} />
  </g>
);

function Kickback() {
  return <g>
    <rect x="165" y="318" width="290" height="20" rx="10" fill="#1A2430" stroke="#3E4B59" strokeWidth="3" />
    <Head x={208} y={170} r={17} />
    <Torso cx={278} cy={205} lean={-5} />
    <Limb x1={245} y1={228} x2={225} y2={295} width={16} />
    <Joint x={225} y={295} />
    <Limb x1={321} y1={228} x2={298} y2={267} width={16} />
    <Joint x={298} y={267} />
    <g>
      <Limb x1={298} y1={267} x2={420} y2={306} width={17} />
      <animateTransform attributeName="transform" type="rotate" values="0 298 267; -26 298 267; -26 298 267; 0 298 267" dur="3.2s" repeatCount="indefinite" />
    </g>
    <Shoe x={415} y={300} />
    <Limb x1={327} y1={220} x2={353} y2={283} width={15} />
    <Limb x1={353} y1={283} x2={368} y2={314} width={15} />
    <Muscle x={300} y={236} rx={19} ry={11} />
    <Arrow x1={338} y1={287} x2={450} y2={193} />
    <text x="500" y="206" fill={C.accent2} fontSize="14" fontWeight="900">EXTENSION</text>
    <Floor />
  </g>;
}

function GluteBridge() {
  return <g>
    <rect x="150" y="320" width="340" height="18" rx="9" fill="#1A2430" stroke="#3E4B59" strokeWidth="3" />
    <Head x={208} y={250} r={17} />
    <path d="M224 267 Q270 238 335 266 L365 314 L248 314 Z" fill={C.topHi} stroke="#21313F" strokeWidth="2" />
    <Muscle x={300} y={296} rx={22} ry={11} />
    <Limb x1={260} y1={294} x2={340} y2={300} width={17} />
    <Joint x={340} y={300} />
    <Limb x1={340} y1={300} x2={395} y2={322} width={17} />
    <Shoe x={392} y={314} />
    <Limb x1={285} y1={298} x2={245} y2={300} width={17} />
    <Joint x={245} y={300} />
    <Limb x1={245} y1={300} x2={204} y2={321} width={17} />
    <Shoe x={180} y={313} flip />
    <g>
      <path d="M300 287 Q300 248 300 218" fill="none" stroke={C.accent} strokeWidth="6" strokeDasharray="10 8" />
      <path d="M300 218 l-14 8 l14 -18 l14 8 z" fill={C.accent} />
    </g>
    <Floor />
  </g>;
}

function Squat({ weighted = true }: { weighted?:boolean }) {
  return <g>
    {weighted && <>
      <line x1="194" y1="88" x2="470" y2="88" stroke={C.metal} strokeWidth="9" />
      <circle cx="194" cy="88" r="15" fill={C.metalDark}/><circle cx="470" cy="88" r="15" fill={C.metalDark}/>
    </>}
    <Head x={332} y={105} r={18}/>
    <Torso cx={332} cy={145} lean={4}/>
    <Limb x1={307} y1={213} x2={268} y2={290} width={18}/>
    <Joint x={268} y={290}/>
    <Limb x1={268} y1={290} x2={250} y2={330} width={18}/>
    <Shoe x={226} y={324}/>
    <Limb x1={357} y1={213} x2={395} y2={290} width={18}/>
    <Joint x={395} y={290}/>
    <Limb x1={395} y1={290} x2={414} y2={330} width={18}/>
    <Shoe x={408} y={324} flip />
    <g>
      <Limb x1={300} y1={165} x2={254} y2={208} width={14}/>
      <Limb x1={364} y1={165} x2={410} y2={208} width={14}/>
      {weighted && <line x1="225" y1="88" x2="439" y2="88" stroke={C.metal} strokeWidth="6" />}
    </g>
    <Muscle x={300} y={232} rx={22} ry={12}/>
    <Muscle x={365} y={232} rx={22} ry={12}/>
    <Arrow x1={500} y1={140} x2={500} y2={238}/>
    <Floor />
  </g>;
}

function BenchPress({ incline = false, fly = false, triceps = false }: { incline?:boolean;fly?:boolean;triceps?:boolean }) {
  return <g>
    <g transform={incline ? "rotate(-10 330 288)" : undefined}>
      <rect x="160" y="286" width="340" height="16" rx="8" fill={C.metal} />
      <line x1="195" y1="302" x2="195" y2="338" stroke={C.metal} strokeWidth="8" />
      <line x1="468" y1="302" x2="468" y2="338" stroke={C.metal} strokeWidth="8" />
      <Head x={220} y={258} r={16}/>
      <path d="M240 274 Q298 245 380 272 L392 286 L246 286 Z" fill={C.topHi}/>
      <Muscle x={315} y={269} rx={27} ry={11}/>
      {fly ? <>
        <g>
          <Limb x1={280} y1={265} x2={238} y2={200} width={14}/>
          <Limb x1={348} y1={265} x2={390} y2={200} width={14}/>
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 15; 0 0" dur="2.8s" repeatCount="indefinite" />
        </g>
        <Arrow x1={232} y1={205} x2={268} y2={252}/><Arrow x1={396} y1={205} x2={360} y2={252}/>
      </> : <>
        <line x1="190" y1="176" x2="470" y2="176" stroke={C.metal} strokeWidth="8" />
        <circle cx="190" cy="176" r="12" fill={C.metalDark}/><circle cx="470" cy="176" r="12" fill={C.metalDark}/>
        <g>
          <Limb x1={282} y1={266} x2={250} y2={226} width={14}/><Limb x1={350} y1={266} x2={384} y2={226} width={14}/>
          <Limb x1={250} y1={226} x2={244} y2={176} width={14}/><Limb x1={384} y1={226} x2={392} y2={176} width={14}/>
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 45; 0 45; 0 0" dur="3.1s" repeatCount="indefinite" />
        </g>
        <Arrow x1={520} y1={220} x2={520} y2={176}/>
      </>}
    </g>
    <Floor />
  </g>;
}

function Row({ vertical = false, pullup = false }: { vertical?:boolean;pullup?:boolean }) {
  return <g>
    {vertical && <line x1="500" y1="72" x2="500" y2="322" stroke={C.metal} strokeWidth="9" />}
    <line x1="205" y1="95" x2="455" y2="95" stroke={C.metal} strokeWidth="7" />
    <Head x={330} y={136} r={17}/>
    <Torso cx={330} cy={174} lean={-10}/>
    <Limb x1={300} y1={241} x2={273} y2={317} width={16}/><Limb x1={360} y1={241} x2={385} y2={317} width={16}/>
    <g>
      <Limb x1={298} y1={185} x2={vertical ? 306 : 252} y2={vertical ? 110 : 160} width={14}/>
      <Limb x1={362} y1={185} x2={vertical ? 354 : 408} y2={vertical ? 110 : 160} width={14}/>
      <animateTransform attributeName="transform" type="translate" values="0 12; 0 0; 0 12" dur="2.6s" repeatCount="indefinite" />
    </g>
    <Muscle x={331} y={200} rx={24} ry={12}/>
    {pullup ? <Arrow x1={530} y1={280} x2={530} y2={120}/> : <Arrow x1={466} y1={196} x2={421} y2={145}/>} 
    <Floor />
  </g>;
}

function StandingArm({ kind }: { kind:"curl"|"shoulderPress"|"lateralRaise"|"triceps" }) {
  return <g>
    <Head x={330} y={80} r={18}/>
    <Torso cx={330} cy={118}/>
    {kind === "lateralRaise" ? <>
      <g>
        <Limb x1={305} y1={125} x2={225} y2={185} width={15}/><Limb x1={355} y1={125} x2={435} y2={185} width={15}/>
        <animateTransform attributeName="transform" type="translate" values="0 12; 0 -14; 0 12" dur="2.5s" repeatCount="indefinite" />
      </g>
      <Arrow x1={210} y1={195} x2={260} y2={165}/><Arrow x1={450} y1={195} x2={400} y2={165}/>
    </> : kind === "shoulderPress" ? <>
      <g>
        <Limb x1={305} y1={125} x2={272} y2={96} width={15}/><Limb x1={355} y1={125} x2={388} y2={96} width={15}/>
        <Limb x1={272} y1={96} x2={274} y2={66} width={15}/><Limb x1={388} y1={96} x2={386} y2={66} width={15}/>
        <circle cx="274" cy="63" r="10" fill={C.metalDark}/><circle cx="386" cy="63" r="10" fill={C.metalDark}/>
        <animateTransform attributeName="transform" type="translate" values="0 25; 0 -15; 0 25" dur="3s" repeatCount="indefinite" />
      </g>
      <Arrow x1={458} y1={116} x2={458} y2={62}/>
    </> : <>
      <g>
        <Limb x1={305} y1={125} x2={266} y2={168} width={15}/><Limb x1={355} y1={125} x2={394} y2={168} width={15}/>
        <Limb x1={266} y1={168} x2={272} y2={112} width={15}/><Limb x1={394} y1={168} x2={388} y2={112} width={15}/>
        <circle cx="272" cy="112" r="10" fill={C.metalDark}/><circle cx="388" cy="112" r="10" fill={C.metalDark}/>
        <animateTransform attributeName="transform" type="translate" values="0 18; 0 0; 0 18" dur="2.4s" repeatCount="indefinite" />
      </g>
      <Arrow x1={470} y1={175} x2={430} y2={112}/>
    </>}
    <Muscle x={303} y={136} rx={12} ry={8}/><Muscle x={357} y={136} rx={12} ry={8}/>
    <Floor />
  </g>;
}

function Pushup({ pike = false }: { pike?:boolean }) {
  return <g>
    <Head x={180} y={170} r={16}/>
    <path d={pike ? "M205 184 L330 240 L430 205 L438 224 L334 270 L202 205 Z" : "M205 184 Q330 156 462 205 L452 230 L210 214 Z"} fill={C.topHi}/>
    <Muscle x={330} y={198} rx={28} ry={10}/>
    <g>
      <Limb x1={248} y1={205} x2={270} y2={260} width={14}/><Limb x1={395} y1={214} x2={407} y2={266} width={14}/>
      <Limb x1={270} y1={260} x2={239} y2={304} width={14}/><Limb x1={407} y1={266} x2={449} y2={305} width={14}/>
      <animateTransform attributeName="transform" type="translate" values="0 0; 0 18; 0 18; 0 0" dur="2.8s" repeatCount="indefinite" />
    </g>
    <Shoe x={222} y={300}/><Shoe x={445} y={298} flip/>
    <Arrow x1={520} y1={152} x2={520} y2={232}/><Floor/>
  </g>;
}

function Plank() {
  return <g>
    <Head x={180} y={184} r={15}/>
    <line x1="205" y1="198" x2="450" y2="250" stroke={C.topHi} strokeWidth="24" strokeLinecap="round"/>
    <Muscle x={330} y={226} rx={28} ry={9}/>
    <Limb x1={245} y1={212} x2={226} y2={304} width={15}/><Limb x1={445} y1={248} x2={470} y2={304} width={15}/>
    <Shoe x={210} y={300}/><Shoe x={463} y={300} flip/><Floor/>
  </g>;
}

function Hinge() {
  return <g>
    <g>
      <Head x={338} y={92} r={17}/><Torso cx={338} cy={132} lean={18}/>
      <Limb x1={307} y1={202} x2={250} y2={248} width={15}/><Limb x1={369} y1={202} x2={426} y2={248} width={15}/>
      <Limb x1={250} y1={248} x2={238} y2={308} width={15}/><Limb x1={426} y1={248} x2={438} y2={308} width={15}/>
      <circle cx="238" cy="308" r="10" fill={C.metalDark}/><circle cx="438" cy="308" r="10" fill={C.metalDark}/>
      <line x1="226" y1="306" x2="450" y2="306" stroke={C.metal} strokeWidth="7"/>
      <animateTransform attributeName="transform" type="rotate" values="0 338 160; 14 338 160; 0 338 160" dur="3s" repeatCount="indefinite" />
    </g>
    <Arrow x1={500} y1={142} x2={458} y2={210}/><Floor/>
  </g>;
}

function LegPress() {
  return <g>
    <path d="M160 286 L385 176 L520 176 L290 310 Z" fill="#1A2430" stroke={C.metal} strokeWidth="6"/>
    <circle cx="470" cy="198" r="28" fill="#202A35" stroke={C.metal} strokeWidth="4"/>
    <Head x={232} y={214} r={16}/><path d="M249 226 Q300 205 345 230 L360 282 L260 282 Z" fill={C.topHi}/><Muscle x={310} y={252} rx={22} ry={10}/>
    <g>
      <Limb x1={325} y1={273} x2={395} y2={244} width={16}/><Limb x1={395} y1={244} x2={476} y2={202} width={16}/>
      <Limb x1={341} y1={273} x2={404} y2={254} width={16}/><Limb x1={404} y1={254} x2={476} y2={202} width={16}/>
      <animateTransform attributeName="transform" type="translate" values="0 15; 0 0; 0 15" dur="3.1s" repeatCount="indefinite" />
    </g>
    <Arrow x1={540} y1={220} x2={500} y2={190}/><Floor/>
  </g>;
}

function CalfRaise() {
  return <g>
    <Head x={330} y={74} r={17}/><Torso cx={330} cy={116}/>
    <Limb x1={305} y1={212} x2={290} y2={302} width={17}/><Limb x1={355} y1={212} x2={370} y2={302} width={17}/>
    <g>
      <Limb x1={290} y1={302} x2={278} y2={328} width={14}/><Limb x1={370} y1={302} x2={382} y2={328} width={14}/>
      <Shoe x={254} y={323}/><Shoe x={378} y={323} flip/>
      <animateTransform attributeName="transform" type="translate" values="0 0; 0 -15; 0 0" dur="1.9s" repeatCount="indefinite" />
    </g>
    <Muscle x={295} y={270} rx={9} ry={16}/><Muscle x={365} y={270} rx={9} ry={16}/>
    <Arrow x1={438} y1={304} x2={438} y2={255}/><Floor/>
  </g>;
}

function Cardio({ label }: { label:string }) {
  if (/mountain|climber/i.test(label)) return <g><Head x={175} y={178} r={15}/><line x1="200" y1="192" x2="445" y2="250" stroke={C.topHi} strokeWidth="22" strokeLinecap="round"/><Muscle x={318} y={226} rx={28} ry={8}/><g><Limb x1={430} y1={240} x2={515} y2={278} width={15}/><Limb x1={515} y1={278} x2={485} y2={252} width={15}/><animateTransform attributeName="transform" type="translate" values="0 0;-50 -20;0 0" dur="1.2s" repeatCount="indefinite"/></g><Limb x1={430} y1={242} x2={340} y2={292} width={15}/><Limb x1={340} y1={292} x2={370} y2={270} width={15}/><Arrow x1={540} y1={180} x2={510} y2={235}/><Floor/></g>;
  return <g><Head x={330} y={76} r={17}/><Torso cx={330} cy={118}/><g><Limb x1={302} y1={128} x2={225} y2={184} width={15}/><Limb x1={358} y1={128} x2={435} y2={184} width={15}/><Limb x1={309} y1={208} x2={245} y2={313} width={15}/><Limb x1={351} y1={208} x2={415} y2={313} width={15}/><animateTransform attributeName="transform" type="translate" values="0 0;0 -12;0 0" dur="1s" repeatCount="indefinite"/></g><Shoe x={222} y={308}/><Shoe x={412} y={308} flip/><Arrow x1={500} y1={130} x2={468} y2={198}/><Floor/></g>;
}

function Scene({ family, label }: { family:Family;label:string }) {
  if (family === "gluteKickback") return <Kickback/>;
  if (family === "gluteBridge") return <GluteBridge/>;
  if (family === "squat" || family === "lunge" || family === "stepUp") return <Squat weighted={family === "squat"}/>;
  if (family === "benchPress") return <BenchPress/>;
  if (family === "inclinePress") return <BenchPress incline/>;
  if (family === "lyingTriceps") return <BenchPress triceps/>;
  if (family === "row") return <Row/>;
  if (family === "pulldown") return <Row vertical/>;
  if (family === "pullup") return <Row pullup/>;
  if (family === "curl") return <StandingArm kind="curl"/>;
  if (family === "shoulderPress") return <StandingArm kind="shoulderPress"/>;
  if (family === "lateralRaise") return <StandingArm kind="lateralRaise"/>;
  if (family === "triceps") return <StandingArm kind="triceps"/>;
  if (family === "pushup" || family === "dip") return <Pushup pike={/pike/i.test(label)}/>;
  if (family === "plank" || family === "core" || family === "legRaise") return <Plank/>;
  if (family === "hinge") return <Hinge/>;
  if (family === "legPress") return <LegPress/>;
  if (family === "calfRaise") return <CalfRaise/>;
  if (family === "cardio") return <Cardio label={label}/>;
  return <Squat weighted={false}/>;
}

export const PremiumExerciseIllustrationV4: React.FC<{ exerciseId?:string; exerciseName?:string; muscleGroup?:string }> = ({ exerciseId, exerciseName = "Exercice", muscleGroup = "Mouvement" }) => {
  const spec = useMemo(() => (exerciseId && EXERCISE_MOTIONS[exerciseId]) ? EXERCISE_MOTIONS[exerciseId] : classifyExerciseMotion(exerciseId, exerciseName, muscleGroup), [exerciseId, exerciseName, muscleGroup]);
  const phases = ["DÉPART", "MOUVEMENT", "POSITION FINALE", "RETOUR"];
  return (
    <div className="w-full h-full overflow-hidden rounded-3xl border border-white/10 bg-[#090E14] shadow-[0_20px_70px_rgba(0,0,0,.38)]">
      <svg viewBox="0 0 700 430" className="w-full h-full" role="img" aria-label={`${exerciseName}: ${phases.join(", ")}`}>
        <defs>
          <linearGradient id="heroBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#121A24"/><stop offset="1" stopColor="#080D13"/></linearGradient>
          <radialGradient id="heroGlow" cx="50%" cy="38%" r="64%"><stop offset="0" stopColor="#243140" stopOpacity=".52"/><stop offset="1" stopColor="#0A0F15" stopOpacity="0"/></radialGradient>
        </defs>
        <rect width="700" height="430" fill="url(#heroBg)"/>
        <rect width="700" height="430" fill="url(#heroGlow)"/>

        <text x="24" y="26" fill={C.accent} fontSize="10" fontWeight="900" letterSpacing="2">GUIDAGE PREMIUM</text>
        <text x="24" y="53" fill={C.text} fontSize="24" fontWeight="900">{spec.label.slice(0, 34)}</text>
        <text x="676" y="48" textAnchor="end" fill={C.accent2} fontSize="10" fontWeight="900">{spec.muscle}</text>

        <rect x="18" y="70" width="664" height="250" rx="22" fill="rgba(17,24,33,.76)" stroke={C.line}/>
        <g transform="translate(70 83)">
          <Scene family={spec.family} label={spec.label}/>
        </g>

        <g opacity=".95">
          <line x1="88" y1="350" x2="612" y2="350" stroke="#617384" strokeWidth="4" strokeLinecap="round"/>
          {[88, 263, 438, 612].map((x, i) => <g key={x}><circle cx={x} cy="350" r="9" fill={i === 1 || i === 2 ? C.accent : C.panel2} stroke={i === 1 || i === 2 ? C.accent2 : C.line} strokeWidth="2"/><text x={x} y="375" textAnchor="middle" fill={i === 1 || i === 2 ? C.accent2 : C.muted} fontSize="9" fontWeight="900">{phases[i]}</text></g>)}
          <circle cx="88" cy="350" r="13" fill="none" stroke={C.accent} strokeWidth="2" opacity=".32"><animate attributeName="cx" values="88;263;438;612;438;263;88" dur="4.6s" repeatCount="indefinite"/></circle>
        </g>

        <rect x="22" y="395" width="656" height="25" rx="12" fill="#10161E" stroke={C.line}/>
        <text x="350" y="412" textAnchor="middle" fill={C.muted} fontSize="9" fontWeight="800">Départ → mouvement → position finale → retour • boucle pendant toute la durée de l'exercice</text>
      </svg>
    </div>
  );
};

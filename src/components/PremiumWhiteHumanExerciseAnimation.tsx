import React, { useMemo } from "react";

type Pt=[number,number];
type Pose={head:Pt;sl:Pt;sr:Pt;el:Pt;er:Pt;wl:Pt;wr:Pt;hip:Pt;kl:Pt;kr:Pt;al:Pt;ar:Pt};
type Kind="squat"|"hinge"|"lunge"|"press"|"raise"|"curl"|"triceps"|"row"|"pulldown"|"pullup"|"pushup"|"plank"|"side"|"crunch"|"legRaise"|"bridge"|"kickback"|"hydrant"|"calf"|"mountain"|"jump"|"burpee"|"carry"|"bench"|"dip"|"step"|"core";
const p=(x:number,y:number):Pt=>[x,y];
const base:Pose={head:p(600,112),sl:p(558,164),sr:p(642,164),el:p(520,215),er:p(680,215),wl:p(500,270),wr:p(700,270),hip:p(600,305),kl:p(560,390),kr:p(640,390),al:p(540,515),ar:p(660,515)};
const P=(o:Partial<Pose>):Pose=>({...base,...o});
const poses:Record<Kind,Pose>={
 squat:P({head:p(600,145),hip:p(600,350),kl:p(525,430),kr:p(675,430),al:p(505,520),ar:p(695,520),el:p(520,220),er:p(680,220),wl:p(500,205),wr:p(700,205)}),
 hinge:P({head:p(675,150),sl:p(615,188),sr:p(675,193),el:p(608,240),er:p(720,245),wl:p(590,305),wr:p(745,310),hip:p(545,332),kl:p(515,425),kr:p(600,430),al:p(500,520),ar:p(640,520)}),
 lunge:P({head:p(578,145),hip:p(612,330),kl:p(525,430),kr:p(700,385),al:p(500,520),ar:p(735,505)}),
 press:P({head:p(600,112),el:p(520,132),er:p(680,132),wl:p(515,78),wr:p(685,78)}),
 raise:P({head:p(600,112),el:p(520,210),er:p(680,210),wl:p(485,205),wr:p(715,205)}),
 curl:P({head:p(600,112),el:p(540,215),er:p(660,215),wl:p(525,165),wr:p(675,165)}),
 triceps:P({head:p(600,112),el:p(535,130),er:p(665,130),wl:p(515,205),wr:p(685,205)}),
 row:P({head:p(650,145),sl:p(594,188),sr:p(655,192),el:p(545,240),er:p(700,235),wl:p(515,200),wr:p(725,196),hip:p(548,335),kl:p(520,425),kr:p(600,430),al:p(500,520),ar:p(640,520)}),
 pulldown:P({head:p(600,118),el:p(530,225),er:p(670,225),wl:p(525,96),wr:p(675,96)}),
 pullup:P({head:p(600,102),el:p(520,178),er:p(680,178),wl:p(500,62),wr:p(700,62)}),
 pushup:P({head:p(355,315),sl:p(418,337),sr:p(452,345),el:p(455,392),er:p(498,400),wl:p(465,455),wr:p(520,460),hip:p(655,360),kl:p(705,420),kr:p(720,428),al:p(805,500),ar:p(820,506)}),
 plank:P({head:p(355,315),sl:p(418,337),sr:p(452,345),el:p(455,392),er:p(498,400),wl:p(465,455),wr:p(520,460),hip:p(655,360),kl:p(705,420),kr:p(720,428),al:p(805,500),ar:p(820,506)}),
 side:P({head:p(430,275),sl:p(455,310),sr:p(480,325),el:p(470,365),er:p(510,385),wl:p(470,420),wr:p(545,430),hip:p(620,345),kl:p(700,420),kr:p(725,430),al:p(800,475),ar:p(820,490)}),
 crunch:P({head:p(390,430),sl:p(425,440),sr:p(455,445),el:p(435,395),er:p(470,400),wl:p(450,355),wr:p(480,360),hip:p(620,430),kl:p(680,380),kr:p(705,385),al:p(735,320),ar:p(760,325)}),
 legRaise:P({head:p(355,350),sl:p(420,365),sr:p(450,372),el:p(420,425),er:p(455,430),wl:p(430,475),wr:p(480,480),hip:p(650,375),kl:p(690,305),kr:p(715,312),al:p(760,205),ar:p(785,212)}),
 bridge:P({head:p(355,400),sl:p(420,415),sr:p(450,425),el:p(440,450),er:p(475,455),wl:p(450,475),wr:p(500,480),hip:p(650,325),kl:p(705,385),kr:p(725,390),al:p(790,485),ar:p(810,490)}),
 kickback:P({head:p(370,260),sl:p(430,280),sr:p(470,290),el:p(440,335),er:p(500,340),wl:p(445,395),wr:p(510,400),hip:p(600,370),kl:p(550,445),kr:p(655,440),al:p(515,530),ar:p(760,440)}),
 hydrant:P({head:p(370,260),sl:p(430,280),sr:p(470,290),el:p(440,335),er:p(500,340),wl:p(445,395),wr:p(510,400),hip:p(600,370),kl:p(530,440),kr:p(670,375),al:p(505,530),ar:p(760,375)}),
 calf:P({kl:p(560,390),kr:p(640,390),al:p(540,500),ar:p(660,500)}),
 mountain:P({head:p(355,315),sl:p(418,337),sr:p(452,345),el:p(455,392),er:p(498,400),wl:p(465,455),wr:p(520,460),hip:p(655,360),kl:p(600,390),kr:p(735,350),al:p(720,430),ar:p(815,500)}),
 jump:P({head:p(600,110),el:p(500,195),er:p(700,195),wl:p(450,135),wr:p(750,135),kl:p(545,405),kr:p(655,405),al:p(490,520),ar:p(710,520)}),
 burpee:P({head:p(380,260),sl:p(430,285),sr:p(465,292),el:p(450,340),er:p(495,345),wl:p(445,400),wr:p(515,405),hip:p(650,310),kl:p(700,390),kr:p(735,400),al:p(800,470),ar:p(820,485)}),
 carry:P({wl:p(480,330),wr:p(720,330)}),
 bench:P({head:p(365,390),sl:p(430,408),sr:p(458,415),el:p(450,380),er:p(505,386),wl:p(462,335),wr:p(515,342),hip:p(640,430),kl:p(700,385),kr:p(725,390),al:p(780,500),ar:p(805,502)}),
 dip:P({head:p(600,185),el:p(525,265),er:p(675,265),wl:p(510,325),wr:p(690,325),hip:p(600,340)}),
 step:P({head:p(585,140),hip:p(610,325),kl:p(540,435),kr:p(665,350),al:p(520,520),ar:p(710,460)}),
 core:base
};
function kindFor(id:string):Kind{const s=id.toLowerCase().replace(/[^a-z0-9]+/g,"_");if(/bench_press|incline_dumbbell|db_bench_press|db_incline_fly|cable_crossover/.test(s))return s.includes("cable")||s.includes("fly")?"bench":"bench";if(/squat|leg_press/.test(s))return "squat";if(/deadlift|hinge/.test(s))return "hinge";if(/lunge|split|pistol/.test(s))return "lunge";if(/row/.test(s))return "row";if(/pulldown/.test(s))return "pulldown";if(/pullup|pull_up/.test(s))return "pullup";if(/shoulder_press|overhead_press|db_shoulder_press/.test(s))return "press";if(/lateral_raise|front_raise|lateral_raises/.test(s))return "raise";if(/curl/.test(s))return "curl";if(/triceps|extension/.test(s))return "triceps";if(/dip/.test(s))return "dip";if(/pushup|push_up|pike_pushup/.test(s))return "pushup";if(/side_plank/.test(s))return "side";if(/plank/.test(s))return "plank";if(/leg_raise|hanging_leg_raise/.test(s))return "legRaise";if(/crunch/.test(s))return "crunch";if(/bridge/.test(s))return "bridge";if(/kickback/.test(s))return "kickback";if(/hydrant/.test(s))return "hydrant";if(/calf/.test(s))return "calf";if(/mountain/.test(s))return "mountain";if(/jumping|jack/.test(s))return "jump";if(/burpee/.test(s))return "burpee";if(/carry/.test(s))return "carry";if(/step_up/.test(s))return "step";return "core"}
const lerp=(a:Pt,b:Pt,t:number):Pt=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
const mix=(a:Pose,b:Pose,t:number):Pose=>{const r={} as Pose;(Object.keys(a) as (keyof Pose)[]).forEach(k=>r[k]=lerp(a[k],b[k],t));return r};
const Seg=({a,b}:{a:Pt;b:Pt})=><line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#FF6A00" strokeWidth="30" strokeLinecap="round"/>;
const Joint=({a}:{a:Pt})=><circle cx={a[0]} cy={a[1]} r="14" fill="#FF6A00"/>;
function Body({q}:{q:Pose}){return <g><circle cx={q.head[0]} cy={q.head[1]} r="31" fill="#FF6A00"/><path d={`M${q.sl[0]} ${q.sl[1]}Q600 ${q.sl[1]-25} ${q.sr[0]} ${q.sr[1]}L${q.hip[0]+25} ${q.hip[1]-5}Q${q.hip[0]} ${q.hip[1]+15} ${q.hip[0]-25} ${q.hip[1]-5}Z`} fill="#FF6A00"/><Seg a={q.sl} b={q.el}/><Seg a={q.el} b={q.wl}/><Seg a={q.sr} b={q.er}/><Seg a={q.er} b={q.wr}/><Seg a={[q.hip[0]-16,q.hip[1]]} b={q.kl}/><Seg a={[q.hip[0]+16,q.hip[1]]} b={q.kr}/><Seg a={q.kl} b={q.al}/><Seg a={q.kr} b={q.ar}/>{[q.el,q.er,q.kl,q.kr].map((a,i)=><Joint key={i} a={a}/>)}</g>}
export const PremiumWhiteHumanExerciseAnimation:React.FC<{exerciseId?:string;exerciseName?:string;muscleGroup?:string}>=({exerciseId,exerciseName="Exercice",muscleGroup="Mouvement"})=>{const kind=useMemo(()=>kindFor(`${exerciseId||""}_${exerciseName||""}`),[exerciseId,exerciseName]);const target=poses[kind]||base;return <div className="relative h-full w-full overflow-hidden rounded-3xl bg-[#070B10]"><svg viewBox="0 0 1200 680" className="h-full w-full" role="img" aria-label={`${exerciseName} — animation`}> <text x="48" y="48" fill="#FF6A00" fontSize="13" fontWeight="900" letterSpacing="3">FYSIQFORGE</text><text x="48" y="82" fill="#FFFFFF" fontSize="26" fontWeight="900">{exerciseName}</text><text x="48" y="108" fill="#8B98A5" fontSize="13" fontWeight="700">{muscleGroup}</text>{[0,.55,1,.55].map((t,i)=>{const q=mix(base,target,t);const x=35+i*285;return <g key={i}><rect x={x} y="140" width="260" height="410" rx="24" fill="#0B0F14" stroke={i===1?"#FF6A00":"#26313B"} strokeWidth="2"/><text x={x+18} y="168" fill="#FFFFFF" fontSize="11" fontWeight="900">{["DÉPART","DESCENTE","POSITION","RETOUR"][i]}</text><g transform={`translate(${x-455},0) scale(.38)`}><Body q={q}/></g></g>})}<line x1="90" y1="610" x2="1110" y2="610" stroke="#26313B" strokeWidth="4"/><circle cx="90" cy="610" r="9" fill="#FF6A00"><animate attributeName="cx" values="90;345;600;855;1110;855;600;345;90" dur="4s" repeatCount="indefinite"/></circle></svg></div>};
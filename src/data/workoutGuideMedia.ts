import type { ExerciseMediaAsset } from "./exerciseMediaResolver";

type WorkoutGuideFrame={index:number;path:string;format?:string};
type WorkoutGuideExercise={id:string;slug:string;name:string;equipment?:string;primaryMuscle?:string;secondaryMuscles?:string[];frames:WorkoutGuideFrame[]};

const MANIFEST_URL="https://raw.githubusercontent.com/bryllim/workout-guide/main/packages/workout-guide/manifest.json";
const ASSET_BASE="https://raw.githubusercontent.com/bryllim/workout-guide/main/packages/workout-guide/";
const CACHE_KEY="fysiqforge.workout-guide-manifest.v1";
let manifestPromise:Promise<WorkoutGuideExercise[]>|null=null;

function normalize(value:string){
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g," and ").replace(/[^a-z0-9]+/g," ").trim().replace(/\s+/g," ");
}

const ALIASES:Record<string,string[]>={
  "low bar back squat":["back squat","barbell squat"],
  "safety bar squat":["squat"],
  "zercher squat":["squat"],
  "anderson squat":["squat"],
  "belt squat":["squat"],
  "pendulum squat":["squat"],
  "v squat":["squat"],
  "single leg leg press":["leg press"],
  "vertical leg press":["leg press"],
  "low to high cable fly":["cable fly","cable crossover"],
  "high to low cable fly":["cable fly","cable crossover"],
  "standing cable press":["cable chest press","cable press"],
  "single arm cable press":["cable chest press","cable press"],
  "decline machine chest press":["machine chest press"],
  "half kneeling landmine chest press":["landmine press"],
  "paused barbell bench press":["bench press"],
  "paused incline barbell bench press":["incline bench press"],
  "reverse grip barbell bench press":["bench press"],
  "neutral grip dumbbell bench press":["dumbbell bench press"],
  "alternating dumbbell bench press":["dumbbell bench press"],
  "single arm dumbbell bench press":["dumbbell bench press"],
  "dumbbell floor press":["dumbbell bench press"],
  "dumbbell squeeze press":["dumbbell bench press"],
  "neutral grip incline dumbbell press":["incline dumbbell press"],
  "alternating incline dumbbell press":["incline dumbbell press"],
  "cable chest fly":["cable fly"],
  "wide push up":["push up"],
  "close grip push up":["push up"],
  "paused deadlift":["deadlift"],
  "reeves deadlift":["deadlift"],
  "jefferson deadlift":["deadlift"],
  "suitcase deadlift":["deadlift"],
  "kroc row":["dumbbell row","one arm dumbbell row"],
  "chest supported dumbbell row":["dumbbell row"],
  "seal row":["row"],
  "chest supported t bar row":["t bar row","row"],
  "neutral grip lat pulldown":["lat pulldown"],
  "single arm lat pulldown":["lat pulldown"],
  "wide grip pull up":["pull up"],
  "commando pull up":["pull up"],
  "gironda sternum chins":["chin up","pull up"],
  "hyperextension 45 degree":["hyperextension","back extension"],
  "viking press":["shoulder press"],
  "single arm dumbbell shoulder press":["dumbbell shoulder press","shoulder press"],
  "dumbbell savickas press":["dumbbell shoulder press","shoulder press"],
  "lu raises":["lateral raise"],
  "y raise":["y raise","rear delt raise"],
  "cable front raise with rope":["cable front raise"],
  "chest supported rear delt row":["rear delt row","row"],
  "face pull to overhead press":["face pull"],
  "single arm cable rear delt fly":["rear delt fly","cable fly"],
  "cable upright row":["upright row"],
  "waiter curl":["biceps curl","dumbbell curl"],
  "cable rope curl":["cable curl"],
  "bayonian curl":["cable curl"],
  "jm press":["triceps extension","close grip bench press"],
  "california press":["triceps extension","close grip bench press"],
  "dumbbell overhead extension seated":["dumbbell overhead triceps extension"],
  "cross body cable triceps extension":["cable triceps extension"],
  "bodyweight triceps extension":["triceps extension"],
  "drag curl":["barbell curl","biceps curl"],
  "zottman curl":["dumbbell curl"],
  "tate press":["dumbbell triceps extension"],
  "nordic hamstring curl":["leg curl","hamstring curl"],
  "razor curl":["leg curl","hamstring curl"],
  "single leg dumbbell rdl":["romanian deadlift"],
  "b stance romanian deadlift":["romanian deadlift"],
  "landmine single leg rdl":["romanian deadlift"],
  "jefferson curl":["hamstring stretch"],
  "reverse hyperextension":["hyperextension"],
  "seated hamstring curl":["leg curl","hamstring curl"],
  "lying hamstring curl":["leg curl","hamstring curl"],
  "standing single leg hamstring curl":["leg curl","hamstring curl"],
  "banded hamstring curl":["leg curl","hamstring curl"],
  "single leg glute bridge":["glute bridge"],
  "b stance hip thrust":["hip thrust"],
  "single leg hip thrust":["hip thrust"],
  "frog pumps":["glute bridge"],
  "cable kickback":["glute kickback"],
  "standing cable hip abduction":["hip abduction"],
  "seated hip abduction machine":["hip abduction"],
  "side lying hip abduction":["hip abduction"],
  "clamshell":["hip abduction"],
  "banded monster walk":["lateral walk"],
  "banded lateral walk":["lateral walk"],
  "seated hip adduction machine":["hip adduction"],
  "copenhagen plank":["side plank","plank"],
  "standing calf raise":["calf raise"],
  "seated calf raise":["calf raise"],
  "donkey calf raise":["calf raise"],
  "single leg calf raise":["calf raise"],
  "tibialis raise":["tibialis raise","calf raise"],
  "reverse calf raise":["calf raise"],
  "ab wheel rollout":["ab rollout"],
  "barbell rollout":["ab rollout"],
  "standing ab wheel rollout":["ab rollout"],
  "hanging leg raise":["hanging leg raise"],
  "hanging knee raise":["hanging knee raise","leg raise"],
  "captains chair leg raise":["leg raise"],
  "dragon flag":["leg raise","core"],
  "l sit":["l sit"],
  "v up":["v up"],
  "russian twist":["russian twist"],
  "pallof press":["pallof press"],
  "landmine twist":["landmine rotation","woodchopper"],
  "cable woodchopper":["woodchopper","cable rotation"],
  "burpee":["burpee"],
  "kettlebell snatch":["kettlebell snatch"],
  "kettlebell clean and press":["kettlebell clean","shoulder press"],
  "devil press":["burpee","dumbbell snatch"],
  "thruster":["thruster"],
  "wall ball shot":["wall ball","squat"],
  "battle rope waves":["battle rope"],
  "farmers walk":["farmers walk","farmer walk"],
  "thoracic extension on foam roller":["thoracic extension","foam roller"],
  "thread the needle":["thread the needle"],
  "quadruped thoracic rotation":["thoracic rotation"],
  "ankle mobilization against wall":["ankle mobility"],
  "banded shoulder dislocates":["shoulder dislocate"],
  "doorway pectoral stretch":["chest stretch","pec stretch"],
  "couch stretch":["couch stretch","quad stretch"],
  "pigeon pose":["pigeon stretch","hip stretch"],
  "frog stretch":["frog stretch"],
  "standing hamstring stretch":["hamstring stretch"],
  "dynamic chest openers":["chest stretch","chest opener"]
};

function score(target:string,candidate:WorkoutGuideExercise){
  const t=normalize(target), n=normalize(candidate.name), slug=normalize(candidate.slug);
  if(t===n||t===slug)return 1000;
  const aliases=ALIASES[t]||[];
  let best=0;
  for(const alias of [target,...aliases]){
    const a=normalize(alias);
    if(a===n||a===slug) best=Math.max(best,900);
    else if(n.includes(a)||a.includes(n)) best=Math.max(best,700);
  }
  const tt=new Set(t.split(" ").filter(x=>x.length>2));
  const cc=new Set((n+" "+slug+" "+normalize(candidate.primaryMuscle||"")).split(" ").filter(x=>x.length>2));
  const overlap=[...tt].filter(x=>cc.has(x)).length;
  best=Math.max(best,overlap*70);
  return best;
}

async function loadManifest(){
  if(manifestPromise)return manifestPromise;
  manifestPromise=fetch(MANIFEST_URL,{cache:"force-cache"}).then(async r=>{
    if(!r.ok)throw new Error(`Workout Guide manifest HTTP ${r.status}`);
    const data=await r.json();
    if(!Array.isArray(data))throw new Error("Workout Guide manifest invalide");
    try{localStorage.setItem(CACHE_KEY,JSON.stringify(data))}catch{}
    return data as WorkoutGuideExercise[];
  }).catch(async e=>{
    try{const raw=localStorage.getItem(CACHE_KEY);if(raw){const data=JSON.parse(raw);if(Array.isArray(data))return data as WorkoutGuideExercise[]}}catch{}
    manifestPromise=null;throw e;
  });
  return manifestPromise;
}

export async function findWorkoutGuideMedia(exerciseName:string):Promise<ExerciseMediaAsset|null>{
  const catalog=await loadManifest();
  const ranked=catalog.map(item=>({item,score:score(exerciseName,item)})).filter(x=>x.item.frames?.length>=2&&x.score>=700).sort((a,b)=>b.score-a.score);
  const hit=ranked[0];
  if(!hit)return null;
  const frames=hit.item.frames.slice().sort((a,b)=>a.index-b.index).slice(0,3).map(frame=>{
    const png=frame.path.replace(/\.svg$/i,".png");
    return `${ASSET_BASE}${png}`;
  });
  if(frames.length<2)return null;
  return {
    id:`workout-guide-${hit.item.id}`,
    name:hit.item.name,
    images:frames,
    equipment:hit.item.equipment,
    primaryMuscles:hit.item.primaryMuscle?[hit.item.primaryMuscle]:[],
    score:hit.score,
    source:"wger.de" as ExerciseMediaAsset["source"],
    attribution:"Workout Guide — CC BY-SA 4.0 (Bryl Lim / Everkinetic)"
  };
}

export function workoutGuideLicense(){
  return "CC BY-SA 4.0";
}

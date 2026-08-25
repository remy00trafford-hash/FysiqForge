export type ExerciseGifAsset = { id:string; name:string; gifUrl:string; score:number };

type GifRecord = { id?:string; slug?:string; name?:string; gifUrl?:string; muscle?:string; bodyPart?:string; equipment?:string; };

const BASE="https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main";
const DATASET_URLS=[
  `${BASE}/api/en/bodyparts/back.json`,
  `${BASE}/api/en/bodyparts/chest.json`,
  `${BASE}/api/en/bodyparts/shoulders.json`,
  `${BASE}/api/en/bodyparts/legs.json`,
  `${BASE}/api/en/bodyparts/core.json`,
  `${BASE}/api/en/muscles/biceps.json`,
  `${BASE}/api/en/muscles/triceps.json`,
  `${BASE}/api/en/muscles/forearms.json`,
  `${BASE}/api/en/muscles/delts.json`,
  `${BASE}/api/en/muscles/pectorals.json`,
  `${BASE}/api/en/muscles/glutes.json`,
  `${BASE}/api/en/muscles/abs.json`
];
let promise:Promise<GifRecord[]>|null=null;

const VERIFIED_WARMUPS:Record<string,ExerciseGifAsset>={
  "standing arms circling":{id:"3258",name:"Standing Arms Circling",gifUrl:"https://d205bpvrqc9yn1.cloudfront.net/3258.gif",score:100},
  "jumping jack":{id:"3224",name:"Jumping Jack",gifUrl:"https://d205bpvrqc9yn1.cloudfront.net/3224.gif",score:100},
  "dynamic chest stretch male":{id:"1167",name:"Dynamic Chest Stretch (male)",gifUrl:"https://d205bpvrqc9yn1.cloudfront.net/1167.gif",score:100}
};

const VERIFIED_EXERCISE_ALIASES:Array<[RegExp,string]>=[
  [/assis.*bent.?over.*rear.*delt|seated.*bent.?over.*rear.*delt|rear.*delt.*raise|élévation.*arrière.*deltoïde/,
    "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/delts/dumbbell-rear-delt-raise.gif"]
];

function norm(v:string){return v.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}
function equal(a?:string,b?:string){return Boolean(a&&b&&norm(a).replace(/_/g," ")===norm(b).replace(/_/g," "))}
function tokens(v?:string){return norm(v).split(" ").filter(Boolean)}
function similarity(a?:string,b?:string){
  const aa=new Set(tokens(a)); const bb=new Set(tokens(b));
  if(!aa.size||!bb.size)return 0;
  let hit=0; aa.forEach(x=>{if(bb.has(x))hit++});
  return hit/Math.max(aa.size,bb.size);
}

export async function loadExerciseGifDataset(){
  if(promise)return promise;
  promise=Promise.all(DATASET_URLS.map(async url=>{
    try{
      const r=await fetch(url,{cache:"force-cache"});
      if(!r.ok)return [] as GifRecord[];
      const raw=await r.json() as {exercises?:GifRecord[]}|GifRecord[];
      const rows=Array.isArray(raw)?raw:(Array.isArray(raw.exercises)?raw.exercises:[]);
      return rows.filter(x=>typeof x.gifUrl==="string"&&x.gifUrl.startsWith("http"));
    }catch{return [] as GifRecord[];}
  })).then(chunks=>{
    const seen=new Set<string>();
    return chunks.flat().filter(row=>{
      const key=String(row.id||row.slug||row.gifUrl||"");
      if(!key||seen.has(key))return false; seen.add(key); return true;
    });
  }).catch(e=>{promise=null;throw e});
  return promise;
}

export async function findExerciseGif(exerciseId?:string,exerciseName?:string):Promise<ExerciseGifAsset|null>{
  if(!exerciseId&&!exerciseName)return null;

  const warmup=exerciseName?VERIFIED_WARMUPS[norm(exerciseName)]:undefined;
  if(warmup)return warmup;

  const alias=exerciseName?VERIFIED_EXERCISE_ALIASES.find(([pattern])=>pattern.test(exerciseName)):undefined;
  if(alias)return {id:`alias:${norm(exerciseName||"")}`,name:exerciseName||"Exercice",gifUrl:alias[1],score:100};

  const data=await loadExerciseGifDataset();

  const byId=data.find(r=>equal(r.id,exerciseId)||equal(r.slug,exerciseId));
  if(byId)return {id:String(byId.id||byId.slug||""),name:String(byId.name||exerciseName||"Exercice"),gifUrl:String(byId.gifUrl),score:100};

  const byName=data.find(r=>equal(r.name,exerciseName));
  if(byName)return {id:String(byName.id||byName.slug||""),name:String(byName.name||exerciseName||"Exercice"),gifUrl:String(byName.gifUrl),score:100};

  if(exerciseName){
    const candidates=data
      .map(r=>({r,score:similarity(exerciseName,r.name)}))
      .filter(x=>x.score>=0.55)
      .sort((a,b)=>b.score-a.score);
    const best=candidates[0];
    if(best)return {id:String(best.r.id||best.r.slug||""),name:String(best.r.name||exerciseName),gifUrl:String(best.r.gifUrl),score:Math.round(best.score*100)};
  }

  return null;
}

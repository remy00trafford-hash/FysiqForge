export type ExerciseGifAsset = { id:string; name:string; gifUrl:string; score:number };

type GifRecord = { id?:string; slug?:string; name?:string; gifUrl?:string; muscle?:string; bodyPart?:string; equipment?:string; };

const BASE="https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0";
const DATASET=`${BASE}/api/en/exercises.json`;
let promise:Promise<GifRecord[]>|null=null;

const VERIFIED_WARMUPS:Record<string,ExerciseGifAsset>={
  "standing arms circling":{id:"3258",name:"Standing Arms Circling",gifUrl:"https://d205bpvrqc9yn1.cloudfront.net/3258.gif",score:100},
  "jumping jack":{id:"3224",name:"Jumping Jack",gifUrl:"https://d205bpvrqc9yn1.cloudfront.net/3224.gif",score:100},
  "dynamic chest stretch male":{id:"1167",name:"Dynamic Chest Stretch (male)",gifUrl:"https://d205bpvrqc9yn1.cloudfront.net/1167.gif",score:100}
};

function norm(v:string){return v.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}
function equal(a?:string,b?:string){return Boolean(a&&b&&norm(a).replace(/_/g," ")===norm(b).replace(/_/g," "))}

export async function loadExerciseGifDataset(){
  if(promise)return promise;
  promise=fetch(DATASET,{cache:"force-cache"})
    .then(async r=>{
      if(!r.ok)throw new Error(`Exercise GIF DB HTTP ${r.status}`);
      const raw=await r.json() as GifRecord[]|{exercises?:GifRecord[]};
      const data=Array.isArray(raw)?raw:(Array.isArray(raw.exercises)?raw.exercises:[]);
      return data.filter(x=>typeof x.gifUrl==="string"&&x.gifUrl.startsWith("http"));
    })
    .catch(e=>{promise=null;throw e});
  return promise;
}

export async function findExerciseGif(exerciseId?:string,exerciseName?:string):Promise<ExerciseGifAsset|null>{
  if(!exerciseId&&!exerciseName)return null;

  // Warmups have hard-pinned, verified assets so a remote JSON outage can never produce a black card.
  const warmup=exerciseName?VERIFIED_WARMUPS[norm(exerciseName)]:undefined;
  if(warmup)return warmup;

  let data:GifRecord[]=[];
  try{data=await loadExerciseGifDataset();}catch{data=[];}

  const byId=data.find(r=>equal(r.id,exerciseId)||equal(r.slug,exerciseId));
  if(byId)return {id:String(byId.id||byId.slug||""),name:String(byId.name||exerciseName||"Exercice"),gifUrl:String(byId.gifUrl),score:100};

  const byName=data.find(r=>equal(r.name,exerciseName));
  if(byName)return {id:String(byName.id||byName.slug||""),name:String(byName.name||exerciseName||"Exercice"),gifUrl:String(byName.gifUrl),score:100};

  return null;
}

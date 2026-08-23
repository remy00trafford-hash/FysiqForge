export type ExerciseGifAsset = { id:string; name:string; gifUrl:string; score:number };

type GifRecord = { id?:string; slug?:string; name?:string; gifUrl?:string; muscle?:string; bodyPart?:string; equipment?:string; };

const BASE="https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0";
const DATASET=`${BASE}/api/en/exercises.json`;
let promise:Promise<GifRecord[]>|null=null;

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

/**
 * Returns a GIF only when the FysiqForge exercise can be matched exactly.
 * Never returns a merely similar exercise animation.
 */
export async function findExerciseGif(exerciseId?:string,exerciseName?:string):Promise<ExerciseGifAsset|null>{
  if(!exerciseId&&!exerciseName)return null;
  const data=await loadExerciseGifDataset();

  // 1) Exact exerciseId match is the strongest guarantee.
  const byId=data.find(r=>equal(r.id,exerciseId)||equal(r.slug,exerciseId));
  if(byId) return {id:String(byId.id||byId.slug||""),name:String(byId.name||exerciseName||"Exercice"),gifUrl:String(byId.gifUrl),score:100};

  // 2) Exact exercise name match is also safe; no fuzzy/token scoring.
  const byName=data.find(r=>equal(r.name,exerciseName));
  if(byName) return {id:String(byName.id||byName.slug||""),name:String(byName.name||exerciseName||"Exercice"),gifUrl:String(byName.gifUrl),score:100};

  // No exact match: deliberately return null so the UI can use its neutral fallback.
  return null;
}

export type ExerciseGifAsset = { id:string; name:string; gifUrl:string; score:number };

type GifRecord = { id?:string; slug?:string; name?:string; gifUrl?:string; muscle?:string; bodyPart?:string; equipment?:string; };

const BASE="https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0";
const DATASET=`${BASE}/api/en/exercises.json`;
let promise:Promise<GifRecord[]>|null=null;

function norm(v:string){return v.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}
const alias:Record<string,string[]>= {pompes:["push up","pushup"],pompe:["push up"],fentes:["lunge","lunges"],fente:["lunge"],gainage:["plank"],planche:["plank"],abdominaux:["abs","crunch"],tractions:["pull up","pullup"],traction:["pull up"],souleve:["deadlift"],roumain:["romanian"],fessiers:["glute"],fessier:["glute"],mollets:["calf","calves"],burpees:["burpee"],jumping:["jumping"],jack:["jack"],pike:["pike"],tirage:["row","pulldown"],rowing:["row"]};
function tokens(v:string){const a=norm(v).split(" ").filter(Boolean);const out=[...a];a.forEach(x=>(alias[x]||[]).forEach(y=>out.push(...norm(y).split(" "))));return [...new Set(out)]}
function score(qid:string,qname:string,r:GifRecord){const q=norm(`${qid} ${qname}`).replace(/_/g," ");const qts=tokens(q);const rt=tokens(`${r.id||""} ${r.slug||""} ${r.name||""}`);let s=0;if(qid&&norm(r.id||"").replace(/_/g," ")===norm(qid).replace(/_/g," "))s+=150;if(qname&&norm(r.name||"")===norm(qname))s+=140;for(const t of qts){if(rt.includes(t))s+=10;else if(t.length>=5&&norm(r.name||"").includes(t))s+=4}return s}

export async function loadExerciseGifDataset(){if(promise)return promise;promise=fetch(DATASET,{cache:"force-cache"}).then(async r=>{if(!r.ok)throw new Error(`Exercise GIF DB HTTP ${r.status}`);const raw=await r.json() as GifRecord[]|{exercises?:GifRecord[]};const data=Array.isArray(raw)?raw:(Array.isArray(raw.exercises)?raw.exercises:[]);return data.filter(x=>typeof x.gifUrl==="string"&&x.gifUrl.startsWith("http"))}).catch(e=>{promise=null;throw e});return promise}

export async function findExerciseGif(exerciseId?:string,exerciseName?:string):Promise<ExerciseGifAsset|null>{const data=await loadExerciseGifDataset();const ranked=data.map(r=>({r,s:score(exerciseId||"",exerciseName||"",r)})).filter(x=>x.s>=18).sort((a,b)=>b.s-a.s);const best=ranked[0];return best?{id:String(best.r.id||best.r.slug||""),name:String(best.r.name||exerciseName||"Exercice"),gifUrl:String(best.r.gifUrl),score:best.s}:null}

import type { CSSProperties } from "react";

export type ExerciseMediaSource = "free-exercise-db" | "wger.de";

export type ExerciseMediaAsset = {
  id: string;
  name: string;
  images: string[];
  equipment?: string;
  primaryMuscles?: string[];
  score: number;
  source: ExerciseMediaSource;
  attribution?: string;
};

type FreeExerciseRecord = {
  id: string;
  name: string;
  equipment?: string;
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  images?: string[];
};

type WgerImage = { image?: string; is_main?: boolean };
type WgerExercise = {
  id: number;
  name?: string;
  description?: string;
  category?: { id?: number; name?: string };
  equipment?: Array<{ id?: number; name?: string }>;
  muscles?: Array<{ id?: number; name?: string; name_en?: string }>;
  muscles_secondary?: Array<{ id?: number; name?: string; name_en?: string }>;
  images?: WgerImage[];
  license?: { short_name?: string; full_name?: string; url?: string } | null;
  license_author?: string;
};
type WgerResponse = { results?: WgerExercise[]; next?: string | null };

const FREE_DATASET_URL = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";
const FREE_IMAGE_BASE_URL = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";
const WGER_DATASET_URL = "https://wger.de/api/v2/exerciseinfo/?language=2&limit=200";
const FREE_CACHE_KEY = "fysiqforge.free-exercise-db.v2";
const WGER_CACHE_KEY = "fysiqforge.wger-exercise-media.v1";
const CACHE_TTL = 1000 * 60 * 60 * 24;
let freeDatasetPromise: Promise<FreeExerciseRecord[]> | null = null;
let wgerDatasetPromise: Promise<WgerExercise[]> | null = null;

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
const STOP_WORDS = new Set(["a", "an", "and", "au", "aux", "avec", "de", "des", "du", "en", "et", "la", "le", "les", "par", "pour", "sur", "the", "to", "with"]);
const ALIASES: Record<string, string[]> = { pompe:["push up"],pompes:["push up"],fente:["lunge"],fentes:["lunge"],developpe:["press"],couche:["bench press"],incline:["incline"],ecarte:["fly"],poulie:["cable"],tirage:["row","pulldown"],rowing:["row"],tractions:["pull up"],epaule:["shoulder"],epaules:["shoulder"],lateral:["lateral"],curl:["curl"],triceps:["triceps"],gainage:["plank"],planche:["plank"],fessier:["glute"],fessiers:["glute"],mollets:["calf"],jambes:["leg"],cuisses:["quadriceps","leg"] };
function expandTokens(value:string):string[]{const raw=normalize(value).split(" ").filter(Boolean);const expanded=[...raw];raw.forEach(token=>(ALIASES[token]||[]).forEach(alias=>expanded.push(...normalize(alias).split(" "))));return Array.from(new Set(expanded.filter(token=>!STOP_WORDS.has(token))));}
function readCache<T>(key:string):T|null{try{const raw=localStorage.getItem(key);if(!raw)return null;const parsed=JSON.parse(raw) as {timestamp:number;data:T};if(!parsed?.timestamp||Date.now()-parsed.timestamp>CACHE_TTL)return null;return parsed.data}catch{return null}}
function writeCache<T>(key:string,data:T):void{try{localStorage.setItem(key,JSON.stringify({timestamp:Date.now(),data}))}catch{/* runtime fetch remains available */}}
export async function loadExerciseMediaDataset():Promise<FreeExerciseRecord[]>{if(freeDatasetPromise)return freeDatasetPromise;const cached=readCache<FreeExerciseRecord[]>(FREE_CACHE_KEY);if(cached)return(freeDatasetPromise=Promise.resolve(cached));freeDatasetPromise=fetch(FREE_DATASET_URL,{cache:"force-cache"}).then(async response=>{if(!response.ok)throw new Error(`Exercise dataset HTTP ${response.status}`);const data=(await response.json()) as FreeExerciseRecord[];if(!Array.isArray(data))throw new Error("Exercise dataset format invalid");writeCache(FREE_CACHE_KEY,data);return data}).catch(error=>{freeDatasetPromise=null;throw error});return freeDatasetPromise}
async function loadWgerDataset():Promise<WgerExercise[]>{if(wgerDatasetPromise)return wgerDatasetPromise;const cached=readCache<WgerExercise[]>(WGER_CACHE_KEY);if(cached)return(wgerDatasetPromise=Promise.resolve(cached));wgerDatasetPromise=(async()=>{const collected:WgerExercise[]=[];let next:string|null=WGER_DATASET_URL;for(let page=0;page<8&&next;page++){const response=await fetch(next,{cache:"force-cache"});if(!response.ok)throw new Error(`wger API HTTP ${response.status}`);const payload=(await response.json()) as WgerResponse;if(Array.isArray(payload.results))collected.push(...payload.results);next=payload.next||null}writeCache(WGER_CACHE_KEY,collected);return collected})().catch(error=>{wgerDatasetPromise=null;throw error});return wgerDatasetPromise}
export const DUOTONE_IMAGE_STYLE:CSSProperties={filter:"grayscale(1) contrast(1.35) brightness(.98)"};
export const DUOTONE_OVERLAY_STYLE:CSSProperties={background:"linear-gradient(135deg,rgba(255,106,0,.78),rgba(11,15,20,.88))",mixBlendMode:"color"};

type MediaRule={required:string[];equipment?:string[];forbidden?:string[]};
const MEDIA_RULES:Record<string,MediaRule>={
bench_press:{required:["bench","press"],equipment:["barbell"]},incline_dumbbell:{required:["incline","dumbbell","press"],equipment:["dumbbell"]},cable_crossover:{required:["cable","crossover"],equipment:["cable"]},dips_chest:{required:["dip"],equipment:["body weight","bodyweight"],forbidden:["bench dip","chair dip"]},lat_pulldown:{required:["lat","pulldown"],equipment:["cable","leverage machine"]},bent_over_row:{required:["barbell","row"],equipment:["barbell"]},seated_cable_row:{required:["seated","cable","row"],equipment:["cable"]},pullups_bodyweight:{required:["pull","up"],equipment:["body weight","bodyweight"],forbidden:["chin up","muscle up"]},overhead_press:{required:["overhead","press"],equipment:["barbell"]},lateral_raises:{required:["lateral","raise"],equipment:["dumbbell"]},face_pulls:{required:["face","pull"],equipment:["cable"]},squat_barbell:{required:["barbell","squat"],equipment:["barbell"]},leg_press:{required:["leg","press"],equipment:["leverage machine","machine"]},romanian_deadlift:{required:["romanian","deadlift"],equipment:["barbell","dumbbell"]},bulgarian_split_squat:{required:["bulgarian","split","squat"],equipment:["dumbbell","body weight","bodyweight"]},barbell_curl:{required:["barbell","curl"],equipment:["barbell","ez barbell"]},hammer_curl:{required:["hammer","curl"],equipment:["dumbbell"]},triceps_pushdown:{required:["triceps","pushdown"],equipment:["cable"]},plank_abs:{required:["plank"],equipment:["body weight","bodyweight"]},hanging_leg_raise:{required:["hanging","leg","raise"],equipment:["body weight","bodyweight"]}};
function exerciseKey(exerciseId="",exerciseName=""):string|undefined{const id=normalize(exerciseId.replace(/_/g," ")).replace(/ /g,"_");if(MEDIA_RULES[id])return id;const name=normalize(exerciseName);const aliases:Array<[RegExp,string]>=[[/developpe couche.*barre|barbell bench press/,"bench_press"],[/developpe incline.*halteres|incline dumbbell/,"incline_dumbbell"],[/ecarte.*poulie|cable crossover/,"cable_crossover"],[/dips.*barres paralleles/,"dips_chest"],[/tirage vertical.*lat|lat pulldown/,"lat_pulldown"],[/tirage buste penche.*barre|barbell.*row/,"bent_over_row"],[/rowing assis.*poulie|seated cable row/,"seated_cable_row"],[/tractions strictes|pull ups|pull up/,"pullups_bodyweight"],[/developpe militaire|overhead press/,"overhead_press"],[/elevations laterales|lateral raise/,"lateral_raises"],[/face pulls|face pull/,"face_pulls"],[/squat arriere.*barre|back squat/,"squat_barbell"],[/presse a cuisses|leg press/,"leg_press"],[/souleve de terre roumain|romanian deadlift/,"romanian_deadlift"],[/squat bulgare|bulgarian split/,"bulgarian_split_squat"],[/curl biceps.*barre|barbell curl/,"barbell_curl"],[/curl marteau|hammer curl/,"hammer_curl"],[/extension triceps.*corde|triceps pushdown/,"triceps_pushdown"],[/gainage ventral|plank/,"plank_abs"],[/releve de jambes suspendu|hanging leg raise/,"hanging_leg_raise"]];return aliases.find(([pattern])=>pattern.test(name))?.[1]}
function recordText(record:FreeExerciseRecord):string{return normalize(`${record.name} ${record.equipment||""} ${(record.primaryMuscles||[]).join(" ")} ${(record.secondaryMuscles||[]).join(" ")}`)}
function strictScore(key:string,record:FreeExerciseRecord):number{const rule=MEDIA_RULES[key];if(!rule)return 0;const text=recordText(record);if(rule.forbidden?.some(term=>text.includes(normalize(term))))return 0;if(!rule.required.every(term=>text.includes(normalize(term))))return 0;if(rule.equipment&&!rule.equipment.some(equipment=>normalize(record.equipment||"").includes(normalize(equipment))))return 0;return 100+rule.required.length*8+(rule.equipment?.length?15:0)}
function wgerText(record:WgerExercise):string{return normalize(`${record.name||""} ${record.description||""} ${record.category?.name||""} ${(record.equipment||[]).map(e=>e.name||"").join(" ")} ${(record.muscles||[]).map(m=>m.name_en||m.name||"").join(" ")}`)}
function wgerIsCcBySa(record:WgerExercise):boolean{const license=normalize(`${record.license?.short_name||""} ${record.license?.full_name||""}`);return license.includes("cc by sa")||license.includes("creative commons attribution share alike")}
function wgerScore(key:string,record:WgerExercise):number{if(!record.images?.length||!wgerIsCcBySa(record))return 0;const rule=MEDIA_RULES[key];if(!rule)return 0;const text=wgerText(record);if(rule.forbidden?.some(term=>text.includes(normalize(term))))return 0;if(!rule.required.every(term=>text.includes(normalize(term))))return 0;if(rule.equipment&&!rule.equipment.some(e=>text.includes(normalize(e))))return 0;return 110+rule.required.length*8}
function toWgerAsset(record:WgerExercise,score:number):ExerciseMediaAsset|null{const images=(record.images||[]).map(image=>image.image).filter((image):image is string=>Boolean(image));if(!images.length)return null;return{id:`wger-${record.id}`,name:record.name||"Exercice wger",images,equipment:record.equipment?.map(e=>e.name||"").filter(Boolean).join(", "),primaryMuscles:record.muscles?.map(m=>m.name_en||m.name||"").filter(Boolean),score,source:"wger.de",attribution:`Source : wger.de${record.license_author?` — ${record.license_author}`:""}`}}
export async function findExerciseMedia(exerciseId?:string,exerciseName?:string):Promise<ExerciseMediaAsset|null>{const key=exerciseKey(exerciseId,exerciseName);if(!key)return null;const free=await loadExerciseMediaDataset();const freeRanked=free.map(item=>({item,score:strictScore(key,item)})).filter(x=>x.score>=100).sort((a,b)=>b.score-a.score);if(freeRanked[0]){const best=freeRanked[0];return{id:best.item.id,name:best.item.name,images:(best.item.images||[]).map(image=>`${FREE_IMAGE_BASE_URL}${image}`),equipment:best.item.equipment,primaryMuscles:best.item.primaryMuscles,score:best.score,source:"free-exercise-db",attribution:"Free Exercise DB — public domain"}}try{const wger=await loadWgerDataset();const ranked=wger.map(item=>({item,score:wgerScore(key,item)})).filter(x=>x.score>=110).sort((a,b)=>b.score-a.score);return ranked[0]?toWgerAsset(ranked[0].item,ranked[0].score):null}catch{return null}}
export function exercisePlaceholderUrl(exerciseName:string):string{const label=encodeURIComponent((exerciseName||"Exercice").slice(0,42));return `https://placehold.co/960x640/0B0F14/FF6A00/png?text=${label}`}

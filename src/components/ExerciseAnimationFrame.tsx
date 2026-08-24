import React,{useEffect,useState} from "react";
import { ExerciseMediaAnimation } from "./ExerciseMediaAnimation";
import { PremiumExerciseIllustrationV7 } from "./PremiumExerciseIllustrationV7";
import { findExerciseGif } from "../data/exerciseGifResolver";
import { resolveExerciseAnimationId } from "../data/exerciseAnimationMap";

interface ExerciseAnimationFrameProps { exerciseId?:string; exerciseName?:string; muscleGroup?:string; reps?:string; videoSrc?:string; }

export const ExerciseAnimationFrame:React.FC<ExerciseAnimationFrameProps>=({exerciseId,exerciseName="Exercice",muscleGroup="Mouvement",reps,videoSrc})=>{
 const [gif,setGif]=useState<string|null>(null); const [gifFailed,setGifFailed]=useState(false);
 const resolvedId=resolveExerciseAnimationId(exerciseId,exerciseName);
 useEffect(()=>{let alive=true;setGif(null);setGifFailed(false);findExerciseGif(exerciseId,exerciseName).then(a=>{if(alive&&a)setGif(a.gifUrl)}).catch(()=>{});return()=>{alive=false}},[exerciseId,exerciseName]);
 if(gif&&!gifFailed)return <div className="relative h-full min-h-[210px] w-full overflow-hidden rounded-2xl bg-[#070B10]"><img src={gif} alt={`Démonstration : ${exerciseName}`} onError={()=>setGifFailed(true)} className="h-full w-full object-contain p-2 sm:p-4" loading="eager"/><div className="pointer-events-none absolute inset-x-2 top-2 flex items-center justify-between gap-2 sm:inset-x-3"><div className="rounded-xl border border-white/10 bg-black/65 px-2.5 py-2 text-[9px] font-black uppercase tracking-wider text-white/80 backdrop-blur-md">Animation GIF • mouvement exact</div>{reps&&<div className="rounded-xl border border-white/10 bg-black/65 px-2.5 py-2 text-[10px] font-black text-white">{reps}</div>}</div></div>;
 if(resolvedId)return <div className="relative h-full min-h-[210px] w-full overflow-hidden rounded-2xl bg-[#070B10]"><PremiumExerciseIllustrationV7 exerciseId={resolvedId} exerciseName={exerciseName} muscleGroup={muscleGroup}/><div className="pointer-events-none absolute inset-x-2 top-2 flex items-center justify-between gap-2 sm:inset-x-3"><div className="rounded-xl border border-white/10 bg-black/65 px-2.5 py-2 text-[9px] font-black uppercase tracking-wider text-white/80 backdrop-blur-md">Animation FysiqForge • mouvement adapté</div>{reps&&<div className="rounded-xl border border-white/10 bg-black/65 px-2.5 py-2 text-[10px] font-black text-white">{reps}</div>}</div></div>;
 if(videoSrc)return <div className="relative h-full min-h-[210px] w-full overflow-hidden rounded-2xl bg-[#070B10]"><video src={videoSrc} autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-contain" aria-label={`Démonstration vidéo : ${exerciseName}`}/></div>;
 return <ExerciseMediaAnimation exerciseId={exerciseId} exerciseName={exerciseName} muscleGroup={muscleGroup} reps={reps}/>;
};
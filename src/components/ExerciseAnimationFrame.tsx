import React,{useEffect,useState} from "react";
import {findVerifiedExerciseMedia,type VerifiedExerciseMedia} from "../data/verifiedExerciseMedia";
import {findWikimediaExerciseMedia,type WikimediaExerciseMedia} from "../data/wikimediaExerciseMedia";
import {WorkoutGuideMedia} from "./WorkoutGuideMedia";

interface ExerciseAnimationFrameProps {exerciseId?:string;exerciseName?:string;muscleGroup?:string;reps?:string;videoSrc?:string}

export const ExerciseAnimationFrame:React.FC<ExerciseAnimationFrameProps>=({exerciseId,exerciseName="Exercice",muscleGroup="Mouvement",reps,videoSrc})=>{
 const [media,setMedia]=useState<VerifiedExerciseMedia|null>(null);
 const [gif,setGif]=useState<WikimediaExerciseMedia|null>(null);
 const [frame,setFrame]=useState<0|1>(0);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{const exact=findVerifiedExerciseMedia(exerciseId||"",exerciseName);setMedia(exact);setGif(exact?null:findWikimediaExerciseMedia(exerciseName));setFrame(0);setFailed(false)},[exerciseId,exerciseName]);
 useEffect(()=>{if(!media)return;const t=window.setInterval(()=>setFrame(v=>v===0?1:0),650);return()=>window.clearInterval(t)},[media]);
 if(media&&!failed){const src=frame===0?media.frame0Url:media.frame1Url;return <div className="relative h-full min-h-[210px] w-full overflow-hidden rounded-2xl bg-[#070B10]"><img src={src} alt={`Démonstration : ${exerciseName}`} onError={()=>setFailed(true)} className="h-full w-full object-contain p-2 sm:p-4" loading="eager" decoding="async"/><div className="pointer-events-none absolute inset-x-2 top-2 flex items-center justify-between gap-2 sm:inset-x-3"><div className="rounded-xl border border-white/10 bg-black/65 px-2.5 py-2 text-[9px] font-black uppercase tracking-wider text-white/85 backdrop-blur-md">Démonstration validée</div>{reps&&<div className="rounded-xl border border-white/10 bg-black/65 px-2.5 py-2 text-[10px] font-black text-white">{reps}</div>}</div><div className="pointer-events-none absolute inset-x-2 bottom-2 sm:inset-x-3"><div className="inline-flex rounded-lg bg-black/70 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white/65">{muscleGroup}</div></div></div>}
 if(gif&&!failed)return <div className="relative h-full min-h-[210px] w-full overflow-hidden rounded-2xl bg-[#070B10]"><img src={gif.animationUrl} alt={`Animation : ${exerciseName}`} onError={()=>setFailed(true)} className="h-full w-full object-contain" loading="eager" decoding="async"/><div className="pointer-events-none absolute inset-x-2 top-2 sm:inset-x-3"><div className="inline-flex rounded-xl border border-white/10 bg-black/65 px-2.5 py-2 text-[9px] font-black uppercase tracking-wider text-white/85 backdrop-blur-md">Animation réelle • {gif.sourceLabel}</div></div></div>;
 if(videoSrc)return <div className="relative h-full min-h-[210px] w-full overflow-hidden rounded-2xl bg-[#070B10]"><video src={videoSrc} autoPlay muted loop playsInline preload="auto" className="h-full w-full object-contain" aria-label={`Démonstration vidéo : ${exerciseName}`}/></div>;
 return <WorkoutGuideMedia exerciseName={exerciseName} muscleGroup={muscleGroup} reps={reps}/>;
};

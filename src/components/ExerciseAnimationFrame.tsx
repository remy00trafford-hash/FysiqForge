import React,{useEffect,useState} from "react";
import { findVerifiedExerciseMedia, type VerifiedExerciseMedia } from "../data/verifiedExerciseMedia";

interface ExerciseAnimationFrameProps { exerciseId?:string; exerciseName?:string; muscleGroup?:string; reps?:string; videoSrc?:string; }

export const ExerciseAnimationFrame:React.FC<ExerciseAnimationFrameProps>=({exerciseId,exerciseName="Exercice",muscleGroup="Mouvement",reps,videoSrc})=>{
 const [media,setMedia]=useState<VerifiedExerciseMedia|null>(null);
 const [frame,setFrame]=useState<0|1>(0);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{const exact=findVerifiedExerciseMedia(exerciseId||"",exerciseName);setMedia(exact);setFrame(0);setFailed(false)},[exerciseId,exerciseName]);
 useEffect(()=>{if(!media)return;const timer=window.setInterval(()=>setFrame(current=>current===0?1:0),650);return()=>window.clearInterval(timer)},[media]);
 if(media&&!failed){const src=frame===0?media.frame0Url:media.frame1Url;return <div className="relative h-full min-h-[210px] w-full overflow-hidden rounded-2xl bg-[#070B10]"><img src={src} alt={`Démonstration : ${exerciseName}`} onError={()=>setFailed(true)} className="h-full w-full object-contain p-2 sm:p-4" loading="eager" decoding="async"/><div className="pointer-events-none absolute inset-x-2 top-2 flex items-center justify-between gap-2 sm:inset-x-3"><div className="rounded-xl border border-white/10 bg-black/65 px-2.5 py-2 text-[9px] font-black uppercase tracking-wider text-white/80 backdrop-blur-md">Démonstration • mouvement validé</div>{reps&&<div className="rounded-xl border border-white/10 bg-black/65 px-2.5 py-2 text-[10px] font-black text-white">{reps}</div>}</div><div className="pointer-events-none absolute inset-x-2 bottom-2 sm:inset-x-3"><div className="inline-flex rounded-lg bg-black/70 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white/60">{muscleGroup}</div></div></div>}
 if(videoSrc)return <div className="relative h-full min-h-[210px] w-full overflow-hidden rounded-2xl bg-[#070B10]"><video src={videoSrc} autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-contain" aria-label={`Démonstration vidéo : ${exerciseName}`}/></div>;
 return <div className="relative flex h-full min-h-[210px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#070B10]"><div className="mx-5 max-w-sm rounded-xl border border-white/10 bg-black/40 px-4 py-4 text-center"><div className="text-[9px] font-black uppercase tracking-wider text-white/45">Démonstration indisponible</div><div className="mt-1 text-xs font-semibold text-white/75">Aucune animation validée n'est disponible pour cet exercice.</div></div></div>;
};
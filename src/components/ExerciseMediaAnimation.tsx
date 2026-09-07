import React,{useEffect,useState} from "react";
import {findVerifiedExerciseMedia,type VerifiedExerciseMedia} from "../data/verifiedExerciseMedia";
import {findWikimediaExerciseMedia,type WikimediaExerciseMedia} from "../data/wikimediaExerciseMedia";
import {DUOTONE_IMAGE_STYLE,DUOTONE_OVERLAY_STYLE} from "../data/exerciseMediaResolver";
import {WorkoutGuideMedia} from "./WorkoutGuideMedia";

type Props={exerciseId?:string;exerciseName?:string;muscleGroup?:string;reps?:string};

export const ExerciseMediaAnimation:React.FC<Props>=({exerciseId="",exerciseName="Exercice",muscleGroup="Mouvement",reps})=>{
 const [verified,setVerified]=useState<VerifiedExerciseMedia|null>(null);
 const [gif,setGif]=useState<WikimediaExerciseMedia|null>(null);
 const [frame,setFrame]=useState<0|1>(0);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{const exact=findVerifiedExerciseMedia(exerciseId,exerciseName);setVerified(exact);setGif(exact?null:findWikimediaExerciseMedia(exerciseName));setFrame(0);setFailed(false)},[exerciseId,exerciseName]);
 useEffect(()=>{if(!verified)return;const t=window.setInterval(()=>setFrame(v=>v===0?1:0),650);return()=>window.clearInterval(t)},[verified]);
 if(gif&&!failed)return <div className="relative flex h-full min-h-[280px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#070B10]"><img src={gif.animationUrl} alt={`Animation de ${exerciseName}`} onError={()=>setFailed(true)} className="h-full w-full object-contain" loading="eager" decoding="async"/><div className="pointer-events-none absolute inset-x-3 top-3"><div className="rounded-xl border border-white/10 bg-black/65 px-3 py-2 text-[9px] font-black uppercase tracking-wider text-white/80 backdrop-blur-md">Animation réelle • {gif.sourceLabel}</div></div></div>;
 if(!verified||failed)return <WorkoutGuideMedia exerciseName={exerciseName} muscleGroup={muscleGroup} reps={reps}/>;
 const currentFrame=frame===0?verified.frame0Url:verified.frame1Url;
 return <div className="relative flex h-full min-h-[280px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#070B10]"><img src={currentFrame} alt={`Démonstration de ${exerciseName}`} onError={()=>setFailed(true)} className="h-full w-full object-contain p-5 sm:p-8" style={DUOTONE_IMAGE_STYLE} loading="eager" decoding="async"/><div className="pointer-events-none absolute inset-0" style={DUOTONE_OVERLAY_STYLE}/><div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2"><div className="rounded-xl border border-white/10 bg-black/65 px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-white/80">Média validé</div>{reps&&<div className="rounded-xl border border-white/10 bg-black/65 px-3 py-2 text-xs font-black text-white">{reps}</div>}</div><div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between gap-2"><div className="rounded-lg bg-black/70 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider text-white/80">{muscleGroup}</div><div className="rounded-lg bg-black/70 px-2.5 py-1.5 text-[8px] font-black text-white/70">2 frames</div></div></div>;
};

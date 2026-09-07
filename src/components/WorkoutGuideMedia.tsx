import React,{useEffect,useState} from "react";
import {findWorkoutGuideMedia} from "../data/workoutGuideMedia";

type Props={exerciseName:string;muscleGroup?:string;reps?:string;className?:string};

export const WorkoutGuideMedia:React.FC<Props>=({exerciseName,muscleGroup,reps,className=""})=>{
 const [media,setMedia]=useState<any|null>(null);
 const [frame,setFrame]=useState(0);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{let alive=true;setMedia(null);setFrame(0);setFailed(false);findWorkoutGuideMedia(exerciseName).then(x=>{if(alive)setMedia(x)}).catch(()=>{if(alive)setFailed(true)});return()=>{alive=false}},[exerciseName]);
 useEffect(()=>{if(!media)return;const t=window.setInterval(()=>setFrame(v=>(v+1)%media.images.length),700);return()=>window.clearInterval(t)},[media]);
 if(!media||failed)return null;
 return <div className={`relative flex h-full min-h-[210px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#070B10] ${className}`}>
   <img src={media.images[frame]} alt={`Démonstration de ${exerciseName}`} onError={()=>setFailed(true)} className="h-full w-full object-contain p-3 sm:p-5" loading="eager" decoding="async" draggable={false}/>
   <div className="pointer-events-none absolute inset-x-2 top-2 flex items-center justify-between gap-2 sm:inset-x-3">
     <div className="max-w-[72%] truncate rounded-xl border border-white/10 bg-black/70 px-2.5 py-2 text-[9px] font-black uppercase tracking-wider text-white/85 backdrop-blur-md">Démonstration • mouvement réel</div>
     {reps&&<div className="shrink-0 rounded-xl border border-white/10 bg-black/70 px-2.5 py-2 text-[9px] font-black text-white">{reps}</div>}
   </div>
   <div className="pointer-events-none absolute inset-x-2 bottom-2 flex items-center justify-between gap-2 sm:inset-x-3">
     <span className="rounded-lg bg-black/70 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-white/70">{muscleGroup||"Mouvement"}</span>
     <span className="rounded-lg bg-black/70 px-2 py-1 text-[8px] font-black text-white/55">Workout Guide • CC BY-SA 4.0</span>
   </div>
 </div>;
};

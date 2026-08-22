import React, { useState } from "react";
import { Dumbbell, User, Lock, Award, Bot, Menu, X, Globe, Coins } from "lucide-react";
import { Step } from "../types";
import { Language } from "../utils/translator";

interface HeaderProps { currentStep: Step; onNavigateStep: (step: Step) => void; selectedCurrency: "FCFA"|"USD"|"EUR"; onCurrencyChange: (curr:"FCFA"|"USD"|"EUR")=>void; language: Language; onLanguageChange:(lang:Language)=>void; userEmail:string|null; onOpenAdmin:()=>void; onOpenCoachChat:()=>void; onOpenFaq:()=>void; onOpenLogin:()=>void; isUnlocked:boolean; }

const GoogleMark=()=> <svg aria-hidden="true" viewBox="0 0 24 24" className="w-4 h-4 shrink-0"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>;

export const Header:React.FC<HeaderProps>=({currentStep,onNavigateStep,selectedCurrency,onCurrencyChange,language,onLanguageChange,userEmail,onOpenAdmin,onOpenCoachChat,onOpenFaq,onOpenLogin,isUnlocked})=>{
 const [menu,setMenu]=useState(false);
 const go=(fn:()=>void)=>{fn();setMenu(false)};
 return <header className="sticky top-0 z-40 bg-[#0D0D11]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-4 py-2">
  <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 min-w-0">
   <button onClick={()=>onNavigateStep("LANDING")} className="flex items-center gap-2 min-w-0 text-left group" aria-label="FysiqForge accueil">
    <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-br from-[#FF5500] to-[#FF2200] flex items-center justify-center shadow-lg"><Dumbbell className="w-5 h-5 text-white -rotate-12"/></div>
    <span className="font-extrabold text-base sm:text-xl tracking-wider text-white uppercase font-display truncate">FYSIQ<span className="text-[#FF5500]">FORGE</span></span>
   </button>
   <div className="hidden xl:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs">
    <span className={currentStep==="LANDING"?"bg-[#FF5500] text-white px-2 py-1 rounded-full":"text-gray-400"}>1. Accueil</span><span className="text-gray-600">→</span><span className={currentStep==="PHOTO"||currentStep==="QUESTIONNAIRE"?"bg-[#FF5500] text-white px-2 py-1 rounded-full":"text-gray-400"}>2. Photo & Quiz</span><span className="text-gray-600">→</span><span className={currentStep==="AHA_PREVIEW"?"bg-[#FF5500] text-white px-2 py-1 rounded-full":"text-gray-400"}>3. Aperçu</span><span className="text-gray-600">→</span><span className={currentStep==="FULL_PLAN"?"bg-emerald-500 text-white px-2 py-1 rounded-full":"text-gray-400"}>4. Coaching {isUnlocked&&"✓"}</span>
   </div>
   <div className="flex items-center gap-1.5 shrink-0">
    <button onClick={onOpenLogin} className="flex items-center gap-1.5 border border-white/15 bg-white text-[#202124] hover:bg-gray-100 px-2.5 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-bold shadow-sm min-h-9" title="Se connecter avec Google"><GoogleMark/><span>Connectez-vous</span></button>
    <button onClick={()=>setMenu(v=>!v)} aria-label="Ouvrir le menu" aria-expanded={menu} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white"><Menu className="w-5 h-5"/></button>
   </div>
  </div>
  {menu&&<div className="absolute right-3 sm:right-4 top-[calc(100%+8px)] w-[min(320px,calc(100vw-24px))] bg-[#14141B] border border-white/15 rounded-2xl p-4 shadow-2xl z-50 space-y-3 animate-fade-slide">
   <div className="flex items-center justify-between pb-2 border-b border-white/10"><span className="text-[11px] uppercase tracking-wider font-black text-gray-300">Menu FysiqForge</span><button onClick={()=>setMenu(false)} className="p-1 rounded-lg hover:bg-white/10"><X className="w-4 h-4"/></button></div>
   <button onClick={()=>go(onOpenFaq)} className="w-full text-left px-3 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-bold">❓ FAQ & Support</button>
   <button onClick={()=>go(onOpenCoachChat)} className="w-full text-left px-3 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-bold">🤖 Coach IA</button>
   <div className="border-t border-white/10 pt-3 space-y-2"><div className="flex items-center gap-2 text-xs text-gray-400"><Globe className="w-4 h-4 text-[#FF5500]"/>Langue</div><div className="grid grid-cols-2 gap-2">{(["FR","EN"] as const).map(l=><button key={l} onClick={()=>onLanguageChange(l)} className={`px-3 py-2 rounded-xl text-xs font-bold ${language===l?"bg-[#FF5500] text-white":"bg-white/5 text-gray-300"}`}>{l==="FR"?"Français":"English"}</button>)}</div></div>
   <div className="border-t border-white/10 pt-3 space-y-2"><div className="flex items-center gap-2 text-xs text-gray-400"><Coins className="w-4 h-4 text-amber-400"/>Devise</div><div className="grid grid-cols-3 gap-2">{(["FCFA","USD","EUR"] as const).map(c=><button key={c} onClick={()=>onCurrencyChange(c)} className={`px-2 py-2 rounded-xl text-[11px] font-bold ${selectedCurrency===c?"bg-[#FF5500] text-white":"bg-white/5 text-gray-300"}`}>{c}</button>)}</div></div>
   {isUnlocked&&<button onClick={()=>go(()=>onNavigateStep("FULL_PLAN"))} className="w-full flex items-center gap-2 px-3 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-bold"><Award className="w-4 h-4"/>Mon plan débloqué</button>}
   {userEmail&&<div className="text-[11px] text-gray-400 px-3 truncate"><User className="w-3.5 h-3.5 inline mr-1 text-[#FF5500]"/>{userEmail}</div>}
   <button onClick={()=>go(onOpenAdmin)} className="w-full text-left px-3 py-2 rounded-xl bg-white/5 text-gray-400 text-xs font-bold"><Lock className="w-3.5 h-3.5 inline mr-2"/>Dashboard Admin</button>
  </div>}
 </header>;
};

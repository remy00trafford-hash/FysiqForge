import React, { useState } from "react";
import { ChatMessage, UserAnswers } from "../types";
import { MessageSquare, Send, Sparkles, Bot, User, Volume2, VolumeX, HeartPulse, Square, Lock } from "lucide-react";
import { speakText, stopSpeech } from "../utils/speechUtils";

interface AiCoachChatProps { userAnswers?: UserAnswers; tierId?: string; }

export const AiCoachChat: React.FC<AiCoachChatProps> = ({ userAnswers, tierId }) => {
  const hasCoachAccess = tierId === "performance" || tierId === "elite";
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "m-1", sender: "coach", text: `Salut ! Je suis ton Coach IA FysiqForge. Je connais ton objectif (${userAnswers?.objective || "Musculation"}), ton matériel (${userAnswers?.equipment || "Salle équipée"}) et ton programme.`, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const handleSpeakMessage = (msgId: string, text: string) => {
    if (!hasCoachAccess) return;
    if (speakingMsgId === msgId) { stopSpeech(); setSpeakingMsgId(null); return; }
    setSpeakingMsgId(msgId);
    speakText(text, () => setSpeakingMsgId(msgId), () => setSpeakingMsgId(null), () => setSpeakingMsgId(null));
  };

  const handleSendMessage = async (textToSend?: string) => {
    if (!hasCoachAccess) return;
    const query = textToSend || inputQuery;
    if (!query.trim()) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, sender: "user", text: query, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/coach", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: query, userContext: userAnswers }) });
      const data = await res.json();
      const coachText = data.answer || "Pense à garder un mouvement propre et contrôlé !";
      const coachMsg: ChatMessage = { id: `c-${Date.now()}`, sender: "coach", text: coachText, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
      setMessages((prev) => [...prev, coachMsg]);
      if (isVoiceEnabled) { setSpeakingMsgId(coachMsg.id); speakText(coachText, () => setSpeakingMsgId(coachMsg.id), () => setSpeakingMsgId(null), () => setSpeakingMsgId(null)); }
    } catch {
      setMessages((prev) => [...prev, { id: `c-err-${Date.now()}`, sender: "coach", text: "Désolé, une petite perturbation réseau empêche la réponse instantanée. Réessaie dans un instant !", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    } finally { setIsLoading(false); }
  };

  if (!hasCoachAccess) {
    return (
      <div className="bg-[#16161E] border border-white/10 rounded-3xl p-8 min-h-[420px] flex items-center justify-center text-center">
        <div className="max-w-md space-y-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"><Lock className="w-7 h-7 text-gray-400" /></div>
          <h3 className="text-xl font-black uppercase text-white">Coach IA réservé aux plans Performance & Élite</h3>
          <p className="text-sm text-gray-400">Le Plan Essentiel comprend le programme et les consignes d'exécution. Passe au Plan Performance pour débloquer le Coach IA 24/7.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#16161E] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col h-[650px]">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-[#FF5500] text-white flex items-center justify-center"><Bot className="w-5 h-5" /></div><div><h3 className="font-extrabold text-white text-base uppercase">Coach IA FysiqForge (Voix Active)</h3><p className="text-xs text-emerald-400 font-medium">Assistant Vocal Entraînement & Nutrition</p></div></div>
        <button onClick={() => { if (isVoiceEnabled) stopSpeech(); setIsVoiceEnabled(!isVoiceEnabled); }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${isVoiceEnabled ? "bg-[#FF5500]/20 text-[#FF5500] border-[#FF5500]/40" : "bg-white/5 text-gray-400 border-white/10"}`}>
          {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />} {isVoiceEnabled ? "Voix ON" : "Voix MUTE"}
        </button>
      </div>
      <div className="bg-amber-950/30 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-200 flex items-start gap-2 shrink-0"><HeartPulse className="w-4 h-4 text-amber-400 shrink-0" /><p><strong>Rappel de Sécurité</strong> : En cas de douleur aiguë ou de blessure, consulte un professionnel de santé.</p></div>
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => { const speaking = speakingMsgId === msg.id; return <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}><div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.sender === "user" ? "bg-white text-gray-900" : "bg-[#FF5500] text-white"}`}>{msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}</div><div className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${msg.sender === "user" ? "bg-[#FF5500] text-white" : "bg-[#121218] text-gray-200 border border-white/10"}`}><div className="whitespace-pre-wrap">{msg.text}</div>{msg.sender === "coach" && <button onClick={() => handleSpeakMessage(msg.id, msg.text)} className="mt-2 flex items-center gap-1 text-[#FF5500] text-[10px] font-bold">{speaking ? <Square className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />} {speaking ? "Arrêter" : "Écouter"}</button>}</div></div>; })}
        {isLoading && <div className="text-xs text-gray-400 pl-11">Le Coach IA formule ses conseils...</div>}
      </div>
      <div className="shrink-0 space-y-2 pt-2 border-t border-white/10"><div className="flex flex-wrap gap-2">{["Comment remplacer le développé couché ?", "Que manger après ma séance ?", "Comment éviter d'avoir mal à l'épaule ?"].map((p) => <button key={p} onClick={() => handleSendMessage(p)} className="bg-white/5 border border-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-lg">💡 {p}</button>)}</div><div className="flex items-center gap-2"><input value={inputQuery} onChange={(e) => setInputQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} placeholder="Pose ta question..." className="flex-1 bg-[#121218] border border-white/15 rounded-xl px-4 py-3 text-xs text-white"/><button onClick={() => handleSendMessage()} disabled={isLoading || !inputQuery.trim()} className="bg-[#FF5500] text-white p-3 rounded-xl disabled:opacity-40"><Send className="w-4 h-4" /></button></div></div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { ChatMessage, UserAnswers } from "../types";
import { MessageSquare, Send, Sparkles, ShieldAlert, Bot, User, Volume2, VolumeX, HeartPulse, Square } from "lucide-react";
import { speakText, stopSpeech } from "../utils/speechUtils";

interface AiCoachChatProps {
  userAnswers?: UserAnswers;
  tierId?: string;
}

export const AiCoachChat: React.FC<AiCoachChatProps> = ({ userAnswers, tierId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      sender: "coach",
      text: `Salut ! Je suis ton Coach IA FysiqForge. Je connais ton objectif (${userAnswers?.objective || "Musculation"}), ton matériel (${userAnswers?.equipment || "Salle équipée"}) et ton programme.\n\nUne question sur l'exécution d'un exercice, une adaptation de charge ou un conseil nutrition post-séance ? Pose-la moi ou écoute ma voix !`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const handleSpeakMessage = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      stopSpeech();
      setSpeakingMsgId(null);
    } else {
      setSpeakingMsgId(msgId);
      speakText(
        text,
        () => setSpeakingMsgId(msgId),
        () => setSpeakingMsgId(null),
        () => setSpeakingMsgId(null)
      );
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          userContext: userAnswers
        })
      });

      const data = await res.json();
      const coachText = data.answer || "Pense à garder un mouvement propre et contrôlé !";

      const coachMsg: ChatMessage = {
        id: `c-${Date.now()}`,
        sender: "coach",
        text: coachText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, coachMsg]);

      // Speak automatically if voice enabled
      if (isVoiceEnabled) {
        setSpeakingMsgId(coachMsg.id);
        speakText(
          coachText,
          () => setSpeakingMsgId(coachMsg.id),
          () => setSpeakingMsgId(null),
          () => setSpeakingMsgId(null)
        );
      }
    } catch (err) {
      console.error(err);
      const errorMsgText = "Désolé, une petite perturbation réseau empêche la réponse instantanée. Réessaie dans un instant !";
      const errorMsg: ChatMessage = {
        id: `c-err-${Date.now()}`,
        sender: "coach",
        text: errorMsgText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#16161E] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col h-[650px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF5500] text-white flex items-center justify-center font-bold shadow-lg">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base uppercase font-display flex items-center gap-2">
              Coach IA FysiqForge (Voix Active)
            </h3>
            <p className="text-xs text-emerald-400 font-medium">Assistant Vocal Entraînement & Nutrition</p>
          </div>
        </div>

        {/* Voice Toggle Button */}
        <button
          onClick={() => {
            if (isVoiceEnabled) stopSpeech();
            setIsVoiceEnabled(!isVoiceEnabled);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
            isVoiceEnabled
              ? "bg-[#FF5500]/20 text-[#FF5500] border-[#FF5500]/40"
              : "bg-white/5 text-gray-400 border-white/10"
          }`}
          title="Activer / Désactiver la lecture vocale automatique"
        >
          {isVoiceEnabled ? <Volume2 className="w-4 h-4 text-[#FF5500] animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          <span>{isVoiceEnabled ? "Voix ON" : "Voix MUTE"}</span>
        </button>
      </div>

      {/* Medical Disclaimer Alert */}
      <div className="bg-amber-950/30 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-200 flex items-start gap-2 shrink-0">
        <HeartPulse className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-tight">
          <strong>Rappel de Sécurité</strong> : Le Coach IA donne des conseils sportifs et d'exécution. En cas de douleur aiguë ou de blessure, consultez un professionnel de santé.
        </p>
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => {
          const isSpeakingThis = speakingMsgId === msg.id;
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.sender === "user" ? "bg-white text-gray-900" : "bg-[#FF5500] text-white"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 relative ${
                  msg.sender === "user"
                    ? "bg-[#FF5500] text-white rounded-tr-none font-medium"
                    : "bg-[#121218] text-gray-200 border border-white/10 rounded-tl-none"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                  {msg.sender === "coach" && (
                    <button
                      onClick={() => handleSpeakMessage(msg.id, msg.text)}
                      className={`flex items-center gap-1 font-bold px-2 py-0.5 rounded transition-colors cursor-pointer ${
                        isSpeakingThis
                          ? "bg-[#FF5500] text-white animate-pulse"
                          : "text-[#FF5500] hover:bg-[#FF5500]/20"
                      }`}
                    >
                      {isSpeakingThis ? <Square className="w-3 h-3 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isSpeakingThis ? "Arrêter la voix" : "Écouter le coach"}</span>
                    </button>
                  )}
                  <span className="opacity-60 block ml-auto">{msg.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-400 pl-11">
            <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping" />
            <span>Le Coach IA formule ses conseils personnalisés...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="shrink-0 space-y-2 pt-2 border-t border-white/10">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Questions Fréquentes Rapides :</p>
        <div className="flex flex-wrap gap-2">
          {[
            "Comment remplacer le développé couché ?",
            "Que manger après ma séance ?",
            "Comment éviter d'avoir mal à l'épaule ?"
          ].map((promptText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(promptText)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              💡 {promptText}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Posez votre question sur votre séance, vos charges, votre récupération..."
            className="flex-1 bg-[#121218] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF5500]"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputQuery.trim()}
            className="bg-[#FF5500] hover:bg-[#FF6611] text-white p-3 rounded-xl transition-all disabled:opacity-40 cursor-pointer shadow-lg"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

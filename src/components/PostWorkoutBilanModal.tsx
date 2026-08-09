import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Award, Flame, Star, CheckCircle, X, Sparkles, Smile, MessageSquareQuote, Volume2, Square } from "lucide-react";
import { WorkoutLog } from "../types";
import { speakText, stopSpeech } from "../utils/speechUtils";

interface PostWorkoutBilanModalProps {
  dayTitle: string;
  dayNumber: number;
  onSaveBilan: (log: WorkoutLog) => void;
  onClose: () => void;
}

export const PostWorkoutBilanModal: React.FC<PostWorkoutBilanModalProps> = ({
  dayTitle,
  dayNumber,
  onSaveBilan,
  onClose
}) => {
  const [duration, setDuration] = useState(50);
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState("");
  const [isSpeakingMotivation, setIsSpeakingMotivation] = useState(false);

  const motivationalMessage = "La régularité bat le talent là où le talent oublie de s'entraîner. Félicitations pour cette séance d'exception, ton corps te remerciera demain !";

  useEffect(() => {
    // Fire celebration confetti when opening bilan modal
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const handleToggleMotivationVoice = () => {
    if (isSpeakingMotivation) {
      stopSpeech();
      setIsSpeakingMotivation(false);
    } else {
      setIsSpeakingMotivation(true);
      speakText(
        motivationalMessage,
        () => setIsSpeakingMotivation(true),
        () => setIsSpeakingMotivation(false),
        () => setIsSpeakingMotivation(false)
      );
    }
  };

  const handleSave = () => {
    stopSpeech();
    const newLog: WorkoutLog = {
      id: `log-${Date.now()}`,
      date: new Date().toLocaleDateString("fr-FR"),
      dayNumber,
      dayTitle,
      durationMinutes: duration,
      feelingRating: rating,
      notes: notes || "Excellente séance d'entraînement !",
      caloriesBurned: Math.round(duration * 8.5)
    };
    onSaveBilan(newLog);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#16161E] border border-white/20 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-white shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={() => {
            stopSpeech();
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Celebration */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF5500] to-[#FF2200] mx-auto flex items-center justify-center text-white shadow-xl shadow-[#FF5500]/30 animate-bounce">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black uppercase font-display">SÉANCE TERMINÉE ! 🔥</h3>
          <p className="text-xs text-[#FF5500] font-extrabold uppercase tracking-wider">
            {dayTitle} (Jour {dayNumber})
          </p>
        </div>

        {/* Motivational Quote generated with Voice Button */}
        <div className="bg-[#121218] border border-white/10 p-4 rounded-2xl text-xs text-gray-300 space-y-2 relative">
          <div className="flex items-center justify-between text-[#FF5500] font-bold">
            <span className="flex items-center gap-1.5">
              <MessageSquareQuote className="w-4 h-4" /> Message de Motivation du Coach :
            </span>
            <button
              type="button"
              onClick={handleToggleMotivationVoice}
              className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
                isSpeakingMotivation
                  ? "bg-[#FF5500] text-white border-[#FF5500] animate-pulse"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-[#FF5500]"
              }`}
            >
              {isSpeakingMotivation ? <Square className="w-3 h-3 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isSpeakingMotivation ? "Arrêter" : "Écouter"}</span>
            </button>
          </div>
          <p className="italic leading-relaxed">"{motivationalMessage}"</p>
        </div>

        {/* Rating and Duration Inputs */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-300">Ressenti / Intensité de la séance :</label>
            <div className="flex items-center justify-between bg-[#121218] p-3 rounded-xl border border-white/10">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-lg transition-transform cursor-pointer ${
                    rating >= star ? "text-amber-400 scale-110" : "text-gray-600"
                  }`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-300">Durée réelle (Minutes) :</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full bg-[#121218] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF5500]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-300">Notes / Sensations personnelles :</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Super congestion sur les pecs, charges augmentées sur le développé couché !"
              rows={2}
              className="w-full bg-[#121218] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF5500]"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-[#FF5500] to-[#FF3E00] hover:from-[#FF6611] text-white font-extrabold py-4 rounded-xl text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.01]"
        >
          <CheckCircle className="w-5 h-5" />
          <span>ENREGISTRER MON BILAN DE SÉANCE</span>
        </button>
      </div>
    </div>
  );
};

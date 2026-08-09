import React, { useState } from "react";
import { ExerciseItem } from "../types";
import { X, HelpCircle, CheckCircle, RefreshCw, Bot, Sparkles, Home, ShieldCheck, ArrowRight, PackageCheck } from "lucide-react";

interface EquipmentCheckModalProps {
  exercise: ExerciseItem;
  onClose: () => void;
  onReplaceExercise: (originalExerciseId: string, newExercise: ExerciseItem) => void;
}

export const EquipmentCheckModal: React.FC<EquipmentCheckModalProps> = ({
  exercise,
  onClose,
  onReplaceExercise
}) => {
  const [hasEquipment, setHasEquipment] = useState<boolean | null>(null);
  const [customEnvironment, setCustomEnvironment] = useState<string>("");
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [customAlternative, setCustomAlternative] = useState<ExerciseItem | null>(null);

  // Pre-configured home substitution map
  const getDiyEquipmentGuide = (exName: string) => {
    if (exName.toLowerCase().includes("barre") || exName.toLowerCase().includes("couché") || exName.toLowerCase().includes("press")) {
      return {
        requiredTool: "Barre olympique & Banc de musculation",
        diySuggestions: [
          "Deux bouteilles d'eau (1.5L à 5L) ou bidons de lessive remplis d'eau/sable",
          "Un sac à dos solide chargé avec des livres lourds ou paquets de riz",
          "Deux chaises stables pour faire des Dips ou poser un manche à balai résistant"
        ],
        alternative: {
          id: `${exercise.id}_home`,
          name: "Pompes Pieds Surélevés ou Lourdement Lestées",
          muscleGroup: exercise.muscleGroup,
          sets: exercise.sets,
          reps: "12 - 15 reps",
          restSeconds: 60,
          tips: "Pose tes pieds sur un canapé ou une chaise pour cibler le haut des pecs. Place un sac à dos rempli sur ton dos si c'est trop facile.",
          illustrationUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80",
          executionSteps: [
            "Mets-toi en position de pompe, mains au sol et pieds posés sur une chaise stable.",
            "Gaine les abdominaux et descends le torse près du sol.",
            "Pousse de façon explosive en contractant les pectoraux.",
            "Si tu utilises un sac à dos lesté, vérifie qu'il est bien calé sur tes épaules."
          ]
        }
      };
    } else if (exName.toLowerCase().includes("poulie") || exName.toLowerCase().includes("tirage") || exName.toLowerCase().includes("lat")) {
      return {
        requiredTool: "Machine à Poulie Haute / Câble",
        diySuggestions: [
          "Un élastique de résistance accroché en haut d'une porte avec une ancre",
          "Un manche à balai posé entre deux chaises hautes pour faire du Rowing Inversé",
          "Un sac à dos tenu par la poignée supérieure pour du Tirage Buste Penché"
        ],
        alternative: {
          id: `${exercise.id}_home`,
          name: "Rowing Buste Penché au Sac à Dos / Bouteilles",
          muscleGroup: exercise.muscleGroup,
          sets: exercise.sets,
          reps: "12 - 15 reps",
          restSeconds: 60,
          tips: "Garde le dos bien droit à 45°. Tire le sac ou les deux bouteilles vers les hanches.",
          illustrationUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
          executionSteps: [
            "Penche le buste en avant, genoux légèrement fléchis.",
            "Prends la poignée du sac lourdement chargé de livres.",
            "Tire vers ton bas-ventre en resserrant les omoplates.",
            "Contrôle la descente sur 2 à 3 secondes."
          ]
        }
      };
    } else if (exName.toLowerCase().includes("squat") || exName.toLowerCase().includes("jambes")) {
      return {
        requiredTool: "Cage à Squat & Barre Chargée",
        diySuggestions: [
          "Sac à dos lourd porté sur le torse (Goblet Squat) ou sur le dos",
          "Deux gros bidons d'eau de 5L tenus dans chaque main",
          "Utilisation d'une marche d'escalier pour des Fentes Bulgares"
        ],
        alternative: {
          id: `${exercise.id}_home`,
          name: "Squat Bulgare une Jambe sur Chaise (avec Sac Lesté)",
          muscleGroup: exercise.muscleGroup,
          sets: exercise.sets,
          reps: "10 - 12 reps par jambe",
          restSeconds: 75,
          tips: "Pose le coup de pied arrière sur une chaise. Descends le genou arrière vers le sol sans dépasser la pointe du pied avant.",
          illustrationUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
          executionSteps: [
            "Tiens-toi debout à un grand pas devant une chaise ou canapé.",
            "Pose la pointe d'un pied en arrière sur l'assise.",
            "Fléchis la jambe avant jusqu'à avoir la cuisse parallèle au sol.",
            "Pousse sur le talon avant pour remonter."
          ]
        }
      };
    }

    // Default general home adaptation
    return {
      requiredTool: "Matériel spécifique de salle",
      diySuggestions: [
        "Bouteilles d'eau ou bidons de 1.5L à 5L",
        "Sac à dos chargé de livres ou bouteilles",
        "Élastiques de résistance légers / moyens"
      ],
      alternative: {
        id: `${exercise.id}_home`,
        name: `Adaptation Maison : ${exercise.alternativeExercise || exercise.name}`,
        muscleGroup: exercise.muscleGroup,
        sets: exercise.sets,
        reps: "12 - 15 reps",
        restSeconds: 60,
        tips: "Exécution adaptée au matériel de maison (sac à dos, bouteilles ou poids du corps).",
        illustrationUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
        executionSteps: [
          "Prépare ton matériel de fortune (sac lourd ou bouteilles d'eau).",
          "Adopte une posture stable et gainer la sangle abdominale.",
          "Exécute le mouvement en maintenant une tension constante.",
          "Effectue le nombre de répétitions recommandées."
        ]
      }
    };
  };

  const diyGuide = getDiyEquipmentGuide(exercise.name);

  const handleApplySubstitution = () => {
    const altToUse = customAlternative || diyGuide.alternative;
    onReplaceExercise(exercise.id, altToUse);
    onClose();
  };

  const handleAskCoachForCustomObjects = async () => {
    if (!customEnvironment.trim()) return;
    setIsAiGenerating(true);

    try {
      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Je dois remplacer l'exercice "${exercise.name}". Voici le matériel disponible chez moi : "${customEnvironment}". Propose une variante précise et sécurisée avec ce matériel.`,
          userContext: { equipment: "Maison" }
        })
      });
      const data = await res.json();

      setCustomAlternative({
        id: `${exercise.id}_custom_ai`,
        name: `Variante Personnalisée : ${exercise.name} (Matériel Réel)`,
        muscleGroup: exercise.muscleGroup,
        sets: exercise.sets,
        reps: "12 - 15 reps",
        restSeconds: 60,
        tips: data.answer || "Conseil Coach IA : Mouvement adapté avec ton matériel maison !",
        illustrationUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
        executionSteps: [
          "Mets en place ton équipement de fortune tel que conseillé par le Coach IA.",
          "Garde la forme et la posture bien stables.",
          "Contrôle chaque répétition sans précipiter le geste."
        ]
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#16161E] border border-white/20 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-white shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Interactive Question */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/30 px-3 py-1 rounded-full text-xs font-bold">
            <HelpCircle className="w-4 h-4" />
            <span>Bulle de Vérification Matériel FysiqForge</span>
          </div>

          <h3 className="text-2xl font-black uppercase font-display text-white">
            As-tu cet outil ?
          </h3>

          <div className="bg-[#121218] border border-white/10 p-3.5 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <p className="text-gray-400">Exercice prévu :</p>
              <p className="font-extrabold text-white text-sm">{exercise.name}</p>
            </div>
            <span className="bg-[#FF5500] text-white font-bold px-2.5 py-1 rounded">
              {diyGuide.requiredTool}
            </span>
          </div>
        </div>

        {/* Binary Answer Options */}
        {hasEquipment === null && (
          <div className="space-y-4 pt-2">
            <p className="text-xs text-gray-300">
              Afin de t'assurer une séance optimale, indique si tu possèdes cet équipement ou si tu souhaites que le Coach IA adapte l'exercice avec des objets du quotidien !
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setHasEquipment(true);
                  setTimeout(() => onClose(), 800);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold p-4 rounded-2xl text-sm shadow-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <CheckCircle className="w-6 h-6" />
                <span>OUI, J'AI CET OUTIL !</span>
              </button>

              <button
                onClick={() => setHasEquipment(false)}
                className="bg-[#FF5500] hover:bg-[#FF6611] text-white font-extrabold p-4 rounded-2xl text-sm shadow-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <Home className="w-6 h-6" />
                <span>NON, ADAPTER MON PLAN</span>
              </button>
            </div>
          </div>
        )}

        {/* Confirmation if YES */}
        {hasEquipment === true && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-center space-y-2 animate-in zoom-in-95">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="font-bold text-sm text-emerald-300">Parfait ! L'exercice standard est conservé.</p>
            <p className="text-xs text-gray-400">Prépare tes charges et bonne séance !</p>
          </div>
        )}

        {/* Coach IA Guidance & DIY Equipment if NO */}
        {hasEquipment === false && (
          <div className="space-y-5 animate-in fade-in zoom-in-95">
            <div className="bg-[#121218] border border-amber-500/30 p-4 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase">
                <Bot className="w-4 h-4" />
                <span>Orientation & Astuces du Coach IA :</span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                Pas d'inquiétude ! Voici ce que tu peux chercher autour de toi pour fabriquer/remplacer ton matériel avant ta séance :
              </p>

              <ul className="space-y-1.5 text-xs text-gray-200">
                {diyGuide.diySuggestions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#FF5500] font-black">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Substitution Preview */}
            <div className="bg-gradient-to-r from-[#1A1A24] to-[#121218] border border-[#FF5500]/30 p-4 rounded-2xl space-y-3">
              <span className="text-[10px] uppercase font-black text-[#FF5500]">
                Exercice de Remplacement Proposé :
              </span>
              <p className="font-extrabold text-sm text-white">{diyGuide.alternative.name}</p>
              <p className="text-xs text-gray-300">{diyGuide.alternative.tips}</p>
            </div>

            {/* Custom Object Input (Optional) */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase">
                Ou indique précisément ce que tu as sous la main :
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customEnvironment}
                  onChange={(e) => setCustomEnvironment(e.target.value)}
                  placeholder="Ex: J'ai 2 bombonnes d'eau 5L et un balai..."
                  className="flex-1 bg-[#121218] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                />
                <button
                  onClick={handleAskCoachForCustomObjects}
                  disabled={isAiGenerating || !customEnvironment.trim()}
                  className="bg-[#FF5500] text-white px-3 py-2 rounded-xl text-xs font-bold disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Demander</span>
                </button>
              </div>
            </div>

            {/* Confirm Replacement Button */}
            <button
              onClick={handleApplySubstitution}
              className="w-full bg-gradient-to-r from-[#FF5500] to-[#FF3E00] hover:from-[#FF6611] text-white font-extrabold py-3.5 rounded-xl text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <PackageCheck className="w-5 h-5" />
              <span>APPLIQUER CETTE VARIANTE À MON PLAN</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

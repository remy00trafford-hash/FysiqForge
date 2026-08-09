import React from "react";
import { X, Utensils, Flame, Scale, Check, Apple, HeartPulse, Sparkles } from "lucide-react";
import { UserAnswers } from "../types";

interface NutritionGuideModalProps {
  userAnswers: UserAnswers;
  onClose: () => void;
}

export const NutritionGuideModal: React.FC<NutritionGuideModalProps> = ({ userAnswers, onClose }) => {
  const objective = userAnswers.objective || "Prise de masse (Hypertrophie)";

  // Dynamic Macro Targets
  const getMacroTargets = () => {
    if (objective.includes("Prise de masse")) {
      return {
        calories: 2750,
        proteins: "160g (25%)",
        carbs: "340g (50%)",
        fats: "75g (25%)",
        hydration: "3.5 Litres / jour",
        tagline: "Surplus calorique contrôlé (+300 kcal) pour stimuler la synthèse protéique sans stockage adipeux excessif."
      };
    } else if (objective.includes("Perte de gras")) {
      return {
        calories: 1950,
        proteins: "175g (35%)",
        carbs: "170g (35%)",
        fats: "65g (30%)",
        hydration: "4 Litres / jour",
        tagline: "Déficit calorique modéré (-400 kcal) avec apport élevé en protéines pour préserver le muscle sec."
      };
    }
    return {
      calories: 2350,
      proteins: "150g (30%)",
      carbs: "260g (45%)",
      fats: "70g (25%)",
      hydration: "3 Litres / jour",
      tagline: "Maintien isocalorique pour stimuler la recomposition corporelle et la fermeté."
    };
  };

  const macros = getMacroTargets();

  const mealIdeas = [
    {
      title: "Petit-Déjeuner Énergie & Anabolisme",
      description: "Omelette 3 œufs entiers + 2 blancs, 80g de flocons d'avoine avec lait d'amande et 1 banane coupée."
    },
    {
      title: "Déjeuner Force (Menu Local & Sain)",
      description: "200g de filet de poulet grillé ou poisson braisé, 200g de riz basmati ou banane aloko au four, salade d'avocat."
    },
    {
      title: "Collation Pre-Workout / Post-Workout",
      description: "1 shaker de protéine en poudre ou 200g de fromage blanc + 1 poignée d'amandes et 1 pomme."
    },
    {
      title: "Dîner Récupération Musculaire",
      description: "180g de steak haché 5% ou pavé de saumon, poêlée de légumes vert (brocolis, haricots) et 150g de patate douce."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#16161E] border border-white/20 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-white shadow-2xl relative animate-in fade-in zoom-in-95 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-bold">
            <Utensils className="w-4 h-4" />
            <span>Guide Nutrition & Macronutriments FysiqForge</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black uppercase font-display">
            Plan Alimentaire Personnalisé
          </h2>
          <p className="text-xs text-gray-300">
            Ciblé pour votre objectif : <strong className="text-emerald-400">{objective}</strong>
          </p>
        </div>

        {/* Calorie & Macro Target Card */}
        <div className="bg-[#121218] border border-white/10 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold">Cible Calorique Quotidienne</p>
              <p className="text-3xl font-black text-amber-400 font-display">{macros.calories} kcal</p>
            </div>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full">
              Hydratation : {macros.hydration}
            </span>
          </div>

          <p className="text-xs text-gray-300 italic">{macros.tagline}</p>

          <div className="grid grid-cols-3 gap-2 text-center pt-2">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Protéines</p>
              <p className="text-sm font-extrabold text-[#FF5500]">{macros.proteins}</p>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Glucides</p>
              <p className="text-sm font-extrabold text-blue-400">{macros.carbs}</p>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Lipides</p>
              <p className="text-sm font-extrabold text-emerald-400">{macros.fats}</p>
            </div>
          </div>
        </div>

        {/* Recommended Meal Ideas */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-gray-300 tracking-wider">
            Exemple de Journée Alimentaire Équilibrée :
          </h3>

          <div className="grid sm:grid-cols-2 gap-3">
            {mealIdeas.map((meal, idx) => (
              <div key={idx} className="bg-[#121218] border border-white/5 p-3.5 rounded-2xl space-y-1">
                <p className="font-bold text-xs text-white flex items-center gap-1.5">
                  <Apple className="w-3.5 h-3.5 text-[#FF5500]" />
                  <span>{meal.title}</span>
                </p>
                <p className="text-[11px] text-gray-400 leading-relaxed">{meal.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useMemo, useState } from "react";
import { X, Utensils, Check, Apple, ChevronLeft, ChevronRight, Droplets } from "lucide-react";
import { UserAnswers } from "../types";

interface NutritionGuideModalProps { userAnswers: UserAnswers; onClose: () => void; }
interface Meal { title: string; time: string; description: string; calories: number; protein: number; carbs: number; fats: number; }

type NutritionMode = "mass" | "cut" | "maintenance";

const mealTemplates: Record<NutritionMode, Meal[]> = {
  mass: [
    { title: "Petit-déjeuner", time: "07:00", description: "Œufs + flocons d'avoine + banane + yaourt nature.", calories: 650, protein: 32, carbs: 82, fats: 22 },
    { title: "Déjeuner", time: "12:30", description: "Poulet ou poisson + riz + légumes + avocat.", calories: 800, protein: 50, carbs: 92, fats: 24 },
    { title: "Collation", time: "16:30", description: "Yaourt/fromage blanc + fruit + poignée d'amandes.", calories: 350, protein: 20, carbs: 35, fats: 14 },
    { title: "Dîner", time: "20:00", description: "Poisson ou viande maigre + patate douce + légumes.", calories: 650, protein: 42, carbs: 62, fats: 20 }
  ],
  cut: [
    { title: "Petit-déjeuner", time: "07:00", description: "Œufs + avoine en portion modérée + fruit.", calories: 450, protein: 30, carbs: 45, fats: 15 },
    { title: "Déjeuner", time: "12:30", description: "Poulet ou poisson + grande portion de légumes + riz mesuré.", calories: 600, protein: 50, carbs: 50, fats: 16 },
    { title: "Collation", time: "16:30", description: "Yaourt nature + fruit.", calories: 220, protein: 16, carbs: 25, fats: 6 },
    { title: "Dîner", time: "20:00", description: "Poisson ou poulet + légumes + petite portion de féculent.", calories: 550, protein: 48, carbs: 42, fats: 16 }
  ],
  maintenance: [
    { title: "Petit-déjeuner", time: "07:00", description: "Œufs + avoine + fruit + yaourt nature.", calories: 550, protein: 30, carbs: 65, fats: 18 },
    { title: "Déjeuner", time: "12:30", description: "Poulet/poisson + riz + légumes + avocat.", calories: 700, protein: 45, carbs: 75, fats: 22 },
    { title: "Collation", time: "16:30", description: "Fruit + yaourt + quelques amandes.", calories: 300, protein: 16, carbs: 32, fats: 12 },
    { title: "Dîner", time: "20:00", description: "Poisson/viande maigre + légumes + patate douce.", calories: 600, protein: 42, carbs: 58, fats: 20 }
  ]
};

const dayVariants: Record<NutritionMode, string[][]> = {
  mass: [
    ["Omelette 3 œufs + avoine + banane + yaourt", "Poulet grillé + riz + haricots verts + avocat", "Fromage blanc + banane + amandes", "Saumon + patate douce + légumes"],
    ["Porridge avoine + lait + beurre de cacahuète + pomme", "Bœuf maigre + riz + légumes sautés", "Yaourt grec + mangue + noix de cajou", "Poulet + semoule + courgettes"],
    ["Œufs brouillés + pain complet + avocat + orange", "Poisson + riz + pois chiches + crudités", "Smoothie lait + banane + avoine", "Dinde + pommes de terre + légumes"],
    ["Omelette + patate douce + fruit", "Poulet + pâtes complètes + sauce tomate + légumes", "Yaourt + flocons d'avoine + fruits rouges", "Poisson + riz + brocoli"],
    ["Porridge + banane + yaourt + graines", "Bœuf maigre + patate douce + salade", "Fromage blanc + pomme + amandes", "Poulet + riz + légumes"],
    ["Œufs + pain complet + banane + yaourt", "Poisson + semoule + légumes + avocat", "Lait + avoine + fruit + beurre de cacahuète", "Dinde + patate douce + légumes"],
    ["Omelette + avoine + fruits", "Poulet + riz + lentilles + légumes", "Yaourt grec + banane + noix", "Saumon + pommes de terre + légumes"]
  ],
  cut: [
    ["Œufs + avoine portion modérée + fraises", "Poulet grillé + grande salade + petite portion de riz", "Yaourt nature + pomme", "Poisson blanc + légumes + patate douce"],
    ["Yaourt grec + fruit + petite portion d'avoine", "Dinde + légumes + quinoa mesuré", "Orange + poignée d'amandes", "Poulet + courgettes + petite portion de riz"],
    ["Omelette légumes + fruit", "Poisson + salade + pois chiches mesurés", "Fromage blanc + fruits rouges", "Dinde + brocoli + pommes de terre mesurées"],
    ["Œufs + pain complet + fruit", "Poulet + légumes + semoule mesurée", "Yaourt nature + kiwi", "Poisson + courgettes + patate douce"],
    ["Porridge léger + yaourt + fruit", "Bœuf maigre + grande portion de légumes", "Fruit + yaourt", "Poulet + salade + petite portion de féculent"],
    ["Œufs + fruit + portion d'avoine", "Poisson + légumes + riz mesuré", "Fromage blanc + pomme", "Dinde + légumes verts + patate douce"],
    ["Omelette + fruit", "Poulet + salade composée + quinoa mesuré", "Yaourt grec + fruit", "Poisson blanc + légumes variés"]
  ],
  maintenance: [
    ["Œufs + avoine + banane + yaourt", "Poulet + riz + légumes + avocat", "Fruit + yaourt + amandes", "Poisson + patate douce + légumes"],
    ["Porridge + fruit + yaourt", "Bœuf maigre + riz + légumes", "Yaourt + mangue + quelques noix", "Poulet + semoule + courgettes"],
    ["Œufs + pain complet + fruit", "Poisson + riz + pois chiches + crudités", "Smoothie yaourt + banane", "Dinde + pommes de terre + légumes"],
    ["Omelette + avoine + fruit", "Poulet + pâtes complètes + légumes", "Yaourt + fruits rouges + avoine", "Poisson + riz + brocoli"],
    ["Porridge + banane + yaourt", "Bœuf maigre + patate douce + salade", "Fromage blanc + fruit + amandes", "Poulet + riz + légumes"],
    ["Œufs + pain complet + fruit", "Poisson + semoule + légumes + avocat", "Yaourt + avoine + fruit", "Dinde + patate douce + légumes"],
    ["Omelette + avoine + fruits", "Poulet + riz + lentilles + légumes", "Yaourt grec + banane + noix", "Saumon + pommes de terre + légumes"]
  ]
};

export const NutritionGuideModal: React.FC<NutritionGuideModalProps> = ({ userAnswers, onClose }) => {
  const objective = userAnswers.objective || "Tonification & Définition";
  const mode: NutritionMode = objective.includes("Prise de masse") ? "mass" : objective.includes("Perte de gras") ? "cut" : "maintenance";
  const baseMeals = mealTemplates[mode];
  const [selectedDay, setSelectedDay] = useState(0);
  const [checkedMeals, setCheckedMeals] = useState<Record<string, boolean>>({});
  const [waterByDay, setWaterByDay] = useState<Record<number, number>>({});

  const targets = useMemo(() => {
    if (mode === "mass") return { calories: 2750, protein: 160, carbs: 340, fats: 75, water: 3.5, note: "Objectif : surplus calorique contrôlé." };
    if (mode === "cut") return { calories: 1950, protein: 175, carbs: 170, fats: 65, water: 3.0, note: "Objectif : déficit modéré avec apport protéique suffisant." };
    return { calories: 2350, protein: 150, carbs: 260, fats: 70, water: 3.0, note: "Objectif : alimentation équilibrée autour du maintien." };
  }, [mode]);

  const meals = useMemo(() => baseMeals.map((meal, idx) => ({ ...meal, description: dayVariants[mode][selectedDay][idx] })), [baseMeals, mode, selectedDay]);
  const dayLabel = selectedDay === 0 ? "Aujourd'hui" : `Jour ${selectedDay + 1}`;
  const completedMeals = meals.filter((_, idx) => checkedMeals[`${selectedDay}-${idx}`]).length;
  const water = waterByDay[selectedDay] || 0;
  const waterSteps = Math.round(targets.water * 4);
  const toggleMeal = (idx: number) => setCheckedMeals((prev) => ({ ...prev, [`${selectedDay}-${idx}`]: !prev[`${selectedDay}-${idx}`] }));
  const setWaterForDay = (next: number) => setWaterByDay((prev) => ({ ...prev, [selectedDay]: next }));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#16161E] border border-white/20 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 text-white shadow-2xl relative my-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10"><X className="w-5 h-5" /></button>

        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-bold"><Utensils className="w-4 h-4" />Guide Nutrition FysiqForge</div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase font-display">Suivi alimentaire</h2>
          <p className="text-xs text-gray-300">Objectif : <strong className="text-emerald-400">{objective}</strong></p>
        </div>

        <div className="flex items-center justify-between bg-[#121218] border border-white/10 rounded-2xl p-3">
          <button onClick={() => setSelectedDay((d) => Math.max(0, d - 1))} disabled={selectedDay === 0} className="p-2 rounded-xl bg-white/5 disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
          <div className="text-center"><p className="text-xs text-gray-500 uppercase font-bold">Suivi du programme</p><p className="font-black">{dayLabel} · Jour {selectedDay + 1}/7</p></div>
          <button onClick={() => setSelectedDay((d) => Math.min(6, d + 1))} disabled={selectedDay === 6} className="p-2 rounded-xl bg-white/5 disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
        </div>

        <div className="grid sm:grid-cols-4 gap-2">
          <div className="bg-[#121218] border border-white/10 p-3 rounded-xl text-center"><p className="text-[10px] text-gray-500">CALORIES</p><p className="font-black text-amber-400">{targets.calories} kcal</p></div>
          <div className="bg-[#121218] border border-white/10 p-3 rounded-xl text-center"><p className="text-[10px] text-gray-500">PROTÉINES</p><p className="font-black text-[#FF5500]">{targets.protein} g</p></div>
          <div className="bg-[#121218] border border-white/10 p-3 rounded-xl text-center"><p className="text-[10px] text-gray-500">GLUCIDES</p><p className="font-black text-blue-400">{targets.carbs} g</p></div>
          <div className="bg-[#121218] border border-white/10 p-3 rounded-xl text-center"><p className="text-[10px] text-gray-500">LIPIDES</p><p className="font-black text-emerald-400">{targets.fats} g</p></div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs text-emerald-100">
          <strong>Plan du jour :</strong> menu volontairement différent de la journée précédente pour éviter l'effet "même écran répété". {targets.note}
        </div>

        <div className="bg-[#121218] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3"><div><p className="text-xs font-black uppercase">Repas du jour</p><p className="text-[11px] text-gray-500">{completedMeals}/{meals.length} repas suivis</p></div><div className="text-xs font-bold text-emerald-400">{Math.round((completedMeals / meals.length) * 100)}%</div></div>
          <div className="space-y-2">
            {meals.map((meal, idx) => {
              const checked = !!checkedMeals[`${selectedDay}-${idx}`];
              return <button key={`${selectedDay}-${meal.title}`} onClick={() => toggleMeal(idx)} className={`w-full text-left p-3 rounded-xl border transition-colors ${checked ? "bg-emerald-500/10 border-emerald-500/30" : "bg-white/[0.02] border-white/5 hover:border-white/15"}`}>
                <div className="flex items-start gap-3"><div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${checked ? "bg-emerald-500 text-black" : "bg-white/5 text-gray-400"}`}>{checked ? <Check className="w-4 h-4" /> : <Apple className="w-4 h-4" />}</div><div className="flex-1"><div className="flex justify-between gap-2"><p className="text-xs font-bold">{meal.title}</p><span className="text-[10px] text-gray-500">{meal.time}</span></div><p className="text-[11px] text-gray-400 mt-1">{meal.description}</p><p className="text-[10px] text-gray-500 mt-1">{meal.calories} kcal · {meal.protein}g prot. · {meal.carbs}g gluc. · {meal.fats}g lip.</p></div></div>
              </button>;
            })}
          </div>
        </div>

        <div className="bg-[#121218] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><Droplets className="w-4 h-4 text-blue-400" /><p className="text-xs font-black uppercase">Hydratation</p></div><span className="text-xs font-bold">{water.toFixed(1)} / {targets.water.toFixed(1)} L</span></div>
          <div className="flex gap-2 flex-wrap">{Array.from({ length: waterSteps }).map((_, idx) => <button key={idx} onClick={() => setWaterForDay(idx < Math.round(water * 4) ? Math.max(0, idx / 4) : (idx + 1) / 4)} className={`h-8 w-8 rounded-lg border text-[10px] font-bold ${idx < Math.round(water * 4) ? "bg-blue-500/30 border-blue-400/40 text-blue-200" : "bg-white/5 border-white/10 text-gray-500"}`}>{idx + 1}</button>)}</div>
          <p className="text-[10px] text-gray-500 mt-2">La progression d'hydratation est suivie séparément pour chaque jour.</p>
        </div>

        <p className="text-[10px] text-gray-500 text-center">Ces indications sont générales et ne remplacent pas les conseils d'un professionnel de santé ou d'un diététicien.</p>
      </div>
    </div>
  );
};
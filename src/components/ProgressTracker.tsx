import React, { useState } from "react";
import { WorkoutLog, TrainingPlan } from "../types";
import { TrendingUp, Calendar, Award, Camera, Plus, CheckCircle } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface ProgressTrackerProps {
  logs: WorkoutLog[];
  plan: TrainingPlan;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ logs, plan }) => {
  const [weightLogs, setWeightLogs] = useState([
    { date: "Semaine 1", weight: 74.5 },
    { date: "Semaine 2", weight: 75.2 },
    { date: "Semaine 3", weight: 75.8 },
    { date: "Semaine 4", weight: 76.4 }
  ]);

  const [newWeight, setNewWeight] = useState("");

  const handleAddWeight = () => {
    if (!newWeight) return;
    setWeightLogs((prev) => [
      ...prev,
      { date: `Semaine ${prev.length + 1}`, weight: parseFloat(newWeight) }
    ]);
    setNewWeight("");
  };

  const totalSessionsCompleted = logs.length;
  const totalCaloriesBurned = logs.reduce((acc, l) => acc + l.caloriesBurned, 0);

  return (
    <div className="space-y-8 text-white">
      {/* Metric Cards Row */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-[#16161E] border border-white/10 rounded-2xl p-6 space-y-2">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Séances Complétées</p>
          <p className="text-3xl font-extrabold text-[#FF5500] font-display">{totalSessionsCompleted}</p>
          <p className="text-xs text-emerald-400 font-semibold">
            Régularité : {Math.min(100, (totalSessionsCompleted / 16) * 100).toFixed(0)}% du cycle
          </p>
        </div>

        <div className="bg-[#16161E] border border-white/10 rounded-2xl p-6 space-y-2">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Calories Estimées Brûlées</p>
          <p className="text-3xl font-extrabold text-amber-400 font-display">{totalCaloriesBurned} kcal</p>
          <p className="text-xs text-gray-400">Intensité moyenne : 4.8 / 5 🔥</p>
        </div>

        <div className="bg-[#16161E] border border-white/10 rounded-2xl p-6 space-y-2">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Programme En Cours</p>
          <p className="text-base font-extrabold text-white truncate">{plan.programTitle}</p>
          <span className="inline-block bg-[#FF5500]/20 text-[#FF5500] text-[10px] font-bold px-2 py-0.5 rounded border border-[#FF5500]/30">
            Niveau {plan.userAnswers.level}
          </span>
        </div>
      </div>

      {/* Weight Chart Section */}
      <div className="bg-[#16161E] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-xl font-extrabold uppercase font-display text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#FF5500]" /> Suivi d'Évolution du Poids (kg)
            </h3>
            <p className="text-xs text-gray-400">Enregistrez votre poids hebdomadaire pour suivre votre prise de masse / sèche.</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="Ex: 76.8"
              className="bg-[#121218] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF5500] w-24"
            />
            <button
              onClick={handleAddWeight}
              className="bg-[#FF5500] hover:bg-[#FF6611] text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </div>
        </div>

        {/* Recharts Chart */}
        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightLogs}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="date" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} domain={["dataMin - 1", "dataMax + 1"]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#121218", borderColor: "#333", borderRadius: "8px" }}
                labelStyle={{ color: "#fff", fontWeight: "bold" }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                name="Poids (kg)"
                stroke="#FF5500"
                strokeWidth={3}
                dot={{ fill: "#FF5500", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History Table of Logs */}
      <div className="bg-[#16161E] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <h3 className="text-lg font-extrabold uppercase font-display text-white">
          Historique des Séances Effectuées
        </h3>

        {logs.length === 0 ? (
          <p className="text-xs text-gray-400 italic py-4">
            Aucune séance encore enregistrée. Terminez une séance pour alimenter votre historique !
          </p>
        ) : (
          <div className="divide-y divide-white/10">
            {logs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{log.dayTitle}</p>
                  <p className="text-gray-400">{log.date} • {log.durationMinutes} min • Notes: {log.notes}</p>
                </div>
                <div className="text-right">
                  <span className="text-amber-400 font-bold">{log.feelingRating} / 5 🔥</span>
                  <p className="text-emerald-400 text-[11px]">{log.caloriesBurned} kcal</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

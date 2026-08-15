import React, { useState } from "react";
import { WorkoutLog, TrainingPlan } from "../types";
import { TrendingUp, Calendar, Award, Camera, Plus, CheckCircle, Flame, Target, Activity } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

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
  const regularityPct = Math.min(100, (totalSessionsCompleted / 16) * 100);
  const weightDelta = weightLogs.length > 1 ? weightLogs[weightLogs.length - 1].weight - weightLogs[0].weight : 0;

  return (
    <div className="space-y-6 text-white">
      {/* En-tête de section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold uppercase font-display tracking-tight text-white">
            Suivi & Progression
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Vue d'ensemble de ta progression sur le programme</p>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="relative overflow-hidden bg-[#15151C] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#FF5500]/15 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#FF5500]" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
              {regularityPct.toFixed(0)}%
            </span>
          </div>
          <p className="text-2xl font-extrabold font-display text-white leading-none mb-1">{totalSessionsCompleted}</p>
          <p className="text-[11px] text-gray-500 font-medium">Séances complétées</p>
          <div className="mt-3 h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#FF5500] to-amber-400 rounded-full transition-all" style={{ width: `${regularityPct}%` }} />
          </div>
        </div>

        <div className="relative overflow-hidden bg-[#15151C] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-display text-white leading-none mb-1">{totalCaloriesBurned.toLocaleString("fr-FR")}</p>
          <p className="text-[11px] text-gray-500 font-medium">Kcal estimées brûlées</p>
          <p className="text-[10px] text-gray-600 mt-3 flex items-center gap-1">
            <Activity className="w-3 h-3" /> Intensité moyenne 4.8 / 5
          </p>
        </div>

        <div className="relative overflow-hidden bg-[#15151C] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <p className="text-sm font-extrabold text-white leading-tight mb-1 truncate">{plan.programTitle}</p>
          <span className="inline-block bg-white/[0.06] text-gray-300 text-[10px] font-bold px-2 py-1 rounded-full">
            Niveau {plan.userAnswers.level}
          </span>
        </div>
      </div>

      {/* Weight Chart Section */}
      <div className="bg-[#15151C] border border-white/[0.06] rounded-2xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF5500]/15 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4.5 h-4.5 text-[#FF5500]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-white">Évolution du poids</h3>
              <p className="text-[11px] text-gray-500">Enregistre ton poids chaque semaine</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="number"
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="76.8 kg"
              className="bg-[#0E0E13] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF5500] w-full sm:w-24"
            />
            <button
              onClick={handleAddWeight}
              className="bg-[#FF5500] hover:bg-[#FF6611] text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mini stats au-dessus du graphique */}
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">Actuel</span>
            <span className="font-bold text-white">{weightLogs[weightLogs.length - 1]?.weight ?? "—"} kg</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">Variation</span>
            <span className={`font-bold ${weightDelta >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {weightDelta >= 0 ? "+" : ""}{weightDelta.toFixed(1)} kg
            </span>
          </div>
        </div>

        {/* Recharts Chart */}
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weightLogs} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF5500" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#FF5500" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="date" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#666" fontSize={11} domain={["dataMin - 1", "dataMax + 1"]} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#15151C", borderColor: "#ffffff20", borderRadius: "10px", fontSize: "12px" }}
                labelStyle={{ color: "#fff", fontWeight: "bold" }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                name="Poids (kg)"
                stroke="#FF5500"
                strokeWidth={2.5}
                fill="url(#weightGradient)"
                dot={{ fill: "#FF5500", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History Table of Logs */}
      <div className="bg-[#15151C] border border-white/[0.06] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
            <Award className="w-4.5 h-4.5 text-gray-300" />
          </div>
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-white">
            Historique des séances
          </h3>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-gray-500">
              Aucune séance enregistrée pour l'instant.<br />Termine une séance pour commencer ton historique.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {logs.map((log) => (
              <div key={log.id} className="py-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{log.dayTitle}</p>
                  <p className="text-[11px] text-gray-500 truncate">{log.date} · {log.durationMinutes} min{log.notes ? ` · ${log.notes}` : ""}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-bold text-amber-400">{log.feelingRating}/5 🔥</span>
                  <p className="text-[10px] text-gray-500">{log.caloriesBurned} kcal</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

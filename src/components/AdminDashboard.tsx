import React, { useState, useEffect } from "react";
import { PaymentTransaction } from "../types";
import { Lock, ShieldCheck, DollarSign, Smartphone, CreditCard, RefreshCw, X, Filter, Users } from "lucide-react";

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [methodFilter, setMethodFilter] = useState<string>("ALL");
  const [currencyFilter, setCurrencyFilter] = useState<string>("ALL");

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching admin stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const transactions: PaymentTransaction[] = stats?.recentTransactions || [];

  const filteredTransactions = transactions.filter((t) => {
    if (methodFilter !== "ALL" && t.method !== methodFilter) return false;
    if (currencyFilter !== "ALL" && t.currency !== currencyFilter) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#16161E] border border-white/20 rounded-3xl max-w-5xl w-full p-6 sm:p-8 space-y-8 text-white shadow-2xl relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase font-display text-white">
                Dashboard Admin FysiqForge PRO
              </h2>
              <p className="text-xs text-gray-400">
                Vue financière réservée aux administrateurs (Sécurité RLS Isolé)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStats}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
              title="Rafraîchir"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security / RLS Note */}
        <div className="bg-blue-950/30 border border-blue-500/30 p-3.5 rounded-2xl text-xs text-blue-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              <strong>RLS (Row Level Security) Actif</strong> : Les données financières ci-dessous ne sont accessibles que sous le rôle ADMIN. Les utilisateurs standards n'ont aucun droit de lecture.
            </span>
          </div>
        </div>

        {/* Financial Metrics Row */}
        {stats && (
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="bg-[#121218] border border-white/10 p-4 rounded-2xl space-y-1">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Total FCFA Encaissé</p>
              <p className="text-xl font-black text-[#FF5500] font-display">
                {stats.revenue?.fcfa?.toLocaleString()} FCFA
              </p>
              <p className="text-[10px] text-emerald-400">Mobile Money & Wave</p>
            </div>

            <div className="bg-[#121218] border border-white/10 p-4 rounded-2xl space-y-1">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Total USD Encaissé</p>
              <p className="text-xl font-black text-blue-400 font-display">
                ${stats.revenue?.usd}
              </p>
              <p className="text-[10px] text-gray-400">Stripe & PayPal</p>
            </div>

            <div className="bg-[#121218] border border-white/10 p-4 rounded-2xl space-y-1">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Total EUR Encaissé</p>
              <p className="text-xl font-black text-indigo-400 font-display">
                {stats.revenue?.eur} €
              </p>
              <p className="text-[10px] text-gray-400">Carte & Western Union</p>
            </div>

            <div className="bg-[#121218] border border-white/10 p-4 rounded-2xl space-y-1">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Nombre de Transactions</p>
              <p className="text-xl font-black text-white font-display">
                {stats.totalTransactions}
              </p>
              <p className="text-[10px] text-emerald-400">100% Payées & Validées</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-[#FF5500]" />
            <span className="font-bold uppercase text-gray-300">Filtrer par Méthode :</span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-[#121218] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="ALL">Toutes les méthodes</option>
              <option value="Wave">Wave</option>
              <option value="MTN Mobile Money">MTN Mobile Money</option>
              <option value="Orange Money">Orange Money</option>
              <option value="Moov Money">Moov Money</option>
              <option value="Stripe">Stripe (Carte)</option>
              <option value="PayPal">PayPal</option>
              <option value="Western Union">Western Union</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold uppercase text-gray-300">Devise :</span>
            <select
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value)}
              className="bg-[#121218] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="ALL">Toutes devises</option>
              <option value="FCFA">FCFA</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-[#121218] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 uppercase text-gray-400 border-b border-white/10">
                <tr>
                  <th className="p-3">Client</th>
                  <th className="p-3">Plan Acheté</th>
                  <th className="p-3">Montant</th>
                  <th className="p-3">Méthode</th>
                  <th className="p-3">Référence</th>
                  <th className="p-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-semibold text-white">
                      {tx.userName}
                      <span className="block text-[10px] text-gray-400">{tx.userEmail}</span>
                    </td>
                    <td className="p-3 text-gray-300">{tx.planTier}</td>
                    <td className="p-3 font-black text-[#FF5500]">
                      {tx.amount} {tx.currency}
                    </td>
                    <td className="p-3 text-gray-300">
                      <span className="bg-white/5 px-2 py-1 rounded border border-white/10">
                        {tx.method} ({tx.provider})
                      </span>
                    </td>
                    <td className="p-3 font-mono text-gray-400">{tx.reference}</td>
                    <td className="p-3">
                      <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

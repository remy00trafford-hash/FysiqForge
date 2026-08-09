import React, { useState } from "react";
import { PlanTierConfig, PlanTierId } from "../types";
import { PLAN_TIERS } from "../data/pricingTiers";
import { Lock, ShieldCheck, Check, Sparkles, Smartphone, CreditCard, X, ArrowRight, UserCheck, AlertCircle } from "lucide-react";

interface PaywallModalProps {
  onPaymentSuccess: (userEmail: string, selectedTierId: PlanTierId, transactionData: any) => void;
  onBack: () => void;
  initialSelectedTier?: PlanTierId;
  selectedCurrency?: "FCFA" | "USD" | "EUR";
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  onPaymentSuccess,
  onBack,
  initialSelectedTier = "performance",
  selectedCurrency = "FCFA"
}) => {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isGoogleSignedIn, setIsGoogleSignedIn] = useState(false);

  // Selected checkout state
  const [activePaymentModal, setActivePaymentModal] = useState<{
    tier: PlanTierConfig;
    currency: "FCFA" | "USD" | "EUR";
    amount: number;
  } | null>(null);

  // Mobile Money Provider
  const [mobileProvider, setMobileProvider] = useState<"Wave" | "MTN Mobile Money" | "Orange Money" | "Moov Money">("Wave");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);

  // International Provider
  const [internationalMethod, setInternationalMethod] = useState<"Stripe" | "PayPal" | "Western Union" | "Virement Bancaire">("Stripe");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");

  const handleSimulateGoogleSignIn = () => {
    setUserEmail("client.fysiq@gmail.com");
    setUserName("Marc Cash");
    setIsGoogleSignedIn(true);
  };

  const handleOpenCheckout = (tier: PlanTierConfig, currency: "FCFA" | "USD" | "EUR", amount: number) => {
    let emailToUse = userEmail.trim();
    if (!emailToUse) {
      emailToUse = "client.fysiq@gmail.com";
      setUserEmail(emailToUse);
    }
    setActivePaymentModal({ tier, currency, amount });
  };

  const handleExecutePayment = async () => {
    if (!activePaymentModal) return;

    setIsProcessingPayment(true);

    const isMobile = activePaymentModal.currency === "FCFA";
    const providerName = isMobile ? mobileProvider : internationalMethod;

    try {
      const res = await fetch("/api/payments/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: userName || userEmail.split("@")[0],
          userEmail: userEmail,
          planTier: activePaymentModal.tier.name,
          amount: activePaymentModal.amount,
          currency: activePaymentModal.currency,
          method: isMobile ? "Mobile Money" : internationalMethod,
          provider: providerName,
          phoneNumber: phoneNumber || "+225 0700000000"
        })
      });

      const data = await res.json();

      setTimeout(() => {
        setIsProcessingPayment(false);
        setPaymentSuccessMessage("Paiement validé avec succès ! Déverrouillage immédiat...");

        setTimeout(() => {
          onPaymentSuccess(userEmail, activePaymentModal.tier.id, data.transaction);
        }, 1200);
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsProcessingPayment(false);
      alert("Une erreur de réseau s'est produite pendant le paiement. Réessayez.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 text-white">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#FF5500]/10 border border-[#FF5500]/30 px-3.5 py-1 rounded-full text-xs font-bold text-[#FF5500]">
          <Lock className="w-4 h-4" />
          <span>Étape 5 / 5 — Connexion & Déverrouillage du Plan</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black uppercase font-display">
          Choisis Ton Niveau d'Accompagnement
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
          Accède instantanément à tes séances détaillées, au Coach IA FysiqForge et aux playlists de séance.
        </p>
      </div>

      {/* Account Signup / Login Box */}
      <div className="bg-[#16161E] border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
          <UserCheck className="w-4 h-4 text-[#FF5500]" /> 1. Compte & Accès Personnel
        </div>

        {isGoogleSignedIn ? (
          <div className="flex items-center justify-between p-3.5 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Connecté en tant que <strong>{userEmail}</strong></span>
            </div>
            <button
              onClick={() => setIsGoogleSignedIn(false)}
              className="text-gray-400 hover:text-white underline"
            >
              Changer
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleSimulateGoogleSignIn}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold px-4 py-3 rounded-xl text-sm flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continuer avec Google en 1-Clic</span>
            </button>

            <div className="flex items-center gap-3 text-xs text-gray-500 my-2">
              <div className="h-px bg-white/10 flex-1" />
              <span>OU PAR EMAIL</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Saisissez votre adresse email..."
              className="w-full bg-[#121218] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF5500]"
            />
          </div>
        )}
      </div>

      {/* 3 Paid Tiers Comparison Table */}
      <div className="grid lg:grid-cols-3 gap-6 items-stretch">
        {PLAN_TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between border transition-all relative ${
              tier.isPopular
                ? "bg-gradient-to-b from-[#1A1A24] via-[#16161E] to-[#0D0D11] border-[#FF5500] shadow-2xl shadow-[#FF5500]/15 ring-2 ring-[#FF5500]/50"
                : "bg-[#16161E] border-white/10 hover:border-white/20"
            }`}
          >
            {/* Badge */}
            {tier.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF5500] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                {tier.badge}
              </span>
            )}

            <div className="space-y-6">
              {/* Header */}
              <div>
                <h3 className="text-2xl font-extrabold uppercase font-display text-white">
                  {tier.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{tier.tagline}</p>
              </div>

              {/* Side-by-side currency pricing display (REQUIREMENT) */}
              <div className="bg-[#121218] border border-white/10 rounded-2xl p-4 space-y-3">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider text-center">
                  Prix selon devise / moyen de paiement :
                </p>

                <div className="grid grid-cols-3 gap-2 text-center">
                  {/* FCFA */}
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                    <p className="font-extrabold text-sm text-white">{tier.priceFcfa.toLocaleString()} FCFA</p>
                    <button
                      onClick={() => handleOpenCheckout(tier, "FCFA", tier.priceFcfa)}
                      className="mt-2 w-full bg-[#FF5500] hover:bg-[#FF6611] text-white font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Payer FCFA
                    </button>
                  </div>

                  {/* USD */}
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                    <p className="font-extrabold text-sm text-white">${tier.priceUsd}</p>
                    <button
                      onClick={() => handleOpenCheckout(tier, "USD", tier.priceUsd)}
                      className="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Payer USD
                    </button>
                  </div>

                  {/* EUR */}
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                    <p className="font-extrabold text-sm text-white">{tier.priceEur.toString().replace('.', ',')} €</p>
                    <button
                      onClick={() => handleOpenCheckout(tier, "EUR", tier.priceEur)}
                      className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Payer EUR
                    </button>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 text-xs text-gray-300">
                {tier.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6 text-center text-[11px] text-gray-500">
              Achat unique • Accès illimité au plan
            </div>
          </div>
        ))}
      </div>

      {/* Currency-Specific Checkout Modal Overlay */}
      {activePaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#16161E] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setActivePaymentModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase text-[#FF5500] tracking-wider">
                Finalisation du Paiement — {activePaymentModal.tier.name}
              </span>
              <h3 className="text-2xl font-black text-white uppercase font-display">
                Montant : {activePaymentModal.amount} {activePaymentModal.currency}
              </h3>
            </div>

            {/* Email Field Confirmation */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300 uppercase">Adresse Email de Réception du Plan :</label>
              <input
                type="email"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="votre.email@gmail.com"
                className="w-full bg-[#121218] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            {/* FCFA Mobile Money Checkout */}
            {activePaymentModal.currency === "FCFA" ? (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Moyens de Paiement Locaux (Mobile Money / Wave)</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 uppercase">Choisis ton opérateur :</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["Wave", "MTN Mobile Money", "Orange Money", "Moov Money"] as const).map((prov) => (
                      <button
                        type="button"
                        key={prov}
                        onClick={() => setMobileProvider(prov)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          mobileProvider === prov
                            ? "bg-[#FF5500] text-white border-[#FF5500]"
                            : "bg-[#121218] text-gray-300 border-white/10 hover:border-white/30"
                        }`}
                      >
                        {prov}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase">Numéro de Téléphone Mobile Money :</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+225 07 00 00 00 00 ou +221 77 00 00 00"
                    className="w-full bg-[#121218] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF5500]"
                  />
                  <p className="text-[11px] text-gray-500">Un push USSD sera envoyé sur votre téléphone pour confirmer le code PIN.</p>
                </div>
              </div>
            ) : (
              /* International USD / EUR Checkout */
              <div className="space-y-4">
                <div className="p-3 bg-blue-950/30 border border-blue-500/30 rounded-xl text-xs text-blue-300 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  <span>Paiements Internationaux Sécurisés</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 uppercase">Méthode de Paiement :</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["Stripe", "PayPal", "Western Union", "Virement Bancaire"] as const).map((method) => (
                      <button
                        type="button"
                        key={method}
                        onClick={() => setInternationalMethod(method)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          internationalMethod === method
                            ? "bg-blue-600 text-white border-blue-500"
                            : "bg-[#121218] text-gray-300 border-white/10 hover:border-white/30"
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase">Informations de Paiement :</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-[#121218] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {paymentSuccessMessage && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-bold rounded-xl text-center animate-bounce">
                {paymentSuccessMessage}
              </div>
            )}

            <button
              onClick={handleExecutePayment}
              disabled={isProcessingPayment}
              className="w-full bg-gradient-to-r from-[#FF5500] to-[#FF3E00] hover:from-[#FF6611] text-white font-extrabold py-4 rounded-xl text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Traitement de la transaction...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>CONFIRMER ET PAYER {activePaymentModal.amount} {activePaymentModal.currency}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

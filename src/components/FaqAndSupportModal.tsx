import React, { useState } from "react";
import { X, HelpCircle, Mail, Send, CheckCircle2, ChevronDown, ChevronUp, MessageSquare, PhoneCall, ShieldCheck, Clock } from "lucide-react";

interface FaqAndSupportModalProps {
  onClose: () => void;
}

export const FaqAndSupportModal: React.FC<FaqAndSupportModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"FAQ" | "CONTACT">("FAQ");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [subject, setSubject] = useState("Question sur le programme / paiement");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  const faqs = [
    {
      q: "Comment fonctionnent les paiements par Wave et Mobile Money (FCFA) ?",
      a: "C'est très simple ! Lors de la sélection du plan, vous choisissez l'option FCFA et votre opérateur préféré (Wave, Orange Money, MTN MoMo, Moov Money). Un push USSD est envoyé directement sur votre téléphone portable pour valider le code PIN en toute sécurité."
    },
    {
      q: "Je n'ai pas de matériel de musculation ou je m'entraîne à la maison. Puis-je suivre le programme ?",
      a: "Absolument ! L'application adapte votre plan selon votre profil. De plus, notre fonctionnalité 'Bulle de Vérification Matériel' permet de remplacer instantanément n'importe quel exercice nécessitant des machines par des variantes maison (sac à dos lesté, bouteilles d'eau, chaises)."
    },
    {
      q: "Comment l'analyse photo IA calcule-t-elle le taux de gras et la symétrie ?",
      a: "Notre algorithme FysiqForge Vision s'appuie sur le modèle de pointe Gemini 3.6 Flash pour effectuer une segmentation morphologique. Il évalue la forme du torse, la définition musculaire et les proportions posturales pour générer votre rapport personnalisé."
    },
    {
      q: "Combien de temps ai-je accès à mon plan d'entraînement ?",
      a: "L'achat d'un plan donne un accès illimité et à vie à votre espace coaching, à vos playlists workout et au Coach IA FysiqForge 24/7."
    },
    {
      q: "Puis-je contacter l'équipe ou un vrai coach en cas de besoin ?",
      a: "Oui ! En plus du Coach IA réactif 24h/24, notre équipe de support technique et de préparation physique est disponible via l'onglet Contact ci-dessous."
    }
  ];

  const handleSendSupportMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !message) return;

    setIsSent(true);
    setTimeout(() => {
      setContactName("");
      setContactEmail("");
      setMessage("");
    }, 1000);
  };

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
          <div className="inline-flex items-center gap-1.5 bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/30 px-3.5 py-1 rounded-full text-xs font-bold">
            <HelpCircle className="w-4 h-4" />
            <span>Support Client & Assistance FysiqForge</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase font-display">
            Faq & Contact Support
          </h2>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 text-xs font-bold">
          <button
            onClick={() => setActiveTab("FAQ")}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer border-b-2 ${
              activeTab === "FAQ"
                ? "border-[#FF5500] text-[#FF5500]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            Foire Aux Questions (FAQ)
          </button>
          <button
            onClick={() => setActiveTab("CONTACT")}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer border-b-2 ${
              activeTab === "CONTACT"
                ? "border-[#FF5500] text-[#FF5500]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            Contacter le Support
          </button>
        </div>

        {/* TAB 1: FAQ Accordion */}
        {activeTab === "FAQ" && (
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#121218] border border-white/10 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-3 cursor-pointer hover:bg-white/5"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#FF5500] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-gray-300 border-t border-white/5 pt-3 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: CONTACT FORM */}
        {activeTab === "CONTACT" && (
          <form onSubmit={handleSendSupportMessage} className="space-y-4">
            {isSent ? (
              <div className="p-6 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-center space-y-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-extrabold text-base text-emerald-300">Message Envoyé avec Succès !</h4>
                <p className="text-xs text-gray-300">
                  Notre équipe de support étudiera votre demande et vous répondra par email dans un délai de 2 heures.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSent(false)}
                  className="mt-3 text-xs text-[#FF5500] underline font-bold"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-300 uppercase">Votre Nom :</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Ex: Marc Diop"
                      className="w-full bg-[#121218] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-300 uppercase">Adresse Email :</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="votre.email@gmail.com"
                      className="w-full bg-[#121218] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300 uppercase">Sujet :</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#121218] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                  >
                    <option value="Question sur le programme / paiement">Question sur le programme / paiement Wave/MoMo</option>
                    <option value="Adaptation de matériel maison">Adaptation de matériel maison</option>
                    <option value="Demande de partenariat / Coach">Demande de partenariat / Coach</option>
                    <option value="Autre demande">Autre demande</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300 uppercase">Votre Message :</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Expliquez-nous en détail votre demande..."
                    className="w-full bg-[#121218] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Délai moyen de réponse : moins de 2 heures</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FF5500] to-[#FF3E00] hover:from-[#FF6611] text-white font-extrabold py-3.5 rounded-xl text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>ENVOYER AU SUPPORT FYSIQFORGE</span>
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

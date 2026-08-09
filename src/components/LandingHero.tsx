import React from "react";
import { Camera, Sparkles, Music, ShieldCheck, Flame, ArrowRight, Smartphone, Zap, MessageSquare, CheckCircle2, XCircle } from "lucide-react";
import { Language } from "../utils/translator";

interface LandingHeroProps {
  onStartClick: () => void;
  language: Language;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartClick, language }) => {
  const isFr = language === "FR";

  return (
    <div className="min-h-screen bg-[#0D0D11] text-white overflow-x-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#FF5500]/15 via-[#FF2200]/5 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Call To Action */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Value Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FF5500]/10 border border-[#FF5500]/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#FF5500]">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>{isFr ? "Génération de Plan par IA & Analyse Visuelle de Physique" : "AI Plan Generation & Visual Physique Scanner"}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-none font-display">
              {isFr ? "Forge Ton Physique Idéal" : "Forge Your Ideal Physique"} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5500] via-[#FF7700] to-amber-400">
                {isFr ? "Basé sur Ta Vraie Photo" : "Based On Your Real Photo"}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0">
              {isFr
                ? "Transforme ton corps avec un plan d'entraînement 100% adapté à ta morphologie visuelle, guidé par un Coach IA dédié 24/7, une sélection musicale sur-mesure et un suivi quotidien motivant."
                : "Transform your body with a 100% customized workout plan based on your visual morphology, guided by a dedicated 24/7 AI Coach, custom motivational playlists, and progress tracking."}
            </p>

            {/* Single Primary Call To Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onStartClick}
                className="w-full sm:w-auto bg-gradient-to-r from-[#FF5500] to-[#FF3E00] hover:from-[#FF6611] hover:to-[#FF4411] text-white font-black px-8 py-4 rounded-xl text-lg shadow-xl shadow-[#FF5500]/30 hover:shadow-[#FF5500]/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group cursor-pointer"
              >
                <Camera className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <span>{isFr ? "DÉCOUVRIR MON PLAN SUR-MESURE" : "DISCOVER MY CUSTOM PLAN"}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isFr ? "Sans inscription préalable" : "No pre-registration needed"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#FF5500]" />
                <span>{isFr ? "Paiements Mobile Money & Cartes" : "Mobile Money & Card Payments"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{isFr ? "Résultat en moins de 2 min" : "Results in under 2 minutes"}</span>
              </div>
            </div>
          </div>

          {/* Right Column: High Impact Fitness Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#16161E] p-2 shadow-2xl group">
              <div className="relative h-[480px] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1000&q=80"
                  alt="Coaching Musculation FysiqForge"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D11] via-[#0D0D11]/40 to-transparent" />

                {/* Floating AI Scan Overlay Badge */}
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-[#FF5500]/40 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#FF5500] animate-ping" />
                  <div className="text-xs">
                    <p className="font-bold text-white uppercase tracking-wider">Scanner Musculaire Actif</p>
                    <p className="text-gray-400">Analyse de symétrie & volume</p>
                  </div>
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#16161E]/90 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#FF5500] font-bold uppercase tracking-wider">Programme Généré #8902</span>
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">100% Personnalisé</span>
                  </div>
                  <h3 className="font-extrabold text-white text-base">FORGE HYPERTROPHIE HAUT DU CORPS</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-300 pt-1 border-t border-white/10">
                    <div>🔥 <strong className="text-white">4 SÉANCES</strong> / sem</div>
                    <div>🎵 <strong className="text-white">PLAYLIST</strong> Afro-Trap</div>
                    <div>🤖 <strong className="text-white">COACH IA</strong> Intégré</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiation Section: FysiqForge vs Chatbot Générique */}
      <section className="py-16 px-4 bg-[#121218] border-y border-white/10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase font-display">
              Pourquoi pas juste demander à ChatGPT ?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              Un chatbot généraliste vous donne un simple texte brut d'exercices. <br className="hidden sm:inline" />
              <strong>FysiqForge</strong> vous offre un accompagnement complet et motivant au quotidien.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Chatbot Generic Box */}
            <div className="bg-[#1A1A24]/60 border border-red-500/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-red-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> Chatbot Générique (ChatGPT/Claude)
                </span>
                <span className="text-xs text-gray-500">Texte statique</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Liste d'exercices générique en texte PDF sans suivi visuel</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Incapable d'analyser une vraie photo de votre physique</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Pas de rappels automatiques ni de bilan de séance</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Pas de musique de séance ni d'interface d'entraînement</span>
                </li>
              </ul>
            </div>

            {/* FysiqForge Box */}
            <div className="bg-gradient-to-b from-[#FF5500]/10 to-[#1A1A24] border border-[#FF5500]/40 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#FF5500]/30">
                <span className="text-[#FF5500] font-black uppercase tracking-wider text-sm flex items-center gap-2 font-display">
                  <CheckCircle2 className="w-5 h-5 text-[#FF5500]" /> Plateforme FysiqForge PRO
                </span>
                <span className="bg-[#FF5500] text-white text-[10px] font-bold px-2 py-0.5 rounded">ACCOMPAGNEMENT TOTAL</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Analyse Visuelle par Photo</strong> : Détection de la morphologie et zones à travailler</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Coach IA Dédié</strong> : Répond à toutes vos questions d'exercices et nutrition pendant le programme</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Musique & Chrono Intégrés</strong> : Playlists motivantes et minuteur de repos automatisé</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Moyens de Paiement Locaux & Int.</strong> : Mobile Money (MTN, Wave, Orange) + Carte Bancaire</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 px-4 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-display">
            Une Expérience Conçue Pour la Régularité
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Chaque élément est pensé pour vous maintenir motivé et discipliné de la première à la dernière séance.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#16161E] border border-white/10 rounded-2xl p-6 space-y-3 hover:border-[#FF5500]/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Analyse Photo Visuelle</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Téléversez une photo de votre torse ou zone ciblée. L'IA détecte votre symétrie et oriente la sélection d'exercices.
            </p>
          </div>

          <div className="bg-[#16161E] border border-white/10 rounded-2xl p-6 space-y-3 hover:border-[#FF5500]/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Coach IA Intégré 24/7</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Une question pendant votre séance ? Adaptez vos charges, remplacez un exercice indisponible ou demandez des conseils nutritionnels.
            </p>
          </div>

          <div className="bg-[#16161E] border border-white/10 rounded-2xl p-6 space-y-3 hover:border-[#FF5500]/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Ambiance Musique de Séance</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Des playlists (Afro-Trap, Synthwave, Hip-Hop) directement intégrées dans le lecteur d'entraînement pour garder le rythme.
            </p>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-gradient-to-r from-[#FF5500] to-[#FF2200] rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black uppercase font-display leading-tight">
              Prêt à Construire Ton Meilleur Physique ?
            </h2>
            <p className="text-white/90 text-sm sm:text-base">
              Prends ta photo ou choisis un exemple et découvre ton aperçu de plan en moins de 60 secondes.
            </p>
            <button
              onClick={onStartClick}
              className="mt-4 bg-black text-white hover:bg-gray-900 font-extrabold px-8 py-4 rounded-xl text-lg shadow-2xl hover:scale-105 transition-all cursor-pointer inline-flex items-center gap-3"
            >
              <Flame className="w-6 h-6 text-[#FF5500]" />
              <span>GÉNÉRER MON PLAN MAINTENANT</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

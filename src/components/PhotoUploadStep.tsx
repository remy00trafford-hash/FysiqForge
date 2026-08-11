import React, { useState, useRef } from "react";
import { Camera, Upload, Sparkles, Check, RefreshCw, Eye, ArrowRight } from "lucide-react";
import { DEMO_SAMPLE_PHOTOS } from "../data/exercisesData";
import { Language } from "../utils/translator";

interface PhotoUploadStepProps {
  onPhotoSelected: (photoUrl: string) => void;
  onBack: () => void;
  language: Language;
}

export const PhotoUploadStep: React.FC<PhotoUploadStepProps> = ({
  onPhotoSelected,
  onBack,
  language
}) => {
  const isFr = language === "FR";
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          triggerScan(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerScan = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 15;
      });
    }, 200);
  };

  const handleConfirmPhoto = () => {
    if (selectedPhoto) {
      onPhotoSelected(selectedPhoto);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Step Heading */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-[#FF5500]/10 border border-[#FF5500]/30 px-3 py-1 rounded-full text-xs font-semibold text-[#FF5500]">
          <Camera className="w-4 h-4" />
          <span>{isFr ? "Étape 2 / 5 — Analyse Visuelle du Physique" : "Step 2 / 5 — Visual Physique Scanner"}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black uppercase font-display">
          {isFr ? "Ajoute Ta Photo Pour l'Analyse Morphologique" : "Upload Your Photo for Morphological Analysis"}
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
          {isFr
            ? "Notre IA analyse la symétrie, les proportions et les zones prioritaires pour concevoir ton plan sur-mesure."
            : "Our AI analyzes symmetry, proportions, and target zones to craft your personalized workout plan."}
        </p>
      </div>

      {/* Main Upload Box or Scanner View */}
      <div className="bg-[#16161E] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {selectedPhoto ? (
          /* Scanner Active View */
          <div className="space-y-6">
            <div className="relative max-w-md mx-auto h-96 rounded-2xl overflow-hidden border-2 border-[#FF5500]/50 shadow-2xl bg-black">
              <img
                src={selectedPhoto}
                alt="Physique à analyser"
                className="w-full h-full object-cover"
              />

              {/* Scanning Laser Line Overlay */}
              {isScanning && (
                <div
                  className="absolute inset-x-0 h-1 bg-[#FF5500] shadow-[0_0_20px_#FF5500] transition-all duration-200"
                  style={{ top: `${scanProgress}%` }}
                />
              )}

              {/* AI Crosshair Grid */}
              <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-24 h-24 border border-dashed border-[#FF5500] rounded-full animate-ping pointer-events-none opacity-40" />

              {/* Scan Status Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md border border-white/15 rounded-xl p-3 text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-white">
                  <Sparkles className="w-4 h-4 text-[#FF5500] animate-spin-slow" />
                  <span>
                    {isScanning
                      ? `ANALYSE DES ZONES MUSCULAIRES EN COURS (${scanProgress}%)`
                      : "ANALYSE MORPHOLOGIQUE COMPLÉTÉE ✓"}
                  </span>
                </div>
                {!isScanning && (
                  <p className="text-[11px] text-emerald-400 font-medium">
                    Symétrie & Ratio Cible Détectés
                  </p>
                )}
              </div>
            </div>

            {/* Actions for Selected Photo */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Changer de photo</span>
              </button>

              <button
                onClick={handleConfirmPhoto}
                disabled={isScanning}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                  isScanning
                    ? "bg-gray-700 cursor-not-allowed opacity-60"
                    : "bg-gradient-to-r from-[#FF5500] to-[#FF3E00] hover:scale-105 shadow-[#FF5500]/30"
                }`}
              >
                <span>VALIDER & CONTINUER VERS LE QUESTIONNAIRE</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          /* File Pick Dropzone */
          <div className="space-y-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 hover:border-[#FF5500] bg-white/5 hover:bg-[#FF5500]/5 rounded-2xl p-8 sm:p-12 text-center space-y-4 cursor-pointer transition-all group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500] mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="font-extrabold text-lg text-white">
                  Téléverse une photo de toi ou de la zone à muscler
                </p>
                <p className="text-xs text-gray-400">
                  Format JPG, PNG ou WEBP • Traitement 100% confidentiel
                </p>
              </div>
              <button className="bg-[#FF5500] text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider group-hover:bg-[#FF6611]">
                Sélectionner un fichier
              </button>
            </div>

            {/* Or Select From Demo Photos */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-semibold uppercase tracking-wider">
                  Pas de photo sous la main ? Essaie avec une photo d'exemple (gratuit) :
                </span>
                <span className="text-[#FF5500] font-bold">Aucun paiement requis</span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {DEMO_SAMPLE_PHOTOS.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => triggerScan(sample.url)}
                    className="bg-[#121218] border border-white/10 hover:border-[#FF5500] rounded-xl p-3 cursor-pointer group transition-all space-y-2 hover:scale-[1.02]"
                  >
                    <div className="h-36 rounded-lg overflow-hidden relative">
                      <img
                        src={sample.url}
                        alt={sample.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute bottom-2 left-2 bg-[#FF5500] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {sample.targetZone}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white group-hover:text-[#FF5500]">
                        {sample.title}
                      </p>
                      <p className="text-[11px] text-gray-400 line-clamp-1">
                        {sample.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

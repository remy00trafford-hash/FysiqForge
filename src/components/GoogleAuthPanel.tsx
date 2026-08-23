import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, LogIn, LogOut, Loader2, ShieldCheck } from "lucide-react";

declare global { interface Window { google?: any } }

interface AuthUser { email: string; displayName?: string | null; avatarUrl?: string | null }
interface GoogleAuthPanelProps { onAuthenticated?: (user: AuthUser) => void }

export const GoogleAuthPanel: React.FC<GoogleAuthPanelProps> = ({ onAuthenticated }) => {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [configured, setConfigured] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);

  const refreshSession = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.authenticated && data.user) {
        setUser(data.user);
        onAuthenticated?.(data.user);
      }
    } catch {
      // Keep the login UI usable when the backend is temporarily unavailable.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const configRes = await fetch("/api/auth/config", { credentials: "include" });
        const config = await configRes.json().catch(() => ({}));
        const clientId = String(config?.googleClientId || "").trim();
        if (cancelled) return;
        setConfigured(Boolean(clientId));
        if (!clientId) {
          setError("La connexion Google n'est pas encore configurée sur ce déploiement.");
          await refreshSession();
          return;
        }

        const init = () => {
          if (cancelled || !window.google || !buttonRef.current) return;
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response: any) => {
              setError(null);
              setGoogleLoading(true);
              try {
                if (!response?.credential) throw new Error("Google n'a pas fourni de jeton de connexion.");
                const res = await fetch("/api/auth/google", {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ credential: response.credential })
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok || !data.authenticated || !data.user) throw new Error(data?.error || "Connexion Google impossible");
                setUser(data.user);
                onAuthenticated?.(data.user);
              } catch (e) {
                setError(e instanceof Error ? e.message : "Connexion Google impossible");
              } finally {
                setGoogleLoading(false);
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
            ux_mode: "popup"
          });
          buttonRef.current.innerHTML = "";
          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: "outline",
            size: "large",
            shape: "pill",
            text: "signin_with",
            width: 320,
            logo_alignment: "left"
          });
        };

        if (window.google) init();
        else {
          const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
          if (existing) existing.addEventListener("load", init, { once: true });
          else {
            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true; script.defer = true;
            script.onload = init;
            script.onerror = () => setError("Le service Google n'a pas pu être chargé. Vérifie la connexion Internet.");
            document.head.appendChild(script);
          }
        }
        await refreshSession();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Impossible de charger la connexion Google.");
        setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; try { window.google?.accounts.id.disableAutoSelect(); } catch {} };
  }, []);

  const logout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }); }
    finally { setUser(null); }
  };

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-[#14141B] p-6 shadow-2xl text-white">
      {loading ? (
        <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 text-gray-300">
          <Loader2 className="h-7 w-7 animate-spin text-[#FF5500]" />
          <p className="text-sm font-semibold">Chargement de la connexion sécurisée…</p>
        </div>
      ) : user ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-11 w-11 rounded-full" /> : <CheckCircle2 className="h-6 w-6 text-emerald-400" />}
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-300"><ShieldCheck className="h-3.5 w-3.5" /> Compte Google connecté</div>
              <div className="truncate text-sm font-bold text-white">{user.email}</div>
            </div>
          </div>
          <button onClick={logout} className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold hover:bg-white/10"><LogOut className="h-4 w-4" /> Se déconnecter</button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider"><LogIn className="h-4 w-4 text-[#FF5500]" /> Connexion à FysiqForge</div>
          <p className="text-xs leading-relaxed text-gray-400">Utilise Google pour retrouver ton compte et ton plan enregistré. Google affichera son propre sélecteur de comptes sur ton appareil.</p>
          {configured ? <div ref={buttonRef} className="flex min-h-[44px] justify-center overflow-hidden" /> : <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">La connexion Google n'est pas configurée sur cette version.</div>}
          {googleLoading && <div className="flex items-center justify-center gap-2 text-xs text-gray-400"><Loader2 className="h-4 w-4 animate-spin" /> Connexion en cours…</div>}
          {error && <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-950/30 p-3 text-xs font-semibold text-red-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
        </div>
      )}
    </div>
  );
};

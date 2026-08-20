import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, LogIn, LogOut, ShieldCheck } from "lucide-react";

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleAuthPanelProps {
  onAuthenticated?: (user: { email: string; displayName?: string | null; avatarUrl?: string | null }) => void;
}

export const GoogleAuthPanel: React.FC<GoogleAuthPanelProps> = ({ onAuthenticated }) => {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [configured, setConfigured] = useState(false);
  const [user, setUser] = useState<{ email: string; displayName?: string | null; avatarUrl?: string | null } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
        onAuthenticated?.(data.user);
      }
    } catch {
      // Network unavailable: keep the rest of the app usable.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const configRes = await fetch("/api/auth/config");
        const config = await configRes.json();
        const clientId = String(config?.googleClientId || "").trim();
        setConfigured(Boolean(clientId));
        if (!clientId) {
          await refreshSession();
          return;
        }
        const init = () => {
          if (!window.google || !buttonRef.current) return;
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response: any) => {
              setError(null);
              try {
                const res = await fetch("/api/auth/google", {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ credential: response.credential })
                });
                const data = await res.json();
                if (!res.ok || !data.authenticated) throw new Error(data?.error || "Connexion Google impossible");
                setUser(data.user);
                onAuthenticated?.(data.user);
              } catch (e) {
                setError(e instanceof Error ? e.message : "Connexion Google impossible");
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true
          });
          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: "outline",
            size: "large",
            shape: "pill",
            text: "signin_with",
            width: 320
          });
        };
        if (window.google) init();
        else {
          const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
          if (existing) {
            existing.addEventListener("load", init, { once: true });
          } else {
            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = init;
            script.onerror = () => setError("Le service Google n'a pas pu être chargé.");
            document.head.appendChild(script);
          }
        }
        await refreshSession();
      } catch {
        setLoading(false);
      }
    };
    void load();
    return () => {
      try { window.google?.accounts.id.disableAutoSelect(); } catch {}
    };
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      setUser(null);
    }
  };

  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
        {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-8 w-8 rounded-full" /> : <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Compte Google connecté</div>
          <div className="truncate text-xs font-bold text-white max-w-[190px]">{user.email}</div>
        </div>
        <button onClick={logout} className="ml-auto rounded-xl p-2 text-gray-400 hover:bg-white/10 hover:text-white" title="Se déconnecter"><LogOut className="h-4 w-4" /></button>
      </div>
    );
  }

  if (!configured) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#16161E] p-4 space-y-2">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-200"><LogIn className="h-4 w-4 text-[#FF5500]" /> Compte sécurisé</div>
      <p className="text-[11px] text-gray-400">Connecte-toi avec Google pour conserver ton identité et retrouver tes données sur tes appareils.</p>
      <div ref={buttonRef} className="flex justify-center min-h-[44px]" />
      {error && <p className="text-[10px] font-semibold text-red-300">{error}</p>}
    </div>
  );
};

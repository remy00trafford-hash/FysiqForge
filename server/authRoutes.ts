import type { Express, Request, Response } from "express";
import { db, createSession, getUserBySession, upsertUser, savePlan, listPlans, saveProgress, listProgress, saveReminder, listReminders, listNotifications, deleteSession, consumeRateLimit } from "./db";

const SESSION_COOKIE = "fysiq_session", SESSION_MAX_AGE = 60 * 60 * 24 * 30;
function cookie(req: Request) { const h = req.headers.cookie || ""; const p = h.split(";").map(v => v.trim()).find(v => v.startsWith(SESSION_COOKIE + "=")); return p ? decodeURIComponent(p.slice(SESSION_COOKIE.length + 1)) : undefined; }
function setCookie(res: Response, token: string) { const secure = String(process.env.APP_URL || "").startsWith("https://") ? "; Secure" : ""; res.setHeader("Set-Cookie", `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_MAX_AGE}${secure}`); }
function clearCookie(res: Response) { res.setHeader("Set-Cookie", `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`); }
async function user(req: Request) { return getUserBySession(cookie(req)); }
function clientKey(req: Request) { const forwarded = req.headers["x-forwarded-for"]; return String(forwarded || req.socket.remoteAddress || "unknown").split(",")[0].trim(); }
async function limit(req: Request, res: Response, bucket: string, max: number, windowSeconds: number) {
  const result = await consumeRateLimit(`${bucket}:${clientKey(req)}`, max, windowSeconds);
  res.setHeader("X-RateLimit-Limit", String(max));
  res.setHeader("X-RateLimit-Remaining", String(result.remaining));
  if (!result.allowed) { if (result.resetAt) res.setHeader("Retry-After", String(Math.max(1, Math.ceil((Date.parse(result.resetAt) - Date.now()) / 1000)))); res.status(429).json({ error: "Trop de requêtes. Réessaie dans quelques instants." }); return false; }
  return true;
}

function validName(value: string) {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ'’-]{2,}(?:[ -][A-Za-zÀ-ÖØ-öø-ÿ'’-]{2,}){0,4}$/.test(value.trim());
}
function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

async function verifyGoogle(credential: string) {
  const clientId = String(process.env.GOOGLE_CLIENT_ID || "").trim();
  if (!clientId || !credential) throw new Error("Google OAuth n'est pas configuré.");
  const r = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
  if (!r.ok) throw new Error("Jeton Google invalide ou expiré.");
  const t = await r.json() as Record<string, string>;
  if (t.aud !== clientId || t.email_verified !== "true" || (t.iss !== "https://accounts.google.com" && t.iss !== "accounts.google.com") || !t.sub || !t.email) throw new Error("Identité Google invalide.");
  if (t.exp && Number(t.exp) * 1000 < Date.now()) throw new Error("Session Google expirée.");
  return { email: t.email.toLowerCase(), displayName: t.name || undefined, avatarUrl: t.picture || undefined, googleSub: t.sub };
}

export function registerAuthRoutes(app: Express) {
  app.get("/api/auth/config", (_q, r) => r.json({ googleClientId: process.env.GOOGLE_CLIENT_ID || "" }));

  app.get("/api/auth/me", async (req, res) => {
    try { const u = await user(req); return res.json(u ? { authenticated: true, user: { id: u.id, email: u.email, displayName: u.display_name, avatarUrl: u.avatar_url } } : { authenticated: false }); }
    catch (e) { console.error(e); return res.status(500).json({ authenticated: false }); }
  });

  app.post("/api/auth/google", async (req, res) => {
    if (!(await limit(req, res, "auth:google", 10, 15 * 60))) return;
    try {
      if (!db) return res.status(503).json({ error: "Base de données indisponible" });
      const identity = await verifyGoogle(String(req.body?.credential || ""));
      const u = await upsertUser(identity);
      if (!u) return res.status(503).json({ error: "Création du compte impossible" });
      const s = await createSession(u.id);
      if (!s) return res.status(503).json({ error: "Création de session impossible" });
      setCookie(res, s);
      return res.json({ authenticated: true, user: { id: u.id, email: u.email, displayName: u.display_name, avatarUrl: u.avatar_url } });
    } catch (e) { return res.status(401).json({ error: e instanceof Error ? e.message : "Connexion Google impossible" }); }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try { const t = cookie(req); if (t && db) await deleteSession(t); } catch (e) { console.error(e); }
    clearCookie(res); return res.json({ ok: true });
  });

  app.get("/api/data/plans", async (req, res) => {
    if (!(await limit(req, res, "data:plans:read", 60, 60))) return;
    const u = await user(req); if (!u) return res.status(401).json({ error: "Authentification requise" });
    return res.json({ plans: await listPlans(u.id) });
  });

  app.post("/api/account/claim-plan", async (req, res) => {
    if (!(await limit(req, res, "account:claim", 10, 15 * 60))) return;
    if (!db) return res.status(503).json({ error: "Base de données indisponible" });
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const tierId = String(req.body?.tierId || "performance");
    if (!validName(name)) return res.status(400).json({ error: "Nom invalide. Saisis au moins 2 lettres pour le prénom et le nom." });
    if (!validEmail(email)) return res.status(400).json({ error: "Adresse email invalide. Vérifie le format de ton adresse." });
    if (!["essentiel", "performance", "elite"].includes(tierId)) return res.status(400).json({ error: "Plan invalide." });
    try {
      const u = await upsertUser({ email, displayName: name });
      if (!u) return res.status(503).json({ error: "Création du compte impossible" });
      const s = await createSession(u.id);
      if (!s) return res.status(503).json({ error: "Création de session impossible" });
      const saved = await savePlan(u.id, tierId, req.body?.plan || {});
      if (!saved) return res.status(503).json({ error: "Enregistrement du plan impossible" });
      setCookie(res, s);
      return res.json({ authenticated: true, user: { id: u.id, email: u.email, displayName: u.display_name, avatarUrl: u.avatar_url }, plan: saved });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Impossible d'enregistrer le compte et le plan." });
    }
  });

  app.post("/api/data/plan", async (req, res) => {
    if (!(await limit(req, res, "data:plan", 30, 60))) return;
    const u = await user(req); if (!u) return res.status(401).json({ error: "Authentification requise" });
    try { const p = await savePlan(u.id, String(req.body?.tierId || "performance"), req.body?.plan || {}); return p ? res.json({ plan: p }) : res.status(503).json({ error: "Base indisponible" }); } catch (e) { console.error(e); return res.status(500).json({ error: "Enregistrement impossible" }); }
  });

  app.post("/api/data/progress", async (req, res) => {
    if (!(await limit(req, res, "data:progress:write", 60, 60))) return;
    const u = await user(req); if (!u) return res.status(401).json({ error: "Authentification requise" });
    try { const p = await saveProgress(u.id, String(req.body?.workoutKey || ""), req.body?.payload || {}, req.body?.completedAt); return p ? res.json({ progress: p }) : res.status(503).json({ error: "Base indisponible" }); } catch (e) { console.error(e); return res.status(500).json({ error: "Enregistrement impossible" }); }
  });

  app.get("/api/data/progress", async (req, res) => {
    if (!(await limit(req, res, "data:progress:read", 120, 60))) return;
    const u = await user(req); if (!u) return res.status(401).json({ error: "Authentification requise" });
    return res.json({ progress: await listProgress(u.id) });
  });

  app.post("/api/data/reminders", async (req, res) => {
    if (!(await limit(req, res, "data:reminders:write", 30, 60))) return;
    const u = await user(req); if (!u) return res.status(401).json({ error: "Authentification requise" });
    if (!req.body?.workoutId || !req.body?.scheduledAt) return res.status(400).json({ error: "workoutId et scheduledAt sont requis" });
    try { const x = await saveReminder(u.id, { workoutId: String(req.body.workoutId), scheduledAt: String(req.body.scheduledAt), status: String(req.body.status || "pending") }); return x ? res.json({ reminder: x }) : res.status(503).json({ error: "Base indisponible" }); } catch (e) { console.error(e); return res.status(500).json({ error: "Enregistrement impossible" }); }
  });

  app.get("/api/data/reminders", async (req, res) => {
    if (!(await limit(req, res, "data:reminders:read", 120, 60))) return;
    const u = await user(req); if (!u) return res.status(401).json({ error: "Authentification requise" });
    return res.json({ reminders: await listReminders(u.id) });
  });

  app.get("/api/data/notifications", async (req, res) => {
    if (!(await limit(req, res, "data:notifications:read", 120, 60))) return;
    const u = await user(req); if (!u) return res.status(401).json({ error: "Authentification requise" });
    return res.json({ notifications: await listNotifications(u.id) });
  });
}

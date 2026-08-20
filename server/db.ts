import { Pool } from "pg";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export const db = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 20, idleTimeoutMillis: 30000, connectionTimeoutMillis: 5000 })
  : null;

export async function initDb() {
  if (!db) return false;
  const schema = await fs.readFile(path.resolve(process.cwd(), "server/db/schema.sql"), "utf8");
  await db.query(schema);
  await db.query("DELETE FROM sessions WHERE expires_at <= now()");
  return true;
}

export function hashToken(token: string) { return crypto.createHash("sha256").update(token).digest("hex"); }

export async function upsertUser(input: { email: string; displayName?: string; avatarUrl?: string; googleSub?: string }) {
  if (!db) return null;
  const result = await db.query(
    `INSERT INTO users (email, display_name, avatar_url, google_sub) VALUES ($1,$2,$3,$4)
     ON CONFLICT (email) DO UPDATE SET display_name=COALESCE(EXCLUDED.display_name,users.display_name), avatar_url=COALESCE(EXCLUDED.avatar_url,users.avatar_url), google_sub=COALESCE(EXCLUDED.google_sub,users.google_sub), updated_at=now()
     RETURNING *`,
    [input.email, input.displayName || null, input.avatarUrl || null, input.googleSub || null]
  );
  return result.rows[0];
}

export async function createSession(userId: string, ttlSeconds = 60 * 60 * 24 * 30) {
  if (!db) return null;
  const token = crypto.randomBytes(32).toString("hex");
  await db.query("DELETE FROM sessions WHERE expires_at <= now() OR user_id=$1", [userId]);
  await db.query(`INSERT INTO sessions (user_id, token_hash, expires_at) VALUES ($1,$2,now() + ($3 * interval '1 second'))`, [userId, hashToken(token), ttlSeconds]);
  return token;
}

export async function getUserBySession(token?: string) {
  if (!db || !token) return null;
  const result = await db.query(`SELECT u.* FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.token_hash=$1 AND s.expires_at>now()`, [hashToken(token)]);
  return result.rows[0] || null;
}

export async function savePlan(userId: string, tierId: string, plan: unknown) {
  if (!db) return null;
  const result = await db.query(`INSERT INTO plans (user_id,tier_id,plan_json) VALUES ($1,$2,$3) RETURNING id,user_id,tier_id,created_at,updated_at`, [userId, tierId, JSON.stringify(plan)]);
  return result.rows[0];
}

export async function listPlans(userId: string) {
  if (!db) return [];
  const result = await db.query(`SELECT id,user_id,tier_id,plan_json,created_at,updated_at FROM plans WHERE user_id=$1 ORDER BY created_at DESC LIMIT 20`, [userId]);
  return result.rows;
}

export async function saveProgress(userId: string, workoutKey: string, payload: unknown, completedAt?: string) {
  if (!db || !workoutKey) return null;
  const result = await db.query(`INSERT INTO workout_progress (user_id,workout_key,payload,completed_at) VALUES ($1,$2,$3,$4) ON CONFLICT (user_id,workout_key) DO UPDATE SET payload=EXCLUDED.payload, completed_at=EXCLUDED.completed_at RETURNING *`, [userId, workoutKey, JSON.stringify(payload || {}), completedAt || null]);
  return result.rows[0];
}

export async function listProgress(userId: string) {
  if (!db) return [];
  const result = await db.query(`SELECT * FROM workout_progress WHERE user_id=$1 ORDER BY created_at DESC`, [userId]);
  return result.rows;
}

export async function saveReminder(userId: string, reminder: { workoutId: string; scheduledAt: string; status?: string }) {
  if (!db) return null;
  const result = await db.query(`INSERT INTO reminders (user_id,workout_id,scheduled_at,status) VALUES ($1,$2,$3,$4) RETURNING *`, [userId, reminder.workoutId, reminder.scheduledAt, reminder.status || "pending"]);
  return result.rows[0];
}

export async function listReminders(userId: string) {
  if (!db) return [];
  const result = await db.query(`SELECT * FROM reminders WHERE user_id=$1 ORDER BY scheduled_at ASC`, [userId]);
  return result.rows;
}

export async function listNotifications(userId: string) {
  if (!db) return [];
  const result = await db.query(`SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100`, [userId]);
  return result.rows;
}

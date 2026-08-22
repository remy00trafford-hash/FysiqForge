import { Pool, type PoolClient } from "pg";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export const db = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 20, idleTimeoutMillis: 30000, connectionTimeoutMillis: 5000 })
  : null;

async function withContext<T>(userId: string | null, fn: (client: PoolClient) => Promise<T>): Promise<T> {
  if (!db) throw new Error("Database unavailable");
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT set_config('app.service',$1,true), set_config('app.user_id',$2,true)", [userId ? "false" : "true", userId || ""]);
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

export async function initDb() {
  if (!db) return false;
  const schema = await fs.readFile(path.resolve(process.cwd(), "server/db/schema.sql"), "utf8");
  await withContext(null, async (client) => {
    await client.query(schema);
    await client.query("DELETE FROM sessions WHERE expires_at <= now()");
    await client.query("DELETE FROM rate_limit_buckets WHERE updated_at < now() - interval '2 hours'");
  });
  return true;
}

export function hashToken(token: string) { return crypto.createHash("sha256").update(token).digest("hex"); }

export async function upsertUser(input: { email: string; displayName?: string; avatarUrl?: string; googleSub?: string }) {
  return withContext(null, async (client) => {
    const result = await client.query(`INSERT INTO users (email, display_name, avatar_url, google_sub) VALUES ($1,$2,$3,$4)
      ON CONFLICT (email) DO UPDATE SET display_name=COALESCE(EXCLUDED.display_name,users.display_name), avatar_url=COALESCE(EXCLUDED.avatar_url,users.avatar_url), google_sub=COALESCE(EXCLUDED.google_sub,users.google_sub), updated_at=now() RETURNING *`,
      [input.email, input.displayName || null, input.avatarUrl || null, input.googleSub || null]);
    return result.rows[0];
  });
}

export async function createSession(userId: string, ttlSeconds = 60 * 60 * 24 * 30) {
  return withContext(null, async (client) => {
    const token = crypto.randomBytes(32).toString("hex");
    await client.query("DELETE FROM sessions WHERE expires_at <= now() OR user_id=$1", [userId]);
    await client.query(`INSERT INTO sessions (user_id, token_hash, expires_at) VALUES ($1,$2,now() + ($3 * interval '1 second'))`, [userId, hashToken(token), ttlSeconds]);
    return token;
  });
}

export async function getUserBySession(token?: string) {
  if (!db || !token) return null;
  return withContext(null, async (client) => {
    const result = await client.query(`SELECT u.* FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.token_hash=$1 AND s.expires_at>now()`, [hashToken(token)]);
    return result.rows[0] || null;
  });
}

export async function deleteSession(token: string) {
  return withContext(null, async (client) => { await client.query("DELETE FROM sessions WHERE token_hash=$1", [hashToken(token)]); });
}

export async function consumeRateLimit(key: string, limit: number, windowSeconds: number) {
  if (!db) return { allowed: true, remaining: limit };
  return withContext(null, async (client) => {
    const result = await client.query(`INSERT INTO rate_limit_buckets(key,window_started_at,request_count,updated_at) VALUES ($1,now(),1,now())
      ON CONFLICT (key) DO UPDATE SET window_started_at=CASE WHEN rate_limit_buckets.window_started_at <= now() - ($2 * interval '1 second') THEN now() ELSE rate_limit_buckets.window_started_at END,
      request_count=CASE WHEN rate_limit_buckets.window_started_at <= now() - ($2 * interval '1 second') THEN 1 ELSE rate_limit_buckets.request_count + 1 END, updated_at=now()
      RETURNING request_count, window_started_at`, [key, windowSeconds]);
    const count = Number(result.rows[0].request_count);
    return { allowed: count <= limit, remaining: Math.max(0, limit - count), resetAt: new Date(new Date(result.rows[0].window_started_at).getTime() + windowSeconds * 1000).toISOString() };
  });
}

export async function savePlan(userId: string, tierId: string, plan: unknown) {
  return withContext(userId, async (client) => (await client.query(`INSERT INTO plans (user_id,tier_id,plan_json) VALUES ($1,$2,$3) RETURNING id,user_id,tier_id,created_at,updated_at`, [userId, tierId, JSON.stringify(plan)])).rows[0]);
}
export async function listPlans(userId: string) { return withContext(userId, async (client) => (await client.query(`SELECT id,user_id,tier_id,plan_json,created_at,updated_at FROM plans WHERE user_id=$1 ORDER BY created_at DESC LIMIT 20`, [userId])).rows); }
export async function saveProgress(userId: string, workoutKey: string, payload: unknown, completedAt?: string) {
  if (!workoutKey) return null;
  return withContext(userId, async (client) => (await client.query(`INSERT INTO workout_progress (user_id,workout_key,payload,completed_at) VALUES ($1,$2,$3,$4) ON CONFLICT (user_id,workout_key) DO UPDATE SET payload=EXCLUDED.payload, completed_at=EXCLUDED.completed_at RETURNING *`, [userId, workoutKey, JSON.stringify(payload || {}), completedAt || null])).rows[0]);
}
export async function listProgress(userId: string) { return withContext(userId, async (client) => (await client.query(`SELECT * FROM workout_progress WHERE user_id=$1 ORDER BY created_at DESC`, [userId])).rows); }
export async function saveReminder(userId: string, reminder: { workoutId: string; scheduledAt: string; status?: string }) {
  return withContext(userId, async (client) => (await client.query(`INSERT INTO reminders (user_id,workout_id,scheduled_at,status) VALUES ($1,$2,$3,$4) RETURNING *`, [userId, reminder.workoutId, reminder.scheduledAt, reminder.status || "pending"])).rows[0]);
}
export async function listReminders(userId: string) { return withContext(userId, async (client) => (await client.query(`SELECT * FROM reminders WHERE user_id=$1 ORDER BY scheduled_at ASC`, [userId])).rows); }
export async function listNotifications(userId: string) { return withContext(userId, async (client) => (await client.query(`SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100`, [userId])).rows); }

export async function markNotificationRead(userId: string, notificationId: string) {
  return withContext(userId, async (client) => (await client.query("UPDATE notifications SET read=true WHERE id=$1 AND user_id=$2 RETURNING id", [notificationId, userId])).rowCount || 0);
}
export async function completeReminder(userId: string, workoutId: string) {
  return withContext(userId, async (client) => {
    const result = await client.query("UPDATE reminders SET status='done', due_notified=true, missed_notified=true WHERE user_id=$1 AND workout_id=$2 RETURNING id", [userId, workoutId]);
    await client.query("UPDATE notifications SET resolved=true WHERE user_id=$1 AND workout_id=$2", [userId, workoutId]);
    return result.rowCount || 0;
  });
}
export async function rescheduleReminder(userId: string, workoutId: string, scheduledAt: string) {
  return withContext(userId, async (client) => {
    const result = await client.query("UPDATE reminders SET status='pending', scheduled_at=$3, due_notified=false, missed_notified=false WHERE user_id=$1 AND workout_id=$2 RETURNING id", [userId, workoutId, scheduledAt]);
    await client.query("UPDATE notifications SET resolved=true WHERE user_id=$1 AND workout_id=$2", [userId, workoutId]);
    return result.rowCount || 0;
  });
}

export async function runAsService<T>(fn: (client: PoolClient) => Promise<T>) { return withContext(null, fn); }

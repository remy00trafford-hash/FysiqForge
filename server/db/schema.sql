-- FysiqForge production persistence schema
-- Run automatically when DATABASE_URL is configured.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email TEXT NOT NULL UNIQUE, display_name TEXT, avatar_url TEXT, google_sub TEXT UNIQUE, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, token_hash TEXT NOT NULL UNIQUE, expires_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_token_hash_idx ON sessions(token_hash); CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, tier_id TEXT NOT NULL, plan_json JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS plans_user_id_idx ON plans(user_id);
CREATE TABLE IF NOT EXISTS workout_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, workout_key TEXT NOT NULL, completed_at TIMESTAMPTZ, payload JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(user_id, workout_key)
);
CREATE INDEX IF NOT EXISTS workout_progress_user_id_idx ON workout_progress(user_id);
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, workout_id TEXT NOT NULL, scheduled_at TIMESTAMPTZ NOT NULL, status TEXT NOT NULL DEFAULT 'pending', due_notified BOOLEAN NOT NULL DEFAULT false, missed_notified BOOLEAN NOT NULL DEFAULT false, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reminders_due_idx ON reminders(scheduled_at, status, due_notified); CREATE INDEX IF NOT EXISTS reminders_user_id_idx ON reminders(user_id);
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, workout_id TEXT, type TEXT NOT NULL, title TEXT NOT NULL, message TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), read BOOLEAN NOT NULL DEFAULT false, resolved BOOLEAN NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS notifications_user_created_idx ON notifications(user_id, created_at DESC);
CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  key TEXT PRIMARY KEY, window_started_at TIMESTAMPTZ NOT NULL DEFAULT now(), request_count INTEGER NOT NULL DEFAULT 0, updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS rate_limit_buckets_updated_idx ON rate_limit_buckets(updated_at);

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS users_updated_at ON users; CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS plans_updated_at ON plans; CREATE TRIGGER plans_updated_at BEFORE UPDATE ON plans FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE users ENABLE ROW LEVEL SECURITY; ALTER TABLE users FORCE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY; ALTER TABLE sessions FORCE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY; ALTER TABLE plans FORCE ROW LEVEL SECURITY;
ALTER TABLE workout_progress ENABLE ROW LEVEL SECURITY; ALTER TABLE workout_progress FORCE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY; ALTER TABLE reminders FORCE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY; ALTER TABLE notifications FORCE ROW LEVEL SECURITY;
ALTER TABLE rate_limit_buckets ENABLE ROW LEVEL SECURITY; ALTER TABLE rate_limit_buckets FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_self_or_service ON users;
CREATE POLICY users_self_or_service ON users FOR ALL USING (current_setting('app.service', true)='true' OR id=NULLIF(current_setting('app.user_id', true),'')::uuid) WITH CHECK (current_setting('app.service', true)='true' OR id=NULLIF(current_setting('app.user_id', true),'')::uuid);
DROP POLICY IF EXISTS sessions_service_only ON sessions;
CREATE POLICY sessions_service_only ON sessions FOR ALL USING (current_setting('app.service', true)='true') WITH CHECK (current_setting('app.service', true)='true');
DROP POLICY IF EXISTS plans_user_or_service ON plans;
CREATE POLICY plans_user_or_service ON plans FOR ALL USING (current_setting('app.service', true)='true' OR user_id=NULLIF(current_setting('app.user_id', true),'')::uuid) WITH CHECK (current_setting('app.service', true)='true' OR user_id=NULLIF(current_setting('app.user_id', true),'')::uuid);
DROP POLICY IF EXISTS progress_user_or_service ON workout_progress;
CREATE POLICY progress_user_or_service ON workout_progress FOR ALL USING (current_setting('app.service', true)='true' OR user_id=NULLIF(current_setting('app.user_id', true),'')::uuid) WITH CHECK (current_setting('app.service', true)='true' OR user_id=NULLIF(current_setting('app.user_id', true),'')::uuid);
DROP POLICY IF EXISTS reminders_user_or_service ON reminders;
CREATE POLICY reminders_user_or_service ON reminders FOR ALL USING (current_setting('app.service', true)='true' OR user_id=NULLIF(current_setting('app.user_id', true),'')::uuid) WITH CHECK (current_setting('app.service', true)='true' OR user_id=NULLIF(current_setting('app.user_id', true),'')::uuid);
DROP POLICY IF EXISTS notifications_user_or_service ON notifications;
CREATE POLICY notifications_user_or_service ON notifications FOR ALL USING (current_setting('app.service', true)='true' OR user_id=NULLIF(current_setting('app.user_id', true),'')::uuid) WITH CHECK (current_setting('app.service', true)='true' OR user_id=NULLIF(current_setting('app.user_id', true),'')::uuid);
DROP POLICY IF EXISTS rate_limit_service_only ON rate_limit_buckets;
CREATE POLICY rate_limit_service_only ON rate_limit_buckets FOR ALL USING (current_setting('app.service', true)='true') WITH CHECK (current_setting('app.service', true)='true');

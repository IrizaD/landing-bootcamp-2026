-- ============================================================
-- Migración: Analytics granular — Landing Bootcamp 2026
-- Ejecutar en: Supabase → SQL Editor (del proyecto synergy-code-3)
-- Idempotente: puedes correrla múltiples veces sin romper data.
-- ============================================================

-- 1. Tabla maestra de sesiones (una fila por visitante)
CREATE TABLE IF NOT EXISTS sessions (
  session_id     TEXT        PRIMARY KEY,
  funnel_slug    TEXT        NOT NULL DEFAULT 'bootcamp-2026',
  visitor_id     TEXT        NOT NULL DEFAULT '',
  first_seen_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_time_ms  BIGINT      NOT NULL DEFAULT 0,
  max_scroll_pct INTEGER     NOT NULL DEFAULT 0,
  page_views     INTEGER     NOT NULL DEFAULT 1,
  event_count    INTEGER     NOT NULL DEFAULT 0,
  click_count    INTEGER     NOT NULL DEFAULT 0,
  converted      BOOLEAN     NOT NULL DEFAULT false,
  converted_at   TIMESTAMPTZ,
  ip             TEXT        NOT NULL DEFAULT '',
  ip_country     TEXT        NOT NULL DEFAULT '',
  ip_region      TEXT        NOT NULL DEFAULT '',
  ip_city        TEXT        NOT NULL DEFAULT '',
  ip_latitude    TEXT        NOT NULL DEFAULT '',
  ip_longitude   TEXT        NOT NULL DEFAULT '',
  ip_timezone    TEXT        NOT NULL DEFAULT '',
  user_agent     TEXT        NOT NULL DEFAULT '',
  device_type    TEXT        NOT NULL DEFAULT '',
  os             TEXT        NOT NULL DEFAULT '',
  browser        TEXT        NOT NULL DEFAULT '',
  screen_w       INTEGER     NOT NULL DEFAULT 0,
  screen_h       INTEGER     NOT NULL DEFAULT 0,
  viewport_w     INTEGER     NOT NULL DEFAULT 0,
  viewport_h     INTEGER     NOT NULL DEFAULT 0,
  language       TEXT        NOT NULL DEFAULT '',
  timezone       TEXT        NOT NULL DEFAULT '',
  referrer       TEXT        NOT NULL DEFAULT '',
  referrer_host  TEXT        NOT NULL DEFAULT '',
  landing_path   TEXT        NOT NULL DEFAULT '/',
  utm_source     TEXT        NOT NULL DEFAULT '',
  utm_medium     TEXT        NOT NULL DEFAULT '',
  utm_campaign   TEXT        NOT NULL DEFAULT '',
  utm_content    TEXT        NOT NULL DEFAULT '',
  utm_term       TEXT        NOT NULL DEFAULT '',
  fbclid         TEXT        NOT NULL DEFAULT '',
  gclid          TEXT        NOT NULL DEFAULT '',
  ttclid         TEXT        NOT NULL DEFAULT '',
  is_bot         BOOLEAN     NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_sessions_created_at  ON sessions(first_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_country     ON sessions(ip_country);
CREATE INDEX IF NOT EXISTS idx_sessions_device      ON sessions(device_type);
CREATE INDEX IF NOT EXISTS idx_sessions_source      ON sessions(utm_source);
CREATE INDEX IF NOT EXISTS idx_sessions_converted   ON sessions(converted);

-- 2. Eventos granulares (click, section_view, scroll, form_focus, etc.)
CREATE TABLE IF NOT EXISTS track_events (
  id             BIGSERIAL   PRIMARY KEY,
  session_id     TEXT        NOT NULL,
  funnel_slug    TEXT        NOT NULL DEFAULT 'bootcamp-2026',
  event_type     TEXT        NOT NULL,
  event_target   TEXT        NOT NULL DEFAULT '',
  event_value    TEXT        NOT NULL DEFAULT '',
  section_id     TEXT        NOT NULL DEFAULT '',
  scroll_pct     INTEGER,
  dwell_ms       BIGINT,
  meta           JSONB       NOT NULL DEFAULT '{}'::jsonb,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_track_events_session ON track_events(session_id);
CREATE INDEX IF NOT EXISTS idx_track_events_type    ON track_events(event_type);
CREATE INDEX IF NOT EXISTS idx_track_events_section ON track_events(section_id);
CREATE INDEX IF NOT EXISTS idx_track_events_time    ON track_events(created_at DESC);

-- 3. Dwell acumulado por sección y sesión (agregado para dashboards rápidos)
CREATE TABLE IF NOT EXISTS section_dwell (
  session_id     TEXT        NOT NULL,
  section_id     TEXT        NOT NULL,
  funnel_slug    TEXT        NOT NULL DEFAULT 'bootcamp-2026',
  total_ms       BIGINT      NOT NULL DEFAULT 0,
  view_count     INTEGER     NOT NULL DEFAULT 0,
  last_seen_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (session_id, section_id)
);

CREATE INDEX IF NOT EXISTS idx_section_dwell_section ON section_dwell(section_id);
CREATE INDEX IF NOT EXISTS idx_section_dwell_funnel  ON section_dwell(funnel_slug);

-- 4. Cliks agregados por elemento (para CTR rápido)
CREATE TABLE IF NOT EXISTS click_aggregates (
  funnel_slug    TEXT        NOT NULL DEFAULT 'bootcamp-2026',
  event_target   TEXT        NOT NULL,
  day            DATE        NOT NULL DEFAULT CURRENT_DATE,
  clicks         INTEGER     NOT NULL DEFAULT 0,
  unique_sessions INTEGER    NOT NULL DEFAULT 0,
  PRIMARY KEY (funnel_slug, event_target, day)
);

-- 5. Vistas útiles para el dashboard
CREATE OR REPLACE VIEW v_funnel AS
SELECT
  funnel_slug,
  COUNT(*) FILTER (WHERE NOT is_bot)                                      AS sessions,
  COUNT(*) FILTER (WHERE NOT is_bot AND converted)                        AS conversions,
  ROUND(AVG(total_time_ms) FILTER (WHERE NOT is_bot) / 1000.0, 2)         AS avg_time_s,
  ROUND(AVG(max_scroll_pct) FILTER (WHERE NOT is_bot), 1)                 AS avg_scroll,
  ROUND(100.0 * COUNT(*) FILTER (WHERE NOT is_bot AND converted) /
        NULLIF(COUNT(*) FILTER (WHERE NOT is_bot), 0), 2)                 AS conversion_rate
FROM sessions
GROUP BY funnel_slug;

CREATE OR REPLACE VIEW v_top_ctas AS
SELECT
  event_target,
  COUNT(*)                                  AS clicks,
  COUNT(DISTINCT session_id)                AS unique_sessions
FROM track_events
WHERE event_type = 'click'
GROUP BY event_target
ORDER BY clicks DESC;

CREATE OR REPLACE VIEW v_section_engagement AS
SELECT
  section_id,
  COUNT(DISTINCT session_id)                AS sessions_viewed,
  ROUND(AVG(total_ms) / 1000.0, 2)          AS avg_dwell_s,
  SUM(total_ms)                             AS total_dwell_ms
FROM section_dwell
GROUP BY section_id
ORDER BY total_dwell_ms DESC;

-- 6. Función para incrementar dwell (upsert atómico)
CREATE OR REPLACE FUNCTION upsert_section_dwell(
  p_session_id TEXT,
  p_section_id TEXT,
  p_ms         BIGINT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO section_dwell (session_id, section_id, total_ms, view_count, last_seen_at)
  VALUES (p_session_id, p_section_id, p_ms, 1, now())
  ON CONFLICT (session_id, section_id) DO UPDATE
    SET total_ms     = section_dwell.total_ms + EXCLUDED.total_ms,
        view_count   = section_dwell.view_count + 1,
        last_seen_at = now();
END;
$$ LANGUAGE plpgsql;

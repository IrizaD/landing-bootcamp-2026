-- ============================================================================
-- Synergy Ops — Tablero de gestión Bootcamp 2026 + Synergy Unlimited
-- ============================================================================
-- Correr en Supabase SQL Editor del proyecto landing-bootcamp-2026
-- (peypcuyalrzqzujtrssx.supabase.co)
-- ============================================================================

-- ── Tablas ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ops_areas (
  id        SMALLSERIAL PRIMARY KEY,
  slug      TEXT UNIQUE NOT NULL,
  nombre    TEXT NOT NULL,
  color     TEXT NOT NULL,
  icono     TEXT,
  orden     SMALLINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ops_members (
  id        SMALLSERIAL PRIMARY KEY,
  slug      TEXT UNIQUE NOT NULL,
  nombre    TEXT NOT NULL,
  rol       TEXT NOT NULL,
  initials  TEXT NOT NULL,
  avatar_url TEXT,
  contact   TEXT,
  activo    BOOLEAN DEFAULT TRUE,
  orden     SMALLINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ops_milestones (
  id          SMALLSERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  nombre      TEXT NOT NULL,
  descripcion TEXT,
  fecha       TIMESTAMPTZ NOT NULL,
  tipo        TEXT NOT NULL,
  orden       SMALLINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ops_tasks (
  id            BIGSERIAL PRIMARY KEY,
  area_id       SMALLINT NOT NULL REFERENCES ops_areas(id) ON DELETE RESTRICT,
  titulo        TEXT NOT NULL,
  descripcion   TEXT,
  prioridad     SMALLINT DEFAULT 2 CHECK (prioridad BETWEEN 1 AND 4),
  estado        TEXT NOT NULL DEFAULT 'backlog'
                CHECK (estado IN ('backlog','en_progreso','bloqueado','en_revision','hecho')),
  fecha_limite  DATE,
  milestone_id  SMALLINT REFERENCES ops_milestones(id) ON DELETE SET NULL,
  progreso      SMALLINT DEFAULT 0 CHECK (progreso BETWEEN 0 AND 100),
  orden         INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ops_task_assignees (
  task_id    BIGINT NOT NULL REFERENCES ops_tasks(id) ON DELETE CASCADE,
  member_id  SMALLINT NOT NULL REFERENCES ops_members(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, member_id)
);

CREATE TABLE IF NOT EXISTS ops_task_comments (
  id         BIGSERIAL PRIMARY KEY,
  task_id    BIGINT NOT NULL REFERENCES ops_tasks(id) ON DELETE CASCADE,
  member_id  SMALLINT REFERENCES ops_members(id) ON DELETE SET NULL,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ops_task_blockers (
  task_id    BIGINT NOT NULL REFERENCES ops_tasks(id) ON DELETE CASCADE,
  blocker_id BIGINT NOT NULL REFERENCES ops_tasks(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, blocker_id),
  CHECK (task_id <> blocker_id)
);

CREATE TABLE IF NOT EXISTS ops_kpi_snapshots (
  id          BIGSERIAL PRIMARY KEY,
  metric      TEXT NOT NULL,
  value       NUMERIC NOT NULL,
  source      TEXT,
  metadata    JSONB,
  captured_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ops_tasks_area      ON ops_tasks(area_id);
CREATE INDEX IF NOT EXISTS idx_ops_tasks_estado    ON ops_tasks(estado);
CREATE INDEX IF NOT EXISTS idx_ops_tasks_milestone ON ops_tasks(milestone_id);
CREATE INDEX IF NOT EXISTS idx_ops_tasks_limite    ON ops_tasks(fecha_limite);
CREATE INDEX IF NOT EXISTS idx_ops_kpi_captured    ON ops_kpi_snapshots(metric, captured_at DESC);

CREATE OR REPLACE FUNCTION ops_set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ops_tasks_updated_at ON ops_tasks;
CREATE TRIGGER trg_ops_tasks_updated_at
BEFORE UPDATE ON ops_tasks
FOR EACH ROW EXECUTE FUNCTION ops_set_updated_at();

-- ── Seed: Áreas ─────────────────────────────────────────────────────────────

INSERT INTO ops_areas (slug, nombre, color, icono, orden) VALUES
  ('producto',    'Producto & Tech',     '#00e040', 'code',       1),
  ('video',       'Video & Producción',  '#f472b6', 'film',       2),
  ('pauta',       'Pauta & Ads',         '#60a5fa', 'megaphone',  3),
  ('copy',        'Copy & Guiones',      '#fbbf24', 'pen',        4),
  ('comunidades', 'Comunidades',         '#a78bfa', 'users',      5),
  ('ventas',      'Ventas',              '#34d399', 'phone',      6),
  ('merch',       'Merch & Logística',   '#f87171', 'package',    7),
  ('speakers',    'Speakers & Agenda',   '#fb923c', 'calendar',   8)
ON CONFLICT (slug) DO NOTHING;

-- ── Seed: Miembros ──────────────────────────────────────────────────────────

INSERT INTO ops_members (slug, nombre, rol, initials, orden) VALUES
  ('manuel',  'Manuel de León',  'Host / Organizador',  'ML', 1),
  ('jorge',   'Jorge Serratos',  'Speaker principal',   'JS', 2),
  ('david',   'David Iriza',     'Producto & Tech',     'DI', 3),
  ('pablo',   'Pablo',           'Coordinación',        'PB', 4),
  ('saul',    'Saúl',            'Video & Ads',         'SA', 5),
  ('dj',      'DJ',              'Pauta',               'DJ', 6),
  ('dani',    'Dani',            'Comunidades',         'DN', 7),
  ('daniel',  'Daniel',          'Comunidades / School','DL', 8),
  ('mariana', 'Mariana',         'Merch / Kit Black',   'MR', 9),
  ('clau',    'Clau',            'Equipo',              'CL', 10),
  ('abraham', 'Abraham',         'Speakers coord.',     'AB', 11),
  ('gio',     'Gio',             'Producción / Stream', 'GI', 12)
ON CONFLICT (slug) DO NOTHING;

-- ── Seed: Milestones (fechas: evento 5-7 junio 2026) ────────────────────────

INSERT INTO ops_milestones (slug, nombre, descripcion, fecha, tipo, orden) VALUES
  ('pauta-start',     'Arranca pauta',                'Primer día de pauta fría en Meta + Google.',           '2026-05-05 09:00-06', 'calentamiento', 1),
  ('clases-martes',   'Clases de preparación',        'Manuel inicia clases los martes + Lunes Energético.',  '2026-05-05 19:00-06', 'calentamiento', 2),
  ('api-club-15',     'Llamada API Club (15d antes)', 'Llamada automática para confirmar asistencia Club.',   '2026-05-21 10:00-06', 'pre_evento',    3),
  ('d7-all',          'Secuencia 7 días',             'Email + WhatsApp + llamada 7 días antes.',             '2026-05-29 10:00-06', 'pre_evento',    4),
  ('d3',              'Secuencia 3 días',             'Recordatorio 3 días antes.',                           '2026-06-02 10:00-06', 'pre_evento',    5),
  ('d2',              'Secuencia 2 días',             'Recordatorio 2 días antes.',                           '2026-06-03 10:00-06', 'pre_evento',    6),
  ('d1',              'Secuencia 1 día',              'Recordatorio 1 día antes + logística.',                '2026-06-04 10:00-06', 'pre_evento',    7),
  ('dia1-arranque',   'Día 1 — Arranque',             'Ya arrancamos. Llamada API + spam canales.',           '2026-06-05 09:30-06', 'evento',        8),
  ('dia1-jorge',      'Día 1 — Jorge abre emocional', 'Pico emocional 11:30am-12pm.',                         '2026-06-05 11:30-06', 'pitch',         9),
  ('dia2-preventa',   'Día 2 — Preventa Black',       'Post Jorge Día 2: se abre preventa boleto Black.',     '2026-06-06 12:30-06', 'pitch',         10),
  ('dia3-repitch',    'Día 3 — Repitch Jorge',        'Jorge vuelve a hablar para repitch a las 12pm.',       '2026-06-07 12:00-06', 'pitch',         11),
  ('dia3-lastchance', 'Día 3 — Last chance',          'Última llamada 5-6pm. Lanzamiento oficial Synergy Unlimited.', '2026-06-07 17:30-06', 'pitch',  12)
ON CONFLICT (slug) DO NOTHING;

-- ── Seed: Tareas de la reunión ──────────────────────────────────────────────
-- Usamos CTE para referenciar áreas y miembros por slug y evitar IDs hardcoded.

WITH
  a AS (SELECT slug, id FROM ops_areas),
  m AS (SELECT slug, id FROM ops_members),
  ms AS (SELECT slug, id FROM ops_milestones),

-- Insertar tareas
inserted AS (
  INSERT INTO ops_tasks (area_id, titulo, descripcion, prioridad, estado, fecha_limite, milestone_id)
  VALUES
    -- PRODUCTO & TECH (David)
    ((SELECT id FROM a WHERE slug='producto'), 'Landing general bootcampsinergeticos.com',                  'Landing maestra del Bootcamp.', 1, 'backlog', '2026-05-04', (SELECT id FROM ms WHERE slug='pauta-start')),
    ((SELECT id FROM a WHERE slug='producto'), 'Landing /pauta (audiencia fría)',                           'Variante de landing optimizada para audiencia fría de pauta Meta.', 1, 'backlog', '2026-05-04', (SELECT id FROM ms WHERE slug='pauta-start')),
    ((SELECT id FROM a WHERE slug='producto'), 'Landing /club (miembros Club Sinergético)',                 'Landing dedicada para miembros del Club con mensaje específico.', 1, 'backlog', '2026-05-04', (SELECT id FROM ms WHERE slug='pauta-start')),
    ((SELECT id FROM a WHERE slug='producto'), 'Landing en vivo del evento (días 1-2-3)',                   'Landing que cambia según día del evento. Embebe oferta Black al abrirse Día 2.', 1, 'backlog', '2026-06-01', (SELECT id FROM ms WHERE slug='dia1-arranque')),
    ((SELECT id FROM a WHERE slug='producto'), 'Página synergyunlimited.com funcionando',                   'Pablo la pide ya. Primero funcional, luego oferta post-pitch.', 1, 'backlog', '2026-05-15', NULL),
    ((SELECT id FROM a WHERE slug='producto'), 'Sistema de boletera: boleto por WhatsApp al pagar',         'Envía el boleto digital por WhatsApp al confirmar pago.', 1, 'backlog', '2026-05-20', NULL),
    ((SELECT id FROM a WHERE slug='producto'), 'Link único por asistente a YouTube el día del evento',      'El mismo boleto redirige a YouTube con query params para trackeo por asistente.', 1, 'backlog', '2026-06-01', (SELECT id FROM ms WHERE slug='dia1-arranque')),
    ((SELECT id FROM a WHERE slug='producto'), 'Checkout Stripe México + Kyari USA, 24 MSI',                'Pagos a meses sin intereses hasta 24 pagos. Pasarelas separadas.', 1, 'backlog', '2026-05-20', NULL),
    ((SELECT id FROM a WHERE slug='producto'), 'Panel de boletera para Synergy',                            'Registros, boletos emitidos, asistentes registrados en tiempo real.', 2, 'backlog', '2026-05-25', NULL),
    ((SELECT id FROM a WHERE slug='producto'), 'Sistema de fases de precio (replicar año pasado)',          'Como festivales: precio sube por fases de tiempo.', 2, 'backlog', '2026-05-20', NULL),
    ((SELECT id FROM a WHERE slug='producto'), 'Calendario maestro de comunicaciones',                      'Emails + WhatsApp + llamadas API coordinadas en un solo calendario visible.', 1, 'backlog', '2026-05-10', NULL),
    ((SELECT id FROM a WHERE slug='producto'), 'Plantilla dinámica de respuestas con campos dinámicos',     'Para fallos técnicos en vivo: mensajes con variables.', 3, 'backlog', '2026-06-01', NULL),
    ((SELECT id FROM a WHERE slug='producto'), 'Computadora dedicada + botón único para stream',            'Plan técnico con Gio + FI: máquina de emergencia para entrar a la transmisión.', 2, 'backlog', '2026-06-04', NULL),

    -- VIDEO & PRODUCCIÓN (Saúl)
    ((SELECT id FROM a WHERE slug='video'), 'Editar ads de calentamiento (sin CTA, solo alcance)',          'Versiones sin call-to-action para campañas de alcance.', 1, 'backlog', '2026-05-01', NULL),
    ((SELECT id FROM a WHERE slug='video'), 'Video cena casino Black',                                      'Pieza de alto impacto mostrando experiencia Black año pasado.', 2, 'backlog', '2026-05-10', NULL),
    ((SELECT id FROM a WHERE slug='video'), 'Video general experiencia Black',                              'Pollo, Rabiosos del Norte, Nayo, shows, networking.', 2, 'backlog', '2026-05-10', NULL),
    ((SELECT id FROM a WHERE slug='video'), 'Clips de acceso preferencial a shows',                         'Montajes cortos para landing y pauta.', 3, 'backlog', '2026-05-15', NULL),
    ((SELECT id FROM a WHERE slug='video'), 'Ads por pilar (mentalidad / velocidad / ecosistema)',          '3 líneas de ads, cada una enfocada en un pilar del Bootcamp.', 1, 'backlog', '2026-05-05', (SELECT id FROM ms WHERE slug='pauta-start')),
    ((SELECT id FROM a WHERE slug='video'), 'Ads por industria (médico, abogado, inmobiliario)',            'Ads segmentados por profesión para top 10-15 industrias del año pasado.', 2, 'backlog', '2026-05-12', NULL),
    ((SELECT id FROM a WHERE slug='video'), 'Gráficos y videos retargeting 5/3/2/1 días',                   'Pieza por cada ventana de recordatorio.', 1, 'backlog', '2026-05-25', NULL),

    -- PAUTA & ADS (DJ)
    ((SELECT id FROM a WHERE slug='pauta'), 'Pauta calentamiento desde hoy al 5 de mayo',                   'Campañas de alcance, sin CTA.', 1, 'backlog', '2026-05-05', (SELECT id FROM ms WHERE slug='pauta-start')),
    ((SELECT id FROM a WHERE slug='pauta'), 'Pauta específica Club Sinergético',                            'Más cara, público calificado: miembros Club.', 1, 'backlog', '2026-05-10', NULL),
    ((SELECT id FROM a WHERE slug='pauta'), 'Pauta durante evento: tráfico directo a YouTube',              'Copy: "deberías estar conectado ahora". Tráfico a YouTube Live.', 1, 'backlog', '2026-06-05', (SELECT id FROM ms WHERE slug='dia1-arranque')),
    ((SELECT id FROM a WHERE slug='pauta'), 'Distribución 90% MX / 10% USA',                                'Configurar distribución geográfica del presupuesto.', 2, 'backlog', '2026-05-05', NULL),
    ((SELECT id FROM a WHERE slug='pauta'), 'Coordinar con asesor YouTube + Juan (Google Ads a stream)',    'Pautar directamente a la transmisión desde Google Ads.', 2, 'backlog', '2026-05-15', NULL),

    -- COPY & GUIONES
    ((SELECT id FROM a WHERE slug='copy'), 'Guiones confirmación equipo de ventas',                         'No genéricos. Con pitch: "cómo lo puedes hacer".', 1, 'backlog', '2026-05-10', NULL),
    ((SELECT id FROM a WHERE slug='copy'), 'Copies oferta Black unificados (landing + correos + WA + redes)', 'Mismo mensaje en todos los canales.', 1, 'backlog', '2026-05-20', NULL),
    ((SELECT id FROM a WHERE slug='copy'), 'Secuencia emails (2/semana + 7/3/2/1/día)',                     'Cadencia semanal previa + intensiva días antes.', 1, 'backlog', '2026-05-15', NULL),
    ((SELECT id FROM a WHERE slug='copy'), 'Secuencia WhatsApp (Alicia) misma cadencia',                    'Misma cadencia que emails, vía Alicia.', 1, 'backlog', '2026-05-15', NULL),
    ((SELECT id FROM a WHERE slug='copy'), 'Guiones llamadas API (ya arrancamos / Jorge habla / last chance)', 'Audios grabados con tiempo, no de emergencia.', 1, 'backlog', '2026-05-25', NULL),
    ((SELECT id FROM a WHERE slug='copy'), 'Aviso speakers por Telegram (sinopsis breve de autoridad)',     'Sin revelar tema. Solo autoridad para crear expectativa.', 2, 'backlog', '2026-06-01', NULL),

    -- COMUNIDADES (Dani, Daniel)
    ((SELECT id FROM a WHERE slug='comunidades'), 'Coordinar líderes de comité + comunidades',              'Dani coordina todas las comunidades para spam del evento, pitch y last chance.', 1, 'backlog', '2026-05-20', NULL),
    ((SELECT id FROM a WHERE slug='comunidades'), 'Comunidades + School',                                    'Daniel activa comunidades y School.', 2, 'backlog', '2026-05-20', NULL),
    ((SELECT id FROM a WHERE slug='comunidades'), 'Comprar 7 teléfonos + chips para admins de grupos WA',   'Si no hay ya. Compra los celulares y chips.', 2, 'backlog', '2026-05-15', NULL),

    -- VENTAS
    ((SELECT id FROM a WHERE slug='ventas'), 'Base depurada de 12,000 para llamar (histórico)',             'Depurada del histórico 21k sin saturar. ~8,700 activos.', 1, 'backlog', '2026-05-10', NULL),
    ((SELECT id FROM a WHERE slug='ventas'), '10-15k adicionales de asistentes presenciales + giras 8 meses','Filtrar base de asistentes últimos 8 meses.', 1, 'backlog', '2026-05-10', NULL),
    ((SELECT id FROM a WHERE slug='ventas'), 'Grupo selecto capacitado para responder WA durante evento',   'Pool de vendedores élite para responder en tiempo real.', 1, 'backlog', '2026-05-28', NULL),
    ((SELECT id FROM a WHERE slug='ventas'), 'Velocímetro de urgencia en guion',                            'Herramienta visual/conceptual que el vendedor usa en llamada.', 2, 'backlog', '2026-05-20', NULL),
    ((SELECT id FROM a WHERE slug='ventas'), 'Presencia física vie/sáb/dom en oficina',                     'Todo el equipo en oficina durante los 3 días. Usar espacio Sinargetia.', 2, 'backlog', '2026-06-05', NULL),

    -- MERCH & LOGÍSTICA
    ((SELECT id FROM a WHERE slug='merch'), 'Playeras Bootcamp (Senier Education / Synergy Unlimited)',     'Frente: "Bootcamp de Aceleración de Emprendimientos - Senier Education". Atrás: "Nos vemos en Synergy Unlimited".', 2, 'backlog', '2026-05-25', NULL),
    ((SELECT id FROM a WHERE slug='merch'), 'Kit Black en caja estética (propuesta Mariana)',               'Validar con Mariana costo y si propuesta subió. Caja vs morral.', 2, 'backlog', '2026-05-15', NULL),
    ((SELECT id FROM a WHERE slug='merch'), 'Diferenciar kit Black vs VIP',                                 'Contenidos distintos entre kit Black y VIP.', 3, 'backlog', '2026-05-20', NULL),

    -- SPEAKERS & AGENDA
    ((SELECT id FROM a WHERE slug='speakers'), 'Confirmar speakers (lunes)',                                'Hoy confirmados: Cardona, Manuel, Jorge. Resto se sabrá el lunes.', 1, 'backlog', '2026-04-28', NULL),
    ((SELECT id FROM a WHERE slug='speakers'), 'Patrocinador Bootcamp (Raicilla)',                          'Confirmar si Raicilla cierra. Si no, buscar alternativa.', 2, 'backlog', '2026-05-10', NULL),
    ((SELECT id FROM a WHERE slug='speakers'), 'Qué se reserva para Día 2 del pitch',                       'Cerrar qué sorpresa/incentivo se abre en Día 2 (mentoría Jorge u otra).', 2, 'backlog', '2026-05-20', NULL),
    ((SELECT id FROM a WHERE slug='speakers'), 'Color oficial del Bootcamp (verde vs azul Synergy)',        'Definir para evitar confusión de producto.', 3, 'backlog', '2026-05-05', NULL),
    ((SELECT id FROM a WHERE slug='speakers'), 'Confirmar dominio synergyunlimited.com',                    'Verificar con Manuel/Pablo el dominio exacto del evento premium.', 1, 'backlog', '2026-04-28', NULL)
  RETURNING id, titulo
)
SELECT count(*) AS tareas_insertadas FROM inserted;

-- ── Seed: Asignaciones (por título de tarea → slug de miembro) ──────────────

WITH assigns AS (
  SELECT * FROM (VALUES
    ('Landing general bootcampsinergeticos.com',                     'david'),
    ('Landing /pauta (audiencia fría)',                              'david'),
    ('Landing /club (miembros Club Sinergético)',                    'david'),
    ('Landing en vivo del evento (días 1-2-3)',                      'david'),
    ('Página synergyunlimited.com funcionando',                      'david'),
    ('Sistema de boletera: boleto por WhatsApp al pagar',            'david'),
    ('Link único por asistente a YouTube el día del evento',         'david'),
    ('Checkout Stripe México + Kyari USA, 24 MSI',                   'david'),
    ('Panel de boletera para Synergy',                               'david'),
    ('Sistema de fases de precio (replicar año pasado)',             'david'),
    ('Calendario maestro de comunicaciones',                         'david'),
    ('Plantilla dinámica de respuestas con campos dinámicos',        'david'),
    ('Computadora dedicada + botón único para stream',               'gio'),

    ('Editar ads de calentamiento (sin CTA, solo alcance)',          'saul'),
    ('Video cena casino Black',                                      'saul'),
    ('Video general experiencia Black',                              'saul'),
    ('Clips de acceso preferencial a shows',                         'saul'),
    ('Ads por pilar (mentalidad / velocidad / ecosistema)',          'saul'),
    ('Ads por industria (médico, abogado, inmobiliario)',            'saul'),
    ('Gráficos y videos retargeting 5/3/2/1 días',                   'saul'),

    ('Pauta calentamiento desde hoy al 5 de mayo',                   'dj'),
    ('Pauta específica Club Sinergético',                            'dj'),
    ('Pauta durante evento: tráfico directo a YouTube',              'dj'),
    ('Distribución 90% MX / 10% USA',                                'dj'),
    ('Coordinar con asesor YouTube + Juan (Google Ads a stream)',    'dj'),

    ('Guiones confirmación equipo de ventas',                        'manuel'),
    ('Copies oferta Black unificados (landing + correos + WA + redes)', 'clau'),
    ('Secuencia emails (2/semana + 7/3/2/1/día)',                    'clau'),
    ('Secuencia WhatsApp (Alicia) misma cadencia',                   'clau'),
    ('Guiones llamadas API (ya arrancamos / Jorge habla / last chance)', 'manuel'),
    ('Aviso speakers por Telegram (sinopsis breve de autoridad)',    'abraham'),

    ('Coordinar líderes de comité + comunidades',                    'dani'),
    ('Comunidades + School',                                          'daniel'),
    ('Comprar 7 teléfonos + chips para admins de grupos WA',          'david'),

    ('Base depurada de 12,000 para llamar (histórico)',               'manuel'),
    ('10-15k adicionales de asistentes presenciales + giras 8 meses', 'manuel'),
    ('Grupo selecto capacitado para responder WA durante evento',     'manuel'),
    ('Velocímetro de urgencia en guion',                              'manuel'),
    ('Presencia física vie/sáb/dom en oficina',                       'manuel'),

    ('Playeras Bootcamp (Senier Education / Synergy Unlimited)',      'mariana'),
    ('Kit Black en caja estética (propuesta Mariana)',                'mariana'),
    ('Diferenciar kit Black vs VIP',                                  'mariana'),

    ('Confirmar speakers (lunes)',                                    'abraham'),
    ('Patrocinador Bootcamp (Raicilla)',                              'manuel'),
    ('Qué se reserva para Día 2 del pitch',                           'manuel'),
    ('Color oficial del Bootcamp (verde vs azul Synergy)',            'manuel'),
    ('Confirmar dominio synergyunlimited.com',                        'pablo')
  ) AS v(titulo, member_slug)
)
INSERT INTO ops_task_assignees (task_id, member_id)
SELECT t.id, m.id
FROM assigns a
JOIN ops_tasks   t USING (titulo)
JOIN ops_members m ON m.slug = a.member_slug
ON CONFLICT DO NOTHING;

-- ── Mensaje final ───────────────────────────────────────────────────────────
DO $$
DECLARE
  t_count INT;
  a_count INT;
BEGIN
  SELECT count(*) INTO t_count FROM ops_tasks;
  SELECT count(*) INTO a_count FROM ops_task_assignees;
  RAISE NOTICE 'Synergy Ops migrada: % tareas, % asignaciones, % áreas, % miembros, % milestones',
    t_count, a_count,
    (SELECT count(*) FROM ops_areas),
    (SELECT count(*) FROM ops_members),
    (SELECT count(*) FROM ops_milestones);
END$$;

# Producto: Landing Bootcamp 2026

## Contexto de sesión

- **Tipo:** Producto
- **Directorio raíz:** /Users/davidiriza/proyectos/productos/landing-bootcamp-2026
- **Cómo iniciar sesión:** Lee este archivo antes de cualquier acción de código.

## Qué es

Landing page del Bootcamp de Aceleración de Emprendimiento de Sinergéticos (Jorge Serratos). Next.js App Router + Postgres (Supabase). Incluye funnels, registro de asistentes y tracking de eventos.

## Dev

```bash
npm run dev
```

---

## Infraestructura

**Vercel:** team `synergy-code` (cuenta Sinergéticos)
**Supabase:** org `Synergy Code` (`driztxmnrmjfvxiqrzex`) — proyecto `landing-bootcamp-2026`
- URL: `https://povjtkfbdbvghdsrcaxc.supabase.co`
- DB client: `postgres` package (tagged template literals + `sql.unsafe()` para queries dinámicas)

**GitHub:** `synergy-code-3/landing-bootcamp-2026`

## Migración 2026-04-18

Proyecto migrado de **Zentraly → Synergy Code** (Supabase y Vercel).
Antes usaba Neon con `@neondatabase/serverless`. Ahora usa Supabase + `postgres`.

## Variables de entorno

```
DATABASE_URL=postgresql://postgres.povjtkfbdbvghdsrcaxc:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://peypcuyalrzqzujtrssx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
DASHBOARD_PASSWORD=[password del dashboard]
OPS_PASSWORD=Sinergeticos3$$  # password del tablero /ops
```

Las keys completas están en Vercel → synergy-code/landing-bootcamp-2026 → Settings → Environment Variables.

## Pendiente post-migración

Correr el schema en Supabase Dashboard → SQL Editor (ver `neon-migration.sql`).

---

## /ops — Synergy Ops (tablero interno)

App interna dentro de la misma landing: **https://bootcampsinergetico.com/ops** (password `Sinergeticos3$$`).

Control center del lanzamiento Bootcamp + Synergy Unlimited 2026. Fondo negro, acento verde `#00e040`, tipografía Outfit + Poppins (misma del proyecto). Kanban con drag-and-drop (@dnd-kit).

**Rutas:**
- `/ops/login` — entrada
- `/ops` — overview con countdown, KPIs, milestones, áreas
- `/ops/tablero` — kanban por estado con filtros (área / persona / prioridad)
- `/ops/timeline` — milestones del calentamiento al pitch día 3
- `/ops/equipo` — carga por persona
- `/ops/kpis` — distribución + placeholders GHL/Stripe
- `/ops/tarea/[id]` — editor completo + comentarios

**Auth:** cookie `ops_auth` aislada (no toca `/dashboard`). Env `OPS_PASSWORD`.

**Schema:** tablas `ops_*` en el mismo Supabase (ver `ops-migration.sql`). Estado inicial: 8 áreas, 12 miembros, 12 milestones, 47 tareas seed de la reunión.

**API:**
- `POST/DELETE /api/ops/auth`
- `GET/POST /api/ops/tasks`
- `PATCH/DELETE /api/ops/tasks/[id]`
- `GET/POST /api/ops/tasks/[id]/comments`

**Fase 2 pendiente:**
- GHL México/Latam → `ops_kpi_snapshots` (registros en vivo)
- Stripe MX + Kyari USA → boletos vendidos
- WhatsApp notify vía `claude-notify` cuando cambia tarea crítica
- Crear tareas desde UI

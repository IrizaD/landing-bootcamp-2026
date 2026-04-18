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
DASHBOARD_PASSWORD=[password del dashboard]
```

Las keys completas están en Vercel → synergy-code/landing-bootcamp-2026 → Settings → Environment Variables.

## Pendiente post-migración

Correr el schema en Supabase Dashboard → SQL Editor (ver `neon-migration.sql`).

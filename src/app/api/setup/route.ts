import { NextResponse } from "next/server";
import sql from "@/lib/db";

// TEMPORARY — delete after running once
export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS funnels (
        id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        slug          TEXT        UNIQUE NOT NULL,
        nombre        TEXT        NOT NULL,
        fb_pixel_id   TEXT        NOT NULL DEFAULT '',
        fb_event_name TEXT        NOT NULL DEFAULT 'Lead',
        ghl_webhook   TEXT        NOT NULL DEFAULT '',
        activo        BOOLEAN     NOT NULL DEFAULT true,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS registros (
        id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        funnel_slug   TEXT        NOT NULL REFERENCES funnels(slug),
        nombre        TEXT        NOT NULL,
        email         TEXT        NOT NULL,
        telefono      TEXT        NOT NULL,
        utm_source    TEXT        NOT NULL DEFAULT '',
        utm_medium    TEXT        NOT NULL DEFAULT '',
        utm_campaign  TEXT        NOT NULL DEFAULT '',
        utm_content   TEXT        NOT NULL DEFAULT '',
        utm_term      TEXT        NOT NULL DEFAULT '',
        user_agent    TEXT        NOT NULL DEFAULT '',
        ip_country    TEXT        NOT NULL DEFAULT '',
        ip_city       TEXT        NOT NULL DEFAULT '',
        ip_region     TEXT        NOT NULL DEFAULT '',
        created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS eventos (
        id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        funnel_slug   TEXT        NOT NULL,
        session_id    TEXT        NOT NULL,
        tipo          TEXT        NOT NULL,
        slide_numero  INTEGER,
        utm_source    TEXT        NOT NULL DEFAULT '',
        utm_medium    TEXT        NOT NULL DEFAULT '',
        utm_campaign  TEXT        NOT NULL DEFAULT '',
        user_agent    TEXT        NOT NULL DEFAULT '',
        ip_country    TEXT        NOT NULL DEFAULT '',
        ip_city       TEXT        NOT NULL DEFAULT '',
        ip_region     TEXT        NOT NULL DEFAULT '',
        created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;

    await sql`
      INSERT INTO funnels (slug, nombre)
      VALUES ('bootcamp-2026', 'Bootcamp de Aceleración 2026')
      ON CONFLICT (slug) DO NOTHING
    `;

    return NextResponse.json({ ok: true, message: "Schema created successfully" });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

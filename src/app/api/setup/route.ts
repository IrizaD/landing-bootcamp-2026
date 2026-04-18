import { NextResponse } from "next/server";

// TEMPORARY — delete after running once
export async function GET() {
  const TOKEN = process.env.SUPABASE_MGMT_TOKEN!;
  const REF   = "peypcuyalrzqzujtrssx";
  const URL   = `https://api.supabase.com/v1/projects/${REF}/database/query`;

  async function runSQL(query: string) {
    const res = await fetch(URL, {
      method: "POST",
      headers: { "Authorization": `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const text = await res.text();
    return { status: res.status, body: text };
  }

  const results: Record<string, unknown> = {};

  results.registros = await runSQL(`CREATE TABLE IF NOT EXISTS registros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funnel_slug TEXT NOT NULL REFERENCES funnels(slug),
    nombre TEXT NOT NULL, email TEXT NOT NULL, telefono TEXT NOT NULL,
    utm_source TEXT NOT NULL DEFAULT '', utm_medium TEXT NOT NULL DEFAULT '',
    utm_campaign TEXT NOT NULL DEFAULT '', utm_content TEXT NOT NULL DEFAULT '',
    utm_term TEXT NOT NULL DEFAULT '', user_agent TEXT NOT NULL DEFAULT '',
    ip_country TEXT NOT NULL DEFAULT '', ip_city TEXT NOT NULL DEFAULT '',
    ip_region TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now())`);

  results.eventos = await runSQL(`CREATE TABLE IF NOT EXISTS eventos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funnel_slug TEXT NOT NULL, session_id TEXT NOT NULL, tipo TEXT NOT NULL,
    slide_numero INTEGER,
    utm_source TEXT NOT NULL DEFAULT '', utm_medium TEXT NOT NULL DEFAULT '',
    utm_campaign TEXT NOT NULL DEFAULT '', user_agent TEXT NOT NULL DEFAULT '',
    ip_country TEXT NOT NULL DEFAULT '', ip_city TEXT NOT NULL DEFAULT '',
    ip_region TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now())`);

  results.seed = await runSQL(`INSERT INTO funnels (slug, nombre)
    VALUES ('bootcamp-2026', 'Bootcamp de Aceleración 2026')
    ON CONFLICT (slug) DO NOTHING`);

  results.verify = await runSQL("SELECT slug, nombre FROM funnels");

  return NextResponse.json(results);
}

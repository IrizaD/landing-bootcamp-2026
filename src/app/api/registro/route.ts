import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nombre, email, telefono, pais } = body;

  if (!nombre || !email || !telefono) {
    return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
  }

  // Extraer parámetros UTM del referer/headers si vienen en el body
  const utm_source   = body.utm_source   ?? "";
  const utm_medium   = body.utm_medium   ?? "";
  const utm_campaign = body.utm_campaign ?? "";
  const utm_content  = body.utm_content  ?? "";
  const utm_term     = body.utm_term     ?? "";

  const user_agent = req.headers.get("user-agent") ?? "";

  // Geo IP desde headers de Vercel
  const ip_country = decodeURIComponent(req.headers.get("x-vercel-ip-country")        ?? "");
  const ip_city    = decodeURIComponent(req.headers.get("x-vercel-ip-city")           ?? "");
  const ip_region  = decodeURIComponent(req.headers.get("x-vercel-ip-country-region") ?? "");

  const { error } = await supabaseAdmin
    .from("registros")
    .insert({
      funnel_slug:  "bootcamp-2026",
      nombre,
      email,
      telefono,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      user_agent,
      ip_country,
      ip_city,
      ip_region,
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

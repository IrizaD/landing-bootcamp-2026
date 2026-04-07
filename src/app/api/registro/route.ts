import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nombre, email, telefono } = body;

  if (!nombre || !email || !telefono) {
    return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
  }

  const utm_source   = body.utm_source   ?? "";
  const utm_medium   = body.utm_medium   ?? "";
  const utm_campaign = body.utm_campaign ?? "";
  const utm_content  = body.utm_content  ?? "";
  const utm_term     = body.utm_term     ?? "";

  const user_agent = req.headers.get("user-agent") ?? "";
  const ip_country = decodeURIComponent(req.headers.get("x-vercel-ip-country")        ?? "");
  const ip_city    = decodeURIComponent(req.headers.get("x-vercel-ip-city")           ?? "");
  const ip_region  = decodeURIComponent(req.headers.get("x-vercel-ip-country-region") ?? "");

  try {
    await sql`
      INSERT INTO registros (funnel_slug, nombre, email, telefono, utm_source, utm_medium, utm_campaign, utm_content, utm_term, user_agent, ip_country, ip_city, ip_region)
      VALUES ('bootcamp-2026', ${nombre}, ${email}, ${telefono}, ${utm_source}, ${utm_medium}, ${utm_campaign}, ${utm_content}, ${utm_term}, ${user_agent}, ${ip_country}, ${ip_city}, ${ip_region})
    `;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

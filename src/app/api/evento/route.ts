import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { session_id, tipo = "page_view" } = body;

  if (!session_id) {
    return NextResponse.json({ error: "session_id requerido" }, { status: 400 });
  }

  const utm_source   = body.utm_source   ?? "";
  const utm_medium   = body.utm_medium   ?? "";
  const utm_campaign = body.utm_campaign ?? "";

  const user_agent = req.headers.get("user-agent") ?? "";
  const ip_country = decodeURIComponent(req.headers.get("x-vercel-ip-country")        ?? "");
  const ip_city    = decodeURIComponent(req.headers.get("x-vercel-ip-city")           ?? "");
  const ip_region  = decodeURIComponent(req.headers.get("x-vercel-ip-country-region") ?? "");

  try {
    await sql`
      INSERT INTO eventos (funnel_slug, session_id, tipo, utm_source, utm_medium, utm_campaign, user_agent, ip_country, ip_city, ip_region)
      VALUES ('bootcamp-2026', ${session_id}, ${tipo}, ${utm_source}, ${utm_medium}, ${utm_campaign}, ${user_agent}, ${ip_country}, ${ip_city}, ${ip_region})
    `;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

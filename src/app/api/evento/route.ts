import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { session_id, tipo = "page_view" } = body;

  if (!session_id) {
    return NextResponse.json({ error: "session_id requerido" }, { status: 400 });
  }

  const { error } = await supabase.from("eventos").insert({
    funnel_slug:  "bootcamp-2026",
    session_id,
    tipo,
    utm_source:   body.utm_source   ?? "",
    utm_medium:   body.utm_medium   ?? "",
    utm_campaign: body.utm_campaign ?? "",
    user_agent:   req.headers.get("user-agent") ?? "",
    ip_country:   decodeURIComponent(req.headers.get("x-vercel-ip-country")        ?? ""),
    ip_city:      decodeURIComponent(req.headers.get("x-vercel-ip-city")           ?? ""),
    ip_region:    decodeURIComponent(req.headers.get("x-vercel-ip-country-region") ?? ""),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

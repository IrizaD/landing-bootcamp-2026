import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nombre, email, telefono } = body;

  if (!nombre || !email || !telefono) {
    return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
  }

  const { error } = await supabase.from("registros").insert({
    funnel_slug:  "bootcamp-2026",
    nombre,
    email,
    telefono,
    utm_source:   body.utm_source   ?? "",
    utm_medium:   body.utm_medium   ?? "",
    utm_campaign: body.utm_campaign ?? "",
    utm_content:  body.utm_content  ?? "",
    utm_term:     body.utm_term     ?? "",
    user_agent:   req.headers.get("user-agent") ?? "",
    ip_country:   decodeURIComponent(req.headers.get("x-vercel-ip-country")        ?? ""),
    ip_city:      decodeURIComponent(req.headers.get("x-vercel-ip-city")           ?? ""),
    ip_region:    decodeURIComponent(req.headers.get("x-vercel-ip-country-region") ?? ""),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

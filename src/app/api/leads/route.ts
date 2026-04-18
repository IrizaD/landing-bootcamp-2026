import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug   = searchParams.get("slug");
  const desde  = searchParams.get("desde");
  const hasta  = searchParams.get("hasta");
  const pais   = searchParams.get("pais");
  const fuente = searchParams.get("fuente");

  if (!slug) return NextResponse.json({ error: "slug requerido" }, { status: 400 });

  let query = supabase
    .from("registros")
    .select("*")
    .eq("funnel_slug", slug)
    .order("created_at", { ascending: false })
    .limit(1000);

  if (desde)  query = query.gte("created_at", desde);
  if (hasta)  query = query.lte("created_at", hasta + "T23:59:59Z");
  if (pais)   query = query.eq("ip_country", pais);
  if (fuente) query = query.eq("utm_source", fuente);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug       = searchParams.get("slug");
  const desde      = searchParams.get("desde");
  const hasta      = searchParams.get("hasta");
  const pais       = searchParams.get("pais");
  const fuente     = searchParams.get("fuente");

  if (!slug) return NextResponse.json({ error: "slug requerido" }, { status: 400 });

  let q = supabaseAdmin
    .from("registros")
    .select("*")
    .eq("funnel_slug", slug)
    .order("created_at", { ascending: false })
    .limit(1000);

  if (desde) q = q.gte("created_at", desde);
  if (hasta) q = q.lte("created_at", hasta + "T23:59:59Z");
  if (pais)  q = q.eq("ip_country", pais);
  if (fuente) q = q.eq("utm_source", fuente);

  const { data, error } = await q;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

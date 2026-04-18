import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

export async function GET() {
  const { data, error } = await supabase
    .from("funnels")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slug, nombre, fb_pixel_id = "", fb_event_name = "Lead", ghl_webhook = "" } = body;

  if (!slug || !nombre) {
    return NextResponse.json({ error: "slug y nombre son requeridos" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("funnels")
    .insert({ slug, nombre, fb_pixel_id, fb_event_name, ghl_webhook })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

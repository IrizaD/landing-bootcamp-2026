import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("funnels")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();

  const updateData: Record<string, unknown> = {};
  if (body.nombre        !== undefined) updateData.nombre        = body.nombre;
  if (body.fb_pixel_id   !== undefined) updateData.fb_pixel_id   = body.fb_pixel_id;
  if (body.fb_event_name !== undefined) updateData.fb_event_name = body.fb_event_name;
  if (body.ghl_webhook   !== undefined) updateData.ghl_webhook   = body.ghl_webhook;
  if (body.activo        !== undefined) updateData.activo         = body.activo;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "Sin campos para actualizar" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("funnels")
    .update(updateData)
    .eq("slug", slug)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(data);
}

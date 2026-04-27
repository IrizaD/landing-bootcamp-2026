import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { isDashAuthed } from "@/lib/dashAuth";

export async function GET() {
  const { data, error } = await db
    .from("speakers")
    .select("*")
    .eq("active", true)
    .order("order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  if (!(await isDashAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json() as {
    name: string;
    role?: string;
    title: string;
    topic: string;
    pillar?: string;
    ig?: string;
    photo_url?: string;
    featured?: boolean;
    order?: number;
  };

  if (!body.name || !body.title || !body.topic) {
    return NextResponse.json({ error: "name, title y topic son requeridos" }, { status: 400 });
  }

  const { data, error } = await db
    .from("speakers")
    .insert({
      name:      body.name,
      role:      body.role      ?? null,
      title:     body.title,
      topic:     body.topic,
      pillar:    body.pillar    ?? null,
      ig:        body.ig        ?? null,
      photo_url: body.photo_url ?? null,
      featured:  body.featured  ?? false,
      order:     body.order     ?? 0,
      active:    true,
    })
    .select()
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "insert_failed" }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}

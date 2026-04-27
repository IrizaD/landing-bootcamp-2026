import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { isDashAuthed } from "@/lib/dashAuth";

async function guard() {
  if (!(await isDashAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await guard();
  if (unauth) return unauth;

  const { id } = await params;
  const body = await req.json() as Partial<{
    name: string;
    role: string | null;
    title: string;
    topic: string;
    pillar: string | null;
    ig: string | null;
    photo_url: string | null;
    featured: boolean;
    order: number;
    active: boolean;
  }>;

  const { data, error } = await db
    .from("speakers")
    .update(body)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await guard();
  if (unauth) return unauth;

  const { id } = await params;
  const { error } = await db.from("speakers").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

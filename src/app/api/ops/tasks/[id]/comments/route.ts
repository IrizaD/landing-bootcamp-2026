import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { isOpsAuthed } from "@/lib/ops/auth";
import { fetchTaskComments } from "@/lib/ops/queries";

async function guard() {
  if (!(await isOpsAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const unauth = await guard();
  if (unauth) return unauth;
  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  const comments = await fetchTaskComments(id);
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const unauth = await guard();
  if (unauth) return unauth;
  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  const body = (await req.json()) as { body?: string; member_id?: number | null };
  if (!body.body?.trim()) return NextResponse.json({ error: "body_required" }, { status: 400 });
  const { data, error } = await db
    .from("ops_task_comments")
    .insert({ task_id: id, body: body.body.trim(), member_id: body.member_id ?? null })
    .select()
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

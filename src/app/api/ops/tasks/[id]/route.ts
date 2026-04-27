import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import db from "@/lib/db";
import { isOpsAuthed } from "@/lib/ops/auth";

async function guard() {
  if (!(await isOpsAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}

type UpdatePayload = Partial<{
  titulo: string;
  descripcion: string | null;
  prioridad: number;
  estado: string;
  fecha_limite: string | null;
  milestone_id: number | null;
  area_id: number;
  progreso: number;
  orden: number;
  assignees: number[];
}>;

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const unauth = await guard();
  if (unauth) return unauth;
  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }
  const body = (await req.json()) as UpdatePayload;
  const assignees = body.assignees;
  const patch: Record<string, unknown> = {};
  for (const key of [
    "titulo", "descripcion", "prioridad", "estado",
    "fecha_limite", "milestone_id", "area_id", "progreso", "orden",
  ] as const) {
    if (key in body) patch[key] = body[key];
  }
  if (Object.keys(patch).length > 0) {
    const { error } = await db.from("ops_tasks").update(patch).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (assignees) {
    await db.from("ops_task_assignees").delete().eq("task_id", id);
    if (assignees.length > 0) {
      await db
        .from("ops_task_assignees")
        .insert(assignees.map((member_id) => ({ task_id: id, member_id })));
    }
  }
  revalidateTag("ops_tasks", "max");
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const unauth = await guard();
  if (unauth) return unauth;
  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  const { error } = await db.from("ops_tasks").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidateTag("ops_tasks", "max");
  return NextResponse.json({ ok: true });
}

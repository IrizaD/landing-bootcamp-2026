import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import db from "@/lib/db";
import { isOpsAuthed } from "@/lib/ops/auth";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isOpsAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }
  const body = (await req.json()) as { fecha?: string; nombre?: string; descripcion?: string };
  const patch: Record<string, unknown> = {};
  if (body.fecha) patch.fecha = body.fecha;
  if (body.nombre) patch.nombre = body.nombre;
  if ("descripcion" in body) patch.descripcion = body.descripcion;
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "nothing_to_update" }, { status: 400 });
  }
  const { error } = await db.from("ops_milestones").update(patch).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidateTag("ops_milestones", "max");
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { isOpsAuthed } from "@/lib/ops/auth";
import { fetchTasks } from "@/lib/ops/queries";

async function guard() {
  if (!(await isOpsAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const unauth = await guard();
  if (unauth) return unauth;
  const tasks = await fetchTasks();
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const unauth = await guard();
  if (unauth) return unauth;
  const body = (await req.json()) as {
    area_id: number;
    titulo: string;
    descripcion?: string;
    prioridad?: number;
    estado?: string;
    fecha_limite?: string | null;
    milestone_id?: number | null;
    assignees?: number[];
  };
  if (!body.area_id || !body.titulo) {
    return NextResponse.json({ error: "area_id y titulo son requeridos" }, { status: 400 });
  }
  const { data, error } = await db
    .from("ops_tasks")
    .insert({
      area_id: body.area_id,
      titulo: body.titulo,
      descripcion: body.descripcion ?? null,
      prioridad: body.prioridad ?? 3,
      estado: body.estado ?? "backlog",
      fecha_limite: body.fecha_limite ?? null,
      milestone_id: body.milestone_id ?? null,
    })
    .select()
    .maybeSingle();
  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "insert_failed" }, { status: 500 });
  }
  if (body.assignees?.length) {
    const taskRecord = data as { id: number };
    await db
      .from("ops_task_assignees")
      .insert(body.assignees.map((member_id) => ({ task_id: taskRecord.id, member_id })));
  }
  return NextResponse.json(data);
}

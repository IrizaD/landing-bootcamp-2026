import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import db from "@/lib/db";
import { isOpsAuthed } from "@/lib/ops/auth";

function makeSlug(nombre: string) {
  const base = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return `${base}-${Date.now().toString(36)}`;
}

function makeInitials(nombre: string) {
  const parts = nombre.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : nombre.slice(0, 2).toUpperCase();
}

export async function POST(req: NextRequest) {
  if (!(await isOpsAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { nombre, rol } = (await req.json()) as { nombre?: string; rol?: string };
  if (!nombre?.trim()) {
    return NextResponse.json({ error: "nombre_required" }, { status: 400 });
  }

  const { data, error } = await db
    .from("ops_members")
    .insert({
      nombre: nombre.trim(),
      rol: rol?.trim() || "Equipo",
      initials: makeInitials(nombre),
      slug: makeSlug(nombre),
      activo: true,
      orden: 999,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidateTag("ops_members", "max");
  return NextResponse.json(data);
}

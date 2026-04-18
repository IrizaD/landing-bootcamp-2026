import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const rows = await sql`SELECT * FROM funnels WHERE slug = ${slug}`;
    if (rows.length === 0) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();

  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  if (body.nombre       !== undefined) { fields.push(`nombre = $${i++}`);        values.push(body.nombre); }
  if (body.fb_pixel_id  !== undefined) { fields.push(`fb_pixel_id = $${i++}`);   values.push(body.fb_pixel_id); }
  if (body.fb_event_name !== undefined){ fields.push(`fb_event_name = $${i++}`); values.push(body.fb_event_name); }
  if (body.ghl_webhook  !== undefined) { fields.push(`ghl_webhook = $${i++}`);   values.push(body.ghl_webhook); }
  if (body.activo       !== undefined) { fields.push(`activo = $${i++}`);         values.push(body.activo); }

  if (fields.length === 0) {
    return NextResponse.json({ error: "Sin campos para actualizar" }, { status: 400 });
  }

  values.push(slug);
  const query = `UPDATE funnels SET ${fields.join(", ")} WHERE slug = $${i} RETURNING *`;

  try {
    const rows = await sql.unsafe(query, values as string[]);
    if (rows.length === 0) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

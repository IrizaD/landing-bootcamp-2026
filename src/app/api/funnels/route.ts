import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM funnels ORDER BY created_at DESC`;
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slug, nombre, fb_pixel_id = "", fb_event_name = "Lead", ghl_webhook = "" } = body;

  if (!slug || !nombre) {
    return NextResponse.json({ error: "slug y nombre son requeridos" }, { status: 400 });
  }

  try {
    const rows = await sql`
      INSERT INTO funnels (slug, nombre, fb_pixel_id, fb_event_name, ghl_webhook)
      VALUES (${slug}, ${nombre}, ${fb_pixel_id}, ${fb_event_name}, ${ghl_webhook})
      RETURNING *
    `;
    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

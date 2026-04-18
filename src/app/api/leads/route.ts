import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug   = searchParams.get("slug");
  const desde  = searchParams.get("desde");
  const hasta  = searchParams.get("hasta");
  const pais   = searchParams.get("pais");
  const fuente = searchParams.get("fuente");

  if (!slug) return NextResponse.json({ error: "slug requerido" }, { status: 400 });

  const conditions = ["funnel_slug = $1"];
  const values: unknown[] = [slug];
  let i = 2;

  if (desde)  { conditions.push(`created_at >= $${i++}`); values.push(desde); }
  if (hasta)  { conditions.push(`created_at <= $${i++}`); values.push(hasta + "T23:59:59Z"); }
  if (pais)   { conditions.push(`ip_country = $${i++}`);  values.push(pais); }
  if (fuente) { conditions.push(`utm_source = $${i++}`);  values.push(fuente); }

  const query = `
    SELECT * FROM registros
    WHERE ${conditions.join(" AND ")}
    ORDER BY created_at DESC
    LIMIT 1000
  `;

  try {
    const rows = await sql.unsafe(query, values as string[]);
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

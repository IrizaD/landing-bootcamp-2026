import { NextRequest, NextResponse } from "next/server";
import { OPS_COOKIE } from "@/lib/ops/auth";

export async function POST(req: NextRequest) {
  const { password } = (await req.json()) as { password?: string };
  const expected = process.env.DASHBOARD_PASSWORD?.trim();
  if (!expected) {
    return NextResponse.json({ error: "password_not_configured" }, { status: 500 });
  }
  if (!password || password !== expected) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(OPS_COOKIE, expected, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 14,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(OPS_COOKIE);
  return res;
}

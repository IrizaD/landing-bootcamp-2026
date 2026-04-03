import { NextRequest, NextResponse } from "next/server";

// Mapa de dominios personalizados → slug del funnel
// Ejemplo: { "mi-dominio.com": "mi-funnel" }
const DOMAIN_MAP: Record<string, string> = {};

export function middleware(req: NextRequest) {
  return proxy(req);
}

export function proxy(req: NextRequest) {
  const host = req.headers.get("host")?.split(":")[0] ?? "";
  const mappedSlug = DOMAIN_MAP[host];

  if (mappedSlug) {
    const url = req.nextUrl.clone();
    const suffix = url.pathname === "/" ? "" : url.pathname;
    url.pathname = `/${mappedSlug}${suffix}`;
    return NextResponse.rewrite(url);
  }

  const { pathname } = req.nextUrl;

  // Dashboard: verificar autenticación
  if (!pathname.startsWith("/dashboard")) return NextResponse.next();
  if (pathname === "/dashboard/login")    return NextResponse.next();

  const token = req.cookies.get("dash_auth")?.value;
  if (token === process.env.DASHBOARD_PASSWORD?.trim()) return NextResponse.next();

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/dashboard/login";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt).*)",
  ],
};

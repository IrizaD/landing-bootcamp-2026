import { cookies } from "next/headers";

export async function isDashAuthed(): Promise<boolean> {
  const password = process.env.DASHBOARD_PASSWORD?.trim();
  if (!password) return false;
  const store = await cookies();
  return store.get("dash_auth")?.value === password;
}

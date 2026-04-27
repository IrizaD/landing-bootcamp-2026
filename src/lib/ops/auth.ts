import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const OPS_COOKIE = "dash_auth";

export async function isOpsAuthed(): Promise<boolean> {
  const password = process.env.DASHBOARD_PASSWORD?.trim();
  if (!password) return false;
  const store = await cookies();
  return store.get(OPS_COOKIE)?.value === password;
}

export async function requireOpsAuth(): Promise<void> {
  if (!(await isOpsAuthed())) redirect("/ops/login");
}

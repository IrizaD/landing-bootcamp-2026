import type { ReactNode } from "react";
import { requireOpsAuth } from "@/lib/ops/auth";
import Shell from "./Shell";

export const metadata = { title: "Synergy Ops" };

export default async function OpsAppLayout({ children }: { children: ReactNode }) {
  await requireOpsAuth();
  return <Shell>{children}</Shell>;
}

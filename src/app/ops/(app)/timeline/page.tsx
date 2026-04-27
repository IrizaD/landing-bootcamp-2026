import { fetchMilestones, fetchTasks } from "@/lib/ops/queries";
import type { OpsTaskWithRelations } from "@/lib/ops/types";
import PageHeader from "../PageHeader";
import TimelineClient from "./TimelineClient";

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const [milestones, tasks] = await Promise.all([fetchMilestones(), fetchTasks()]);
  const now = Date.now();
  const nextIdx = milestones.findIndex((m) => new Date(m.fecha).getTime() > now);
  const nextSlug = milestones[nextIdx]?.slug;

  const tasksByMilestone = new Map<number, OpsTaskWithRelations[]>();
  for (const t of tasks) {
    if (t.milestone_id != null) {
      const arr = tasksByMilestone.get(t.milestone_id) ?? [];
      arr.push(t);
      tasksByMilestone.set(t.milestone_id, arr);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Timeline · Plan"
        title="Línea del tiempo"
        subtitle="Desde calentamiento de audiencia hasta el Day 3 de Synergy Unlimited."
      />
      <section style={{ padding: "32px 40px 80px", maxWidth: "1100px", margin: "0 auto" }}>
        <TimelineClient
          milestones={milestones}
          tasksByMilestone={tasksByMilestone}
          nextSlug={nextSlug}
        />
      </section>
    </>
  );
}

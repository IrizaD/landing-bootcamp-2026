import { cache } from "react";
import { unstable_cache } from "next/cache";
import db from "@/lib/db";
import type {
  OpsArea,
  OpsMember,
  OpsMilestone,
  OpsTaskWithRelations,
  OpsTask,
  OpsComment,
} from "./types";

// ─── Raw DB fetchers wrapped in unstable_cache ────────────────────────────────
// Areas/milestones: almost never change → 5 min TTL
// Tasks/assignees: change on every checkbox → invalidated via revalidateTag("ops_tasks")
// Members: change when adding someone → invalidated via revalidateTag("ops_members")

const _rawAreas = unstable_cache(
  async (): Promise<OpsArea[]> => {
    const { data } = await db.from("ops_areas").select("*").order("orden");
    return (data ?? []) as OpsArea[];
  },
  ["ops_areas"],
  { revalidate: 300, tags: ["ops_areas"] }
);

const _rawMilestones = unstable_cache(
  async (): Promise<OpsMilestone[]> => {
    const { data } = await db.from("ops_milestones").select("*").order("fecha");
    return (data ?? []) as OpsMilestone[];
  },
  ["ops_milestones"],
  { revalidate: 300, tags: ["ops_milestones"] }
);

const _rawMembersActive = unstable_cache(
  async (): Promise<OpsMember[]> => {
    const { data } = await db
      .from("ops_members")
      .select("*")
      .eq("activo", true)
      .order("orden");
    return (data ?? []) as OpsMember[];
  },
  ["ops_members_active"],
  { revalidate: 60, tags: ["ops_members"] }
);

const _rawMembersAll = unstable_cache(
  async (): Promise<OpsMember[]> => {
    const { data } = await db.from("ops_members").select("*").order("orden");
    return (data ?? []) as OpsMember[];
  },
  ["ops_members_all"],
  { revalidate: 60, tags: ["ops_members"] }
);

const _rawTasks = unstable_cache(
  async (): Promise<OpsTask[]> => {
    const { data } = await db.from("ops_tasks").select("*").order("orden").order("id");
    return (data ?? []) as OpsTask[];
  },
  ["ops_tasks"],
  { revalidate: 30, tags: ["ops_tasks"] }
);

const _rawAssignees = unstable_cache(
  async (): Promise<{ task_id: number; member_id: number }[]> => {
    const { data } = await db.from("ops_task_assignees").select("task_id,member_id");
    return (data ?? []) as { task_id: number; member_id: number }[];
  },
  ["ops_task_assignees"],
  { revalidate: 30, tags: ["ops_tasks"] }
);

// ─── Public API — cache() deduplicates within the same request ────────────────

export const fetchAreas = cache(_rawAreas);
export const fetchMilestones = cache(_rawMilestones);

export const fetchMembers = cache(
  async (activeOnly = true): Promise<OpsMember[]> =>
    activeOnly ? _rawMembersActive() : _rawMembersAll()
);

export const fetchTasks = cache(async (): Promise<OpsTaskWithRelations[]> => {
  const [tasks, areas, milestones, members, assignments] = await Promise.all([
    _rawTasks(),
    fetchAreas(),
    fetchMilestones(),
    fetchMembers(false),
    _rawAssignees(),
  ]);

  const areaById = new Map(areas.map((a) => [a.id, a]));
  const milestoneById = new Map(milestones.map((m) => [m.id, m]));
  const memberById = new Map(members.map((m) => [m.id, m]));
  const assignsByTask = new Map<number, number[]>();
  for (const row of assignments) {
    const arr = assignsByTask.get(row.task_id) ?? [];
    arr.push(row.member_id);
    assignsByTask.set(row.task_id, arr);
  }

  return tasks.map((t) => ({
    ...t,
    area: areaById.get(t.area_id) ?? null,
    milestone: t.milestone_id != null ? milestoneById.get(t.milestone_id) ?? null : null,
    assignees: (assignsByTask.get(t.id) ?? [])
      .map((id) => memberById.get(id))
      .filter((m): m is OpsMember => Boolean(m)),
  }));
});

export const fetchTaskById = cache(async (id: number): Promise<OpsTaskWithRelations | null> => {
  const all = await fetchTasks();
  return all.find((t) => t.id === id) ?? null;
});

export async function fetchTaskComments(taskId: number): Promise<OpsComment[]> {
  const { data } = await db
    .from("ops_task_comments")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at");
  return (data ?? []) as OpsComment[];
}

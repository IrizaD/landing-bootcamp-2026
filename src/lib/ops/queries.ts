import db from "@/lib/db";
import type {
  OpsArea,
  OpsMember,
  OpsMilestone,
  OpsTaskWithRelations,
  OpsTask,
  OpsComment,
} from "./types";

export async function fetchAreas(): Promise<OpsArea[]> {
  const { data } = await db.from("ops_areas").select("*").order("orden");
  return (data ?? []) as OpsArea[];
}

export async function fetchMembers(activeOnly = true): Promise<OpsMember[]> {
  let q = db.from("ops_members").select("*").order("orden");
  if (activeOnly) q = q.eq("activo", true);
  const { data } = await q;
  return (data ?? []) as OpsMember[];
}

export async function fetchMilestones(): Promise<OpsMilestone[]> {
  const { data } = await db.from("ops_milestones").select("*").order("fecha");
  return (data ?? []) as OpsMilestone[];
}

export async function fetchTasks(): Promise<OpsTaskWithRelations[]> {
  const { data: tasks } = await db
    .from("ops_tasks")
    .select("*")
    .order("orden")
    .order("id");

  if (!tasks) return [];

  const [areas, milestones, members, assignments] = await Promise.all([
    fetchAreas(),
    fetchMilestones(),
    fetchMembers(false),
    db.from("ops_task_assignees").select("task_id,member_id"),
  ]);

  const areaById = new Map(areas.map((a) => [a.id, a]));
  const milestoneById = new Map(milestones.map((m) => [m.id, m]));
  const memberById = new Map(members.map((m) => [m.id, m]));
  const assignsByTask = new Map<number, number[]>();
  const assignData = (assignments.data ?? []) as { task_id: number; member_id: number }[];
  for (const row of assignData) {
    const arr = assignsByTask.get(row.task_id) ?? [];
    arr.push(row.member_id);
    assignsByTask.set(row.task_id, arr);
  }

  return (tasks as OpsTask[]).map((t) => ({
    ...t,
    area: areaById.get(t.area_id) ?? null,
    milestone: t.milestone_id != null ? milestoneById.get(t.milestone_id) ?? null : null,
    assignees: (assignsByTask.get(t.id) ?? [])
      .map((id) => memberById.get(id))
      .filter((m): m is OpsMember => Boolean(m)),
  }));
}

export async function fetchTaskById(id: number): Promise<OpsTaskWithRelations | null> {
  const all = await fetchTasks();
  return all.find((t) => t.id === id) ?? null;
}

export async function fetchTaskComments(taskId: number): Promise<OpsComment[]> {
  const { data } = await db
    .from("ops_task_comments")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at");
  return (data ?? []) as OpsComment[];
}

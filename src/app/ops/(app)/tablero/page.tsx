import { fetchAreas, fetchMembers, fetchTasks } from "@/lib/ops/queries";
import PageHeader from "../PageHeader";
import KanbanBoard from "./KanbanBoard";

export const dynamic = "force-dynamic";

export default async function TableroPage() {
  const [tasks, areas, members] = await Promise.all([
    fetchTasks(),
    fetchAreas(),
    fetchMembers(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Tablero · Kanban"
        title="Tablero de tareas"
        subtitle="Arrastra y suelta entre columnas. Filtra por área, persona o prioridad."
      />
      <KanbanBoard initialTasks={tasks} areas={areas} members={members} />
    </>
  );
}

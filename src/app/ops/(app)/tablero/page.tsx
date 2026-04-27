import { fetchAreas, fetchMembers, fetchTasks } from "@/lib/ops/queries";
import PageHeader from "../PageHeader";
import Checklist from "./KanbanBoard";

export const dynamic = "force-dynamic";

export default async function TableroPage() {
  const [tasks, areas, members] = await Promise.all([
    fetchTasks(),
    fetchAreas(),
    fetchMembers(false),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Tablero · Checklist"
        title="Tareas por área"
        subtitle="Marca una tarea para completarla. Los cambios se guardan al instante."
      />
      <Checklist initialTasks={tasks} areas={areas} initialMembers={members} />
    </>
  );
}

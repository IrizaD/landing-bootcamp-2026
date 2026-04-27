import { fetchAreas, fetchTasks } from "@/lib/ops/queries";
import PageHeader from "../PageHeader";
import Checklist from "./KanbanBoard";

export const dynamic = "force-dynamic";

export default async function TableroPage() {
  const [tasks, areas] = await Promise.all([fetchTasks(), fetchAreas()]);

  return (
    <>
      <PageHeader
        eyebrow="Tablero · Checklist"
        title="Tareas por área"
        subtitle="Marca una tarea para completarla. Los cambios se guardan al instante."
      />
      <Checklist initialTasks={tasks} areas={areas} />
    </>
  );
}

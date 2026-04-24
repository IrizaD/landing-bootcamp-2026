export type OpsEstado = "backlog" | "en_progreso" | "bloqueado" | "en_revision" | "hecho";

export interface OpsArea {
  id: number;
  slug: string;
  nombre: string;
  color: string;
  icono: string | null;
  orden: number;
}

export interface OpsMember {
  id: number;
  slug: string;
  nombre: string;
  rol: string;
  initials: string;
  avatar_url: string | null;
  contact: string | null;
  activo: boolean;
  orden: number;
}

export interface OpsMilestone {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string | null;
  fecha: string;
  tipo: "calentamiento" | "pre_evento" | "evento" | "pitch";
  orden: number;
}

export interface OpsTask {
  id: number;
  area_id: number;
  titulo: string;
  descripcion: string | null;
  prioridad: 1 | 2 | 3 | 4;
  estado: OpsEstado;
  fecha_limite: string | null;
  milestone_id: number | null;
  progreso: number;
  orden: number;
  created_at: string;
  updated_at: string;
}

export interface OpsTaskWithRelations extends OpsTask {
  area: OpsArea | null;
  milestone: OpsMilestone | null;
  assignees: OpsMember[];
}

export interface OpsComment {
  id: number;
  task_id: number;
  member_id: number | null;
  body: string;
  created_at: string;
}

export interface OpsKpiSnapshot {
  id: number;
  metric: string;
  value: number;
  source: string | null;
  metadata: Record<string, unknown> | null;
  captured_at: string;
}

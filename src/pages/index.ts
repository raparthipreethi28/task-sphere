export type ProjectStatus =
  | "Not Started"
  | "In Progress"
  | "Completed"
  | "On Hold";

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Project {
  id: string | number;
  name: string;
  description?: string;
  status: ProjectStatus;

  /* keep date as string */
  startDate: string;
  dueDate: string;

  progress: number;
  members: User[];
  teamLead: User | null;
}
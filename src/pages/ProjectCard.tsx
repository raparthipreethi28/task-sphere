import React from "react";
import { Project, User } from "./index";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: number | string) => void;
}

/* Card */
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 hover:shadow-lg transition">
    {children}
  </div>
);

/* Progress Bar */
const ProgressBar = ({ value }: { value?: number }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
    <div
      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
      style={{ width: `${value ?? 0}%` }}
    />
  </div>
);

/* Avatar */
const Avatar = ({ src, name }: { src?: string; name?: string }) => {
  const avatarName = name || "User";

  return (
    <img
      className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
      src={src || `https://ui-avatars.com/api/?name=${avatarName.replace(" ", "+")}`}
      alt={avatarName}
      title={avatarName}
    />
  );
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
}) => {
  const members = project.members || [];
  const teamLead = project.teamLead || null;

  return (
    <Card>
      {/* Header */}
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {project?.name || "Untitled Project"}
        </h3>

        <span className="text-sm font-medium px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
          {project?.status || "Unknown"}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 mb-4">
        {project?.description || "No description available."}
      </p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress
          </span>

          <span className="text-sm font-semibold text-blue-600">
            {project?.progress ?? 0}%
          </span>
        </div>

        <ProgressBar value={project?.progress} />
      </div>

      {/* Members */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex -space-x-2">
          {members.length > 0 ? (
            members.map((member: User) => (
              <Avatar
                key={member.id}
                src={member.avatarUrl}
                name={member.name}
              />
            ))
          ) : (
            <span className="text-xs text-gray-400">No members</span>
          )}
        </div>

        <div className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Lead:</span>{" "}
          {teamLead?.name || "Not Assigned"}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-5 border-t pt-3">
        <button
          onClick={() => onEdit(project)}
          className="text-sm px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(project?.id)}
          className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </Card>
  );
};
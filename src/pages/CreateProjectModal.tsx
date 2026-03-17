import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Project, User, ProjectStatus } from "./index";

/* Modal */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) =>
  isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose}>&times;</button>
        </div>
        {children}
      </div>
    </div>
  ) : null;

/* Inputs */
const Input = (props: any) => (
  <input
    {...props}
    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
  />
);

const Textarea = (props: any) => (
  <textarea
    {...props}
    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
  />
);

const Select = (props: any) => (
  <select
    {...props}
    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
  />
);

const Button = (props: any) => (
  <button
    {...props}
    className={`px-4 py-2 rounded ${
      props.primary ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-600"
    }`}
  />
);

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Project, "id" | "progress">) => void;
  availableUsers: User[];
}

type FormData = {
  name: string;
  description: string;
  startDate: string;
  dueDate: string;
  status: ProjectStatus;
  memberIds: string[];
  teamLeadId: string;
};

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  availableUsers,
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const selectedMemberIds = watch("memberIds") || [];

  const availableLeads = availableUsers.filter((user) =>
    selectedMemberIds.includes(user.id)
  );

  const handleFormSubmit = (data: FormData) => {
  const teamLead = availableUsers.find((u) => u.id === data.teamLeadId);
  const members = availableUsers.filter((u) =>
    data.memberIds.includes(u.id)
  );

  if (!teamLead) return;

  onSubmit({
    name: data.name,
    description: data.description,
    startDate: data.startDate,   // keep as string
    dueDate: data.dueDate,       // keep as string
    status: data.status,
    teamLead,
    members,
  });

  reset();
  onClose();
};

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label>Project Name</label>
          <Input {...register("name", { required: "Project name is required" })} />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label>Project Description</label>
          <Textarea {...register("description")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Start Date</label>
            <Input
              type="date"
              {...register("startDate", { required: "Start date is required" })}
            />
          </div>

          <div>
            <label>Due Date</label>
            <Input
              type="date"
              {...register("dueDate", { required: "Due date is required" })}
            />
          </div>
        </div>

        <div>
          <label>Status</label>
          <Controller
            name="status"
            control={control}
            defaultValue="Not Started"
            render={({ field }) => (
              <Select {...field}>
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>On Hold</option>
              </Select>
            )}
          />
        </div>

        <div>
          <label>Team Members</label>
          <Controller
            name="memberIds"
            control={control}
            rules={{ required: "Select at least one member" }}
            render={({ field }) => (
              <Select {...field} multiple>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            )}
          />
        </div>

        <div>
          <label>Team Lead</label>
          <Controller
            name="teamLeadId"
            control={control}
            rules={{ required: "Team lead required" }}
            render={({ field }) => (
              <Select {...field} disabled={availableLeads.length === 0}>
                <option value="">Select Lead</option>
                {availableLeads.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" primary>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};
import React, { useState } from "react";

type Project = {
  id: number;
  name: string;
  status: string;
  progress: number;
  members: string[];
};

/* Existing team members */

const USERS = [
  "admin",
  "john",
  "sarah",
  "mike",
  "alex",
  "emma"
];

export default function ProjectsPage() {

  const [projects, setProjects] = useState<Project[]>([]);

  const [form, setForm] = useState({
    name: "",
    status: "Active",
    progress: 0
  });

  const [members, setMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState("");

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [editId, setEditId] = useState<number | null>(null);

  /* Detect @ */

  const handleMemberInput = (value: string) => {

    setMemberInput(value);

    if (value.startsWith("@")) {

      const query = value.slice(1).toLowerCase();

      const filtered = USERS.filter(u =>
        u.toLowerCase().includes(query) &&
        !members.includes(u)
      );

      setSuggestions(filtered);

    } else {
      setSuggestions([]);
    }
  };

  /* Select member */

  const selectMember = (user: string) => {

    setMembers([...members, user]);

    setMemberInput("");

    setSuggestions([]);

  };

  /* Add Project */

  const handleSubmit = () => {

    if (!form.name) return;

    const newProject: Project = {
      id: editId ?? Date.now(),
      name: form.name,
      status: form.status,
      progress: Number(form.progress),
      members: members
    };

    if (editId) {
      setProjects(projects.map(p => p.id === editId ? newProject : p));
      setEditId(null);
    } else {
      setProjects([...projects, newProject]);
    }

    setForm({
      name: "",
      status: "Active",
      progress: 0
    });

    setMembers([]);
  };

  /* Delete */

  const deleteProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  /* Edit */

  const editProject = (project: Project) => {

    setForm({
      name: project.name,
      status: project.status,
      progress: project.progress
    });

    setMembers(project.members);

    setEditId(project.id);
  };

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Projects</h1>

      {/* Form */}

      <div className="grid grid-cols-2 gap-4 mb-6 bg-white p-4 shadow rounded">

        <input
          type="text"
          placeholder="Project Name"
          value={form.name}
          onChange={e => setForm({...form, name: e.target.value})}
          className="border p-2 rounded"
        />

        <select
          value={form.status}
          onChange={e => setForm({...form, status: e.target.value})}
          className="border p-2 rounded"
        >
          <option>Active</option>
          <option>Completed</option>
          <option>On Hold</option>
        </select>

        <input
          type="number"
          placeholder="Progress %"
          value={form.progress}
          onChange={e => setForm({...form, progress: Number(e.target.value)})}
          className="border p-2 rounded"
        />

        {/* Members */}

        <div className="relative">

          <input
            type="text"
            placeholder="Type @ to assign member"
            value={memberInput}
            onChange={(e) => handleMemberInput(e.target.value)}
            className="border p-2 rounded w-full"
          />

          {suggestions.length > 0 && (

            <div className="absolute bg-white border w-full mt-1 shadow">

              {suggestions.map(user => (

                <div
                  key={user}
                  onClick={() => selectMember(user)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  @{user}
                </div>

              ))}

            </div>

          )}

        </div>

        {/* Selected Members */}

        <div className="col-span-2 flex gap-2 flex-wrap">

          {members.map(m => (

            <span
              key={m}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded"
            >
              @{m}
            </span>

          ))}

        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded col-span-2"
        >
          {editId ? "Update Project" : "Add Project"}
        </button>

      </div>

      {/* Projects Table */}

      <table className="w-full bg-white shadow rounded">

        <thead className="bg-gray-100">

          <tr>
            <th className="p-3 text-left">Project</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Progress</th>
            <th className="p-3 text-left">Members</th>
            <th className="p-3 text-left">Actions</th>
          </tr>

        </thead>

        <tbody>

          {projects.map(project => (

            <tr key={project.id} className="border-b">

              <td className="p-3">{project.name}</td>

              <td className="p-3">{project.status}</td>

              <td className="p-3">{project.progress}%</td>

              <td className="p-3">
                {project.members.map(m => `@${m}`).join(", ")}
              </td>

              <td className="p-3 flex gap-3">

                <button
                  onClick={() => editProject(project)}
                  className="text-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProject(project.id)}
                  className="text-red-500"
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}
import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus, CheckCircle2, FolderKanban, User } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

/* ---------------- CURRENT USER ---------------- */

const currentUser = {
  id: 2,
  name: "Sarah Williams",
  role: "Manager",
};

/* ---------------- STORAGE KEYS ---------------- */

const PROJECTS_KEY = "tasksphere_projects";
const MEMBERS_KEY = "tasksphere_members";

/* ---------------- INITIAL DATA ---------------- */

const initialProjects = [
  {
    id: 1,
    name: "Frontend Revamp",
    progress: 75,
    members: ["Admin", "Mike Ross"],
  },
  {
    id: 2,
    name: "Backend Core API",
    progress: 45,
    members: ["Sarah Williams"],
  },
  {
    id: 3,
    name: "Mobile App",
    progress: 30,
    members: ["John Doe"],
  },
];

const initialMembers = [
  { id: 1, name: "Admin", role: "Admin", projects: [1] },
  { id: 2, name: "Sarah Williams", role: "Manager", projects: [2] },
  { id: 3, name: "Mike Ross", role: "Member", projects: [1] },
  { id: 4, name: "John Doe", role: "Member", projects: [3] },
];

/* ---------------- HELPER ---------------- */

const getInitialState = (key, data) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : data;
};

/* =====================================================
   PROJECTS PAGE
===================================================== */

export function Projects() {
  const [projects, setProjects] = useState(() =>
    getInitialState(PROJECTS_KEY, initialProjects)
  );

  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }, [projects]);

  const canEdit = ["Admin", "Manager"].includes(currentUser.role);

  /* ADD PROJECT */

  const addProject = () => {
    if (!newProjectName.trim()) return;

    const newProject = {
      id: Date.now(),
      name: newProjectName,
      progress: 0,
      members: ["Not Assigned"],
    };

    setProjects((prev) => [...prev, newProject]);

    setNewProjectName("");
  };

  /* DELETE PROJECT */

  const deleteProject = (id) => {
    if (window.confirm("Delete this project?")) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  /* EDIT PROJECT */

  const editProject = (id) => {
    const newName = prompt("Enter new project name");

    if (!newName || !newName.trim()) return;

    setProjects(
      projects.map((p) =>
        p.id === id ? { ...p, name: newName } : p
      )
    );
  };

  return (
    <div className="p-6">

      <div className="flex justify-between mb-6">

        <h1 className="text-2xl font-bold">Projects</h1>

        {canEdit && (
          <div className="flex gap-2">
            <input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="New Project Name"
              className="border p-2 rounded"
            />

            <button
              onClick={addProject}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        )}

      </div>

      <table className="w-full bg-white shadow rounded">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Project</th>
            <th className="p-3 text-left">Progress</th>
            <th className="p-3 text-left">Members</th>
            {canEdit && <th className="p-3 text-left">Actions</th>}
          </tr>
        </thead>

        <tbody>

          {projects.map((project) => (

            <tr key={project.id} className="border-b">

              <td className="p-3">{project.name}</td>

              <td className="p-3">{project.progress}%</td>

              <td className="p-3">
                {project.members.length
                  ? project.members.join(", ")
                  : "Not Assigned"}
              </td>

              {canEdit && (
                <td className="p-3 flex gap-2">

                  <button
                    onClick={() => editProject(project.id)}
                    className="text-blue-600"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => deleteProject(project.id)}
                    className="text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>

                </td>
              )}

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

/* =====================================================
   TEAM PAGE
===================================================== */

export function Team() {
  const [members, setMembers] = useState(() =>
    getInitialState(MEMBERS_KEY, initialMembers)
  );

  useEffect(() => {
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
  }, [members]);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Team Members</h1>

      <table className="w-full bg-white shadow rounded">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Member</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Projects</th>
          </tr>
        </thead>

        <tbody>

          {members.map((member) => (

            <tr key={member.id} className="border-b">

              <td className="p-3">{member.name}</td>

              <td className="p-3">{member.role}</td>

              <td className="p-3">
                {member.projects.join(", ") || "-"}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

/* =====================================================
   REPORTS PAGE
===================================================== */

export function Reports() {

  const [projects, setProjects] = useState(() =>
    getInitialState(PROJECTS_KEY, initialProjects)
  );

  const projectData = projects.map((p) => ({
    name: p.name,
    progress: p.progress,
  }));

  const companyData = [
    { name: "Q1", progress: 60 },
    { name: "Q2", progress: 70 },
    { name: "Q3", progress: 80 },
    { name: "Q4", progress: 90 },
  ];

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <div className="grid grid-cols-2 gap-6">

        <div className="bg-white p-4 rounded shadow">

          <h2 className="font-semibold mb-2">Project Progress</h2>

          <ResponsiveContainer width="100%" height={250}>

            <BarChart data={projectData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="progress" fill="#3b82f6" />
            </BarChart>

          </ResponsiveContainer>

        </div>

        <div className="bg-white p-4 rounded shadow">

          <h2 className="font-semibold mb-2">Company Progress</h2>

          <ResponsiveContainer width="100%" height={250}>

            <LineChart data={companyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="progress" stroke="#10b981" />
            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   ACTIVITY PAGE
===================================================== */

export function Activity() {

  const activities = [
    { id: 1, type: "completed", user: "Admin", title: "Fixed API bug" },
    { id: 2, type: "created", user: "Mike Ross", title: "Mobile App Project" },
    { id: 3, type: "assigned", user: "Sarah Williams", title: "UI Task" },
  ];

  const icon = (type) => {
    if (type === "completed") return <CheckCircle2 size={18} className="text-green-500" />;
    if (type === "created") return <FolderKanban size={18} className="text-blue-500" />;
    if (type === "assigned") return <User size={18} className="text-purple-500" />;
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">Activity</h1>

      <ul className="space-y-2">

        {activities.map((a) => (

          <li key={a.id} className="flex gap-2 bg-white p-3 rounded shadow">

            {icon(a.type)}

            <span>
              <b>{a.user}</b> {a.type} <b>{a.title}</b>
            </span>

          </li>

        ))}

      </ul>

    </div>
  );
}
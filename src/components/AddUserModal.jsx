import { useState } from "react";

export default function AddUserModal({ isOpen, onClose, onAddUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      id: Date.now(),
      name,
      email,
      role
    };

    onAddUser(newUser);

    setName("");
    setEmail("");
    setRole("Member");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Add User</h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            className="w-full border p-2 rounded"
            placeholder="Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <div>
  <label className="block text-sm mb-1">Password</label>
  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full border rounded p-2"
  />
</div>

          <select
            className="w-full border p-2 rounded"
            value={role}
            onChange={(e)=>setRole(e.target.value)}
          >
            <option>Member</option>
            <option>Manager</option>
          </select>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Add
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
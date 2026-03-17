import { useState } from "react";

export default function EditUserModal({ isOpen, user, onClose, onUpdateUser }) {

  const [name,setName]=useState(user?.name || "");
  const [email,setEmail]=useState(user?.email || "");

  if(!isOpen) return null;

  const handleSubmit=(e)=>{
    e.preventDefault();

    onUpdateUser({
      ...user,
      name,
      email
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">

      <div className="bg-white p-6 rounded-lg w-96">

        <h2 className="text-lg font-semibold mb-4">
          Edit User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <input
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <div className="flex justify-end gap-2">

            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button className="bg-green-600 text-white px-3 py-1 rounded">
              Update
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
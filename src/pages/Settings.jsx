import React, { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  Briefcase
} from "lucide-react";

import AddUserModal from "../components/AddUserModal";
import EditUserModal from "../components/EditUserModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

const SectionCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow border p-6">
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
    {children}
  </div>
);


const ProfileSetting = ({ label, value, icon }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>

    <div className="relative mt-1">
      <div className="absolute left-2 top-2 text-gray-400">{icon}</div>

      <input
        type="text"
        value={value || ""}
        readOnly
        className="pl-8 p-2 w-full border rounded bg-gray-100"
      />
    </div>
  </div>
);


const UserRow = ({ user, onEdit, onDelete }) => (
  <tr className="border-b">
    <td className="p-3">
      <div className="font-medium">{user.name}</div>
      <div className="text-xs text-gray-500">{user.email}</div>
    </td>

    <td className="p-3">{user.role}</td>

    <td className="p-3 text-right space-x-2">
      <button onClick={() => onEdit(user)}>
        <Edit size={16} />
      </button>

      <button onClick={() => onDelete(user)}>
        <Trash2 size={16} />
      </button>
    </td>
  </tr>
);


export default function Settings() {

  const auth = useAuth();

  const user = auth?.user;
  const users = auth?.users || [];
  const addUser = auth?.addUser;
  const updateUser = auth?.updateUser;
  const deleteUser = auth?.deleteUser;

  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);


  if (!user) {
    return (
      <div className="p-6">
        Loading user...
      </div>
    );
  }


  const managedUsers = useMemo(() => {

    if (user.role === "Admin") {
      return users.filter(u => u.id !== user.id);
    }

    if (user.role === "Manager") {
      return users.filter(u => u.managerId === user.id);
    }

    return [];

  }, [users, user]);


  const openEdit = (u) => {
    setSelectedUser(u);
    setEditOpen(true);
  };

  const openDelete = (u) => {
    setSelectedUser(u);
    setDeleteOpen(true);
  };


  const handleAdd = (newUser) => {
    addUser?.(newUser);
    setAddOpen(false);
  };

  const handleUpdate = (updated) => {
    updateUser?.(updated);
    setEditOpen(false);
  };

  const handleDelete = () => {
    deleteUser?.(selectedUser?.id);
    setDeleteOpen(false);
  };


  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold">Settings</h1>


      {/* PROFILE */}

      <SectionCard
        title="Profile"
        icon={<User size={20} />}
      >

        <div className="grid md:grid-cols-2 gap-4">

          <ProfileSetting
            label="Name"
            value={user.name}
            icon={<User size={16} />}
          />

          <ProfileSetting
            label="Email"
            value={user.email}
            icon={<Mail size={16} />}
          />

          <ProfileSetting
            label="Password"
            value="********"
            icon={<Lock size={16} />}
          />

        </div>

      </SectionCard>



      {/* ADMIN PANEL */}

      {user.role === "Admin" && (

        <SectionCard
          title="User Management"
          icon={<Shield size={20} />}
        >

          <div className="flex justify-between mb-4">

            <p className="text-gray-600">
              Manage system users
            </p>

            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded"
            >
              <UserPlus size={16} />
              Add User
            </button>

          </div>


          <table className="w-full text-sm">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>


            <tbody>

              {managedUsers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (

                managedUsers.map(u => (
                  <UserRow
                    key={u.id}
                    user={u}
                    onEdit={openEdit}
                    onDelete={openDelete}
                  />
                ))

              )}

            </tbody>

          </table>

        </SectionCard>

      )}



      {/* MODALS */}

      {isAddOpen && (
        <AddUserModal
          isOpen={isAddOpen}
          onClose={() => setAddOpen(false)}
          onAddUser={handleAdd}
        />
      )}


      {isEditOpen && selectedUser && (
        <EditUserModal
          isOpen={isEditOpen}
          user={selectedUser}
          onClose={() => setEditOpen(false)}
          onUpdateUser={handleUpdate}
        />
      )}


      {isDeleteOpen && selectedUser && (
        <DeleteConfirmationModal
          isOpen={isDeleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDelete}
          userName={selectedUser.name}
        />
      )}

    </div>
  );
}
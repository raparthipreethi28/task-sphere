import React, { createContext, useContext, useState } from "react";

type User = {
  id: number;
  name: string;
  email?: string;
  role: string;
  managerId?: number;
};

type UsersContextType = {
  users: User[];
  addUser: (user: Omit<User, "id">) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: number) => void;
};

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Admin", email: "admin@tasksphere.com", role: "Admin" },
    { id: 2, name: "John Doe", email: "john@tasksphere.com", role: "Manager", managerId: 1 },
    { id: 3, name: "Sarah Williams", email: "sarah@tasksphere.com", role: "Developer", managerId: 2 }
  ]);

  const addUser = (user: Omit<User, "id">) => {
    setUsers(prev => [...prev, { ...user, id: Date.now() }]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev =>
      prev.map(u => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  const deleteUser = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <UsersContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {

  const context = useContext(UsersContext);

  if (!context) {
    throw new Error("useUsers must be used inside UsersProvider");
  }

  return context;
};
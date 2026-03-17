import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { UsersProvider } from "./context/UsersContext";

import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";

import ProjectsPage from "./pages/ProjectsPage";
import { Team, Reports, Activity } from "./pages/PlaceholderPages";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <UsersProvider>
      <BrowserRouter>

        <Routes>

          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >

            <Route index element={<Dashboard />} />

            <Route path="tasks" element={<Tasks />} />

            <Route path="projects" element={<ProjectsPage />} />

            <Route path="team" element={<Team />} />

            <Route path="reports" element={<Reports />} />

            <Route path="activity" element={<Activity />} />

            <Route path="settings" element={<Settings />} />

          </Route>

        </Routes>

      </BrowserRouter>
      </UsersProvider>
    </AuthProvider>
  );
}

export default App;
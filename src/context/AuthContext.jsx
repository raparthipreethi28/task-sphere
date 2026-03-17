import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { MOCK_USER } from '../services/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('taskSphereUser');
    if (storedUser) {
      // To ensure mock data changes are reflected, we "refresh" the user
      // from the source if it's the demo user. In a real app, this would
      // be an API call to fetch the latest user profile.
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.email === 'demo@tasksphere.com') {
        setUser(MOCK_USER);
      } else {
        setUser(parsedUser);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      localStorage.setItem('taskSphereUser', JSON.stringify(data.user));
      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskSphereUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

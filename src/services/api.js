import { MOCK_USER, TASKS, STATS } from './mockData';

// Simulating async API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (email, password) => {
    await delay(800); // Simulate network latency
    if (email === 'demo@tasksphere.com' && password === 'password') {
      return { token: 'mock-jwt-token', user: MOCK_USER };
    }
    throw new Error('Invalid credentials');
  }
};

export const taskService = {
  getTasks: async () => {
    await delay(500);
    return TASKS;
  },
  getStats: async () => {
    await delay(300);
    return STATS;
  }
};

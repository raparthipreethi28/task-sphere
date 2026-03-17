export const MOCK_USER = {
  id: 1,
  name: 'Admin',
  email: 'demo@tasksphere.com',
  role: 'Admin',
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
};

export const TASKS = [
  {
    id: 'T-101',
    title: 'Design System Update',
    description: 'Update the color palette and typography to match new branding guidelines.',
    status: 'In Progress',
    priority: 'High',
    type: 'Strategic',
    dueDate: '2023-11-15',
    assignee: 'Sarah W.',
    project: 'Frontend Revamp'
  },
  {
    id: 'T-102',
    title: 'Fix Login API Latency',
    description: 'Investigate slow response times on the authentication endpoint.',
    status: 'New',
    priority: 'Critical',
    type: 'Technical',
    dueDate: '2023-11-10',
    assignee: 'Mike R.',
    project: 'Backend Core'
  },
  {
    id: 'T-103',
    title: 'Q3 Financial Report',
    description: 'Compile data for the quarterly review meeting.',
    status: 'Completed',
    priority: 'Medium',
    type: 'Operational',
    dueDate: '2023-10-30',
    assignee: 'Admin',
    project: 'Finance'
  },
  {
    id: 'T-104',
    title: 'Mobile Responsive Layout',
    description: 'Ensure dashboard renders correctly on mobile devices.',
    status: 'In Progress',
    priority: 'High',
    type: 'Technical',
    dueDate: '2023-11-20',
    assignee: 'Sarah W.',
    project: 'Frontend Revamp'
  }
];

export const STATS = {
  total: 45,
  completed: 12,
  inProgress: 28,
  overdue: 5,
  projects: 8
};

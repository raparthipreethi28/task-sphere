import React, { useEffect, useState, useRef } from 'react';
import { taskService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutList, Kanban, Filter, Plus, MoreHorizontal, Calendar, User, Tag, X,
  Search, Clock, ChevronLeft, ChevronRight, Edit, Trash2, Bell, UserPlus,
  MessageSquare, CheckCircle2
} from 'lucide-react';

const Badge = ({ children, color }) => {
  const colors = {
    'High': 'bg-red-50 text-red-700 border border-red-200',
    'Critical': 'bg-red-50 text-red-700 border border-red-200',
    'Medium': 'bg-amber-50 text-amber-700 border border-amber-200',
    'Low': 'bg-green-50 text-green-700 border border-green-200',
    'New': 'bg-blue-50 text-blue-700 border border-blue-200',
    'In Progress': 'bg-purple-50 text-purple-700 border border-purple-200',
    'Completed': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[children] || 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
      {children}
    </span>
  );
};

const TEAM_MEMBERS = [
  { name: 'Admin', role: 'Admin' },
  { name: 'Sarah Williams', role: 'Manager' },
  { name: 'Mike Ross', role: 'Member' },
  { name: 'John Doe', role: 'Member' },
  { name: 'Emily Chen', role: 'Member' }
];

const TaskModal = ({ task, onClose }) => {
  if (!task) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-lg h-full bg-white shadow-2xl p-6 overflow-y-auto animate-slide-in">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold text-slate-900">{task.id}</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{task.title}</h3>
            <div className="flex gap-2 mb-4">
              <Badge>{task.status}</Badge>
              <Badge>{task.priority}</Badge>
            </div>
            <p className="text-slate-600 leading-relaxed">{task.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 py-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Assignee</label>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {task.assignee.charAt(0)}
                </div>
                <span className="text-sm font-medium">{task.assignee}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Due Date</label>
              <div className="flex items-center gap-2 mt-1 text-sm font-medium">
                <Calendar size={16} className="text-slate-400" />
                {task.dueDate}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Project</label>
              <div className="flex items-center gap-2 mt-1 text-sm font-medium">
                <Tag size={16} className="text-slate-400" />
                {task.project}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Type</label>
              <span className="text-sm font-medium block mt-1">{task.type}</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3">Comments</h4>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center text-slate-500 text-sm">
              No comments yet.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateTaskModal = ({ isOpen, onClose, initialDate, initialStatus, onSave, currentUser, taskToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('New');
  
  // Mention System State
  const [showMentionList, setShowMentionList] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [activeField, setActiveField] = useState(null); // 'description' or 'assignee'

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description);
        setAssignee(taskToEdit.assignee);
        setDueDate(taskToEdit.dueDate);
        setPriority(taskToEdit.priority);
        setStatus(taskToEdit.status);
      } else {
        setTitle('');
        setDescription('');
        setAssignee('');
        setDueDate(initialDate || new Date().toISOString().split('T')[0]);
        setPriority('Medium');
        setStatus(initialStatus || 'New');
      }
      setShowMentionList(false);
    }
  }, [isOpen, initialDate, taskToEdit]);

  const handleInput = (e, field) => {
    const value = e.target.value;
    if (field === 'description') setDescription(value);
    if (field === 'assignee') setAssignee(value);

    // Simple mention detection: check if last char is '@' or if we are currently mentioning
    if (value.endsWith('@')) {
      setShowMentionList(true);
      setActiveField(field);
      setMentionQuery('');
    } else if (showMentionList && activeField === field) {
      const lastAt = value.lastIndexOf('@');
      if (lastAt !== -1) {
        setMentionQuery(value.substring(lastAt + 1));
      } else {
        setShowMentionList(false);
      }
    }
  };

  const handleMentionSelect = (member) => {
    if (activeField === 'description') {
      const lastAt = description.lastIndexOf('@');
      const newDesc = description.substring(0, lastAt) + `@${member.name} ` + description.substring(description.length);
      setDescription(newDesc);
      setAssignee(member.name); // Auto-assign
    } else if (activeField === 'assignee') {
      setAssignee(member.name);
    }
    setShowMentionList(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      id: taskToEdit ? taskToEdit.id : `T-${Math.floor(Math.random() * 10000)}`,
      title,
      description: description || 'No description provided.',
      status: status,
      priority,
      type: taskToEdit ? taskToEdit.type : 'Operational',
      dueDate,
      assignee: assignee || currentUser?.name || 'Unassigned',
      project: taskToEdit ? taskToEdit.project : 'General'
    };

    onSave(taskData);
    onClose();
  };

  const filteredMembers = TEAM_MEMBERS.filter(m => m.name.toLowerCase().includes(mentionQuery.toLowerCase()));

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-slate-900">{taskToEdit ? 'Edit Task' : 'Create New Task'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form className="space-y-4 relative" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Task Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
              placeholder="What needs to be done?" 
              autoFocus 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea 
              value={description}
              onChange={(e) => handleInput(e, 'description')}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-24 resize-none" 
              placeholder="Describe the task... Type '@' to mention and assign." 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Assignee</label>
            <input 
              type="text" 
              value={assignee}
              onChange={(e) => handleInput(e, 'assignee')}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
              placeholder="Type '@' to select a member" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Due Date</label>
              <input 
                type="date" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                >
                  <option>Medium</option>
                  <option>High</option>
                  <option>Low</option>
                  <option>Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                >
                  <option value="New">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mention Dropdown */}
          {showMentionList && (
            <div className="absolute z-10 bg-white border border-slate-200 shadow-lg rounded-lg w-64 max-h-48 overflow-y-auto left-0 bottom-16 animate-slide-in">
              {filteredMembers.map((member, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleMentionSelect(member)}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700 flex items-center gap-2"
                >
                  <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">{member.name.charAt(0)}</div>
                  {member.name}
                </button>
              ))}
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">{taskToEdit ? 'Save Changes' : 'Create Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const NotificationPanel = ({ notifications, onClose }) => {
  const getIcon = (type) => {
    switch (type) {
      // Note: CheckCircle2 was missing from imports, causing a render error.
      case 'assignment': return <UserPlus className="text-blue-500" size={20} />;
      case 'mention': return <MessageSquare className="text-purple-500" size={20} />;
      case 'status': return <CheckCircle2 className="text-green-500" size={20} />;
      case 'due': return <Clock className="text-amber-500" size={20} />;
      default: return <Bell className="text-slate-500" size={20} />;
    }
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-20 animate-slide-in-top">
      <div className="flex justify-between items-center p-4 border-b border-slate-100">
        <h4 className="font-bold text-slate-800">Notifications</h4>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full">
          <X size={16} />
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map(n => (
            <div key={n.id} className={`flex items-start gap-4 p-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}>
              <div className="w-8 h-8 flex-shrink-0 bg-slate-100 rounded-full flex items-center justify-center">
                {getIcon(n.type)}
              </div>
              <div>
                <p className="text-sm text-slate-700 leading-snug">
                  <span className="font-semibold text-slate-900">{n.user}</span>
                  {n.type === 'assignment' && ` assigned you to `}
                  {n.type === 'mention' && ` mentioned you in `}
                  {n.type === 'status' && ` updated status to '${n.status}' for `}
                  {n.type === 'due' && ` task is due soon: `}
                  <span className="font-semibold text-slate-900">{n.title}</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">{n.time}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 px-4">
            <Bell size={32} className="mx-auto text-slate-300" />
            <h5 className="font-semibold mt-4 text-slate-600">No notifications yet</h5>
          </div>
        )}
      </div>
      <div className="p-2 bg-slate-50 text-center">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View all notifications</button>
      </div>
    </div>
  );
};

const initialNotifications = [
  { id: 1, type: 'mention', user: 'Sarah Williams', task: 'T-7890', title: 'Update the login flow', time: '2m ago', read: false },
  { id: 2, type: 'assignment', user: 'Admin', task: 'T-1234', title: 'Design new dashboard widgets', time: '1h ago', read: false },
  { id: 3, type: 'status', user: 'Mike Ross', task: 'T-5678', title: 'Fix API integration bug', status: 'Completed', time: '3h ago', read: true },
  { id: 4, type: 'due', task: 'T-4321', title: 'Prepare Q3 presentation', time: 'Tomorrow', read: true },
];

export default function Tasks() {
  const { user } = useAuth();
  const [view, setView] = useState('board');
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [showMyTasks, setShowMyTasks] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('New');
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [notifications, setNotifications] = useState(initialNotifications);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationPanelRef = useRef(null);
  const notificationButtonRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationPanelRef.current && !notificationPanelRef.current.contains(event.target) &&
        notificationButtonRef.current && !notificationButtonRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const canCreateTask = ['Admin', 'Manager'].includes(user?.role);

  useEffect(() => {
    taskService.getTasks().then(setTasks);
  }, []);

  const filteredTasks = tasks.filter(t => {
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    
    // Role-based visibility: Members only see their own tasks
    if (!canCreateTask) {
      return matchesStatus && t.assignee === user?.name;
    }

    const matchesUser = showMyTasks ? t.assignee === user?.name : true;
    return matchesStatus && matchesUser;
  });

  const columns = [
    { title: 'To Do', status: 'New', color: 'bg-slate-100' },
    { title: 'In Progress', status: 'In Progress', color: 'bg-blue-50' },
    { title: 'Completed', status: 'Completed', color: 'bg-green-50' }
  ];

  // Calendar Helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay, year, month };
  };

  const { days, firstDay, year, month } = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  const handleOpenCreateModal = (date = '', status = 'New') => {
    setTaskToEdit(null);
    setNewTaskDate(date || new Date().toISOString().split('T')[0]);
    setNewTaskStatus(status);
    setIsCreateModalOpen(true);
  };

  const handleSaveTask = (savedTask) => {
    // This is a simplified demonstration of how notifications could be triggered.
    // In a real application, this would likely be handled by a backend service
    // that sends push notifications or updates a shared state.
    const newNotifications = [];

    if (taskToEdit) {
      // If assignee changes to the current user, create a notification
      if (savedTask.assignee !== taskToEdit.assignee && savedTask.assignee === user?.name) {
        newNotifications.push({
          id: Date.now(), type: 'assignment', user: 'Admin', task: savedTask.id,
          title: savedTask.title, time: 'Just now', read: false
        });
      }
      setTasks(prev => prev.map(t => t.id === savedTask.id ? savedTask : t));
    } else {
      // If a new task is assigned to the current user
      if (savedTask.assignee === user?.name) {
        newNotifications.push({
          id: Date.now(), type: 'assignment', user: 'Admin', task: savedTask.id,
          title: savedTask.title, time: 'Just now', read: false
        });
      }
      setTasks(prev => [savedTask, ...prev]);
    }

    // Check for mentions of the current user
    if (savedTask.description.includes(`@${user?.name}`)) {
      newNotifications.push({
        id: Date.now() + 1, type: 'mention', user: 'Admin', task: savedTask.id,
        title: savedTask.title, time: 'Just now', read: false
      });
    }

    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev]);
    }

    setTaskToEdit(null);
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsCreateModalOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  const handleBellClick = () => {
    setIsNotificationsOpen(prev => !prev);
    if (!isNotificationsOpen && unreadCount > 0) {
      setTimeout(() => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
      }, 1000); // Mark as read after a short delay
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Task Management</h1>
          <p className="text-slate-500 mt-1">Manage and track team workload.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative" ref={notificationPanelRef}>
            <button ref={notificationButtonRef} onClick={handleBellClick} className="p-2 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell size={20} className="text-slate-500" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            {isNotificationsOpen && <NotificationPanel notifications={notifications} onClose={() => setIsNotificationsOpen(false)} />}
          </div>
          {canCreateTask && (
            <button 
              onClick={() => handleOpenCreateModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus size={16} /> Create Task
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-1">
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          <button 
            onClick={() => setView('board')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${view === 'board' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Kanban size={16} /> Board View
          </button>
          <button 
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${view === 'list' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <LayoutList size={16} /> List View
          </button>
          <button 
            onClick={() => setView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${view === 'calendar' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Calendar size={16} /> Calendar
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowMyTasks(!showMyTasks)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${showMyTasks ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <User size={16} />
            My Tasks
          </button>
          <div className="relative flex-1 sm:flex-none">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              className="w-full sm:w-40 pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="New">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {view === 'list' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-700">Task</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Priority</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Assignee</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Due Date</th>
                    {canCreateTask && <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTasks.map(task => (
                    <tr 
                      key={task.id} 
                      onClick={() => setSelectedTask(task)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{task.title}</p>
                        <p className="text-xs text-slate-500">{task.id} • {task.project}</p>
                      </td>
                      <td className="px-6 py-4"><Badge>{task.status}</Badge></td>
                      <td className="px-6 py-4"><Badge>{task.priority}</Badge></td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold">
                          {task.assignee.charAt(0)}
                        </div>
                        {task.assignee}
                      </td>
                      <td className="px-6 py-4 text-slate-500">{task.dueDate}</td>
                      {canCreateTask && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleEditTask(task); }}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Task"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Task"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'board' && (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map(col => (
              <div key={col.title} className="min-w-[320px] w-[350px] flex flex-col">
                {/* Column Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">{col.title}</h3>
                    <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
                      {tasks.filter(t => t.status === col.status).length}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {canCreateTask && (
                      <button 
                        onClick={() => handleOpenCreateModal('', col.status)}
                        className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-blue-600 transition-colors"
                        title="Add Task"
                      >
                        <Plus size={16} />
                      </button>
                    )}
                    <button className="p-1 hover:bg-slate-200 rounded text-slate-400"><MoreHorizontal size={16} /></button>
                  </div>
                </div>

                {/* Column Content */}
                <div className="space-y-3">
                  {tasks.filter(t => t.status === col.status).map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => setSelectedTask(task)}
                      className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <Badge>{task.priority}</Badge>
                        <button className="text-slate-400 opacity-0 group-hover:opacity-100 hover:text-slate-600 transition-opacity">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                      
                      <h4 className="font-semibold text-slate-900 mb-3 leading-snug">{task.title}</h4>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                            {task.assignee.charAt(0)}
                          </div>
                          <span className="text-xs font-medium text-slate-600">{task.assignee}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                          <Clock size={12} />
                          <span>{task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'calendar' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold text-slate-900">
                  {monthNames[month]} {year}
                </h2>
                <div className="flex items-center bg-slate-100 rounded-lg p-1">
                  <button onClick={handlePrevMonth} className="p-1 hover:bg-white rounded-md shadow-sm transition-all text-slate-600"><ChevronLeft size={16} /></button>
                  <button onClick={handleToday} className="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-900">Today</button>
                  <button onClick={handleNextMonth} className="p-1 hover:bg-white rounded-md shadow-sm transition-all text-slate-600"><ChevronRight size={16} /></button>
                </div>
              </div>
            </div>

            {/* Calendar Grid Header */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid Body */}
            <div className="grid grid-cols-7 auto-rows-fr">
              {/* Empty cells for previous month */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-slate-50/30 border-b border-r border-slate-100 min-h-[120px]" />
              ))}

              {/* Days */}
              {Array.from({ length: days }).map((_, i) => {
                const day = i + 1;
                const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayTasks = filteredTasks.filter(t => t.dueDate === dateString);
                const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

                return (
                  <div key={day} className={`border-b border-r border-slate-100 p-2 min-h-[120px] transition-colors hover:bg-slate-50 group relative ${isToday ? 'bg-blue-50/30' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 group-hover:bg-white group-hover:shadow-sm'}`}>
                        {day}
                      </span>
                      <div className="flex items-center gap-1">
                        {canCreateTask && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleOpenCreateModal(dateString); }}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                            title="Add Task"
                          >
                            <Plus size={14} />
                          </button>
                        )}
                        {dayTasks.length > 0 && (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                            {dayTasks.length}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {dayTasks.map(task => (
                        <button 
                          key={task.id}
                          onClick={(e) => { e.stopPropagation(); setSelectedTask(task); }}
                          className={`w-full text-left text-[11px] px-2 py-1.5 rounded-md border shadow-sm truncate transition-all hover:scale-[1.02] ${
                            task.priority === 'High' || task.priority === 'Critical' ? 'bg-red-50 text-red-700 border-red-100' :
                            task.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-blue-50 text-blue-700 border-blue-100'
                          }`}
                        >
                          {task.title}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {/* Fill remaining cells */}
              {Array.from({ length: (7 - (days + firstDay) % 7) % 7 }).map((_, i) => (
                 <div key={`next-empty-${i}`} className="bg-slate-50/30 border-b border-r border-slate-100 min-h-[120px]" />
              ))}
            </div>
          </div>
        )}
      </div>

      <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        initialDate={newTaskDate} 
        initialStatus={newTaskStatus}
        onSave={handleSaveTask}
        currentUser={user}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}

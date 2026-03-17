import React, { useEffect, useState, useRef } from 'react';
import { taskService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, Clock, AlertCircle, Layers, TrendingUp, 
  Users, FolderKanban, MoreHorizontal, Search, LayoutList, User
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${trend.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
          <TrendingUp size={12} className={`mr-1 ${trend.startsWith('-') ? 'rotate-180' : ''}`} /> {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <p className="text-sm font-medium text-slate-500 mt-1">{title}</p>
    </div>
  </div>
);

const ProgressItem = ({ label, percentage, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <span className="text-slate-500">{percentage}%</span>
    </div>
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);

// Data for search (in a real app, this would come from a central store or API)
const projects = [
  'Frontend Revamp',
  'Backend Core API',
  'Mobile Application',
  'Design System',
  'Q3 Financial Report',
];
const members = [
  { id: 1, name: 'Admin', email: 'demo@tasksphere.com' },
  { id: 2, name: 'Sarah Williams', email: 'sarah@tasksphere.com' },
  { id: 3, name: 'Mike Ross', email: 'mike@tasksphere.com' },
  { id: 4, name: 'John Doe', email: 'john@tasksphere.com' },
  { id: 5, name: 'Emily Chen', email: 'emily@tasksphere.com' },
];

const SearchResultItem = ({ result, onClick }) => {
  const getIcon = () => {
    switch (result.type) {
      case 'Task':
        return <LayoutList className="text-blue-500" size={18} />;
      case 'Project':
        return <FolderKanban className="text-purple-500" size={18} />;
      case 'Member':
        return <User className="text-green-500" size={18} />;
      default:
        return null;
    }
  };

  return (
    <li>
      <Link to={result.path} onClick={onClick} className="flex items-center gap-4 p-3 hover:bg-slate-50 transition-colors">
        <div className="w-8 h-8 flex-shrink-0 bg-slate-100 rounded-lg flex items-center justify-center">
          {getIcon()}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800">{result.name}</p>
          <p className="text-xs text-slate-500">{result.type}</p>
        </div>
      </Link>
    </li>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    taskService.getStats().then(setStats);
    taskService.getTasks().then(setTasks);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();

    const taskResults = tasks
      .filter(task => task.title.toLowerCase().includes(lowerCaseQuery))
      .map(task => ({ type: 'Task', name: task.title, path: `/tasks` }));

    const projectResults = projects
      .filter(project => project.toLowerCase().includes(lowerCaseQuery))
      .map(project => ({ type: 'Project', name: project, path: '/projects' }));

    const memberResults = members
      .filter(member => member.name.toLowerCase().includes(lowerCaseQuery) || member.email.toLowerCase().includes(lowerCaseQuery))
      .map(member => ({ type: 'Member', name: member.name, path: '/team' }));

    const combinedResults = [...taskResults, ...projectResults, ...memberResults].slice(0, 10);
    setSearchResults(combinedResults);
    setIsSearchOpen(true);
  }, [searchQuery, tasks]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!stats) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Track your team's progress and project status.</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Global Search Bar */}
          <div className="relative" ref={searchContainerRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim().length > 0 && setIsSearchOpen(true)}
            />
            {isSearchOpen && (
              <div className="absolute top-full mt-2 w-full sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-30 right-0">
                {searchResults.length > 0 ? (
                  <ul className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                    {searchResults.map((result, index) => (
                      <SearchResultItem key={index} result={result} onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }} />
                    ))}
                  </ul>
                ) : (
                  <div className="p-6 text-center text-sm text-slate-500">
                    <p className="font-semibold">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <span className="text-sm font-medium text-slate-500">Workspace:</span>
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold border border-slate-200">
            Engineering Team
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard 
          title="Total Tasks" 
          value={stats.total} 
          icon={Layers} 
          color="bg-blue-50 text-blue-600" 
          trend="+12%" 
        />
        <StatCard 
          title="Completed" 
          value={stats.completed} 
          icon={CheckCircle2} 
          color="bg-green-50 text-green-600" 
          trend="+8%" 
        />
        <StatCard 
          title="In Progress" 
          value={stats.inProgress} 
          icon={Clock} 
          color="bg-amber-50 text-amber-600" 
        />
        <StatCard 
          title="Overdue" 
          value={stats.overdue} 
          icon={AlertCircle} 
          color="bg-red-50 text-red-600" 
          trend="-2%" 
        />
        <StatCard 
          title="Team Members" 
          value="12" 
          icon={Users} 
          color="bg-indigo-50 text-indigo-600" 
        />
        <StatCard 
          title="Projects" 
          value={stats.projects} 
          icon={FolderKanban} 
          color="bg-violet-50 text-violet-600" 
        />
      </div>

      {/* Main Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task Progress Analytics */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Task Progress Analytics</h2>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="space-y-6">
            <ProgressItem label="Frontend Revamp" percentage={75} color="bg-blue-500" />
            <ProgressItem label="Backend Core API" percentage={45} color="bg-indigo-500" />
            <ProgressItem label="Mobile Application" percentage={30} color="bg-amber-500" />
            <ProgressItem label="Design System" percentage={90} color="bg-green-500" />
            <ProgressItem label="Q3 Financial Report" percentage={100} color="bg-slate-500" />
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <button onClick={() => navigate('/activity')} className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                  {['AD', 'SW', 'MR', 'JD'][i-1]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 truncate">
                    <span className="font-semibold">{['Admin', 'Sarah Williams', 'Mike Ross', 'John Doe'][i-1]}</span>
                    <span className="text-slate-500"> {['completed task', 'commented on', 'created new project', 'uploaded file'][i-1]} </span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{i * 15} mins ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

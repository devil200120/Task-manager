import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Plus, Filter, Search, Calendar, User, Loader2, Edit2, Trash2, Clock, UserPlus, CheckCircle2 } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { Task, TaskPriority, TaskStatus } from '../types';
import TaskModal from '../components/TaskModal';
import { ToastContainer } from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';

// Utility function to calculate time remaining
const getTimeRemaining = (dueDate: string) => {
  const now = new Date().getTime();
  const due = new Date(dueDate).getTime();
  const diff = due - now;

  if (diff <= 0) {
    return { text: 'Expired', color: 'text-red-600', bgColor: 'bg-red-50' };
  }

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days > 7) {
    return { text: `${days} days left`, color: 'text-green-600', bgColor: 'bg-green-50' };
  } else if (days > 2) {
    return { text: `${days} days left`, color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
  } else if (days >= 1) {
    return { text: `${days} day${days > 1 ? 's' : ''} ${hours % 24}h left`, color: 'text-orange-600', bgColor: 'bg-orange-50' };
  } else if (hours >= 1) {
    return { text: `${hours}h ${minutes % 60}m left`, color: 'text-red-600', bgColor: 'bg-red-50' };
  } else {
    return { text: `${minutes}m left`, color: 'text-red-600', bgColor: 'bg-red-50' };
  }
};

// Component to show live countdown
const TimeRemaining: React.FC<{ dueDate: string; status: TaskStatus }> = ({ dueDate, status }) => {
  const [timeInfo, setTimeInfo] = useState(getTimeRemaining(dueDate));

  useEffect(() => {
    // Update every minute
    const interval = setInterval(() => {
      setTimeInfo(getTimeRemaining(dueDate));
    }, 60000);

    // Also update immediately
    setTimeInfo(getTimeRemaining(dueDate));

    return () => clearInterval(interval);
  }, [dueDate]);

  // Don't show timer for completed tasks
  if (status === 'Completed') {
    return null;
  }

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${timeInfo.bgColor} ${timeInfo.color}`}>
      <Clock className="w-3 h-3" />
      <span>{timeInfo.text}</span>
    </div>
  );
};

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const { tasks, isLoading, error, updateTask, deleteTask } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<'dueDate' | 'createdAt' | 'priority'>('dueDate');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteTask(taskId);
      addToast('Task deleted successfully!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to delete task', 'error');
    }
  };

  const handleComplete = async (task: Task) => {
    try {
      const response = await updateTask(task._id, { status: TaskStatus.COMPLETED });
      
      if (response.success) {
        addToast('Task marked as completed!', 'success');
      } else {
        addToast(response.message || 'Failed to complete task', 'error');
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to complete task', 'error');
    }
  };

  const isTaskCreator = (task: Task) => {
    if (!user) return false;
    const creatorId = typeof task.creatorId === 'object' && task.creatorId._id 
      ? task.creatorId._id 
      : task.creatorId;
    return creatorId === user._id || creatorId === user.id;
  };

  const handleSave = async (data: any) => {
    try {
      if (selectedTask) {
        const updatePayload: any = {
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          dueDate: new Date(data.dueDate).toISOString(),
          assignedTo: data.assignedTo || null, // Backend will handle email lookup
        };

        const response = await updateTask(selectedTask._id, updatePayload);
        
        if (response.success) {
          addToast('Task updated successfully!', 'success');
          setIsModalOpen(false);
          setSelectedTask(undefined);
        } else {
          addToast(response.message || 'Failed to update task', 'error');
        }
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to save task', 'error');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(undefined);
  };

  const filteredAndSortedTasks = useMemo(() => {
    if (!tasks) return [];

    let filtered = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
      const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
      return matchesSearch && matchesPriority && matchesStatus;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'createdAt') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        const priorityOrder = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
    });

    return filtered;
  }, [tasks, searchQuery, filterPriority, filterStatus, sortBy]);

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'Urgent':
        return 'badge-danger';
      case 'High':
        return 'badge-warning';
      case 'Medium':
        return 'badge-primary';
      case 'Low':
        return 'badge-success';
      default:
        return 'badge-primary';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Review':
        return 'bg-purple-100 text-purple-800';
      case 'To Do':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (date: string, status: TaskStatus) => {
    if (status === 'Completed') return false;
    return new Date(date) < new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Tasks</h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              Showing {filteredAndSortedTasks.length} of {tasks?.length || 0} tasks
            </p>
          </div>
          <Link to="/tasks/new" className="btn btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            New Task
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'All')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="All">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'All')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="All">All Statuses</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Sort */}
          <div className="mt-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Sort by:</span>
            <button
              onClick={() => setSortBy('dueDate')}
              className={`px-3 py-1 text-sm rounded-lg ${
                sortBy === 'dueDate'
                  ? 'bg-primary-100 text-primary-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Due Date
            </button>
            <button
              onClick={() => setSortBy('priority')}
              className={`px-3 py-1 text-sm rounded-lg ${
                sortBy === 'priority'
                  ? 'bg-primary-100 text-primary-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Priority
            </button>
            <button
              onClick={() => setSortBy('createdAt')}
              className={`px-3 py-1 text-sm rounded-lg ${
                sortBy === 'createdAt'
                  ? 'bg-primary-100 text-primary-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Created Date
            </button>
          </div>
        </div>

        {/* Task List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r">
            {error.message}
          </div>
        ) : filteredAndSortedTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="inline-block p-4 bg-gray-50 rounded-2xl mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-6">
              {tasks?.length === 0
                ? 'Create your first task to get started'
                : 'Try adjusting your filters to find what you\'re looking for'}
            </p>
            <Link to="/tasks/new" className="btn btn-primary">
              <Plus className="w-5 h-5 mr-2" />
              Create Task
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAndSortedTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                  </div>
                  <span className={`badge ${getPriorityColor(task.priority)} ml-2 shrink-0`}>
                    {task.priority}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <div
                    className={`flex items-center text-xs ${
                      isOverdue(task.dueDate, task.status) ? 'text-red-600' : 'text-gray-600'
                    }`}
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(task.dueDate)}
                    {isOverdue(task.dueDate, task.status) && (
                      <span className="ml-1 font-semibold">(Overdue)</span>
                    )}
                  </div>
                  <TimeRemaining dueDate={task.dueDate} status={task.status} />
                </div>

                {/* Creator and Assignee Info */}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0 space-y-1">
                      {/* Creator */}
                      {task.creatorId && (
                        <div className="flex items-center text-xs text-gray-600">
                          <UserPlus className="w-3 h-3 mr-1.5 shrink-0" />
                          <span className="text-gray-500 mr-1">Created by:</span>
                          <span className="truncate font-medium">
                            {typeof task.creatorId === 'object' && task.creatorId.email
                              ? task.creatorId.email
                              : 'Unknown'}
                          </span>
                        </div>
                      )}
                      {/* Assignee */}
                      {(task.assignedToId && typeof task.assignedToId === 'object' && task.assignedToId.email) || task.assignedTo ? (
                        <div className="flex items-center text-xs text-gray-600">
                          <User className="w-3 h-3 mr-1.5 shrink-0" />
                          <span className="text-gray-500 mr-1">Assigned to:</span>
                          <span className="truncate font-medium">
                            {typeof task.assignedToId === 'object' && task.assignedToId?.email
                              ? task.assignedToId.email
                              : task.assignedTo?.email || 'Unknown'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center text-xs text-gray-400 italic">
                          <User className="w-3 h-3 mr-1.5 shrink-0" />
                          <span>Not assigned</span>
                        </div>
                      )}
                    </div>
                    {/* Action Buttons */}
                    <div className="flex gap-2 shrink-0">
                      {task.status !== 'Completed' && (
                        <button
                          onClick={() => handleComplete(task)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Mark as complete"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      {isTaskCreator(task) && (
                        <>
                          <button
                            onClick={() => handleEdit(task)}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Edit task"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;

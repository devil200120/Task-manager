import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowLeft, Calendar, User, UserPlus, Clock, Edit2, Trash2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../lib/api';
import { Task } from '../types';
import TaskModal from '../components/TaskModal';
import { ToastContainer } from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getTask(id);
      if (response.success && response.data) {
        setTask(response.data.task);
      } else {
        setError(response.message || 'Task not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!task || !confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const response = await apiClient.deleteTask(task._id);
      if (response.success) {
        addToast('Task deleted successfully!', 'success');
        setTimeout(() => navigate('/tasks'), 1000);
      } else {
        addToast(response.message || 'Failed to delete task', 'error');
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to delete task', 'error');
    }
  };

  const handleComplete = async () => {
    if (!task) return;
    
    try {
      const response = await apiClient.updateTask(task._id, { status: 'Completed' });
      
      if (response.success && response.data) {
        addToast('Task marked as completed!', 'success');
        setTask(response.data.task);
      } else {
        addToast(response.message || 'Failed to complete task', 'error');
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to complete task', 'error');
    }
  };

  const isTaskCreator = () => {
    if (!user || !task) return false;
    const creatorId = typeof task.creatorId === 'object' && task.creatorId._id 
      ? task.creatorId._id 
      : task.creatorId;
    return creatorId === user.id;
  };

  const handleSave = async (data: any) => {
    if (!task) return;
    
    try {
      const updatePayload: any = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        dueDate: new Date(data.dueDate).toISOString(),
        assignedTo: data.assignedTo || null,
      };

      const response = await apiClient.updateTask(task._id, updatePayload);
      
      if (response.success && response.data) {
        addToast('Task updated successfully!', 'success');
        setIsModalOpen(false);
        setTask(response.data.task);
      } else {
        addToast(response.message || 'Failed to update task', 'error');
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to save task', 'error');
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      Low: 'bg-green-100 text-green-700',
      Medium: 'bg-yellow-100 text-yellow-700',
      High: 'bg-orange-100 text-orange-700',
      Urgent: 'bg-red-100 text-red-700',
    };
    return colors[priority as keyof typeof colors] || colors.Medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'To Do': 'bg-gray-100 text-gray-700',
      'In Progress': 'bg-blue-100 text-blue-700',
      'Review': 'bg-purple-100 text-purple-700',
      'Completed': 'bg-green-100 text-green-700',
    };
    return colors[status as keyof typeof colors] || colors['To Do'];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'Completed';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/tasks" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tasks
          </Link>
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error || 'Task not found'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <Link to="/tasks" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tasks
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {task.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  {isOverdue(task.dueDate, task.status) && (
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-700">
                      Overdue
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                {task.status !== 'Completed' && (
                  <button
                    onClick={handleComplete}
                    className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                    title="Mark as complete"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Complete</span>
                  </button>
                )}
                {isTaskCreator() && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Edit task"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Description</h2>
              <p className="text-gray-900 whitespace-pre-wrap">{task.description}</p>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-500 mr-2">Due Date:</span>
                    <span className={isOverdue(task.dueDate, task.status) ? 'text-red-600 font-medium' : 'font-medium'}>
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-500 mr-2">Created:</span>
                    <span className="font-medium">{formatDate(task.createdAt)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-500 mr-2">Updated:</span>
                    <span className="font-medium">{formatDate(task.updatedAt)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">People</h3>
                <div className="space-y-2">
                  {task.creatorId && typeof task.creatorId === 'object' && (
                    <div className="flex items-center text-sm text-gray-600">
                      <UserPlus className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-500 mr-2">Creator:</span>
                      <span className="font-medium">{task.creatorId.email}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-500 mr-2">Assignee:</span>
                    <span className="font-medium">
                      {(typeof task.assignedToId === 'object' && task.assignedToId?.email)
                        ? task.assignedToId.email
                        : task.assignedTo?.email || 'Not assigned'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TaskModal
          task={task}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default TaskDetail;

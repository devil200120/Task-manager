import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Navbar from '../components/Navbar';
import { ArrowLeft, Calendar, AlertCircle } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { TaskPriority, TaskStatus } from '../types';
import { ToastContainer } from '../components/Toast';
import UserSearchDropdown from '../components/UserSearchDropdown';

const createTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  status: z.enum(['To Do', 'In Progress', 'Review', 'Completed']),
  assignedTo: z.string().email('Invalid email address').optional().or(z.literal('')),
  dueDate: z.string().min(1, 'Due date is required'),
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

const CreateTask: React.FC = () => {
  const navigate = useNavigate();
  const { createTask } = useTasks();
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      priority: 'Medium',
      status: 'To Do',
      assignedTo: '',
    },
  });

  const onSubmit = async (data: CreateTaskFormData) => {
    setLoading(true);

    try {
      await createTask({
        title: data.title,
        description: data.description,
        priority: data.priority as TaskPriority,
        status: data.status as TaskStatus,
        assignedTo: data.assignedTo || undefined,
        dueDate: new Date(data.dueDate).toISOString(),
      });
      addToast('Task created successfully!', 'success');
      setTimeout(() => navigate('/tasks'), 1000);
    } catch (err: any) {
      addToast(err.message || 'Failed to create task', 'error');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <Link to="/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create New Task</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">Add a new task to your workspace</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register('title')}
                type="text"
                id="title"
                className="input"
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={4}
                className="input"
                placeholder="Describe the task in detail"
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Priority and Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select {...register('priority')} id="priority" className="input">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
                {errors.priority && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.priority.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select {...register('status')} id="status" className="input">
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Completed">Completed</option>
                </select>
                {errors.status && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>

            {/* Assigned To and Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="assignedTo" className="block text-sm font-semibold text-gray-700 mb-2">
                  Assign To
                </label>
                <Controller
                  name="assignedTo"
                  control={control}
                  render={({ field }) => (
                    <UserSearchDropdown
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select a user to assign..."
                      error={errors.assignedTo?.message}
                    />
                  )}
                />
                <p className="mt-1 text-xs text-gray-500">Leave empty to assign to yourself</p>
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register('dueDate')}
                    type="date"
                    id="dueDate"
                    min={today}
                    className="input"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.dueDate && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.dueDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-1 sm:flex-initial"
              >
                {loading ? 'Creating...' : 'Create Task'}
              </button>
              <Link
                to="/dashboard"
                className="btn btn-secondary flex-1 sm:flex-initial text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;

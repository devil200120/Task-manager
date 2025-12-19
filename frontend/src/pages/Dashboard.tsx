import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../hooks/useTasks';
import { format } from 'date-fns';
import { CheckCircle, AlertCircle, User as UserIcon, Calendar, Plus, ArrowRight, ListChecks } from 'lucide-react';


const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { dashboard, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-xl w-80 mb-3"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-64 mb-10"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-44 bg-white rounded-2xl shadow-sm"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                Welcome back, <span className="text-primary-600">{user?.name?.split(' ')[0] || 'User'}</span>! 👋
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">Here's what's happening with your tasks today</p>
            </div>
            <Link
              to="/tasks/new"
              className="hidden sm:flex btn btn-primary items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Assigned to Me */}
          <div className="relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full -mr-12 -mt-12 opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div className="p-4 sm:p-5 relative">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">ACTIVE</span>
              </div>
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Assigned to Me</h3>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">{dashboard?.assignedTasks.length || 0}</p>
              <p className="text-xs text-gray-500">tasks pending</p>
            </div>
            <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          </div>

          {/* Created by Me */}
          <div className="relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full -mr-12 -mt-12 opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div className="p-4 sm:p-5 relative">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ListChecks className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">TOTAL</span>
              </div>
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Created by Me</h3>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">{dashboard?.createdTasks.length || 0}</p>
              <p className="text-xs text-gray-500">tasks created</p>
            </div>
            <div className="h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
          </div>

          {/* Overdue */}
          <div className="relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group sm:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full -mr-12 -mt-12 opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div className="p-4 sm:p-5 relative">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">URGENT</span>
              </div>
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Overdue Tasks</h3>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">{dashboard?.overdueTasks.length || 0}</p>
              <p className="text-xs text-gray-500">need attention</p>
            </div>
            <div className="h-1 bg-gradient-to-r from-red-400 to-red-600"></div>
          </div>
        </div>

        {/* Task Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Assigned Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">My Assigned Tasks</h2>
                    <p className="text-xs text-gray-500 hidden sm:block">Tasks assigned to you</p>
                  </div>
                </div>
                <span className="badge badge-primary text-xs px-2 py-1 flex-shrink-0">
                  {dashboard?.assignedTasks.length || 0}
                </span>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              {(dashboard?.assignedTasks.length || 0) === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-block p-3 bg-gray-100 rounded-xl mb-3">
                    <UserIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-base font-medium">No tasks assigned yet</p>
                  <p className="text-gray-400 text-xs mt-1">You're all caught up!</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3 max-h-[500px] overflow-y-auto">
                  {dashboard?.assignedTasks.slice(0, 10).map((task) => (
                    <Link
                      key={task._id}
                      to={`/tasks/${task._id}`}
                      className="block group"
                    >
                      <div className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200 bg-white">
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-1 flex-1">{task.title}</h3>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs px-2 py-1 rounded-md font-semibold ${
                            task.priority === 'Urgent' ? 'bg-red-100 text-red-700' :
                            task.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                            <span className="sm:hidden">{format(new Date(task.dueDate), 'MMM dd')}</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {(dashboard?.assignedTasks.length || 0) > 10 && (
                <Link to="/tasks" className="block mt-3 text-center text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700">
                  View all {dashboard?.assignedTasks.length} tasks →
                </Link>
              )}
            </div>
          </div>

          {/* Created Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
                    <ListChecks className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">My Created Tasks</h2>
                    <p className="text-xs text-gray-500 hidden sm:block">Tasks you created</p>
                  </div>
                </div>
                <span className="badge badge-success text-xs px-2 py-1 flex-shrink-0">
                  {dashboard?.createdTasks.length || 0}
                </span>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              {(dashboard?.createdTasks.length || 0) === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-block p-3 bg-gray-100 rounded-xl mb-3">
                    <ListChecks className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-base font-medium">No tasks created yet</p>
                  <p className="text-gray-400 text-xs mt-1">Create your first task!</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3 max-h-[500px] overflow-y-auto">
                  {dashboard?.createdTasks.slice(0, 10).map((task) => (
                    <Link
                      key={task._id}
                      to={`/tasks/${task._id}`}
                      className="block group"
                    >
                      <div className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-sm transition-all duration-200 bg-white">
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <h3 className="font-semibold text-gray-900 text-sm group-hover:text-green-600 transition-colors line-clamp-1 flex-1">{task.title}</h3>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs px-2 py-1 rounded-md font-semibold ${
                            task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            task.status === 'Review' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {task.status}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                            <span className="sm:hidden">{format(new Date(task.dueDate), 'MMM dd')}</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {(dashboard?.createdTasks.length || 0) > 10 && (
                <Link to="/tasks" className="block mt-3 text-center text-xs sm:text-sm font-semibold text-green-600 hover:text-green-700">
                  View all {dashboard?.createdTasks.length} tasks →
                </Link>
              )}
            </div>
          </div>

          {/* Overdue Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-red-50 to-white">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg flex-shrink-0">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">Overdue Tasks</h2>
                    <p className="text-xs text-gray-500 hidden sm:block">Tasks past due date</p>
                  </div>
                </div>
                <span className="badge badge-danger text-xs px-2 py-1 flex-shrink-0">
                  {dashboard?.overdueTasks.length || 0}
                </span>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              {(dashboard?.overdueTasks.length || 0) === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-block p-3 bg-green-100 rounded-xl mb-3">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <p className="text-gray-700 text-base font-medium">Great job!</p>
                  <p className="text-gray-500 text-xs mt-1">No overdue tasks 🎉</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3 max-h-[500px] overflow-y-auto">
                  {dashboard?.overdueTasks.slice(0, 10).map((task) => (
                    <Link
                      key={task._id}
                      to={`/tasks/${task._id}`}
                      className="block group"
                    >
                      <div className="p-3 sm:p-4 border border-red-200 rounded-lg hover:border-red-300 hover:shadow-sm transition-all duration-200 bg-red-50/30">
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <h3 className="font-semibold text-gray-900 text-sm group-hover:text-red-600 transition-colors line-clamp-1 flex-1">{task.title}</h3>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs px-2 py-1 rounded-md font-semibold ${
                            task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            task.status === 'Review' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {task.status}
                          </span>
                          <span className="text-xs text-red-600 flex items-center font-semibold">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Due </span>{format(new Date(task.dueDate), 'MMM dd')}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {(dashboard?.overdueTasks.length || 0) > 10 && (
                <Link to="/tasks" className="block mt-3 text-center text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700">
                  View all {dashboard?.overdueTasks.length} overdue tasks →
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Quick Action Button */}
        <div className="mt-6 sm:hidden">
          <Link
            to="/tasks/new"
            className="btn btn-primary w-full flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Task
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

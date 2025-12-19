import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Bell, Check, CheckCheck, ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

const Notifications: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, clearAll, isLoading } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_assigned':
        return '📋';
      case 'task_completed':
        return '✅';
      case 'task_updated':
        return '🔄';
      case 'task_deleted':
        return '🗑️';
      default:
        return '📬';
    }
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - notifDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return notifDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <Link to="/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-3 px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">Stay updated with your task activities</p>
            </div>
            {notifications.length > 0 && (
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="btn btn-secondary text-sm"
                  >
                    <CheckCheck className="w-4 h-4 mr-2" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="btn btn-secondary text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        {notifications.length > 0 && (
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm rounded-lg ${
                filter === 'all'
                  ? 'bg-primary-100 text-primary-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 text-sm rounded-lg ${
                filter === 'unread'
                  ? 'bg-primary-100 text-primary-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        )}

        {/* Notifications List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="inline-block p-4 bg-gray-50 rounded-2xl mb-4">
              <Bell className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'unread'
                ? "You're all caught up! Check back later for updates."
                : 'When you get new task updates, they will appear here.'}
            </p>
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Link
                key={notification._id}
                to={notification.task ? `/tasks/${notification.task}` : '#'}
                onClick={() => !notification.read && markAsRead(notification._id)}
                className={`block bg-white rounded-xl shadow-sm border p-4 transition-all ${
                  notification.read
                    ? 'border-gray-100 hover:border-gray-200'
                    : 'border-primary-200 bg-primary-50/30 hover:border-primary-300'
                } ${notification.task ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl shrink-0">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base text-gray-900 mb-1">{notification.message}</p>
                    <p className="text-xs text-gray-500">{formatTime(notification.createdAt)}</p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        markAsRead(notification._id);
                      }}
                      className="shrink-0 p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

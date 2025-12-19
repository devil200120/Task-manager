import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="inline-block relative">
            <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
              404
            </h1>
            <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-primary-600 to-purple-600"></div>
          </div>
        </div>

        {/* Icon */}
        <div className="mb-6">
          <div className="inline-block p-4 bg-gray-100 rounded-2xl">
            <Search className="w-16 h-16 text-gray-400" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/dashboard"
            className="btn btn-primary flex items-center justify-center min-w-[200px]"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-secondary flex items-center justify-center min-w-[200px]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:support@taskmanager.com" className="text-primary-600 hover:text-primary-700 font-semibold">
              support@taskmanager.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

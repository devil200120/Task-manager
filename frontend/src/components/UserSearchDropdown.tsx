import React, { useState, useEffect, useRef } from 'react';
import { Search, User, X, ChevronDown } from 'lucide-react';
import { apiClient } from '../lib/api';
import { User as UserType } from '../types';

interface UserSearchDropdownProps {
  onChange: (email: string) => void;
  placeholder?: string;
  error?: string;
}

const UserSearchDropdown: React.FC<UserSearchDropdownProps> = ({
  onChange,
  placeholder = 'Search user by name or email...',
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch all users on mount
  useEffect(() => {
    fetchUsers('');
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchUsers(searchQuery);
      } else {
        fetchUsers('');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchUsers = async (query: string) => {
    setLoading(true);
    try {
      const response = query.trim()
        ? await apiClient.searchUsers(query)
        : await apiClient.getAllUsers();
      
      if (response.success && response.data) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (user: UserType) => {
    setSelectedUser(user);
    onChange(user.email);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    setSelectedUser(null);
    onChange('');
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <div
          className={`input flex items-center justify-between cursor-pointer ${
            error ? 'border-red-500' : ''
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedUser ? (
            <div className="flex items-center gap-2 flex-1">
              <User className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{selectedUser.name}</div>
                <div className="text-xs text-gray-500">{selectedUser.email}</div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1 text-gray-400">
              <User className="w-4 h-4" />
              <span className="text-sm">{placeholder}</span>
            </div>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* User List */}
          <div className="overflow-y-auto max-h-48">
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No users found
              </div>
            ) : (
              users.map((user) => (
                <button
                  key={user.id || user.email}
                  type="button"
                  onClick={() => handleSelect(user)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default UserSearchDropdown;

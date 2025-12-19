import useSWR, { mutate } from 'swr';
import { Task, CreateTaskDto, UpdateTaskDto, DashboardData } from '../types';
import { apiClient } from '../lib/api';
import { useEffect } from 'react';
import { socketClient } from '../lib/socket';

const tasksFetcher = async (_url: string, params?: Record<string, string>): Promise<Task[]> => {
  const response = await apiClient.getTasks(params);
  return response.success ? response.data?.tasks || [] : [];
};

const dashboardFetcher = async (): Promise<DashboardData> => {
  const response = await apiClient.getDashboard();
  if (response.success && response.data) {
    return response.data;
  }
  return { assignedTasks: [], createdTasks: [], overdueTasks: [] };
};

/**
 * Hook for fetching and managing tasks
 */
export const useTasks = (params?: Record<string, string>) => {
  const { data, error, isLoading } = useSWR<Task[]>(
    ['/tasks', JSON.stringify(params)],
    () => tasksFetcher('/tasks', params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
    }
  );

  useEffect(() => {
    // Listen for real-time updates
    const unsubscribeCreated = socketClient.on('taskCreated', () => {
      mutate(['/tasks', JSON.stringify(params)]);
      mutate('/tasks/dashboard');
    });

    const unsubscribeUpdated = socketClient.on('taskUpdated', () => {
      mutate(['/tasks', JSON.stringify(params)]);
      mutate('/tasks/dashboard');
    });

    const unsubscribeDeleted = socketClient.on('taskDeleted', () => {
      mutate(['/tasks', JSON.stringify(params)]);
      mutate('/tasks/dashboard');
    });

    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeDeleted();
    };
  }, [params]);

  const createTask = async (data: CreateTaskDto) => {
    const response = await apiClient.createTask(data);
    if (response.success) {
      // Optimistic update
      mutate(['/tasks', JSON.stringify(params)]);
      mutate('/tasks/dashboard');
    }
    return response;
  };

  const updateTask = async (id: string, data: UpdateTaskDto) => {
    const response = await apiClient.updateTask(id, data);
    if (response.success) {
      // Optimistic update
      mutate(['/tasks', JSON.stringify(params)]);
      mutate('/tasks/dashboard');
    }
    return response;
  };

  const deleteTask = async (id: string) => {
    const response = await apiClient.deleteTask(id);
    if (response.success) {
      // Optimistic update
      mutate(['/tasks', JSON.stringify(params)]);
      mutate('/tasks/dashboard');
    }
    return response;
  };

  return {
    tasks: data || [],
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
  };
};

/**
 * Hook for fetching dashboard data
 */
export const useDashboard = () => {
  const { data, error, isLoading } = useSWR<DashboardData>(
    '/tasks/dashboard',
    dashboardFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
    }
  );

  useEffect(() => {
    // Listen for real-time updates to refresh dashboard
    const unsubscribeCreated = socketClient.on('taskCreated', () => {
      mutate('/tasks/dashboard');
    });

    const unsubscribeUpdated = socketClient.on('taskUpdated', () => {
      mutate('/tasks/dashboard');
    });

    const unsubscribeDeleted = socketClient.on('taskDeleted', () => {
      mutate('/tasks/dashboard');
    });

    const unsubscribeAssigned = socketClient.on('taskAssigned', () => {
      mutate('/tasks/dashboard');
    });

    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeDeleted();
      unsubscribeAssigned();
    };
  }, []);

  return {
    dashboard: data,
    isLoading,
    error,
  };
};

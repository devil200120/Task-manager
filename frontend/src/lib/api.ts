import { 
  ApiResponse, 
  User, 
  Task, 
  CreateTaskDto, 
  UpdateTaskDto, 
  RegisterDto, 
  LoginDto,
  DashboardData 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * API Client for making HTTP requests
 */
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Make a fetch request with credentials
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'An error occurred',
          errors: data.errors,
        };
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Auth APIs
  async register(data: RegisterDto): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginDto): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getMe(): Promise<ApiResponse<{ user: User }>> {
    return this.request('/auth/me');
  }

  async updateProfile(data: { 
    name: string; 
    email: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<ApiResponse<{ user: User; token?: string }>> {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Task APIs
  async getTasks(params?: Record<string, string>): Promise<ApiResponse<{ tasks: Task[]; count: number }>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/tasks${queryString}`);
  }

  async getTask(id: string): Promise<ApiResponse<{ task: Task }>> {
    return this.request(`/tasks/${id}`);
  }

  async createTask(data: CreateTaskDto): Promise<ApiResponse<{ task: Task }>> {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: string, data: UpdateTaskDto): Promise<ApiResponse<{ task: Task }>> {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: string): Promise<ApiResponse> {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async getDashboard(): Promise<ApiResponse<DashboardData>> {
    return this.request('/tasks/dashboard');
  }

  // User APIs
  async searchUsers(query: string): Promise<ApiResponse<{ users: User[] }>> {
    return this.request(`/users/search?q=${encodeURIComponent(query)}`);
  }

  async getAllUsers(): Promise<ApiResponse<{ users: User[] }>> {
    return this.request('/users');
  }
}

export const apiClient = new ApiClient();

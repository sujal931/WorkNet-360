
import { toast } from "sonner";

// Base API URL
const API_URL = "http://localhost:5000/api";

// Get token from local storage
const getToken = (): string | null => {
  return localStorage.getItem('worknet360_token');
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = data.message || response.statusText;
    toast.error(error);
    throw new Error(error);
  }
  return data;
};

// Create headers with authentication token
const createHeaders = (includeToken: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  if (includeToken) {
    const token = getToken();
    if (token) {
      return {
        ...headers,
        'x-auth-token': token
      };
    }
  }

  return headers;
};

// API Service
export const apiService = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: createHeaders(false),
        body: JSON.stringify({ email, password })
      });
      return handleResponse(response);
    },
    getCurrentUser: async () => {
      const response = await fetch(`${API_URL}/auth/user`, {
        headers: createHeaders()
      });
      return handleResponse(response);
    },
    createEmployee: async (employeeData: any) => {
      const response = await fetch(`${API_URL}/auth/create-employee`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(employeeData)
      });
      return handleResponse(response);
    }
  },

  // Employees endpoints
  employees: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/employees`, {
        headers: createHeaders()
      });
      return handleResponse(response);
    },
    getById: async (id: string) => {
      const response = await fetch(`${API_URL}/employees/${id}`, {
        headers: createHeaders()
      });
      return handleResponse(response);
    },
    update: async (id: string, employeeData: any) => {
      const response = await fetch(`${API_URL}/employees/${id}`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(employeeData)
      });
      return handleResponse(response);
    }
  },

  // Leave requests endpoints
  leaves: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/leaves`, {
        headers: createHeaders()
      });
      return handleResponse(response);
    },
    getHistory: async () => {
      const response = await fetch(`${API_URL}/leaves/history`, {
        headers: createHeaders()
      });
      return handleResponse(response);
    },
    getById: async (id: string) => {
      const response = await fetch(`${API_URL}/leaves/${id}`, {
        headers: createHeaders()
      });
      return handleResponse(response);
    },
    create: async (leaveData: any) => {
      const response = await fetch(`${API_URL}/leaves`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(leaveData)
      });
      return handleResponse(response);
    },
    approve: async (id: string, comments?: string) => {
      const response = await fetch(`${API_URL}/leaves/${id}/approve`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify({ comments })
      });
      return handleResponse(response);
    },
    reject: async (id: string, comments?: string) => {
      const response = await fetch(`${API_URL}/leaves/${id}/reject`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify({ comments })
      });
      return handleResponse(response);
    },
    cancel: async (id: string) => {
      const response = await fetch(`${API_URL}/leaves/${id}/cancel`, {
        method: 'PUT',
        headers: createHeaders()
      });
      return handleResponse(response);
    }
  },

  // Tasks endpoints
  tasks: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/tasks`, {
        headers: createHeaders()
      });
      return handleResponse(response);
    },
    getById: async (id: string) => {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        headers: createHeaders()
      });
      return handleResponse(response);
    },
    create: async (taskData: any) => {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(taskData)
      });
      return handleResponse(response);
    },
    update: async (id: string, taskData: any) => {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(taskData)
      });
      return handleResponse(response);
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: createHeaders()
      });
      return handleResponse(response);
    }
  },

  // Attendance endpoints
  attendance: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/attendance`, {
        headers: createHeaders()
      });
      return handleResponse(response);
    },
    checkIn: async () => {
      const response = await fetch(`${API_URL}/attendance/check-in`, {
        method: 'POST',
        headers: createHeaders()
      });
      return handleResponse(response);
    },
    checkOut: async () => {
      const response = await fetch(`${API_URL}/attendance/check-out`, {
        method: 'POST',
        headers: createHeaders()
      });
      return handleResponse(response);
    }
  },

  // HR specific endpoints
  hr: {
    getPendingApprovals: async () => {
      const response = await fetch(`${API_URL}/hr/pending-approvals`, {
        headers: createHeaders()
      });
      return handleResponse(response);
    }
  },

  // Admin specific endpoints
  admin: {
    getHRLeaveRequests: async () => {
      const response = await fetch(`${API_URL}/admin/hr-leave-requests`, {
        headers: createHeaders()
      });
      return handleResponse(response);
    },
    getPayrollOverview: async () => {
      const response = await fetch(`${API_URL}/admin/payroll-overview`, {
        headers: createHeaders()
      });
      return handleResponse(response);
    }
  }
};

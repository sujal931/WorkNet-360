
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { apiService } from '@/services/api';

export type UserRole = 'admin' | 'hr' | 'employee';
export type UserStatus = 'approved' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  department?: string;
  position?: string;
  dateOfBirth?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes - will be used as fallback if API is not available
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@worknet360.com',
    password: 'admin123',
    role: 'admin' as UserRole,
    status: 'approved' as UserStatus,
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0F62FE&color=fff',
    department: 'Executive',
    position: 'Chief Administrator',
  },
  {
    id: '2',
    name: 'HR Manager',
    email: 'hr@worknet360.com',
    password: 'hr123',
    role: 'hr' as UserRole,
    status: 'approved' as UserStatus,
    avatar: 'https://ui-avatars.com/api/?name=HR+Manager&background=0F62FE&color=fff',
    department: 'Human Resources',
    position: 'HR Director',
  },
  {
    id: '3',
    name: 'John Employee',
    email: 'employee@worknet360.com',
    password: 'employee123',
    role: 'employee' as UserRole,
    status: 'approved' as UserStatus,
    avatar: 'https://ui-avatars.com/api/?name=John+Employee&background=0F62FE&color=fff',
    department: 'Engineering',
    position: 'Software Developer',
  },
  // EMS dummy credentials
  {
    id: '4',
    name: 'EMS Admin',
    email: 'admin@ems.com',
    password: 'admin123',
    role: 'admin' as UserRole,
    status: 'approved' as UserStatus,
    avatar: 'https://ui-avatars.com/api/?name=EMS+Admin&background=0F62FE&color=fff',
    department: 'Executive',
    position: 'Chief Administrator',
  },
  {
    id: '5',
    name: 'EMS HR',
    email: 'hr@ems.com',
    password: 'hr123',
    role: 'hr' as UserRole,
    status: 'approved' as UserStatus,
    avatar: 'https://ui-avatars.com/api/?name=EMS+HR&background=0F62FE&color=fff',
    department: 'Human Resources',
    position: 'HR Director',
  },
  {
    id: '6',
    name: 'EMS Employee',
    email: 'employee@ems.com',
    password: 'employee123',
    role: 'employee' as UserRole,
    status: 'approved' as UserStatus,
    avatar: 'https://ui-avatars.com/api/?name=EMS+Employee&background=0F62FE&color=fff',
    department: 'Engineering',
    position: 'Software Developer',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      
      const token = localStorage.getItem('worknet360_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Try to get user from API
        const userData = await apiService.auth.getCurrentUser();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
        // If API fails, check for stored user as fallback
        const storedUser = localStorage.getItem('worknet360_user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error('Failed to parse stored user', error);
            localStorage.removeItem('worknet360_user');
            localStorage.removeItem('worknet360_token');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // First try API login
      const response = await apiService.auth.login(email, password);
      
      if (response && response.token && response.user) {
        setUser(response.user);
        localStorage.setItem('worknet360_token', response.token);
        localStorage.setItem('worknet360_user', JSON.stringify(response.user));
        toast.success(`Welcome back, ${response.user.name}!`);
        return;
      }
    } catch (error) {
      console.error('API Login failed, trying mock login', error);
      
      // If API is not available, fall back to mock login for development
      // This will be removed in production
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        // Remove password before storing
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        
        // Store a fake token for development
        const mockToken = `mock-token-${Date.now()}`;
        localStorage.setItem('worknet360_token', mockToken);
        localStorage.setItem('worknet360_user', JSON.stringify(userWithoutPassword));
        
        toast.success(`Welcome back, ${foundUser.name}! (Using mock login)`);
      } else {
        toast.error("Invalid email or password");
        throw new Error('Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('worknet360_token');
    localStorage.removeItem('worknet360_user');
    toast.info("You've been logged out");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define user type
interface User {
  id: string;
  name: string;
  email: string;
}

// Define auth context state
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  error: null
});

// API base URL - make sure to update this to match your backend URL
const API_URL = import.meta.env.API_URL || 'https://chatbot-vplp.onrender.com';
console.log(API_URL);

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from local storage on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        
        if (!storedToken) {
          setIsLoading(false);
          return;
        }
        
        setToken(storedToken);
        
        // Fetch user data from the server
        const response = await fetch(`${API_URL}/api/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Session expired');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setUser(data.data);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Register user
  const register = async (name: string, email: string, password: string) => {
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Store token in local storage
      localStorage.setItem('token', data.token);
      
      // Update state
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token in local storage
      localStorage.setItem('token', data.token);
      
      // Update state
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      // Call logout endpoint for server cleanup (if needed)
      if (token) {
        await fetch(`${API_URL}/api/logout`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      // Clear token from local storage
      localStorage.removeItem('token');
      
      // Update state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
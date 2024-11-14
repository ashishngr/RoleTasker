import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import StorageUtils from '../utils/storage_utils';

// Define User type
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

// Define context structure
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  loggedIn: boolean;
  signUp: (userData: User, token: string) => Promise<void>;
  signIn: (userData: User, token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: false,
  loggedIn: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const loadAuthData = async () => {
      setLoading(true);
      const storedToken = await StorageUtils.getAPIToken();
      const storedUser = await StorageUtils.getUserProfile();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        setLoggedIn(true);
      }
      setLoading(false);
    };

    loadAuthData();
  }, []);

  const signUp = async (userData: User, authToken: string) => {
    await StorageUtils.setUserProfile(userData);
    await StorageUtils.setAPIToken(authToken);
    setUser(userData);
    setToken(authToken);
    setLoggedIn(true);
  };

  const signIn = async (userData: User, authToken: string) => {
    await StorageUtils.setUserProfile(userData);
    await StorageUtils.setAPIToken(authToken);
    setUser(userData);
    setToken(authToken);
    setLoggedIn(true);
  };

  const signOut = async () => {
    await StorageUtils.removeAll();
    setUser(null);
    setToken(null);
    setLoggedIn(false);
  };

  const contextValue: AuthContextType = { 
    user, 
    token, 
    loading, 
    loggedIn, 
    signUp, 
    signIn, 
    signOut 
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

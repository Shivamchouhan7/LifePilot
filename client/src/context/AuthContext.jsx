import React, { createContext, useContext, useState, useEffect } from 'react';

const AUTH_STORAGE_KEY = 'lifepilot:auth_token';
const USER_STORAGE_KEY = 'lifepilot:user';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  updateProfile: () => {},
  logout: () => {},
});

const DEFAULT_DEMO_USER = {
  id: 'usr_demo_01',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  role: 'Staff Frontend Engineer',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem(AUTH_STORAGE_KEY);
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (token) {
        setUser(storedUser ? JSON.parse(storedUser) : DEFAULT_DEMO_USER);
      }
    } catch (e) {
      console.error('Error reading auth state:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email = 'alex.morgan@example.com', _password = 'password') => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 200));
    const token = `fake-jwt-token.${btoa(JSON.stringify({ email, exp: Date.now() + 86400000 }))}.sig`;
    const loggedUser = {
      id: 'usr_demo_01',
      name: email.split('@')[0].replace('.', ' '),
      email,
      role: 'Staff Frontend Engineer',
    };
    localStorage.setItem(AUTH_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
    setUser(loggedUser);
    setIsLoading(false);
    return loggedUser;
  };

  const register = async (userData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 200));
    return login(userData.email || 'alex.morgan@example.com', userData.password);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  const updateProfile = (profile) => {
    if (!user) return;
    const updatedUser = { ...user, ...profile, email: user.email };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

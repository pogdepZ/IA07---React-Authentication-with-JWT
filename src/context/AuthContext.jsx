import React, { createContext, useContext, useEffect, useState } from 'react';
import { setAccessToken } from '../api/axios';
import apiClient from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      
      if (storedRefreshToken) {
        try {
          const { data } = await apiClient.post('/auth/refresh', { refreshToken: storedRefreshToken });
          setAccessToken(data.accessToken);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Session expired", error);
          localStorage.removeItem('refreshToken');
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (accessToken, refreshToken) => {
    setAccessToken(accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
  };

  if (isLoading) return <div>Loading Auth...</div>;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
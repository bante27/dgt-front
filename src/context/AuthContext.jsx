import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const res = await authAPI.getProfile();
          setUser(res.data);
        } catch (err) {
          if (err.response?.status === 401) {
            console.warn('Session expired or unauthorized.');
          } else {
            console.error('Failed to fetch user profile', err);
          }
          logout();
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [token]);

  const login = async (credentials) => {
    const res = await authAPI.login(credentials);
    const { token: jwtToken, user: userData } = res.data;
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    return res.data;
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    const { token: jwtToken, user: newUser } = res.data;
    if (jwtToken) {
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      setUser(newUser);
    }
    return res.data;
  };

  const googleLogin = async (googleToken) => {
    const res = await authAPI.googleAuth(googleToken);
    const { token: jwtToken, user: userData } = res.data || res;
    if (jwtToken) {
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      setUser(userData);
    }
    return res.data || res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    if (token) {
      try {
        const res = await authAPI.getProfile();
        setUser(res.data);
      } catch (err) {
        console.error('Failed to refresh profile', err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, googleLogin, logout, refreshProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      token: null,
      login: async () => {},
      register: async () => {},
      googleLogin: async () => {},
      logout: () => {},
      refreshProfile: async () => {},
      loading: false
    };
  }
  return context;
};

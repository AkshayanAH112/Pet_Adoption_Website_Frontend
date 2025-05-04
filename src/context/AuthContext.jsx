import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        logout();
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid server response');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      setIsAuthenticated(true);
      
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'shelter') {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      
      // Log the error
      console.error('Login error:', {
        message: errorMessage,
        status: error.response?.status
      });

      // Throw a user-friendly error
      throw new Error(errorMessage);
    }
  };

  const signup = async (username, email, password, role) => {
    try {
      // Validate input
      if (!username || !email || !password || !role) {
        throw new Error('All fields are required');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      // Password strength check
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Log the exact data being sent for debugging
      console.log('Signup data being sent:', { username, email, password: '********', role });
      
      const response = await api.post('/auth/signup', { 
        username, 
        email, 
        password, 
        role 
      });
      
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid server response');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      setIsAuthenticated(true);
      
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'shelter') {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Signup failed';
      
      // Log the error
      console.error('Signup error:', {
        message: errorMessage,
        status: error.response?.status
      });

      // Throw a user-friendly error
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const updateUserProfile = async (profileData) => {
    try {
      // Make API call to update user profile
      const response = await api.put('/users/profile', profileData);
      
      if (response.data && response.data.user) {
        // Update local storage with the updated user data
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Update state
        setUser(response.data.user);
        
        return response.data.user;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      signup, 
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

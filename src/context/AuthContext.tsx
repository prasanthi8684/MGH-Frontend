import axios from 'axios';
import React, { createContext, useContext, useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (bussinessemail: string, password: string) => Promise<void>;
  logout: () => void;
  user: any;
  resetPassword: (email: string) => Promise<void>;
  completePasswordReset: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

interface User {
  id: string;
  email: string;
  name: string;
  token:string;
  avatar?: string;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
   
    if (token) {
      // Verify token and get user data
     // fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);
 const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get('http://143.198.212.38:5000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // If token is invalid, remove it
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  const login = async (bussinessemail: string, password: string) => {
    // Simulate API call - replace with your actual login logic
    const formData = {
        bussinessemail,
        password
    }
    const response = await fetch('http://143.198.212.38:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        //setResponseMessage('Registration successful!');
//alert('Login successful!')
        localStorage.setItem('token',data.token);
        localStorage.setItem('name', data.name);
        localStorage.setItem('userId', data.id);
        localStorage.setItem('email', data.email);
        setUser(data);
        setIsAuthenticated(true);
      } else {
        const errorData = await response.json();
        setIsAuthenticated(false);
        throw new Error('Invalid email or password');
       // setResponseMessage(`Error: ${errorData.message}`);
      }
      
    
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
   // navigate('/login', { replace: true });
  };
  const resetPassword = async (email: string) => {
    // Simulate API call - replace with your actual password reset logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real application, this would send a password reset email
    if (!email) {
      throw new Error('Email is required');
    }
    // For demo purposes, we'll just return successfully
    return;
  };

  const completePasswordReset = async (token: string, newPassword: string) => {
    // Simulate API call - replace with your actual password reset completion logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!token || !newPassword) {
      throw new Error('Token and new password are required');
    }

    // In a real application, you would:
    // 1. Verify the token is valid and not expired
    // 2. Hash the new password
    // 3. Update the user's password in the database
    // 4. Invalidate the reset token
    
    // For demo purposes, we'll just return successfully
    return;
  };


  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await axios.put(
        'http://143.198.212.38:5000/api/auth/profile',
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setUser(response.data);
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  };
  return (
    <AuthContext.Provider value={{ user,isAuthenticated,updateProfile, login, logout, resetPassword, completePasswordReset }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  
   if (context === undefined ) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  if(localStorage.getItem('token')){
    context.isAuthenticated = true;
  }
  
  return context;
}
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (bussinessemail: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  completePasswordReset: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const login = async (bussinessemail: string, password: string) => {
    // Simulate API call - replace with your actual login logic
    const formData = {
        bussinessemail,
        password
    }
    const response = await fetch('http://139.59.76.86:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        //setResponseMessage('Registration successful!');
        alert('Login successful!')
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data._id);
        localStorage.setItem('email', data.email);
        setIsAuthenticated(true);
      } else {
        const errorData = await response.json();
        setIsAuthenticated(false);
        throw new Error('Invalid email or password');
       // setResponseMessage(`Error: ${errorData.message}`);
      }
      
    
  };

  const logout = () => {
    setIsAuthenticated(false);
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

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, resetPassword, completePasswordReset }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
 // const token = localStorage.getItem('token');
   if (context === undefined ) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  if(localStorage.getItem('token')){
    context.isAuthenticated = true;
  }
  
  return context;
}
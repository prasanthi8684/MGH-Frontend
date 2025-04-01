import React from 'react';
import { BrowserRouter as Router , Routes, Route  } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { Footer } from './components/Footer';
import { Login } from './components/auth/Login';
import {Register} from './components/auth/Register'
import { ForgotPassword  } from './components/auth/ForgotPassword';
import { ResetPassword  } from './components/auth/ResetPassword';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return (
      <Router>
       <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <MainContent />
        </div>
        <Footer />
      </div>
    </Router>
  );
}
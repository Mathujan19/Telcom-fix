import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import NocLayout from './pages/noc/NocLayout';
import AdminLayout from './pages/admin/AdminLayout';
import './index.css';

function AppRoutes() {
  const { state } = useApp();

  if (!state.role) return <LoginPage />;
  if (state.role === 'noc') return <NocLayout />;
  if (state.role === 'admin') return <AdminLayout />;
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;

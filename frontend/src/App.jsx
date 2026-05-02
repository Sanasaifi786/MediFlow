import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Assistant from './pages/Assistant';
import Logs from './pages/Logs';
import Report from './pages/Report';
import Login from './pages/Login';

// A simple protected route wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      {/* Home path hits the login form. If already logged in, skip to /app */}
      <Route 
        path="/" 
        element={localStorage.getItem("token") ? <Navigate to="/app" replace /> : <Login />} 
      />
      
      {/* Protected routes are nested under /app */}
      <Route path="/app" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Assistant />} />
        <Route path="logs" element={<Logs />} />
        <Route path="reports" element={<Report />} />
      </Route>
    </Routes>
  );
}

export default App;
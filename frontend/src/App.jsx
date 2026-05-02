import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Assistant from './pages/Assistant';
import Logs from './pages/Logs';
import Report from './pages/Report';
import AddEmployee from './pages/AddEmployee';
import PromptManager from './pages/PromptManager';
import NursePortal from './pages/NursePortal';
import Claims from './pages/Claims';
import Inventory from './pages/Inventory';
import Login from './pages/Login';
import PatientRegistration from './pages/PatientRegistration';

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
        <Route index element={<Dashboard />} />
        <Route path="assistant" element={<Assistant />} />
        <Route path="logs" element={<Logs />} />
        <Route path="reports" element={<Report />} />
        <Route path="staff" element={<AddEmployee />} />
        <Route path="prompts" element={<PromptManager />} />
        <Route path="nurse" element={<NursePortal />} />
        <Route path="claims" element={<Claims />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="receptionist" element={<PatientRegistration />} />
      </Route>
    </Routes>
  );
}

export default App;
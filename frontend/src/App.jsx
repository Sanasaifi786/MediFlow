import React from 'react';
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

// Re-evaluated on every render — never goes stale
const isAuthenticated = () => !!localStorage.getItem("token");

// If logged in, redirect to app. Otherwise show login page.
const AuthRoute = () => isAuthenticated() ? <Navigate to="/app" replace /> : <Login />;

// If NOT logged in, redirect to login page.
const ProtectedRoute = ({ children }) => isAuthenticated() ? children : <Navigate to="/" replace />;

function App() {
  return (
    <Routes>
      {/* Home path hits the login form. If already logged in, skip to /app */}
      <Route path="/" element={<AuthRoute />} />

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
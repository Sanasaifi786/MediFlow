import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Assistant from './pages/Assistant';
import Logs from './pages/Logs';
import Report from './pages/Report';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Assistant />} />
        <Route path="logs" element={<Logs />} />
        <Route path="reports" element={<Report />} />
      </Route>
    </Routes>
  );
}

export default App;
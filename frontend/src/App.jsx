import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Insurance from './pages/Insurance';
import Discharge from './pages/Discharge';
import Inventory from './pages/Inventory';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="insurance" element={<Insurance />} />
        <Route path="discharge" element={<Discharge />} />
        <Route path="inventory" element={<Inventory />} />
      </Route>
    </Routes>
  );
}

export default App;

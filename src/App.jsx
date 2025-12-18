import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';

// Import SEMUA halaman
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import MachineDetail from './pages/MachineDetail';
import Reports from './pages/Reports';
import MachineFleet from './pages/MachineFleet';
import Settings from './pages/Settings'; 
import Charts from './pages/Chart';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fleet" element={<MachineFleet />} />
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/machine/:id" element={<MachineDetail />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/settings" element={<Settings />} />
          
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
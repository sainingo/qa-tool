import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UpdateRTC from './pages/UpdateRTC';
import RebuildPatient from './pages/RebuildPatient';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/update-rtc" element={<UpdateRTC />} />
          <Route path="/rebuild-patient" element={<RebuildPatient />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
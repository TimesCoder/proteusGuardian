import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Context
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainLayout from "./components/Layout/MainLayout";

// Layouts & Pages
import LandingPage from "./pages/LandingPage";
import Documentation from "./pages/Documentation";
import AboutUs from "./pages/AboutUs";

// Import Pages
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import MachineDetail from "./pages/MachineDetail";
import Reports from "./pages/Reports";
import MachineFleet from "./pages/MachineFleet";
import Settings from "./pages/Settings";
import Charts from "./pages/Chart";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth(); 

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-dark-900 text-white">Loading...</div>; 
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  return <MainLayout>{children}</MainLayout>;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/docs" element={<Documentation />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fleet"
            element={
              <ProtectedRoute>
                <MachineFleet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/machine/:id"
            element={
              <ProtectedRoute>
                <MachineDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/charts"
            element={
              <ProtectedRoute>
                <Charts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Overview from "./pages/Overview";
import ProtectedRoute from "./components/ProtectedRoute";
import AgriServices from "./pages/AgriServices";
import DiseaseDetector from "./pages/DiseaseDetector";
import SoilReport from "./pages/SoilReport";
import EquipmentRental from "./pages/EquipmentRental";
import Insurance from "./pages/Insurance";
import Finance from "./pages/Finance";
import Marketplace from "./pages/Marketplace";

import FloatingChatWidget from "./components/FloatingChatWidget";

/* 🔥 LEARN HUB */
import LearnHub from "./pages/LearnHub";
import VideoDetail from "./pages/VideoDetail";
import FarmerProfile from "./pages/FarmerProfile";
import AdminPanel from "./pages/AdminPanel";
import RoleGuard from "./components/RoleGuard";
import UploadVideo from "./pages/UploadVideo";

import BackToTop from "./components/BackToTop";
import ThemeProvider from "./context/ThemeContext";

import AddEquipmentPage from "./pages/AddEquipmentPage";
import FarmingInsights from "./pages/FarmingInsights";


import Auth from "./pages/Auth";

/* ===============================
   AXIOS GLOBAL SETUP
================================= */

import axios from "axios";

axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function App() {
  return (
    <ThemeProvider>
      <>
        <Routes>

          {/* ===============================
              PUBLIC ROUTES
          =============================== */}

          <Route path="/" element={<Overview />} />
          <Route path="/auth" element={<Auth />} />

         
          {/* ===============================
              DASHBOARD
          =============================== */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ===============================
              AGRI SERVICES
          =============================== */}

          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <AgriServices />
              </ProtectedRoute>
            }
          />

          <Route
            path="/services/rental"
            element={
              <ProtectedRoute>
                <EquipmentRental />
              </ProtectedRoute>
            }
          />

          <Route
            path="/services/rental/add"
            element={
              <ProtectedRoute>
                <AddEquipmentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/services/insurance"
            element={
              <ProtectedRoute>
                <Insurance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/services/finance"
            element={
              <ProtectedRoute>
                <Finance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/services/marketplace"
            element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            }
          />

          {/* ===============================
              AI TOOLS
          =============================== */}

          <Route
            path="/disease-detector"
            element={
              <ProtectedRoute>
                <DiseaseDetector />
              </ProtectedRoute>
            }
          />

          <Route
            path="/soil-report"
            element={
              <ProtectedRoute>
                <SoilReport />
              </ProtectedRoute>
            }
          />

          {/* ===============================
              LEARN HUB
          =============================== */}

          <Route
            path="/learn"
            element={
              <ProtectedRoute>
                <LearnHub />
              </ProtectedRoute>
            }
          />

          <Route
            path="/video/:id"
            element={
              <ProtectedRoute>
                <VideoDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <FarmerProfile />
              </ProtectedRoute>
            }
          />

          {/* ===============================
              ADMIN PANEL
          =============================== */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleGuard role="admin">
                  <AdminPanel />
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload-video"
            element={
              <ProtectedRoute>
                <UploadVideo />
              </ProtectedRoute>
            }
          />

          {/* ===============================
              FARMING INSIGHTS
          =============================== */}

          <Route
            path="/insights"
            element={
              <ProtectedRoute>
                <FarmingInsights />
              </ProtectedRoute>
            }
          />

          {/* ===============================
              FALLBACK ROUTE
          =============================== */}

          <Route path="*" element={<Overview />} />

        </Routes>

        {/* GLOBAL COMPONENTS */}

        <FloatingChatWidget />
        <BackToTop />

      </>
    </ThemeProvider>
  );
}

export default App;
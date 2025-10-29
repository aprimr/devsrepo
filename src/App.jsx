import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/AuthStore";
import { Toaster } from "sonner";

// Pages
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/auth/Login";
import Footer from "./components/Footer";
import PageNotFound from "./pages/others/PageNotFound";
import Onboarding from "./pages/others/Onboarding";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import Setting from "./pages/settings/Settings";
import EditProfile from "./pages/profile/EditProfile";
import SettingsProfile from "./pages/settings/account/SettingsProfile";
import SettingsSecurity from "./pages/settings/account/SettingsSecurity";
import SettingsPrivacy from "./pages/settings/account/SettingsPrivacy";
import SettingsStatus from "./pages/settings/account/SettingsStatus";
import SettingsNotifications from "./pages/settings/preferences/SettingsNotifications";
import SettingsEmail from "./pages/settings/preferences/SettingsEmail";
import SettingsDeveloperAccount from "./pages/settings/developer/DeveloperAccount";

function AppContent() {
  const location = useLocation();
  const hideNavbarFooterRoutes = [
    "/login",
    "/onboarding",
    "/edit-profile",
    "/setting",
    "/setting-profile",
    "/setting-security",
    "/setting-privacy",
    "/setting-status",
    "/setting-notifications",
    "/setting-email",
    "/setting-developer-account",
  ];
  const hideNavbarFooter = hideNavbarFooterRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 select-none">
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setting"
          element={
            <ProtectedRoute>
              <Setting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setting-profile"
          element={
            <ProtectedRoute>
              <SettingsProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setting-security"
          element={
            <ProtectedRoute>
              <SettingsSecurity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setting-privacy"
          element={
            <ProtectedRoute>
              <SettingsPrivacy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setting-status"
          element={
            <ProtectedRoute>
              <SettingsStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setting-notifications"
          element={
            <ProtectedRoute>
              <SettingsNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setting-email"
          element={
            <ProtectedRoute>
              <SettingsEmail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setting-developer-account"
          element={
            <ProtectedRoute>
              <SettingsDeveloperAccount />
            </ProtectedRoute>
          }
        />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      {!hideNavbarFooter && <Footer />}
    </div>
  );
}

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [initializeAuth]);

  return (
    <Router>
      <AppContent />
      <Toaster position="top-right" theme="light" />
    </Router>
  );
}

export default App;

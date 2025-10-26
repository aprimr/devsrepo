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

function AppContent() {
  const location = useLocation();
  const hideNavbarFooterRoutes = ["/login", "/onboarding"];
  const hideNavbarFooter = hideNavbarFooterRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
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
          path="/setting"
          element={
            <ProtectedRoute>
              <Setting />
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

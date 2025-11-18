import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";
import { useSystemStore } from "../../store/SystemStore";

function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { isListening, startRealtimeSystem } = useSystemStore();

  // Realtime subscription
  useEffect(() => {
    if (!isListening) startRealtimeSystem();
  }, [isListening, startRealtimeSystem]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-600 font-poppins text-md">Loading...</p>
      </div>
    );
  }
  const isAdmin = user?.system?.isAdmin;

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;

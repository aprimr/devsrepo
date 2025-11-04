import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";

function DeveloperRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const isDeveloper = user.developerProfile.isDeveloper;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-600 font-poppins text-md">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isDeveloper) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default DeveloperRoute;

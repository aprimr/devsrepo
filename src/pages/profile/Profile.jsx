import {
  Mail,
  Calendar,
  MapPin,
  Download,
  Star,
  Code2,
  Users,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../../store/AuthStore";

function Profile() {
  const { user, logout } = useAuthStore();

  // Mock data for user stats
  const userStats = {
    appsDownloaded: 24,
    appsPublished: 3,
    totalDownloads: 1500,
    averageRating: 4.7,
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-inter">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Profile Header with Gradient */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-8 sm:p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:gap-8">
              {/* Avatar Section */}
              <div className="flex-shrink-0">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold border-4 border-white shadow-lg">
                    {user.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>

              {/* User Information */}
              <div className="flex-1 text-center sm:text-left">
                <div className="mb-4 lg:mb-6">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-poppins font-bold text-gray-900 mb-2">
                    {user.name}
                  </h1>
                  <p className="text-lg text-gray-600 font-inter mb-3">
                    @{user.username}
                  </p>
                  <button onClick={() => logout()}>
                    <LogOut />
                  </button>

                  {user.bio && (
                    <p className="text-gray-700 font-inter leading-relaxed text-sm sm:text-base max-w-2xl">
                      {user.bio}
                    </p>
                  )}
                </div>

                {/* User Metadata */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 lg:gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <Mail size={16} className="text-green-600" />
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <Calendar size={16} className="text-green-600" />
                    <span className="font-medium">
                      Joined {formatDate(user.createdAt)}
                    </span>
                  </div>
                  {user.country && (
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                      <MapPin size={16} className="text-green-600" />
                      <span className="font-medium">{user.country}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

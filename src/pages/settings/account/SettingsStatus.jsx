import {
  ChevronLeft,
  Shield,
  AlertCircle,
  Clock,
  LogIn,
  Calendar,
  ShieldUser,
  Edit,
  Flag,
} from "lucide-react";
import { useAuthStore } from "../../../store/AuthStore";
import { NavLink, useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/formatDate";

function SettingsStatus() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <NavLink to="/setting" className="flex items-center gap-2 py-1.5">
            <ChevronLeft size={26} className="text-gray-800" />
            <span className="text-lg sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
              Status
            </span>
          </NavLink>

          {/* Button */}
          {user?.system.isBanned && (
            <button className="flex justify-center items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 text-gray-500 border-2 border-gray-400 hover:bg-green-700 disabled:bg-green-700 disabled:text-gray-200 transition-all duration-300 font-poppins font-medium text-sm md:text-base cursor-pointer">
              <Flag size={18} />
              <span>Appeal Ban</span>
            </button>
          )}
        </div>
      </nav>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-3 pb-6 space-y-4">
        <p className="text-base font-medium text-gray-700 font-poppins">
          See your account status.
        </p>

        {/* Ban Status */}
        <div className="flex items-center justify-between px-3 py-3.5 border border-gray-100 rounded-xl bg-gray-50 hover:shadow-sm transition-all">
          <div className="flex items-center gap-4">
            <AlertCircle className="text-red-500 w-5 h-5" />
            <div>
              <p className="text-gray-700 font-medium font-poppins">
                Ban Status
              </p>
              <p className="text-xs text-gray-500 font-outfit">
                {user?.system.banStatus.isBanned
                  ? `Banned until: ${formatDate(
                      user?.system.banStatus.bannedUntil
                    )}`
                  : "Not banned"}
              </p>
              {user?.system.banStatus.reason && (
                <p className="text-xs text-red-500 font-outfit">
                  Reason: {user?.system.banStatus.reason}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Last Activity */}
        <div className="flex items-center justify-between px-3 py-3.5 border border-gray-100 rounded-xl bg-gray-50 hover:shadow-sm transition-all">
          <div className="flex items-center gap-4">
            <Clock className="text-gray-500 w-5 h-5" />
            <div>
              <p className="text-gray-700 font-medium font-poppins">
                Last Activity
              </p>
              <p className="text-xs text-gray-500 font-outfit">
                {formatDate(user?.system.lastActivity)}
              </p>
            </div>
          </div>
        </div>

        {/* Last Login */}
        <div className="flex items-center justify-between px-3 py-3.5 border border-gray-100 rounded-xl bg-gray-50 hover:shadow-sm transition-all">
          <div className="flex items-center gap-4">
            <LogIn className="text-green-500 w-5 h-5" />
            <div>
              <p className="text-gray-700 font-medium font-poppins">
                Last Login
              </p>
              <p className="text-xs text-gray-500 font-outfit">
                {formatDate(user?.lastLogin)}
              </p>
            </div>
          </div>
        </div>

        {/* User since */}
        <div className="flex items-center justify-between px-3 py-3.5 border border-gray-100 rounded-xl bg-gray-50 hover:shadow-sm transition-all">
          <div className="flex items-center gap-4">
            <Calendar className="text-blue-500 w-5 h-5" />
            <div>
              <p className="text-gray-700 font-medium font-poppins">
                User Since
              </p>
              <p className="text-xs text-gray-500 font-outfit">
                {formatDate(user?.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Admin Status */}
        {user?.system.isAdmin && (
          <div className="flex items-center justify-between px-3 py-3.5 border border-gray-100 rounded-xl bg-gray-50 hover:shadow-sm transition-all">
            <div className="flex items-center gap-4">
              <ShieldUser className="text-purple-500 w-5 h-5" />
              <div>
                <p className="text-gray-700 font-medium font-poppins">
                  Admin Status
                </p>
                <p className="text-xs text-gray-500 font-outfit">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsStatus;

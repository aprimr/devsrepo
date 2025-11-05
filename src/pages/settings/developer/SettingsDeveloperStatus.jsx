import { ChevronLeft, AlertCircle, Flag, Calendar } from "lucide-react";
import { useAuthStore } from "../../../store/AuthStore";
import { NavLink } from "react-router-dom";
import { formatDate } from "../../../utils/formatDate";

function SettingsDeveloperStatus() {
  const { user } = useAuthStore();
  const banStatus = user?.developerProfile.suspendedStatus;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <NavLink to="/setting" className="flex items-center gap-2 py-1.5">
            <ChevronLeft size={26} className="text-gray-800" />
            <span className="text-lg sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
              Suspension Status
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
        {/* Ban Status */}
        <div className="p-4 border border-gray-100 rounded-xl bg-gray-50 transition mt-3">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full">
              <AlertCircle className="text-rose-600 w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <p className="text-gray-700 font-medium font-poppins">
                Suspension Status
              </p>

              {!banStatus?.isSuspended ? (
                <p className="text-sm text-green-600 font-medium font-poppins mt-1">
                  Not Suspended
                </p>
              ) : (
                <>
                  <p className="text-sm text-rose-500 font-medium font-poppins mt-1 flex items-center gap-2">
                    <Calendar size={12} />
                    <span>Banned until:</span>
                    <span className="text-gray-500 font-outfit">
                      {banStatus?.bannedUntil
                        ? formatDate(banStatus.bannedUntil)
                        : "Unknown"}
                    </span>
                  </p>

                  {banStatus?.reason && (
                    <p className="text-xs text-rose-500 font-medium font-poppins mt-1">
                      Reason:{" "}
                      <span className="font-medium text-gray-500">
                        {banStatus.reason}
                      </span>
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsDeveloperStatus;

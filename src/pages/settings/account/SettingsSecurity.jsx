import {
  ChevronLeft,
  Mail,
  Calendar,
  Key,
  Trash2,
  Skull,
  Shield,
  KeySquare,
  Loader2,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAuthStore } from "../../../store/AuthStore";
import { NavLink, useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/formatDate";
import { useState } from "react";
import { toast } from "sonner";

function SettingsSecurity() {
  const { user, deleteAccount } = useAuthStore();
  const navigate = useNavigate();
  const [dangerMode, setDangerMode] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const handleToggle2FA = () => {
    setIs2FAEnabled((prev) => !prev);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAccount();

      if (result.success) {
        setIsDeleting(false);
        navigate("/", { replace: true });
      } else {
        setIsDeleting(false);
        toast.error("Error deleting your account.");
      }
    } catch (error) {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Back Btn and Name */}
          <NavLink to="/setting" className="flex items-center gap-2 py-1.5">
            <ChevronLeft size={26} className="text-gray-800" />
            <span className="text-lg sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
              Security
            </span>
          </NavLink>

          {/* Button */}
          <button
            onClick={() => setDangerMode(!dangerMode)}
            className={`flex justify-center items-center gap-2 px-4 py-2 rounded-xl text-white border-2  disabled:text-gray-200 transition-all duration-300 font-poppins font-medium text-sm md:text-base cursor-pointer ${
              dangerMode
                ? "border-green-600 bg-green-600"
                : "border-rose-500 bg-rose-500"
            }`}
          >
            {dangerMode ? <Shield size={18} /> : <Skull size={18} />}
            {dangerMode ? <span>Safe Mode</span> : <span>Danger Mode</span>}
          </button>
        </div>
      </nav>

      {/* Settings Body */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-3 pb-6">
        <div className="space-y-4">
          <p className="text-base font-medium text-gray-700 font-poppins">
            Manage your account security settings and delete your account.
          </p>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 font-poppins">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={user?.email}
                disabled
                className="w-full pl-12 pr-4 py-3 border border-gray-300 text-gray-500 font-medium rounded-xl font-poppins"
              />
              {user?.emailVerified && (
                <div className="absolute w-auto h-full flex justify-center items-center right-0 bg-white top-1/2 transform -translate-y-1/2 border border-l-0 border-gray-300 rounded-r-xl">
                  <div className="mx-2 px-2.5 py-0.5 text-sm font-poppins bg-green-100 text-green-600 border border-green-600 rounded-lg">
                    verified
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Login Provider */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 font-poppins">
              Login Provider
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={`${user?.providerId
                  .charAt(0)
                  .toUpperCase()}${user?.providerId
                  .slice(1)
                  .split(".")[0]
                  .toLowerCase()}`}
                disabled
                className="w-full pl-12 pr-4 py-3 border border-gray-300 text-gray-500 font-medium rounded-xl font-poppins"
              />
              <div className="absolute w-auto h-full flex justify-center items-center right-0 bg-white top-1/2 transform -translate-y-1/2 border border-l-0 border-gray-300 rounded-r-xl">
                <div className="mx-2 px-2.5 py-0.5">
                  {user?.providerId === "google.com" && <FcGoogle size={24} />}
                  {user?.providerId === "github.com" && <FaGithub size={24} />}
                </div>
              </div>
            </div>
          </div>

          {/* Last Logined */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 font-poppins">
              Last Logined
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={formatDate(user?.lastLogin)}
                disabled
                className="w-full pl-12 pr-4 py-3 border border-gray-300 text-gray-500 font-medium rounded-xl font-poppins"
              />
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 font-poppins">
              2FA{" "}
              <span className="text-xs font-medium text-gray-400 font-outfit">
                [Comming Soon]
              </span>
            </label>
            <div className="flex items-center justify-between w-full px-3 py-3.5 border border-gray-100 rounded-xl bg-gray-50 hover:shadow-sm transition-all">
              <div className="flex items-center gap-4">
                <KeySquare className="text-gray-500 w-5 h-5" />
                <p className="text-gray-700 font-medium font-poppins">
                  Two-Factor Authentication
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={is2FAEnabled}
                  onChange={handleToggle2FA}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all"></div>
                <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></span>
              </label>
            </div>
          </div>

          {/* Delete Account */}
          {dangerMode && (
            <div className="mt-8">
              <button
                onClick={() => setShowConfirm(!showConfirm)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-500 text-white font-medium rounded-xl font-poppins hover:bg-rose-600 transition-all"
              >
                <Trash2 size={20} />
                <span>Delete Account</span>
              </button>
              <p className="text-center text-sm text-gray-500 mt-1 font-outfit">
                This action is permanent and can’t be undone.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 min-h-screen bg-black/20 backdrop-blur-xs flex items-center justify-center z-50 px-4 select-none">
          <div className="bg-white rounded-xl shadow-xl p-5 sm:p-6 w-full max-w-xs text-center border border-gray-100">
            {/* Text Content */}
            <h2 className="text-lg font-semibold text-rose-600 font-poppins">
              Delete your account?
            </h2>
            <p className="text-base text-gray-500 font-outfit mt-2">
              This will permanently delete your account.{" "}
              <span className="text-base font-medium text-gray-600">
                This action can’t be undone.
              </span>
            </p>

            {/* Buttons */}
            <div className="mt-5 flex gap-4 justify-center">
              {!isDeleting && (
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-5 py-2 rounded-lg border border-gray-400 text-gray-600 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-all font-poppins"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => {
                  handleDeleteAccount();
                }}
                disabled={isDeleting}
                className="px-5 py-2 flex gap-2 items-center rounded-lg border border-rose-600 bg-rose-500 text-white font-semibold text-xs sm:text-sm hover:bg-rose-600 disabled:bg-rose-700 disabled:border-rose-700 transition-all font-poppins"
              >
                {isDeleting && <Loader2 size={16} className="animate-spin" />}
                {isDeleting ? (
                  <span>Authenticating. Please wait . . .</span>
                ) : (
                  <span>Yes, Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsSecurity;

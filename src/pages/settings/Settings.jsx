import {
  ChevronLeft,
  UserRound,
  Mail,
  Shield,
  Code,
  Lock,
  Bell,
  Globe,
  ChevronRight,
  Forward,
  Info,
  BadgeAlert,
  Gauge,
  Smartphone,
  Headset,
  MessageCircle,
  Sticker,
  LogOutIcon,
  Handshake,
  Terminal,
  RotateCw,
} from "lucide-react";
import { useAuthStore } from "../../store/AuthStore";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaFacebook,
  FaFacebookMessenger,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

function Setting() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const SectionButton = ({ icon: Icon, label, func, redirect }) => (
    <button
      onClick={() => (redirect ? navigate(redirect) : func())}
      className={`flex items-center justify-between w-full p-3 sm:p-4 rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-50 border border-transparent`}
    >
      <div className="flex gap-3 items-center">
        <Icon size={18} className="sm:w-5 sm:h-5" />
        <span className="font-medium font-poppins text-sm sm:text-base">
          {label}
        </span>
      </div>
      {redirect && <ChevronRight size={16} className="sm:w-4 sm:h-4" />}
    </button>
  );

  const SectionToggle = ({ icon: Icon, label, value }) => {
    const [enabled, setEnabled] = useState(value);

    return (
      <button
        onClick={() => setEnabled(!enabled)}
        className="flex items-center justify-between w-full p-3 sm:p-4 rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-50 border border-transparent"
      >
        <div className="flex gap-3 items-center">
          <Icon size={18} className="sm:w-5 sm:h-5" />
          <span className="font-medium font-poppins text-sm sm:text-base">
            {label}
          </span>
        </div>

        {/* Toggle Button */}
        <div
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
            enabled ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4.5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
              enabled ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Back Btn and Name */}
          <NavLink to="/profile" className="flex items-center gap-2">
            <ChevronLeft size={26} className="text-gray-800" />
            <span className="text-lg sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
              Setting
            </span>
          </NavLink>

          {/* Save */}
          <button
            onClick={() => navigate("/edit-profile")}
            className="flex justify-center items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white border-2 border-green-600 hover:bg-green-700 disabled:bg-green-700 disabled:text-gray-200 transition-all duration-300 font-poppins font-medium text-sm md:text-base cursor-pointer"
          >
            <Handshake size={18} />
            <span>Support Dev</span>
          </button>
        </div>
      </nav>

      {/* Settings Body */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8 my-2">
        <div className="space-y-5">
          {/* Account Group */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 sm:mb-3 font-poppins">
              Account
            </h3>
            <div className="space-y-1.5">
              <SectionButton
                icon={UserRound}
                label="Profile"
                redirect="/setting-profile"
              />
              <SectionButton
                icon={Shield}
                label="Security"
                redirect="/setting-security"
              />
              <SectionButton
                icon={Lock}
                label="Privacy"
                redirect="/setting-privacy"
              />
              <SectionButton
                icon={Info}
                label="Status"
                redirect="/setting-status"
              />
              <SectionButton
                icon={Forward}
                label="Share Profile"
                func={() => setShowShare(true)}
              />
            </div>
          </div>

          {/* Preferences Group */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 sm:mb-3 font-poppins">
              Preferences
            </h3>
            <div className="space-y-1.5">
              <SectionButton
                icon={Bell}
                label="Notifications"
                redirect="/setting-notifications"
              />
              <SectionButton
                icon={Mail}
                label="Email Settings"
                redirect="/setting-email"
              />
            </div>
          </div>

          {/* Developer Account Group */}
          {!user?.developerProfile.isDeveloper && (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 sm:mb-3 font-poppins">
                Developer
              </h3>
              <div className="space-y-1.5">
                <SectionButton
                  icon={Terminal}
                  label="Developer Account"
                  redirect="/setting-developer-account"
                />
              </div>
            </div>
          )}

          {/* Developer Group */}
          {user?.developerProfile.isDeveloper && (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 sm:mb-3 font-poppins">
                Developer
              </h3>
              <div className="space-y-1.5">
                <SectionButton
                  icon={Code}
                  label="Developer Profile"
                  redirect="/setting-developer-profile"
                />
                <SectionButton
                  icon={Smartphone}
                  label="Apps Management"
                  redirect="/setting-apps"
                />
                <SectionButton
                  icon={BadgeAlert}
                  label="Verification & Status"
                  redirect="/setting-verification"
                />

                <SectionButton
                  icon={Gauge}
                  label="Metrics"
                  redirect="/setting-metrics"
                />
                <SectionButton icon={Globe} label="Organization" />
              </div>
            </div>
          )}

          {/* Help & Support Group */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 sm:mb-3 font-poppins">
              Help & Support
            </h3>
            <div className="space-y-1.5">
              <SectionButton
                icon={Headset}
                label="Support Center"
                redirect="/suport"
              />
              <SectionButton
                icon={MessageCircle}
                label="Feedback"
                redirect="/feedbak"
              />
              <SectionButton icon={Sticker} label="About" redirect="/about" />
              <SectionButton
                icon={RotateCw}
                label="Refresh App"
                func={() => {
                  navigate("/", { replace: true });
                  window.location.reload();
                }}
              />
            </div>
          </div>

          {/* Logout */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-medium text-rose-500 uppercase tracking-wider mb-2 sm:mb-3 font-poppins">
              SignOut
            </h3>
            <div className="space-y-1.5">
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center justify-between w-full px-3 sm:py-2 rounded-xl transition-all duration-200 text-gray-600 bg-gray-50 hover:bg-gray-100 border border-transparent"
              >
                <div className="flex gap-3 items-center py-3.5 sm:py-0">
                  <LogOutIcon size={18} className="sm:w-5 sm:h-5" />
                  <span className="font-medium font-poppins text-sm sm:text-base">
                    Logout
                  </span>
                </div>
                <div className="rounded-full">
                  <img
                    src={user.photoURL}
                    className="h-8 w-8 aspect-square object-cover rounded-xl border-[1.5px] border-white shadow-xs"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showConfirm && (
        <div className="fixed inset-0 min-h-screen bg-black/20 backdrop-blur-xs flex items-center justify-center z-50 px-4 select-none">
          <div className="bg-white rounded-xl shadow-xl p-5 sm:p-6 w-full max-w-sm text-center border border-gray-100">
            {/* Text Content */}
            <h2 className="text-lg font-semibold text-gray-800 font-poppins">
              Ready to leave?
            </h2>
            <p className="text-base text-gray-500 font-outfit mt-2">
              You're about to sign out of DevsRepo. You can always sign in to
              access your account.
            </p>

            {/* Buttons */}
            <div className="mt-5 flex gap-5 justify-center">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2 rounded-lg border-2 border-green-700 text-green-700 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-all font-poppins"
              >
                Stay Signed In
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setShowConfirm(false);
                }}
                className="px-5 py-2 rounded-lg border-2 border-rose-600 bg-rose-600 text-white font-semibold text-xs sm:text-sm hover:bg-rose-500 transition-all font-poppins"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Profile Modal */}
      {showShare && (
        <div
          onClick={() => {
            setShowShare(false);
          }}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 select-none"
        >
          <div
            className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 animate-slide-up sm:animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with User Info */}
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-1">
                <h2 className="text-xl font-medium text-gray-900 font-poppins text-left">
                  Share Profile
                </h2>
                <p className="text-xs text-gray-600 font-poppins text-left leading-relaxed">
                  Let others find you by sharing your profile.
                </p>
              </div>
              <img
                src={user?.photoURL}
                alt={user?.name}
                className="w-12 h-12 rounded-xl object-cover border border-gray-200"
              />
            </div>

            {/* Link Copy Section */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 font-poppins mb-1">
                Profile Link
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={window.location.href}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-gray-600 tracking-tighter pr-4"
                    onClick={(e) => e.target.select()}
                  />
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Profile link copied to clipboard!");
                  }}
                  className="px-4 py-3 bg-green-500 text-white rounded-xl font-medium text-sm font-poppins transition-all duration-200 whitespace-nowrap"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Share Options */}
            <div className="mb-3">
              <h3 className="text-sm font-medium text-gray-700 font-poppins mb-1">
                Share via
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {/* Twitter */}
                <button className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:bg-gray-50">
                  <div className="p-2 bg-[#1DA1F2] rounded-lg transition-all">
                    <FaTwitter className="text-white" size={18} />
                  </div>
                  <span className="text-xs font-poppins font-medium text-gray-600">
                    Twitter
                  </span>
                </button>

                {/* Messenger */}
                <button className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:bg-gray-50">
                  <div className="p-2 bg-[#0084FF] rounded-lg transition-all">
                    <FaFacebookMessenger className="text-white" size={18} />
                  </div>
                  <span className="text-xs font-poppins font-medium text-gray-600">
                    Messenger
                  </span>
                </button>

                {/* WhatsApp */}
                <button className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:bg-gray-50">
                  <div className="p-2 bg-[#25D366] rounded-lg transition-all">
                    <FaWhatsapp className="text-white" size={18} />
                  </div>
                  <span className="text-xs font-poppins font-medium text-gray-600">
                    WhatsApp
                  </span>
                </button>

                {/* Facebook */}
                <button className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:bg-gray-50">
                  <div className="p-2 bg-[#1877F2] rounded-lg transition-all">
                    <FaFacebook className="text-white" size={18} />
                  </div>
                  <span className="text-xs font-poppins font-medium text-gray-600">
                    Facebook
                  </span>
                </button>
              </div>
            </div>

            {/* Cancel Button */}
            <button
              onClick={() => setShowShare(false)}
              className="w-full py-3.5 rounded-xl text-gray-700 font-semibold text-sm bg-gray-100 hover:bg-gray-200 font-poppins transition-all duration-200 border border-transparent hover:border-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Setting;

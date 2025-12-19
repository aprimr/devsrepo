import {
  ChevronLeft,
  UserRound,
  Mail,
  Shield,
  Code,
  Lock,
  Bell,
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
  BrickWallShield,
  Ban,
  X,
  Share2,
} from "lucide-react";
import { useAuthStore } from "../../store/AuthStore";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaFacebook,
  FaFacebookMessenger,
  FaInstagram,
  FaReddit,
  FaTelegram,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { LuLink } from "react-icons/lu";

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
              {user.developerProfile.isDeveloper && (
                <SectionButton
                  icon={Share2}
                  label="Share Profile"
                  func={() => setShowShare(true)}
                />
              )}
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

          {/* Admin Group */}
          {user?.system.isAdmin && (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 sm:mb-3 font-poppins">
                Admin
              </h3>
              <div className="space-y-1.5">
                <SectionButton
                  icon={BrickWallShield}
                  label="Admin"
                  redirect="/admin"
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
                  redirect="/setting-apps-management"
                />
                <SectionButton
                  icon={Ban}
                  label="Suspended Apps"
                  redirect="/setting-suspended-apps"
                />
                <SectionButton
                  icon={Gauge}
                  label="Metrics"
                  redirect="/setting-developer-metrics"
                />
                <SectionButton
                  icon={BadgeAlert}
                  label="Suspension Status"
                  redirect="/setting-developer-suspension"
                />
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
                className="px-5 py-2 rounded-lg border-2 border-gray-300 text-gray-600 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-all font-poppins"
              >
                Cancle
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
          onClick={() => setShowShare(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 lg:items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-2xl lg:rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 animate-in slide-in-from-bottom duration-300 lg:animate-in lg:fade-in lg:duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-0 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 font-poppins">
                Share Your Profile
              </h3>
              <button
                onClick={() => setShowShare(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Share Options */}
            <div className="p-6 pt-4 pb-4">
              <div className="grid grid-cols-4 gap-4 mb-2">
                {(() => {
                  const baseUrl = window.location.href.replace(
                    /\/setting\/?$/,
                    ""
                  );
                  const devProfileUrl = `${baseUrl}/p/${user.developerProfile.developerId}`;
                  return (
                    <>
                      {/* Facebook */}
                      <button
                        onClick={() => {
                          const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            devProfileUrl
                          )}`;
                          window.open(url, "_blank");
                        }}
                        className="flex flex-col items-center gap-1 px-3 rounded-xl transition-colors group"
                      >
                        <div className="p-1 bg-white rounded-2xl group-hover:scale-110 transition-transform">
                          <FaFacebook className="h-10 w-10 text-blue-500" />
                        </div>
                        <span className="text-xs font-poppins text-gray-700">
                          Facebook
                        </span>
                      </button>

                      {/* X / Twitter */}
                      <button
                        onClick={() => {
                          const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                            devProfileUrl
                          )}`;
                          window.open(url, "_blank");
                        }}
                        className="flex flex-col items-center gap-1 px-3 rounded-xl transition-colors group"
                      >
                        <div className="p-2.5 m-0.5 bg-black rounded-2xl group-hover:scale-110 transition-transform">
                          <FaXTwitter className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xs font-poppins text-gray-700">
                          X/Twitter
                        </span>
                      </button>

                      {/* Reddit */}
                      <button
                        onClick={() => {
                          const url = `https://www.reddit.com/submit?url=${encodeURIComponent(
                            devProfileUrl
                          )}`;
                          window.open(url, "_blank");
                        }}
                        className="flex flex-col items-center gap-1 px-3 rounded-xl transition-colors group"
                      >
                        <div className="p-1 bg-white rounded-2xl group-hover:scale-110 transition-transform">
                          <FaReddit className="h-10 w-10 text-orange-600" />
                        </div>
                        <span className="text-xs font-poppins text-gray-700">
                          Reddit
                        </span>
                      </button>

                      {/* Telegram */}
                      <button
                        onClick={() => {
                          const url = `https://t.me/share/url?url=${encodeURIComponent(
                            devProfileUrl
                          )}`;
                          window.open(url, "_blank");
                        }}
                        className="flex flex-col items-center gap-1 px-3 rounded-xl transition-colors group"
                      >
                        <div className="p-1 bg-white rounded-2xl group-hover:scale-110 transition-transform">
                          <FaTelegram className="h-10 w-10 text-sky-400" />
                        </div>
                        <span className="text-xs font-poppins text-gray-700">
                          Telegram
                        </span>
                      </button>

                      {/* Messenger */}
                      <button
                        onClick={() => {
                          const url = `fb-messenger://share?link=${encodeURIComponent(
                            devProfileUrl
                          )}`;
                          window.open(url, "_blank");
                        }}
                        className="flex flex-col items-center gap-1 px-3 rounded-xl transition-colors group"
                      >
                        <div className="p-2 bg-white rounded-2xl group-hover:scale-110 transition-transform">
                          <FaFacebookMessenger className="h-9 w-9 text-blue-500" />
                        </div>
                        <span className="text-xs font-poppins text-gray-700">
                          Messenger
                        </span>
                      </button>

                      {/* WhatsApp */}
                      <button
                        onClick={() => {
                          const url = `https://wa.me/?text=${encodeURIComponent(
                            devProfileUrl
                          )}`;
                          window.open(url, "_blank");
                        }}
                        className="flex flex-col items-center gap-1 px-3 rounded-xl transition-colors group"
                      >
                        <div className="p-1.5 bg-white rounded-2xl group-hover:scale-110 transition-transform">
                          <FaWhatsapp color="#25D366" className="h-10 w-10" />
                        </div>
                        <span className="text-xs font-poppins text-gray-700">
                          WhatsApp
                        </span>
                      </button>

                      {/* Instagram */}
                      <button
                        onClick={() => {
                          const url = `https://www.instagram.com/?url=${encodeURIComponent(
                            devProfileUrl
                          )}`;
                          window.open(url, "_blank");
                        }}
                        className="flex flex-col items-center gap-1 px-3 rounded-xl transition-colors group"
                      >
                        <div className="p-2 rounded-2xl bg-linear-to-br from-purple-500 via-pink-500 to-yellow-500 group-hover:scale-110 transition-transform">
                          <FaInstagram className="h-8 w-8 text-white" />
                        </div>
                        <span className="text-xs font-poppins text-gray-700">
                          Instagram
                        </span>
                      </button>

                      {/* Copy Link */}
                      <button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(devProfileUrl);
                            toast.success("Link copied to clipboard!");
                          } catch (error) {
                            toast.error("Failed to copy link");
                          }
                        }}
                        className="flex flex-col items-center gap-1 px-3 rounded-xl transition-colors group"
                      >
                        <div className="p-2.5 bg-white rounded-2xl group-hover:scale-110 transition-transform">
                          <LuLink className="h-7 w-7 text-black" />
                        </div>
                        <span className="text-xs font-poppins text-gray-700">
                          Copy
                        </span>
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Cancel */}
            <div className="w-full px-6 pb-6">
              <button
                onClick={() => setShowShare(false)}
                className="w-full py-2.5 bg-gray-200/70 text-gray-700 font-medium font-poppins border-2 border-gray-200 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Setting;

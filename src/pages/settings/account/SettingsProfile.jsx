import {
  ChevronLeft,
  MapPin,
  FileText,
  AtSign,
  Tag,
  Edit,
  Calendar,
} from "lucide-react";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { useAuthStore } from "../../../store/AuthStore";
import { NavLink, useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/formatDate";
import DevsRepoInvert from "../../../assets/images/DevsRepoInvert.png";

function SettingsProfile() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Back Btn*/}
          <NavLink to="/setting" className="flex items-center gap-2">
            <ChevronLeft size={26} className="text-gray-800" />
            <span className="text-lg sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
              Profile
            </span>
          </NavLink>

          {/* Edit Profile */}
          <button
            onClick={() => navigate("/edit-profile")}
            className="flex justify-center items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white border-2 border-green-600 hover:bg-green-700 disabled:bg-green-700 disabled:text-gray-200 transition-all duration-300 font-poppins font-medium text-sm md:text-base cursor-pointer"
          >
            <Edit size={18} />
            <span>Edit Profile</span>
          </button>
        </div>
      </nav>

      {/* Profile Body */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative group">
            <div className="w-30 h-30 rounded-full bg-white flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={DevsRepoInvert}
                  alt="Profile preview"
                  className="w-18 h-18 object-cover"
                />
              )}
            </div>
          </div>
        </div>

        {/* Profile Data */}
        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 font-poppins">
              Name
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={user?.name}
                disabled
                className="w-full pl-12 pr-4 py-3 border border-gray-300 text-gray-500 font-medium rounded-xl font-poppins"
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 font-poppins">
              Username
            </label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={user?.username}
                disabled
                className="w-full pl-12 pr-4 py-3 border border-gray-300 text-gray-500 font-medium rounded-xl font-poppins"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 font-poppins">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={user?.location || "No Location Provided"}
                disabled
                className="w-full pl-12 pr-4 py-3 border border-gray-300 text-gray-500 font-medium rounded-xl font-poppins"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 font-poppins">
              Bio
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-5 text-gray-400 w-5 h-5" />
              <textarea
                value={user?.bio}
                disabled
                rows={6}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 text-gray-500 font-medium rounded-xl font-poppins"
              />
            </div>
          </div>

          {/* Member Since */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 font-poppins">
              Member Since
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={formatDate(user?.createdAt)}
                // value={user?.createdAt}
                disabled
                className="w-full pl-12 pr-4 py-3 border border-gray-300 text-gray-500 font-medium rounded-xl font-poppins"
              />
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="pt-10">
          <div className="pb-4">
            <h3 className="text-xl font-medium text-gray-900 font-poppins">
              Social Links
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GitHub */}
            <div className="group relative flex items-center justify-between p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 bg-white shadow-xs hover:shadow-sm">
              {/* Left Section */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center">
                  <FaGithub className="text-white w-5 h-5" />
                </div>
                <p className="text-base font-outfit font-medium text-gray-800">
                  GitHub
                </p>
              </div>

              {/* Indicator */}
              <div
                className={`flex items-center px-3 py-1.5 gap-2 text-xs font-medium font-poppins border-2 rounded-xl ${
                  user.socialLinks.github
                    ? "text-green-600 bg-green-100 border-green-600"
                    : "text-rose-500 bg-rose-100 border-rose-500"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    user.socialLinks.github ? "bg-green-500" : "bg-rose-500"
                  }`}
                />
                {user.socialLinks.github ? "Connected" : "Not Connected"}
              </div>
            </div>

            {/* LinkedIn */}
            <div className="group relative flex items-center justify-between p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 bg-white shadow-xs hover:shadow-sm">
              {/* Left Section */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                  <FaLinkedin className="text-white w-5 h-5" />
                </div>
                <p className="text-base font-outfit font-medium text-gray-800">
                  LinkedIn
                </p>
              </div>

              {/* Indicator */}
              <div
                className={`flex items-center px-3 py-1.5 gap-2 text-xs font-medium font-poppins border-2 rounded-xl ${
                  user.socialLinks.linkedin
                    ? "text-green-600 bg-green-100 border-green-600"
                    : "text-rose-500 bg-rose-100 border-rose-500"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    user.socialLinks.linkedin ? "bg-green-500" : "bg-rose-500"
                  }`}
                />
                {user.socialLinks.linkedin ? "Connected" : "Not Connected"}
              </div>
            </div>

            {/* Twitter/X */}
            <div className="group relative flex items-center justify-between p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 bg-white shadow-xs hover:shadow-sm">
              {/* Left Section */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
                  <FaTwitter className="text-white w-5 h-5" />
                </div>
                <p className="text-base font-outfit font-medium text-gray-800">
                  Twitter/X
                </p>
              </div>

              {/* Indicator */}
              <div
                className={`flex items-center px-3 py-1.5 gap-2 text-xs font-medium font-poppins border-2 rounded-xl ${
                  user.socialLinks.twitter
                    ? "text-green-600 bg-green-100 border-green-600"
                    : "text-rose-500 bg-rose-100 border-rose-500"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    user.socialLinks.twitter ? "bg-green-500" : "bg-rose-500"
                  }`}
                />
                {user.socialLinks.twitter ? "Connected" : "Not Connected"}
              </div>
            </div>

            {/* YouTube */}
            <div className="group relative flex items-center justify-between p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 bg-white shadow-xs hover:shadow-sm">
              {/* Left Section */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center">
                  <FaYoutube className="text-white w-5 h-5" />
                </div>
                <p className="text-base font-outfit font-medium text-gray-800">
                  YouTube
                </p>
              </div>

              {/* Indicator */}
              <div
                className={`flex items-center px-3 py-1.5 gap-2 text-xs font-medium font-poppins border-2 rounded-xl ${
                  user.socialLinks.youtube
                    ? "text-green-600 bg-green-100 border-green-600"
                    : "text-rose-500 bg-rose-100 border-rose-500"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    user.socialLinks.youtube ? "bg-green-500" : "bg-rose-500"
                  }`}
                />
                {user.socialLinks.youtube ? "Connected" : "Not Connected"}
              </div>
            </div>

            {/* Instagram */}
            <div className="group relative flex items-center justify-between p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 bg-white shadow-xs hover:shadow-sm">
              {/* Left Section */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-linear-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <FaInstagram className="text-white w-5 h-5" />
                </div>
                <p className="text-base font-outfit font-medium text-gray-800">
                  Instagram
                </p>
              </div>

              {/* Indicator */}
              <div
                className={`flex items-center px-3 py-1.5 gap-2 text-xs font-medium font-poppins border-2 rounded-xl ${
                  user.socialLinks.instagram
                    ? "text-green-600 bg-green-100 border-green-600"
                    : "text-rose-500 bg-rose-100 border-rose-500"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    user.socialLinks.instagram ? "bg-green-500" : "bg-rose-500"
                  }`}
                />
                {user.socialLinks.instagram ? "Connected" : "Not Connected"}
              </div>
            </div>

            {/* Facebook */}
            <div className="group relative flex items-center justify-between p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 bg-white shadow-xs hover:shadow-sm">
              {/* Left Section */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                  <FaFacebook className="text-white w-5 h-5" />
                </div>
                <p className="text-base font-outfit font-medium text-gray-800">
                  Facebook
                </p>
              </div>

              {/* Indicator */}
              <div
                className={`flex items-center px-3 py-1.5 gap-2 text-xs font-medium font-poppins border-2 rounded-xl ${
                  user.socialLinks.facebook
                    ? "text-green-600 bg-green-100 border-green-600"
                    : "text-rose-500 bg-rose-100 border-rose-500"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    user.socialLinks.facebook ? "bg-green-500" : "bg-rose-500"
                  }`}
                />
                {user.socialLinks.facebook ? "Connected" : "Not Connected"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsProfile;

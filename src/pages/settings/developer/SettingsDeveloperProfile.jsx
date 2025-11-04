import {
  ChevronLeft,
  MapPin,
  FileText,
  AtSign,
  Tag,
  Edit,
  Calendar,
  Award,
  Code,
  Code2,
  Terminal,
  AppWindow,
} from "lucide-react";
import {
  FaReact,
  FaNodeJs,
  FaGithub,
  FaJs,
  FaHtml5,
  FaCss3Alt,
  FaPython,
} from "react-icons/fa";
import { useAuthStore } from "../../../store/AuthStore";
import { NavLink, useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/formatDate";
import DevsRepoInvert from "../../../assets/images/DevsRepoInvert.png";

function DeveloperProfile() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const skills = user?.skills || ["Frontend", "Backend", "UI/UX"];
  const techStacks = user?.techStacks || [
    { name: "React", icon: <FaReact className="w-5 h-5" /> },
    { name: "NodeJS", icon: <FaNodeJs className="w-5 h-5" /> },
    { name: "JavaScript", icon: <FaJs className="w-5 h-5" /> },
    { name: "HTML5", icon: <FaHtml5 className="w-5 h-5" /> },
    { name: "CSS3", icon: <FaCss3Alt className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Back Btn*/}
          <NavLink to="/setting" className="flex items-center gap-2">
            <ChevronLeft size={26} className="text-gray-800" />
            <span className="text-lg sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
              Developer Profile
            </span>
          </NavLink>

          {/* Edit Profile */}
          <button
            onClick={() => navigate("/edit-profile")}
            className="flex justify-center items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white border-2 border-green-600 hover:bg-green-700 disabled:bg-green-700 disabled:text-gray-200 transition-all duration-300 font-poppins font-medium text-sm md:text-base cursor-pointer"
          >
            <Edit size={18} />
            <span>Edit</span>
          </button>
        </div>
      </nav>

      {/* Body */}
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
            {/* Developer badge */}
            <div className="absolute top-0 -right-7 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-poppins font-medium text-green-700 bg-green-100 border-3 border-white ">
              <Terminal className="w-3 h-3" />
              Dev
            </div>
          </div>
        </div>

        {/* Main Data */}
        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 font-poppins">
              Developer Name
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

          {/* Website */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 font-poppins">
              Website
            </label>
            <div className="relative">
              <AppWindow className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={
                  user?.developerProfile.website.replace(
                    /^(https?:\/\/)?(www\.)?/,
                    ""
                  ) || "No Website Provided"
                }
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

          {/* Skills */}
          <div>
            <label className="text-sm font-medium text-gray-700 font-poppins">
              Skills
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {user?.developerProfile.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-green-50 text-green-600 border border-green-600 rounded-md text-xs font-medium font-poppins"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="text-sm font-medium text-gray-700 font-poppins">
              Tech Stack
            </label>
            <div className="flex flex-wrap gap-2.5 mt-2">
              {user?.developerProfile.techStacks.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-green-50 text-green-600 border border-green-600 rounded-md text-xs font-medium font-poppins"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeveloperProfile;

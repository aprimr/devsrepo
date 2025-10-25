import { Link, NavLink } from "react-router-dom";
import {
  Search,
  Sticker,
  Smartphone,
  Layout,
  Globe,
  Zap,
  GalleryVerticalEnd,
  FileUp,
} from "lucide-react";

function Navbar() {
  const categories = [
    {
      name: "All",
      icon: <GalleryVerticalEnd size={18} />,
      path: "/",
    },
    {
      name: "Mobile Apps",
      icon: <Smartphone size={18} />,
      path: "/mobile-apps",
    },
    { name: "Web Apps", icon: <Globe size={18} />, path: "/web-apps" },
    { name: "UI Clones", icon: <Layout size={18} />, path: "/ui-clones" },
    { name: "Tools", icon: <Zap size={18} />, path: "/tools" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <Sticker size={32} className="text-green-600" />
            <span className="text-xl sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
              DevsRepo
            </span>
          </Link>
        </div>

        {/* Categories - desktop */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {categories.map((cat) => (
            <NavLink
              key={cat.name}
              to={cat.path}
              className={({ isActive }) =>
                `flex items-center gap-2 relative font-medium text-sm lg:text-base font-poppins transition-colors px-3 lg:px-4 py-2 rounded-lg ${
                  isActive
                    ? "text-green-700 bg-green-50 border border-green-200"
                    : "text-gray-600 hover:text-green-700 hover:bg-green-50 border border-transparent"
                }`
              }
            >
              {cat.icon}
              {cat.name}
            </NavLink>
          ))}
        </div>

        {/* Profile, Upload and Search */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            className="hover:bg-gray-100 p-2 rounded-full transition-colors"
            aria-label="Search"
          >
            <Search size={20} className="text-gray-600" />
          </button>

          <button
            className="flex justify-center items-center gap-2 px-3 md:px-4 py-2 rounded-full border-2 border-green-600 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white transition-all duration-300 font-poppins font-medium text-sm md:text-base"
            aria-label="Upload"
          >
            <FileUp size={16} className="md:size-[18px]" />
            <span className="hidden lg:flex">Publish App</span>
            <span className="flex sm:hidden">Publish</span>
          </button>

          {/* Profile Avatar */}
          <div className="w-10 h-10 flex items-center justify-center bg-linear-to-br from-green-500 to-green-700 text-white font-semibold rounded-full border-2 border-white shadow-sm text-sm sm:text-base">
            D
          </div>
        </div>
      </div>

      {/* Menu chips - mobile */}
      <div className="md:hidden bg-white border-t border-gray-200 px-3 sm:px-4 py-2">
        <div className="flex gap-3 sm:gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <NavLink
              key={cat.name}
              to={cat.path}
              className={({ isActive }) =>
                `flex items-center gap-1 sm:gap-2 whitespace-nowrap px-2 sm:px-3 py-1.5 text-xs font-medium font-outfit rounded-full transition-colors border-2 ${
                  isActive
                    ? "bg-green-50 text-green-700 border-green-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-400"
                }`
              }
            >
              {cat.icon}
              {cat.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

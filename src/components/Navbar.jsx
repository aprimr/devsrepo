import {
  Sticker,
  Search,
  Smartphone,
  Layout,
  Zap,
  GalleryVerticalEnd,
  Upload,
  Gamepad2,
  DraftingCompass,
  ShoppingBag,
  Dumbbell,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const location = useLocation();
  const hideMobileMenuRoutes = ["/profile", "/setting"];
  const hideMobileMenu = hideMobileMenuRoutes.includes(location.pathname);

  const types = [
    {
      name: "All",
      icon: <GalleryVerticalEnd size={18} />,
      path: "/",
    },
    {
      name: "Apps",
      icon: <Smartphone size={18} />,
      path: "/apps",
    },
    { name: "Games", icon: <Gamepad2 size={18} />, path: "/games" },
    { name: "UI Clones", icon: <Layout size={18} />, path: "/ui-clones" },
    { name: "Tools", icon: <DraftingCompass size={18} />, path: "/tools" },
    { name: "Fitness", icon: <Dumbbell size={18} />, path: "/fitness" },
    { name: "Shopping", icon: <ShoppingBag size={18} />, path: "/shopping" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <NavLink to="/" className="flex items-center gap-2">
            <Sticker size={32} className="text-green-600" />
            <span className="text-xl sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
              DevsRepo
            </span>
          </NavLink>
        </div>

        {/* Types - desktop */}
        <div className="hidden xl:flex items-center gap-4 lg:gap-6">
          {types.map((cat) => (
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
          {/* Search */}
          <button
            className="hover:bg-gray-100 p-2 rounded-full transition-colors"
            aria-label="Search"
          >
            <Search size={20} className="text-gray-600" />
          </button>

          {/* Publish btn */}
          {isAuthenticated && user.developerProfile.isDeveloper && (
            <button
              onClick={() => navigate("/publish")}
              className="flex justify-center items-center gap-2 px-3 md:px-4 py-2 rounded-full border-2 border-green-600 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white transition-all duration-300 font-poppins font-medium text-sm md:text-base cursor-pointer"
              aria-label="Upload"
            >
              <Upload size={16} className="size-[18px]" />
              <span className="">Publish</span>
            </button>
          )}

          {/* Login Button & Profile */}
          {isAuthenticated ? (
            <img
              onClick={() => {
                navigate("/profile");
              }}
              src={user?.photoURL}
              alt="image-url"
              className="w-10 h-10 flex items-center justify-center bg-linear-to-br from-green-500 to-green-700 text-white font-semibold rounded-full border-2 border-white shadow-sm cursor-pointer"
            />
          ) : (
            <NavLink
              to="/login"
              className="flex justify-center items-center gap-2 px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all duration-300 font-poppins font-medium text-sm md:text-base cursor-pointer"
            >
              <span>Login</span>
            </NavLink>
          )}
        </div>
      </div>

      {/* Types chips - mobile */}
      {!hideMobileMenu && (
        <div className="xl:hidden bg-white border-t border-gray-200 px-3 sm:px-4 py-2">
          <div className="flex gap-3 sm:gap-2 overflow-x-auto no-scrollbar">
            {types.map((cat) => (
              <NavLink
                key={cat.name}
                to={cat.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 sm:gap-3 whitespace-nowrap px-2.5 sm:px-3 py-1.5 text-xs font-medium font-poppins rounded-full transition-colors border ${
                    isActive
                      ? "bg-green-50 text-green-700 border-green-600 shadow-sm"
                      : "bg-white text-gray-500 border-gray-400"
                  }`
                }
              >
                {cat.icon}
                {cat.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

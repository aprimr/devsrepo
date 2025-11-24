import {
  Sticker,
  Search,
  Layout,
  GalleryVerticalEnd,
  Upload,
  DraftingCompass,
  ShoppingBag,
  Dumbbell,
  GraduationCap,
  Shapes,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  const hideMobileMenuRoutes = ["/profile", "/setting"];
  const hideMobileMenu = hideMobileMenuRoutes.includes(location.pathname);

  const types = [
    { name: "All", icon: <GalleryVerticalEnd size={18} />, type: "" },
    { name: "Education", icon: <GraduationCap size={18} />, type: "education" },
    { name: "Kids", icon: <Shapes size={18} />, type: "kids" },
    { name: "UI Clones", icon: <Layout size={18} />, type: "uiclone" },
    { name: "Tools", icon: <DraftingCompass size={18} />, type: "tools" },
    { name: "Fitness", icon: <Dumbbell size={18} />, type: "fitness" },
    { name: "Shopping", icon: <ShoppingBag size={18} />, type: "shopping" },
  ];

  // Check if  active
  const isTypeActive = (type) =>
    type === ""
      ? location.pathname === "/"
      : location.pathname === `/t/${type}`;

  const TypeButton = ({ cat, isMobile = false }) => {
    const active = isTypeActive(cat.type);
    const baseClassDesktop =
      "flex items-center gap-2 relative font-medium text-[12px] lg:text-sm font-poppins transition-colors px-3 lg:px-4 py-1.5 rounded-lg cursor-pointer";
    const activeClassDesktop =
      "text-green-700 bg-green-50 border border-green-200";
    const inactiveClassDesktop =
      "text-gray-600 hover:text-green-700 hover:bg-green-50 border border-transparent";

    const baseClassMobile =
      "flex items-center gap-2 sm:gap-3 whitespace-nowrap px-2.5 sm:px-3 py-1.5 text-xs font-medium font-poppins rounded-full transition-colors border";
    const activeClassMobile =
      "bg-green-50 text-green-700 border-green-600 shadow-sm";
    const inactiveClassMobile = "bg-white text-gray-500 border-gray-400";

    return (
      <button
        key={cat.name}
        onClick={() => navigate(cat.type === "" ? "/" : `/t/${cat.type}`)}
        className={
          isMobile
            ? `${baseClassMobile} ${
                active ? activeClassMobile : inactiveClassMobile
              }`
            : `${baseClassDesktop} ${
                active ? activeClassDesktop : inactiveClassDesktop
              }`
        }
      >
        {cat.icon}
        {cat.name}
      </button>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Sticker size={32} className="text-green-600" />
          <span className="text-xl sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
            DevsRepo
          </span>
        </div>

        {/* Types - desktop */}
        <div className="hidden xl:flex items-center gap-4 lg:gap-6">
          {types.map((cat) => (
            <TypeButton key={cat.name} cat={cat} />
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
          {isAuthenticated && user?.developerProfile?.isDeveloper && (
            <button
              onClick={() => navigate("/publish")}
              className="flex justify-center items-center gap-2 px-3 md:px-4 py-2 rounded-full border-2 border-green-600 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white transition-all duration-300 font-poppins font-medium text-sm md:text-base cursor-pointer"
              aria-label="Upload"
            >
              <Upload size={16} className="size-[18px]" />
              <span>Publish</span>
            </button>
          )}

          {/* Login Button & Profile */}
          {isAuthenticated ? (
            <img
              onClick={() => navigate("/profile")}
              src={user?.photoURL}
              alt="profile"
              className="w-10 h-10 flex items-center justify-center bg-linear-to-br from-green-500 to-green-700 text-white font-semibold rounded-full border-2 border-white shadow-sm cursor-pointer"
            />
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex justify-center items-center gap-2 px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all duration-300 font-poppins font-medium text-sm md:text-base cursor-pointer"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Types chips - mobile */}
      {!hideMobileMenu && (
        <div className="xl:hidden bg-white border-t border-gray-200 px-3 sm:px-4 py-2">
          <div className="flex gap-3 sm:gap-2 overflow-x-auto no-scrollbar">
            {types.map((cat) => (
              <TypeButton key={cat.name} cat={cat} isMobile />
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

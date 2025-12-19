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
  Bell,
  X,
  Loader2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { useEffect, useState } from "react";
import { searchAppByName } from "../services/appServices";
import DevsRepoImg from "../assets/images/DevsRepoInvert.png";
import { getFileURL } from "../services/appwriteStorage";
import { FaStar } from "react-icons/fa";
import { calculateRating } from "../utils/calculateRating";

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);

  const hideMobileMenuRoutes = ["/profile", "/setting"];
  const hideMobileMenu = hideMobileMenuRoutes.includes(location.pathname);

  // Search effect
  useEffect(() => {
    if (!searchInput?.trim()) {
      setSearchResults([]);
      setNoResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      setNoResults(false);

      const res = await searchAppByName(searchInput);

      if (res.success && res.data.length > 0) {
        setSearchResults(res.data);
        setNoResults(false);
      } else {
        setSearchResults([]);
        setNoResults(true);
      }

      setSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const types = [
    { name: "All", icon: <GalleryVerticalEnd size={18} />, type: "" },
    { name: "Education", icon: <GraduationCap size={18} />, type: "education" },
    { name: "Kids", icon: <Shapes size={18} />, type: "kids" },
    { name: "UI Clones", icon: <Layout size={18} />, type: "uiclone" },
    { name: "Tools", icon: <DraftingCompass size={18} />, type: "tools" },
    { name: "Fitness", icon: <Dumbbell size={18} />, type: "fitness" },
    { name: "Shopping", icon: <ShoppingBag size={18} />, type: "shopping" },
  ];

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
      <div
        className={`max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3 ${
          searchModalOpen && "overflow-hidden"
        }`}
      >
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

        {/* Desktop Types */}
        <div className="hidden xl:flex items-center gap-4 lg:gap-6">
          {types.map((cat) => (
            <TypeButton key={cat.name} cat={cat} />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-4">
          {/* Search */}
          <button
            onClick={() => {
              setSearchModalOpen((prev) => !prev);
            }}
            className="hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            {searchModalOpen ? <X size={20} /> : <Search size={20} />}
          </button>

          {/* Publish */}
          {isAuthenticated && user?.developerProfile?.isDeveloper && (
            <button
              onClick={() => navigate("/publish")}
              className="flex justify-center items-center gap-2 px-3 md:px-4 py-2 rounded-full border-2 border-green-600 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white transition-all duration-300 font-poppins font-medium text-sm md:text-base cursor-pointer"
            >
              <Upload size={16} />
              <span>Publish</span>
            </button>
          )}

          {/* Login/Profile */}
          {isAuthenticated ? (
            <img
              onClick={() => navigate("/profile")}
              src={user?.photoURL}
              alt="profile"
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm cursor-pointer"
            />
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex justify-center items-center gap-2 px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition font-poppins font-medium text-sm md:text-base cursor-pointer"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile Types */}
      {!hideMobileMenu && !searchModalOpen && (
        <div className="xl:hidden bg-white border-t border-gray-200 px-3 sm:px-4 py-2">
          <div className="flex gap-3 sm:gap-2 overflow-x-auto no-scrollbar">
            {types.map((cat) => (
              <TypeButton key={cat.name} cat={cat} isMobile />
            ))}
          </div>
        </div>
      )}

      {/* Search Modal */}
      {searchModalOpen && (
        <div className="fixed left-0 right-0 z-40 top-[60px] sm:top-[50px] min-h-[calc(100vh-60px)] sm:min-h-[calc(100vh-50px)] bg-white">
          {/* Search Row */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 mt-1">
            <div className="relative">
              {searching ? (
                <Loader2
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 animate-spin"
                />
              ) : (
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
              )}

              <input
                autoFocus
                type="text"
                placeholder="Search apps on DevsRepo"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 rounded-lg font-poppins border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />

              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Search result */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
            {!searchInput && (
              <div className="flex flex-col font-poppins items-center text-center text-gray-500 mt-16">
                <h2 className="text-lg sm:text-xl font-medium text-gray-700">
                  Search DevsRepo
                </h2>
                <p className="text-sm max-w-md mt-1 leading-relaxed">
                  Search and discover apps published on DevsRepo.
                </p>
              </div>
            )}

            {searchInput && (
              <div className="space-y-3">
                {noResults ? (
                  <div className="flex flex-col font-poppins items-center text-center text-gray-500 mt-16">
                    <h2 className="text-lg sm:text-xl font-medium text-gray-700">
                      No apps found.
                    </h2>
                    <p className="text-sm max-w-md mt-1 leading-relaxed">
                      Please try searching different apps.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[78vh] overflow-y-auto no-scrollbar">
                    {searchResults.map((app) => (
                      <SearchResult key={app.appId} app={app} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

const SearchResult = ({ app }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/a/${app.appId}`)}
      className="flex items-start gap-4 py-2.5 border-b border-gray-200"
    >
      {/* App Icon */}
      <img
        src={getFileURL(app.details.media.icon) || DevsRepoImg}
        alt={app.details?.name}
        className="w-12 h-12 rounded-lg object-cover shrink-0"
      />

      {/* App Info */}
      <div className="flex flex-col flex-1">
        {/* Title Row */}
        <p className="text-sm font-poppins text-gray-800 line-clamp-1">
          {app.details?.name} {app.isTagMatch && "(Similar match)"}
        </p>

        {/* Type / Version / Ratings */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-poppins mt-1 truncate">
          <span className="capitalize truncate">{app.details?.type}</span>
          <span className="h-1 w-1 rounded-full bg-gray-500" />
          <span className="truncate">
            v{" "}
            <span className="font-outfit">
              {app.details?.appDetails?.version}
            </span>
          </span>
          {app.metrics?.ratings?.totalReviews > 0 && (
            <>
              <span className="h-1 w-1 rounded-full bg-gray-500" />
              <div className="flex items-center gap-1 truncate">
                <FaStar size={12} className="text-yellow-500" />
                <span className="text-gray-600 font-outfit">
                  {calculateRating(app.metrics.ratings.breakdown)}
                </span>
                <span className="text-xs font-outfit text-gray-500">
                  ({app.metrics.ratings.totalReviews})
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

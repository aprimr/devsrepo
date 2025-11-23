import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../../store/AuthStore";
import { fetchUserById } from "../../../services/appServices";
import { BadgeCheck, ChevronLeft, Search, X } from "lucide-react";
import { toast } from "sonner";
import { FiSearch } from "react-icons/fi";

function SettingsPrivacyStats() {
  const location = useLocation();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const tabFromState = location.state?.tab;
  const [activeTab, setActiveTab] = useState("followers");
  const [searchText, setSearchText] = useState("");
  const [allUsersMap, setAllUsersMap] = useState({}); // caching all user

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (tabFromState === "ing") setActiveTab("following");
    else setActiveTab("followers");
  }, [tabFromState]);

  useEffect(() => {
    const ids =
      activeTab === "followers"
        ? user?.social?.followersIds || []
        : user?.social?.followingIds || [];

    const loadUsers = async () => {
      const newMap = { ...allUsersMap };

      for (const id of ids) {
        if (!newMap[id]) {
          const res = await fetchUserById(id);
          if (res?.success) newMap[id] = res.developer;
        }
      }

      setAllUsersMap(newMap);
    };

    loadUsers();
  }, [activeTab, user]);

  const listIds =
    activeTab === "followers"
      ? user?.social?.followersIds || []
      : user?.social?.followingIds || [];

  // Filter based on search
  const filteredIds = listIds.filter((id) => {
    const d = allUsersMap[id];
    if (!searchText.trim()) return true;
    if (!d) return true;

    const t = searchText.toLowerCase();
    return (
      d.name.toLowerCase().includes(t) || d.username.toLowerCase().includes(t)
    );
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1450px] mx-auto flex items-center px-4 sm:px-6 py-3">
          {/* Back Button */}
          <div
            onClick={() => navigate(-1)}
            className="flex items-center py-1.5 gap-2 cursor-pointer shrink-0"
          >
            <ChevronLeft size={26} className="text-gray-800" />
            {!isSearchOpen && (
              <span className="block sm:hidden text-lg sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
                Stats
              </span>
            )}
            <span className="hidden sm:block text-lg sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
              Stats
            </span>
          </div>

          {/* Search Section */}
          <div className="flex items-center ml-auto">
            {!isSearchOpen && (
              <div
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center px-2 py-2 cursor-pointer"
              >
                <Search size={20} className="text-lg md:text-xl" />
              </div>
            )}

            {/* Search Bar */}
            {isSearchOpen && (
              <div className="flex items-center gap-5 ml-6 mr-2 w-full">
                <input
                  type="text"
                  autoFocus
                  placeholder={`Search ${activeTab}`}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full px-4 py-2 border-2 rounded-xl font-poppins text-sm border-gray-400 focus:border-green-500 outline-none text-gray-700"
                />
                <X
                  className="text-gray-800 rounded-full cursor-pointer shrink-0"
                  size={22}
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchText("");
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="flex justify-between border-b border-gray-300 font-poppins px-6 mb-4">
          <div
            onClick={() => setActiveTab("followers")}
            className={`px-4 pb-2 text-sm font-medium cursor-pointer ${
              activeTab === "followers"
                ? "border-b-2 border-green-500 text-black"
                : "border-b-2 border-transparent text-gray-500"
            }`}
          >
            Followers
          </div>
          <div
            onClick={() => setActiveTab("following")}
            className={`px-4 pb-2 text-sm font-medium cursor-pointer ${
              activeTab === "following"
                ? "border-b-2 border-green-500 text-black"
                : "border-b-2 border-transparent text-gray-500"
            }`}
          >
            Following
          </div>
        </div>

        {/* User List */}
        <div className="divide-y divide-gray-200">
          {filteredIds.length === 0 ? (
            <div className="py-6 text-center text-gray-500 font-medium">
              No results
            </div>
          ) : (
            filteredIds.map((id) => (
              <UserCard key={id} user={allUsersMap[id]} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Simplified UserCard: receives already-loaded user
const UserCard = ({ user }) => {
  const navigate = useNavigate();

  if (!user)
    return (
      <div className="flex items-center gap-3 py-2">
        <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
        <div className="flex-1 space-y-1 py-1">
          <div className="h-4 bg-gray-200 w-1/3 rounded animate-pulse" />
          <div className="h-3 bg-gray-200/60 w-1/5 rounded animate-pulse" />
        </div>
      </div>
    );

  return (
    <div
      onClick={() => {
        if (user.developerProfile.isDeveloper)
          navigate(`/p/${user.developerProfile.developerId}`);
      }}
      className="flex items-center gap-3 py-2 cursor-pointer"
    >
      <img
        src={user.photoURL}
        onError={(e) => (e.target.src = "https://placehold.co/48x48?text=U")}
        alt={user.username}
        className="w-12 h-12 object-cover rounded-xl"
      />

      <div>
        <div className="font-medium font-poppins text-gray-800 flex items-center gap-2">
          {user.name}
          {user.developerProfile.isDeveloper && (
            <div className="text-[8px] bg-green-50 px-2 py-0.5 text-green-600 border border-green-300 rounded-full">
              Dev
            </div>
          )}
        </div>
        <p className="text-sm font-outfit text-gray-500 flex items-center gap-1">
          @{user.username}
          {user.developerProfile.verifiedDeveloper && (
            <BadgeCheck size={14} className="text-white fill-blue-500" />
          )}
        </p>
      </div>
    </div>
  );
};

export default SettingsPrivacyStats;

import { useEffect, useState } from "react";
import {
  MapPin,
  Settings,
  Globe,
  Sticker,
  BadgeCheck,
  Loader2,
  Loader,
} from "lucide-react";
import { useAuthStore } from "../../store/AuthStore";
import { useSystemStore } from "../../store/SystemStore";
import numberSuffixer from "../../utils/numberSuffixer";
import { useNavigate } from "react-router-dom";
import DevsRepoImport from "../../assets/images/DevsRepoInvert.png";
import DeveloperAppCard from "../../components/ui/cards/DeveloperAppCard";
import { FcGoogle } from "react-icons/fc";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("apps");
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const { user } = useAuthStore();
  const { getUserDetailsById } = useSystemStore();

  const [publishedApps, setPublishedApps] = useState([]);
  const [pendingApps, setPendingApps] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    let isMounted = true;

    const fetchUserAndApps = async () => {
      try {
        document.title = `${user.name} - DevsRepo`;
        setAppsLoading(true);

        const dbUser = await getUserDetailsById(user.uid);
        if (!isMounted) return;

        if (!dbUser?.developerProfile?.isDeveloper) {
          setPublishedApps([]);
          setPendingApps([]);
          return;
        }

        setPublishedApps(dbUser.developerProfile.apps?.publishedAppIds || []);
        setPendingApps(dbUser.developerProfile.apps?.submittedAppIds || []);
      } catch (err) {
        console.error("Error fetching apps:", err);
      } finally {
        if (isMounted) setAppsLoading(false);
      }
    };

    fetchUserAndApps();

    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  return (
    <div
      className={`min-h-screen bg-gray-50 select-none ${
        user.system.banStatus.isBanned && "pointer-events-none"
      }`}
    >
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* User Profile - Mobile*/}
        <div className="mb-6 md:hidden">
          <div className="flex flex-col">
            {/* Avatar & Name/Stats */}
            <div className="flex flex-row gap-5 items-start min-w-0">
              {/* Avatar */}
              <div className="shrink-0">
                <img
                  src={user.photoURL}
                  alt={user.name}
                  className="w-24 h-24 sm:w-36 sm:h-36 rounded-full object-cover border border-gray-200"
                />
              </div>

              {/* Name & Stats */}
              <div className="flex flex-col flex-1 min-w-0">
                {/* Name & Provider */}
                <div className="flex items-center justify-between gap-3 mb-2 mr-2 min-w-0">
                  <h2 className="text-lg sm:text-2xl font-poppins font-medium text-gray-900 truncate max-w-[60vw]">
                    {user.name}
                  </h2>
                  {user.providerId === "google.com" && <FcGoogle size={16} />}
                  {user.providerId === "github.com" && <FaGithub size={16} />}
                </div>

                {/* Stats */}
                <div className="flex justify-between gap-6 sm:gap-12">
                  <div className="text-left ">
                    <p className="text-lg sm:text-2xl font-outfit text-gray-800">
                      {user.developerProfile.isDeveloper
                        ? numberSuffixer(
                            user.developerProfile.apps.publishedAppIds.length
                          )
                        : "NaD"}
                    </p>
                    <p className="text-sm text-gray-600 font-poppins">Apps</p>
                  </div>
                  {/* Followers */}
                  <div
                    onClick={() => navigate(`/s/${user?.uid}?t=ers`)}
                    className="text-left"
                  >
                    <p className="text-lg sm:text-2xl font-outfit text-gray-800">
                      {numberSuffixer(user.social.followersIds.length)}
                    </p>
                    <p className="text-sm text-gray-600 font-poppins">
                      Followers
                    </p>
                  </div>
                  {/* Following */}
                  <div
                    onClick={() => navigate(`/s/${user?.uid}?t=ing`)}
                    className="text-left"
                  >
                    <p className="text-lg sm:text-2xl font-outfit text-gray-800">
                      {numberSuffixer(user.social.followingIds.length)}
                    </p>
                    <p className="text-sm text-gray-600 font-poppins">
                      Following
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Info & Buttons */}
            <div className="mt-2 min-w-0">
              {/* Username & Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 min-w-0">
                <div className="flex items-center text-gray-800 font-outfit text-lg sm:text-xl truncate max-w-full">
                  <span className="text-xl">@</span>
                  <span className="truncate">{user.username}</span>
                  {user?.developerProfile.verifiedDeveloper && (
                    <BadgeCheck size={18} fill="#3B82F6" color="white" />
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-row gap-3 sm:ml-auto">
                  <button
                    onClick={() => navigate("/edit-profile")}
                    className="w-full px-5 py-2 bg-green-600 text-white font-poppins rounded-lg font-medium hover:bg-green-700 transition"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => navigate("/setting")}
                    className="px-3 py-2 bg-black text-gray-100 rounded-lg hover:bg-gray-900 transition"
                  >
                    <Settings size={22} />
                  </button>
                </div>
              </div>

              {/* Bio, Location, Website, Social Icons */}
              <div className="space-y-2.5">
                {/* Bio */}
                <p
                  onClick={() => setIsBioExpanded(!isBioExpanded)}
                  className={`text-gray-800 font-poppins text-sm sm:text-base whitespace-pre-line ${
                    isBioExpanded ? "" : "line-clamp-2"
                  }`}
                >
                  {user.bio || "Hey! I am using DevsRepo"}
                </p>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-700 font-poppins text-sm truncate">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{user.location || "Anywhere on earth"}</span>
                </div>

                {/* Website */}
                {user.developerProfile.isDeveloper &&
                  user.developerProfile.website && (
                    <a
                      href={user.developerProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-green-600 font-poppins text-sm truncate"
                    >
                      <Globe className="w-4 h-4 text-gray-700 shrink-0" />
                      {user.developerProfile.website.replace(
                        /^(https?:\/\/)?(www\.)?/,
                        ""
                      )}
                    </a>
                  )}

                {/* Social Icons */}
                <div className="flex flex-row flex-wrap gap-3 items-center text-gray-600">
                  {user.socialLinks.github && (
                    <a
                      href={user.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub size={18} />
                    </a>
                  )}
                  {user.socialLinks.linkedin && (
                    <a
                      href={user.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin size={18} />
                    </a>
                  )}
                  {user.socialLinks.twitter && (
                    <a
                      href={user.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaTwitter size={18} />
                    </a>
                  )}
                  {user.socialLinks.youtube && (
                    <a
                      href={user.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaYoutube size={18} />
                    </a>
                  )}
                  {user.socialLinks.instagram && (
                    <a
                      href={user.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaInstagram size={18} />
                    </a>
                  )}
                  {user.socialLinks.facebook && (
                    <a
                      href={user.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFacebook size={18} />
                    </a>
                  )}
                </div>
              </div>

              {/* Banned Section */}
              {user.system.banStatus.isBanned && (
                <div className="w-full max-w-md mx-auto mt-6">
                  <div className="bg-rose-50 border border-rose-300 rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-rose-500 text-white px-4 py-3 font-poppins font-semibold">
                      Your Account is Banned
                    </div>
                    <div className="px-4 py-3 space-y-2 text-sm font-outfit text-gray-700">
                      <p>
                        <span className="font-medium">Reason:</span>{" "}
                        {user.system.banStatus.reason}
                      </p>
                      <p className="text-xs text-gray-500">
                        If you believe this is a mistake, contact support for
                        assistance.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Profile - Desktop */}
        <div className="hidden md:block mb-8">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Section */}
            <div className="flex-1">
              <div className="flex gap-6 items-start">
                {/* Avatar */}
                <div className="shrink-0">
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="w-36 h-36 rounded-full object-cover border border-gray-200"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col flex-1 min-w-0">
                  {/* Name & Provider */}
                  <div className="flex items-center gap-3 mb-1 min-w-0">
                    <h2 className="text-2xl font-poppins text-gray-900 truncate">
                      {user.name}
                    </h2>
                    {user.providerId === "google.com" && <FcGoogle size={16} />}
                    {user.providerId === "github.com" && <FaGithub size={16} />}
                  </div>

                  {/* Username */}
                  <div className="flex items-center text-gray-600 font-outfit text-lg mb-3 truncate">
                    <span className="text-xl">@</span>
                    <span className="truncate">{user.username}</span>
                    {user?.developerProfile.verifiedDeveloper && (
                      <BadgeCheck size={18} fill="#3B82F6" color="white" />
                    )}
                  </div>

                  {/* Bio, Location, Website, Social Icons */}
                  <div className="space-y-3 text-left w-full">
                    {/* Bio */}
                    <p
                      onClick={() => setIsBioExpanded(!isBioExpanded)}
                      className={`text-gray-800 font-poppins text-base leading-relaxed whitespace-pre-line${
                        isBioExpanded ? "" : "line-clamp-3"
                      }`}
                    >
                      {user.bio || "Hey! I am using DevsRepo"}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-700 font-poppins text-sm truncate">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{user.location || "Anywhere on earth"}</span>
                    </div>

                    {/* Website */}
                    {user.developerProfile.isDeveloper &&
                      user.developerProfile.website && (
                        <a
                          href={user.developerProfile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-green-600 font-poppins text-sm truncate hover:underline"
                        >
                          <Globe className="w-4 h-4 text-gray-700 shrink-0" />
                          {user.developerProfile.website.replace(
                            /^(https?:\/\/)?(www\.)?/,
                            ""
                          )}
                        </a>
                      )}

                    {/* Social Icons */}
                    <div className="flex flex-wrap gap-4 items-center text-gray-600 pt-1">
                      {user.socialLinks.github && (
                        <a
                          href={user.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaGithub size={18} />
                        </a>
                      )}
                      {user.socialLinks.linkedin && (
                        <a
                          href={user.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaLinkedin size={18} />
                        </a>
                      )}
                      {user.socialLinks.twitter && (
                        <a
                          href={user.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaTwitter size={18} />
                        </a>
                      )}
                      {user.socialLinks.youtube && (
                        <a
                          href={user.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaYoutube size={18} />
                        </a>
                      )}
                      {user.socialLinks.instagram && (
                        <a
                          href={user.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaInstagram size={18} />
                        </a>
                      )}
                      {user.socialLinks.facebook && (
                        <a
                          href={user.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaFacebook size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col gap-4 w-full lg:w-80 shrink-0">
              {/* Stats Box */}
              <div className="bg-white py-6">
                <div className="flex justify-between">
                  <div className="text-center flex-1">
                    <p className="text-2xl font-outfit font-semibold text-gray-800">
                      {user.developerProfile.isDeveloper
                        ? numberSuffixer(
                            user.developerProfile.apps.publishedAppIds.length
                          )
                        : "NaD"}
                    </p>
                    <p className="text-sm text-gray-600 font-poppins mt-1">
                      Apps
                    </p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-2xl font-outfit font-semibold text-gray-800">
                      {numberSuffixer(user.social.followersIds.length)}
                    </p>
                    <p className="text-sm text-gray-600 font-poppins mt-1">
                      Followers
                    </p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-2xl font-outfit font-semibold text-gray-800">
                      {numberSuffixer(user.social.followingIds.length)}
                    </p>
                    <p className="text-sm text-gray-600 font-poppins mt-1">
                      Following
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons Box */}
              <div className="bg-white ">
                <div className="flex flex-row gap-3">
                  <button
                    onClick={() => navigate("/edit-profile")}
                    className="flex-1 px-5 py-2 bg-green-600 text-white font-poppins rounded-lg font-medium hover:bg-green-700 transition"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => navigate("/setting")}
                    className="px-3 py-2 bg-black text-gray-100 rounded-lg hover:bg-gray-900 transition"
                  >
                    <Settings size={22} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Banned Section Ribbon */}
          {user.system.banStatus.isBanned && (
            <div className="w-full max-w-7xl mx-auto mt-6">
              <div className="bg-rose-50 border border-rose-300 rounded-xl shadow-sm overflow-hidden font-poppins">
                {/* Header Ribbon */}
                <div className="bg-rose-500 text-white px-6 py-3 font-semibold text-center md:text-left">
                  Your Account is Banned
                </div>

                {/* Details Section */}
                <div className="px-6 py-4 text-gray-700 font-outfit text-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="space-y-1 md:space-y-0">
                    <p>
                      <span className="font-medium">Reason:</span>{" "}
                      {user.system.banStatus.reason || "Not specified"}
                    </p>
                    {user.system.banStatus.bannedUntil && (
                      <p>
                        <span className="font-medium">Ban Lift Date:</span>{" "}
                        {user.system.banStatus.bannedUntil}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 md:text-right">
                    If you believe this is a mistake, contact support for
                    assistance.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div>
          <div className="flex border-b-2 border-gray-200 gap-10 sm:gap-12 overflow-x-auto">
            {["apps", "pending-apps", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium font-poppins border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "text-gray-800 border-green-600"
                    : "text-gray-600 border-transparent hover:text-gray-800"
                }`}
              >
                {tab === "apps" && "Apps"}
                {tab === "pending-apps" && "Pending Apps"}
                {tab === "reviews" && "Reviews"}
              </button>
            ))}
          </div>
        </div>

        {/* Apps Loading */}
        {appsLoading && (
          <div className="w-full flex justify-center items-center mt-40">
            <Loader size={30} className="animate-spin text-gray-300" />
          </div>
        )}

        {/* Apps Grid */}
        {activeTab === "apps" && !appsLoading && (
          <>
            {user.developerProfile.isDeveloper ? (
              <>
                {publishedApps != 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 gap-3 sm:gap-4 mt-4">
                    {publishedApps.map((appId) => (
                      <DeveloperAppCard key={appId} appId={appId} />
                    ))}
                  </div>
                ) : (
                  <NoData
                    happyIcon={false}
                    text="You haven’t published any apps yet. Start by clicking the PUBLISH button above to publish your first app!"
                  />
                )}
              </>
            ) : (
              <NoData
                happyIcon={false}
                text="You are currently not a developer(NaD). You can become a developer by
                      updating turning on Developer Profile in Settings."
              />
            )}
          </>
        )}

        {/* Pending Apps Grid */}
        {activeTab === "pending-apps" && !appsLoading && (
          <>
            {user.developerProfile.isDeveloper && pendingApps ? (
              <>
                {pendingApps != 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 gap-3 sm:gap-4 mt-4 pointer-events-none">
                    {pendingApps.map((appId) => (
                      <DeveloperAppCard
                        key={appId}
                        appId={appId}
                        hideRating={true}
                      />
                    ))}
                  </div>
                ) : (
                  <NoData
                    happyIcon={true}
                    text="Great! You don’t have any pending apps. Everything is up to date!"
                  />
                )}
              </>
            ) : (
              <NoData
                happyIcon={false}
                text="You are currently not a developer(NaD). You can become a developer by
                      updating turning on Developer Profile in Settings."
              />
            )}
          </>
        )}

        {/* Reviews Grid */}
        {activeTab === "reviews" && !appsLoading && (
          <>
            {user.developerProfile.isDeveloper ? (
              <>
                {user.developerProfile.apps.publishedAppIds.length != 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"></div>
                ) : (
                  <NoData
                    happyIcon={false}
                    text="You haven’t published any apps yet, so there are no reviews to show."
                  />
                )}
              </>
            ) : (
              <NoData
                happyIcon={false}
                text="You are currently not a developer(NaD). You can become a developer by
                      updating turning on Developer Profile in Settings."
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

function NoData({ happyIcon, text }) {
  return (
    <div className="w-full flex flex-col gap-2 justify-center items-center mt-30">
      {happyIcon ? (
        <Sticker size={80} className="text-green-600" />
      ) : (
        <img src={DevsRepoImport} alt="icon-devsrepo" className="h-20 w-20" />
      )}
      <p className="text-sm px-6 mt-2 font-poppins text-gray-700 text-center">
        {text}
      </p>
    </div>
  );
}

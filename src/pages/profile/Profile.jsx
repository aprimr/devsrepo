import { useState } from "react";
import {
  MapPin,
  Settings,
  Copy,
  Globe,
  Sticker,
  CopyCheck,
} from "lucide-react";
import { useAuthStore } from "../../store/AuthStore";
import numberSuffixer from "../../utils/numberSuffixer";
import { useNavigate } from "react-router-dom";
import DevsRepoImport from "../../assets/images/DevsRepoInvert.png";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
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

  return (
    <div className="min-h-screen bg-white select-none">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* User Profile*/}
        <div className="mb-12">
          {/*  */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-12 mb-4">
            <div className="flex flex-row gap-5">
              {/* Avatar */}
              <div className="flex justify-start">
                <img
                  src={user.photoURL}
                  alt={user.name}
                  className="w-24 h-24 aspect-square sm:w-40 sm:h-40 rounded-full object-cover"
                />
              </div>
              {/* Username & Stats */}
              <div className="flex-1">
                {/* Name */}
                <div className="w-full flex gap-4 items-center text-lg font-normal font-outfit text-gray-700 line-clamp-1">
                  <div className="w-full truncate">
                    <h2 className="text-lg sm:text-3xl font-medium font-poppins text-gray-800 line-clamp-1">
                      {user.name}
                    </h2>
                  </div>
                  {user.providerId === "google.com" && <FcGoogle />}
                  {user.providerId === "github.com" && <FaGithub />}
                </div>
                {/* Stats */}
                <div className="w-full justify-between flex gap-8 sm:gap-12 mb-6">
                  {/* Apps */}
                  <div className="w-auto">
                    <p className="text-lg sm:text-2xl text-left font-normal font-outfit text-gray-700">
                      {user.developerProfile.isDeveloper
                        ? numberSuffixer(
                            user.developerProfile.apps.publishedAppIds.length
                          )
                        : "NaD"}
                    </p>
                    <p className="text-gray-800 text-sm font-normal font-poppins">
                      Apps
                    </p>
                  </div>
                  {/* Followers */}
                  <div className="w-auto">
                    <p className="text-lg sm:text-2xl text-left font-normal font-outfit text-gray-700">
                      {numberSuffixer(
                        user.developerProfile.social.followersIds.length
                      )}
                    </p>
                    <p className="text-gray-800 text-sm font-normal font-poppins">
                      Followers
                    </p>
                  </div>
                  {/* Following */}
                  <div className="w-auto mr-1">
                    <p className="text-lg sm:text-2xl text-left font-normal font-outfit text-gray-700">
                      {numberSuffixer(
                        user.developerProfile.social.followingIds.length
                      )}
                    </p>
                    <p className="text-gray-800 text-sm font-normal font-poppins">
                      Following
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Info and Button */}
            <div className="flex-1">
              {/* Username and Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                {/* Username */}
                <div className="w-full flex gap-4 items-center text-lg font-normal font-outfit text-gray-700 line-clamp-1">
                  <div className="w-full truncate">
                    <span className="text-xl">@</span>
                    {user.username}
                  </div>
                </div>
                {/* Edit and settings btn */}
                <div className="flex flex-row gap-3">
                  <button
                    onClick={() => navigate("/edit-profile")}
                    className="sm:ml-auto w-full sm:w-auto px-6 py-2 bg-green-600 text-white font-poppins rounded-lg font-medium opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => navigate("/setting")}
                    className="ml-auto w-auto px-2.5 py-2 bg-black text-gray-100 font-poppins rounded-lg font-medium opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Settings size={22} />
                  </button>
                </div>
              </div>

              {/* Bio, Location & Website */}
              <div className="space-y-2">
                {/* Bio */}
                <p
                  onClick={() => setIsBioExpanded(!isBioExpanded)}
                  className={`text-gray-800 font-poppins text-sm sm:text-base ${
                    isBioExpanded ? "" : "truncate"
                  }`}
                >
                  {user.bio || "Hey! I am using DevsRepo"}
                </p>
                {/* Location */}
                <div className="w-full flex items-center gap-2 text-gray-700 font-poppins text-sm truncate">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location || "Anywhere on earth"}</span>
                </div>
                {/* Website */}
                {user.developerProfile.isDeveloper &&
                  user.developerProfile.website && (
                    <a
                      href={user.developerProfile.website}
                      className="w-full flex items-center gap-2 text-gray-700 font-poppins text-sm truncate"
                    >
                      <Globe className="w-4 h-4" />
                      {user.developerProfile.website}
                    </a>
                  )}
                {/* Social icons */}
                <div className="flex flex-row gap-3 items-center text-gray-600">
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

              {/* If Banned */}
              {user.system.banStatus.isbanned && (
                <div className="w-full max-w-md mx-auto mt-6">
                  <div className="bg-rose-50 border border-rose-300 rounded-xl shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-rose-500 text-white px-4 py-3 font-poppins font-semibold">
                      Your Account is Banned
                    </div>

                    {/* Body */}
                    <div className="px-4 py-3 space-y-2 text-sm font-outfit text-gray-700">
                      <p>
                        <span className="font-medium">Reason:</span>{" "}
                        {user.system.banStatus.reason}
                      </p>
                      <p>
                        <span className="font-medium">Ban Lift Date:</span>{" "}
                        {user.system.banStatus.bannedUntil}
                      </p>
                      <p className="text-xs text-gray-500">
                        If you believe this is a mistake, contact support for
                        further assistance.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="pt-2">
            <div className="flex border-b-2 border-gray-200 gap-10 sm:gap-12">
              {/* Apps */}
              <button
                onClick={() => setActiveTab("apps")}
                className={`pb-4 text-sm font-medium font-poppins border-b-2 transition-colors ${
                  activeTab === "apps"
                    ? "text-gray-800 border-green-600"
                    : "text-gray-600 border-white"
                }`}
              >
                Apps
              </button>
              {/* Pending Apps */}
              <button
                onClick={() => setActiveTab("pending-apps")}
                className={`pb-4 text-sm font-medium font-poppins border-b-2 transition-colors ${
                  activeTab === "pending-apps"
                    ? "text-gray-800 border-green-600"
                    : "text-gray-600 border-white"
                }`}
              >
                Pending Apps
              </button>
              {/* Reviews */}
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-4 text-sm font-medium font-poppins border-b-2 transition-colors ${
                  activeTab === "reviews"
                    ? "text-gray-800 border-green-600"
                    : "text-gray-600 border-white"
                }`}
              >
                Reviews
              </button>
            </div>
          </div>
        </div>

        {/* Apps Grid */}
        {activeTab === "apps" && (
          <>
            {user.developerProfile.isDeveloper ? (
              <>
                {user.developerProfile.apps.publishedAppIds.length != 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"></div>
                ) : (
                  <NoData
                    happyIcon={false}
                    text="You haven’t published any apps yet. Start by clicking the Dev Dash button above to publish your first app!"
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
        {activeTab === "pending-apps" && (
          <>
            {user.developerProfile.isDeveloper &&
            user.developerProfile.apps.submittedAppIds ? (
              <>
                {user.developerProfile.apps.publishedAppIds.length != 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"></div>
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
        {activeTab === "reviews" && (
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
        <img
          src={DevsRepoImport}
          alt="devs-repo-import"
          className="h-20 w-20"
        />
      )}
      <p className="text-sm px-6 mt-2 font-poppins font-medium text-gray-700 text-center">
        {text}
      </p>
    </div>
  );
}

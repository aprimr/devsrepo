import { BadgeCheck, Check, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { fetchUserById } from "../../services/appServices";

function SocialStatus() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const urlTab = searchParams.get("t");
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("followers");
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    if (urlTab === "ing") setActiveTab("following");
    else setActiveTab("followers");
  }, [urlTab]);

  // fetch user
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoadingUser(true);
      try {
        const res = await fetchUserById(id);
        if (res?.success && res.developer) {
          setUser(res.developer);
        } else {
          toast.error("User not found");
        }
      } catch (error) {
        toast.error("Failed to fetch user");
        console.error(error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3 gap-2">
          <div
            onClick={() => navigate(-1)}
            className="flex flex-1 items-center  py-1.5 gap-2 min-w-0 cursor-pointer"
          >
            <ChevronLeft size={26} className="text-gray-800" />

            {loadingUser ? (
              <div className="h-6 w-40 bg-gray-300 rounded animate-pulse"></div>
            ) : (
              <span className="text-lg sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight truncate">
                {user.name || "User"}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
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
          {loadingUser
            ? Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-3 py-2">
                  <div className="w-12 h-12 bg-gray-300 rounded-xl animate-pulse"></div>
                  <div className="flex-1 space-y-1 py-1">
                    <div className="h-4 bg-gray-300 w-1/2 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 w-1/3 rounded animate-pulse"></div>
                  </div>
                </div>
              ))
            : (() => {
                const isPrivate =
                  activeTab === "followers"
                    ? user.privacy?.privateFollower
                    : user.privacy?.privateFollowing;

                if (isPrivate) {
                  return (
                    <div className="py-6 text-center text-gray-500 font-poppins">
                      {activeTab === "followers"
                        ? "Followers are private"
                        : "Following list is private"}
                    </div>
                  );
                }

                const ids =
                  activeTab === "followers"
                    ? user.social?.followersIds || []
                    : user.social?.followingIds || [];

                if (ids.length === 0) {
                  return (
                    <div className="py-6 text-center text-gray-500 text-sm font-poppins">
                      {activeTab === "followers"
                        ? "No followers yet"
                        : "Not following anyone"}
                    </div>
                  );
                }

                return ids.map((userId) => (
                  <UserCard key={userId} userId={userId} />
                ));
              })()}
        </div>
      </div>
    </div>
  );
}

const UserCard = ({ userId }) => {
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchUserById(userId);
        if (res?.success && res.developer) {
          setDetails(res.developer);
        } else {
          toast.error("User not found");
        }
      } catch (error) {
        toast.error("Failed to fetch user");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading || !details)
    return (
      <div className="flex items-center gap-3 py-2">
        <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="flex-1 space-y-1 py-1">
          <div className="h-4 bg-gray-200 w-1/3 rounded animate-pulse"></div>
          <div className="h-3 bg-gray-200/60 w-1/5 rounded animate-pulse"></div>
        </div>
      </div>
    );

  return (
    <div
      onClick={() => {
        if (details.developerProfile.isDeveloper) {
          navigate(`/p/${details.developerProfile.developerId}`);
        }
      }}
      className="flex items-center gap-3 py-2"
    >
      <img
        src={details.photoURL}
        onError={(e) => (e.target.src = "https://placehold.co/48x48?text=U")}
        alt={details.username}
        className="w-12 h-12 object-cover rounded-xl"
      />

      <div>
        <div className="font-medium font-poppins text-gray-800 flex items-center gap-2">
          {details.name}
          {details.developerProfile.isDeveloper && (
            <div className="text-[8px] bg-green-50 font-medium font-poppins px-2 py-0.5 text-green-600 border border-green-300 rounded-full ">
              Dev
            </div>
          )}
        </div>
        <p className="text-sm font-outfit text-gray-500 flex items-center gap-1">
          @{details.username}
          {details.developerProfile.verifiedDeveloper && (
            <BadgeCheck size={14} className="text-white fill-blue-500" />
          )}
        </p>
      </div>
    </div>
  );
};

export default SocialStatus;

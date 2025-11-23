import { Frown, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchAppbyID } from "../../../services/appServices";
import { getFileURL } from "../../../services/appwriteStorage";
import { calculateRating } from "../../../utils/calculateRating";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/AuthStore";
import { FaApple } from "react-icons/fa";
import { AiFillAndroid } from "react-icons/ai";

function DeveloperAppCard({ appId, hideRating = false }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [appDetails, setAppDetails] = useState(null);

  useEffect(() => {
    const fetchAppDetails = async () => {
      if (!appId) return;

      setFetchingDetails(true);
      try {
        const res = await fetchAppbyID(appId);
        if (res && res.success) {
          setAppDetails(res.app);
        } else {
          toast.error("App not found.");
        }
      } catch (error) {
        console.error("Error fetching app details:", error);
        toast.error("Error fetching app details.");
      } finally {
        setFetchingDetails(false);
      }
    };

    fetchAppDetails();
  }, [appId]);

  if (fetchingDetails) {
    return (
      <div className="group relative bg-white/50 rounded-3xl border border-gray-100 shrink-0 w-28 animate-pulse">
        <div className="relative p-2">
          <div className="w-24 h-24 bg-gray-200 rounded-3xl mb-2"></div>
        </div>

        <div className="px-3 pb-2 flex flex-col gap-1">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>

          <div className="flex items-center justify-between mt-1">
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!appDetails) {
    return (
      <div className="group relative bg-white/50 rounded-3xl border border-gray-100 shrink-0 w-28 animate-pulse">
        <div className="relative p-2">
          <div className="w-24 h-24 bg-gray-200 rounded-3xl mb-2"></div>
        </div>

        <div className="px-3 pb-2 flex flex-col gap-1">
          <p className="text-[10px] pl-2 py-0.5 font-outfit text-gray-500 bg-gray-200 rounded w-full">
            Error : (
          </p>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>

          <div className="flex items-center justify-between mt-1">
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        navigate(`/a/${appDetails.appId}`);
      }}
      className="group relative bg-gray-50 rounded-3xl cursor-pointer overflow-hidden shrink-0 w-28"
    >
      {/* App Icon */}
      <div className="relative p-2">
        <img
          src={getFileURL(appDetails.details.media.icon)}
          alt={appDetails.name}
          className="w-24 h-24 rounded-3xl border border-gray-100 group-hover:scale-[1.02] transition-transform duration-300 ease-out"
        />
      </div>

      {/* App Info */}
      <div className="px-3 pb-2">
        {/* App Name */}
        <h3 className="font-poppins font-medium text-gray-800 text-[11px] leading-tight line-clamp-2 mb-1">
          {appDetails.details.name}
        </h3>

        {/* Rating*/}
        {!hideRating && (
          <div className="flex items-center justify-between">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-outfit font-medium text-gray-700">
                {calculateRating(appDetails.metrics.ratings.breakdown)}
              </span>
            </div>
          </div>
        )}

        {/* Platform and size*/}
        {hideRating && (
          <div className="flex items-center justify-between">
            {/* Platforms */}
            <div className="flex items-center gap-1">
              {appDetails.details.appDetails.iosApk && (
                <FaApple size={12} className="text-black" />
              )}
              {appDetails.details.appDetails.androidApk && (
                <AiFillAndroid size={12} className="text-black" />
              )}
            </div>
            {/* Size */}
            <div className="text-xs text-gray-600 font-outfit">
              {appDetails.details.appDetails.apkFileSizeMB ||
                appDetails.details.appDetails.ipaFileSizeMB}{" "}
              MB
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeveloperAppCard;

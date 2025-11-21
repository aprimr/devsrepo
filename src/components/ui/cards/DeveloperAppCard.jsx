import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchAppbyID } from "../../../services/appServices";
import { getFileURL } from "../../../services/appwriteStorage";
import { calculateRating } from "../../../utils/calculateRating";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/AuthStore";

function DeveloperAppCard({ appId }) {
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
      <div className="bg-white rounded-2xl border border-gray-100 p-2 animate-pulse">
        <div className="w-full aspect-square bg-gray-200 rounded-xl mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!appDetails) {
    return (
      <div className="bg-white p-4 text-center">
        <p className="text-gray-500 text-sm">App not Published</p>
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
        <div className="flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-outfit font-medium text-gray-700">
              {calculateRating(appDetails.metrics.ratings.breakdown)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeveloperAppCard;

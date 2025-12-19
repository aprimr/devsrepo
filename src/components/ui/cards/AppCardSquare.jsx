import { Star, ArrowDownToLine } from "lucide-react";
import { getFileURL } from "../../../services/appwriteStorage";
import { calculateRating } from "../../../utils/calculateRating";
import { useNavigate } from "react-router-dom";
import numberSuffixer from "../../../utils/numberSuffixer";

function AppCardSquare({ app }) {
  const { appId, details, metrics } = app;
  const navigate = useNavigate();

  return (
    <div
      key={appId}
      onClick={() => navigate(`/a/${app.appId}`)}
      className="group cursor-pointer rounded-2xl bg-transparent transition-all duration-200"
    >
      {/* Icon */}
      <div className="w-full p-2">
        <img
          src={getFileURL(details.media?.icon)}
          alt={details.name}
          className="w-full aspect-square object-cover rounded-2xl"
        />
      </div>

      <div className="px-2 pb-2">
        {/* App Name */}
        <h3 className="font-poppins font-normal text-xs sm:text-sm h-8.5 sm:h-10.5 sm:font-normal text-gray-900 line-clamp-2">
          {details.name}
        </h3>

        {/* Rating & Downlaod */}
        <div className="flex items-center justify-between mt-1">
          {/* Rating */}
          <div className="flex items-center gap-1 text-gray-700">
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-medium font-outfits">
              {calculateRating(metrics.ratings.breakdown)}
            </span>
          </div>

          {/* Downloads */}
          <div className="flex items-center gap-1 font-medium text-gray-700">
            <ArrowDownToLine size={12} />
            <span className="text-xs font-outfit">
              {numberSuffixer(metrics.downloads)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppCardSquare;

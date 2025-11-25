import { ArrowDownToLine, Star } from "lucide-react";
import { getFileURL } from "../../../services/appwriteStorage";
import { calculateRating } from "../../../utils/calculateRating";
import { useNavigate } from "react-router-dom";
import numberSuffixer from "../../../utils/numberSuffixer";

function AppCard({ app, rank }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/a/${app.appId}`)}
      className="relative bg-gray-50 cursor-pointer rounded-md overflow-hidden"
    >
      <div className="flex items-center gap-3 p-1">
        {/* App Icon */}
        <img
          src={getFileURL(app.details.media.icon)}
          alt={app.details.name}
          className="w-16 h-16 rounded-lg object-cover shrink-0"
        />

        {/* App Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="max-w-6/7">
            <h3 className="font-poppins text-sm sm:text-base font-medium text-gray-800 line-clamp-1">
              {app.details.name}
            </h3>
            <p className="text-gray-500 text-xs sm:text-[12px] font-inter line-clamp-1">
              {app.details.category}
            </p>
          </div>

          {/* Rating and Downloads */}
          <div className="flex max-w-2/3 items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-500 fill-current" />
              <span className="text-xs font-medium font-montserrat text-gray-500">
                {calculateRating(app.metrics.ratings.breakdown)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <ArrowDownToLine size={12} />
              <span className="text-xs font-medium font-montserrat text-gray-500">
                {numberSuffixer(app.metrics?.downloads)}
              </span>
            </div>
            <span className="text-xs font-medium font-outfit text-gray-500">
              {app.details.appDetails.apkFileSizeMB ||
                app.details.appDetails.ipaFileSizeMB}{" "}
              MB
            </span>
          </div>
        </div>
      </div>

      {/* Rank Circle */}
      {rank && (
        <div className="absolute -right-8 -bottom-10 pr-6 pb-16 h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
          <p className="text-5xl font-black font-outfit text-green-700/80">
            {rank}
          </p>
        </div>
      )}
    </div>
  );
}

export default AppCard;

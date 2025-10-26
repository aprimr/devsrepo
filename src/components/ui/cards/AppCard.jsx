import { ArrowDownToLine, Download, Star } from "lucide-react";

function AppCard({ id, icon, name, category, rating, downloads, rank }) {
  return (
    <div
      key={id}
      className="relative overflow-hidden bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <div className=" flex items-start gap-4">
        {/* App Icon */}
        <img
          src={icon}
          alt={name}
          className="w-16 h-16 rounded-xl object-cover shrink-0 z-10"
        />

        {/* App Details */}
        <div className="flex-1 min-w-0 space-y-0 z-10">
          <h3 className="font-poppins font-medium text-gray-800 text-base line-clamp-1">
            {name}
          </h3>
          <p className="text-gray-500 text-[12px] font-inter">{category}</p>

          {/* Rating and Downloads */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-500 fill-current" />
              <span className="text-xs font-medium font-montserrat text-gray-500">
                {rating}
              </span>
            </div>
            <div className="flex items-center gap-0.5 text-gray-500 text-sm">
              <ArrowDownToLine size={12} className="text-gray-500 " />
              <span className="text-xs font-medium font-montserrat text-gray-500">
                {downloads}
              </span>
            </div>
          </div>
        </div>

        {/* Rank */}
        {rank && (
          <div className="absolute -right-18 -bottom-18 h-32 w-32 rounded-full bg-gray-200 ">
            <p className="absolute left-6 top-4 bottom-0 text-4xl font-black font-montserrat text-green-700/80 ">
              {rank}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppCard;

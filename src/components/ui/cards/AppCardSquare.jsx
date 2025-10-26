import { Star, Download, ArrowDownToLine } from "lucide-react";

function AppCardSquare({ id, icon, name, category, rating, downloads }) {
  return (
    <div
      key={id}
      className="group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* App Icon */}
      <div className="relative p-2">
        <img
          src={icon}
          alt={name}
          className="w-full aspect-square object-cover rounded-xl border border-gray-100 group-hover:scale-[1.02] transition-transform duration-300 ease-out"
        />

        {/* Rating Badge */}
        <div className="absolute bottom-1 -left-0.5 bg-white rounded-sm pl-3 pr-2 py-0.5">
          <div className="flex items-center gap-1 text-gray-700 text-xs font-inter">
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{rating || "—"}</span>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="px-3 pb-3 text-left">
        <h3 className="font-poppins font-medium text-gray-900 text-[14px] leading-snug truncate">
          {name}
        </h3>

        {/* Category and Downloads */}
        <div className="flex items-center justify-between mt-1">
          <p className="text-gray-500 text-[11px] font-poppins capitalize truncate">
            {category}
          </p>
          <div className="flex items-center gap-0.5 text-gray-500 text-xs ml-2">
            <ArrowDownToLine
              size={12}
              strokeWidth={2}
              className="text-gray-500"
            />
            <span className="text-[11px] font-medium font-montserrat ">
              {downloads || "0"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppCardSquare;

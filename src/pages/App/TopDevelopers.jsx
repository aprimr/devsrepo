import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import DeveloperCard from "../../components/ui/cards/DeveloperCard";
import { useEffect, useState } from "react";
import { fetchDevelopers } from "../../services/appServices";

function TopDevelopers() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [developers, setDevelopers] = useState(state?.developers || []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3 gap-2">
          {/* Back Btn */}
          <div
            onClick={() => navigate(-1)}
            className="flex flex-1 items-center gap-2 min-w-0"
          >
            <ChevronLeft size={26} className="text-gray-800" />
            <span className="text-lg sm:text-2xl py-1.5 font-poppins font-medium text-gray-800 tracking-tight truncate block max-w-[70vw] sm:max-w-[500px]">
              Top Developers
            </span>
          </div>

          {/* Save */}
          {/* <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white border-2 border-green-600 hover:bg-green-700 disabled:bg-green-700 disabled:text-gray-200 transition-all duration-300 font-poppins font-medium text-sm md:text-base"
          >
            Save
          </button> */}
        </div>
      </nav>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-8">
        {developers.length === 0 ? (
          <div className="text-center py-10 text-gray-500 font-poppins space-y-3">
            <p className="text-lg font-medium">No developers found.</p>
            <p className="text-sm text-gray-500">
              Go back to{" "}
              <span
                onClick={() => navigate("/")}
                className="text-green-600 hover:underline cursor-pointer underline"
              >
                Home
              </span>{" "}
              and revisit this page.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-gray-500 text-sm font-medium sm:text-base font-poppins mb-5">
              Explore the top developers in the DevsRepo community.
            </h2>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-8">
              {developers.map((dev, i) => (
                <DeveloperCard key={i} developer={dev} />
              ))}
              {developers.map((dev, i) => (
                <DeveloperCard key={i} developer={dev} />
              ))}
              {developers.map((dev, i) => (
                <DeveloperCard key={i} developer={dev} />
              ))}
              {developers.map((dev, i) => (
                <DeveloperCard key={i} developer={dev} />
              ))}
              {developers.map((dev, i) => (
                <DeveloperCard key={i} developer={dev} />
              ))}
              {developers.map((dev, i) => (
                <DeveloperCard key={i} developer={dev} />
              ))}
              {developers.map((dev, i) => (
                <DeveloperCard key={i} developer={dev} />
              ))}
              {developers.map((dev, i) => (
                <DeveloperCard key={i} developer={dev} />
              ))}
              {developers.map((dev, i) => (
                <DeveloperCard key={i} developer={dev} />
              ))}
              {developers.map((dev, i) => (
                <DeveloperCard key={i} developer={dev} />
              ))}
              {developers.map((dev, i) => (
                <DeveloperCard key={i} developer={dev} />
              ))}
              {developers.map((dev, i) => (
                <DeveloperCard key={i} developer={dev} />
              ))}
              {developers.map((dev, i) => (
                <DeveloperCard key={i} developer={dev} />
              ))}
              {developers.map((dev, i) => (
                <DeveloperCard key={i} developer={dev} />
              ))}
              {developers.map((dev, i) => (
                <DeveloperCard key={i} developer={dev} />
              ))}
              {developers.map((dev, i) => (
                <DeveloperCard key={i} developer={dev} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TopDevelopers;

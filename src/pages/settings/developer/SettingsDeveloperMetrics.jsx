import React from "react";
import { useAuthStore } from "../../../store/AuthStore";
import {
  Download,
  AppWindow,
  Star,
  RefreshCw,
  Flag,
  ChevronLeft,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function SettingsDeveloperMetrics() {
  const { user } = useAuthStore();
  const metrics = user?.developerProfile?.metrics;
  const totalDownloads = user?.developerProfile?.totalDownloadsAcrossApps;

  const stats = [
    {
      label: "Published Apps",
      value: metrics?.totalPublishedApps || 0,
      icon: <AppWindow className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-100",
    },
    {
      label: "Total Downloads",
      value: totalDownloads || 0,
      icon: <Download className="w-6 h-6 text-green-600" />,
      bg: "bg-green-100",
    },
    {
      label: "Reviews Received",
      value: metrics?.totalReviewsReceived || 0,
      icon: <Star className="w-6 h-6 text-yellow-600" />,
      bg: "bg-yellow-100",
    },
    {
      label: "Reports Received",
      value: metrics?.totalReportsReceived || 0,
      icon: <Flag className="w-6 h-6 text-red-600" />,
      bg: "bg-red-100",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <NavLink to="/setting" className="flex items-center gap-2 py-1.5">
            <ChevronLeft size={26} className="text-gray-800" />
            <span className="text-lg sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
              Metrics
            </span>
          </NavLink>

          {/* <button className="flex justify-center items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 text-gray-500 border-2 border-gray-400 hover:bg-green-700 disabled:bg-green-700 disabled:text-gray-200 transition-all duration-300 font-poppins font-medium text-sm md:text-base cursor-pointer">
              <Flag size={18} />
              <span>Appeal Ban</span>
            </button> */}
        </div>
      </nav>

      {/* Metrics Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl hover:shadow-sm hover:border-gray-200  transition-all duration-300 cursor-default"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center bg-linear-to-br from-white/70 to-black/5 backdrop-blur-sm ${item.bg} group-hover:scale-110 group-hover:rotate-3 transition-transform`}
              >
                {item.icon}
              </div>

              {/* Title */}
              <p className="mt-4 text-gray-500 text-md font-medium font-poppins tracking-wide">
                {item.label}
              </p>

              {/* Value */}
              <h3 className="text-3xl font-semibold text-gray-700 font-outfit tracking-wider">
                {item.value}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SettingsDeveloperMetrics;

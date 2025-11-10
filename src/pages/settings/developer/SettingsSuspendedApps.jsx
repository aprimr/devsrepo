import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Calendar, ChevronLeft } from "lucide-react";
import { useAuthStore } from "../../../store/AuthStore";
import { useAppStore } from "../../../store/AppStore";
import { toast } from "sonner";
import { formatDate } from "../../../utils/formatDate";

function SettingsSuspendedApps() {
  const { user } = useAuthStore();
  const { fetchAppById } = useAppStore();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);

  const [suspendedAppIds, setSuspendedAppIds] = useState(
    user?.developerProfile?.apps?.suspendedAppIds || []
  );

  useEffect(() => {
    if (!suspendedAppIds.length) return;

    const fetchApps = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          suspendedAppIds.map((appId) => fetchAppById(appId))
        );
        setApps(results.filter(Boolean));
      } catch (error) {
        toast.error("Error fetching apps.");
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <NavLink to="/setting" className="flex items-center gap-2 py-1.5">
            <ChevronLeft size={26} className="text-gray-800" />
            <span className="text-lg sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
              Suspended Apps
            </span>
          </NavLink>
        </div>
      </nav>

      {/* Apps List */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-8 mt-2 space-y-4">
        {/* No apps */}
        {!loading && apps.length === 0 && (
          <p className="text-gray-500 font-outfit text-sm text-center">
            No suspended apps yet.
          </p>
        )}

        {/* Apps or Skeleton */}
        {loading ? (
          <>
            <AppSkeleton />
            <AppSkeleton />
            <AppSkeleton />
            <AppSkeleton />
            <AppSkeleton />
            <AppSkeleton />
            <AppSkeleton />
          </>
        ) : (
          <>
            {suspendedAppIds.length !== 0 && (
              <p className="text-sm text-gray-600 mb-2 font-poppins">
                View all suspends apps
              </p>
            )}
            {apps.map((appObj) => (
              <div
                key={appObj.app.appId}
                className="p-4 bg-gray-100/80 rounded-2xl border border-gray-100 transition-all overflow-hidden"
              >
                <div className="flex items-center gap-4">
                  {/* App Icon */}
                  <img
                    src={`https://cloud.appwrite.io/v1/storage/buckets/${
                      import.meta.env.VITE_APPWRITE_BUCKET_ID
                    }/files/${appObj.app.details?.media?.icon}/view?project=${
                      import.meta.env.VITE_APPWRITE_PROJECT_ID
                    }`}
                    alt={appObj.app.appId}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover bg-white shrink-0"
                  />

                  {/* App Info */}
                  <div className="flex-1 min-w-0">
                    {/* Title & Badge */}
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <h2
                        className="flex-1 min-w-0 text-sm sm:text-base font-medium text-gray-700 font-poppins truncate"
                        title={appObj.app.details?.name}
                      >
                        {appObj.app.details?.name}
                      </h2>

                      {appObj.app.status?.removal?.isRemoved && (
                        <span className="w-20 sm:w-[90px] text-center text-[10px] sm:text-xs px-2 py-1 rounded-lg font-poppins border font-medium bg-gray-200 text-gray-700 border-gray-700 shrink-0">
                          Suspended
                        </span>
                      )}
                    </div>

                    {/* Date & Size */}
                    <div className="flex flex-wrap justify-between items-center text-gray-500 text-[11px] sm:text-xs mt-1 font-outfit">
                      <span className="flex gap-1 items-center">
                        <Calendar size={12} className="sm:size-[13px]" />{" "}
                        {formatDate(appObj.app.status?.removal?.removedAt)}
                      </span>
                      <span>
                        {appObj.app.details.appDetails.apkFileSizeMB} MB
                      </span>
                    </div>

                    {/* Reason */}
                    <div className="flex flex-wrap gap-x-2 gap-y-1 items-center text-gray-500 text-xs sm:text-[13.5px] font-outfit mt-0.5">
                      <span>Reason: </span>
                      <span>
                        {appObj.app.status?.removal?.reason ||
                          "Error fetching data."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default SettingsSuspendedApps;

const AppSkeleton = () => {
  return (
    <div className="p-4 bg-gray-100 rounded-2xl overflow-hidden relative animate-pulse">
      <div className="flex items-center gap-5">
        {/* App Icon */}
        <div className="w-14 h-14 rounded-lg bg-gray-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-gray-300 via-gray-200 to-gray-300 shimmer" />
        </div>

        {/* App Info */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-5 w-26 rounded-lg bg-gray-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-gray-300 via-gray-200 to-gray-300 shimmer" />
            </div>

            <div className="h-6 w-18 rounded-lg bg-gray-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-gray-300 via-gray-200 to-gray-300 shimmer" />
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <div className="h-4 w-14 rounded-lg bg-gray-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-gray-300 via-gray-200 to-gray-300 shimmer" />
            </div>
            <div className="h-1 w-1 bg-gray-200 rounded-full relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-gray-400 via-gray-300 to-gray-400 shimmer" />
            </div>
            <div className="h-4 w-30 rounded-lg bg-gray-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-gray-300 via-gray-200 to-gray-300 shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

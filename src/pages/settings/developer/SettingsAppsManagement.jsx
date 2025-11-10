import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Calendar, ChevronLeft } from "lucide-react";
import { useAuthStore } from "../../../store/AuthStore";
import { useAppStore } from "../../../store/AppStore";
import { formatDate } from "../../../utils/formatDate";
import { toast } from "sonner";
import { TfiAndroid } from "react-icons/tfi";

function SettingsAppsManagement() {
  const { user } = useAuthStore();
  const { fetchAppById } = useAppStore();

  // Active Tab
  const [activeTab, setActiveTab] = useState("in-review");

  // Apps States
  const [inReviewApps, setInReviewApps] = useState([]);
  const [approvedApps, setApprovedApps] = useState([]);
  const [rejectedApps, setRejectedApps] = useState([]);
  const [loading, setLoading] = useState(false);

  // App IDs
  const submittedAppIds = user?.developerProfile?.apps?.submittedAppIds || [];
  const publishedAppIds = user?.developerProfile?.apps?.publishedAppIds || [];
  const rejectedAppIds = user?.developerProfile?.apps?.rejectedAppIds || [];

  // Fetch apps based on active tab
  useEffect(() => {
    const fetchAppsForTab = async () => {
      setLoading(true);
      let ids = [];

      switch (activeTab) {
        case "in-review":
          ids = submittedAppIds;
          break;
        case "approved":
          ids = publishedAppIds;
          break;
        case "rejected":
          ids = rejectedAppIds;
          break;
        default:
          ids = [];
      }

      if (!ids.length) {
        setLoading(false);
        return;
      }

      try {
        const results = await Promise.all(
          ids.map((appId) => fetchAppById(appId))
        );
        const filteredResults = results.filter(Boolean);

        if (activeTab === "in-review") setInReviewApps(filteredResults);
        if (activeTab === "approved") setApprovedApps(filteredResults);
        if (activeTab === "rejected") setRejectedApps(filteredResults);
      } catch (error) {
        toast.error("Error fetching apps.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppsForTab();
  }, [activeTab]);

  // Determine which apps to display
  const displayedApps =
    activeTab === "in-review"
      ? inReviewApps
      : activeTab === "approved"
      ? approvedApps
      : rejectedApps;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <NavLink to="/setting" className="flex items-center gap-2 py-1.5">
            <ChevronLeft size={26} className="text-gray-800" />
            <span className="text-lg sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
              Apps Management
            </span>
          </NavLink>
        </div>
      </nav>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto flex justify-between mt-4 border-b border-gray-200 px-6 sm:px-6">
        {[
          { key: "in-review", label: "In Review" },
          { key: "approved", label: "Approved" },
          { key: "rejected", label: "Rejected" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-2 text-sm sm:text-base font-poppins font-medium transition-all ${
              activeTab === tab.key
                ? "text-green-600 border-b-2 border-green-500"
                : "text-gray-500 border-b-2 border-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Apps List */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-8 space-y-4">
        {displayedApps.length === 0 && !loading && (
          <p className="text-gray-500 font-outfit text-sm text-center py-8">
            No {activeTab.replace("-", " ")} apps yet.
          </p>
        )}

        {!loading ? (
          displayedApps.map((appObj) => (
            <AppCard
              key={appObj.app.appId}
              appObj={appObj}
              activeTab={activeTab}
            />
          ))
        ) : (
          <>
            <AppSkeleton />
            <AppSkeleton />
            <AppSkeleton />
            <AppSkeleton />
            <AppSkeleton />
            <AppSkeleton />
            <AppSkeleton />
          </>
        )}
      </div>
    </div>
  );
}

export default SettingsAppsManagement;

const AppCard = ({ appObj, activeTab }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 transition-all">
      <div className="flex items-start gap-4 w-full overflow-hidden">
        {/* App Icon */}
        <img
          src={`https://cloud.appwrite.io/v1/storage/buckets/${
            import.meta.env.VITE_APPWRITE_BUCKET_ID
          }/files/${appObj.app.details?.media?.icon}/view?project=${
            import.meta.env.VITE_APPWRITE_PROJECT_ID
          }`}
          alt={appObj.app.appId}
          className="w-14 h-14 rounded-lg object-cover bg-white shrink-0"
        />

        {/* App Info */}
        <div className="flex-1 min-w-0">
          {/* Title & Status */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <h2 className="truncate text-sm sm:text-lg font-medium text-gray-800 font-poppins max-w-[70%] sm:max-w-[75%]">
              {appObj.app.details?.name}
            </h2>

            <span
              className={`text-[10px] sm:text-xs px-2 py-1 rounded-lg font-poppins border font-medium shrink-0 text-center w-[85px] sm:w-[90px] capitalize ${
                activeTab === "approved"
                  ? "bg-green-100 text-green-700 border-green-700"
                  : activeTab === "in-review"
                  ? "bg-amber-200/60 text-amber-800 border-amber-800"
                  : activeTab === "rejected"
                  ? "bg-red-100 text-red-700 border-red-700"
                  : "bg-gray-200 text-gray-700 border-gray-700"
              }`}
            >
              {activeTab.replace("-", " ")}
            </span>
          </div>

          {/* Date & Size */}
          <div className="flex justify-between items-center text-gray-500 text-[13px] mt-1 font-outfit">
            <span className="flex items-center gap-1 truncate">
              <Calendar size={12} /> {formatDate(appObj.app.createdAt)}
            </span>
            <span className="shrink-0">
              {appObj.app.details.appDetails.apkFileSizeMB} MB
            </span>
          </div>

          {/* Type & Category */}
          <div className="flex flex-wrap items-center gap-3 text-gray-500 text-[12px] mt-0.5 font-outfit">
            <span className="capitalize">{appObj.app.details?.type}</span>
            <div className="h-1 w-1 bg-gray-400 rounded-full shrink-0" />
            <span className="capitalize">{appObj.app.details?.category}</span>
          </div>

          {/* Additional info for approved */}
          {activeTab === "approved" && (
            <div className="mt-0.5 flex flex-col gap-1 text-gray-600 text-xs font-outfit">
              <span>
                <span className="font-medium text-gray-600">Approved At:</span>{" "}
                {formatDate(
                  appObj.app.status.approval.isApproved || appObj.app.createdAt
                )}
              </span>
              <span className="flex items-center gap-2">
                <span className="font-medium text-gray-600">Platform:</span>
                {appObj.app.details.appDetails.androidApk && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-sm font-poppins text-[10px]">
                    Android
                  </span>
                )}
                {appObj.app.details.appDetails.iosApk && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-sm font-poppins text-[10px]">
                    iOS
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Additional info for rejected */}
          {activeTab === "rejected" && (
            <div className="mt-0.5 flex flex-col gap-1 text-gray-600 text-xs font-outfit">
              <span>
                <span className="font-medium text-gray-600">Reason:</span>{" "}
                {appObj.app.status?.rejection?.reason || "Error fetching data."}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AppSkeleton = () => {
  return (
    <div className="p-4 bg-gray-100 rounded-2xl overflow-hidden relative animate-pulse">
      <div className="flex items-center gap-5">
        {/* App Icon */}
        <div className="w-14 h-14 rounded-lg bg-gray-200 relative overflow-hidden" />
        {/* App Info */}
        <div className="flex-1 space-y-2">
          <div className="h-5 w-26 rounded-lg bg-gray-200" />
          <div className="h-4 w-32 rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

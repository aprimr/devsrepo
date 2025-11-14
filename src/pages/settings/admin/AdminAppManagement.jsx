import { useEffect, useState, useMemo, useRef } from "react";
import {
  Search,
  ChevronLeft,
  MoreVertical,
  X,
  Trash2,
  Edit2,
  ChevronRight,
  ArrowDown01,
  ArrowDown10,
  ArrowDownAZ,
  ArrowDownZA,
  CheckCheck,
  CircleSlash,
  ArrowUpRight,
  Undo,
  Loader2,
  Package,
  CheckCircle,
  Clock,
  Ban,
  AlertCircle,
  Download,
  Star,
  DollarSign,
  Grid2X2Check,
  FilePlay,
  Wallet,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { formatDate } from "../../../utils/formatDate";
import { useSystemStore } from "../../../store/SystemStore";
import numberSuffixer from "../../../utils/numberSuffixer";
import { toast } from "sonner";
import { getFileURL } from "../../../services/appwriteStorage";
import { FaAndroid, FaApple } from "react-icons/fa";
import { IoLogoAndroid } from "react-icons/io";
import { calculateRating } from "../../../utils/calculateRating";
import { AiFillAndroid } from "react-icons/ai";

const AdminAppManagement = () => {
  const {
    publishedAppIds = [],
    pendingAppIds = [],
    rejectedAppIds = [],
    suspendedAppIds = [],
    getAppDetailsById,
    deleteAppById,
    updateAppStatus,
  } = useSystemStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("no_filter");
  const [activeTab, setActiveTab] = useState("published");
  const [isOptionsOpen, setIsOptionsOpen] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [allApps, setAllApps] = useState([]);

  // Popup States
  const [viewingDetails, setViewingDetails] = useState(null);

  const appsMapRef = useRef(new Map());

  // Get current app IDs based on active tab
  const getCurrentAppIds = () => {
    switch (activeTab) {
      case "submitted":
        return pendingAppIds;
      case "rejected":
        return rejectedAppIds;
      case "suspended":
        return suspendedAppIds;
      case "published":
      default:
        return publishedAppIds;
    }
  };

  useEffect(() => {
    const currentAppIds = getCurrentAppIds();

    if (currentAppIds.length === 0 && allApps.length === 0) {
      setIsLoading(false);
      return;
    }

    const currentIdsSet = new Set(currentAppIds);
    const existingIdsMap = appsMapRef.current;
    let didCancel = false;

    // Remove apps that are no longer in current list
    const idsToRemove = [];
    existingIdsMap.forEach((_, id) => {
      if (!currentIdsSet.has(id)) {
        idsToRemove.push(id);
      }
    });

    if (idsToRemove.length > 0) {
      setAllApps((prevApps) => {
        const updatedApps = prevApps.filter(
          (app) => !idsToRemove.includes(app.appId)
        );
        idsToRemove.forEach((id) => existingIdsMap.delete(id));
        return updatedApps;
      });
    }

    // Load new apps
    const newIds = currentAppIds.filter((id) => !existingIdsMap.has(id));

    if (newIds.length > 0) {
      if (allApps.length === 0) setIsLoading(true);

      const loadNewApps = async () => {
        try {
          const appDetailsList = await Promise.all(
            newIds.map((id) => getAppDetailsById(id))
          );

          if (didCancel) return;

          const validNewApps = appDetailsList.filter(
            (app) => app !== null && app !== undefined
          );

          setAllApps((prevApps) => {
            const finalApps = [...prevApps];
            validNewApps.forEach((newApp) => {
              if (newApp && newApp.appId) {
                existingIdsMap.set(newApp.appId, newApp);
                finalApps.push(newApp);
              }
            });
            return finalApps;
          });
        } catch (error) {
          console.error("Error fetching new apps:", error);
        } finally {
          if (!didCancel) {
            setIsLoading(false);
          }
        }
      };

      loadNewApps();
    } else if (currentAppIds.length === 0) {
      setIsLoading(false);
    }

    return () => {
      didCancel = true;
    };
  }, [activeTab, getAppDetailsById, isLoading]);

  const appsToDisplay = useMemo(() => {
    let list = allApps;
    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();

    // Search Filtering
    if (lowerCaseSearchTerm) {
      list = list.filter((app) => {
        const nameMatch = app.name?.toLowerCase().includes(lowerCaseSearchTerm);
        const developerMatch = app.developer?.name
          ?.toLowerCase()
          .includes(lowerCaseSearchTerm);
        const categoryMatch = app.category
          ?.toLowerCase()
          .includes(lowerCaseSearchTerm);
        const appIdMatch = app.appId
          ?.toLowerCase()
          .includes(lowerCaseSearchTerm);

        return nameMatch || developerMatch || categoryMatch || appIdMatch;
      });
    }

    // Sorting
    return list.slice().sort((a, b) => {
      switch (filterTerm) {
        case "downloads_high":
          return (b.metrics?.downloads || 0) - (a.metrics?.downloads || 0);
        case "downloads_low":
          return (a.metrics?.downloads || 0) - (b.metrics?.downloads || 0);
        case "rating_high":
          return (
            (b.metrics?.ratings?.average || 0) -
            (a.metrics?.ratings?.average || 0)
          );
        case "rating_low":
          return (
            (a.metrics?.ratings?.average || 0) -
            (b.metrics?.ratings?.average || 0)
          );
        case "name_az":
          return (a.name || "").localeCompare(b.name || "");
        case "name_za":
          return (b.name || "").localeCompare(a.name || "");
        case "date_new":
          return (b.createdAt || 0) - (a.createdAt || 0);
        case "date_old":
          return (a.createdAt || 0) - (b.createdAt || 0);
        case "updated_new":
          return (b.updatedAt || 0) - (a.updatedAt || 0);
        case "updated_old":
          return (a.updatedAt || 0) - (b.updatedAt || 0);
        default:
          return 0;
      }
    });
  }, [allApps, searchTerm, filterTerm]);

  const getTabCounts = () => {
    return {
      published: publishedAppIds?.length || 0,
      submitted: pendingAppIds?.length || 0,
      rejected: rejectedAppIds?.length || 0,
      suspended: suspendedAppIds?.length || 0,
    };
  };

  // Handle app status updates
  const handleApproveApp = async (appId) => {
    try {
      const result = await updateAppStatus(appId, "published");
      if (result.success) {
        toast.success("App approved successfully");
        setViewingDetails(null);
      } else {
        toast.error(result.error || "Failed to approve app");
      }
    } catch (error) {
      toast.error("Error approving app");
    }
  };

  const handleRejectApp = async (appId) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      const result = await updateAppStatus(appId, "rejected", reason);
      if (result.success) {
        toast.success("App rejected successfully");
        setViewingDetails(null);
      } else {
        toast.error(result.error || "Failed to reject app");
      }
    } catch (error) {
      toast.error("Error rejecting app");
    }
  };

  const handleSuspendApp = async (appId) => {
    const reason = prompt("Enter suspension reason:");
    if (!reason) return;

    try {
      const result = await updateAppStatus(appId, "suspended", reason);
      if (result.success) {
        toast.success("App suspended successfully");
        setViewingDetails(null);
      } else {
        toast.error(result.error || "Failed to suspend app");
      }
    } catch (error) {
      toast.error("Error suspending app");
    }
  };

  const handleRestoreApp = async (appId) => {
    try {
      const result = await updateAppStatus(appId, "published");
      if (result.success) {
        toast.success("App restored successfully");
        setViewingDetails(null);
      } else {
        toast.error(result.error || "Failed to restore app");
      }
    } catch (error) {
      toast.error("Error restoring app");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
          <LoadingSkeletonSearch />
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  const isFilterActive = searchTerm || filterTerm !== "no_filter";

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        {/* App Status Tabs */}
        <div className="mb-2">
          <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
            {[
              {
                key: "published",
                label: "Published",
                icon: <Grid2X2Check size={16} />,
              },
              { key: "submitted", label: "Pending", icon: <Clock size={16} /> },
              { key: "rejected", label: "Rejected", icon: <Ban size={16} /> },
              {
                key: "suspended",
                label: "Suspended",
                icon: <AlertCircle size={16} />,
              },
            ].map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-2 py-1 rounded-xl border-2 transition-all duration-200 shrink-0 ${
                    isActive
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-700 border-gray-200"
                  }`}
                >
                  {tab.icon}
                  <span className="font-normal text-sm whitespace-nowrap">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterTerm={filterTerm}
          setFilterTerm={setFilterTerm}
          totalApps={appsToDisplay.length}
          isFiltering={isFilterActive}
          activeTab={activeTab}
        />

        <div className="space-y-4">
          {/* Table View for Desktop */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto shadow-sm">
              <table className="w-full min-w-[1000px] text-sm text-left">
                <thead className="bg-linear-to-r from-green-50 to-green-100 text-green-900 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">App</th>
                    <th className="px-6 py-4 font-semibold">Developer</th>
                    <th className="px-6 py-4 font-semibold">Platform - Size</th>
                    <th className="px-6 py-4 font-semibold">Version</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {appsToDisplay.map((app, i) => (
                    <AppTableRow
                      key={app.appId}
                      app={app}
                      index={i}
                      isOptionsOpen={isOptionsOpen}
                      setIsOptionsOpen={setIsOptionsOpen}
                      setViewingDetails={setViewingDetails}
                      status={activeTab}
                      onStatusUpdate={updateAppStatus}
                      onDeleteApp={deleteAppById}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card View for Mobile & Tablet */}
          <div className="lg:hidden space-y-3">
            {appsToDisplay.map((app) => (
              <AppCard
                key={app.appId}
                app={app}
                isOptionsOpen={isOptionsOpen}
                setIsOptionsOpen={setIsOptionsOpen}
                setViewingDetails={setViewingDetails}
                status={activeTab}
                onStatusUpdate={updateAppStatus}
                onDeleteApp={deleteAppById}
              />
            ))}
          </div>

          {/* Empty States */}
          {appsToDisplay.length === 0 && (
            <div className="text-center py-12 px-4">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <Package size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg mb-2">
                  {searchTerm
                    ? `No results found for "${searchTerm}"`
                    : allApps.length > 0
                    ? "No apps matched the current filter criteria."
                    : `No ${getStatusConfig(
                        activeTab
                      ).label.toLowerCase()} apps found.`}
                </p>
                <p className="text-gray-400 text-sm">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Check back later for new apps"}
                </p>
              </div>
            </div>
          )}

          {appsToDisplay.length > 0 && (
            <div className="text-center pt-2 pb-4">
              <p className="text-sm text-gray-500">
                Showing {appsToDisplay.length} apps
              </p>
            </div>
          )}

          {/* View Details Modal */}
          {viewingDetails && (
            <ViewDetailsModal
              viewingDetails={viewingDetails}
              activeTab={activeTab}
              onClose={() => setViewingDetails(null)}
              onApprove={handleApproveApp}
              onReject={handleRejectApp}
              onSuspend={handleSuspendApp}
              onRestore={handleRestoreApp}
            />
          )}
        </div>

        <div className="h-6 w-full" />
      </div>
    </div>
  );
};

// Header Component
const Header = () => (
  <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
    <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
      <NavLink to={-1} className="flex items-center gap-2 text-gray-800">
        <ChevronLeft size={26} />
        <span className="text-lg sm:text-2xl py-1.5 font-medium tracking-tight">
          App Management
        </span>
      </NavLink>
    </div>
  </nav>
);

// SearchAndFilter Component
const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  filterTerm,
  setFilterTerm,
  totalApps,
  isFiltering,
  activeTab,
}) => {
  const getStatusConfig = (status) => {
    const configs = {
      published: { label: "Published", color: "text-green-600" },
      submitted: { label: "Pending", color: "text-blue-600" },
      rejected: { label: "Rejected", color: "text-red-600" },
      suspended: { label: "Suspended", color: "text-orange-600" },
    };
    return configs[status] || configs.published;
  };

  const statusConfig = getStatusConfig(activeTab);

  return (
    <div className="flex flex-col gap-4 mb-4 font-poppins">
      {/* Search Row */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="w-full sm:flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by app name, developer, or category..."
            className="w-full border border-gray-300 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all duration-200"
          />
          {searchTerm && (
            <X
              onClick={() => setSearchTerm("")}
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
            />
          )}
        </div>

        {/* Total Apps / Results */}
        <div className="flex items-center gap-2 font-medium text-sm sm:text-base">
          <span className="text-gray-700">
            {isFiltering ? "Results:" : "Total:"}
          </span>
          <span className="text-gray-900 font-outfit">{totalApps}</span>
          <span className="text-gray-500 text-sm">
            {isFiltering ? "filtered" : statusConfig.label.toLowerCase()}
          </span>
        </div>
      </div>

      {/* Filter Row */}
      {!searchTerm && (
        <div className="relative z-30 flex items-center">
          <div className="absolute left-0 z-10 h-full flex items-center pr-2 bg-linear-to-r from-gray-50 via-gray-50/90 to-gray-50/10 pointer-events-none w-10">
            <ChevronLeft className="text-gray-400" size={18} />
          </div>

          <div className="flex overflow-x-auto items-center gap-2 sm:gap-3 no-scrollbar py-2 pl-6 pr-6">
            {[
              {
                label: "No Filter",
                value: "no_filter",
                icon: <CircleSlash size={13} className="text-gray-500" />,
              },
              {
                label: "Most Downloads",
                value: "downloads_high",
                icon: <Download size={13} className="text-gray-500" />,
              },
              {
                label: "Least Downloads",
                value: "downloads_low",
                icon: <Download size={13} className="text-gray-500" />,
              },
              {
                label: "Highest Rating",
                value: "rating_high",
                icon: <Star size={13} className="text-gray-500" />,
              },
              {
                label: "Lowest Rating",
                value: "rating_low",
                icon: <Star size={13} className="text-gray-500" />,
              },
              {
                label: "Name A-Z",
                value: "name_az",
                icon: <ArrowDownAZ size={13} className="text-gray-500" />,
              },
              {
                label: "Name Z-A",
                value: "name_za",
                icon: <ArrowDownZA size={13} className="text-gray-500" />,
              },
              {
                label: "Date (Newest)",
                value: "date_new",
                icon: <ArrowDown01 size={13} className="text-gray-500" />,
              },
              {
                label: "Date (Oldest)",
                value: "date_old",
                icon: <ArrowDown10 size={13} className="text-gray-500" />,
              },
            ].map((chip) => (
              <button
                key={chip.value}
                onClick={() => setFilterTerm(chip.value)}
                className={`flex items-center gap-1.5 px-2 py-1 text-nowrap rounded-lg text-xs border-2 transition-all duration-200 shrink-0 ${
                  chip.value === filterTerm
                    ? "bg-green-50 text-green-700 border-green-500"
                    : "border-gray-300 bg-gray-50 text-gray-700"
                }`}
              >
                {chip.value === filterTerm ? (
                  <CheckCheck size={12} className="text-green-700" />
                ) : (
                  <span>{chip.icon}</span>
                )}
                <span>{chip.label}</span>
              </button>
            ))}
          </div>

          <div className="absolute right-0 z-10 h-full flex items-center pl-2 bg-linear-to-l from-gray-50 via-gray-50/90 to-gray-50/10 pointer-events-none w-10">
            <ChevronRight className="text-gray-400" size={18} />
          </div>
        </div>
      )}
    </div>
  );
};

// AppTableRow Component
const AppTableRow = ({
  app,
  index,
  isOptionsOpen,
  setIsOptionsOpen,
  setViewingDetails,
  status,
  onStatusUpdate,
  onDeleteApp,
}) => (
  <tr
    className={`hover:bg-green-50/50 transition-colors duration-150 ${
      index % 2 === 0 ? "bg-white" : "bg-gray-50"
    }`}
  >
    <td className="pl-6 py-4">
      <div className="flex items-center gap-3">
        <img
          src={getFileURL(app.details.media.icon)}
          alt={app.details.media.icon}
          className="w-12 h-12 rounded-xl border border-gray-200 shadow-sm object-cover"
          onError={(e) => {
            e.target.src = "https://placehold.co/48x48/CCCCCC/333333?text=App";
          }}
        />
        <div className="min-w-0 flex-1">
          <div className="font-medium text-gray-900 truncate max-w-[200px]">
            {app.details.name}
          </div>
          <div className="text-gray-500 text-sm font-mono pt-0.5 truncate max-w-[200px]">
            {app.appId}
          </div>
        </div>
      </div>
    </td>
    <td className="pl-4 py-4 text-gray-600 max-w-[150px] truncate text-sm">
      <div
        title={`${app.developer.name} - ${app.developer.email}`}
        className="min-w-0 flex-1"
      >
        <div className="font-medium text-gray-900 truncate max-w-[200px]">
          {app.developer.name}
        </div>
        <div className="text-gray-500 text-sm font-mono pt-0.5 truncate max-w-[200px]">
          {app.developer.email}
        </div>
      </div>
    </td>
    <td className="pl-4 py-4 text-gray-600 max-w-[120px] truncate text-xs capitalize">
      <div className="flex gap-1 flex-row">
        {app.details.appDetails.androidApk && "APK"}
        {app.details.appDetails.androidApk &&
          !app.details.appDetails.iosApk &&
          " / "}
        {!app.details.appDetails.iosApk && "IPA"}
        <div className="flex items-center gap-2 ml-1 ">
          <div className="h-1 w-1 rounded-full bg-gray-800" />
          <p>
            {app.details.appDetails.apkFileSizeMB ||
              app.details.appDetails.ipaFileSizeMB}{" "}
            MB
          </p>
        </div>
      </div>
    </td>
    <td className="pl-4 py-4 text-gray-600 text-sm">
      {app.details.appDetails.version}
    </td>
    <td className="pl-4 py-4 text-gray-600 text-sm">{app.details.category}</td>
    <td className="pl-4 py-4 text-gray-600 text-sm">
      <div className="flex items-center gap-1">{app.details.type}</div>
    </td>
    <td className="pl-4 py-4">
      <Actions
        app={app}
        isOptionsOpen={isOptionsOpen}
        setIsOptionsOpen={setIsOptionsOpen}
        setViewingDetails={setViewingDetails}
        status={status}
        onStatusUpdate={onStatusUpdate}
        onDeleteApp={onDeleteApp}
      />
    </td>
  </tr>
);

// AppCard Component
const AppCard = ({
  app,
  isOptionsOpen,
  setIsOptionsOpen,
  setViewingDetails,
  status,
  onStatusUpdate,
  onDeleteApp,
}) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-start gap-3">
      {/* App Icon */}
      <div className="flex flex-col items-center">
        <img
          src={getFileURL(app?.details?.media?.icon)}
          alt={app.details.name}
          className="w-14 h-14 rounded-xl border border-gray-200 shadow-sm object-cover"
          onError={(e) => {
            e.target.src = "https://placehold.co/56x56/CCCCCC/333333?text=App";
          }}
        />
        <a
          href={app.details.sourceCodeLink}
          target="_blank"
          className="text-sm font-outfit text-green-600 underline mt-1"
        >
          source
        </a>
        <p className="text-sm font-outfit text-gray-600">
          v {app.details?.appDetails?.version}
        </p>

        <div className="flex items-center justify-between gap-4 mt-1">
          {app.details.appDetails.androidApk && <IoLogoAndroid size={18} />}
          {app.details.appDetails.androidApk && <FaApple size={18} />}
        </div>
      </div>
      {/* Detail */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-gray-900 truncate">
              {app.details.name}
            </h3>
            <code className="text-gray-500 text-xs mt-1 px-2 py-0.5 font-mono bg-gray-100 rounded-sm">
              appId : {app.appId}
            </code>
            <p className="text-gray-500 text-xs mt-1 py-0.5 font-mono truncate">
              {app.developer.email}
            </p>
          </div>
        </div>
        <div className="mt-2 space-y-1.5 text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span className="capitalize bg-yellow-100 text-yellow-700 px-1.5 py-0.5 text-xs rounded">
              {app.details.category}
            </span>
            <span className="capitalize bg-blue-100 text-blue-600 px-1.5 text-xs py-0.5 rounded">
              {app.details.type}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {app.details.hasAds && (
              <span className="flex flex-row gap-0.5 items-center px-1.5 py-0.5 rounded-md bg-pink-200/70 text-pink-700 text-xs font-poppins  mt-1">
                <FilePlay size={12} />
                Ads
              </span>
            )}
            {!app.details.inAppPurchases && (
              <span className="flex flex-row gap-0.5 items-center px-1.5 py-0.5 rounded-md bg-emerald-200/70 text-emerald-700 text-xs font-poppins  mt-1">
                <Wallet size={12} />
                In-app Purchases
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <p className="text-gray-500 font-medium text-xs">File Size:</p>
            <p className="text-gray-500 text-xs">
              {app.details.appDetails.apkFileSizeMB ||
                app.details.appDetails.ipaFileSizeMB}{" "}
              MB
            </p>
          </div>
          <div className="flex gap-2">
            <p className="text-gray-500 font-medium text-xs">Uploaded At:</p>
            <p className="text-gray-500 text-xs">{formatDate(app.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
      <button
        onClick={() => setViewingDetails(app)}
        className="bg-green-500 text-white hover:bg-green-600 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors duration-200"
      >
        View Details
      </button>
      <Actions
        app={app}
        isOptionsOpen={isOptionsOpen}
        setIsOptionsOpen={setIsOptionsOpen}
        setViewingDetails={setViewingDetails}
        status={status}
        onStatusUpdate={onStatusUpdate}
        onDeleteApp={onDeleteApp}
        isMobile={true}
      />
    </div>
  </div>
);

// Actions Component
const Actions = ({
  app,
  isOptionsOpen,
  setIsOptionsOpen,
  setViewingDetails,
  status,
  onStatusUpdate,
  onDeleteApp,
  isMobile = false,
}) => {
  const [loading, setLoading] = useState({ deleting: "", updating: "" });

  const handleDeleteApp = async () => {
    if (!app?.appId) return toast.error("Invalid app data");
    setLoading((prev) => ({ ...prev, deleting: app.appId }));
    try {
      const res = await onDeleteApp(app.appId);
      if (res?.success) {
        toast.success("App deleted successfully");
      } else {
        toast.error(res?.error || "Failed to delete app.");
      }
    } catch (error) {
      toast.error("Error deleting app.");
    } finally {
      setLoading((prev) => ({ ...prev, deleting: "" }));
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!app?.appId) return toast.error("Invalid app data");
    setLoading((prev) => ({ ...prev, updating: app.appId }));
    try {
      let reason = "";
      if (newStatus === "rejected" || newStatus === "suspended") {
        reason = prompt(`Enter ${newStatus} reason:`) || "";
        if (!reason) {
          setLoading((prev) => ({ ...prev, updating: "" }));
          return;
        }
      }
      const res = await onStatusUpdate(app.appId, newStatus, reason);
      if (res?.success) {
        toast.success(`App ${newStatus} successfully`);
      } else {
        toast.error(res?.error || `Failed to ${newStatus} app.`);
      }
    } catch (error) {
      toast.error(`Error ${newStatus} app.`);
    } finally {
      setLoading((prev) => ({ ...prev, updating: "" }));
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() =>
          setIsOptionsOpen(isOptionsOpen === app.appId ? "" : app.appId)
        }
        className="text-gray-600 bg-gray-100 hover:text-gray-800 p-1.5 rounded-lg hover:bg-gray-200 transition-colors duration-200"
      >
        {isOptionsOpen === app.appId ? (
          <X size={16} />
        ) : (
          <MoreVertical size={16} />
        )}
      </button>

      {isOptionsOpen === app.appId && (
        <div
          className={`absolute ${
            isMobile ? "right-8 -top-30" : "right-30 -top-2"
          } mt-2 w-44 bg-white/30 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg z-50 flex flex-col divide-y divide-gray-100`}
        >
          <button
            onClick={() => setViewingDetails(app)}
            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 transition-colors duration-200 rounded-t-xl"
          >
            <ArrowUpRight size={16} /> View Details
          </button>

          {status === "submitted" && (
            <>
              <button
                onClick={() => handleStatusUpdate("published")}
                className="flex items-center gap-2 px-4 py-3 text-sm text-green-600 hover:bg-green-50 transition-colors duration-200"
              >
                <CheckCircle size={16} /> Approve
              </button>
              <button
                onClick={() => handleStatusUpdate("rejected")}
                className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <Ban size={16} /> Reject
              </button>
            </>
          )}

          {status === "published" && (
            <button
              onClick={() => handleStatusUpdate("suspended")}
              className="flex items-center gap-2 px-4 py-3 text-sm text-orange-600 hover:bg-orange-50 transition-colors duration-200"
            >
              <AlertCircle size={16} /> Suspend
            </button>
          )}

          {(status === "rejected" || status === "suspended") && (
            <button
              onClick={() => handleStatusUpdate("published")}
              className="flex items-center gap-2 px-4 py-3 text-sm text-green-600 hover:bg-green-50 transition-colors duration-200"
            >
              <Undo size={16} /> Restore
            </button>
          )}

          <button
            disabled={loading.deleting === app.appId}
            onClick={handleDeleteApp}
            className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors duration-200 rounded-b-xl ${
              loading.deleting === app.appId
                ? "text-gray-400 cursor-not-allowed bg-gray-50"
                : "text-red-600 hover:bg-red-50"
            }`}
          >
            {loading.deleting === app.appId ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete App</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

// ViewDetailsModal Component
const ViewDetailsModal = ({
  viewingDetails,
  activeTab,
  onClose,
  onApprove,
  onReject,
  onSuspend,
  onRestore,
}) => {
  const getStatusConfig = (status) => {
    const configs = {
      published: {
        icon: <CheckCircle size={12} />,
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Published",
      },
      submitted: {
        icon: <Clock size={12} />,
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Pending",
      },
      rejected: {
        icon: <Ban size={12} />,
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Rejected",
      },
      suspended: {
        icon: <AlertCircle size={12} />,
        color: "bg-orange-100 text-orange-800 border-orange-200",
        label: "Suspended",
      },
    };
    return configs[status] || configs.published;
  };

  const statusConfig = getStatusConfig(activeTab);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-md z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl font-poppins relative animate-in fade-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 p-6 shrink-0">
          <h2 className="text-xl font-medium text-gray-900">App Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 bg-gray-200/70 text-gray-600 rounded-lg transition hover:bg-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Data */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT */}
            <div className="flex flex-col items-center lg:items-start lg:w-2/5 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-gray-200 pb-6 lg:pb-0 lg:pr-6 space-y-4">
              {/* Icon + Banner */}
              <div className="relative h-26 mt-3 w-full mb-3">
                <img
                  src={getFileURL(viewingDetails.details.media.icon)}
                  className="absolute left-2 w-24 h-24 rounded-2xl object-cover border-3 border-white z-50"
                />
                <img
                  src={getFileURL(viewingDetails.details.media.banner)}
                  className="absolute -top-5 w-full h-20 object-cover z-0 rounded-lg"
                />
                <div
                  className={`absolute right-2 bottom-2 flex items-center gap-1 px-2 py-1 rounded-lg border ${statusConfig.color} z-10`}
                >
                  {statusConfig.icon}
                  <span className="text-sm">{statusConfig.label}</span>
                </div>

                {(viewingDetails.details.appDetails.androidApk ||
                  viewingDetails.details.appDetails.iosApk) && (
                  <div className="absolute right-1 -top-4 px-1.5 py-0.5 bg-white rounded-md flex items-center gap-1 z-10">
                    {viewingDetails.details.appDetails.androidApk && (
                      <AiFillAndroid />
                    )}
                    {viewingDetails.details.appDetails.iosApk && <FaApple />}
                  </div>
                )}
              </div>

              {/* Name + Version */}
              <div className="space-y-1 w-full">
                <p className="text-lg font-medium text-gray-900 truncate max-w-full">
                  {viewingDetails?.details.name}
                </p>

                <code className="text-gray-700 text-sm break-all">
                  appId: {viewingDetails?.appId}
                </code>

                <div className="grid grid-cols-2 font-outfit gap-3 text-sm mt-1">
                  <p className="text-gray-500">
                    {viewingDetails?.details.category}
                  </p>
                  <p className="text-gray-500">
                    {viewingDetails?.details.type}
                  </p>
                </div>

                <div className="grid grid-cols-2 font-outfit gap-3 text-sm  mb-3">
                  <p className="text-gray-500">
                    v{viewingDetails?.details.appDetails?.version}
                  </p>
                  <p className="text-gray-500">
                    {viewingDetails?.details.appDetails?.apkFileSizeMB ||
                      (viewingDetails?.details.appDetails?.ipaFileSizeMB &&
                        `${
                          viewingDetails.details.appDetails.apkFileSizeMB ||
                          viewingDetails?.details.appDetails?.ipaFileSizeMB
                        }`)}{" "}
                    MB
                  </p>
                </div>

                <a
                  href={viewingDetails.details.sourceCodeLink}
                  target="_blank"
                  className="w-full flex gap-1 justify-center items-center bg-green-500 text-white font-medium rounded-md px-3 py-1.5"
                >
                  <p>Source Code</p>
                  <ArrowUpRight size={18} />
                </a>
                {viewingDetails.details.media.promoVideoURL && (
                  <a
                    href={viewingDetails.details.media.promoVideoURL}
                    target="_blank"
                    className="w-full flex gap-1 justify-center items-center bg-blue-500 text-white font-medium rounded-md px-3 py-1.5"
                  >
                    <p>Intro Video</p>
                    <ArrowUpRight size={18} />
                  </a>
                )}
              </div>

              {/* Developer */}
              <div className="w-full space-y-1 pt-1 border-t-2 border-gray-200">
                <p className="text-gray-600 font-medium mt-1">
                  {viewingDetails.developer.name}
                </p>
                <p className="text-gray-500">
                  {viewingDetails.developer.email}
                </p>
                <p className="text-gray-500">
                  devId: {viewingDetails.developer.developerId}
                </p>
              </div>

              {/* Stats */}
              <div className="w-full space-y-1 pt-2 border-t-2 border-gray-200">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-800">Downloads:</span>
                  <span className="text-gray-500">
                    {numberSuffixer(viewingDetails?.metrics?.downloads)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-800">Rating:</span>
                  <span className="text-gray-500 flex items-center gap-1">
                    <Star
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    {calculateRating(viewingDetails.metrics.ratings.breakdown)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-800">
                    Contain Ads:
                  </span>
                  <span className="text-gray-500">
                    {viewingDetails?.details.hasAds ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-800">
                    In-App Purchases:
                  </span>
                  <span className="text-gray-500">
                    {viewingDetails?.details.inAppPurchases ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex-1 space-y-6 text-gray-700 text-sm">
              {/* Screenshots */}
              <div>
                <div className="h-48 w-full flex gap-3 overflow-y-scroll no-scrollbar pr-1">
                  {viewingDetails.details.media.screenshots.map((ss, i) => (
                    <img
                      key={i}
                      src={getFileURL(ss)}
                      className="h-full rounded-md"
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <p className="mt-1 text-gray-700 font-medium leading-relaxed">
                  {viewingDetails?.details.description?.short}
                </p>
                <details className="group cursor-pointer">
                  <summary className="list-none">
                    <p className="line-clamp-3 group-open:line-clamp-none text-gray-700">
                      {viewingDetails?.details.description?.long}
                    </p>
                  </summary>
                </details>
              </div>

              {/* More details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-800">Age Rating:</span>
                  <p className="text-gray-500 mt-1">
                    {viewingDetails?.details.ageRating || "Not specified"}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-800">Type:</span>
                  <p className="text-gray-500 mt-1">
                    {viewingDetails?.type || "Mobile App"}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-800">
                    Contact Email:
                  </span>
                  <p className="text-gray-500 mt-1 break-all">
                    {viewingDetails?.links?.contactEmail || "Not provided"}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-800">
                    Privacy Policy:
                  </span>
                  <p className="text-gray-500 mt-1 truncate">
                    {viewingDetails?.links?.privacyPolicyUrl || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <span className="font-medium text-gray-800">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {viewingDetails?.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reasons */}
              {viewingDetails?.status?.rejection?.reason && (
                <div className="space-y-1">
                  <span className="font-medium text-gray-800">
                    Rejection Reason:
                  </span>
                  <p className="text-gray-500">
                    {viewingDetails.status.rejection.reason}
                  </p>
                </div>
              )}

              {viewingDetails?.status?.suspension?.reason && (
                <div className="space-y-1">
                  <span className="font-medium text-gray-800">
                    Suspension Reason:
                  </span>
                  <p className="text-gray-500">
                    {viewingDetails.status.suspension.reason}
                  </p>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-800">Created:</span>
                  <p className="text-gray-500 mt-1">
                    {formatDate(viewingDetails.createdAt) || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">
                    Last Updated:
                  </span>
                  <p className="text-gray-500 mt-1">
                    {formatDate(viewingDetails.updatedAt) || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center border-t border-gray-200 p-6 \shrink-0">
          {activeTab === "submitted" && (
            <>
              <button
                onClick={() => onApprove(viewingDetails.appId)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm bg-green-500 text-white hover:bg-green-600"
              >
                <CheckCircle size={16} />
                <span>Approve App</span>
              </button>

              <button
                onClick={() => onReject(viewingDetails.appId)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600"
              >
                <Ban size={16} />
                <span>Reject App</span>
              </button>
            </>
          )}

          {activeTab === "published" && (
            <button
              onClick={() => onSuspend(viewingDetails.appId)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm bg-orange-500 text-white hover:bg-orange-600"
            >
              <AlertCircle size={16} />
              <span>Suspend App</span>
            </button>
          )}

          {(activeTab === "rejected" || activeTab === "suspended") && (
            <button
              onClick={() => onRestore(viewingDetails.appId)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm bg-green-500 text-white hover:bg-green-600"
            >
              <Undo size={16} />
              <span>Restore App</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Loading Components
const LoadingSkeletonSearch = () => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 font-poppins">
    <div className="w-full sm:flex-1 relative">
      <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse"></div>
    </div>
    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
  </div>
);

const LoadingSkeleton = () => (
  <>
    <div className="hidden lg:block">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto shadow-sm">
        <table className="w-full min-w-[1000px] text-sm text-left">
          <thead className="bg-linear-to-r from-green-50 to-green-100 text-green-900 uppercase text-xs tracking-wider">
            <tr>
              {[
                "App",
                "Developer",
                "Category",
                "Downloads",
                "Rating",
                "Status",
                "Actions",
              ].map((_, idx) => (
                <th key={idx} className="px-6 py-4">
                  <div className="h-4 my-1 bg-green-200 rounded w-16 animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[...Array(5)].map((_, i) => (
              <tr
                key={i}
                className={`h-16 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                {[...Array(7)].map((__, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <div className="lg:hidden space-y-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-xl bg-gray-200 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="space-y-1 mt-2">
                <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-gray-200">
            <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default AdminAppManagement;

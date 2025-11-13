import { useEffect, useState, useMemo, useRef } from "react";
import {
  Search,
  ChevronLeft,
  MoreVertical,
  X,
  Trash2,
  Edit2,
  Activity,
  Slash,
  ChevronRight,
  ArrowDown01,
  ArrowDown10,
  ArrowDownAZ,
  ArrowDownZA,
  AArrowDown,
  AArrowUp,
  CheckCheck,
  CircleSlash,
  ArrowUpRight,
  Users,
  EllipsisVertical,
  Undo,
  Loader2,
  Code2,
  Laptop,
  BadgeCheck,
  ShieldUser,
  Shield,
  UserRoundCheck,
} from "lucide-react";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/formatDate";
import { useSystemStore } from "../../../store/SystemStore";
import numberSuffixer from "../../../utils/numberSuffixer";
import { toast } from "sonner";

const AdminDeveloperManagement = () => {
  const {
    developerIds,
    getUserDetailsById,
    toggleDevVerifyStatus,
    toggleAdminStatus,
  } = useSystemStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("no_filter");
  const [isOptionsOpen, setIsOptionsOpen] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [allDevelopers, setAllDevelopers] = useState([]);

  // Popup States
  const [viewingDetails, setViewingDetails] = useState(""); // store the developer's id
  const [editingDetails, setEditingDetails] = useState(""); // store the developer's id
  const [veifyingUser, setVerifyingUser] = useState(false);
  const [togglingAdmin, setTogglingAdmin] = useState(false);

  const developersMapRef = useRef(new Map());

  useEffect(() => {
    if (
      !developerIds ||
      (developerIds.length === 0 && allDevelopers.length === 0)
    ) {
      if (!developerIds || developerIds.length === 0) setIsLoading(false);
      return;
    }

    const currentUidsSet = new Set(developerIds);
    const existingUidsMap = developersMapRef.current;
    let didCancel = false;

    const uidsToRemove = [];
    existingUidsMap.forEach((_, uid) => {
      if (!currentUidsSet.has(uid)) {
        uidsToRemove.push(uid);
      }
    });

    if (uidsToRemove.length > 0) {
      setAllDevelopers((prevDevelopers) => {
        const updatedDevelopers = prevDevelopers.filter(
          (developer) => !uidsToRemove.includes(developer.uid)
        );
        uidsToRemove.forEach((uid) => existingUidsMap.delete(uid));
        return updatedDevelopers;
      });
    }

    const newUids = developerIds.filter((uid) => !existingUidsMap.has(uid));

    if (newUids.length > 0) {
      if (allDevelopers.length === 0) setIsLoading(true);

      const loadNewDevelopers = async () => {
        try {
          const developerDetailsList = await Promise.all(
            newUids.map((uid) => getUserDetailsById(uid))
          );

          if (didCancel) return;

          const validNewDevelopers = developerDetailsList.filter(
            (developer) => developer !== null
          );

          setAllDevelopers((prevDevelopers) => {
            const finalDevelopers = [...prevDevelopers];

            validNewDevelopers.forEach((newDeveloper) => {
              existingUidsMap.set(newDeveloper.uid, newDeveloper);
              finalDevelopers.push(newDeveloper);
            });

            return finalDevelopers;
          });
        } catch (error) {
          console.error("Error fetching new developers:", error);
        } finally {
          if (!didCancel && allDevelopers.length === 0) {
            setIsLoading(false);
          }
        }
      };

      loadNewDevelopers();
    }

    if (!isLoading && developerIds.length > 0) {
      const updateChecks = [];
      existingUidsMap.forEach((existingDeveloper, uid) => {
        if (currentUidsSet.has(uid)) {
          updateChecks.push(
            getUserDetailsById(uid).then((latestDeveloper) => {
              if (
                latestDeveloper &&
                JSON.stringify(latestDeveloper) !==
                  JSON.stringify(existingDeveloper)
              ) {
                return latestDeveloper;
              }
              return null;
            })
          );
        }
      });

      Promise.all(updateChecks).then((updatedDevelopers) => {
        if (didCancel) return;
        const validUpdates = updatedDevelopers.filter((u) => u !== null);

        if (validUpdates.length > 0) {
          setAllDevelopers((prevDevelopers) => {
            const nextDevelopers = [...prevDevelopers];

            validUpdates.forEach((updatedDeveloper) => {
              const index = nextDevelopers.findIndex(
                (u) => u.uid === updatedDeveloper.uid
              );
              if (index !== -1) {
                nextDevelopers[index] = updatedDeveloper;
                existingUidsMap.set(updatedDeveloper.uid, updatedDeveloper);
              }
            });
            return nextDevelopers;
          });
        }
      });
    }

    if (
      developerIds.length > 0 &&
      allDevelopers.length === developerIds.length
    ) {
      setIsLoading(false);
    }

    return () => {
      didCancel = true;
    };
  }, [developerIds, getUserDetailsById]);

  const developersToDisplay = useMemo(() => {
    let list = allDevelopers;
    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();

    // Search Filtering
    if (lowerCaseSearchTerm) {
      list = list.filter((developer) => {
        const nameMatch = developer.name
          ?.toLowerCase()
          .includes(lowerCaseSearchTerm);
        const emailMatch = developer.email
          ?.toLowerCase()
          .includes(lowerCaseSearchTerm);
        const usernameMatch = developer.username
          ?.toLowerCase()
          .includes(lowerCaseSearchTerm);

        return nameMatch || emailMatch || usernameMatch;
      });
    }

    // Sorting
    return list.slice().sort((a, b) => {
      switch (filterTerm) {
        case "admin":
          return (b.system?.isAdmin ? 1 : 0) - (a.system?.isAdmin ? 1 : 0);
        case "verified":
          return (
            (b.developerProfile?.verifiedDeveloper ? 1 : 0) -
            (a.developerProfile?.verifiedDeveloper ? 1 : 0)
          );
        case "join_new":
          return (b.createdAt || 0) - (a.createdAt || 0);
        case "join_old":
          return (a.createdAt || 0) - (b.createdAt || 0);
        case "last_active":
          const activityA = a.system?.lastActivity || a.createdAt || 0;
          const activityB = b.system?.lastActivity || b.createdAt || 0;
          return activityB - activityA;
        case "name_az":
          return (a.name || "").localeCompare(b.name || "");
        case "name_za":
          return (b.name || "").localeCompare(a.name || "");
        case "username_az":
          return (a.username || "").localeCompare(b.username || "");
        case "username_za":
          return (b.username || "").localeCompare(a.username || "");
        default:
          return 0;
      }
    });
  }, [allDevelopers, searchTerm, filterTerm]);

  const toggleDevVerification = async (userId) => {
    setVerifyingUser(true);
    try {
      const res = await toggleDevVerifyStatus(userId);
      if (res.success) {
        setVerifyingUser(false);
        setViewingDetails();
      }
      setVerifyingUser();
      setViewingDetails();
    } catch (error) {
      setVerifyingUser();
      setViewingDetails();
      toast.error("Error toggling admin status");
    }
  };

  const toggleAdmin = async (userId) => {
    setTogglingAdmin(true);
    try {
      const res = await toggleAdminStatus(userId);
      if (res.success) {
        setTogglingAdmin(false);
        setViewingDetails();
      }
      setTogglingAdmin();
      setViewingDetails();
    } catch (error) {
      setTogglingAdmin();
      setViewingDetails();
      toast.error("Error toggling admin status");
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
        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterTerm={filterTerm}
          setFilterTerm={setFilterTerm}
          totalDevelopers={developersToDisplay.length}
          isFiltering={isFilterActive}
        />

        <div className="space-y-4">
          {/* Table View for Desktop */}
          <div className="hidden md:block">
            <div className="bg-white rounded-xl border-3 border-gray-100 overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm text-left">
                <thead className="bg-blue-100 text-blue-700 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Developer</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Website</th>
                    <th className="px-6 py-4">Developer ID</th>
                    <th className="px-6 py-4">Developer Since</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {developersToDisplay.map((developer, i) => (
                    <DeveloperTableRow
                      key={developer.uid}
                      developer={developer}
                      index={i}
                      isOptionsOpen={isOptionsOpen}
                      setIsOptionsOpen={setIsOptionsOpen}
                      setViewingDetails={setViewingDetails}
                      setEditingDetails={setEditingDetails}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card View for Mobile */}
          <div className="md:hidden space-y-3">
            {developersToDisplay.map((developer) => (
              <DeveloperCard
                key={developer.uid}
                developer={developer}
                isOptionsOpen={isOptionsOpen}
                setIsOptionsOpen={setIsOptionsOpen}
                setViewingDetails={setViewingDetails}
                setEditingDetails={setEditingDetails}
              />
            ))}
          </div>

          {/* Empty States */}
          {developersToDisplay.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm
                  ? `No results found for "${searchTerm}". Please try a different term.`
                  : allDevelopers.length > 0
                  ? "No developers matched the current filter criteria."
                  : "No developers found in the system."}
              </p>
            </div>
          )}

          {developersToDisplay.length > 0 && (
            <div className="text-center pt-2">
              <p className="text-sm text-gray-500">
                End of list. Showing {developersToDisplay.length} developers.
              </p>
            </div>
          )}

          {/* View Details */}
          {viewingDetails && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-md z-50 px-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-5 sm:p-8 font-poppins relative animate-in fade-in duration-200 overflow-y-auto max-h-[90vh] sm:max-h-[85vh]">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-6">
                  <h2 className="text-xl font-medium font-poppins text-gray-900">
                    Developer Details
                  </h2>
                  <button
                    onClick={() => setViewingDetails("")}
                    className="p-1.5 bg-gray-200/70 text-gray-600 rounded-lg transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Data */}
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Profile Section */}
                  <div className="flex flex-col items-center lg:items-start lg:w-2/5 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0 lg:pr-6">
                    {/* Profile */}
                    <img
                      src={viewingDetails?.photoURL}
                      alt="Developer Avatar"
                      className="w-28 h-28 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                    />

                    {/* Info */}
                    <div className="mt-4 space-y-0.5">
                      <p className="flex items-center md:max-w-[200px] text-sm font-medium text-gray-900 truncate">
                        <span title={viewingDetails?.name} className="truncate">
                          {viewingDetails?.name}
                        </span>
                        {viewingDetails?.developerProfile
                          ?.verifiedDeveloper && (
                          <BadgeCheck
                            size={18}
                            fill="#3B82F6"
                            stroke="white"
                            className="ml-1 shrink-0"
                          />
                        )}
                      </p>
                      <p className="text-base text-gray-500 font-outfit">
                        @{viewingDetails?.username}
                      </p>
                      <p className="text-sm text-gray-500">
                        {viewingDetails?.email}
                      </p>
                    </div>

                    {/* Admin Badge */}
                    {viewingDetails.system.isAdmin && (
                      <div className="mt-3 flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-lg">
                        <Shield size={14} />
                        <span className="text-sm font-medium">Admin</span>
                      </div>
                    )}

                    {/* Social */}
                    <div className="mt-4 flex gap-4 space-y-0.5">
                      {viewingDetails?.socialLinks?.github && (
                        <a
                          href={viewingDetails?.socialLinks.github}
                          title={viewingDetails?.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaGithub size={16} />
                        </a>
                      )}
                      {viewingDetails?.socialLinks?.linkedin && (
                        <a
                          href={viewingDetails?.socialLinks.linkedin}
                          title={viewingDetails?.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaLinkedin size={16} />
                        </a>
                      )}
                      {viewingDetails?.socialLinks?.twitter && (
                        <a
                          href={viewingDetails?.socialLinks.twitter}
                          title={viewingDetails?.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaTwitter size={16} />
                        </a>
                      )}
                      {viewingDetails?.socialLinks?.youtube && (
                        <a
                          href={viewingDetails?.socialLinks.youtube}
                          title={viewingDetails?.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaYoutube size={16} />
                        </a>
                      )}
                      {viewingDetails?.socialLinks?.instagram && (
                        <a
                          href={viewingDetails?.socialLinks.instagram}
                          title={viewingDetails?.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaInstagram size={16} />
                        </a>
                      )}
                      {viewingDetails?.socialLinks?.facebook && (
                        <a
                          href={viewingDetails?.socialLinks.facebook}
                          title={viewingDetails?.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaFacebook size={16} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="flex-1 space-y-2 text-gray-700 text-sm overflow-y-auto pr-1">
                    <p>
                      <span className="font-medium text-gray-800">
                        Developer ID:
                      </span>{" "}
                      <code className="ml-1 px-1.5 py-1 text-gray-500 bg-gray-100 rounded-sm break-all">
                        {viewingDetails?.developerProfile.developerId}
                      </code>
                    </p>

                    <div className="flex flex-row items-center gap-8 mt-3">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-800">
                          Followers:
                        </span>
                        <span className="text-gray-500 font-outfit">
                          {numberSuffixer(
                            viewingDetails?.social?.followersIds?.length || 0
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-800">
                          Following:
                        </span>
                        <span className="text-gray-500 font-outfit">
                          {numberSuffixer(
                            viewingDetails?.social?.followingIds?.length || 0
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-8 mt-3">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-800">
                          Apps Published:
                        </span>
                        <span className="text-gray-500 font-outfit">
                          {numberSuffixer(
                            viewingDetails?.developerProfile.apps
                              .publishedAppIds.length || 0
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-800">
                          Apps Submitted:
                        </span>
                        <span className="text-gray-500 font-outfit">
                          {numberSuffixer(
                            viewingDetails?.developerProfile.apps
                              .submittedAppIds.length || 0
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-8 mt-3">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-800">
                          Rejected Apps:
                        </span>
                        <span className="text-gray-500 font-outfit">
                          {numberSuffixer(
                            viewingDetails?.developerProfile.apps.rejectedAppIds
                              .length || 0
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-800">
                          Suspended Apps:
                        </span>
                        <span className="text-gray-500 font-outfit">
                          {numberSuffixer(
                            viewingDetails?.developerProfile.apps
                              .suspendedAppIds.length || 0
                          )}
                        </span>
                      </div>
                    </div>

                    <p>
                      <span className="font-medium text-gray-800">
                        Website:
                      </span>
                      <span className="pl-1 text-gray-500">
                        {viewingDetails?.developerProfile.website.replace(
                          /^(https?:\/\/)?(www\.)?/i,
                          ""
                        ) || "No website added."}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">
                        Contact Email:
                      </span>
                      <span className="pl-1 text-gray-500">
                        {viewingDetails?.developerProfile.contactEmail}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">
                        Developer Since:
                      </span>{" "}
                      <span className="pl-1 text-gray-500">
                        {formatDate(
                          viewingDetails?.developerProfile.developerSince
                        )}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">
                        Last Login:
                      </span>{" "}
                      <span className="pl-1 text-gray-500">
                        {formatDate(viewingDetails?.lastLogin)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-3">
                  {/* Verify / Unverify Button */}
                  <button
                    onClick={() =>
                      !veifyingUser && toggleDevVerification(viewingDetails.uid)
                    }
                    disabled={veifyingUser}
                    className={`flex items-center gap-2 py-1.5 px-3 rounded-lg transition font-poppins text-sm
                      ${
                        veifyingUser
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : viewingDetails.developerProfile.verifiedDeveloper
                          ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
                          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      }`}
                  >
                    {veifyingUser ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : viewingDetails.developerProfile.verifiedDeveloper ? (
                      <>
                        <span>Unverify</span>
                      </>
                    ) : (
                      <>
                        <span>Verify</span>
                      </>
                    )}
                  </button>

                  {/* Make / Remove Admin Button */}
                  <button
                    onClick={() =>
                      !togglingAdmin && toggleAdmin(viewingDetails.uid)
                    }
                    disabled={togglingAdmin}
                    className={`flex items-center gap-2 py-1.5 px-3 rounded-lg transition font-poppins text-sm
                    ${
                      togglingAdmin
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : viewingDetails.system.isAdmin
                        ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
                        : "bg-green-100 text-green-600 hover:bg-green-200"
                    }`}
                  >
                    {togglingAdmin ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : viewingDetails.system.isAdmin ? (
                      <>
                        <span>Remove Admin</span>
                      </>
                    ) : (
                      <>
                        <span>Make Admin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Editing Details */}
          {editingDetails && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-md z-50 px-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 font-poppins relative animate-in fade-in duration-200 overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-6">
                  <h2 className="text-xl font-medium text-gray-900">
                    Edit Developer Details
                  </h2>
                  <button
                    onClick={() => setEditingDetails("")}
                    className="p-1.5 bg-gray-200/70 text-gray-600 rounded-lg transition hover:bg-gray-300"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-full" />
      </div>
    </div>
  );
};

const Header = () => (
  <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
    <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
      <NavLink to={-1} className="flex items-center gap-2 text-gray-800">
        <ChevronLeft size={26} />
        <span className="text-lg sm:text-2xl py-1.5 font-medium tracking-tight">
          Developer Management
        </span>
      </NavLink>
    </div>
  </nav>
);

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  filterTerm,
  setFilterTerm,
  totalDevelopers,
  isFiltering,
}) => (
  <div className="flex flex-col gap-4 mb-4 font-poppins">
    {/* Search Row */}
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      {/* Search Bar */}
      <div className="w-full md:w-1/2 sm:w-auto flex-1 relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Name, Email, or Username..."
          className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
        />
        <X
          onClick={() => setSearchTerm("")}
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
        />
      </div>

      {/* Total Developers / Results */}
      <div className="flex items-center gap-2 font-medium text-sm sm:text-base">
        <span className="text-gray-700">
          {isFiltering ? "Results Shown:" : "Total Developers:"}
        </span>
        <span className="text-gray-900 font-outfit">{totalDevelopers}</span>
        {isFiltering && (
          <span className="text-xs text-gray-500 ml-1">(active view)</span>
        )}
      </div>
    </div>

    {/* Filter Row */}
    {!searchTerm && (
      <div className="relative z-30 flex items-center px-4 sm:px-6">
        <div className="absolute left-0 z-10 h-full flex items-center pr-2 bg-linear-to-r from-gray-50 via-gray-50/90 to-gray-50/40 pointer-events-none w-10">
          <ChevronLeft className="text-gray-400 animate-pulse" size={18} />
        </div>

        <div className="flex overflow-x-auto items-center gap-2 sm:gap-3 no-scrollbar py-2">
          {[
            {
              label: "No Filter",
              value: "no_filter",
              icon: <CircleSlash size={13} className="text-gray-500" />,
            },
            {
              label: "Admin",
              value: "admin",
              icon: <Shield size={13} className="text-gray-500" />,
            },
            {
              label: "Verified",
              value: "verified",
              icon: <UserRoundCheck size={13} className="text-gray-500" />,
            },
            {
              label: "Join Date (Newest)",
              value: "join_new",
              icon: <ArrowDown01 size={14} className="text-gray-500" />,
            },
            {
              label: "Join Date (Oldest)",
              value: "join_old",
              icon: <ArrowDown10 size={14} className="text-gray-500" />,
            },
            {
              label: "Last Activity",
              value: "last_activity",
              icon: <Activity size={14} className="text-gray-500" />,
            },
            {
              label: "Name (A–Z)",
              value: "name_az",
              icon: <ArrowDownAZ size={14} className="text-gray-500" />,
            },
            {
              label: "Name (Z–A)",
              value: "name_za",
              icon: <ArrowDownZA size={14} className="text-gray-500" />,
            },
            {
              label: "Username (A–Z)",
              value: "username_az",
              icon: <AArrowDown size={14} className="text-gray-500" />,
            },
            {
              label: "Username (Z–A)",
              value: "username_za",
              icon: <AArrowUp size={14} className="text-gray-500" />,
            },
          ].map((chip) => (
            <button
              key={chip.value}
              onClick={() => setFilterTerm(chip.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-nowrap rounded-lg text-[11px] md:text-[11px] border ${
                chip.value === filterTerm
                  ? "bg-blue-50/50 border-blue-300"
                  : "border-gray-300 bg-white text-gray-700"
              } transition-all duration-200 shrink-0`}
            >
              {chip.value === filterTerm ? (
                <CheckCheck size={14} className="text-blue-500" />
              ) : (
                <span>{chip.icon}</span>
              )}
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        <div className="absolute right-0 z-10 h-full flex items-center pl-6 bg-linear-to-l from-gray-50 via-gray-50/90 to-gray-50/40 pointer-events-none w-10">
          <ChevronRight className="text-gray-400 animate-pulse" size={18} />
        </div>
      </div>
    )}
  </div>
);

const DeveloperTableRow = ({
  developer,
  index,
  isOptionsOpen,
  setIsOptionsOpen,
  setViewingDetails,
  setEditingDetails,
}) => (
  <tr
    className={`hover:bg-blue-50/90 transition-colors duration-150 ${
      index % 2 !== 0 && "bg-blue-50/50"
    }`}
  >
    <td className="pl-6 py-4">
      <div className="flex items-center gap-3 ">
        <div className="relative w-12 h-12">
          <img
            src={developer.photoURL}
            onError={(e) => {
              e.currentTarget.onerror = null; // prevent infinite loop
              e.currentTarget.src =
                "https://placehold.co/48x48/CCCCCC/333333?text=D";
            }}
            alt={developer.name || "Developer"}
            className="w-full h-full rounded-xl border border-gray-200 shadow-sm object-cover"
          />
          {/* Status Dot */}
          {developer.system.isAdmin && (
            <div className="absolute h-3 w-3 -top-1 -left-1 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>

        <div className="max-w-[300px]">
          <div className="flex items-center text-base font-medium font-poppins text-gray-900 max-w-[200px]">
            <p className="truncate">{developer.name}</p>
            {developer.developerProfile.verifiedDeveloper && (
              <BadgeCheck
                size={16}
                fill="#3B82F6"
                stroke="white"
                className="ml-1 shrink-0"
              />
            )}
          </div>

          <div className="text-gray-500 text-[15px] font-outfit w-[200px] truncate">
            @{developer.username}
          </div>
        </div>
      </div>
    </td>
    <td className="pl-6 py-4 text-gray-600 max-w-[200px] truncate">
      {developer.email}
    </td>
    <td className="pl-6 py-4 text-gray-600 max-w-[200px] truncate">
      {developer.developerProfile.website.replace(
        /^(https?:\/\/)?(www\.)?/i,
        ""
      ) || "No website added."}
    </td>
    <td className="pl-6 py-4">
      <code className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-mono">
        {developer.developerProfile.developerId}
      </code>
    </td>
    <td className="pl-6 py-4 text-gray-600 max-w-[200px] truncate">
      {formatDate(developer.developerProfile.developerSince)}
    </td>
    <td className="px-6 py-4">
      <Actions
        developer={developer}
        isOptionsOpen={isOptionsOpen}
        setIsOptionsOpen={setIsOptionsOpen}
        setViewingDetails={setViewingDetails}
        setEditingDetails={setEditingDetails}
      />
    </td>
  </tr>
);

const DeveloperCard = ({
  developer,
  isOptionsOpen,
  setIsOptionsOpen,
  setViewingDetails,
  setEditingDetails,
}) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-start gap-3">
      <div className="relative">
        <img
          src={developer.photoURL}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/56x56/CCCCCC/333333?text=D";
          }}
          alt={developer.developerProfile.developerId}
          className="w-14 h-14 shrink-0 rounded-xl border border-gray-200 shadow-sm"
        />
        {/* Status Dot */}
        {developer.system.isAdmin && (
          <div className="absolute h-3 w-3 -top-1 -left-1 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div>
          <h3 className="flex items-center gap-1 text-sm font-medium font-poppins text-gray-900">
            <p className="truncate">{developer.name}</p>
            {developer.developerProfile.verifiedDeveloper && (
              <BadgeCheck
                size={17}
                fill="#3B82F6"
                stroke="white"
                className="inline-block shrink-0"
              />
            )}
          </h3>

          <p className="text-gray-500 text-base font-outfit">
            @{developer.username}
          </p>
        </div>

        <div className="mt-1 space-y-1.5 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="truncate">{developer.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="truncate">
              {developer.developerProfile.website.replace(
                /^(https?:\/\/)?(www\.)?/i,
                ""
              ) || "No website added."}
            </span>
          </div>
          <div className="flex text-[13px] items-center gap-2">
            <span className="font-medium">Joined At:</span>{" "}
            {formatDate(developer.createdAt)}
          </div>
          <div className="flex text-[13px] items-center gap-2">
            <span className="font-medium">Developer Since: </span>
            {formatDate(developer.developerProfile.developerSince)}
          </div>
          <code className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded-sm">
            <span className="font-semibold">DevID:</span>{" "}
            {developer.developerProfile.developerId}
          </code>
        </div>
      </div>
    </div>

    <div className="relative flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
      <button
        onClick={() => setViewingDetails(developer)}
        className="bg-blue-500 text-white hover:bg-blue-600 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors duration-200"
      >
        View Details
      </button>

      <Actions
        developer={developer}
        isOptionsOpen={isOptionsOpen}
        setIsOptionsOpen={setIsOptionsOpen}
        setViewingDetails={setViewingDetails}
        setEditingDetails={setEditingDetails}
        isMobile={true}
      />
    </div>
  </div>
);

const Actions = ({
  developer,
  isOptionsOpen,
  setIsOptionsOpen,
  setViewingDetails,
  setEditingDetails,
  isMobile = false,
}) => {
  const { deleteUserById, setDevSuspensionStatusById } = useSystemStore();

  // Loading states
  const [loading, setLoading] = useState({
    deleting: "",
    suspending: "",
  });

  // Delete developer
  const handleDeleteDeveloper = async (developer) => {
    if (!developer?.uid) return toast.error("Invalid developer data");

    setLoading((prev) => ({ ...prev, deleting: developer.uid }));

    try {
      const res = await deleteUserById(developer.uid);
      if (res?.success) {
        toast.success("Developer deleted successfully");
      } else {
        toast.error("Failed to delete developer.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting developer.");
    } finally {
      setLoading((prev) => ({ ...prev, deleting: "" }));
    }
  };

  // Suspend / Unsuspend developer
  const toggleDeveloperBan = async (developer) => {
    if (!developer?.uid) return toast.error("Invalid developer data");

    const isCurrentlyBanned =
      developer.developerProfile.suspendedStatus.isSuspended;
    let reason = "";

    if (!isCurrentlyBanned) {
      reason = prompt("Enter the ban reason")?.trim();
      if (!reason) return toast.info("Ban cancelled — no reason provided.");
    }

    setLoading((prev) => ({ ...prev, suspending: developer.uid }));

    try {
      const res = await setDevSuspensionStatusById(developer.uid, reason);
      if (res?.success) {
        toast.success(
          isCurrentlyBanned ? "Developer unsuspended" : "Developer suspended"
        );
      } else {
        toast.error("Action failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating suspension status.");
    } finally {
      setLoading((prev) => ({ ...prev, suspending: "" }));
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() =>
          setIsOptionsOpen(isOptionsOpen === developer.uid ? "" : developer.uid)
        }
        className="text-gray-600 bg-gray-100 hover:text-gray-800 p-1.5 rounded-lg hover:bg-gray-200 transition-colors duration-200"
      >
        {isOptionsOpen === developer.uid ? (
          <X size={16} />
        ) : (
          <MoreVertical size={16} />
        )}
      </button>

      {isOptionsOpen === developer.uid && (
        <div
          className={`absolute ${
            isMobile ? "right-0 -top-36" : "-left-42 -top-2"
          } mt-2 w-40 bg-white/20 backdrop-blur-sm border border-gray-200/70 rounded-xl shadow-sm z-50 flex flex-col divide-y divide-gray-200/40`}
        >
          <button
            onClick={() => setViewingDetails(developer)}
            className="hidden md:flex items-center gap-2 px-4 py-2 pt-3 text-sm text-gray-800 rounded-t-xl hover:bg-gray-300/20 transition-colors duration-200"
          >
            <ArrowUpRight size={16} /> View Details
          </button>

          <button
            onClick={() => setEditingDetails(developer)}
            className="flex items-center gap-2 px-4 py-2 pt-3 md:pt-2 text-sm text-gray-800 hover:bg-gray-300/20 transition-colors duration-200"
          >
            <Edit2 size={16} /> Edit
          </button>

          {/* Delete */}
          <button
            disabled={loading.deleting === developer.uid}
            onClick={() => handleDeleteDeveloper(developer)}
            className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 ${
              loading.deleting === developer.uid
                ? "text-gray-400 cursor-not-allowed"
                : "text-red-600 hover:bg-gray-300/20"
            }`}
          >
            {loading.deleting === developer.uid ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <p>Deleting...</p>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <p>Delete</p>
              </>
            )}
          </button>

          {/* Suspend / Unsuspend */}
          <button
            disabled={loading.suspending === developer.uid}
            onClick={() => toggleDeveloperBan(developer)}
            className={`flex items-center gap-2 px-4 py-2 pb-3 text-sm rounded-b-xl transition-colors duration-200 ${
              loading.suspending === developer.uid
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-800 hover:bg-gray-300/20"
            }`}
          >
            {loading.suspending === developer.uid ? (
              <>
                <Loader2 size={16} className="animate-spin shrink-0" />
                <p>
                  {developer.developerProfile.suspendedStatus.isSuspended
                    ? "Unsuspending..."
                    : "Suspending..."}
                </p>
              </>
            ) : developer.developerProfile.suspendedStatus.isSuspended ? (
              <>
                <Undo size={16} />
                <p>Unsuspend</p>
              </>
            ) : (
              <>
                <Slash size={16} />
                <p>Suspend</p>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const LoadingSkeletonSearch = () => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 font-poppins">
    <div className="w-full sm:w-auto flex-1 relative">
      <div className="w-full md:w-1/2 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
    </div>
    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
  </div>
);

const LoadingSkeleton = () => (
  <>
    {/* Table View Skeleton */}
    <div className="hidden md:block">
      <div className="bg-white rounded-xl border-3 border-gray-100 overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm text-left">
          <thead className="bg-blue-100 text-blue-700 uppercase text-xs tracking-wider">
            <tr>
              {[
                "Developer",
                "Email",
                "Developer ID",
                "Joined At",
                "Last Activity",
                "Actions",
              ].map((_, idx) => (
                <th key={idx} className="px-6 py-4">
                  <div className="h-4 my-1 bg-blue-200 rounded w-16 animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[...Array(7)].map((_, i) => (
              <tr
                key={i}
                className={`hover:bg-blue-50/90 h-20 transition-colors duration-150 ${
                  i % 2 !== 0 && "bg-blue-50/50"
                }`}
              >
                {[...Array(6)].map((__, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center flex items-center justify-center mb-2 gap-2">
        Scroll horizontally for full details
      </p>
    </div>

    {/* Card View Skeleton */}
    <div className="md:hidden space-y-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-xl bg-gray-200 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="space-y-1 mt-2">
                <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-4 pt-3 border-t border-gray-200 space-x-2">
            <div className="h-6 w-20 bg-blue-200 rounded animate-pulse"></div>
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default AdminDeveloperManagement;

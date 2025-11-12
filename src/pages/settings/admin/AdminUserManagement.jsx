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
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/formatDate";
import { useSystemStore } from "../../../store/SystemStore";

const AdminUserManagement = () => {
  const { userIds, getUserDetailsById } = useSystemStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("no_filter");
  const [isOptionsOpen, setIsOptionsOpen] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);

  const usersMapRef = useRef(new Map());

  useEffect(() => {
    if (!userIds || (userIds.length === 0 && allUsers.length === 0)) {
      if (!userIds || userIds.length === 0) setIsLoading(false);
      return;
    }

    const currentUidsSet = new Set(userIds);
    const existingUidsMap = usersMapRef.current;
    let didCancel = false;

    const uidsToRemove = [];
    existingUidsMap.forEach((_, uid) => {
      if (!currentUidsSet.has(uid)) {
        uidsToRemove.push(uid);
      }
    });

    if (uidsToRemove.length > 0) {
      setAllUsers((prevUsers) => {
        const updatedUsers = prevUsers.filter(
          (user) => !uidsToRemove.includes(user.uid)
        );
        uidsToRemove.forEach((uid) => existingUidsMap.delete(uid));
        return updatedUsers;
      });
    }

    const newUids = userIds.filter((uid) => !existingUidsMap.has(uid));

    if (newUids.length > 0) {
      if (allUsers.length === 0) setIsLoading(true);

      const loadNewUsers = async () => {
        try {
          const userDetailsList = await Promise.all(
            newUids.map((uid) => getUserDetailsById(uid))
          );

          if (didCancel) return;

          const validNewUsers = userDetailsList.filter((user) => user !== null);

          setAllUsers((prevUsers) => {
            const finalUsers = [...prevUsers];

            validNewUsers.forEach((newUser) => {
              existingUidsMap.set(newUser.uid, newUser);
              finalUsers.push(newUser);
            });

            return finalUsers;
          });
        } catch (error) {
          console.error("Error fetching new users:", error);
        } finally {
          if (!didCancel && allUsers.length === 0) {
            setIsLoading(false);
          }
        }
      };

      loadNewUsers();
    }

    if (!isLoading && userIds.length > 0) {
      const updateChecks = [];
      existingUidsMap.forEach((existingUser, uid) => {
        if (currentUidsSet.has(uid)) {
          updateChecks.push(
            getUserDetailsById(uid).then((latestUser) => {
              if (
                latestUser &&
                JSON.stringify(latestUser) !== JSON.stringify(existingUser)
              ) {
                return latestUser;
              }
              return null;
            })
          );
        }
      });

      Promise.all(updateChecks).then((updatedUsers) => {
        if (didCancel) return;
        const validUpdates = updatedUsers.filter((u) => u !== null);

        if (validUpdates.length > 0) {
          setAllUsers((prevUsers) => {
            const nextUsers = [...prevUsers];

            validUpdates.forEach((updatedUser) => {
              const index = nextUsers.findIndex(
                (u) => u.uid === updatedUser.uid
              );
              if (index !== -1) {
                nextUsers[index] = updatedUser;
                existingUidsMap.set(updatedUser.uid, updatedUser);
              }
            });
            return nextUsers;
          });
        }
      });
    }

    if (userIds.length > 0 && allUsers.length === userIds.length) {
      setIsLoading(false);
    }

    return () => {
      didCancel = true;
    };
  }, [userIds, getUserDetailsById]);

  const usersToDisplay = useMemo(() => {
    let list = allUsers;
    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();

    // Search Filtering (same efficient client-side logic)
    if (lowerCaseSearchTerm) {
      list = list.filter((user) => {
        const nameMatch = user.name
          ?.toLowerCase()
          .includes(lowerCaseSearchTerm);
        const emailMatch = user.email
          ?.toLowerCase()
          .includes(lowerCaseSearchTerm);
        const usernameMatch = user.username
          ?.toLowerCase()
          .includes(lowerCaseSearchTerm);

        return nameMatch || emailMatch || usernameMatch;
      });
    }

    // Sorting (same efficient client-side logic)
    return list.slice().sort((a, b) => {
      switch (filterTerm) {
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
  }, [allUsers, searchTerm, filterTerm]);

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
          totalUsers={usersToDisplay.length}
          isFiltering={isFilterActive}
        />

        <div className="space-y-4">
          {/* Table View for Desktop */}
          <div className="hidden md:block">
            <div className="bg-white rounded-xl border-3 border-gray-100 overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm text-left">
                <thead className="bg-green-100 text-green-700 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">User ID</th>
                    <th className="px-6 py-4">Joined At</th>
                    <th className="px-6 py-4">Last Activity</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {usersToDisplay.map((user, i) => (
                    <UserTableRow
                      key={user.uid}
                      user={user}
                      index={i}
                      isOptionsOpen={isOptionsOpen}
                      setIsOptionsOpen={setIsOptionsOpen}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card View for Mobile */}
          <div className="md:hidden space-y-3">
            {usersToDisplay.map((user) => (
              <UserCard
                key={user.uid}
                user={user}
                isOptionsOpen={isOptionsOpen}
                setIsOptionsOpen={setIsOptionsOpen}
              />
            ))}
          </div>

          {/* Empty States */}
          {usersToDisplay.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm
                  ? `No results found for "${searchTerm}". Please try a different term.`
                  : allUsers.length > 0
                  ? "No users matched the current filter criteria."
                  : "No users found in the system."}
              </p>
            </div>
          )}

          {usersToDisplay.length > 0 && (
            <div className="text-center pt-2">
              <p className="text-sm text-gray-500">
                End of list. Showing {usersToDisplay.length} users.
              </p>
            </div>
          )}
        </div>

        <div className="h-6 w-full" />
      </div>
    </div>
  );
};

const AdminActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const actionsRef = useRef(null);
  const internalNavigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [actionsRef]);

  const handleBannedUsersClick = () => {
    setIsOpen(false);
    internalNavigate("/admin-user-ban-management");
  };

  return (
    <div className="relative" ref={actionsRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-gray-200/70 rounded-xl"
      >
        {isOpen ? <X size={16} /> : <EllipsisVertical size={16} />}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 mt-2 w-44 bg-white/20 backdrop-blur-sm border border-gray-200/70 rounded-xl shadow-sm z-50 flex flex-col divide-y divide-gray-200/40">
          <div className="px-4 py-2 text-xs font-semibold font-poppins border-b-gray-200 text-gray-500">
            More Actions
          </div>
          <button
            onClick={handleBannedUsersClick}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/50 transition-colors duration-200 rounded-b-xl"
          >
            <Slash size={16} className="text-red-500" />
            <span className="font-medium">Banned Users</span>
          </button>
          <button
            onClick={() => {
              console.log("Reporting tool clicked");
              setIsOpen(false);
            }}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <Users size={16} /> Dummy Report
          </button>
        </div>
      )}
    </div>
  );
};

const Header = () => (
  <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
    <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
      <NavLink to={-1} className="flex items-center gap-2 text-gray-800">
        <ChevronLeft size={26} />
        <span className="text-lg sm:text-2xl py-1.5 font-medium tracking-tight">
          User Management
        </span>
      </NavLink>
      <AdminActions />
    </div>
  </nav>
);

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  filterTerm,
  setFilterTerm,
  totalUsers,
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
          className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all duration-200"
        />
        <X
          onClick={() => setSearchTerm("")}
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
        />
      </div>

      {/* Total Users / Results */}
      <div className="flex items-center gap-2 font-medium text-sm sm:text-base">
        <span className="text-gray-700">
          {isFiltering ? "Results Shown:" : "Total Users:"}
        </span>
        <span className="text-gray-900 font-outfit">{totalUsers}</span>
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
                  ? "bg-green-50/50 border-green-300"
                  : "border-gray-300 bg-white text-gray-700"
              } transition-all duration-200 shrink-0`}
            >
              {chip.value === filterTerm ? (
                <CheckCheck size={14} className="text-green-500" />
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

const UserTableRow = ({ user, index, isOptionsOpen, setIsOptionsOpen }) => (
  <tr
    className={`hover:bg-green-50/90 transition-colors duration-150 ${
      index % 2 !== 0 && "bg-green-50/50"
    }`}
  >
    <td className="px-6 py-4">
      <div className="flex items-center gap-3 ">
        <img
          src={user.photoURL}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/48x48/CCCCCC/333333?text=U";
          }}
          alt={user.uid}
          className="w-12 h-12 rounded-xl border border-gray-200 shadow-sm"
        />
        <div className="max-w-[300px]">
          <div className="text-base font-medium font-poppins text-gray-900 max-w-[200px] truncate">
            {user.name}
          </div>
          <div className="text-gray-500 text-[15px] font-outfit w-[200px] truncate">
            @{user.username}
          </div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate">
      {user.email}
    </td>
    <td className="px-6 py-4">
      <code className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-mono">
        {user.uid}
      </code>
    </td>
    <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate">
      {formatDate(user.createdAt).split(", ").slice(0, 2).join(", ")}
    </td>
    <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate">
      {formatDate(user.system?.lastActivity || user.createdAt)}
    </td>
    <td className="px-6 py-4">
      <Actions
        user={user}
        isOptionsOpen={isOptionsOpen}
        setIsOptionsOpen={setIsOptionsOpen}
      />
    </td>
  </tr>
);

const UserCard = ({ user, isOptionsOpen, setIsOptionsOpen }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-start gap-3">
      <img
        src={user.photoURL}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/56x56/CCCCCC/333333?text=U";
        }}
        alt={user.uid}
        className="w-14 h-14 rounded-xl border border-gray-200 shadow-sm"
      />
      <div className="flex-1">
        <div>
          <h3 className="text-base font-medium font-poppins text-gray-900">
            {user.name}
          </h3>
          <p className="text-gray-500 text-base font-outfit">
            @{user.username}
          </p>
        </div>

        <div className="mt-1 space-y-1.5 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex text-[13px] items-center gap-2">
            <span className="font-medium">Joined At:</span>{" "}
            {formatDate(user.createdAt)}
          </div>
          <div className="flex text-[13px] items-center gap-2">
            <span className="font-medium">Last activity: </span>
            {formatDate(user.system?.lastActivity || user.createdAt)}
          </div>
          <code className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded-sm">
            <span className="font-semibold">ID:</span> {user.uid}
          </code>
        </div>
      </div>
    </div>

    <div className="relative flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
      <button className="bg-green-500 text-white hover:bg-green-600 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors duration-200">
        View Details
      </button>

      <Actions
        user={user}
        isOptionsOpen={isOptionsOpen}
        setIsOptionsOpen={setIsOptionsOpen}
        isMobile={true}
      />
    </div>
  </div>
);

const Actions = ({
  user,
  isOptionsOpen,
  setIsOptionsOpen,
  isMobile = false,
}) => (
  <div className="relative">
    <button
      onClick={() => {
        isOptionsOpen === user.uid
          ? setIsOptionsOpen("")
          : setIsOptionsOpen(user.uid);
      }}
      className="text-gray-600 bg-gray-100 hover:text-gray-800 p-1.5 rounded-lg hover:bg-gray-200 transition-colors duration-200"
    >
      {isOptionsOpen === user.uid ? (
        <X size={16} />
      ) : (
        <MoreVertical size={16} />
      )}
    </button>

    {isOptionsOpen === user.uid && (
      <div
        className={`absolute ${
          isMobile ? "right-0 -top-36" : "right-18 -top-2"
        } mt-2 w-40 bg-white/20 backdrop-blur-sm border border-gray-200/70 rounded-xl shadow-sm z-50 flex flex-col divide-y divide-gray-200/40`}
      >
        <button className="hidden md:flex items-center gap-2 px-4 py-2 pt-3 text-sm text-gray-800 rounded-t-xl hover:bg-gray-300/20 transition-colors duration-200">
          <ArrowUpRight size={16} /> View Details
        </button>
        <button className="flex items-center gap-2 px-4 py-2 pt-3 md:pt-2 text-sm text-gray-800 hover:bg-gray-300/20 transition-colors duration-200">
          <Edit2 size={16} /> Edit
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-300/20 transition-colors duration-200">
          <Trash2 size={16} /> Delete
        </button>
        <button className="flex items-center gap-2 px-4 py-2 pb-3 text-sm text-gray-800 rounded-b-xl hover:bg-gray-300/20 transition-colors duration-200">
          <Slash size={16} /> Ban User
        </button>
      </div>
    )}
  </div>
);

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
          <thead className="bg-green-100 text-green-700 uppercase text-xs tracking-wider">
            <tr>
              {[
                "User",
                "Email",
                "User ID",
                "Joined At",
                "Last Activity",
                "Actions",
              ].map((_, idx) => (
                <th key={idx} className="px-6 py-4">
                  <div className="h-4 my-1 bg-green-200 rounded w-16 animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[...Array(7)].map((_, i) => (
              <tr
                key={i}
                className={`hover:bg-green-50/90 h-20 transition-colors duration-150 ${
                  i % 2 !== 0 && "bg-green-50/50"
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
            <div className="h-6 w-20 bg-green-200 rounded animate-pulse"></div>
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default AdminUserManagement;

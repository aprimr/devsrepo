import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  appsStream,
  fetchDevelopers,
  fetchMostDownloadedApps,
  fetchMostReviewedApps,
  fetchNewApps,
} from "../services/appServices";
import AppCard from "../components/ui/cards/AppCard";
import AppCardSquare from "../components/ui/cards/AppCardSquare";
import DeveloperCard from "../components/ui/cards/DeveloperCard";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [sectionLoading, setSectionLoading] = useState([]);
  const [activeFilter, setActiveFilter] = useState("downloads");
  const [mostDownloadedApps, setMostDownloadedApps] = useState([]);
  const [mostReviewedApps, setMostReviewedApps] = useState([]);
  const [verifiedDevs, setVerifiedDevs] = useState([]);
  const [newApps, setNewApps] = useState([]);
  const [allApps, setAllApps] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch top developers
    const fetchTopDevsHandler = async () => {
      setSectionLoading((prev) => [...prev, "verified-devs"]);
      try {
        const res = await fetchDevelopers();
        setVerifiedDevs(res || []);
      } catch (error) {
        toast.error("Error fetching developers.");
      } finally {
        setSectionLoading((prev) =>
          prev.filter((section) => section !== "verified-devs")
        );
      }
    };

    // Fetch new apps
    const fetchNewAppsHandler = async () => {
      setSectionLoading((prev) => [...prev, "new-apps"]);
      try {
        const res = await fetchNewApps();
        if (res.success) {
          setNewApps(res.apps || []);
        }
      } catch (error) {
        toast.error("Error fetching apps.");
      } finally {
        setSectionLoading((prev) =>
          prev.filter((section) => section !== "new-apps")
        );
      }
    };

    // Fetch most downloaded apps
    const fetchMostDownloadedHandler = async () => {
      setSectionLoading((prev) => [...prev, "top-charts"]);
      try {
        const res = await fetchMostDownloadedApps();
        if (res.success) {
          setMostDownloadedApps(res.apps || []);
        }
      } catch (error) {
        toast.error("Error fetching most downloaded apps.");
      } finally {
        setSectionLoading((prev) =>
          prev.filter((section) => section !== "top-charts")
        );
      }
    };

    // Fetch most reviewed apps
    const fetchMostReviewedHandler = async () => {
      setSectionLoading((prev) => [...prev, "top-charts"]);
      try {
        const res = await fetchMostReviewedApps();
        if (res.success) {
          setMostReviewedApps(res.apps || []);
        }
      } catch (error) {
        toast.error("Error fetching most reviewed apps.");
      } finally {
        setSectionLoading((prev) =>
          prev.filter((section) => section !== "top-charts")
        );
      }
    };

    // Fetch all apps (stream fetching)
    const fetchAllAppsHandler = async () => {
      setSectionLoading((prev) => [...prev, "all-apps"]);

      try {
        await appsStream((chunk) => {
          setAllApps((prev) => {
            const existingIds = new Set(prev.map((a) => a.appId));
            const filteredChunk = chunk.filter(
              (a) => !existingIds.has(a.appId)
            );
            return [...prev, ...filteredChunk];
          });
        }, 15);
      } catch (error) {
        toast.error("Error fetching all apps.");
      } finally {
        setSectionLoading((prev) => prev.filter((s) => s !== "all-apps"));
      }
    };

    // Call all fetch handlers
    fetchMostDownloadedHandler();
    fetchMostReviewedHandler();
    fetchTopDevsHandler();
    fetchNewAppsHandler();
    fetchAllAppsHandler();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1300px] mx-auto px-4 py-8">
        {/* Top Charts */}
        <section className="mb-6">
          {/* Section Title */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-poppins font-medium text-gray-900">
              Top Charts
            </h2>
            {/* Filter Toggle */}
            <div className="flex items-center gap-2 p-1 bg-gray-200/50 rounded-xl">
              <button
                className={`px-3 py-1.5 rounded-[9px] text-xs font-medium font-poppins transition-all duration-200 ${
                  activeFilter === "downloads"
                    ? "bg-green-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveFilter("downloads")}
              >
                Downloads
              </button>
              <button
                className={`px-3 py-1.5 rounded-[9px] text-xs font-medium font-poppins transition-all dura ${
                  activeFilter === "rating"
                    ? "bg-green-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveFilter("rating")}
              >
                Rating
              </button>
            </div>
          </div>
          {/* App Lists */}
          {sectionLoading.includes("top-charts") ? (
            <SectionLoading />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(activeFilter === "downloads"
                ? mostDownloadedApps
                : mostReviewedApps
              ).map((app, index) => (
                <AppCard key={index} app={app} rank={index + 1} />
              ))}
            </div>
          )}
        </section>

        {/* New Apps */}
        <section className="mb-6">
          {/* Section Title */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-poppins font-medium text-gray-900">
              New Apps
            </h2>
          </div>
          {/* App Lists */}
          {sectionLoading.includes("new-apps") ? (
            <SectionLoading />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {newApps.map((app, index) => (
                <AppCard key={index} app={app} />
              ))}
            </div>
          )}
        </section>

        {/* Developers */}
        <section className="mb-6">
          {/* Section Title */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-poppins font-medium text-gray-900">
              Featured Developers
            </h2>
            <div
              onClick={() =>
                navigate("/top-developers", {
                  state: { developers: verifiedDevs },
                })
              }
              className="text-green-600 hover:text-green-700 text-sm font-poppins font-medium cursor-pointer"
            >
              View all
            </div>
          </div>

          {/* Devs List */}
          {sectionLoading.includes("verified-devs") ? (
            <SectionLoading />
          ) : (
            <div className="w-full flex gap-3 md:gap-6 overflow-x-auto no-scrollbar">
              {verifiedDevs.slice(0, 30).map((dev) => (
                <DeveloperCard key={dev.uid} developer={dev} />
              ))}
            </div>
          )}
        </section>

        {/* All Apps */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-poppins font-medium text-gray-900">
              All Apps
            </h2>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2">
            {allApps.map((app, index) => (
              <AppCardSquare key={index} app={app} />
            ))}
          </div>

          {sectionLoading.includes("all-apps") && <SectionLoading />}
        </section>
      </div>
    </div>
  );
}

export default HomePage;

const SectionLoading = () => {
  return (
    <div className="h-34 md:h-50 flex items-center bg-gray-200/60 rounded-xl justify-center">
      <Loader2 className="animate-spin text-green-600" size={50} />
    </div>
  );
};

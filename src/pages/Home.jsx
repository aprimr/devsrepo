import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
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

  const navigate = useNavigate();

  const featuredApps = [
    {
      id: 1,
      name: "WhatsApp Messenger",
      rating: 4.2,
      downloads: "5B+",
      category: "Communication",
      icon: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=100&h=100&fit=crop&crop=center",
      description: "Simple, reliable, private messaging and calling for free.",
    },
    {
      id: 2,
      name: "Instagram",
      rating: 4.1,
      downloads: "1B+",
      category: "Social",
      icon: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=100&h=100&fit=crop&crop=center",
      description:
        "Connect with friends, share photos and videos, and explore.",
    },
    {
      id: 3,
      name: "Spotify: Music and Podcasts",
      rating: 4.5,
      downloads: "500M+",
      category: "Music & Audio",
      icon: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=100&h=100&fit=crop&crop=center",
      description:
        "Listen to music and podcasts you love and find new favorites.",
    },
    {
      id: 4,
      name: "Netflix",
      rating: 4.0,
      downloads: "1B+",
      category: "Entertainment",
      icon: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&h=100&fit=crop&crop=center",
      description: "Watch TV shows and movies anytime, anywhere.",
    },
    {
      id: 5,
      name: "Uber",
      rating: 4.3,
      downloads: "500M+",
      category: "Travel & Local",
      icon: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=100&h=100&fit=crop&crop=center",
      description: "Get a ride in minutes. Or become a driver and earn money.",
    },
    {
      id: 6,
      name: "TikTok",
      rating: 4.1,
      downloads: "1B+",
      category: "Social",
      icon: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=100&h=100&fit=crop&crop=center",
      description: "Real people, real videos, real fun.",
    },
  ];

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

    // Call all fetch handlers
    fetchMostDownloadedHandler();
    fetchMostReviewedHandler();
    fetchTopDevsHandler();
    fetchNewAppsHandler();
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

        {/* Developers */}
        <section className="mb-6">
          {/* Section Title */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-poppins font-medium text-gray-900">
              Top Developers
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

        {/* All Apps */}
        <section>
          {/* Section Title */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-poppins font-medium text-gray-900">
              All Apps
            </h2>
          </div>
          {/* App Lists */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {newApps.map((app, index) => (
              <AppCardSquare
                key={index}
                id={app.id}
                icon={app.icon}
                name={app.name}
                category={app.category}
                description={app.description}
                rating={app.rating}
                downloads={app.downloads}
              />
            ))}
          </div>
          {/* Loading Indicator */}
          <div className="w-full flex justify-center items-center mt-6">
            <Loader2 size={28} className="text-green-600 animate-spin" />
          </div>
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

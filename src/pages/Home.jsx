import AppCard from "../components/ui/cards/AppCard";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import AppCardSquare from "../components/ui/cards/AppCardSquare";

function HomePage() {
  const [activeFilter, setActiveFilter] = useState("downloads");

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

  const newApps = [
    {
      id: 7,
      name: "ChatGPT",
      rating: 4.7,
      downloads: "10M+",
      category: "Productivity",
      icon: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop&crop=center",
      description: "The official ChatGPT app with voice and image support.",
    },
    {
      id: 8,
      name: "Threads",
      rating: 3.9,
      downloads: "100M+",
      category: "Social",
      icon: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=100&h=100&fit=crop&crop=center",
      description: "Share your ideas and join public conversations.",
    },
    {
      id: 9,
      name: "CapCut",
      rating: 4.6,
      downloads: "500M+",
      category: "Video Players & Editors",
      icon: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=100&h=100&fit=crop&crop=center",
      description: "Free all-in-one video editor with advanced features.",
    },
    {
      id: 10,
      name: "Telegram",
      rating: 4.4,
      downloads: "500M+",
      category: "Communication",
      icon: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=100&h=100&fit=crop&crop=center",
      description: "Fast and secure messaging app with cloud storage.",
    },
    {
      id: 11,
      name: "Snapchat",
      rating: 4.0,
      downloads: "1B+",
      category: "Social",
      icon: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=100&h=100&fit=crop&crop=center",
      description: "Chat, send Snaps, and explore Stories from friends.",
    },
    {
      id: 12,
      name: "Amazon Shopping",
      rating: 4.3,
      downloads: "500M+",
      category: "Shopping",
      icon: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop&crop=center",
      description: "Shop millions of products with fast delivery.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1300px] mx-auto px-4 py-8">
        {/* Top Charts */}
        <section className="mb-12">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredApps.map((app, index) => (
              <AppCard
                key={index}
                id={app.id}
                icon={app.icon}
                name={app.name}
                category={app.category}
                rating={app.rating}
                downloads={app.downloads}
                rank={index + 1}
              />
            ))}
          </div>
          <div className="w-full flex justify-center mt-4">
            <button className="text-green-600 hover:text-green-700 text-sm font-poppins font-medium cursor-pointer">
              View More
            </button>
          </div>
        </section>

        {/* New Apps */}
        <section className="mb-12">
          {/* Section Title */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-poppins font-medium text-gray-900">
              New Apps
            </h2>
            <div className="text-green-600 hover:text-green-700 text-sm font-poppins font-medium cursor-pointer">
              View all
            </div>
          </div>
          {/* App Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newApps.map((app, index) => (
              <AppCard
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
        </section>

        {/* New Apps */}
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

// id: 1,
// name: "Weather Pro",
// rating: 4.8,
// downloads: "1.2M",
// category: "Weather",
// icon: "/icons/weather-pro.png",
// screenshots: [
//   "/screenshots/weather-1.jpg",
//   "/screenshots/weather-2.jpg",
//   "/screenshots/weather-3.jpg",
//   "/screenshots/weather-4.jpg",
//   "/screenshots/weather-5.jpg"
// ],
// description: "Accurate weather forecasts and real-time updates with beautiful UI and severe weather alerts",
// androidApk: "/apks/weather-pro-v1.2.0.apk",
// iosApk: "/apks/weather-pro-v1.2.0.ipa",
// appVersion: "1.2.0",
// repo: "https://github.com/username/weather-pro",
// previousVersions: [
//   {
//     androidApk: "weather-pro-v1.1.1.apk",
//     iosApk: "weather-pro-v1.1.1.apk"
//     version: "1.1.1"
//   },
//   {
//     androidApk: "weather-pro-v1.0.0.apk",
//     iosApk: "weather-pro-v1.0.0.apk"
//     version: "1.0.0"
//   }
// ],
// tags: ["React Native", "Weather API", "Real-time", "UI/UX", "Notifications"]

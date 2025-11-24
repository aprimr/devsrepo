import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAppsByType } from "../../services/appServices";
import AppCardSquare from "../../components/ui/cards/AppCardSquare";
import { toast } from "sonner";
import DeveRepoSad from "../../assets/images/DevsRepoInvert.png";

function AppsTypesPage() {
  const { type } = useParams();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadApps = async () => {
      setLoading(true);
      try {
        const result = await fetchAppsByType(type);
        if (result.success) setApps(result.apps);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load apps");
      } finally {
        setLoading(false);
      }
    };

    loadApps();
  }, [type]);

  // Title
  let title;
  switch (type) {
    case "education":
      title = "Education";
      break;
    case "kids":
      title = "Kids";
      break;
    case "uiclone":
      title = "UI Clone";
      break;
    case "tools":
      title = "Tools";
      break;
    case "fitness":
      title = "Fitness";
      break;
    case "shopping":
      title = "Shopping";
      break;
    default:
      title = "Others";
  }

  // Loading
  const Loader = () => (
    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-4 animate-pulse">
      {Array.from({ length: 20 }).map((_, idx) => (
        <div key={idx} className="h-34 bg-gray-200 rounded-xl shadow-sm"></div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        <h1 className="text-xl sm:text-2xl font-poppins font-medium text-gray-800 mb-3">
          {title} Apps
        </h1>

        {loading ? (
          <Loader />
        ) : apps.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-6">
            {apps.map((app) => (
              <>
                <AppCardSquare key={app.appId} app={app} />
                <AppCardSquare key={app.appId} app={app} />
                <AppCardSquare key={app.appId} app={app} />
                <AppCardSquare key={app.appId} app={app} />
                <AppCardSquare key={app.appId} app={app} />
                <AppCardSquare key={app.appId} app={app} />
                <AppCardSquare key={app.appId} app={app} />
                <AppCardSquare key={app.appId} app={app} />
                <AppCardSquare key={app.appId} app={app} />
                <AppCardSquare key={app.appId} app={app} />
                <AppCardSquare key={app.appId} app={app} />
                <AppCardSquare key={app.appId} app={app} />
                <AppCardSquare key={app.appId} app={app} />
                <AppCardSquare key={app.appId} app={app} />
                <AppCardSquare key={app.appId} app={app} />
                <AppCardSquare key={app.appId} app={app} />
                <AppCardSquare key={app.appId} app={app} />
                <AppCardSquare key={app.appId} app={app} />
                <AppCardSquare key={app.appId} app={app} />
              </>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-30 px-4 text-center">
            <img
              src={DeveRepoSad}
              alt="No apps"
              className=" h-20 aspect-square mb-6"
            />
            <p className="text-gray-600 text-base sm:text-lg font-medium font-poppins">
              Oops! No apps found in {title} section.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppsTypesPage;

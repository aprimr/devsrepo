import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAppbyID, incrementDownload } from "../../services/appServices";
import {
  ChevronLeft,
  EllipsisVertical,
  Star,
  Play,
  ArrowDownToLine,
  Loader,
  X,
  ArrowRight,
  Shield,
  AlertTriangle,
  ChevronDown,
  Mail,
  BadgeQuestionMark,
  ShieldAlert,
  UserCheck,
  Share2,
  ThumbsUp,
  UserCircle2,
  CloudUpload,
  ChevronRight,
  CheckCircle,
  BadgeCheck,
  Loader2,
} from "lucide-react";
import { getFileURL } from "../../services/appwriteStorage";
import { calculateRating } from "../../utils/calculateRating";
import numberSuffixer from "../../utils/numberSuffixer";
import useDeviceType from "../../hooks/useDeviceType";
import { formatDate } from "../../utils/formatDate";
import { FaGithub } from "react-icons/fa";
import { useAuthStore } from "../../store/AuthStore";
import { reviewService } from "../../services/reviewServices";
import ReviewCard from "../../components/ui/cards/ReviewCard";
import AppLoading from "../../components/ui/Loading/AppLoading";
import AppNotFound from "../../components/ui/Loading/NoAppFound";

const AppDetails = () => {
  const { appId } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isAboutAppOpen, setIsAboutAppOpen] = useState(false);
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);

  const { user } = useAuthStore();
  const navigate = useNavigate();
  const device = useDeviceType();

  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = 120;
      setScrolled(window.scrollY > headerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setLoading(true);

    const fetchApp = async () => {
      try {
        const res = await fetchAppbyID(appId);
        if (res.success) {
          setApp(res.app);
        }
      } catch (err) {
        console.error("Error fetching app details:", err);
        toast.error("Error fetching app data");
      } finally {
        setLoading(false);
      }
    };

    fetchApp();
  }, [appId]);

  const handleDownload = async (fileId, fileName) => {
    const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;

    try {
      //Cloudflare Worker URL
      const workerUrl = "https://app-download-proxy.aprimregmi24.workers.dev";

      // Download URL
      const downloadUrl = `${workerUrl}/download?bucket=${bucketId}&file=${fileId}&name=${encodeURIComponent(
        fileName
      )}`;

      // Try download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // If above fails do this
      setTimeout(async () => {
        try {
          const response = await fetch(downloadUrl);
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);

          const backupLink = document.createElement("a");
          backupLink.href = blobUrl;
          backupLink.download = fileName;
          backupLink.click();

          setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
        } catch (error) {
          console.log("Backup method failed:", error);
        }
      }, 1000);

      incrementDownload(app.appId);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Please try again.");
    }
  };

  if (loading) return <AppLoading />;
  if (!app) return <AppNotFound />;

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl transition-all duration-200">
        <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3 gap-2 relative">
          {/* Back Btn */}
          <div
            onClick={() => navigate(-1)}
            className="flex flex-1 items-center py-1.5 gap-2 min-w-0 cursor-pointer"
          >
            <ChevronLeft size={26} className="text-black" />
          </div>

          {/* App Name */}
          {scrolled && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
              <img
                src={getFileURL(app.details.media.icon)}
                alt="App Icon"
                className="w-8 h-8 rounded-xl object-cover"
              />
              <div className="flex flex-col">
                <span className="text-black font-medium font-poppins text-sm line-clamp-1 max-w-[170px]">
                  {app.details.name}
                </span>
                <span className="text-gray-600 font-normal font-outfit text-[10px] line-clamp-1 max-w-[170px] -mt-0.5">
                  {app.details.appDetails.apkFileSizeMB ||
                    app.details.appDetails.ipaFileSizeMB}{" "}
                  <span className="font-poppins">MB</span>
                </span>
              </div>
            </div>
          )}

          {/* Option */}
          <button>
            <EllipsisVertical size={20} className="text-black" />
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto">
        {/* App Header */}
        <section className="px-4 py-1 sm:px-6 flex items-start gap-6">
          <img
            src={getFileURL(app.details.media.icon)}
            alt={`${app.name}`}
            className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <h1 className="text-xl sm:text-2xl font-medium font-poppins text-black wrap-break-words line-clamp-2 leading-tight">
              {app.details.name}
            </h1>
            <span
              onClick={() => navigate(`/p/${app.developer.developerId}`)}
              className="text-sm font-poppins text-green-700 mt-1"
            >
              {app.developer.name}
            </span>
            <div className="w-fit flex items-center justify-center text-gray-600 text-[11px] font-poppins gap-2 mt-1">
              {app.details.hasAds && <p>Contains ads</p>}
              {app.details.hasAds && app.details.inAppPurchases && (
                <span className="w-1 h-1 rounded-full bg-gray-500 inline-block" />
              )}
              {app.details.inAppPurchases && <p>In-app purchases</p>}
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="flex justify-between items-center w-full h-16 max-w-sm mx-auto sm:max-w-none sm:justify-start sm:gap-12 text-center px-4 sm:px-6">
          {/* Rating */}
          <div className="flex flex-col items-center">
            <div className="flex items-center text-base font-medium font-outfit text-gray-700">
              {calculateRating(app.metrics.ratings.breakdown)}
              <Star
                size={14}
                fill="currentColor"
                className="ml-1 text-yellow-500"
              />
            </div>
            <div className="text-sm text-gray-700 mt-0.5">
              <span className="font-outfit">
                {numberSuffixer(app.metrics.ratings.totalReviews)}
              </span>
              <span className="font-poppins"> reviews</span>
            </div>
          </div>

          {/* spacer */}
          <div className="h-8 w-0.5 bg-gray-200 " />

          {/* Size */}
          <div className="flex flex-col items-center">
            <div className="flex items-center text-base font-medium font-outfit text-gray-700">
              {numberSuffixer(
                app.details.appDetails.apkFileSizeMB ||
                  app.details.appDetails.ipaFileSizeMB
              )}{" "}
              MB
            </div>
            <div className="text-sm text-gray-700 font-poppins mt-0.5">
              App Size
            </div>
          </div>

          {/* spacer */}
          <div className="h-8 w-0.5 bg-gray-200 " />

          {/* Downloads */}
          <div className="flex flex-col items-center">
            <div className="flex items-center text-base font-medium font-outfit text-gray-700">
              {numberSuffixer(app.metrics.downloads)}
              <ArrowDownToLine
                size={14}
                fill="currentColor"
                className="ml-1 text-gray-700"
              />
            </div>
            <div className="text-sm text-gray-700 font-poppins mt-0.5">
              Downloads
            </div>
          </div>
        </section>

        {/* Download Buttons */}
        <section className="p-4 pb-1 flex flex-row items-center gap-2 w-full max-w-lg mx-auto">
          {/* Android Platform */}
          {device === "Android" && (
            <>
              {app.details.appDetails.androidApk ? (
                <button
                  onClick={() =>
                    handleDownload(
                      app.details.appDetails.androidApk,
                      `${app.details.name.split(" ").join("_")}.apk`
                    )
                  }
                  className="flex-1 flex items-center justify-center font-poppins bg-green-500 text-black py-3 rounded-full"
                >
                  Download for Android
                </button>
              ) : (
                <div className="w-full flex flex-col">
                  <p className="flex-1 text-center text-sm text-rose-500 font-poppins pb-2.5">
                    App not available for Android
                  </p>
                  {app.details.appDetails.iosApk && (
                    <button
                      onClick={() =>
                        handleDownload(
                          app.details.appDetails.iosApk,
                          `${app.details.name.split(" ").join("_")}.ipa`
                        )
                      }
                      className="flex-1 flex items-center justify-center font-poppins bg-black text-white py-3 rounded-full"
                    >
                      Download for iOS
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* iOS Platform */}
          {device === "iOS" && (
            <>
              {app.details.appDetails.iosApk ? (
                <button
                  onClick={() =>
                    handleDownload(
                      app.details.appDetails.iosApk,
                      `${app.details.name.split(" ").join("_")}.ipa`
                    )
                  }
                  className="flex-1 flex items-center justify-center font-poppins bg-black text-white py-3 rounded-full"
                >
                  Download for iOS
                </button>
              ) : (
                <div className="w-full flex flex-col">
                  <p className="flex-1 text-center text-sm text-rose-500 font-poppins pb-3">
                    App not available for iOS
                  </p>
                  {app.details.appDetails.androidApk && (
                    <button
                      onClick={() =>
                        handleDownload(
                          app.details.appDetails.androidApk,
                          `${app.details.name.split(" ").join("_")}.apk`
                        )
                      }
                      className="flex-1 flex items-center justify-center font-poppins bg-green-500 text-black py-3 rounded-full text-sm"
                    >
                      Download for Android
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* Other Platforms */}
          {device === "Other" && (
            <>
              {app.details.appDetails.androidApk && (
                <button
                  onClick={() =>
                    handleDownload(
                      app.details.appDetails.androidApk,
                      `${app.details.name.split(" ").join("_")}.apk`
                    )
                  }
                  className="flex-1 flex text-sm items-center justify-center font-poppins bg-green-500 text-black py-3 rounded-full"
                >
                  Download for Android
                </button>
              )}
              {app.details.appDetails.iosApk && (
                <button
                  onClick={() =>
                    handleDownload(
                      app.details.appDetails.iosApk,
                      `${app.details.name.split(" ").join("_")}.ipa`
                    )
                  }
                  className="flex-1 flex text-sm items-center justify-center font-poppins bg-black text-white py-3 rounded-full"
                >
                  Download for iOS
                </button>
              )}
            </>
          )}
        </section>

        {/* Media Gallery */}
        <section>
          <div className="flex overflow-x-auto gap-2 p-4 sm:px-6 no-scrollbar">
            {app.details.media.promoVideoURL ? (
              <PromoVideoCard
                thumbnail={getFileURL(app.details.media.banner)}
                promoVideoURL={app.details.media.promoVideoURL}
              />
            ) : (
              <div className="relative shrink-0 w-[80vw] sm:w-[328px] h-[177px] rounded-xl overflow-hidden bg-transparent cursor-pointer">
                <img
                  src={getFileURL(app.details.media.banner)}
                  alt="App Banner"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {app.details.media.screenshots.map((id, index) => (
              <ScreenshotCard imgId={id} key={index} />
            ))}
          </div>
        </section>

        {/* About App */}
        <section className="px-4 pt-2 sm:px-6">
          {/* Title & Btn */}
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-lg font-medium font-poppins text-black">
              About this app
            </h2>
            <button
              onClick={() => setIsAboutAppOpen(true)}
              className="p-2 bg-gray-100 rounded-full"
            >
              <ArrowRight size={18} className="text-black" />
            </button>
          </div>
          <p className="text-sm text-gray-700 font-poppins mb-2 line-clamp-2">
            {app.details.description.short}
          </p>
          {/* Features */}
          <div className="mt-3">
            <div className="flex flex-wrap gap-2 ">
              {app.details.description.featureBullets?.map((feature, index) => (
                <p
                  key={index}
                  className="text-[12px] px-3 py-1 font-poppins font-medium text-green-800 bg-green-100 border border-green-300 rounded-lg leading-snug"
                >
                  {feature}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* What's New */}
        {app.details.description.whatsNew && (
          <section className="px-4 pt-4 sm:px-6">
            <h2 className="text-lg font-medium font-poppins text-black">
              What's New
              <span className="h-2 w-2 bg-green-400 rounded-full inline-flex align-middle ml-2" />
            </h2>
            <h5 className="text-[10px] font-medium font-poppins text-gray-500 -mt-1 mb-1">
              Last Updated:{" "}
              {(formatDate(app.updatedAt).split("2025")[0] + "2025").replace(
                ",",
                ""
              )}
            </h5>
            <p className="text-xs text-neutral-700 font-poppins mb-1 whitespace-pre-line">
              {app.details.description.whatsNew}
            </p>
          </section>
        )}

        {/* More Info*/}
        <section className="px-4 pt-0">
          <AgeRating app={app} />
        </section>

        {/* App Support */}
        <section className="py-3">
          <AppSupport app={app} />
        </section>

        {/* Data Safety */}
        <section className="py-3">
          <DataSafety app={app} />
        </section>

        {/* Write a review */}
        {user &&
          !app.community.reviews.includes(user?.uid) &&
          !isReviewSubmitted && (
            <section className="px-4 sm:px-6">
              <WriteReviewSection
                app={app}
                user={user}
                reviewService={reviewService}
                setIsReviewSubmitted={setIsReviewSubmitted}
              />
            </section>
          )}

        {/* Review Submitted Message */}
        {isReviewSubmitted && (
          <section className="px-4 sm:px-6">
            <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-poppins">
              Thank you for your review! Your feedback has been submitted
              successfully.
            </div>
          </section>
        )}

        {/* MyReview */}
        {user && app.community.reviews.includes(user?.uid) && (
          <section className="px-4 sm:px-6">
            <MyReviewCard
              userId={user?.uid}
              appId={app.appId}
              developerId={app.developer.developerId}
            />
          </section>
        )}

        {/* App Reviews */}
        <section className="py-3">
          <ReviewsHead app={app} />
          <ReviewsBody app={app} currentUser={user?.uid} />
        </section>

        {/* App Info */}
        <section className="py-3 px-3">
          <AppInfo app={app} />
        </section>

        <div className="h-4"></div>
      </main>

      {/* About App Modal */}
      {isAboutAppOpen && (
        <div className="fixed inset-0 z-50 bg-white font-sans overflow-y-auto">
          {/* Header */}
          <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-300">
            <div className="max-w-[1450px] mx-auto flex items-center justify-start px-4 sm:px-6 py-3 gap-2 relative">
              {/* Back Btn */}
              <div
                onClick={() => setIsAboutAppOpen(false)}
                className="flex items-center py-1.5 gap-2 min-w-0 cursor-pointer"
              >
                <ChevronLeft size={26} className="text-black" />
              </div>

              {/* App Name */}
              <div
                onClick={() => setIsAboutAppOpen(false)}
                className="flex items-center gap-2"
              >
                <img
                  src={getFileURL(app.details.media.icon)}
                  alt="App Icon"
                  className="w-8 h-8 rounded-xl object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-black font-medium font-poppins text-sm line-clamp-1 max-w-[250px]">
                    {app.details.name}
                  </span>
                  <span className="text-gray-600 font-normal font-poppins text-[10px] line-clamp-1 max-w-[250px] -mt-0.5">
                    Details
                  </span>
                </div>
              </div>
            </div>
          </nav>
          {/* Description Content */}
          <main className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
            {/* Title */}
            <h2 className="text-lg font-medium font-poppins text-black mb-2">
              About this app
            </h2>
            {/* Short Description */}
            <p className="text-sm text-neutral-800 font-poppins mb-1 whitespace-pre-line">
              {app.details.description.short}
            </p>
            {/* Long Description */}
            <p className="text-sm text-neutral-800 font-poppins mb-2 whitespace-pre-line">
              {app.details.description.long}
            </p>
            {/* What's New */}
            {app.details.description.whatsNew && (
              <>
                <h2 className="text-lg font-medium font-poppins text-black mb-2 pt-1 border-t border-gray-300">
                  What's New
                  <span className="h-2 w-2 bg-green-400 rounded-full inline-flex align-middle ml-2" />
                </h2>
                <p className="text-sm text-neutral-800 font-poppins mb-1 whitespace-pre-line">
                  {app.details.description.whatsNew}
                </p>
              </>
            )}
            {/* More Info */}
            <AgeRating app={app} />
            <div>
              <h2 className="text-sm font-medium font-poppins text-black mb-1">
                Features
              </h2>

              <div className="flex flex-wrap gap-2 space-y-0.5">
                {app.details.description.featureBullets?.map(
                  (feature, index) => (
                    <p
                      key={index}
                      className="text-[12px] px-3 py-1 font-medium font-poppins text-green-800 bg-green-100 border border-green-300 rounded-lg leading-snug"
                    >
                      {feature}
                    </p>
                  )
                )}
              </div>
            </div>
            {/* App Info */}
            <AppInfo app={app} />
            {/* Tags */}
            <div className="mt-2 border-t border-gray-300">
              <h2 className="text-sm font-medium font-poppins text-black mb-1 pt-2">
                Tags
              </h2>

              <div className="flex flex-wrap gap-2">
                {app.details.tags?.map((feature, index) => (
                  <p
                    key={index}
                    className="text-sm px-2 py-1 font-poppins text-neutral-800 lowercase leading-snug"
                  >
                    # {feature}
                  </p>
                ))}
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default AppDetails;

const PromoVideoCard = ({ thumbnail, promoVideoURL }) => {
  const [playing, setPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const isYouTube =
    promoVideoURL?.includes("youtube.com") ||
    promoVideoURL?.includes("youtu.be");

  const getYouTubeEmbedURL = (url) => {
    try {
      let id = null;

      if (url.includes("youtu.be")) {
        id = url.split("youtu.be/")[1].split("?")[0];
      } else {
        const urlObj = new URL(url);
        id = urlObj.searchParams.get("v");
      }

      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&fs=0&playsinline=1`;
    } catch (err) {
      return null;
    }
  };

  const embedURL = isYouTube ? getYouTubeEmbedURL(promoVideoURL) : null;

  const handlePlay = () => {
    setPlaying(true);
    setVideoLoaded(false);
  };

  const handleVideoEnd = () => {
    setPlaying(false);
    setVideoLoaded(false);
  };

  return (
    <div
      className="relative shrink-0 w-[80vw] sm:w-[328px] h-[177px] rounded-xl overflow-hidden bg-transparent cursor-pointer"
      onClick={!playing ? handlePlay : undefined}
    >
      {!playing && (
        <>
          <img
            src={thumbnail}
            alt="App Video Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-3.5 rounded-full bg-black/30 backdrop-blur-md">
              <Play size={22} className="text-white" fill="white" />
            </div>
          </div>
        </>
      )}

      {playing && !videoLoaded && (
        <>
          <img
            src={thumbnail}
            alt="App Video Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-3.5 rounded-full bg-black/30 backdrop-blur-md">
              <Loader size={22} className="text-white animate-spin" />
            </div>
          </div>
        </>
      )}

      {playing && isYouTube && (
        <iframe
          src={embedURL}
          title="Promo Video"
          allow="autoplay; encrypted-media"
          className={`w-full h-full ${videoLoaded ? "" : "invisible"}`}
          onLoad={() => setVideoLoaded(true)}
          onEnded={handleVideoEnd}
        />
      )}

      {playing && !isYouTube && (
        <video
          src={promoVideoURL}
          autoPlay
          playsInline
          controls={false}
          className={`w-full h-full object-cover ${
            videoLoaded ? "" : "invisible"
          }`}
          onLoadedData={() => setVideoLoaded(true)}
          onEnded={handleVideoEnd}
        />
      )}
    </div>
  );
};

const ScreenshotCard = ({ imgId }) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleOpen = () => setPreviewOpen(true);
  const handleClose = () => setPreviewOpen(false);

  return (
    <>
      <div
        className="relative shrink-0 w-[108px] h-[177px] rounded-md overflow-hidden bg-gray-100 cursor-pointer"
        onClick={handleOpen}
      >
        <img
          src={getFileURL(imgId)}
          alt={imgId}
          className="w-full h-full object-cover"
        />
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 text-white p-2 rounded-full hover:bg-black/40 transition"
          >
            <X size={24} />
          </button>
          <img
            src={getFileURL(imgId)}
            alt={imgId}
            className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
          />
        </div>
      )}
    </>
  );
};

const WriteReviewSection = ({
  user,
  app,
  reviewService,
  setIsReviewSubmitted,
}) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitReview = async () => {
    if (!rating) {
      toast.info("Please select your rating");
      return;
    }

    setLoading(true);

    try {
      const result = await reviewService.createReview({
        appId: app.appId,
        userId: user?.uid,
        developerId: app.developer.developerId,
        rating,
        reviewText,
      });

      if (result.success) {
        setRating(0);
        setReviewText("");
        setIsReviewSubmitted(true);
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <h2 className="text-lg font-medium font-poppins text-black border-t border-gray-300 pt-3 mb-2">
        Rate this app
      </h2>

      {/* Stars */}
      <div className="flex justify-between ">
        <div className="flex gap-6 mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => setRating(s)} className="transition">
              <Star
                size={30}
                className={
                  rating >= s
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-400"
                }
              />
            </button>
          ))}
        </div>
        <span className="text-2xl">
          {["😞", "😐", "😕", "🙂", "😍"][rating - 1]}
        </span>
      </div>

      {/* Textarea */}
      <div className="mb-2">
        <textarea
          rows={3}
          className="w-full p-4 bg-gray-50 rounded-xl border border-gray-300 text-sm font-poppins outline-none focus:ring-2 focus:ring-green-500 transition resize-none"
          placeholder="Share your thoughts about this app..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
      </div>

      {/* Avatar + Submit Button */}
      <div className="flex justify-between items-center">
        <div className="h-10 w-10">
          <img
            src={user.photoURL}
            alt={user.name}
            className="rounded-full w-10 h-10"
          />
        </div>
        <button
          onClick={handleSubmitReview}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-black font-poppins py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          <span>{loading ? "Submitting..." : "Submit Review"}</span>
        </button>
      </div>
    </div>
  );
};

const MyReviewCard = ({ userId, appId, developerId }) => {
  return (
    <div className="w-full">
      {/* Header */}
      <h2 className="text-lg font-medium font-poppins text-black border-t border-gray-300 pt-3 mb-2">
        Your Review
      </h2>

      <ReviewCard
        userId={userId}
        appId={appId}
        developerId={developerId}
        myReview={true}
      />
    </div>
  );
};

const AgeRating = ({ app }) => {
  const ageMap = {
    everyone: {
      type: "letter",
      letter: "E",
      label: "Everyone",
      desc: "Suitable for all age groups",
    },
    teen: {
      type: "letter",
      letter: "T",
      label: "Teen",
      desc: "Content appropriate for teens",
    },
    mature17: {
      type: "icon",
      icon: Shield,
      label: "Mature 17+",
      desc: "May contain intense content",
    },
    adult18: {
      type: "icon",
      icon: AlertTriangle,
      label: "Adult 18+",
      desc: "Restricted adult-only content",
    },
  };

  const rating = app.details.ageRating?.toLowerCase();
  const data = ageMap[rating];

  return (
    <div className="mt-4 mb-2">
      <h2 className="text-lg font-medium font-poppins text-black mt-3 mb-2 pt-2 border-t border-gray-300">
        More Info
      </h2>

      <div className="flex gap-6 items-start p-3">
        <div className="w-10 h-10 flex items-center justify-center bg-black rounded-md rotate-6">
          {/* Show Letter */}
          {data.type === "letter" && (
            <p className="text-5xl font-black text-white pt-4 -rotate-12">
              {data.letter}
            </p>
          )}

          {/* Show Icon */}
          {data.type === "icon" && (
            <data.icon className="w-8 h-8 stroke-3 text-white -rotate-12" />
          )}
        </div>

        <div>
          <p className="text-sm font-medium font-poppins text-gray-800">
            {data.label}
          </p>
          <p className="text-xs font-poppins text-gray-600">{data.desc}</p>
        </div>
      </div>
    </div>
  );
};

const DataSafety = ({ app }) => {
  return (
    <section className="px-4 ">
      <details className="group  pt-1">
        <summary className="cursor-pointer list-none">
          <div className="flex justify-between items-center pr-3">
            <span className="text-base font-medium font-poppins text-black">
              Data Safety
            </span>

            <ChevronDown
              size={20}
              className="w-[22px] h-[22px] text-gray-700 transition-transform duration-200 
              group-open:rotate-180 p-1 bg-gray-200/50 rounded-full"
            />
          </div>

          <p className="text-sm text-gray-800 mt-1 font-poppins pr-6">
            Safety starts with understanding how developers collect and share
            your data. The developer provided this information and may update it
            over time.
          </p>
        </summary>

        <div className="mt-4 space-y-5">
          {/* Data Collection */}
          <div className="flex items-start gap-3">
            {app?.data?.collectsData ? (
              <CloudUpload className="w-5 h-5 text-red-600 mt-1 transition-transform duration-300 scale-100" />
            ) : (
              <CloudUpload className="w-5 h-5 text-green-600 mt-1 transition-transform duration-300 scale-100" />
            )}

            <div className="flex flex-col">
              <span className="text-sm font-medium font-poppins text-gray-900">
                Data Collection
              </span>

              <p className="text-sm font-poppins text-gray-600">
                {app?.data?.collectsData
                  ? "This app collects user data."
                  : "This app does not collect any user data."}
              </p>

              {app?.data?.collectsData &&
                Array.isArray(app?.data?.dataCollected) &&
                app.data.dataCollected.length > 0 && (
                  <ul className="mt-2 ml-1 space-y-1">
                    {app.data.dataCollected.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 font-poppins flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          </div>

          {/* Data Sharing */}
          <div className="flex items-start gap-3">
            {app?.data?.sharesData ? (
              <Share2 className="w-5 h-5 text-red-600 mt-1 transition-transform duration-300 scale-100" />
            ) : (
              <Share2 className="w-5 h-5 text-green-600 mt-1 transition-transform duration-300 scale-100" />
            )}

            <div className="flex flex-col">
              <span className="text-sm font-medium font-poppins text-gray-900">
                Data Sharing
              </span>

              <p className="text-sm font-poppins text-gray-600">
                {app?.data?.sharesData
                  ? "This app may share user data with third parties."
                  : "This app does not share any user data with third parties."}
              </p>
            </div>
          </div>

          {/* COPPA */}
          <div className="flex items-start gap-3">
            {app?.data?.coppaCompliant ? (
              <UserCheck className="w-5 h-5 text-green-600 mt-1 transition-transform duration-300 scale-100" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-red-600 mt-1 transition-transform duration-300 scale-100" />
            )}

            <div className="flex flex-col">
              <span className="text-sm font-medium font-poppins text-gray-900">
                COPPA Compliance
              </span>

              <p className="text-sm font-poppins text-gray-600">
                {app?.data?.coppaCompliant
                  ? "This app complies with the Children's Online Privacy Protection Act (COPPA)."
                  : "This app is not declared as COPPA compliant."}
              </p>
            </div>
          </div>
        </div>
      </details>
    </section>
  );
};

const ReviewsHead = ({ app }) => {
  return (
    <section className="px-4 sm:px-6 mt-2">
      {/* Title and Btn */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium font-poppins text-black">
          Ratings and Reviews
        </h2>
      </div>

      {/* Rating Summary */}
      <div className="flex gap-6 items-center">
        {/* Average Rating */}
        <div className="flex flex-col items-center">
          <span className="text-4xl font-semibold font-outfit text-gray-900">
            {calculateRating(app.metrics.ratings.breakdown)}
          </span>
          <div className="flex gap-1 items-center mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${
                  i < calculateRating(app.metrics.ratings.breakdown)
                    ? "text-green-500"
                    : "text-gray-300"
                } fill-current`}
              />
            ))}
          </div>
          <p className="text-xs font-poppins text-gray-500 mt-1">
            {app.metrics.ratings.totalReviews} reviews
          </p>
        </div>

        {/* Rating Bars */}
        <div className="flex flex-col gap-1 flex-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const breakdown = app.metrics.ratings.breakdown;
            const totalReviews =
              breakdown[1] +
              breakdown[2] +
              breakdown[3] +
              breakdown[4] +
              breakdown[5];
            const count = breakdown[star] || 0;
            const percentage =
              totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs font-medium font-outfit w-3">
                  {star}
                </span>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-r-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-px w-full bg-gray-200 mt-4" />
    </section>
  );
};

const ReviewsBody = ({ app, currentUser }) => {
  const filteredReviews = app.community.reviews.filter(
    (id) => id !== currentUser
  );
  return (
    <section className="px-4 sm:px-6 mt-6">
      <div className="space-y-6">
        {filteredReviews.map((userId, index) => (
          <ReviewCard
            key={index}
            userId={userId}
            appId={app.appId}
            developerId={app.developer.developerId}
          />
        ))}
        {filteredReviews.length === 0 && (
          <div className="w-full text-center text-gray-700 text-xs font-poppins">
            No reviews yet
          </div>
        )}
      </div>
    </section>
  );
};

const AppSupport = ({ app }) => {
  return (
    <section className="px-4">
      <details className="group pt-1">
        <summary className="flex justify-between items-center pr-3 cursor-pointer list-none">
          <span className="text-base font-medium font-poppins text-black">
            App Support
          </span>

          <ChevronDown
            size={20}
            className="w-[22px] h-[22px] text-gray-700 transition-transform duration-200 group-open:rotate-180 p-1 bg-gray-200/50 rounded-full"
          />
        </summary>

        {/* Details Content */}
        <div className="mt-4 space-y-2">
          {/* Email */}
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-700 mt-1" />
            <div className="flex flex-col">
              <span className="text-sm font-medium font-poppins text-gray-800">
                Email
              </span>
              <a
                href={`mailto:${app.details.links.contactEmail}`}
                className="text-sm font-poppins text-gray-600 hover:underline"
                title="Send Email"
              >
                {app.details.links.contactEmail}
              </a>
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-gray-700 mt-1" />
            <div className="flex flex-col">
              <span className="text-sm font-medium font-poppins text-gray-800">
                Privacy Policy
              </span>
              <a
                href={app.details.links.privacyPolicyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-poppins text-gray-600 hover:underline"
                title="Visit Website"
              >
                {app.details.links.privacyPolicyUrl}
              </a>
            </div>
          </div>

          {/* Terms & Conditions */}
          {app.details.links.termsUrl && (
            <div className="flex items-start gap-3">
              <BadgeQuestionMark className="w-5 h-5 text-gray-700 mt-1" />
              <div className="flex flex-col">
                <span className="text-sm font-medium font-poppins text-gray-800">
                  Terms & Conditions
                </span>
                <a
                  href={app.details.links.termsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-poppins text-gray-600 hover:underline"
                  title="Visit Website"
                >
                  {app.details.links.termsUrl}
                </a>
              </div>
            </div>
          )}

          {/* Source Code / Repo */}
          <div className="flex items-start gap-3">
            <FaGithub className="w-5 h-5 text-gray-700 mt-1" />
            <div className="flex flex-col">
              <span className="text-sm font-medium font-poppins text-gray-800">
                Source Code
              </span>
              <a
                href={app.details.sourceCodeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-poppins text-gray-600 hover:underline"
                title="View Source Code"
              >
                {app.details.sourceCodeLink}
              </a>
            </div>
          </div>
        </div>
      </details>
    </section>
  );
};

const AppInfo = ({ app }) => {
  const Card = ({ title, value }) => {
    return (
      <div className="flex justify-between items-center py-1 px-2">
        <p className="text-sm font-poppins font-medium text-neutral-700">
          {title}
        </p>
        <p className="text-sm font-outfit text-neutral-700">{value}</p>
      </div>
    );
  };
  return (
    <>
      <h2 className="text-lg font-medium font-poppins text-black mt-3 mb-1 pt-2 border-t border-gray-300">
        App Info
      </h2>
      <Card title="Version" value={app.details.appDetails.version} />
      <Card
        title="Updated on"
        value={(formatDate(app.updatedAt).split("2025")[0] + "2025").replace(
          ",",
          ""
        )}
      />
      <Card title="Downloads" value={`${app.metrics.downloads} downloads`} />
      <Card
        title="App Size"
        value={`${
          app.details.appDetails.apkFileSizeMB ||
          app.details.appDetails.apkFileSizeMB
        } MB`}
      />
      <Card title="Published  By" value={app.developer.name} />
      <Card
        title="Released on"
        value={(formatDate(app.createdAt).split("2025")[0] + "2025").replace(
          ",",
          ""
        )}
      />
    </>
  );
};

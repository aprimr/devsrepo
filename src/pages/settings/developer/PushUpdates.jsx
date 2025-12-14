import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ShieldCheck,
  FilePlay,
  Star,
  ArrowDownToLine,
  X,
  Wallet,
  CloudUpload,
  Share2,
  Loader2,
} from "lucide-react";
import { FaApple } from "react-icons/fa";
import { TfiAndroid } from "react-icons/tfi";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "../../../store/AppStore";
import { useAuthStore } from "../../../store/AuthStore";
import DevsRepoInverted from "../../../assets/images/DevsRepoInvert.png";
import numberSuffixer from "../../../utils/numberSuffixer";
import { calculateRating } from "../../../utils/calculateRating";
import { toast } from "sonner";
import { deleteFile, uploadFile } from "../../../services/appwriteStorage";
import SuccessAnimation from "../../../assets/animations/success.json";
import Lottie from "lottie-react";

const Toggle = ({
  title,
  label,
  description,
  icon: Icon,
  enabled,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-600 font-poppins mb-2">{title}</label>
      <div className="flex items-center justify-between w-full px-3 py-3.5 border border-gray-100 rounded-xl bg-gray-50">
        <div className="flex items-center gap-4">
          {Icon && <Icon className="text-gray-500 w-5 h-5" />}
          <p className="text-base font-medium text-gray-600 font-poppins">
            {label}
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onChange && onChange(e.target.checked)}
            className="sr-only peer"
          />
          <div
            className={`w-11 h-6 rounded-full block ${
              enabled ? "bg-green-500" : "bg-gray-300"
            }`}
          />
          <span
            className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all ${
              enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </label>
      </div>
      {description && (
        <p className="text-[11px] text-gray-500 font-poppins -mt-0.5">
          {description}
        </p>
      )}
    </div>
  );
};

export default function PushUpdates() {
  const location = useLocation();
  const navigate = useNavigate();

  const { appId } = location.state || {};
  const { fetchAppById, pushAppUpdate } = useAppStore();
  const { user } = useAuthStore();

  const [prevApp, setPrevApp] = useState(null);
  const [appDetails, setAppDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [missingAppId, setMissingAppId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pushingFiles, setPushingFiles] = useState(false);

  const [androidApkUpload, setAndroidApkUpload] = useState(null);
  const [iosIpaUpload, setIosIpaUpload] = useState(null);

  const [tagInput, setTagInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");

  const [updatingSucceed, setUpdatingSucceed] = useState(false);

  // Check if appId is missing
  useEffect(() => {
    if (!appId) setMissingAppId(true);
  }, [appId]);

  // Fetch app details
  useEffect(() => {
    if (!appId) return;

    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const res = await fetchAppById(appId);
        if (res.success) {
          setPrevApp(res.app);
          setAppDetails(res.app);
        } else {
          console.error("Failed:", res.message);
        }
      } catch (err) {
        console.error("Error fetching app details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [appId]);

  const handleChooseFile = (type) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert("File size must be less than 50 MB");
      e.target.value = "";
      return;
    }

    if (type === "android") {
      setAndroidApkUpload(file);
    }

    if (type === "ios") {
      setIosIpaUpload(file);
    }
  };

  const handleRemoveFile = (type) => () => {
    if (type === "android") {
      setAndroidApkUpload(null);
      document.getElementById("apk-upload").value = "";
    }

    if (type === "ios") {
      setIosIpaUpload(null);
      document.getElementById("ipa-upload").value = "";
    }
  };

  const handlePushUpdate = async () => {
    if (!appDetails) return;

    // Check that version is incremented
    if (
      prevApp?.details?.appDetails?.version ===
      appDetails?.details?.appDetails?.version
    ) {
      toast.error(
        "Please increment the version number before pushing the update."
      );
      return;
    }

    // Check that at least one app file exists
    if (!androidApkUpload && !iosIpaUpload) {
      toast.error("Please upload at least one app file (APK or IPA).");
      return;
    }

    try {
      setLoading(true);
      let updatedAppDetails = { ...appDetails };

      // Upload files if any
      if (androidApkUpload || iosIpaUpload) {
        setPushingFiles(true);
        try {
          // Upload Android APK
          if (androidApkUpload) {
            const prevFile = prevApp?.details?.appDetails?.androidApk;
            const apkFile = await uploadFile(androidApkUpload);
            updatedAppDetails.details.appDetails.androidApk = apkFile.$id;

            if (prevFile) {
              try {
                await deleteFile(prevFile);
              } catch (delErr) {
                console.warn("Failed to delete previous APK:", delErr);
              }
            }
          }

          // Upload iOS IPA
          if (iosIpaUpload) {
            const prevFile = prevApp?.details?.appDetails?.iosApk;
            const ipaFile = await uploadFile(iosIpaUpload);
            updatedAppDetails.details.appDetails.iosApk = ipaFile.$id;

            if (prevFile) {
              try {
                await deleteFile(prevFile);
              } catch (delErr) {
                console.warn("Failed to delete previous IPA:", delErr);
              }
            }
          }
        } catch (fileErr) {
          console.error("Error uploading files:", fileErr);
          toast.error("Error uploading files: " + fileErr.message);
          return;
        } finally {
          setPushingFiles(false);
        }
      }

      // Push updated app to Firebase
      const res = await pushAppUpdate(appId, updatedAppDetails);

      if (res.success) {
        toast.success("App update pushed successfully!");
        setPrevApp(res.app);
        setAppDetails(res.app);

        // Clear local file state
        setAndroidApkUpload(null);
        setIosIpaUpload(null);

        // Mark update as succeeded
        setUpdatingSucceed(true);
      } else {
        toast.error("Failed to push update: " + res.error);
        setUpdatingSucceed(false);
      }
    } catch (err) {
      console.error("Error pushing update:", err);
      toast.error("Error pushing update: " + err.message);
      setUpdatingSucceed(false);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white space-y-6">
        {/* Header */}
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
            <div
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 py-1.5 cursor-pointer"
            >
              <ChevronLeft size={26} className="text-gray-800" />
              <span className="text-lg sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
                Push Updates
              </span>
            </div>
          </div>
        </nav>

        {/* App Info Skeleton */}
        <div className="flex items-center gap-4 px-6 animate-pulse">
          <div className="w-20 h-20 bg-gray-200 rounded-2xl" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 w-32 bg-gray-200 rounded-md" />
            <div className="h-3 w-48 bg-gray-200 rounded-md" />
            <div className="h-3 w-40 bg-gray-200 rounded-md" />
          </div>
        </div>

        {/* Form Skeleton */}
        <div className="space-y-4 px-6 animate-pulse">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-32 w-full bg-gray-200 rounded-xl" />
          ))}

          {/* Buttons */}
          <div className="flex gap-4 mt-6 mb-10">
            <div className="flex-1 h-12 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (missingAppId) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <div className="p-6 max-w-xl w-full">
          <img
            src={DevsRepoInverted}
            alt="DevsRepo"
            className="h-12 w-12 mb-2"
          />
          <h2 className="text-lg font-semibold font-poppins text-rose-600">
            Invalid Access
          </h2>
          <p className="mt-2 text-sm text-rose-600 font-poppins leading-relaxed">
            It looks like you opened the update page directly. To push updates,
            please follow the correct steps from the dashboard or app details
            page.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-rose-500 text-white px-4 py-2 font-medium font-poppins rounded-xl hover:bg-rose-600"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <div
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 py-1.5 cursor-pointer"
          >
            <ChevronLeft size={26} className="text-gray-800" />
            <span className="text-lg sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
              Push Updates
            </span>
          </div>
          {user?.photoURL && (
            <img
              src={user.photoURL}
              className="w-10 h-10 rounded-full bg-gray-200 border border-white shadow-sm"
            />
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* App Information */}
        {prevApp && (
          <section className="mb-6 px-6">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={`https://cloud.appwrite.io/v1/storage/buckets/${
                  import.meta.env.VITE_APPWRITE_BUCKET_ID
                }/files/${prevApp?.details?.media?.icon}/view?project=${
                  import.meta.env.VITE_APPWRITE_PROJECT_ID
                }`}
                className="w-20 h-20 rounded-2xl border border-gray-300 bg-gray-100 flex items-center justify-center"
              />
              <div>
                <h2 className="text-base font-medium font-poppins line-clamp-1 text-gray-900">
                  {prevApp?.details?.name}
                </h2>

                <div className="flex flex-wrap gap-4 text-xs text-gray-600 font-outfit mt-1 items-center">
                  <span className="flex items-center gap-1">
                    v-{prevApp?.details?.appDetails?.version}
                  </span>

                  <span className="flex items-center gap-0.5">
                    <ArrowDownToLine size={12} />
                    {numberSuffixer(prevApp?.metrics?.downloads)}
                  </span>

                  <span className="flex items-center gap-1">
                    <Star
                      size={12}
                      className="fill-yellow-500 text-yellow-500"
                    />
                    {calculateRating(prevApp?.metrics?.ratings?.breakdown)} (
                    {numberSuffixer(prevApp?.metrics?.ratings?.totalReviews)})
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  {prevApp.details.appDetails.androidApk && (
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-lg font-poppins">
                      Android
                    </span>
                  )}
                  {prevApp.details.appDetails.iosApk && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-poppins">
                      iOS
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Create New Update Section */}
        <section
          className={`bg-white border border-gray-200 rounded-2xl p-6 mb-6 ${
            loading && "pointer-events-none"
          }`}
        >
          <h2 className="text-xl font-medium font-poppins text-gray-900 mb-6">
            Push New Update
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Update Details */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-poppins mb-2">
                  App Name
                </label>
                <input
                  value={appDetails?.details?.name}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your app name"
                  maxLength={60}
                  onChange={(e) =>
                    setAppDetails((prev) => ({
                      ...prev,
                      details: {
                        ...prev.details,
                        name: e.target.value,
                      },
                    }))
                  }
                />
                <p className="text-xs text-gray-500 font-outfit text-right px-1 mt-0.5">
                  {appDetails?.details?.name?.length}/60 Characters
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 font-poppins mb-2">
                    Version{" "}
                    <span className="text-xs font-outfit">
                      (current: {prevApp?.details?.appDetails?.version})
                    </span>
                  </label>

                  <input
                    value={appDetails?.details?.appDetails?.version || ""}
                    onChange={(e) =>
                      setAppDetails((prev) => ({
                        ...prev,
                        details: {
                          ...prev.details,
                          appDetails: {
                            ...prev.details.appDetails,
                            version: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.0.1"
                  />

                  {appDetails?.details?.appDetails?.version ===
                    prevApp?.details?.appDetails?.version && (
                    <p className="text-[11px] text-rose-600 font-poppins mt-1">
                      *Please provide an incremented version number.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 font-poppins mb-2">
                    Version Code
                  </label>

                  <input
                    value={
                      appDetails?.details?.appDetails?.versionCode + 1 || ""
                    }
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins bg-gray-100 text-gray-500 cursor-not-allowed"
                  />

                  <p className="text-[11px] text-gray-600 font-poppins mt-1 leading-normal">
                    Version code is incremented automatically.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 font-poppins mb-2">
                  Project Source Code
                </label>

                <input
                  value={appDetails?.details?.sourceCodeLink || ""}
                  onChange={(e) =>
                    setAppDetails((prev) => ({
                      ...prev,
                      details: {
                        ...prev.details,
                        sourceCodeLink: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your project repository link (GitHub, GitLab, etc.)"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 font-poppins mb-2">
                  Tags
                </label>

                {/* Show selected tags */}
                {appDetails?.details?.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {appDetails.details.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="bg-green-50 text-green-700 border border-green-700 pl-3 pr-1.5 py-1 rounded-xl text-sm flex items-center gap-1.5"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() =>
                            setAppDetails((prev) => ({
                              ...prev,
                              details: {
                                ...prev.details,
                                tags: prev.details.tags.filter(
                                  (tag) => tag !== t
                                ),
                              },
                            }))
                          }
                          className="text-green-700"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Add new tag */}
                <div className="relative">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setAppDetails((prev) => ({
                          ...prev,
                          details: {
                            ...prev.details,
                            tags: [...prev.details.tags, tagInput],
                          },
                        }));
                        setTagInput("");
                      }
                    }}
                    className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Add tag and press Add"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setAppDetails((prev) => ({
                        ...prev,
                        details: {
                          ...prev.details,
                          tags: [...prev.details.tags, tagInput],
                        },
                      }));
                      setTagInput("");
                    }}
                    disabled={appDetails?.details?.tags?.length >= 10}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-5 py-2 rounded-lg font-poppins font-semibold text-white bg-green-500 disabled:bg-green-600 text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 font-poppins mb-2">
                  Short Description
                </label>

                <input
                  maxLength={100}
                  value={appDetails?.details?.description?.short || ""}
                  onChange={(e) =>
                    setAppDetails((prev) => ({
                      ...prev,
                      details: {
                        ...prev.details,
                        description: {
                          ...prev.details.description,
                          short: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="One line about the app"
                />

                <p className="text-xs text-gray-500 font-outfit text-right px-1 mt-0.5">
                  {appDetails?.details?.description?.short?.length || 0}/100
                  Characters
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 font-poppins mb-2">
                  Long Description
                </label>

                <textarea
                  maxLength={2000}
                  rows={4}
                  value={appDetails?.details?.description?.long || ""}
                  onChange={(e) =>
                    setAppDetails((prev) => ({
                      ...prev,
                      details: {
                        ...prev.details,
                        description: {
                          ...prev.details.description,
                          long: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Explain about the app"
                />

                <p className="text-xs text-gray-500 font-outfit text-right px-1 mt-0.5">
                  {appDetails?.details?.description?.long?.length || 0}/2000
                  Characters
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 font-poppins mb-2">
                  Feature Bullets
                </label>

                {/* Display existing feature bullets */}
                {appDetails?.details?.description?.featureBullets?.length >
                  0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {appDetails.details.description.featureBullets.map(
                      (feature, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-50 text-gray-700 border-2 border-gray-400 pl-3 pr-1.5 py-1 rounded-xl text-xs font-medium font-poppins flex items-center gap-1.5"
                        >
                          <span className="h-1.5 w-1.5 bg-gray-600 rounded-full" />
                          {feature}
                          <button
                            type="button"
                            onClick={() =>
                              setAppDetails((prev) => ({
                                ...prev,
                                details: {
                                  ...prev.details,
                                  description: {
                                    ...prev.details.description,
                                    featureBullets:
                                      prev.details.description.featureBullets.filter(
                                        (f) => f !== feature
                                      ),
                                  },
                                },
                              }))
                            }
                            className="text-gray-600"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      )
                    )}
                  </div>
                )}

                {/* Add new feature bullet */}
                <div className="relative">
                  <input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const clean = featureInput.trim();
                        if (!clean) return;

                        const existing =
                          appDetails?.details?.description?.featureBullets ||
                          [];
                        if (existing.includes(clean)) return; // prevent duplicates

                        setAppDetails((prev) => ({
                          ...prev,
                          details: {
                            ...prev.details,
                            description: {
                              ...prev.details.description,
                              featureBullets: [...existing, clean],
                            },
                          },
                        }));

                        setFeatureInput("");
                      }
                    }}
                    className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Add features and press Add"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      const clean = featureInput.trim();
                      if (!clean) return;

                      const existing =
                        appDetails?.details?.description?.featureBullets || [];
                      if (existing.includes(clean)) return; // prevent duplicates

                      setAppDetails((prev) => ({
                        ...prev,
                        details: {
                          ...prev.details,
                          description: {
                            ...prev.details.description,
                            featureBullets: [...existing, clean],
                          },
                        },
                      }));

                      setFeatureInput("");
                    }}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-5 py-2 rounded-lg font-poppins font-semibold text-white bg-green-500 text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 font-poppins mb-2">
                  What's New
                </label>

                <textarea
                  rows={2}
                  maxLength={500}
                  value={appDetails?.details?.description?.whatsNew || ""}
                  onChange={(e) =>
                    setAppDetails((prev) => ({
                      ...prev,
                      details: {
                        ...prev.details,
                        description: {
                          ...prev.details.description,
                          whatsNew: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Summarize what’s new in this version"
                />

                <p className="text-xs text-gray-500 font-outfit text-right px-1 mt-0.5">
                  {appDetails?.details?.description?.whatsNew?.length || 0}/500
                  Characters
                </p>
              </div>

              <Toggle
                title="Does your app has ads?"
                label="Contains ADs?"
                icon={FilePlay}
                enabled={appDetails?.details?.hasAds || false}
                onChange={(value) =>
                  setAppDetails((prev) => ({
                    ...prev,
                    details: { ...prev.details, hasAds: value },
                  }))
                }
              />

              <Toggle
                title="Does your app has in-app purchases?"
                label="In-App Purchases?"
                icon={Wallet}
                enabled={appDetails?.details?.inAppPurchases || false}
                onChange={(value) =>
                  setAppDetails((prev) => ({
                    ...prev,
                    details: { ...prev.details, inAppPurchases: value },
                  }))
                }
              />
            </div>

            {/* APP Files */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-medium font-poppins text-gray-900 mb-4">
                Update Files
                <span className="text-[11px] font-poppins text-gray-500 ml-2">
                  (Max 50 MB • At least one)
                </span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Android APK */}
                <div className="border-2 border-green-500 bg-linear-to-r from-green-100 to-green-200 rounded-xl p-5 shadow-lg transition-transform duration-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <TfiAndroid className="text-green-600 text-xl" />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-poppins font-medium text-gray-900">
                        Android APK
                      </h4>
                      {prevApp?.details?.appDetails?.androidApk ? (
                        <span className="text-xs text-green-700 font-poppins">
                          Previous APK file available
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 font-poppins">
                          Previous APK file not available
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {!androidApkUpload ? (
                      <div className="flex items-center gap-3">
                        <label
                          htmlFor="apk-upload"
                          className="flex items-center gap-2 px-5 py-2 rounded-md font-poppins font-medium text-sm text-white bg-green-600 hover:bg-green-700 cursor-pointer"
                        >
                          <TfiAndroid size={18} />
                          <span>Choose New APK File</span>
                        </label>

                        <input
                          id="apk-upload"
                          type="file"
                          accept=".apk"
                          className="sr-only"
                          onChange={handleChooseFile("android")}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <p className="text-sm w-full text-gray-700 font-poppins truncate">
                          {androidApkUpload.name}
                        </p>

                        <button
                          type="button"
                          onClick={handleRemoveFile("android")}
                          className="flex items-center gap-2 px-5 py-2 rounded-md font-poppins font-medium text-sm text-white bg-red-500 hover:bg-red-600"
                        >
                          <X size={18} />
                          Remove APK File
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* iOS IPA */}
                <div className="border-2 border-gray-400 bg-linear-to-r from-gray-100 to-gray-200 rounded-xl p-5 shadow-lg transition-transform duration-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <FaApple className="text-gray-700 text-xl" />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-poppins font-medium text-gray-900">
                        iOS IPA
                      </h4>
                      {prevApp?.details?.appDetails?.iosApk ? (
                        <span className="text-xs text-green-700 font-poppins">
                          Previous IPA file available
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 font-poppins">
                          Previous IPA file not available
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {!iosIpaUpload ? (
                      <div className="flex items-center gap-3">
                        <label
                          htmlFor="ipa-upload"
                          className="flex items-center gap-2 px-5 py-2 rounded-md font-poppins font-medium text-sm text-white bg-gray-700 hover:bg-gray-800 cursor-pointer"
                        >
                          <FaApple size={18} />
                          <span>Choose New IPA File</span>
                        </label>

                        <input
                          id="ipa-upload"
                          type="file"
                          accept=".ipa"
                          className="sr-only"
                          onChange={handleChooseFile("ios")}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-gray-700 font-poppins truncate">
                          {iosIpaUpload.name}
                        </p>

                        <button
                          type="button"
                          onClick={handleRemoveFile("ios")}
                          className="flex items-center gap-2 px-5 py-2 rounded-md font-poppins font-medium text-sm text-white bg-red-500 hover:bg-red-600"
                        >
                          <X size={18} />
                          Remove IPA File
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Data Safety */}
            <div className="lg:col-span-2 space-y-4 mt-6">
              <h3 className="text-lg font-medium font-poppins text-gray-900">
                Data Safety
              </h3>

              <Toggle
                title="Collects user Data?"
                label="Data Collection"
                icon={CloudUpload}
                enabled={appDetails?.details?.data?.collectsData || false}
                onChange={(value) =>
                  setAppDetails((prev) => ({
                    ...prev,
                    details: {
                      ...prev.details,
                      data: { ...prev.details.data, collectsData: value },
                    },
                  }))
                }
              />

              {appDetails?.details?.data?.collectsData && (
                <div>
                  <label className="block text-sm text-gray-600 font-poppins mb-2">
                    Types of Data Collected
                    <span className="text-[11px] ml-1">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={appDetails?.details?.data?.dataCollected || ""}
                    onChange={(e) =>
                      setAppDetails((prev) => ({
                        ...prev,
                        details: {
                          ...prev.details,
                          data: {
                            ...prev.details.data,
                            dataCollected: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Name, Email, Usage Analytics"
                  />
                </div>
              )}

              <Toggle
                title="Shares data with third parties?"
                label="Data Sharing"
                icon={Share2}
                enabled={appDetails?.details?.data?.sharesData || false}
                onChange={(value) =>
                  setAppDetails((prev) => ({
                    ...prev,
                    details: {
                      ...prev.details,
                      data: { ...prev.details.data, sharesData: value },
                    },
                  }))
                }
              />

              <Toggle
                title="COPPA Compliant?"
                label="COPPA"
                icon={ShieldCheck}
                enabled={appDetails?.details?.data?.coppaCompliant || false}
                onChange={(value) =>
                  setAppDetails((prev) => ({
                    ...prev,
                    details: {
                      ...prev.details,
                      data: { ...prev.details.data, coppaCompliant: value },
                    },
                  }))
                }
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePushUpdate}
              disabled={loading}
              className="w-full flex items-center gap-3 justify-center py-4 rounded-xl font-poppins bg-green-500 text-white text-sm sm:text-lg font-medium disabled:bg-green-600 disabled:text-green-50"
            >
              {loading && <Loader2 size={22} className="animate-spin" />}
              <span>
                {loading
                  ? pushingFiles
                    ? "Uploading Files. Please Wait."
                    : "Publishing App"
                  : "Publish New Version"}
              </span>
            </button>
          </div>
        </section>
      </div>

      {/* Published Modal */}
      {updatingSucceed && (
        <div className="fixed h-lvh inset-0 flex flex-col justify-center items-center bg-white z-50 p-4">
          {/* Animation */}
          <div className="flex flex-col items-center text-center mt-30">
            <Lottie
              animationData={SuccessAnimation}
              loop={false}
              className="h-50 w-50 mb-8"
            />
            <h2 className="text-4xl font-poppins font-semibold mb-3 text-black">
              New Version Published!
            </h2>
            <p className="text-sm text-gray-500 font-poppins max-w-xs">
              Your app has been successfully updated.
            </p>
          </div>

          {/* Bottom Buttons */}
          <div className="mt-auto mb-20 flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:mb-8">
            <button
              onClick={() => {
                navigate("/setting-apps-management");
              }}
              className="flex-1 px-4 py-3 border-2 border-green-600 text-green-600 font-medium rounded-xl font-poppins"
            >
              Manage Apps
            </button>
            <button
              onClick={() => {
                navigate("/");
              }}
              className="flex-1 px-4 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition font-poppins"
            >
              Go to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

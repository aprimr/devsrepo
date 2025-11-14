import { useState, useRef } from "react";
import {
  ChevronLeft,
  Upload,
  ImageUp,
  Images,
  ShieldCheck,
  X,
  FilePlay,
  Wallet,
  Loader2,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/AuthStore";
import { useAppStore } from "../../../store/AppStore";
import { uploadFile } from "../../../services/appwriteStorage";
import { FaApple } from "react-icons/fa";
import { TfiAndroid } from "react-icons/tfi";
import { toast } from "sonner";
import SuccessAnimation from "../../../assets/animations/success.json";
import Lottie from "lottie-react";

const Toggle = ({
  title,
  label,
  description,
  icon: Icon,
  toggleLoading,
  enabled,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-600 font-poppins mb-2">{title}</label>
      <div className="flex items-center justify-between w-full px-3 py-3.5 border border-gray-100 rounded-xl bg-gray-50">
        <div className="flex items-center gap-4">
          {toggleLoading ? (
            <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse" />
          ) : (
            Icon && <Icon className="text-gray-500 w-5 h-5" />
          )}
          <p className="text-base font-medium text-gray-600 font-poppins">
            {label}
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onChange(e.target.checked)}
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

export default function Publish() {
  const { user, updateUserProfile } = useAuthStore();
  const { createApp } = useAppStore();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // File states
  const [iconFile, setIconFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [screenshotFiles, setScreenshotFiles] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [videoURL, setVideoURL] = useState("");

  // File previews
  const [iconFilePreview, setIconFilePreview] = useState(null);
  const [bannerFilePreview, setBannerFilePreview] = useState(null);
  const [screenshotFilesPreview, setScreenshotFilesPreview] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  // Image to Base64
  const imgToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Basic fields
  const [appName, setAppName] = useState("");
  const [currentVersion, setCurrentVersion] = useState("");
  const [projectSourceLink, setProjectSourceLink] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [hasAds, setHasAds] = useState(false);
  const [inAppPurchases, setInAppPurchases] = useState(false);
  const [contactEmail, setContactEmail] = useState(
    user?.developerProfile?.contactEmail || ""
  );
  const [termsUrl, setTermsUrl] = useState("");
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState("");
  const [ageRating, setAgeRating] = useState("Everyone");

  // Tags
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const tagRef = useRef(null);

  // Features
  const [featureBullets, setFeatureBullets] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const featureRef = useRef(null);

  // App File
  const [apkFile, setApkFile] = useState(null);
  const [ipaFile, setIpaFile] = useState(null);

  // Data Safety
  const [collectsData, setCollectsData] = useState(false);
  const [dataCollected, setDataCollected] = useState("");
  const [sharesData, setSharesData] = useState(false);
  const [coppaCompliant, setCoppaCompliant] = useState(false);

  // Icon handler
  const onIconChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Max file size allowed
    const MAX_SIZE_MB = 1;
    const fileSizeMB = file.size / (1024 * 1024);

    if (fileSizeMB > MAX_SIZE_MB) {
      toast.error(`Please upload a file smaller than ${MAX_SIZE_MB} MB.`);
      return;
    }

    const base64 = await imgToBase64(file);
    setIconFilePreview(base64);
    setIconFile(file);
  };

  // Banner handler
  const onBannerChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Max file size allowed
    const MAX_SIZE_MB = 1;
    const fileSizeMB = file.size / (1024 * 1024);

    if (fileSizeMB > MAX_SIZE_MB) {
      toast.error(`Please upload a file smaller than ${MAX_SIZE_MB} MB.`);
      return;
    }

    const base64 = await imgToBase64(file);
    setBannerFilePreview(base64);
    setBannerFile(file);
  };

  // Screenshots handler
  const onScreenshotChange = async (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Max file size allowed
    const MAX_SIZE_MB = 1;
    const fileSizeMB = file.size / (1024 * 1024);

    if (fileSizeMB > MAX_SIZE_MB) {
      toast.error(`Please upload a file smaller than ${MAX_SIZE_MB} MB.`);
      return;
    }

    const base64 = await imgToBase64(file);

    // Update preview
    setScreenshotFilesPreview((prev) => {
      const updated = [...prev];
      updated[index] = base64;
      return updated;
    });

    // Update actual files
    setScreenshotFiles((prev) => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
  };

  // Remove screenshot
  const removeScreenshot = (index) => {
    setScreenshotFiles((prev) => {
      const copy = [...prev];
      copy[index] = null;
      return copy;
    });

    setScreenshotFilesPreview((prev) => {
      const copy = [...prev];
      copy[index] = null;
      return copy;
    });
  };

  // tags
  const addTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    if (!tags.includes(v)) setTags((t) => [...t, v]);
    setTagInput("");
    tagRef.current?.focus();
  };
  const removeTag = (v) => setTags((t) => t.filter((x) => x !== v));

  // features
  const addFeature = () => {
    const v = featureInput.trim();
    if (!v) return;
    if (!featureBullets.includes(v)) setFeatureBullets((t) => [...t, v]);
    setFeatureInput("");
    featureRef.current?.focus();
  };
  const removeFeature = (v) =>
    setFeatureBullets((t) => t.filter((x) => x !== v));

  // Handle APK
  const handleApkChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setApkFile(file);
  };

  // Handle IPA
  const handleIpaChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setIpaFile(file);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fields = {
      iconFile,
      bannerFile,
      screenshot1: screenshotFiles[0],
      screenshot2: screenshotFiles[1],
      screenshot3: screenshotFiles[2],
      appName,
      currentVersion,
      sourceCodeLink: projectSourceLink,
      type,
      category,
      tags,
      shortDesc,
      longDesc,
      featureBullets,
      privacyPolicyUrl,
      ageRating,
    };

    const fieldLabels = {
      iconFile: "App Icon",
      bannerFile: "Banner Image",
      screenshot1: "Screenshot 1",
      screenshot2: "Screenshot 2",
      screenshot3: "Screenshot 3",
      appName: "App Name",
      currentVersion: "Current Version",
      projectSourceLink: "Project Source Link",
      type: "Tpe",
      category: "Category",
      tags: "Tags",
      shortDesc: "Short Description",
      longDesc: "Long Description",
      featureBullets: "Feature Highlights",
      privacyPolicyUrl: "Privacy Policy URL",
      ageRating: "Age Rating",
    };

    const emptyField = Object.entries(fields).find(([_, value]) => !value);
    if (emptyField) {
      const friendlyName = fieldLabels[emptyField[0]] || emptyField[0];
      toast.info(`Please fill in the required field: ${friendlyName}`);
      return;
    }
    if (!apkFile && !ipaFile) {
      toast.info("Please upload at least one file (APK or IPA).");
      return;
    }

    try {
      setIsSubmitting(true);

      //Upload files in appwrite bucket
      let apkAppwriteID = null;
      if (apkFile) {
        const apkRes = await uploadFile(apkFile);
        apkAppwriteID = apkRes.$id;
      }

      let ipaAppwriteID = null;
      if (ipaFile) {
        const ipaRes = await uploadFile(ipaFile);
        ipaAppwriteID = ipaRes.$id;
      }

      const iconRes = await uploadFile(iconFile);
      const iconAppwriteID = iconRes.$id;

      const bannerRes = await uploadFile(bannerFile);
      const bannerAppwriteID = bannerRes.$id;

      const screenshotAppwriteIDs = [];
      for (let file of screenshotFiles) {
        if (!file) continue;
        try {
          const ssRes = await uploadFile(file);
          screenshotAppwriteIDs.push(ssRes.$id);
        } catch (err) {
          console.error(err);
          toast.error(
            "Error uploading screenshots. Please try with smaller files."
          );
          setIsSubmitting(false);
          return;
        }
      }

      // Final Payload
      const payload = {
        developer: {
          name: user?.name,
          developerId: user?.uid,
          email: user?.email,
        },
        details: {
          name: appName,
          type,
          category,
          tags,
          projectSourceLink,
          hasAds,
          inAppPurchases,
          ageRating,
          description: {
            short: shortDesc,
            long: longDesc,
            whatsNew: "",
            featureBullets,
          },
          appDetails: {
            version: currentVersion,
            versionCode: 1,
            apkFileSizeMB: (apkFile?.size / (1024 * 1024)).toFixed(2),
            ipaFileSizeMB: (ipaFile?.size / (1024 * 1024)).toFixed(2),
            androidApk: apkAppwriteID,
            iosApk: ipaAppwriteID,
          },
          media: {
            icon: iconAppwriteID,
            banner: bannerAppwriteID,
            screenshots: screenshotAppwriteIDs,
            promoVideoURL: videoURL,
          },
          links: {
            contactEmail,
            privacyPolicyUrl,
            termsUrl,
          },
          data: {
            collectsData,
            dataCollected,
            sharesData,
            coppaCompliant,
          },
        },
      };

      // Upload to firestore
      const res = await createApp(payload);
      if (res?.success) {
        // update apps in user
        try {
          setIsUpdatingUser(true);
          const payload = {
            ...user,
            developerProfile: {
              ...user.developerProfile,
              apps: {
                ...user.developerProfile.apps,
                submittedAppIds: [
                  res.appId,
                  ...user.developerProfile.apps.submittedAppIds,
                ],
              },
            },
          };
          const resUserUpdate = await updateUserProfile(payload);

          if (!resUserUpdate.success) {
            setIsSubmitting(false);
            setIsUpdatingUser(false);
            return;
          }
          setIsUpdatingUser(false);
        } catch (error) {
          toast.error("Error updating user. Please try again.");
          console.log(error);
          setIsSubmitting(false);
          setIsUpdatingUser(false);
          return;
        }
      } else {
        toast.error("Error publishing your app. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsModalOpen(true);
    } catch (error) {
      console.error("error", error);
      toast.error("An error occurred while submitting your app.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <div
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 py-1.5 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <ChevronLeft size={26} className="text-gray-800" />
            <span className="text-lg sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
              Publish Your App
            </span>
          </div>
          {user?.photoURL && (
            <img
              src={user.photoURL}
              alt="user-icon"
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover cursor-pointer"
            />
          )}
        </div>
      </nav>

      {/* Suspension Status */}
      {(user.developerProfile?.suspendedStatus?.isSuspended ||
        user.system.banStatus.isBanned) && (
        <div className="w-full max-w-4xl mx-auto mt-6 px-4 sm:px-6">
          <div className="bg-rose-50 border border-rose-300 rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-rose-500 text-white px-4 py-3 font-poppins font-semibold text-center sm:text-left">
              {user.developerProfile?.suspendedStatus?.isSuspended
                ? "Your Developer Account is Suspended"
                : "Your Account is Banned"}
            </div>

            {/* Content */}
            <div className="px-4 py-3 space-y-2 text-sm font-outfit text-gray-700">
              <p>
                <span className="font-medium">Reason:</span>{" "}
                {user.developerProfile?.suspendedStatus?.isSuspended
                  ? user.developerProfile.suspendedStatus.reason ||
                    "No reason provided."
                  : user.system.banStatus.reason || "No reason provided."}
              </p>
              <p className="text-xs text-gray-500">
                {user.developerProfile?.suspendedStatus?.isSuspended
                  ? "Please contact the developer if you believe this is an error or for further assistance."
                  : "If you believe this is a mistake, contact support for assistance."}
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className={`max-w-4xl mx-auto px-4 sm:px-6 py-6 ${
          user.developerProfile.suspendedStatus.isSuspended ||
          (user.system.banStatus.isBanned &&
            "pointer-events-none cursor-not-allowed")
        }`}
      >
        {/* App Media */}
        <section
          className={`bg-white border border-gray-200 rounded-2xl p-6 mb-6 ${
            isSubmitting && "pointer-events-none"
          }`}
        >
          <h2 className="text-xl font-medium font-poppins text-gray-900 mb-4">
            App Media
          </h2>

          {/* Icon */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 font-poppins mb-2">
              App Icon
            </label>

            <label
              htmlFor="icon-upload"
              className="w-36 h-36 rounded-lg border border-gray-300 bg-white flex items-center justify-center cursor-pointer overflow-hidden relative"
            >
              {iconFile && iconFilePreview ? (
                <>
                  <img
                    src={iconFilePreview}
                    alt="Icon preview"
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIconFile(null);
                      setIconFilePreview(null);
                    }}
                    className="absolute top-1.5 right-1.5 p-1 rounded-sm bg-white"
                  >
                    <X size={16} className="text-black" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <ImageUp size={26} />
                  <span className="text-[13px] mt-2 font-outfit">
                    512 × 512
                  </span>
                  <span className="text-xs mt-0.5 font-poppins">
                    Tap to upload icon
                  </span>
                  <span className="text-[10px] mt-0.5 font-poppins">
                    1 MB max
                  </span>
                </div>
              )}
            </label>

            <input
              id="icon-upload"
              type="file"
              accept="image/*"
              onChange={onIconChange}
              className="sr-only"
            />
          </div>

          {/* Banner */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 font-poppins mb-2">
              Banner
            </label>

            <label
              htmlFor="banner-upload"
              className="w-full h-36 rounded-lg border border-gray-300 bg-white flex items-center justify-center cursor-pointer overflow-hidden relative"
            >
              {bannerFile && bannerFilePreview ? (
                <>
                  <img
                    src={bannerFilePreview}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setBannerFile(null);
                      setBannerFilePreview(null);
                    }}
                    className="absolute top-1.5 right-1.5 p-1 rounded-sm bg-white"
                  >
                    <X size={16} className="text-black" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <Upload size={28} />
                  <span className="text-[13px] mt-2 font-outfit">
                    1280 × 720
                  </span>
                  <span className="text-xs mt-0.5 font-poppins">
                    Tap to upload banner
                  </span>
                  <span className="text-[10px] mt-0.5 font-poppins">
                    1 MB max
                  </span>
                </div>
              )}
            </label>

            <input
              id="banner-upload"
              type="file"
              accept="image/*"
              onChange={onBannerChange}
              className="sr-only"
            />
          </div>

          {/* Screenshots */}
          <div className="mb-6">
            <label className="flex items-baseline gap-1 text-sm text-gray-600 font-poppins mb-2">
              Screenshots
              <span className="text-[11px] text-gray-500">(Min 3)</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="relative group">
                  <label
                    htmlFor={`screenshot-${i}`}
                    className={`w-full aspect-9/16 rounded-lg border flex items-center justify-center overflow-hidden cursor-pointer transition border-gray-300 bg-white hover:bg-gray-50 `}
                  >
                    {screenshotFiles[i] && screenshotFilesPreview[i] ? (
                      <>
                        <img
                          src={screenshotFilesPreview[i]}
                          alt={`Screenshot ${i + 1}`}
                          className="w-full h-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeScreenshot(i);
                          }}
                          className="absolute top-1.5 right-1.5 p-1 rounded-sm bg-white shadow-sm"
                        >
                          <X size={16} className="text-black" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 px-2 text-center">
                        <Images size={26} />
                        <span className="text-[13px] mt-2 font-outfit">
                          Slot {i + 1} {i < 3 && "*"}
                        </span>
                        <span className="text-[13px] mt-0.5 font-outfit">
                          1080 × 1920
                        </span>
                        <span className="text-xs mt-1 font-poppins">
                          Tap to upload Screenshot
                        </span>
                        <span className="text-[10px] mt-0.5 font-poppins">
                          1 MB max
                        </span>
                      </div>
                    )}
                  </label>

                  <input
                    id={`screenshot-${i}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => onScreenshotChange(i, e)}
                    className="sr-only"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Video URL */}
          <div>
            <label className="flex items-baseline gap-1 text-sm text-gray-600 font-poppins mb-2">
              Video URL
              <span className="text-[11px] text-gray-500">(optional)</span>
            </label>
            <input
              value={videoURL}
              onChange={(e) => setVideoURL(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter YouTube/ other video link"
            />
          </div>
        </section>

        {/* Basic Information */}
        <section
          className={`bg-white border border-gray-200 rounded-2xl p-6 mb-6 ${
            isSubmitting && "pointer-events-none"
          }`}
        >
          <h2 className="text-xl font-medium font-poppins text-gray-900 mb-4">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* App Name */}
            <div>
              <label className="block text-sm text-gray-600 font-poppins mb-2">
                App Name
              </label>
              <input
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                maxLength={60}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your app name"
              />
              <p className="text-xs text-gray-500 font-outfit text-right px-1 mt-0.5 ">
                {appName.length}/60 Characters
              </p>
            </div>

            {/* Version */}
            <div>
              <label className="block text-sm text-gray-600 font-poppins mb-2">
                Current Version
              </label>
              <input
                value={currentVersion}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,2}(\.\d{0,2}){0,2}$/.test(value)) {
                    setCurrentVersion(value);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="1.0.0"
              />
            </div>

            {/* Project Source Link */}
            <div>
              <label className="block text-sm text-gray-600 font-poppins mb-2">
                Project Source Code
              </label>
              <input
                value={projectSourceLink}
                onChange={(e) => setProjectSourceLink(e.target.value)}
                onBlur={(e) => {
                  let value = e.target.value.trim();
                  // If link doesn’t start with https://www. fix it
                  if (!/^https:\/\/www\./.test(value)) {
                    if (/^https?:\/\//.test(value)) {
                      value = value.replace(/^https?:\/\//, "https://www.");
                    } else if (/^www\./.test(value)) {
                      value = "https://" + value;
                    } else {
                      value = "https://www." + value;
                    }
                  }

                  setProjectSourceLink(value);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your project link"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm text-gray-600 font-poppins mb-2">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="">Select type</option>
                <option>Mobile App</option>
                <option>UI Clone</option>
                <option>Tools</option>
                <option>Game</option>
                <option>Template</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm text-gray-600 font-poppins mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="">Select category</option>
                <option>Social</option>
                <option>Productivity</option>
                <option>Communication</option>
                <option>Shopping</option>
                <option>Entertainment</option>
                <option>Education</option>
                <option>Health & Fitness</option>
                <option>Utilities</option>
                <option>Other</option>
              </select>
            </div>

            {/* Tag */}
            <div className="lg:col-span-2">
              <label className="block text-sm text-gray-600 font-poppins mb-2">
                Tags
              </label>
              {tags.length !== 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="bg-green-50 text-green-700 border border-green-700 pl-3 pr-1.5 py-1 rounded-xl text-sm flex items-center gap-1.5"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        className="text-green-700"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="relative">
                <input
                  ref={tagRef}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Add tag and press Add"
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={tags.length === 10}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-5 py-2 rounded-lg font-poppins font-semibold text-white bg-green-500 disabled:bg-green-600 text-sm"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-sm text-gray-600 font-poppins mb-2">
                Short Description
              </label>
              <input
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="One-line pitch"
              />
              <p className="text-xs text-gray-500 font-outfit text-right px-1 mt-0.5 ">
                {shortDesc.length}/100 Characters
              </p>
            </div>

            {/* Long Description */}
            <div className="lg:col-span-2">
              <label className="block text-sm text-gray-600 font-poppins mb-2">
                Long Description
              </label>
              <textarea
                value={longDesc}
                onChange={(e) => setLongDesc(e.target.value)}
                rows={5}
                maxLength={400}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="Explain features and usage"
              ></textarea>
              <p className="text-xs text-gray-500 font-outfit text-right px-1 mt-0.5 ">
                {shortDesc.length}/400 Characters
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="lg:col-span-2">
              <label className="block text-sm text-gray-600 font-poppins mb-2">
                Feature Bullets
              </label>
              {featureBullets.length !== 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {featureBullets.map((t, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-50 text-gray-700 border-2 border-gray-400 pl-3 pr-1.5 py-1 rounded-xl text-xs font-medium font-poppins flex items-center gap-1.5"
                    >
                      <span className="h-1.5 w-1.5 bg-gray-600 rounded-full" />
                      {t}
                      <button
                        type="button"
                        onClick={() => removeFeature(t)}
                        className="text-gray-600"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="relative">
                <input
                  ref={featureRef}
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addFeature())
                  }
                  className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Add features and press Add"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-5 py-2 rounded-lg font-poppins font-semibold text-white bg-green-500 text-sm"
                >
                  Add
                </button>
              </div>
            </div>

            <Toggle
              title="Does your app have ads?"
              label="Contains Ads?"
              icon={FilePlay}
              enabled={hasAds}
              onChange={setHasAds}
            />

            <Toggle
              title="Does your app have in-app purchases?"
              label="In-App Purchases?"
              icon={Wallet}
              enabled={inAppPurchases}
              onChange={setInAppPurchases}
            />

            {/* Contact Email */}
            <div>
              <label className="block text-sm text-gray-600 font-poppins mb-2">
                Contact Email
              </label>
              <input
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                disabled={true}
                className="w-full px-4 py-3 border border-gray-300 text-gray-400 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </section>

        {/* Policies & Legal */}
        <section
          className={`bg-white border border-gray-200 rounded-2xl p-6 mb-6 ${
            isSubmitting && "pointer-events-none"
          }`}
        >
          <h2 className="text-xl font-medium font-poppins text-gray-900 mb-4">
            Policies & Legal
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 font-poppins mb-2">
                Privacy Policy URL
              </label>
              <input
                value={privacyPolicyUrl}
                onChange={(e) => setPrivacyPolicyUrl(e.target.value)}
                onBlur={(e) => {
                  let value = e.target.value.trim();
                  if (!value) return;

                  if (!/^https:\/\/www\./.test(value)) {
                    if (/^https?:\/\//.test(value)) {
                      value = value.replace(/^https?:\/\//, "https://www.");
                    } else if (/^www\./.test(value)) {
                      value = "https://" + value;
                    } else {
                      value = "https://www." + value;
                    }
                  }

                  setPrivacyPolicyUrl(value);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://www.example.com/privacy"
              />
            </div>

            <div>
              <label className="flex gap-1 items-baseline text-sm text-gray-600 font-poppins mb-2">
                Terms & Conditions URL
                <label className="text-[11px] text-gray-500">(Optional)</label>
              </label>
              <input
                value={termsUrl}
                onChange={(e) => setTermsUrl(e.target.value)}
                onBlur={(e) => {
                  let value = e.target.value.trim();
                  if (!value) return;

                  if (!/^https:\/\/www\./.test(value)) {
                    if (/^https?:\/\//.test(value)) {
                      value = value.replace(/^https?:\/\//, "https://www.");
                    } else if (/^www\./.test(value)) {
                      value = "https://" + value;
                    } else {
                      value = "https://www." + value;
                    }
                  }

                  setTermsUrl(value);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://www.example.com/terms"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 font-poppins mb-2">
                Age Rating
              </label>
              <select
                value={ageRating}
                onChange={(e) => setAgeRating(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option>Everyone</option>
                <option>Teen</option>
                <option>Mature 17+</option>
                <option>Adults Only 18+</option>
              </select>
            </div>
          </div>
        </section>

        {/* App Files */}
        <section
          className={`bg-white border border-gray-200 rounded-2xl p-6 mb-6 ${
            isSubmitting && "pointer-events-none"
          }`}
        >
          <h2 className="flex items-baseline gap-1 text-xl font-medium font-poppins text-gray-900 mb-4">
            App Files
            <span className="text-[11px] text-gray-500">
              (Atleast one file)
            </span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Android APK */}
            <div>
              <label className="block text-sm text-gray-600 font-poppins mb-2">
                Android APK
              </label>
              {!apkFile ? (
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="apk-upload"
                    className="flex items-center gap-2 px-5 py-2 rounded-md font-poppins font-medium text-sm text-white bg-gray-700 cursor-pointer"
                  >
                    <TfiAndroid size={18} />
                    <span>Choose File</span>
                  </label>
                  <input
                    id="apk-upload"
                    type="file"
                    accept=".apk"
                    className="sr-only"
                    onChange={handleApkChange}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setApkFile(null)}
                    className="flex items-center gap-2 px-5 py-2 rounded-md font-poppins font-medium text-sm text-white bg-rose-500 cursor-pointer"
                  >
                    <span>Remove APK File</span>
                  </button>
                </div>
              )}
              {apkFile ? (
                <div className="flex items-center gap-2 mt-1 px-2 py-1 rounded-md">
                  <TfiAndroid size={12} className="text-gray-600 shrink-0" />
                  <p
                    className="max-w-40 text-sm font-outfit text-gray-700 truncate"
                    title={apkFile.name}
                  >
                    {apkFile.name}
                  </p>
                  <div className="h-1 w-1 bg-gray-400 rounded-full shrink-0 mx-1" />
                  <p className="text-sm font-outfit text-gray-700 shrink-0">
                    {(apkFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              ) : (
                <p className="text-xs font-outfit text-gray-500 mt-1">
                  max 50 MB
                </p>
              )}
            </div>

            {/* iOS IPA */}
            <div>
              <label className="block text-sm text-gray-600 font-poppins mb-2">
                iOS IPA
              </label>
              {!ipaFile ? (
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="ipa-upload"
                    className="flex items-center gap-2 px-5 py-2 rounded-md font-poppins font-medium text-sm text-white bg-gray-700 cursor-pointer"
                  >
                    <FaApple size={18} />
                    <span>Choose File</span>
                  </label>
                  <input
                    id="ipa-upload"
                    type="file"
                    accept=".ipa"
                    className="sr-only"
                    onChange={handleIpaChange}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIpaFile(null)}
                    className="flex items-center gap-2 px-5 py-2 rounded-md font-poppins font-medium text-sm text-white bg-rose-500 cursor-pointer"
                  >
                    <span>Remove IPA File</span>
                  </button>
                </div>
              )}
              {ipaFile ? (
                <div className="flex items-center gap-2 mt-1 px-2 py-1 rounded-md">
                  <FaApple size={12} className="text-gray-600 shrink-0" />
                  <p
                    className="max-w-40 text-sm font-outfit text-gray-700 truncate"
                    title={ipaFile.name}
                  >
                    {ipaFile.name}
                  </p>
                  <div className="h-1 w-1 bg-gray-400 rounded-full shrink-0 mx-1" />
                  <p className="text-sm font-outfit text-gray-700 shrink-0">
                    {(ipaFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              ) : (
                <p className="text-xs font-outfit text-gray-500 mt-1">
                  max 50 MB
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Data Safety */}
        <section
          className={`bg-white border border-gray-200 rounded-2xl p-6 mb-6 ${
            isSubmitting && "pointer-events-none"
          }`}
        >
          <h2 className="text-xl font-medium font-poppins text-gray-900 mb-4">
            Data Safety
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Toggle
              title="Collects user data?"
              label="Data collection"
              icon={ShieldCheck}
              enabled={collectsData}
              onChange={setCollectsData}
            />
            <Toggle
              title="Shares data with third parties?"
              label="Data sharing"
              icon={ShieldCheck}
              enabled={sharesData}
              onChange={setSharesData}
            />
            <Toggle
              title="COPPA compliant?"
              label="COPPA"
              icon={ShieldCheck}
              enabled={coppaCompliant}
              onChange={setCoppaCompliant}
              description="Children’s Online Privacy Protection Act - a U.S. federal law that protects the privacy of children under 13 years old on the internet."
            />
            {collectsData && (
              <div className="mt-4">
                <label className="block  text-sm text-gray-600 font-poppins mb-2">
                  Describe data collected (optional)
                </label>
                <textarea
                  value={dataCollected}
                  onChange={(e) => setDataCollected(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  rows={3}
                  placeholder="e.g. device id, crash logs, analytics events"
                />
              </div>
            )}
          </div>
        </section>

        {/* Submit */}
        <div className="mb-4">
          {isSubmitting ? (
            <button className="w-full flex justify-center items-center gap-3 py-4 rounded-xl font-poppins bg-green-600 text-white text-sm sm:text-lg font-medium">
              <Loader2 className="animate-spin" size={22} />
              {isUpdatingUser
                ? "Almost done — Finalizing details . . ."
                : "Preparing your app for publishing . . ."}
            </button>
          ) : (
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full py-4 rounded-xl font-poppins bg-green-500 text-white text-sm sm:text-lg font-medium"
            >
              Submit for Review
            </button>
          )}
          <p className="text-[10px] text-center text-gray-500 font-poppins mt-1">
            By clicking <span className="font-semibold">Submit for Review</span>
            , you agree to our{" "}
            <NavLink className="text-green-600">Developer Policy</NavLink>.
          </p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed h-lvh inset-0 flex flex-col justify-center items-center bg-white z-50 p-4">
          {/* Animation */}
          <div className="flex flex-col items-center text-center mt-30">
            <Lottie
              animationData={SuccessAnimation}
              loop={false}
              className="h-50 w-50 mb-8"
            />
            <h2 className="text-4xl font-poppins font-semibold mb-3 text-black">
              App Submitted!
            </h2>
            <p className="text-sm text-gray-500 font-poppins max-w-xs">
              Your app has been successfully submitted for review. Our team will
              review it shortly.
            </p>
          </div>

          {/* Bottom Buttons */}
          <div className="mt-auto mb-20 flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:mb-8">
            <button
              onClick={() => {
                // navigate("/setting-apps");
                setIsModalOpen(false);
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

// src/pages/publish/Publish.jsx
import React, { useState, useRef } from "react";
import {
  ChevronLeft,
  Upload,
  ImageUp,
  Images,
  Globe,
  ShieldCheck,
  Plus,
  X,
  Video,
  FileBox,
  ClosedCaption,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../../store/AuthStore";

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
  const { user } = useAuthStore?.() ?? {};

  // File states and previews
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);

  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [screenshotFiles, setScreenshotFiles] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [screenshotPreviews, setScreenshotPreviews] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  // Basic fields
  const [appName, setAppName] = useState("");
  const [packageName, setPackageName] = useState("");
  const [currentVersion, setCurrentVersion] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [website, setWebsite] = useState("");
  const [contactEmail, setContactEmail] = useState(
    user?.developerProfile?.contactEmail || ""
  );

  // Tags
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const tagRef = useRef(null);

  // Data Safety (option C)
  const [collectsData, setCollectsData] = useState(false);
  const [sharesData, setSharesData] = useState(false);
  const [coppaCompliant, setCoppaCompliant] = useState(false);

  // previous versions
  const [prevVersions, setPrevVersions] = useState([]);

  // helpers
  const createPreview = (file) => (file ? URL.createObjectURL(file) : null);

  // icon handlers
  const onIconChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    setIconFile(f);
    setIconPreview(f ? createPreview(f) : null);
  };

  // banner
  const onBannerChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    setBannerFile(f);
    setBannerPreview(f ? createPreview(f) : null);
  };

  // screenshots slots
  const onScreenshotChange = (index, e) => {
    const f = e.target.files?.[0] ?? null;
    setScreenshotFiles((prev) => {
      const copy = [...prev];
      copy[index] = f;
      return copy;
    });
    setScreenshotPreviews((prev) => {
      const copy = [...prev];
      copy[index] = f ? createPreview(f) : null;
      return copy;
    });
  };

  const removeScreenshot = (index) => {
    setScreenshotFiles((prev) => {
      const copy = [...prev];
      copy[index] = null;
      return copy;
    });
    setScreenshotPreviews((prev) => {
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

  // previous versions
  const addPreviousVersion = () =>
    setPrevVersions((p) => [
      ...p,
      { version: "", android: null, ios: null, releaseDate: "", notes: "" },
    ]);

  const removePrevious = (i) =>
    setPrevVersions((p) => p.filter((_, idx) => idx !== i));

  // submit (UI only)
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      developer: {
        developerId: user?.uid ?? "",
        name: user?.displayName ?? "",
        avatarUrl: user?.photoURL ?? "",
        email: user?.email ?? "",
      },
      details: {
        name: appName,
        packageName,
        type,
        category,
        tags,
        description: { short: shortDesc, long: longDesc, whatsNew: "" },
        currentVersion: { version: currentVersion || "1.0.0" },
        media: {
          iconPreview,
          bannerPreview,
          screenshots: screenshotPreviews.filter(Boolean),
        },
        links: { website, contactEmail },
      },
      dataSafety: { collectsData, sharesData, coppaCompliant },
      versionHistory: prevVersions,
    };
    console.log("UI payload (no uploads):", payload);
    alert("Prepared payload (UI). Check console.");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <NavLink to={-1} className="flex items-center gap-2 py-1.5">
            <ChevronLeft size={26} className="text-gray-800" />
            <span className="text-lg sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
              Publish Your App
            </span>
          </NavLink>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* App Media */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
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
              {iconPreview ? (
                <>
                  <img
                    src={iconPreview}
                    alt="Icon preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIconPreview(null);
                    }}
                    className="absolute top-1.5 right-1.5 p-1 rounded-sm bg-white "
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
              className="w-full h-40 rounded-lg border border-gray-300 bg-white flex items-center justify-center cursor-pointer overflow-hidden relative"
            >
              {bannerPreview ? (
                <>
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setBannerPreview(null);
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
                    className={`w-full aspect-9/16 rounded-lg border flex items-center justify-center overflow-hidden cursor-pointer transition
                      ${
                        screenshotPreviews[i]
                          ? "border-gray-300 bg-white"
                          : "border-gray-300 bg-white hover:bg-gray-50"
                      }
                    `}
                  >
                    {screenshotPreviews[i] ? (
                      <>
                        <img
                          src={screenshotPreviews[i]}
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
        </section>

        {/* Basic Information */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-medium font-poppins text-gray-900 mb-4">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 font-poppins mb-2">
                App Name
              </label>
              <input
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your app name"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 font-poppins mb-2">
                Current Version
              </label>
              <input
                value={currentVersion}
                onChange={(e) => setCurrentVersion(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="1.0.0"
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
                  className="absolute right-1 top-1/2 -translate-y-1/2 px-5 py-2 rounded-lg font-poppins font-semibold text-white bg-green-500 text-sm"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="One-line pitch"
              />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="Explain features and usage"
              ></textarea>
            </div>

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
        <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-medium font-poppins text-gray-900 mb-4">
            Policies & Legal
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 font-poppins mb-2">
                Privacy Policy URL
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://example.com/privacy"
              />
            </div>
            <div>
              <label className="flex gap-1 items-baseline text-sm text-gray-600 font-poppins mb-2">
                Terms & Conditions URL
                <label className="text-[11px] text-gray-500">(Optional)</label>
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://example.com/terms"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 font-poppins mb-2">
                Age Rating
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option>Everyone</option>
                <option>Teen</option>
                <option>Mature 17+</option>
                <option>Adults Only 18+</option>
              </select>
            </div>
            <div />
          </div>
        </section>

        {/* App Files */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-medium font-poppins text-gray-900 mb-4">
            App Files
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 font-poppins mb-2">
                Android APK *
              </label>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="apk-upload"
                  className="inline-flex items-center px-5 py-2 rounded-md font-poppins font-medium text-sm text-white bg-green-500 cursor-pointer"
                >
                  Choose APK
                </label>
                <input
                  id="apk-upload"
                  type="file"
                  accept=".apk"
                  className="sr-only"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 font-poppins mb-2">
                iOS IPA (optional)
              </label>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="ipa-upload"
                  className="inline-flex items-center px-5 py-2 rounded-md font-poppins font-medium text-sm text-white bg-green-500 cursor-pointer"
                >
                  Choose IPA
                </label>
                <input
                  id="ipa-upload"
                  type="file"
                  accept=".ipa"
                  className="sr-only"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Data Safety */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-medium font-poppins text-gray-900 mb-4">
            Data Safety
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
          </div>

          {collectsData && (
            <div className="mt-4">
              <label className="block  text-sm text-gray-600 font-poppins mb-2">
                Describe data collected (optional)
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                rows={3}
                placeholder="e.g. device id, crash logs, analytics events"
              />
            </div>
          )}
        </section>

        {/* Submit */}
        <div className="mb-4">
          <button
            type="submit"
            className="w-full py-4 rounded-xl font-poppins bg-green-500 text-white text-lg font-medium"
          >
            Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
}

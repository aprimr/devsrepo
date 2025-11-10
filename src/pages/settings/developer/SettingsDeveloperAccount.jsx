import {
  ArrowRight,
  ChevronLeft,
  Tag,
  Mail,
  Building2,
  AtSign,
  IdCardLanyard,
  Loader2,
} from "lucide-react";
import Lottie from "lottie-react";
import { useAuthStore } from "../../../store/AuthStore";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { serverTimestamp } from "firebase/firestore";
import devAnimation from "../../../assets/animations/developer.json";
import { toast } from "sonner";

function SettingsDeveloperAccount() {
  const { user, updateUserProfile } = useAuthStore();
  const navigate = useNavigate();

  // If user is already a developer
  useEffect(() => {
    if (user.developerProfile.isDeveloper) {
      navigate(-1, { replace: true });
    }
  }, []);

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const developerId = user?.uid
    ? "dev_" + user.uid.slice(0, 9) + user.uid.slice(18)
    : "";

  const [github, setGithub] = useState(user?.socialLinks?.github || "");
  const [linkedin, setLinkedin] = useState(user?.socialLinks?.linkedin || "");
  const [website, setWebsite] = useState(user?.developerProfile?.website || "");

  const handleBack = useCallback(() => {
    if (currentStep === 1) {
      navigate("/setting");
    } else {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, navigate]);

  const handleCreateDeveloperAccount = async () => {
    const formData = {
      ...user,
      socialLinks: {
        ...user.socialLinks,
        github,
        linkedin,
      },
      developerProfile: {
        ...user.developerProfile,
        isDeveloper: true,
        developerId: developerId,
        developerSince: serverTimestamp(),
        website,
      },
    };
    if (!github || !linkedin) {
      toast.error(
        "Github and Linked in profile link are must for developer account"
      );
      return;
    }
    setIsLoading(true);
    try {
      const res = await updateUserProfile(formData);
      if (res.success) {
        setIsLoading(false);
        navigate("/setting");
      } else {
        setIsLoading(false);
        toast.error("Error creating developer profile");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Something went wrong");
    }
  };

  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
            <div
              onClick={handleBack}
              className="flex items-center gap-2 py-1.5 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <ChevronLeft size={26} className="text-gray-800" />
              <span className="text-lg sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
                Developer Account
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

        <div className="max-w-2xl mx-auto px-1 sm:px-4 py-3">
          <div className="max-w-md mx-auto px-8 py-12 text-center animate-fadeIn">
            <div className="w-72 h-72 mx-auto mb-4">
              <Lottie animationData={devAnimation} loop />
            </div>
            <h1 className="text-3xl font-poppins font-semibold text-gray-900 mb-3">
              Switch to Developer
            </h1>
            <p className="text-gray-700 text-sm sm:text-base font-poppins mb-8 leading-relaxed">
              Create a developer account and start publishing your apps on{" "}
              <span className="font-medium text-green-600">DevsRepo</span>{" "}
              today.
            </p>
            <button
              onClick={() => setCurrentStep(2)}
              className="bottom-0 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-poppins font-medium text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              Create Developer Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
            <div
              onClick={handleBack}
              className="flex items-center gap-2 py-1.5 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <ChevronLeft size={26} className="text-gray-800" />
              <span className="text-lg sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
                Developer Account
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

        <div className="max-w-2xl mx-auto px-1 sm:px-4 py-3">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-14 space-y-6">
            <p className="text-base font-medium text-gray-700 font-poppins">
              Complete this form to create your developer profile.
            </p>

            <DisabledTextArea
              title="Developer Name"
              icon={Tag}
              value={user?.name}
              description="This is your name and will be displayed as your developer name."
            />
            <DisabledTextArea
              title="Developer Username"
              icon={AtSign}
              value={user?.username}
              description="This username will be used as your developer handle."
            />
            <DisabledTextArea
              title="Developer Id"
              icon={IdCardLanyard}
              value={developerId}
            />
            <DisabledTextArea
              title="Contact Email"
              icon={Mail}
              value={user?.email}
              description="Users will see this as the developer contact email. You can update it later if needed."
            />

            {/* GitHub */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 font-poppins">
                GitHub Profile
              </label>
              <div className="relative">
                <FaGithub className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl font-poppins focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 font-poppins">
                LinkedIn Profile
              </label>
              <div className="relative">
                <FaLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl font-poppins focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Website */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 font-poppins">
                Website (optional)
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-poppins outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-3 sm:px-20 flex justify-between items-center shadow-md z-10">
              <button
                onClick={handleBack}
                disabled={isLoading}
                className="flex items-center gap-2 text-gray-600 text-sm font-poppins font-medium hover:text-green-600 disabled:text-gray-400 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
              <button
                onClick={handleCreateDeveloperAccount}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-700 text-white text-sm px-5 py-2.5 rounded-xl font-poppins font-medium flex items-center gap-2 shadow-md transition-all"
              >
                {!isLoading && <p>Proceed</p>}
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
                {isLoading && <p>Please Wait . . .</p>}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default SettingsDeveloperAccount;

const DisabledTextArea = ({ title, icon: Icon, value, description }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700 font-poppins">
      {title}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        value={value || ""}
        disabled
        className="w-full pl-12 pr-4 py-3 border border-gray-300 text-gray-500 font-medium rounded-xl font-poppins bg-gray-50"
      />
    </div>
    {description && (
      <p className="text-xs text-gray-500 font-outfit -mt-1.5">{description}</p>
    )}
  </div>
);

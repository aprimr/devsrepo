import {
  ChevronLeft,
  UsersRound,
  UserRoundCheck,
  ChevronRight,
  ListCheck,
  Scroll,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "../../../store/AuthStore";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

function SettingsPrivacy() {
  const { user, updateUserProfile } = useAuthStore();
  const [privateFollower, setPrivateFollower] = useState(
    user?.privacy.privateFollower
  );
  const [privateFollowing, setPrivateFollowing] = useState(
    user?.privacy.privateFollowing
  );
  const [toggleLoading, setToggleLoading] = useState();

  const handlePrivateFollowersToggle = async () => {
    setToggleLoading("Followers");
    const newValue = !user.privacy.privateFollower;
    try {
      const res = await updateUserProfile({
        privacy: { ...user.privacy, privateFollower: newValue },
      });
      setPrivateFollower(newValue);

      if (!res.success) {
        toast.error("Error updating privacy settings");
        setPrivateFollower(!newValue);
        setToggleLoading("");
      }
      setToggleLoading("");
    } catch (error) {
      console.error(error);
      setToggleLoading("");
      toast.error("An unexpected error occurred");
    }
  };

  const handlePrivateFollowingToggle = async () => {
    setToggleLoading("Following");
    const newValue = !user.privacy.privateFollowing;
    try {
      const res = await updateUserProfile({
        privacy: { ...user.privacy, privateFollowing: newValue },
      });
      setPrivateFollowing(newValue);

      if (!res.success) {
        toast.error("Error updating privacy settings");
        setPrivateFollowing(!newValue);
        setToggleLoading("");
      }
      setToggleLoading("");
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
      setToggleLoading("");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <NavLink to="/setting" className="flex items-center gap-2 py-1.5">
            <ChevronLeft size={26} className="text-gray-800" />
            <span className="text-lg sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
              Privacy
            </span>
          </NavLink>
        </div>
      </nav>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-3 pb-6 space-y-4">
        <p className="text-base font-medium text-gray-700 font-poppins">
          Manage your account privacy settings.
        </p>

        {/* Followers */}
        <PrivacyToggle
          title="Followers"
          label="Private Followers"
          description="Make your followers private in your profile."
          icon={UsersRound}
          toggleLoading={toggleLoading === "Followers"}
          enabled={privateFollower}
          onChange={() => handlePrivateFollowersToggle()}
        />

        {/* Following */}
        <PrivacyToggle
          title="Following"
          label="Private Following"
          description="Make your following list private in your profile."
          icon={UserRoundCheck}
          toggleLoading={toggleLoading === "Following"}
          enabled={privateFollowing}
          onChange={() => handlePrivateFollowingToggle()}
        />

        {/* Stats Group */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 font-poppins">
            Stats
          </label>
          <div className="flex flex-col gap-3 w-full px-1 py-2 border border-gray-100 rounded-xl bg-gray-50 hover:shadow-sm transition-all">
            <SectionButton
              icon={Scroll}
              label="Followers List"
              redirect="/profile-following"
            />
            <SectionButton
              icon={ListCheck}
              label="Following List"
              redirect="/profile-followers"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPrivacy;

const PrivacyToggle = ({
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
      <label className="text-sm font-medium text-gray-700 font-poppins">
        {title}
      </label>
      <div className="flex items-center justify-between w-full px-3 py-3.5 border border-gray-100 rounded-xl bg-gray-50 hover:shadow-sm transition-all">
        <div className="flex items-center gap-4">
          {toggleLoading ? (
            <Loader2 className="text-gray-500 w-5 h-5 animate-spin" />
          ) : (
            <Icon className="text-gray-500 w-5 h-5" />
          )}
          <p className="text-gray-700 font-medium font-poppins">{label}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={onChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all"></div>
          <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></span>
        </label>
      </div>
      {description && (
        <p className="text-xs font-normal text-gray-500 font-outfit -mt-1">
          {description}
        </p>
      )}
    </div>
  );
};

const SectionButton = ({ icon: Icon, label, func, redirect }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => (redirect ? navigate(redirect) : func?.())}
      className="flex items-center justify-between w-full px-3 py-2 rounded-xl transition-all duration-200 text-gray-700 hover:bg-gray-100 font-medium font-poppins"
    >
      <div className="flex gap-3 items-center">
        <Icon size={18} className="sm:w-5 sm:h-5 text-gray-500" />
        <span className="text-sm sm:text-base">{label}</span>
      </div>
      {redirect && <ChevronRight size={16} className="sm:w-4 sm:h-4" />}
    </button>
  );
};

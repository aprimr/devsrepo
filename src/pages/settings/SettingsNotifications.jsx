import {
  ChevronLeft,
  Loader2,
  Bell,
  Newspaper,
  CircleFadingArrowUp,
  Crosshair,
} from "lucide-react";
import { useAuthStore } from "../../store/AuthStore";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

function SettingsNotifications() {
  const { user, updateUserProfile } = useAuthStore();

  const [allowNotifications, setAllowNotifications] = useState(
    user?.preferences.notifications.allowNotifications
  );
  const [appUpdates, setAppUpdates] = useState(
    user?.preferences.notifications.appUpdates
  );
  const [developerNews, setDeveloperNews] = useState(
    user?.preferences.notifications.developerNews
  );
  const [marketing, setMarketing] = useState(
    user?.preferences.notifications.marketing
  );
  const [toggleLoading, setToggleLoading] = useState();

  const handleAllowNotificationsToggle = async () => {
    setToggleLoading("Notifications");
    const newValue = !user?.preferences.notifications.allowNotifications;
    try {
      const res = await updateUserProfile({
        ...user,
        preferences: {
          ...user?.preferences,
          notifications: {
            ...user?.preferences.notifications,
            allowNotifications: newValue,
          },
        },
      });
      setAllowNotifications(newValue);

      if (!res.success) {
        toast.error("Error updating notification setting");
        setAllowNotifications(!newValue);
        setToggleLoading("");
      }
      setToggleLoading("");
    } catch (error) {
      console.error(error);
      setToggleLoading("");
      toast.error("An unexpected error occurred");
    }
  };

  const handleAppUpdatesToggle = async () => {
    setToggleLoading("App Updates");
    const newValue = !user?.preferences.notifications.appUpdates;
    try {
      const res = await updateUserProfile({
        ...user,
        preferences: {
          ...user?.preferences,
          notifications: {
            ...user?.preferences.notifications,
            appUpdates: newValue,
          },
        },
      });
      setAppUpdates(newValue);

      if (!res.success) {
        toast.error("Error updating notification setting");
        setAllowNotifications(!newValue);
        setToggleLoading("");
      }
      setToggleLoading("");
    } catch (error) {
      console.error(error);
      setToggleLoading("");
      toast.error("An unexpected error occurred");
    }
  };

  const handleDeveloperNewsToggle = async () => {
    setToggleLoading("Developer News");
    const newValue = !user?.preferences.notifications.developerNews;
    try {
      const res = await updateUserProfile({
        ...user,
        preferences: {
          ...user?.preferences,
          notifications: {
            ...user?.preferences.notifications,
            developerNews: newValue,
          },
        },
      });
      setDeveloperNews(newValue);

      if (!res.success) {
        toast.error("Error updating notification setting");
        setAllowNotifications(!newValue);
        setToggleLoading("");
      }
      setToggleLoading("");
    } catch (error) {
      console.error(error);
      setToggleLoading("");
      toast.error("An unexpected error occurred");
    }
  };

  const handleMarketingToggle = async () => {
    setToggleLoading("Marketing");
    const newValue = !user?.preferences.notifications.marketing;
    try {
      const res = await updateUserProfile({
        ...user,
        preferences: {
          ...user?.preferences,
          notifications: {
            ...user?.preferences.notifications,
            marketing: newValue,
          },
        },
      });
      setMarketing(newValue);

      if (!res.success) {
        toast.error("Error updating notification setting");
        setAllowNotifications(!newValue);
        setToggleLoading("");
      }
      setToggleLoading("");
    } catch (error) {
      console.error(error);
      setToggleLoading("");
      toast.error("An unexpected error occurred");
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
              Notifications
            </span>
          </NavLink>

          {/* See Notifications */}
          <button className="flex justify-center items-center gap-2 px-2.5 py-2 rounded-xl bg-gray-200 text-gray-600 border-2 border-gray-300 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-200 transition-all duration-300 font-poppins font-medium text-sm md:text-base cursor-pointer">
            <Bell size={18} />
          </button>
        </div>
      </nav>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-3 pb-6 space-y-4">
        {/* <p className="text-base font-medium text-gray-700 font-poppins"></p> */}

        {/* Notifications */}
        <Toggle
          title="Notifications"
          label="Allow Notifications"
          description=""
          icon={Bell}
          toggleLoading={toggleLoading === "Notifications"}
          enabled={allowNotifications}
          onChange={() => handleAllowNotificationsToggle()}
        />

        {/* Notifications Sub Group */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 font-poppins">
            Customize Notifications
          </label>
          <div className="flex flex-col gap-3 w-full px-2 py-2 border border-gray-100 rounded-xl bg-gray-100/30 hover:shadow-sm transition-all">
            {/* App Updates */}
            <Toggle
              title=""
              label="App Updates"
              description=""
              icon={CircleFadingArrowUp}
              toggleLoading={toggleLoading === "App Updates"}
              enabled={allowNotifications && appUpdates}
              onChange={() => {
                allowNotifications && handleAppUpdatesToggle();
              }}
            />
            {/* App Updates */}
            <Toggle
              title=""
              label="Developer Notifications"
              description=""
              icon={Newspaper}
              toggleLoading={toggleLoading === "Developer News"}
              enabled={allowNotifications && developerNews}
              onChange={() => {
                allowNotifications && handleDeveloperNewsToggle();
              }}
            />
            {/* App Updates */}
            <Toggle
              title=""
              label="Marketing"
              description=""
              icon={Crosshair}
              toggleLoading={toggleLoading === "Marketing"}
              enabled={allowNotifications && marketing}
              onChange={() => {
                allowNotifications && handleMarketingToggle();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsNotifications;

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

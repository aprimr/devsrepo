import { ChevronLeft, Loader2, Mail } from "lucide-react";
import { useAuthStore } from "../../../store/AuthStore";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

function SettingsEmail() {
  const { user, updateUserProfile } = useAuthStore();

  const [emailNewsletters, setEmailNewsletters] = useState(
    user?.preferences.emailNewsletter
  );
  const [toggleLoading, setToggleLoading] = useState();

  const handleEmailNewsLettersToggle = async () => {
    setToggleLoading("Email");
    const newValue = !user?.preferences.emailNewsletter;
    try {
      const res = await updateUserProfile({
        ...user,
        preferences: {
          ...user?.preferences,
          emailNewsletter: newValue,
        },
      });
      setEmailNewsletters(newValue);

      if (!res.success) {
        toast.error("Error updating notification setting");
        setEmailNewsletters(!newValue);
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
              Email Setting
            </span>
          </NavLink>
        </div>
      </nav>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-3 pb-6 space-y-4">
        <p className="text-base font-medium text-gray-700 font-poppins">
          Receive email newsletters from DevsRepo.
        </p>

        {/* Notifications */}
        <Toggle
          title="Email Newsletters"
          label="Allow Emails"
          description=""
          icon={Mail}
          toggleLoading={toggleLoading === "Email"}
          enabled={emailNewsletters}
          onChange={() => handleEmailNewsLettersToggle()}
        />
      </div>
    </div>
  );
}

export default SettingsEmail;

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

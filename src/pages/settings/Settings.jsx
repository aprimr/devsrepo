import {
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  HelpCircle,
  Mail,
  Lock,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff,
  ChevronRight,
  Save,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../store/AuthStore";

function Setting() {
  const { user, logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState("profile");
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [language, setLanguage] = useState("english");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Mock settings data
  const settingsData = {
    profile: {
      username: user?.username || "developer",
      email: user?.email || "dev@example.com",
      name: user?.name || "Developer Name",
      bio:
        user?.bio || "Passionate app developer creating amazing experiences.",
      location: "San Francisco, CA",
      website: "https://myportfolio.dev",
    },
  };

  const sections = [
    {
      id: "profile",
      name: "Profile",
      icon: User,
      description: "Manage your personal information",
    },
    {
      id: "account",
      name: "Account",
      icon: Shield,
      description: "Security and login settings",
    },
    {
      id: "notifications",
      name: "Notifications",
      icon: Bell,
      description: "Control your notifications",
    },
    {
      id: "appearance",
      name: "Appearance",
      icon: Palette,
      description: "Customize the look and feel",
    },
    {
      id: "language",
      name: "Language & Region",
      icon: Globe,
      description: "Language and regional settings",
    },
    {
      id: "privacy",
      name: "Privacy & Data",
      icon: Lock,
      description: "Manage your data and privacy",
    },
    {
      id: "support",
      name: "Help & Support",
      icon: HelpCircle,
      description: "Get help and contact support",
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={settingsData.profile.name}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    defaultValue={settingsData.profile.username}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={settingsData.profile.email}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    defaultValue={settingsData.profile.bio}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    defaultValue={settingsData.profile.location}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    defaultValue={settingsData.profile.website}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200">
                Cancel
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>
        );

      case "account":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Change Password
              </h3>
              <div className="space-y-4 max-w-md">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type={showOldPassword ? "text" : "password"}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 transition-all duration-200"
                  />
                  <button
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-11 text-gray-400 hover:text-gray-600"
                  >
                    {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 transition-all duration-200"
                  />
                  <button
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-11 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200">
                  Update Password
                </button>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-red-900 mb-4">
                Danger Zone
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-xl bg-red-50">
                  <div>
                    <h4 className="font-medium text-red-900">Delete Account</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 flex items-center gap-2">
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Notification Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Email Notifications
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Receive updates about your apps and activity
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={() =>
                        setEmailNotifications(!emailNotifications)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Push Notifications
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Get real-time updates on your device
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pushNotifications}
                      onChange={() => setPushNotifications(!pushNotifications)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Theme Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    {darkMode ? (
                      <Moon size={20} className="text-blue-600" />
                    ) : (
                      <Sun size={20} className="text-yellow-600" />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">Dark Mode</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Switch between light and dark themes
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case "language":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Language & Region
              </h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="japanese">Japanese</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Settings
            </h3>
            <p className="text-gray-600">
              Select a category to manage your preferences
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your DevsRepo account preferences and settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <section.icon size={20} />
                    <div className="flex-1">
                      <div className="font-medium">{section.name}</div>
                      <div className="text-xs text-gray-500">
                        {section.description}
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className={
                        activeSection === section.id
                          ? "text-blue-500"
                          : "text-gray-400"
                      }
                    />
                  </button>
                ))}
              </nav>

              {/* Logout Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                >
                  <Lock size={20} />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;

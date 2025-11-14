import {
  ChevronLeft,
  ChevronRight,
  Info,
  Flag,
  UsersRound,
  Smartphone,
  CodeXml,
  Clock,
  Computer,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import numberSuffixer from "../../../utils/numberSuffixer";
import { RiApps2AiLine } from "react-icons/ri";
import { PiUsersBold } from "react-icons/pi";
import { useSystemStore } from "../../../store/SystemStore";

function Admin() {
  const { userIds, developerIds, publishedAppIds, pendingAppIds, isListening } =
    useSystemStore();

  const navigate = useNavigate();

  const SectionButton = ({ icon: Icon, label, func, redirect }) => (
    <button
      onClick={() => (redirect ? navigate(redirect) : func())}
      className={`flex items-center justify-between w-full p-3 sm:p-4 rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-50 border border-transparent`}
    >
      <div className="flex gap-3 items-center">
        <Icon size={18} className="sm:w-5 sm:h-5" />
        <span className="font-medium font-poppins text-sm sm:text-base">
          {label}
        </span>
      </div>
      {redirect && <ChevronRight size={16} className="sm:w-4 sm:h-4" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Back Btn and Name */}
          <NavLink to={-1} className="flex items-center gap-2">
            <ChevronLeft size={26} className="text-gray-800" />
            <span className="text-lg sm:text-2xl font-poppins py-1.5 font-medium text-gray-800 tracking-tight">
              Admin
            </span>
          </NavLink>

          {isListening && (
            <div className="flex justify-center items-center gap-2 mr-4">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-poppins font-medium text-sm text-gray-500 tracking-wider">
                Live Data
              </span>
            </div>
          )}
        </div>
      </nav>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8 my-2">
        <div className="space-y-5">
          {/* Overview Group */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <OverviewCard
              title="Apps Published"
              value={publishedAppIds.length}
              icon={RiApps2AiLine}
              bgColor="#E6F4EA"
              iconBg="#B7E4C7"
              iconColor="#2E7D32"
            />

            <OverviewCard
              title="Pending Apps"
              value={pendingAppIds.length}
              icon={Clock}
              bgColor="#FFF0F3"
              iconBg="#FFCDD2"
              iconColor="#C2185B"
            />

            <OverviewCard
              title="Developers"
              value={developerIds.length}
              icon={Computer}
              bgColor="#F3E8FF"
              iconBg="#E9D5FF"
              iconColor="#6B21A8"
            />

            <OverviewCard
              title="Users"
              value={userIds.length}
              icon={PiUsersBold}
              bgColor="#E3F2FD"
              iconBg="#BBDEFB"
              iconColor="#1E40AF"
            />
          </div>

          {/* Admin Group */}
          <div className="bg-white rounded-lg shadow-sm sm:rounded-xl border border-gray-200 p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 sm:mb-3 font-poppins">
              Admin
            </h3>
            <div className="space-y-1.5">
              <SectionButton
                icon={UsersRound}
                label="User Management"
                redirect="/admin-user-management"
              />
              <SectionButton
                icon={CodeXml}
                label="Developer Management"
                redirect="/admin-developer-management"
              />
              <SectionButton
                icon={Smartphone}
                label="Apps Management"
                redirect="/admin-app-management"
              />
              <SectionButton icon={Flag} label="Reports" redirect="/admin" />
              <SectionButton icon={Info} label="System" redirect="/admin" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;

const OverviewCard = ({
  title,
  value,
  icon: Icon,
  bgColor,
  iconBg,
  iconColor,
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-xl p-4 flex items-center gap-3`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Icon Circle */}
      <div
        className={`p-3 rounded-xl flex items-center justify-center relative z-10`}
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        <Icon className="w-6 h-6" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-gray-600 font-poppins truncate">
          {title}
        </p>
        <span className="text-xl sm:text-2xl font-outfit font-semibold text-gray-800 block mt-1">
          {numberSuffixer(value)}
        </span>
      </div>

      {/* Soft Glow behind icon */}
      <div
        className="absolute -top-1 -left-1 w-12 h-12 rounded-full opacity-20 blur-lg"
        style={{ backgroundColor: iconBg }}
      />
    </div>
  );
};

import Lottie from "lottie-react";
import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { fetchDeveloperbyDevID } from "../../services/appServices";
import numberSuffixer from "../../utils/numberSuffixer";
import BGImage from "../../assets/images/developerProfileBgImage.png";
import LoadingAnimation from "../../assets/animations/search.json";
import DeveloperAppCard from "../../components/ui/cards/DeveloperAppCard";
import { useAuthStore } from "../../store/AuthStore";
import {
  BadgeCheck,
  CheckCheck,
  ChevronLeft,
  Frown,
  Globe,
  Handshake,
  LayoutGrid,
  Mail,
  Share2,
  TriangleAlert,
  UserRoundPlus,
  X,
} from "lucide-react";
import {
  FaFacebook,
  FaFacebookMessenger,
  FaInstagram,
  FaReddit,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { LuLink } from "react-icons/lu";

function DeveloperProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [developerDetails, setDeveloperDetails] = useState(null);

  const [shareModal, setShareModal] = useState(false);

  useEffect(() => {
    const fetchDeveloperDetails = async () => {
      setLoading(true);
      try {
        const res = await fetchDeveloperbyDevID(id);
        if (res.success) {
          setDeveloperDetails(res.developer);
        } else {
          setDeveloperDetails(null);
        }
      } catch (error) {
        console.error("Error fetching developer details:", error);
        setDeveloperDetails(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDeveloperDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 font-poppins">
        <div className=" max-w-2xl h-auto">
          <Lottie animationData={LoadingAnimation} loop={true} />
        </div>
        <p className="text-gray-700 text-xl font-poppins">Loading . . . </p>
      </div>
    );
  }

  if (!developerDetails) {
    return (
      <div className="min-h-screen flex flex-col gap-6 items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4 font-poppins">
        <div className="flex flex-col items-center text-center max-w-md">
          {/* Icon with background */}
          <div className="mb-6 p-4 bg-rose-50 rounded-full border border-rose-100">
            <Frown size={64} className="text-rose-500" />
          </div>

          {/* Main message */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Developer Not Found
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            The developer you're looking for doesn't exist.
          </p>

          {/* Reasons list */}
          <ul className="text-sm text-gray-500 text-left space-y-2 mb-8">
            <p className="text-gray-600 leading-relaxed mb-1">
              This could be because:
            </p>
            <li className="flex items-start">
              <span className="text-rose-400 mr-2">•</span>
              The ID might be incorrect
            </li>
            <li className="flex items-start">
              <span className="text-rose-400 mr-2">•</span>
              The developer may have been deleted
            </li>
            <li className="flex items-start">
              <span className="text-rose-400 mr-2">•</span>
              There might be a temporary issue
            </li>
          </ul>

          {/* Action button */}
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (developerDetails.developerProfile.suspendedStatus.isSuspended) {
    return (
      <div className="min-h-screen flex flex-col gap-6 items-center justify-center bg-linear-to-br from-orange-50 to-amber-50 px-4 font-poppins">
        <div className="flex flex-col items-center text-center max-w-md">
          {/* Icon with warning background */}
          <div className="mb-6 p-5 bg-amber-100 rounded-full border border-amber-200">
            <TriangleAlert size={50} className="text-amber-600" />
          </div>

          {/* Main message */}
          <h2 className="text-2xl font-semibold text-amber-800 mb-3">
            Account Suspended
          </h2>

          {/* Description */}
          <p className="text-amber-700 text-base leading-relaxed mb-4">
            This developer's account has been suspended and is inaccessible.
          </p>

          {/* Additional information */}
          <p className="text-sm text-amber-600 mb-6">
            If you believe this is a mistake, please contact our support team
            for assistance.
          </p>

          {/* Action buttons */}
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 border border-amber-500 bg-amber-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 overflow-x-hidden">
      {/* Header */}
      <nav className="fixed top-0 z-50 w-full bg-transparent">
        <div className="max-w-xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Back */}
          <div
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <ChevronLeft className="h-8 w-8 text-gray-700 bg-gray-100 border-2 border-gray-200 shadow-md backdrop-blur-sm rounded-xl p-1 pl-0.5" />
          </div>

          {/* Follow
          {user && (
            <div
              onClick={() => {}}
              
              <span className="text-gray-700 font-medium font-poppins text-xs">
                Follow
              </span>
            </div>
          )} */}

          {/* Share */}
          <div
            onClick={() => setShareModal(!shareModal)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Share2 className="h-8 w-8 text-gray-700 bg-gray-100 border-2 border-gray-200 shadow-md backdrop-blur-sm rounded-xl p-1.5" />
          </div>
        </div>
      </nav>

      <div className="max-w-xl mx-auto">
        {/* Profile Pic, Cover & Details */}
        <div className="relative w-full h-32 sm:h-36 bg-gray-300">
          <img
            src={BGImage}
            className="w-screen h-full object-cover object-top-left bg-black"
          />

          {/* Gradient Overlay */}
          <div className="absolute bottom-0 w-full h-32 sm:h-40 bg-linear-to-t from-gray-900 via-gray-800/50 to-transparent" />

          {/* Profile Row */}
          <div className="absolute w-[90%] -bottom-16 sm:-bottom-18 left-4 sm:left-6 flex items-center gap-3">
            {/* Image and Follow Btns */}
            <div className="relative">
              {/* Profile Image */}
              <img
                src={developerDetails.photoURL}
                alt={developerDetails.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-[35px] border-3 border-white object-cover shrink-0"
              />

              {/* Follow Btns */}
              {user && (
                <div className="absolute bottom-0 right-0">
                  {/* Follow */}
                  {/* <div className="flex items-center gap-1 cursor-pointer bg-blue-200 border-3 border-white rounded-xl px-1 py-1">
                    <UserRoundPlus className="h-3.5 w-3.5 text-gray-700" />
                  </div> */}
                  {/* Unfollow / following */}
                  <div className="flex items-center gap-1 cursor-pointer bg-green-200 border-3 border-white rounded-xl px-1 py-1">
                    <CheckCheck className="h-3.5 w-3.5 text-gray-700" />
                  </div>
                </div>
              )}
            </div>
            {/* Right Info */}
            <div className="relative h-24 w-[65%] sm:w-[55%] pl-1">
              {/* Name */}
              <p className="absolute w-full flex items-center top-1 text-lg sm:text-xl font-medium text-white font-poppins truncate">
                <span className="truncate mr-1.5">{developerDetails.name}</span>

                {user && (
                  <Handshake size={16} className="shrink-0 text-gray-50" />
                )}
              </p>

              {/* Username */}
              <p className="absolute h-4 w-full flex items-center gap-1.5 top-9 text-base sm:text-lg font-normal text-black font-outfit">
                <span className="truncate text-gray-800 -mr-1">
                  @{developerDetails.username}
                </span>

                {developerDetails.developerProfile?.verifiedDeveloper && (
                  <BadgeCheck
                    size={18}
                    fill="#3B82F6"
                    color="white"
                    className="shrink-0"
                  />
                )}
              </p>

              {/* Followers Section */}
              <div className="absolute top-14 left-0 w-full">
                <div className="flex justify-between items-center text-black font-outfit text-base sm:text-lg w-[85%] sm:w-[90%]">
                  {/* Followers */}
                  <div className="flex flex-col items-center">
                    <p className="font-semibold text-gray-900">
                      {numberSuffixer(
                        developerDetails?.social?.followersIds?.length + 5327
                      )}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm font-poppins">
                      Followers
                    </p>
                  </div>

                  {/* Following */}
                  <div className="flex flex-col items-center">
                    <p className="font-semibold text-gray-900">
                      {numberSuffixer(
                        developerDetails?.social?.followingIds?.length + 626723
                      )}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm font-poppins">
                      Following
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="relative w-full h-19 sm:h-21" />

        {/* Contact Email */}
        <div className="px-6 flex flex-row gap-2 items-center text-gray-600 font-poppins">
          <Mail size={16} />
          <p className="text-[15px] font-normal ">
            {developerDetails.developerProfile.contactEmail}
          </p>
        </div>

        {/* Website */}
        <div className="px-6 flex flex-row gap-2 items-center text-green-600 font-poppins mt-1">
          <Globe size={16} />
          <a
            href={`https://www.${developerDetails.developerProfile.website
              .replace(/^https?:\/\//, "")
              .replace(/^www\./, "")}`}
            target="_blank"
            className="text-[15px] font-normal "
          >
            {developerDetails.developerProfile.website.replace(
              /^(https?:\/\/)?(www\.)?/,
              ""
            )}
          </a>
        </div>

        {/* Bio */}
        <div className="px-6 font-poppins mt-1">
          <details className="group cursor-pointer">
            <summary className="list-none">
              <p className="text-[14px] font-normal line-clamp-2 group-open:line-clamp-none text-gray-600">
                {developerDetails.bio}
              </p>
            </summary>
          </details>
        </div>

        {/* Apps */}
        <div className="px-6 font-poppins mt-5">
          {/* App Header */}
          <div className="flex flex-row items-center justify-between">
            <p className="text-lg font-poppins font-medium text-gray-700">
              All apps
            </p>
            <div className="h-8 w-8 flex justify-center items-center bg-gray-200 rounded-xl">
              <LayoutGrid size={16} className="text-gray-600" />
            </div>
          </div>

          {/* Apps List */}
          <div className="w-full grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 mt-3">
            {developerDetails.developerProfile.apps.publishedAppIds.map(
              (appId) => (
                <DeveloperAppCard key={appId} appId={appId} />
              )
            )}
          </div>
        </div>

        {/* Share Modal */}
        {shareModal && (
          <div
            onClick={() => setShareModal(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 lg:items-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-2xl lg:rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 animate-in slide-in-from-bottom duration-300 lg:animate-in lg:fade-in lg:duration-300"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-0 border-b border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 font-poppins">
                  Share Developer Profile
                </h3>
                <button
                  onClick={() => setShareModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Share Options */}
              <div className="p-6 pb-4 pt-4 ">
                {/* Social Share Buttons */}
                <div className="grid grid-cols-4 gap-4 mb-2">
                  {/* Facebook */}
                  <button
                    onClick={() => {
                      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        window.location.href
                      )}`;
                      window.open(url, "_blank");
                    }}
                    className="flex flex-col items-center gap-1 px-3  rounded-xl transition-colors group"
                  >
                    <div className="p-1 bg-white rounded-2xl group-hover:scale-110 transition-transform">
                      <FaFacebook className="h-10 w-10 text-blue-500" />
                    </div>
                    <span className="text-xs  font-poppins text-gray-700">
                      Facebook
                    </span>
                  </button>

                  {/* X */}
                  <button
                    onClick={() => {
                      const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        window.location.href
                      )}`;
                      window.open(url, "_blank");
                    }}
                    className="flex flex-col items-center gap-1 px-3   rounded-xl transition-colors group"
                  >
                    <div className="p-2.5 m-0.5 bg-black rounded-2xl group-hover:scale-110 transition-transform">
                      <FaXTwitter className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs  font-poppins text-gray-700">
                      X/Twitter
                    </span>
                  </button>

                  {/* Reddit */}
                  <button
                    onClick={() => {
                      const url = `https://www.reddit.com/submit?url=${encodeURIComponent(
                        window.location.href
                      )}`;
                      window.open(url, "_blank");
                    }}
                    className="flex flex-col items-center gap-1 px-3   rounded-xl transition-colors group"
                  >
                    <div className="p-1 bg-white rounded-2xl group-hover:scale-110 transition-transform">
                      <FaReddit className="h-10 w-10 text-orange-600" />
                    </div>
                    <span className="text-xs  font-poppins text-gray-700">
                      Reddit
                    </span>
                  </button>

                  {/* Telegram */}
                  <button
                    onClick={() => {
                      const url = `https://t.me/share/url?url=${encodeURIComponent(
                        window.location.href
                      )}`;
                      window.open(url, "_blank");
                    }}
                    className="flex flex-col items-center gap-1 px-3   rounded-xl transition-colors group"
                  >
                    <div className="p-1 bg-white rounded-2xl group-hover:scale-110 transition-transform">
                      <FaTelegram className="h-10 w-10 text-sky-400" />
                    </div>
                    <span className="text-xs  font-poppins text-gray-700">
                      Telegram
                    </span>
                  </button>

                  {/* Messenger */}
                  <button
                    onClick={() => {
                      const url = `fb-messenger://share?link=${encodeURIComponent(
                        window.location.href
                      )}`;
                      window.open(url, "_blank");
                    }}
                    className="flex flex-col items-center gap-1 px-3   rounded-xl transition-colors group"
                  >
                    <div className="p-2 bg-white rounded-2xl group-hover:scale-110 transition-transform">
                      <FaFacebookMessenger className="h-9 w-9 text-blue-500" />
                    </div>
                    <span className="text-xs font-poppins text-gray-700">
                      Messenger
                    </span>
                  </button>

                  {/* Whatsapp */}
                  <button
                    onClick={() => {
                      const url = `https://wa.me/?text=${encodeURIComponent(
                        window.location.href
                      )}`;
                      window.open(url, "_blank");
                    }}
                    className="flex flex-col items-center gap-1 px-3   rounded-xl transition-colors group"
                  >
                    <div className="p-1.5 bg-white rounded-2xl group-hover:scale-110 transition-transform">
                      <FaWhatsapp color="#25D366" className="h-10 w-10" />
                    </div>
                    <span className="text-xs font-poppins text-gray-700">
                      WhatsApp
                    </span>
                  </button>

                  {/* Inatagram */}
                  <button
                    onClick={() => {
                      const url = `https://www.instagram.com/?url=${encodeURIComponent(
                        window.location.href
                      )}`;
                      window.open(url, "_blank");
                    }}
                    className="flex flex-col items-center gap-1 px-3   rounded-xl transition-colors group"
                  >
                    <div className="p-2 m-0.5 bg-linear-to-br from-purple-500 via-pink-500 to-yellow-500 rounded-2xl group-hover:scale-110 transition-transform">
                      <FaInstagram className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-xs font-poppins text-gray-700">
                      Instagram
                    </span>
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          window.location.href
                        );
                        toast.success("Link copied to clipboard!");
                      } catch (error) {
                        toast.error("Failed to copy link");
                      }
                    }}
                    className="flex flex-col items-center gap-1 px-3 rounded-xl transition-colors group"
                  >
                    <div className="p-2.5 m-0.5 bg-whhite rounded-2xl group-hover:scale-110 transition-transform">
                      <LuLink className="h-7 w-7 text-black" />
                    </div>
                    <span className="text-xs font-poppins text-gray-700">
                      Copy
                    </span>
                  </button>
                </div>
              </div>

              {/* Cancel */}
              <div className="w-full px-6 pb-6">
                <button
                  onClick={() => setShareModal(false)}
                  className="w-full py-2.5 bg-gray-200/70 text-gray-700 font-medium font-poppins border-2 border-gray-200 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeveloperProfile;

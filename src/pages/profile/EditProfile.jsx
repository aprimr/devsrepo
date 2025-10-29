import {
  ChevronLeft,
  Save,
  Camera,
  MapPin,
  FileText,
  AtSign,
  Tag,
  Loader2,
} from "lucide-react";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { useAuthStore } from "../../store/AuthStore";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import DevsRepoInvert from "../../assets/images/DevsRepoInvert.png";
import { toast } from "sonner";

function EditProfile() {
  const { user, updateUserProfile } = useAuthStore();
  const navigate = useNavigate();

  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    location: user?.location || "",
    socialLinks: {
      github: user?.socialLinks.github || "",
      linkedin: user?.socialLinks.linkedin || "",
      twitter: user?.socialLinks.twitter || "",
      youtube: user?.socialLinks.youtube || "",
      instagram: user?.socialLinks.instagram || "",
      facebook: user?.socialLinks.facebook || "",
    },
  });
  const [imagePreview, setImagePreview] = useState(user?.photoURL || "");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLowercaseInputChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = value.toLowerCase().replace(/\s+/g, "_");

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleSocialInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 1 * 1024 * 1024; // 1MB

    if (file.size > maxSize) {
      toast.info("File size must be less than 1 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    setIsSaving(true);
    e.preventDefault();
    try {
      const res = await updateUserProfile(formData);
      const imgRes = await updateUserProfile({ photoURL: imagePreview });
      if (res.success && imgRes.success) {
        setIsSaving(false);
        navigate(-1);
      } else {
        setIsSaving(false);
        toast.error("An error occured while saving. Please try again.");
      }
    } catch (error) {
      setIsSaving(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1450px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Back Btn and Name */}
          <NavLink to={-1} className="flex items-center gap-2">
            <ChevronLeft size={26} className="text-gray-800" />
            <span className="text-lg sm:text-2xl font-poppins font-medium text-gray-800 tracking-tight">
              {user.name}
            </span>
          </NavLink>

          {/* Save */}
          <button
            onClick={handleSubmit}
            disabled={
              isSaving ||
              formData.username.length < 8 ||
              formData.name.length < 6
            }
            className="flex justify-center items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white border-2 border-green-600 hover:bg-green-700 disabled:bg-green-700 disabled:text-gray-200 transition-all duration-300 font-poppins font-medium text-sm md:text-base cursor-pointer"
          >
            {isSaving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {isSaving ? <span>Saving</span> : <span>Save</span>}
          </button>
        </div>
      </nav>

      {/* Profile Body */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <form className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="relative group">
              <div className="w-30 h-30 rounded-full bg-white flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={DevsRepoInvert}
                    alt="Profile preview"
                    className="w-18 h-18 object-cover"
                  />
                )}
              </div>

              {/* Image Overlay */}
              <label
                htmlFor="profileImage"
                className="absolute inset-0 w-30 h-30 bg-black/40 text-white hover:bg-black/60 rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-lg"
              >
                <Camera size={35} />
              </label>

              <p className="text-base text-green-600 font-outfit font-medium text-center select-none cursor-pointer mt-4">
                Change Photo
              </p>

              {/* Hidden input */}
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 font-poppins">
                {user.developerProfile?.isDeveloper ? "Developer Name" : "Name"}
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200 font-poppins outline-none"
                  placeholder={`${
                    user.developerProfile?.isDeveloper
                      ? "Enter full developer name"
                      : "Enter your full name"
                  }`}
                  minLength={6}
                  maxLength={40}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-500 font-outfit text-right">
                <p>Must be atleast 6 characters long</p>
                <p>{formData.name.length}/40 characters</p>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 font-poppins">
                Username
              </label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleLowercaseInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-poppins outline-none"
                  placeholder="Enter username"
                  low
                  maxLength={25}
                  minLength={8}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 font-outfit text-right">
                <p>Must be atleast 8 characters long</p>
                <p>{formData.username.length}/25 characters</p>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 font-poppins">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-poppins outline-none"
                  placeholder="City, Country"
                  maxLength={50}
                />
              </div>

              <div className="text-xs text-gray-500 font-outfit text-right">
                {formData.location.length}/50 characters
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 font-poppins">
                Bio
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-poppins resize-none outline-none"
                  placeholder="Tell us about yourself..."
                  maxLength={200}
                />
              </div>
              <p className="text-xs text-gray-500 font-outfit text-right">
                {formData.bio.length}/200 characters
              </p>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="pt-6">
            <h3 className="text-lg font-semibold text-green-600 font-poppins mb-4">
              Social Links
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {/* GitHub */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-poppins">
                  GitHub
                </label>
                <div className="relative">
                  <FaGithub className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    name="github"
                    value={formData.socialLinks.github}
                    onChange={handleSocialInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-poppins outline-none"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>

              {/* LinkedIn */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-poppins">
                  LinkedIn
                </label>
                <div className="relative">
                  <FaLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.socialLinks.linkedin}
                    onChange={handleSocialInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-poppins outline-none"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              {/* Twitter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-poppins">
                  Twitter/X
                </label>
                <div className="relative">
                  <FaTwitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    name="twitter"
                    value={formData.socialLinks.twitter}
                    onChange={handleSocialInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-poppins outline-none"
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>

              {/* YouTube */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-poppins">
                  YouTube
                </label>
                <div className="relative">
                  <FaYoutube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    name="youtube"
                    value={formData.socialLinks.youtube}
                    onChange={handleSocialInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-poppins outline-none"
                    placeholder="https://youtube.com/username"
                  />
                </div>
              </div>

              {/* Instagram */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-poppins">
                  Instagram
                </label>
                <div className="relative">
                  <FaInstagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    name="instagram"
                    value={formData.socialLinks.instagram}
                    onChange={handleSocialInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-poppins outline-none"
                    placeholder="https://instagram.com/username"
                  />
                </div>
              </div>

              {/* Facebook */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-poppins">
                  Facebook
                </label>
                <div className="relative">
                  <FaFacebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    name="facebook"
                    value={formData.socialLinks.facebook}
                    onChange={handleSocialInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-poppins outline-none"
                    placeholder="https://facebook.com/username"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;

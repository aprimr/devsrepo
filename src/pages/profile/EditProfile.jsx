import {
  ChevronLeft,
  Save,
  Camera,
  MapPin,
  FileText,
  AtSign,
  Tag,
  Loader2,
  BadgeCheck,
  Loader,
  CirclePlus,
  AppWindow,
  X,
  Braces,
  Check,
  Mail,
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

  const [contactEmail, setContactEmail] = useState(
    user?.developerProfile.contactEmail
  );
  const [website, setWebsite] = useState(user?.developerProfile.website || "");
  const [skills, setSkills] = useState([
    ...(user?.developerProfile.skills || []),
  ]);
  const [techStacks, setTechStacks] = useState([
    ...(user?.developerProfile.skills || []),
  ]);
  const [skillValue, setSkillValue] = useState("");
  const [techStackValue, setTechStackValue] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isAddingInfo, setIsAddingInfo] = useState("");
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

  const handleUsernameInputChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = value
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_.]/g, "")
      .replace(/^\.*/, "");

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

  const handleUpdateContactEmail = async (e) => {
    setIsAddingInfo("contact-email");
    e.preventDefault();
    try {
      const updateContactEmailPayload = {
        ...user,
        developerProfile: {
          ...user.developerProfile,
          contactEmail,
        },
      };
      const res = await updateUserProfile(updateContactEmailPayload);
      if (res.success) {
        setIsAddingInfo("");
      } else {
        setIsAddingInfo("");
        toast.error("An error occured while saving. Please try again.");
      }
    } catch (error) {
      setIsAddingInfo("");
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleUpdateWebsite = async (e) => {
    setIsAddingInfo("website");
    e.preventDefault();
    try {
      const updateWebsitePayload = {
        ...user,
        developerProfile: {
          ...user.developerProfile,
          website,
        },
      };
      const res = await updateUserProfile(updateWebsitePayload);
      if (res.success) {
        setIsAddingInfo("");
      } else {
        setIsAddingInfo("");
        toast.error("An error occured while saving. Please try again.");
      }
    } catch (error) {
      setIsAddingInfo("");
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleAddSkill = async (e) => {
    setIsAddingInfo("skills");
    e.preventDefault();
    try {
      const updatedSkills = [...skills, skillValue];
      setSkills(updatedSkills);
      const updateSkillPayload = {
        ...user,
        developerProfile: {
          ...user.developerProfile,
          skills: updatedSkills,
        },
      };
      const res = await updateUserProfile(updateSkillPayload);
      if (res.success) {
        setIsAddingInfo("");
        setSkillValue("");
      } else {
        setIsAddingInfo("");
        toast.error("An error occured while adding. Please try again.");
      }
    } catch (error) {
      setIsAddingInfo("");
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleRemoveSkill = async (e, id) => {
    setIsAddingInfo("skills");
    e.preventDefault();
    try {
      const updatedSkills = skills.filter((_, index) => index !== id);
      setSkills(updatedSkills);
      const updateSkillPayload = {
        ...user,
        developerProfile: {
          ...user.developerProfile,
          skills: updatedSkills,
        },
      };
      const res = await updateUserProfile(updateSkillPayload);
      if (res.success) {
        setIsAddingInfo("");
        setSkillValue("");
      } else {
        setIsAddingInfo("");
        toast.error("An error occured while removing. Please try again.");
      }
    } catch (error) {
      setIsAddingInfo("");
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleAddTechstack = async (e) => {
    setIsAddingInfo("techstack");
    e.preventDefault();
    try {
      const updatedTechstack = [...techStacks, techStackValue];
      setTechStacks(updatedTechstack);
      const updateTechStackPayload = {
        ...user,
        developerProfile: {
          ...user.developerProfile,
          techStacks: updatedTechstack,
        },
      };
      const res = await updateUserProfile(updateTechStackPayload);
      if (res.success) {
        setIsAddingInfo("");
        setTechStackValue("");
      } else {
        setIsAddingInfo("");
        toast.error("An error occured while adding. Please try again.");
      }
    } catch (error) {
      setIsAddingInfo("");
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleRemoveTechstack = async (e, id) => {
    setIsAddingInfo("techstack");
    e.preventDefault();
    try {
      const updatedTechstack = techStacks.filter((_, index) => index !== id);
      setTechStacks(updatedTechstack);
      const updateTechStackPayload = {
        ...user,
        developerProfile: {
          ...user.developerProfile,
          techStacks: updatedTechstack,
        },
      };
      const res = await updateUserProfile(updateTechStackPayload);
      if (res.success) {
        setIsAddingInfo("");
        setTechStackValue("");
      } else {
        setIsAddingInfo("");
        toast.error("An error occured while removing. Please try again.");
      }
    } catch (error) {
      setIsAddingInfo("");
      console.log(error);
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
                  onChange={handleUsernameInputChange}
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

          {/* Developer Section */}
          {user?.developerProfile.isDeveloper && (
            <div className="pt-6">
              <h3 className="text-lg font-semibold text-green-600 font-poppins mb-4">
                Developer Info
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {/* Contact Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 font-poppins">
                    Contact Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="contactEmail"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-poppins outline-none"
                      placeholder="aprimr@devsrepo.com"
                    />
                    {isAddingInfo === "contact-email" ? (
                      <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
                    ) : (
                      user.developerProfile.contactEmail !== contactEmail && (
                        <button
                          onClick={handleUpdateContactEmail}
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-xl font-medium font-poppins disabled:bg-gray-200 disabled:text-gray-400 bg-green-500 text-white hover:bg-green-600"
                          disabled={!contactEmail}
                        >
                          Save
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 font-poppins">
                    Website
                  </label>
                  <div className="relative">
                    <AppWindow className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="url"
                      name="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-poppins outline-none"
                      placeholder="https://yourwebsite.com"
                    />
                    {isAddingInfo === "website" ? (
                      <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
                    ) : (
                      user.developerProfile.website !== website && (
                        <CirclePlus
                          onClick={handleUpdateWebsite}
                          className={`absolute right-0.5 top-1/2 py-3.5 transform -translate-y-1/2 rounded-r-xl ${
                            !website ? "text-gray-400" : "text-green-500"
                          } w-12 h-12`}
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <label className="flex items-baseline gap-1 text-sm font-medium text-gray-700 font-poppins">
                    Skills{" "}
                    <span className="text-xs text-gray-500 font-outfit">
                      {`(${user.developerProfile.skills.length}/10) ${
                        user.developerProfile.skills.length === 10
                          ? "Max skills"
                          : ""
                      }`}
                    </span>
                  </label>
                  <div className="relative">
                    <BadgeCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="skills"
                      value={skillValue}
                      disabled={user.developerProfile.skills.length === 10}
                      onChange={(e) => setSkillValue(e.target.value)}
                      className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-poppins outline-none"
                      placeholder="App / Web / Cloud Developer"
                    />
                    {isAddingInfo === "skills" ? (
                      <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
                    ) : (
                      skillValue && (
                        <CirclePlus
                          onClick={handleAddSkill}
                          className={`absolute right-0.5 top-1/2 py-3.5 text-green-500 transform -translate-y-1/2 rounded-r-xl w-12 h-12`}
                        />
                      )
                    )}
                  </div>
                  {/* Chips */}
                  {user.developerProfile.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {user.developerProfile.skills.map((skill, index) => (
                        <span
                          key={index}
                          onClick={(e) => handleRemoveSkill(e, index)}
                          className="flex justify-center items-center gap-1 pl-2 pr-1 py-0.5 bg-green-50 text-green-600 rounded-md text-xs font-normal font-poppins border border-green-600"
                        >
                          {skill}
                          <X
                            size={13}
                            className="text-green-700 cursor-pointer hover:text-green-900 transition"
                          />
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Languages / Tech Stacks */}
                <div className="space-y-2">
                  <label className="flex items-baseline gap-1 text-sm font-medium text-gray-700 font-poppins">
                    Languages / Tech
                  </label>
                  <div className="relative">
                    <Braces className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="techstacks"
                      value={techStackValue}
                      onChange={(e) => setTechStackValue(e.target.value)}
                      className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-poppins outline-none"
                      placeholder="Java / Go / Flutter , Docker / Github "
                    />
                    {isAddingInfo === "techstack" ? (
                      <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
                    ) : (
                      techStackValue && (
                        <CirclePlus
                          onClick={handleAddTechstack}
                          className="absolute right-0.5 top-1/2 py-3.5 text-green-500 transform -translate-y-1/2 rounded-r-xl w-12 h-12"
                        />
                      )
                    )}
                  </div>
                  {/* Chips */}
                  {user.developerProfile.techStacks.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {user.developerProfile.techStacks.map((tech, index) => (
                        <span
                          key={index}
                          onClick={(e) => handleRemoveTechstack(e, index)}
                          className="flex justify-center items-center gap-1 pl-2 pr-1 py-0.5 bg-green-50 text-green-600 rounded-md text-xs font-normal font-poppins border border-green-600"
                        >
                          {tech}
                          <X
                            size={13}
                            className="text-green-700 cursor-pointer hover:text-green-900 transition"
                          />
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Social Links Section */}
          <div className="pt-2 ">
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

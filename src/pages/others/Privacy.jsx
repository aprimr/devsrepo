import { ChevronLeft, Sticker } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-poppins">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 md:px-20 flex items-center gap-4">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-base md:text-lg font-medium text-gray-500 hover:text-gray-800 transition"
            aria-label="Go back"
          >
            <ChevronLeft size={18} />
            Back
          </button>

          {/* Divider */}
          <span className="h-4 w-px bg-gray-300" />

          {/* DEVS REPO */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <Sticker size={28} className="text-green-500" />
            <span className="text-lg md:text-xl font-medium tracking-tight text-gray-900">
              DevsRepo
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-10 md:px-20">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-green-500 mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm md:text-base font-medium text-gray-500">
            Last updated:{" "}
            <span className="font-outfit">
              {new Date().toLocaleDateString()}
            </span>
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8 text-sm text-gray-900 leading-relaxed">
          {privacySections.map((section, index) => (
            <section key={index} className="border-b border-gray-300 pb-4">
              <h2 className="text-lg md:text-xl font-medium text-green-600 mb-4">
                {section.title}
              </h2>
              <ul className="list-disc text-base md:text-lg pl-5 space-y-2">
                {section.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-6">
          <div className="mb-2 flex flex-wrap gap-4 text-xs md:text-sm text-gray-400">
            <span
              className=" text-nowrap hover:underline cursor-pointer"
              onClick={() => navigate("/terms")}
            >
              Terms & Conditions
            </span>
            <span
              className=" text-nowrap hover:underline cursor-pointer"
              onClick={() => navigate("/privacy")}
            >
              Privacy Policy
            </span>
            <span
              className=" text-nowrap hover:underline cursor-pointer"
              onClick={() => navigate("/developer-terms")}
            >
              Developer Terms
            </span>
          </div>
          <div className="text-sm md:text-sm text-gray-600">
            © {new Date().getFullYear()} DevsRepo. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Privacy;

const privacySections = [
  {
    title: "1. Information We Collect",
    points: [
      "When you create an account or log in, we collect your name, email, and user ID via Google or GitHub authentication.",
      "If you create a developer account, we also collect your GitHub and LinkedIn profile links.",
      "We automatically collect technical information such as device type, operating system, and usage data to improve our service.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    points: [
      "To provide and maintain the DevsRepo platform, including app downloads and developer features.",
      "To communicate with you regarding account updates, app submissions, or support requests.",
      "To detect, prevent, and address technical issues, abuse, or policy violations.",
    ],
  },
  {
    title: "3. Sharing of Information",
    points: [
      "We do not sell, rent, or trade your personal information to third parties.",
      "We may share your information if required by law or legal process.",
      "Your GitHub and LinkedIn links are public on your profile if you provide them for developer purposes.",
    ],
  },
  {
    title: "4. Data Security",
    points: [
      "We store your information securely using Firebase and Appwrite.",
      "We implement industry-standard security measures to protect your data from unauthorized access.",
      "However, no platform can guarantee absolute security; use the platform responsibly.",
    ],
  },
  {
    title: "5. Your Choices",
    points: [
      "You can delete your account at any time using the two-step confirmation process.",
      "You may update your profile information or developer links at any time.",
      "Deleting your account removes most personal data, but some login-related information may be kept for recovery purposes.",
    ],
  },
  {
    title: "6. Changes to Privacy Policy",
    points: [
      "We may update this Privacy Policy from time to time.",
      "Continued use of DevsRepo after updates constitutes acceptance of the revised policy.",
    ],
  },
];

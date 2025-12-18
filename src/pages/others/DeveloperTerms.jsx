import { ChevronLeft, Sticker } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DeveloperTerms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-poppins">
      {/*Header */}
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
            Developer Terms & Conditions
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
          {developerSections.map((section, index) => (
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

export default DeveloperTerms;

const developerSections = [
  {
    title: "1. Developer Account",
    points: [
      "To publish apps, you must create a developer account by linking your GitHub and LinkedIn profiles.",
      "Providing accurate information is required. These links will be visible on your public profile and can help showcase your work.",
      "Your DevsRepo profile can serve as your profile for showcase purposes.",
    ],
  },
  {
    title: "2. App Publishing",
    points: [
      "Developers can submit apps along with media such as icons, banners, screenshots, and promo video links.",
      "All submitted apps undergo review by the DevsRepo team. Only approved apps go live.",
      "DevsRepo can reject, suspend, or delete any app without prior notice if it violates platform rules or laws.",
    ],
  },
  {
    title: "3. App Content & Compliance",
    points: [
      "Apps must follow Nepal law and DevsRepo platform guidelines.",
      "Malware, pirated, harmful, or inappropriate content will be rejected and may result in account suspension or ban.",
      "Developers are fully responsible for their app content. DevsRepo is only a hosting and distribution platform and not liable for app issues.",
    ],
  },
  {
    title: "4. Ownership & Intellectual Property",
    points: [
      "Developers retain ownership of their apps.",
      "DevsRepo may remove apps if they infringe someone else’s rights or are suspicious.",
      "Developers are responsible for ensuring that their apps do not violate copyright or intellectual property laws.",
    ],
  },
  {
    title: "5. App Removal & Suspension",
    points: [
      "Approved apps can be removed later if they violate platform policies.",
      "If an app is rejected or suspended, the reason will be communicated to the developer.",
      "DevsRepo can also delete apps without notice if necessary.",
    ],
  },
  {
    title: "6. Account Responsibility",
    points: [
      "Developers are responsible for keeping their accounts secure.",
      "Violations, including uploading harmful apps or media, may result in suspension or permanent ban.",
      "For reinstatement of apps or accounts, developers must contact DevsRepo support.",
    ],
  },
  {
    title: "7. Privacy & Data",
    points: [
      "DevsRepo uses Google and GitHub login. Only essential information is stored securely.",
      "Your GitHub and LinkedIn links are public as provided by you.",
      "DevsRepo never shares your data with third parties.",
    ],
  },
  {
    title: "8. Changes to Terms",
    points: [
      "These developer terms may be updated from time to time.",
      "By continuing to use DevsRepo as a developer, you accept the updated terms.",
    ],
  },
];

import { ChevronLeft, Sticker } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
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
            Terms & Conditions
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
          {sections.map((section, index) => (
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

export default Terms;

const sections = [
  {
    title: "1. About DevsRepo",
    points: [
      "DevsRepo is an independent app store where users can download apps and developers can publish their apps for free.",
      "It is built as an alternative to platforms like Play Store and App Store that charge high publishing fees.",
      "DevsRepo only provides hosting and distribution services and does not own any third-party apps.",
      "App and user data are handled using Firebase, while app files are stored through Appwrite.",
      "All responsibility for apps, media, and content lies with the developer. Any legal issues arising from unauthorized or protected content are the sole responsibility of the developer. DevsRepo has full rights to delete or modify any content published on the platform.",
    ],
  },
  {
    title: "2. User Access",
    points: [
      "Anyone can browse and download apps without logging in.",
      "Logged-in users can rate apps, write reviews, and report apps if needed.",
      "Users are expected to respect developers and follow platform rules.",
    ],
  },
  {
    title: "3. Reviews & Reporting",
    points: [
      "Users are fully responsible for the reviews and reports they submit.",
      "Each app can be reported only once per user.",
      "Abuse of the reporting system, including fake or mass reports, may lead to account suspension or deletion.",
    ],
  },
  {
    title: "4. Downloads & Risk",
    points: [
      "All apps are downloaded and installed at the user’s own risk.",
      "DevsRepo is not responsible for any damage, data loss, or security issues caused by third-party apps.",
    ],
  },
  {
    title: "5. Account Suspension",
    points: [
      "Accounts may be suspended or banned if platform rules or laws are violated.",
      "Serious or repeated misuse of the platform can result in permanent bans.",
    ],
  },
  {
    title: "6. Privacy",
    points: [
      "DevsRepo uses Google and GitHub for login.",
      "Only basic information such as name, email, and user ID is stored.",
      "User data is never sold or shared with third parties.",
    ],
  },
  {
    title: "7. Changes to Terms",
    points: [
      "These terms may be updated from time to time.",
      "Using DevsRepo after updates means you agree to the new terms.",
    ],
  },
  {
    title: "8. Account Deletion",
    points: [
      "Account deletion requires a two-step confirmation to avoid mistakes.",
      "Once deleted, user profile data is removed from the platform.",
      "Some login-related information may be kept securely to allow rejoining.",
    ],
  },
];

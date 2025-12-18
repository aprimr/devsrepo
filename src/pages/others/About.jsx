import { ChevronLeft, Sticker, ShieldCheck, Info, Users } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const socials = [
    {
      name: "GitHub",
      icon: <FaGithub size={16} />,
      url: "https://github.com/yourusername",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin size={16} />,
      url: "https://linkedin.com/in/yourusername",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-poppins text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 md:px-20 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-800 transition"
            aria-label="Go back"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <span className="h-4 w-px bg-gray-300" />
          <h1 className="text-lg md:text-xl font-medium text-gray-700">
            About DevsRepo
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 md:px-8 py-8 space-y-10">
        {/* App Info */}
        <section className="text-center space-y-3">
          <Sticker size={60} className="mx-auto text-green-500" />
          <h2 className="text-2xl font-medium text-gray-900">DevsRepo</h2>
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            Version 1.0.0
          </div>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Discover and download apps safely, while developers publish for
            free. Security, transparency, and accessibility are our priorities.
          </p>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mt-3">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-gray-600 hover:text-green-600 transition text-sm"
              >
                {social.icon}
                <span>{social.name}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Security */}
        <section className="space-y-2">
          <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            Security & Privacy
          </h3>
          <p className="text-gray-600 text-sm">
            All apps undergo security checks. User data is safe and never shared
            with third parties. Secure authentication keeps your data safe.
          </p>
        </section>

        {/* Features */}
        <section className="space-y-2">
          <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            What We Offer
          </h3>
          <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
            <li>Free app publishing for developers</li>
            <li>Safe and verified downloads</li>
            <li>User ratings and reviews</li>
            <li>Accessible anywhere, anytime</li>
          </ul>
        </section>

        {/* Community */}
        <section className="space-y-2">
          <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            Community Driven
          </h3>
          <p className="text-gray-600 text-sm">
            Users can provide feedback, report issues, and help maintain
            quality. A safe and active community keeps DevsRepo reliable for
            everyone.
          </p>
        </section>

        {/* Legal */}
        <section className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">Legal</h3>
          <div className="flex flex-wrap gap-3 text-sm">
            <button
              onClick={() => navigate("/terms")}
              className="px-3 py-2 bg-gray-50 rounded hover:bg-gray-100"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => navigate("/privacy")}
              className="px-3 py-2 bg-gray-50 rounded hover:bg-gray-100"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate("/developer-terms")}
              className="px-3 py-2 bg-gray-50 rounded hover:bg-gray-100"
            >
              Developer Terms
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} DevsRepo. All rights reserved.
        </footer>
      </main>
    </div>
  );
};

export default About;

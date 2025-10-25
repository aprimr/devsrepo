import { Link } from "react-router-dom";
import { Sticker, Heart } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left side - Brand */}
          <div className="flex items-center gap-2">
            <Sticker size={20} className="text-green-600" />
            <span className="text-lg font-poppins font-medium text-gray-800">
              DevRepo
            </span>
          </div>

          {/* Center - Copyright */}
          <div className="flex items-center gap-4 text-sm text-gray-600 font-inter">
            <span>© {currentYear} DevRepo</span>
          </div>

          {/* Right side - Links */}
          <div className="flex items-center gap-4 text-sm text-gray-600 font-inter">
            <Link
              to="/about"
              className="hover:text-green-700 transition-colors"
            >
              About
            </Link>
            <Link
              to="/privacy"
              className="hover:text-green-700 transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="hover:text-green-700 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

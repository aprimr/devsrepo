import { Sticker } from "lucide-react";

function Footer() {
  return (
    <nav className="bg-white border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto px-6 pb-6 pt-5 flex justify-center">
        <div className="flex items-center gap-2 text-gray-800 font-poppins font-medium">
          {/* Brand */}
          <Sticker size={20} className="text-green-600" />
          <span className="text-lg">DevsRepo</span>

          {/* Divider */}
          <span className="text-gray-400">|</span>

          {/* Other content */}
          <span className="text-sm text-gray-600">Open Source App Library</span>
        </div>
      </div>
    </nav>
  );
}

export default Footer;

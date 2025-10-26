import { Sticker, Download } from "lucide-react";

function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-linear-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 animate-bounce">
            <Sticker size={40} className="text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Download className="text-green-500 animate-ping" size={20} />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-3">
          DevRepo
        </h1>
        <p className="text-gray-600 font-inter mb-6">
          Curating the best developer apps...
        </p>

        {/* Animated Grid */}
        <div className="flex gap-1 justify-center mb-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-8 bg-linear-to-b from-green-400 to-green-600 rounded-full animate-wave"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%,
          100% {
            transform: scaleY(0.5);
          }
          50% {
            transform: scaleY(1.5);
          }
        }
        .animate-wave {
          animation: wave 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Loading;

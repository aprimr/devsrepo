import { Link } from "react-router-dom";
import DevsRepoInverted from "../../../assets/images/DevsRepoInvert.png";

const AppNotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 sm:px-0">
      <div className="w-full max-w-md text-center">
        <center>
          {" "}
          <img
            src={DevsRepoInverted}
            alt="App not found"
            className="h-20 w-20 mb-5"
          />
        </center>
        <h1 className="text-2xl sm:text-3xl font-poppins font-semibold text-gray-900 mb-4">
          App Not Found
        </h1>
        <p className="text-gray-600 text-sm font-poppins sm:text-base leading-relaxed mb-6">
          The app you’re looking for doesn’t exist or is no longer available.
          Please Retry or return to a safe page.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-green-500 text-white rounded-lg font-poppins text-sm sm:text-base hover:bg-green-600 transition"
          >
            Retry
          </button>
          <Link
            to="/"
            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 font-poppins text-sm sm:text-base hover:bg-gray-100 transition"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AppNotFound;

import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-10 sm:px-0">
      <div className="text-left w-full max-w-md mt-38">
        <h1 className="text-xl sm:text-2xl font-poppins font-semibold text-gray-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-600 text-sm sm:text-base font-inter leading-relaxed mb-2 sm:mb-3">
          The page you are looking for may have been moved, deleted, or might
          never have existed. Please check the URL for errors or return to the
          homepage to continue browsing.
        </p>
        <Link
          to={-1}
          className="inline-block text-green-700 font-poppins font-medium underline transition-colors text-sm sm:text-base"
        >
          Go back to last page
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound;

import Lottie from "lottie-react";
import LoadingAnimation from "../../../assets/animations/search.json";

const AppLoading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 font-poppins">
      <div className="max-w-2xl h-auto">
        <Lottie animationData={LoadingAnimation} loop={true} />
      </div>
      <p className="text-gray-700 text-xl font-poppins mt-4">Loading . . .</p>
    </div>
  );
};

export default AppLoading;

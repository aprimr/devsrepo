import { NavLink, useNavigate } from "react-router-dom";
import { Sticker, ChevronLeft, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../../store/AuthStore";
import LoginBg from "../../assets/images/login-bg.jpg";

function Login() {
  const {
    continueWithGoogle,
    continueWithGitHub,
    isLoading,
    isAuthenticated,
    user,
  } = useAuthStore();
  const [loginProvider, setLoginProvider] = useState("");
  const navigate = useNavigate();

  // Check if user exists
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/", { replace: true });
    }
  }, []);

  // Continue With Google
  const handleGoogleLogin = async () => {
    setLoginProvider("google");
    const result = await continueWithGoogle();

    if (result.success) {
      if (result.isNewUser) {
        navigate("/onboarding", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
      setLoginProvider("");
    } else {
      setLoginProvider("");
      toast.error(`Google login failed`);
    }
  };

  // Continue With Github
  const handleGithubLogin = async () => {
    setLoginProvider("github");
    const result = await continueWithGitHub();

    if (result.success) {
      if (result.isNewUser) {
        navigate("/onboarding", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
      setLoginProvider("");
    } else {
      setLoginProvider("");
      toast.error(`GitHub login failed`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Image */}
      <img
        src={LoginBg}
        alt="login background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Blur Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm sm:backdrop-blur-md" />

      {/* Back Button */}
      <NavLink
        to={-1 || "/"}
        className="absolute top-6 left-5 sm:left-10 z-20 flex items-center gap-1 text-white/80 hover:text-white transition-colors"
      >
        <ChevronLeft size={16} />
        <span className="font-inter text-sm">Back</span>
      </NavLink>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-sm">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Sticker size={48} className="text-white" />
            </div>
            <h1 className="text-2xl font-poppins font-semibold text-white mb-2">
              Welcome to DevsRepo
            </h1>
            <p className="text-gray-200 font-inter text-sm leading-relaxed">
              Sign in with your preferred provider to continue to DevsRepo and
              access your account.
            </p>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex justify-center items-center bg-white hover:bg-gray-50 text-gray-800 px-4 py-3 rounded-xl font-poppins font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-70"
          >
            {isLoading && loginProvider === "google" ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 size={22} className="animate-spin" />
                <span>Continue with Google</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <FcGoogle size={22} />
                <span>Continue with Google</span>
              </div>
            )}
          </button>

          {/* GitHub Login Button */}
          <button
            onClick={handleGithubLogin}
            disabled={isLoading}
            className="w-full flex justify-center items-center bg-white hover:bg-gray-50 text-gray-800 px-4 py-3 mt-4 rounded-xl font-poppins font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-70"
          >
            {isLoading && loginProvider === "github" ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 size={22} className="animate-spin" />
                <span>Continue with Github</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <FaGithub size={22} />
                <span>Continue with Github</span>
              </div>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white text-[10px] font-inter leading-relaxed">
            By continuing, you agree to the{" "}
            <NavLink
              to="/terms"
              className="text-white/90 underline hover:text-white"
            >
              Terms of Service
            </NavLink>{" "}
            and{" "}
            <NavLink
              to="/privacy"
              className="text-white/90 underline hover:text-white"
            >
              Privacy Policy
            </NavLink>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

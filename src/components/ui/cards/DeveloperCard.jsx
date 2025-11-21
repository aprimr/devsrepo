import { BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/AuthStore";

function DeveloperCard({ developer }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div
      onClick={() => {
        if (user.uid === developer.uid) {
          navigate("/profile");
        } else {
          navigate(`/p/${developer.developerProfile.developerId}`);
        }
      }}
      className="shrink-0 w-26 cursor-pointer"
    >
      {/* Developer Photo */}
      <div className="relative">
        <img
          src={developer.photoURL}
          alt={developer.name}
          className="w-26 h-26 object-cover rounded-2xl border-2 border-gray-200"
        />  
      </div>

      {/* Developer Info */}
      <div className="pt-2 w-full text-center">
        <h3 className="text-sm font-medium font-poppins text-gray-900 truncate">
          {developer.name}
        </h3>

        <p className="text-sm text-gray-500 font-outfit flex items-center justify-center gap-1">
          <span className="truncate text-gray-600 -mr-1">
            @{developer.username}
          </span>

          {developer.developerProfile.verifiedDeveloper && (
            <BadgeCheck
              size={16}
              fill="#3B82F6"
              color="white"
              className="shrink-0"
            />
          )}
        </p>
      </div>
    </div>
  );
}

export default DeveloperCard;

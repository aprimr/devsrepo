import { useEffect, useState } from "react";
import {
  BadgeCheck,
  EllipsisVertical,
  Heart,
  Loader2,
  Pencil,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { reviewService } from "../../../services/reviewServices";
import {
  fetchDeveloperbyDevID,
  fetchUserById,
} from "../../../services/appServices";
import { formatDate } from "../../../utils/formatDate";
import { useAuthStore } from "../../../store/AuthStore";
import numberSuffixer from "../../../utils/numberSuffixer";
import { toast } from "sonner";

function ReviewCard({ userId, appId, developerId, myReview = false }) {
  const [review, setReview] = useState({});
  const [reviewUser, setReviewUser] = useState({});
  const [developer, setDeveloper] = useState({});
  const [loading, setLoading] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewTextInput, setReviewTextInput] = useState("");
  const [developerReply, setDeveloperReply] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isDeletingReply, setIsDeletingReply] = useState(false);
  const [isEditingReply, setIsEditingReply] = useState(false);
  const [editedReplyText, setEditedReplyText] = useState("");
  const [isUpdatingReply, setIsUpdatingReply] = useState(false);

  const [reviewTextDetails, setReviewTextDetails] = useState(false);
  const [developerReplyDetails, setDeveloperReplyDetails] = useState(false);

  const { user } = useAuthStore();

  useEffect(() => {
    const fetchReviewDetails = async () => {
      if (!userId || !appId) return;

      setLoading(true);
      try {
        const reviewResult = await reviewService.fetchReview(userId, appId);

        if (reviewResult.success && reviewResult.review) {
          setReview(reviewResult.review);
          setReviewTextInput(reviewResult.review.reviewText || "");

          const userResult = await fetchUserById(reviewResult.review.userId);

          if (userResult?.success) {
            setReviewUser(userResult.developer);
          }
        } else {
          setReview(null);
          setReviewUser(null);
        }
      } catch (err) {
        setReview(null);
        setReviewUser(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchDeveloperDetails = async () => {
      if (!developerId) return;

      setLoading(true);
      try {
        const result = await fetchDeveloperbyDevID(developerId);

        if (!result.success) {
          return new error("Error fetching developer data");
        }

        setDeveloper(result.developer);
      } catch (err) {
        setDeveloper({});
      } finally {
        setLoading(false);
      }
    };

    fetchReviewDetails();
    fetchDeveloperDetails();
  }, [userId, appId]);

  const handleLikeUnlikeReview = async () => {
    if (!review?.reviewId || !user?.uid || isLiking) return;

    try {
      setIsLiking(true);

      const result = await reviewService.likeUnlikeReview(
        review.reviewId,
        user.uid
      );

      if (result.success) {
        setReview((prev) => ({
          ...prev,
          likes: result.review.likes,
        }));
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDeleteReview = async () => {
    try {
      setIsDeleting(true);
      const result = await reviewService.deleteMyReview(
        review.reviewId,
        user.uid,
        appId
      );

      if (result.success) {
        toast.success("Review deleted successfully.");
        setIsDeleted(true);
        setReview(null);
        setReviewUser(null);
      } else {
        toast.error("Failed to delete review.");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error("Error deleting review.");
    } finally {
      setIsDeleting(false);
      setIsOptionsOpen(false);
      setConfirmDelete(false);
      setReviewTextInput("");
    }
  };

  const handleUpdateReview = async () => {
    if (!reviewTextInput.trim()) {
      toast.error("Review cannot be empty.");
      return;
    }

    setIsUpdating(true);
    try {
      const result = await reviewService.updateMyReview(
        review.reviewId,
        appId,
        reviewTextInput,
        rating,
        user?.uid
      );

      if (result.success) {
        toast.success("Review updated successfully!");
        setReview(result.review);
        setIsEditing(false);
      } else {
        toast.error(result.message || "Failed to update review.");
      }
    } catch (err) {
      console.error("Error updating review:", err);
      toast.error("Error updating review.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendReply = async () => {
    if (!developerReply.trim()) {
      toast.error("Reply cannot be empty.");
      return;
    }

    try {
      setIsSendingReply(true);
      const result = await reviewService.replyToReview(
        review.reviewId,
        developerReply
      );

      if (result.success && result.review) {
        toast.success("Reply sent successfully!");
        setReview(result.review);
        setDeveloperReply("");
      } else {
        toast.error(result.message || "Failed to send reply.");
      }
    } catch (err) {
      console.error("Error sending reply:", err);
      toast.error("Error sending reply.");
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleDeleteReply = async () => {
    if (!review?.reviewId) {
      toast.error("Review not found.");
      return;
    }

    try {
      setIsDeletingReply(true);
      const result = await reviewService.deleteDeveloperReply(review.reviewId);

      if (result.success) {
        toast.success("Reply deleted successfully!");

        setReview((prev) => ({
          ...prev,
          developerReply: {
            replyText: "",
            repliedAt: "",
            isEdited: false,
            editedAt: "",
          },
        }));
      } else {
        toast.error(result.message || "Failed to delete reply.");
      }
    } catch (err) {
      console.error("Error deleting reply:", err);
      toast.error("Error deleting reply.");
    } finally {
      setIsDeletingReply(false);
    }
  };

  const handleEditReply = async () => {
    if (!editedReplyText.trim()) {
      toast.error("Reply cannot be empty.");
      return;
    }

    try {
      setIsUpdatingReply(true);

      const result = await reviewService.editDeveloperReply(
        review.reviewId,
        editedReplyText
      );

      if (result.success) {
        toast.success("Reply updated!");

        setReview((prev) => ({
          ...prev,
          developerReply: {
            ...prev.developerReply,
            replyText: editedReplyText,
            isEdited: true,
            editedAt: result.review.developerReply.editedAt,
          },
        }));

        setIsEditingReply(false);
      } else {
        toast.error(result.message || "Failed to update reply.");
      }
    } catch (err) {
      console.error("Error updating reply:", err);
      toast.error("Error while updating reply.");
    } finally {
      setIsUpdatingReply(false);
    }
  };

  if (loading) {
    return (
      <div className="list-none flex flex-col gap-2 bg-gray-100 py-4 px-2 rounded-xl animate-pulse">
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 bg-gray-300 rounded-full shrink-0"></div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="w-24 h-3 bg-gray-300 rounded"></div>
              <div className="w-18 h-3 bg-gray-300 rounded"></div>
            </div>
            <div className="w-full h-4 bg-gray-300 rounded mt-1"></div>
            <div className="flex justify-between items-center mt-1">
              <div className="w-20 h-3 bg-gray-300 rounded"></div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                <div className="w-6 h-3 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="p-3 rounded-lg bg-gray-50 flex flex-col gap-2">
        {/* Stars */}
        <div className="flex justify-between ">
          <div className="flex gap-4 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setRating(s)}
                className="transition"
              >
                <Star
                  size={24}
                  className={
                    rating >= s
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-400"
                  }
                />
              </button>
            ))}
          </div>
          <span className="text-2xl">
            {["😞", "😐", "😕", "🙂", "😍"][rating - 1]}
          </span>
        </div>

        {/* Textarea */}
        <div className="mb-2">
          <textarea
            rows={2}
            className="w-full p-4 bg-gray-50 rounded-xl border border-gray-300 text-sm font-poppins outline-none focus:ring-2 focus:ring-green-500 transition resize-none"
            placeholder="Share your thoughts about this app..."
            value={reviewTextInput}
            onChange={(e) => setReviewTextInput(e.target.value)}
          />
        </div>

        {/* Avatar + Submit Button */}
        <div className="flex justify-between items-center">
          <div className="h-8 w-8">
            <img
              src={user.photoURL}
              alt={user.name}
              className="rounded-full h-8 w-8"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setIsEditing(false);
                setRating("");
                setReviewTextInput("");
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-poppins py-1.5 px-4 rounded-xl flex items-center justify-center gap-2 transition disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
            >
              <span>Cancle</span>
            </button>
            <button
              onClick={handleUpdateReview}
              disabled={isUpdating}
              className="bg-green-500 hover:bg-green-600 text-black font-poppins py-1.5 px-4 rounded-xl flex items-center justify-center gap-2 transition disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
            >
              {isUpdating && <Loader2 className="animate-spin" size={18} />}
              <span>{isUpdating ? "Updating..." : "Update Review"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isDeleted) {
    return (
      <div className="p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm font-poppins">
        Your review has been deleted successfully. You can now submit a new
        review.
      </div>
    );
  }

  return (
    <div className="group">
      <div className="list-none cursor-pointer flex flex-col gap-2">
        <div className="relative flex gap-3 items-start">
          {/* User image */}
          <img
            src={reviewUser?.photoURL}
            className="w-9 h-9 rounded-full shrink-0"
          />
          <div className="flex-1 flex flex-col gap-1">
            {/* Name rating and option button */}
            <div className="flex items-center justify-between">
              {/* Name */}
              <span className="text-sm font-medium font-poppins text-gray-900">
                {reviewUser?.name}
              </span>
              {/* Stars and option btn */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${
                      i < review?.rating ? "text-green-500" : "text-gray-300"
                    } fill-current`}
                  />
                ))}
                {myReview && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOptionsOpen(!isOptionsOpen);
                      setConfirmDelete(false);
                    }}
                    className="p-1 ml-1 rounded bg-gray-100 hover:bg-gray-200 transition"
                  >
                    {isOptionsOpen ? (
                      <X size={16} />
                    ) : (
                      <EllipsisVertical size={16} />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Review */}
            <p
              onClick={() => setReviewTextDetails(!reviewTextDetails)}
              className={`cursor-pointer text-xs font-poppins ${
                !reviewTextDetails ? "line-clamp-2" : "line-clamp-none"
              } text-gray-800 whitespace-pre-wrap`}
            >
              {review?.reviewText}
            </p>

            {/* Reply to User Input */}
            {user &&
              user?.developerProfile.developerId === developerId &&
              !review?.developerReply?.replyText &&
              !myReview && (
                <div className="relative mt-2 mb-1">
                  <input
                    type="text"
                    placeholder={`Reply to ${reviewUser.name}'s review`}
                    value={developerReply}
                    onChange={(e) => setDeveloperReply(e.target.value)}
                    className="w-full pr-20 pl-3 py-2 text-sm font-poppins border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  />
                  <button
                    onClick={handleSendReply}
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white font-poppins px-4 py-[5px] rounded-md text-sm flex items-center gap-2 transition disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                    disabled={isSendingReply}
                  >
                    {isSendingReply ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Replying</span>
                      </>
                    ) : (
                      <span>Reply</span>
                    )}
                  </button>
                </div>
              )}

            {/* Toggle Developer Reply */}
            {review?.developerReply?.replyText && (
              <button
                onClick={() => setDeveloperReplyDetails((prev) => !prev)}
                className="text-xs text-left text-green-600 font-medium font-poppins"
              >
                {developerReplyDetails
                  ? "Hide developer reply"
                  : "Show developer reply"}
              </button>
            )}
          </div>

          {/* Options Btn */}
          {myReview && isOptionsOpen && (
            <div className="absolute top-0 right-8 backdrop-blur-md bg-white/30 shadow-sm border border-white/40 rounded-xl w-32 py-1 z-20">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setIsOptionsOpen(false);
                  setRating(review.rating);
                  setReviewTextInput(review.reviewText);
                }}
                className="w-full flex items-center gap-2 font-outfit px-3 py-2 text-sm text-gray-800 rounded-lg transition"
              >
                <Pencil size={14} /> Edit
              </button>

              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full flex items-center gap-2 font-outfit px-3 py-2 text-sm text-red-600 rounded-lg transition"
                >
                  <Trash2 size={14} /> Delete
                </button>
              ) : (
                <button
                  onClick={handleDeleteReview}
                  disabled={isDeleting}
                  className="w-full flex items-center gap-2 font-outfit px-3 py-2 text-sm text-red-600 disabled:opacity-70 rounded-lg transition"
                >
                  {isDeleting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Really ?
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Developer Reply */}
      {review?.developerReply?.replyText && developerReplyDetails && (
        <div className="mt-2 ml-12">
          <div className="py-1.5 px-2 bg-gray-100 border-2 border-gray-300 rounded-lg relative">
            {/* Developer Details and buttons */}
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-0.5">
                <img
                  src={developer.photoURL}
                  alt={developer.uid}
                  className="h-4 w-4 rounded-full mr-0.5"
                />
                <p className="text-[12px] font-poppins font-medium text-gray-900">
                  {developer.name}
                </p>
                {developer.developerProfile.verifiedDeveloper && (
                  <BadgeCheck className="w-3.5 h-3.5 text-green-50 fill-blue-500" />
                )}
              </div>

              {/* Buttons */}
              {user && user.developerProfile.developerId === developerId && (
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setIsEditingReply((prev) => !prev);
                      setEditedReplyText(review.developerReply.replyText);
                    }}
                    className="text-blue-600 hover:text-blue-700 text-xs font-poppins flex items-center gap-1"
                  >
                    {isEditingReply ? "Cancle" : "Edit"}
                  </button>

                  <button
                    disabled={isDeletingReply}
                    onClick={() => handleDeleteReply(review.reviewId)}
                    className={`text-red-600 hover:text-red-700 text-xs font-poppins flex items-center gap-1
                      ${isDeletingReply ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    {isDeletingReply ? (
                      <span className="animate-pulse text-[10px]">
                        Deleting...
                      </span>
                    ) : (
                      <>
                        <Trash2 size={12} />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Reply Text */}
            {!isEditingReply && (
              <p className="text-[13px] text-gray-700 font-poppins whitespace-pre-wrap">
                {review.developerReply.replyText}
              </p>
            )}

            {/* Edit Reply Input */}
            {isEditingReply && (
              <div className="relative mt-2">
                <input
                  type="text"
                  value={editedReplyText}
                  onChange={(e) => setEditedReplyText(e.target.value)}
                  className="w-full pr-20 px-3 py-2 text-sm font-poppins border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
                  placeholder="Edit your reply..."
                />

                <button
                  onClick={() => handleEditReply(review.reviewId)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 
               text-white text-xs font-poppins px-3 py-1.5 rounded-md transition"
                >
                  Update
                </button>
              </div>
            )}

            {/* Dates */}
            <div className="mt-1 text-[10px] font-outfit text-gray-600 flex gap-2">
              <span>
                {review.developerReply.repliedAt &&
                  formatDate(review.developerReply.repliedAt).split(",")[1] +
                    " " +
                    formatDate(review.developerReply.repliedAt).split(",")[0]}
              </span>
              {review.developerReply.isEdited && (
                <span>
                  (Edited:{" "}
                  {review.developerReply.editedAt &&
                    formatDate(review.developerReply.editedAt).split(",")[1] +
                      " " +
                      formatDate(review.developerReply.editedAt).split(",")[0]}
                  )
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/*   Date and like btn */}
      <div className="mt-1 ml-12">
        <div className="flex justify-between items-center">
          {/* Date */}
          <div className="flex flex-wrap items-center gap-1 text-[10px] font-outfit text-gray-500">
            <span>
              {formatDate(review?.createdAt).split(",")[1] +
                " " +
                formatDate(review?.createdAt).split(",")[0]}
            </span>
            {review?.isEdited && (
              <span className="text-gray-500">
                (Edited:{" "}
                {formatDate(review?.editedAt).split(",")[1] +
                  " " +
                  formatDate(review?.editedAt).split(",")[0]}
                )
              </span>
            )}
          </div>

          {/* Like Btn */}
          <button
            disabled={isLiking}
            onClick={handleLikeUnlikeReview}
            className="flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Heart
              size={14}
              className={`${
                review?.likes?.includes(user?.uid)
                  ? "fill-rose-500 text-rose-500"
                  : "text-gray-500"
              }`}
            />
            <span className="text-[11px] font-outfit text-gray-500">
              {numberSuffixer(review?.likes?.length || 0)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;

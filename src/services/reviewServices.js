import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
  arrayUnion,
  query,
  where,
  getDocs,
  getDoc,
  deleteDoc,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { db } from "../firebase/config";

const reviewCol = collection(db, "reviews");

export const reviewService = {
  // Generate Review Object
  generateReviewModel: (reviewData = {}) => ({
    reviewId: "",
    appId: reviewData.appId || "",
    userId: reviewData.userId || "",
    developerId: reviewData.developerId || "",
    rating: reviewData.rating || 0,
    reviewText: reviewData.reviewText || "",
    likes: [],
    developerReply: {
      replyText: "",
      isEdited: false,
      editedAt: "",
      repliedAt: "",
    },
    createdAt: "",
    isEdited: false,
    editedAt: "",
  }),

  // Create Review in Firestore
  createReview: async (reviewData = {}) => {
    try {
      const newReview = reviewService.generateReviewModel(reviewData);

      const docRef = await addDoc(reviewCol, {
        ...newReview,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "reviews", docRef.id), { reviewId: docRef.id });

      const appRef = doc(db, "apps", reviewData.appId);

      // Add user to community reviews
      await updateDoc(appRef, {
        "community.reviews": arrayUnion(reviewData.userId),
      });

      // Update ratings metrics
      const ratingValue = newReview.rating;
      if (ratingValue >= 1 && ratingValue <= 5) {
        await updateDoc(appRef, {
          [`metrics.ratings.breakdown.${ratingValue}`]: increment(1),
          "metrics.ratings.totalReviews": increment(1),
        });
      }

      return {
        success: true,
        id: docRef.id,
        review: { ...newReview, reviewId: docRef.id },
      };
    } catch (err) {
      console.error("Failed to create review:", err);
      return { success: false, error: err.message };
    }
  },

  // Fetch review
  fetchReview: async (userId, appId) => {
    try {
      const q = query(
        reviewCol,
        where("userId", "==", userId),
        where("appId", "==", appId)
      );
      const snap = await getDocs(q);
      if (snap.empty) return { success: false, review: null };

      const review = snap.docs[0].data();
      return { success: true, review };
    } catch (err) {
      console.error("Failed to fetch review:", err);
      return { success: false, error: err.message };
    }
  },

  // Like / Unlike review
  likeUnlikeReview: async (reviewId, userId) => {
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      const snapshot = await getDoc(reviewRef);

      if (!snapshot.exists()) return { success: false, review: null };

      const review = snapshot.data();
      let reviewLikes = review.likes || [];
      const hasLiked = reviewLikes.includes(userId);

      if (hasLiked) {
        reviewLikes = reviewLikes.filter((id) => id !== userId);
      } else {
        reviewLikes.push(userId);
      }

      await updateDoc(reviewRef, { likes: reviewLikes });

      return {
        success: true,
        review: { ...review, likes: reviewLikes },
      };
    } catch (err) {
      console.error("Failed to like/unlike review:", err);
      return { success: false, error: err.message };
    }
  },

  // Update my review
  updateMyReview: async (reviewId, appId, reviewText, newRating, userId) => {
    if (!reviewId || !appId || !userId) {
      return { success: false, message: "Missing required fields" };
    }

    try {
      const reviewRef = doc(db, "reviews", reviewId);
      const reviewSnap = await getDoc(reviewRef);

      if (!reviewSnap.exists()) {
        return { success: false, message: "Review not found" };
      }

      const prevRating = reviewSnap.data().rating || 0;

      // Update review content & rating
      await updateDoc(reviewRef, {
        reviewText: reviewText || "",
        rating: newRating || 0,
        isEdited: true,
        editedAt: serverTimestamp(),
      });

      // Update app metrics if rating changed
      if (
        prevRating !== newRating &&
        prevRating >= 1 &&
        prevRating <= 5 &&
        newRating >= 1 &&
        newRating <= 5
      ) {
        const appRef = doc(db, "apps", appId);
        await updateDoc(appRef, {
          [`metrics.ratings.breakdown.${prevRating}`]: increment(-1),
          [`metrics.ratings.breakdown.${newRating}`]: increment(1),
        });
      }

      const updatedReviewSnap = await getDoc(reviewRef);
      const updatedReview = {
        reviewId: updatedReviewSnap.id,
        ...updatedReviewSnap.data(),
      };

      return {
        success: true,
        review: updatedReview,
        message: "Review updated successfully",
      };
    } catch (err) {
      console.error("Failed to update review:", err);
      return { success: false, message: err.message };
    }
  },

  // Delete my review
  deleteMyReview: async (reviewId, userId, appId) => {
    try {
      if (!reviewId || !userId || !appId)
        return { success: false, message: "Missing parameters" };

      const reviewRef = doc(db, "reviews", reviewId);
      const reviewSnap = await getDoc(reviewRef);

      if (!reviewSnap.exists())
        return { success: false, message: "Review not found" };

      const rating = reviewSnap.data().rating || 0;

      await deleteDoc(reviewRef);

      const appRef = doc(db, "apps", appId);

      // Remove user from community
      await updateDoc(appRef, {
        "community.reviews": arrayRemove(userId),
      });

      // Decrement metrics
      if (rating >= 1 && rating <= 5) {
        await updateDoc(appRef, {
          [`metrics.ratings.breakdown.${rating}`]: increment(-1),
          "metrics.ratings.totalReviews": increment(-1),
        });
      }

      return { success: true, message: "Review deleted successfully" };
    } catch (err) {
      console.error("Failed to delete review:", err);
      return { success: false, message: err.message };
    }
  },

  // Delete developer reply
  deleteDeveloperReply: async (reviewId) => {
    if (!reviewId) return { success: false, message: "Missing reviewId" };

    try {
      const reviewRef = doc(db, "reviews", reviewId);

      await updateDoc(reviewRef, {
        developerReply: {
          replyText: "",
          isEdited: false,
          repliedAt: "",
          editedAt: "",
        },
      });

      const updatedSnap = await getDoc(reviewRef);
      return {
        success: true,
        message: "Developer reply deleted successfully",
        review: { reviewId, ...updatedSnap.data() },
      };
    } catch (err) {
      console.error("Failed to delete developer reply:", err);
      return { success: false, message: err.message };
    }
  },

  // Developer reply to user review
  replyToReview: async (reviewId, replyText) => {
    if (!reviewId || !replyText)
      return { success: false, message: "Missing required fields" };

    try {
      const reviewRef = doc(db, "reviews", reviewId);

      await updateDoc(reviewRef, {
        developerReply: {
          replyText,
          repliedAt: serverTimestamp(),
          isEdited: false,
          editedAt: "",
        },
      });

      const updatedSnapshot = await getDoc(reviewRef);
      const updatedReview = updatedSnapshot.exists()
        ? updatedSnapshot.data()
        : null;

      return {
        success: true,
        message: "Reply sent successfully",
        review: updatedReview,
      };
    } catch (err) {
      console.error("Failed to reply to review:", err);
      return { success: false, message: err.message };
    }
  },

  // Edit developer reply
  editDeveloperReply: async (reviewId, updatedReplyText) => {
    if (!reviewId || !updatedReplyText?.trim())
      return { success: false, message: "Missing required fields" };

    try {
      const reviewRef = doc(db, "reviews", reviewId);

      await updateDoc(reviewRef, {
        "developerReply.replyText": updatedReplyText,
        "developerReply.isEdited": true,
        "developerReply.editedAt": serverTimestamp(),
      });

      const updatedSnap = await getDoc(reviewRef);
      const updatedReview = updatedSnap.exists()
        ? { reviewId: updatedSnap.id, ...updatedSnap.data() }
        : null;

      return {
        success: true,
        message: "Reply updated successfully",
        review: updatedReview,
      };
    } catch (err) {
      console.error("Failed to edit reply:", err);
      return { success: false, message: err.message };
    }
  },
};

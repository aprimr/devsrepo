import { create } from "zustand";
import { persist } from "zustand/middleware";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, googleProvider, githubProvider } from "../firebase/config";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Generate Firestore User Model
      generateUserModel: (firebaseUser, provider = "google") => {
        const timestamp = Date.now();
        const baseUsername =
          firebaseUser.displayName?.toLowerCase().replace(/\s+/g, "_") ||
          "user";
        const username = `${baseUsername}_${Math.floor(Math.random() * 1000)}`;

        return {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || "",
          emailVerified: firebaseUser.emailVerified,
          providerId: provider,

          // Basic custom fields
          username,
          role: "user",
          bio: "Hey! I'm using DevsRepo.",
          location: "Anywhere on Earth",
          createdAt: timestamp,
          lastLogin: timestamp,

          // Preferences & Settings
          preferences: {
            emailNewsletter: true,
            notifications: {
              appUpdates: true,
              developerNews: true,
              marketing: false,
            },
          },

          // Developer Information
          developerProfile: {
            isDeveloper: false,
            developerId: firebaseUser.uid,
            organizationName: "",
            website: "",
            contactEmail: firebaseUser.email,
            verifiedDeveloper: false,
            developerStatus: "pending_review",
            totalDownloadsAcrossApps: 0,
            developerSince: 0,
            metrics: {
              totalPublishedApps: 0,
              totalReviewsReceived: 0,
            },
            apps: {
              submittedAppIds: [],
              publishedAppIds: [],
              rejectedAppIds: [],
            },
            social: {
              followingIds: [],
              followersIds: [],
            },
          },

          // Internal System Info
          system: {
            banStatus: {
              isBanned: false,
              reason: "",
              bannedUntil: 0,
            },
            lastActivity: timestamp,
          },
        };
      },

      // Create / Update Firestore User
      syncUserWithFirestore: async (userData) => {
        try {
          const userRef = doc(db, "users", userData.uid);
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            await setDoc(userRef, {
              ...userData,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              "system.lastActivity": serverTimestamp(),
            });
            return { isNewUser: true, userData };
          } else {
            await updateDoc(userRef, {
              lastLogin: serverTimestamp(),
              "system.lastActivity": serverTimestamp(),
              photoURL: userData.photoURL,
              name: userData.name,
            });
            return { isNewUser: false, userData };
          }
        } catch (error) {
          console.error("Firestore sync error:", error);
          throw error;
        }
      },

      // Google Auth
      continueWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const firebaseUser = result.user;
          const userModel = get().generateUserModel(firebaseUser, "google");
          const firestoreResult = await get().syncUserWithFirestore(userModel);

          set({
            user: firestoreResult.userData,
            isAuthenticated: true,
            isLoading: false,
          });

          return {
            success: true,
            user: firestoreResult.userData,
            isNewUser: firestoreResult.isNewUser,
          };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      // GitHub Auth
      continueWithGitHub: async () => {
        set({ isLoading: true, error: null });
        try {
          const result = await signInWithPopup(auth, githubProvider);
          const firebaseUser = result.user;
          const userModel = get().generateUserModel(firebaseUser, "github");
          const firestoreResult = await get().syncUserWithFirestore(userModel);

          set({
            user: firestoreResult.userData,
            isAuthenticated: true,
            isLoading: false,
          });

          return {
            success: true,
            user: firestoreResult.userData,
            isNewUser: firestoreResult.isNewUser,
          };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Logout
      logout: async () => {
        try {
          await signOut(auth);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          return { success: true };
        } catch (error) {
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Update User Profile
      updateUserProfile: async (updates) => {
        try {
          const { user } = get();
          if (!user) throw new Error("No user logged in");

          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
            ...updates,
            "system.lastActivity": serverTimestamp(),
          });

          const updatedUser = { ...user, ...updates };
          set({ user: updatedUser });

          return { success: true, user: updatedUser };
        } catch (error) {
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Become Developer
      becomeDeveloper: async (developerData = {}) => {
        try {
          const { user } = get();
          if (!user) throw new Error("No user logged in");

          const updates = {
            role: "developer",
            "developerProfile.isDeveloper": true,
            "developerProfile.developerSince": Date.now(),
            "developerProfile.organizationName":
              developerData.organizationName || "",
            "developerProfile.website": developerData.website || "",
            "developerProfile.contactEmail":
              developerData.contactEmail || user.email,
            "system.lastActivity": serverTimestamp(),
          };

          return await get().updateUserProfile(updates);
        } catch (error) {
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Initialize Auth Listener
      initializeAuth: () => {
        set({ isLoading: true });

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              const userRef = doc(db, "users", firebaseUser.uid);
              const userDoc = await getDoc(userRef);

              let userData;
              if (userDoc.exists()) {
                userData = userDoc.data();
              } else {
                userData = get().generateUserModel(
                  firebaseUser,
                  "email/password"
                );
                await setDoc(userRef, {
                  ...userData,
                  createdAt: serverTimestamp(),
                  lastLogin: serverTimestamp(),
                });
              }

              set({
                user: userData,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } catch (error) {
              console.error("Auth initialization error:", error);
              set({ isLoading: false, error: error.message });
            }
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        });

        return unsubscribe;
      },

      // Clear Error
      clearError: () => set({ error: null }),
    }),
    {
      name: "devsrepo-auth",
      getStorage: () => localStorage,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

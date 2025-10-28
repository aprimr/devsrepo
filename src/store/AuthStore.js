import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  deleteUser,
  reauthenticateWithPopup,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, googleProvider, githubProvider } from "../firebase/config";

const getPrimaryProviderId = (firebaseUser) => {
  return firebaseUser.providerData[0]?.providerId || "unknown";
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Generate Firestore User Model
      generateUserModel: (firebaseUser, provider) => {
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
          location: "",
          privacy: {
            privateFollower: false,
            privateFollowing: false,
          },
          socialLinks: {
            github: "",
            linkedin: "",
            x: "",
            youtube: "",
            instagram: "",
            facebook: "",
          },

          // Preferences & Settings
          preferences: {
            emailNewsletter: true,
            notifications: {
              allowNotifications: true,
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
            isAdmin: false,
            banStatus: {
              isBanned: false,
              reason: "",
              bannedUntil: 0,
            },
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
              system: { ...userData.system, lastActivity: serverTimestamp() },
            });
            return { isNewUser: true, userData };
          } else {
            return { isNewUser: false, userData: userDoc.data() };
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
          const userRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userRef);

          let firestoreResult;
          if (!userDoc.exists()) {
            // NEW USER
            const userModel = get().generateUserModel(
              firebaseUser,
              "google.com"
            );
            firestoreResult = await get().syncUserWithFirestore(userModel);
          } else {
            // EXISTING USER
            const existingData = userDoc.data();
            const updates = {
              providerId: "google.com",
              lastLogin: serverTimestamp(),
              "system.lastActivity": serverTimestamp(),
            };

            await updateDoc(userRef, updates);

            firestoreResult = {
              isNewUser: false,
              userData: { ...existingData, ...updates },
            };
          }

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
          const userRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userRef);

          let firestoreResult;
          if (!userDoc.exists()) {
            // NEW USER
            const userModel = get().generateUserModel(
              firebaseUser,
              "github.com"
            );
            firestoreResult = await get().syncUserWithFirestore(userModel);
          } else {
            // EXISTING USER
            const existingData = userDoc.data();
            const updates = {
              providerId: "github.com",
              lastLogin: serverTimestamp(),
              "system.lastActivity": serverTimestamp(),
            };

            await updateDoc(userRef, updates);

            firestoreResult = {
              isNewUser: false,
              userData: { ...existingData, ...updates },
            };
          }

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
          const combinedUpdates = {
            ...updates,
            "system.lastActivity": serverTimestamp(),
          };

          await updateDoc(userRef, combinedUpdates);

          const updatedUser = {
            ...user,
            ...updates,
            system: {
              ...user.system,
              lastActivity: combinedUpdates["system.lastActivity"],
            },
          };
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
          if (user.role === "developer") {
            return { success: true, user };
          }

          const updates = {
            role: "developer",
            "developerProfile.isDeveloper": true,
            "developerProfile.developerSince": Date.now(),
            "developerProfile.organizationName":
              developerData.organizationName || "",
            "developerProfile.website": developerData.website || "",
            "developerProfile.contactEmail":
              developerData.contactEmail || user.email,
          };

          return await get().updateUserProfile(updates);
        } catch (error) {
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Delete Account
      deleteAccount: async () => {
        const { user } = get();
        if (!user) {
          set({ error: "No user logged in" });
          return { success: false, error: "No user logged in" };
        }

        try {
          const firebaseUser = auth.currentUser;
          if (!firebaseUser) throw new Error("No user found.");

          // Determine provider
          const providerId = firebaseUser.providerData[0]?.providerId;
          const provider =
            providerId === "google.com"
              ? googleProvider
              : providerId === "github.com"
              ? githubProvider
              : null;

          if (!provider)
            throw new Error("Unsupported authentication provider.");

          // Reauthenticate the user
          await reauthenticateWithPopup(firebaseUser, provider);

          // Delete Firestore user document
          await deleteDoc(doc(db, "users", firebaseUser.uid));

          // Delete Firebase Authentication user
          await deleteUser(firebaseUser);

          // Clear Zustand state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          return { success: true, message: "Account deleted successfully." };
        } catch (error) {
          console.error("Error deleting account:", error);
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
                await updateDoc(userRef, {
                  "system.lastActivity": serverTimestamp(),
                  lastLogin: serverTimestamp(),
                });
              } else {
                const provider = getPrimaryProviderId(firebaseUser);

                userData = get().generateUserModel(firebaseUser, provider);

                await setDoc(userRef, {
                  ...userData,
                  createdAt: serverTimestamp(),
                  lastLogin: serverTimestamp(),
                  system: {
                    ...userData.system,
                    lastActivity: serverTimestamp(),
                  },
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

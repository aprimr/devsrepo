import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { deleteFile } from "../services/appwriteStorage";

export const useAppStore = create(
  persist(
    (set, get) => ({
      apps: [],
      selectedApp: null,
      isLoading: false,
      error: null,

      clearSelectedApp: () => set({ selectedApp: null }),

      // Generate App Model
      generateAppModel: (appData = {}) => ({
        appId: "",
        createdAt: "",
        updatedAt: "",

        developer: {
          name: appData.developer?.name,
          userId: appData.developer.userId,
          developerId: appData.developer?.developerId,
          email: appData.developer?.email || "",
        },

        details: {
          name: appData.details?.name || "",
          type: appData.details?.type || "Mobile App",
          category: appData.details?.category || "Social",
          tags: appData.details?.tags || [],
          sourceCodeLink: appData.details?.projectSourceLink || "",
          hasAds: appData.details?.hasAds || false,
          inAppPurchases: appData.details?.inAppPurchases || false,
          ageRating: appData.details?.ageRating,
          description: {
            short: appData.details?.description?.short || "",
            long: appData.details?.description?.long || "",
            whatsNew: "",
            featureBullets: appData.details?.description?.featureBullets || [],
          },
          appDetails: {
            version: appData.details?.appDetails?.version || "1.0.0",
            versionCode: 1,
            apkFileSizeMB: appData.details?.appDetails?.apkFileSizeMB || 0,
            ipaFileSizeMB: appData.details?.appDetails?.ipaFileSizeMB || 0,
            androidApk: appData.details?.appDetails?.androidApk || "",
            iosApk: appData.details?.appDetails?.iosApk || "",
          },
          media: {
            icon: appData.details?.media?.icon || "",
            banner: appData.details?.media?.banner || "",
            screenshots: appData.details?.media?.screenshots || [],
            promoVideoURL: appData.details?.media?.promoVideoURL || "",
          },
          links: {
            contactEmail: appData.details?.links?.contactEmail || "",
            privacyPolicyUrl: appData.details?.links?.privacyPolicyUrl || "",
            termsUrl: appData.details?.links?.termsUrl || "",
          },
          data: {
            collectsData: appData.details?.data?.collectsData,
            dataCollected: appData.details?.data?.dataCollected,
            sharesData: appData.details?.data?.sharesData,
            coppaCompliant: appData.details?.data?.coppaCompliant,
          },
        },

        status: {
          isActive: false,
          approval: { isApproved: false, approvedAt: "" },
          rejection: { isRejected: false, reason: "", rejectedAt: "" },
          suspension: { isSuspended: false, reason: "", suspendedAt: "" },
        },

        metrics: {
          downloads: 0,
          ratings: {
            totalReviews: 0,
            breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          },
        },

        community: { reviews: [], questions: [], reportedIssues: [] },

        discovery: {
          searchKeywords: [],
        },
      }),

      // Create New App
      createApp: async (appData = {}) => {
        set({ isLoading: true, error: null });
        try {
          const newApp = get().generateAppModel(appData);
          const appRef = await addDoc(collection(db, "apps"), {
            ...newApp,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

          await updateDoc(doc(db, "apps", appRef.id), { appId: appRef.id });

          const savedApp = { ...newApp, appId: appRef.id };
          set((state) => ({
            apps: [...state.apps, savedApp],
            selectedApp: savedApp,
            isLoading: false,
          }));
          return { success: true, appId: appRef.id };
        } catch (error) {
          console.error("Error creating app:", error);
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Fetch all apps by developer
      fetchDeveloperApps: async (developerId) => {
        set({ isLoading: true, error: null });
        try {
          const appsRef = collection(db, "apps");
          const q = query(
            appsRef,
            where("developer.developerId", "==", developerId)
          );
          const snapshot = await getDocs(q);

          // We use doc.id as the definitive appId, although the document body
          // should already contain it based on the create logic.
          const apps = snapshot.docs.map((doc) => ({
            ...doc.data(),
            appId: doc.id,
          }));
          set({ apps, isLoading: false });
          return { success: true, apps };
        } catch (error) {
          console.error("Error fetching developer apps:", error);
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Fetch single app by ID
      fetchAppById: async (appId) => {
        set({ isLoading: true, error: null });
        try {
          const docSnap = await getDoc(doc(db, "apps", appId));
          if (!docSnap.exists()) throw new Error("App not found");

          const app = { ...docSnap.data(), appId: docSnap.id }; // Ensure ID is present
          set({ selectedApp: app, isLoading: false });
          return { success: true, app };
        } catch (error) {
          console.error("Error fetching app by ID:", error);
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Update App
      updateApp: async (appId, updates) => {
        set({ isLoading: true, error: null });
        try {
          const docRef = doc(db, "apps", appId);
          await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });

          const updatedApp = {
            ...get().selectedApp,
            ...updates,
            updatedAt: new Date().toISOString(), // Use ISO string for consistency
          };
          set({ selectedApp: updatedApp, isLoading: false });
          return { success: true, app: updatedApp };
        } catch (error) {
          console.error("Error updating app:", error);
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Push App Update
      pushAppUpdate: async (appId, updatedApp) => {
        try {
          if (!appId || !updatedApp) {
            throw new Error("App ID and updated app object are required.");
          }

          // Increment versionCode
          const newVersionCode =
            (updatedApp.details.appDetails.versionCode || 0) + 1;

          // Prepare payload for Firestore
          const updatePayload = {
            ...updatedApp,
            details: {
              ...updatedApp.details,
              appDetails: {
                ...updatedApp.details.appDetails,
                versionCode: newVersionCode,
              },
            },
            updatedAt: serverTimestamp(),
          };

          // Update the document
          const docRef = doc(db, "apps", appId);
          await updateDoc(docRef, updatePayload);

          // Return updated object
          return {
            success: true,
            app: {
              ...updatedApp,
              details: {
                ...updatedApp.details,
                appDetails: {
                  ...updatedApp.details.appDetails,
                  versionCode: newVersionCode,
                },
              },
              updatedAt: new Date().toISOString(),
            },
          };
        } catch (error) {
          console.error("Error updating app:", error);
          return { success: false, error: error.message };
        }
      },

      // Delete App
      deleteApp: async (appId) => {
        if (!appId || typeof appId !== "string") {
          return { success: false, error: "Invalid appId" };
        }

        set({ isLoading: true, error: null });

        try {
          // Get app document
          const appRef = doc(db, "apps", appId);
          const appSnap = await getDoc(appRef);

          if (!appSnap.exists()) {
            throw new Error("App not found.");
          }

          const appData = appSnap.data();

          // Delete associated media files from appwrite bucket
          const media = appData?.details?.media || {};
          const screenshots = Array.isArray(media.screenshots)
            ? media.screenshots
            : [];

          const mediaFiles = [media.icon, media.banner, ...screenshots].filter(
            Boolean
          );

          for (const fileId of mediaFiles) {
            try {
              await deleteFile(fileId);
            } catch (err) {
              console.error("Failed to delete media file:", fileId);
            }
          }

          // Get user document of the developer and delete appId from their profile
          const developerUserId = appData?.developer?.userId;

          if (developerUserId) {
            const userRef = doc(db, "users", developerUserId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              const userData = userSnap.data();

              const apps = userData?.developerProfile?.apps || {};

              const updatedApps = {
                submittedAppIds: (apps.submittedAppIds || []).filter(
                  (id) => id !== appId
                ),
                publishedAppIds: (apps.publishedAppIds || []).filter(
                  (id) => id !== appId
                ),
                rejectedAppIds: (apps.rejectedAppIds || []).filter(
                  (id) => id !== appId
                ),
                suspendedAppIds: (apps.suspendedAppIds || []).filter(
                  (id) => id !== appId
                ),
              };

              await updateDoc(userRef, {
                "developerProfile.apps": updatedApps,
              });
            }
          }

          // Delete app document
          await deleteDoc(appRef);

          set((state) => ({
            apps: state.apps.filter((app) => app.appId !== appId),
            selectedApp:
              state.selectedApp?.appId === appId ? null : state.selectedApp,
            isLoading: false,
          }));

          return { success: true };
        } catch (error) {
          console.error("Error deleting app:", error);
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "devsrepo-apps",
      getStorage: () => localStorage,
      partialize: (state) => ({
        apps: state.apps,
        selectedApp: state.selectedApp,
      }),
    }
  )
);

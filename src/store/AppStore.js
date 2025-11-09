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
        publishedAt: serverTimestamp(),

        developer: {
          name: appData.developer?.name,
          developerId: appData.developer?.developerId,
          email: appData.developer?.email || "",
        },

        details: {
          name: appData.details?.name || "",
          type: appData.details?.type || "Mobile App",
          category: appData.details?.category || "Social",
          tags: appData.details?.tags || [],
          sourceCodeLink: appData.details?.sourceCodeLink || "",
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
          stage: "in-review",
          isApproved: false,
          rejection: { isRejected: false, reason: "", rejectedAt: "" },
          removal: { isRemoved: false, reason: "", removedAt: "" },
        },

        metrics: {
          downloads: 0,
          ratings: {
            average: 0,
            totalReviews: 0,
            breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          },
        },

        community: { reviews: [], questions: [], reportedIssues: [] },

        discovery: {
          searchKeywords: [],
          similarApps: [],
          trendingScore: 0,
          categoryRank: {},
          lastTrendingUpdate: "",
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
      pushAppUpdate: async (appId, versionData = {}) => {
        set({ isLoading: true, error: null });
        try {
          const currentApp = get().selectedApp;
          if (!currentApp) throw new Error("No app selected for update.");

          const docRef = doc(db, "apps", appId);
          const newWhatsNew =
            versionData.whatsNew ||
            currentApp.details.description.whatsNew ||
            "";

          const updatePayload = {
            "details.appDetails.version":
              versionData.version || currentApp.details.appDetails.version,
            "details.appDetails.versionCode":
              versionData.versionCode ||
              currentApp.details.appDetails.versionCode,
            "details.appDetails.releaseDate": serverTimestamp(),
            "details.description.whatsNew": newWhatsNew,
            updatedAt: serverTimestamp(),
          };

          await updateDoc(docRef, updatePayload);

          const now = new Date().toISOString();

          const updatedApp = {
            ...currentApp,
            details: {
              ...currentApp.details,
              appDetails: {
                ...currentApp.details.appDetails,
                ...versionData,
                releaseDate: now,
              },
              description: {
                ...currentApp.details.description,
                whatsNew: newWhatsNew,
              },
            },
            updatedAt: now,
          };

          set({ selectedApp: updatedApp, isLoading: false });
          return { success: true, app: updatedApp };
        } catch (error) {
          console.error("Error pushing app update:", error);
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Delete App
      deleteApp: async (appId) => {
        set({ isLoading: true, error: null });
        try {
          await deleteDoc(doc(db, "apps", appId));

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

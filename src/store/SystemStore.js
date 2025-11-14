import { create } from "zustand";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { getFileURL, deleteFile } from "../services/appwriteStorage";

export const useSystemStore = create((set, get) => ({
  userIds: [],
  developerIds: [],
  appIds: [],
  publishedAppIds: [],
  pendingAppIds: [],
  rejectedAppIds: [],
  suspendedAppIds: [],
  isListening: false,
  error: null,

  // Initialize Realtime Listeners
  startRealtimeSystem: () => {
    if (get().isListening) return;

    // Users Listener
    const usersUnsub = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const users = snapshot.docs.map((doc) => doc.id);
        const developers = snapshot.docs
          .filter((doc) => doc.data().developerProfile?.isDeveloper)
          .map((doc) => doc.id);

        set({ userIds: users, developerIds: developers });
      },
      (err) => set({ error: err.message })
    );

    // Apps Listener
    const appsUnsub = onSnapshot(
      collection(db, "apps"),
      (snapshot) => {
        const all = [];
        const published = [];
        const pending = [];
        const rejected = [];
        const suspended = [];

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const id = doc.id;

          all.push(id);

          if (
            data.status?.approval?.isApproved &&
            !data.status?.suspension?.isSuspended
          ) {
            published.push(id);
          } else if (data.status?.rejection?.isRejected) {
            rejected.push(id);
          } else if (data.status?.suspension?.isSuspended) {
            suspended.push(id);
          } else {
            // Everything else is pending/submitted
            pending.push(id);
          }
        });

        set({
          appIds: all,
          publishedAppIds: published,
          pendingAppIds: pending,
          rejectedAppIds: rejected,
          suspendedAppIds: suspended,
        });
      },
      (err) => set({ error: err.message })
    );

    set({ isListening: true });

    return () => {
      usersUnsub();
      appsUnsub();
      set({ isListening: false });
    };
  },

  // Fetch user details by ID
  getUserDetailsById: async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (!userDoc.exists()) return null;
      return { uid: userDoc.id, ...userDoc.data() };
    } catch (err) {
      set({ error: err.message });
      console.error("Error fetching user details:", err);
      return null;
    }
  },

  // Fetch app details by ID
  getAppDetailsById: async (appId) => {
    try {
      const appDoc = await getDoc(doc(db, "apps", appId));
      if (!appDoc.exists()) return null;

      const appData = { appId: appDoc.id, ...appDoc.data() };

      return appData;
    } catch (err) {
      set({ error: err.message });
      console.error("Error fetching app details:", err);
      return null;
    }
  },

  // Delete app
  deleteAppById: async (appId) => {
    try {
      const appDoc = await getDoc(doc(db, "apps", appId));
      if (!appDoc.exists()) {
        return { success: false, error: "App not found" };
      }

      const appData = appDoc.data();

      // Delete associated files from AppWrite
      const deletePromises = [];

      if (appData.media) {
        const media = appData.media;

        // Delete icon
        if (media.icon) {
          deletePromises.push(
            deleteFile(media.icon).catch((error) =>
              console.error("Error deleting icon:", error)
            )
          );
        }

        // Delete banner
        if (media.banner) {
          deletePromises.push(
            deleteFile(media.banner).catch((error) =>
              console.error("Error deleting banner:", error)
            )
          );
        }

        // Delete screenshots
        if (media.screenshots && media.screenshots.length > 0) {
          media.screenshots.forEach((screenshotId) => {
            deletePromises.push(
              deleteFile(screenshotId).catch((error) =>
                console.error("Error deleting screenshot:", error)
              )
            );
          });
        }
      }

      // Delete APK file
      if (appData.details?.appDetails?.androidApk) {
        deletePromises.push(
          deleteFile(appData.details.appDetails.androidApk).catch((error) =>
            console.error("Error deleting APK:", error)
          )
        );
      }

      // Wait for all file deletions to complete
      await Promise.all(deletePromises);

      // Delete the app document from Firestore
      await deleteDoc(doc(db, "apps", appId));

      // Remove the app from the local state
      set((state) => ({
        appIds: state.appIds.filter((id) => id !== appId),
        publishedAppIds: state.publishedAppIds.filter((id) => id !== appId),
        pendingAppIds: state.pendingAppIds.filter((id) => id !== appId),
        rejectedAppIds: state.rejectedAppIds.filter((id) => id !== appId),
        suspendedAppIds: state.suspendedAppIds.filter((id) => id !== appId),
      }));

      return { success: true };
    } catch (err) {
      set({ error: err.message });
      return { success: false, error: err.message };
    }
  },

  // Update app status
  updateAppStatus: async (appId, status, reason = "") => {
    try {
      const appRef = doc(db, "apps", appId);
      const appSnap = await getDoc(appRef);

      if (!appSnap.exists()) {
        return { success: false, error: "App not found" };
      }

      const updateData = {
        "status.approval.isApproved": false,
        "status.rejection.isRejected": false,
        "status.suspension.isSuspended": false,
        "status.rejection.reason": "",
        "status.suspension.reason": "",
      };

      const now = new Date();

      switch (status) {
        case "published":
          updateData["status.approval.isApproved"] = true;
          updateData["status.approval.approvedAt"] = now;
          updateData["status.rejection.isRejected"] = false;
          updateData["status.suspension.isSuspended"] = false;
          break;
        case "rejected":
          updateData["status.rejection.isRejected"] = true;
          updateData["status.rejection.rejectedAt"] = now;
          updateData["status.rejection.reason"] = reason;
          updateData["status.approval.isApproved"] = false;
          updateData["status.suspension.isSuspended"] = false;
          break;
        case "suspended":
          updateData["status.suspension.isSuspended"] = true;
          updateData["status.suspension.suspendedAt"] = now;
          updateData["status.suspension.reason"] = reason;
          updateData["status.approval.isApproved"] = false;
          updateData["status.rejection.isRejected"] = false;
          break;
        default:
          break;
      }

      updateData["status.updatedAt"] = now;

      await updateDoc(appRef, updateData);
      return { success: true };
    } catch (err) {
      set({ error: err.message });
      return { success: false, error: err.message };
    }
  },

  deleteUserById: async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      await deleteDoc(userDocRef);

      set((state) => ({
        userIds: state.userIds.filter((id) => id !== uid),
        developerIds: state.developerIds.filter((id) => id !== uid),
      }));

      return { success: true };
    } catch (err) {
      set({ error: err.message });
      return { success: false, error: err.message };
    }
  },

  setUserBanStatusById: async (uid, reason) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return { success: false, error: "User not found" };
      }

      const banStatus = userSnap.data().system?.banStatus?.isBanned || false;

      await updateDoc(userRef, {
        "system.banStatus.isBanned": !banStatus,
        "system.banStatus.reason": !banStatus ? reason : "",
      });
      return { success: true };
    } catch (err) {
      set({ error: err.message });
      return { success: false, error: err.message };
    }
  },

  setDevSuspensionStatusById: async (uid, reason) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return { success: false, error: "User not found" };
      }

      const suspensionStatus =
        userSnap.data().developerProfile?.suspendedStatus?.isSuspended || false;

      await updateDoc(userRef, {
        "developerProfile.suspendedStatus.isSuspended": !suspensionStatus,
        "developerProfile.suspendedStatus.reason": !suspensionStatus
          ? reason
          : "",
      });
      return { success: true };
    } catch (err) {
      set({ error: err.message });
      return { success: false, error: err.message };
    }
  },

  toggleDevVerifyStatus: async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return { success: false, error: "User not found" };
      }

      const devVerifyStatus =
        userSnap.data().developerProfile?.verifiedDeveloper || false;

      await updateDoc(userRef, {
        "developerProfile.verifiedDeveloper": !devVerifyStatus,
      });
      return { success: true };
    } catch (err) {
      set({ error: err.message });
      return { success: false, error: err.message };
    }
  },

  toggleAdminStatus: async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return { success: false, error: "User not found" };
      }

      const adminStatus = userSnap.data().system?.isAdmin || false;

      await updateDoc(userRef, {
        "system.isAdmin": !adminStatus,
      });
      return { success: true };
    } catch (err) {
      set({ error: err.message });
      return { success: false, error: err.message };
    }
  },

  clearSystemState: () =>
    set({
      userIds: [],
      developerIds: [],
      publishedAppIds: [],
      pendingAppIds: [],
      rejectedAppIds: [],
      suspendedAppIds: [],
      isListening: false,
      error: null,
    }),
}));

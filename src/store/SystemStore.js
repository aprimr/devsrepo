import { create } from "zustand";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { deleteFile } from "../services/appwriteStorage";

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

  // --- Realtime Listeners ---
  startRealtimeSystem: () => {
    if (get().isListening) return;

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

  // --- Fetch Details ---
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

  getAppDetailsById: async (appId) => {
    try {
      const appDoc = await getDoc(doc(db, "apps", appId));
      if (!appDoc.exists()) return null;
      return { appId: appDoc.id, ...appDoc.data() };
    } catch (err) {
      set({ error: err.message });
      console.error("Error fetching app details:", err);
      return null;
    }
  },

  // Delete App
  onDelete: async (app) => {
    try {
      const appRef = doc(db, "apps", app.appId);
      const appSnap = await getDoc(appRef);
      if (!appSnap.exists()) return { success: false, error: "App not found" };
      const appData = appSnap.data();

      // Delete media files from AppWrite
      const deletePromises = [];
      if (appData.media) {
        if (appData.media.icon)
          deletePromises.push(
            deleteFile(appData.media.icon).catch(console.error)
          );
        if (appData.media.banner)
          deletePromises.push(
            deleteFile(appData.media.banner).catch(console.error)
          );
        if (appData.media.screenshots?.length) {
          appData.media.screenshots.forEach((id) =>
            deletePromises.push(deleteFile(id).catch(console.error))
          );
        }
      }
      if (appData.details?.appDetails?.androidApk) {
        deletePromises.push(
          deleteFile(appData.details.appDetails.androidApk).catch(console.error)
        );
      }
      await Promise.all(deletePromises);

      // Delete Firestore doc
      await deleteDoc(appRef);

      // ***OPTIMIZED USER LOOKUP (Direct by userId)***
      const userRef = doc(db, "users", app.developer.userId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists())
        return { success: false, error: "User not found" };

      // Update user: remove app from all lists
      await updateDoc(userRef, {
        "developerProfile.apps.publishedAppIds": arrayRemove(app.appId),
        "developerProfile.apps.rejectedAppIds": arrayRemove(app.appId),
        "developerProfile.apps.suspendedAppIds": arrayRemove(app.appId),
        "developerProfile.apps.submittedAppIds": arrayRemove(app.appId),
      });

      // Remove from store
      set((state) => ({
        appIds: state.appIds.filter((id) => id !== app.appId),
        publishedAppIds: state.publishedAppIds.filter((id) => id !== app.appId),
        pendingAppIds: state.pendingAppIds.filter((id) => id !== app.appId),
        rejectedAppIds: state.rejectedAppIds.filter((id) => id !== app.appId),
        suspendedAppIds: state.suspendedAppIds.filter((id) => id !== app.appId),
      }));

      return { success: true };
    } catch (err) {
      console.error("Delete app error:", err);
      return { success: false, error: err.message };
    }
  },

  // Approve App
  onApprove: async (app) => {
    try {
      const appRef = doc(db, "apps", app.appId);
      const appSnap = await getDoc(appRef);
      if (!appSnap.exists()) return { success: false, error: "App not found" };

      // Update App document status
      await updateDoc(appRef, {
        "status.approval.isApproved": true,
        "status.approval.approvedAt": serverTimestamp(),
        "status.isActive": true,
      });

      // Get Uer
      const userRef = doc(db, "users", app.developer.userId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists())
        return { success: false, error: "User not found" };

      // Update user
      await updateDoc(userRef, {
        "developerProfile.apps.submittedAppIds": arrayRemove(app.appId),
        "developerProfile.apps.publishedAppIds": arrayUnion(app.appId),
        "developerProfile.metrics.totalPublishedApps": increment(1),
      });

      return { success: true };
    } catch (err) {
      console.error("Approve app error:", err);
      return { success: false, error: err.message };
    }
  },

  // Reject App
  onReject: async (app, reason) => {
    try {
      const appRef = doc(db, "apps", app.appId);
      const appSnap = await getDoc(appRef);
      if (!appSnap.exists()) return { success: false, error: "App not found" };

      // Update App document status
      await updateDoc(appRef, {
        "status.approval.isApproved": false,
        "status.suspension.isSuspended": false,
        "status.rejection.isRejected": true,
        "status.rejection.reason": reason,
        "status.rejection.rejectedAt": serverTimestamp(),
        "status.isActive": false,
      });

      // Find User
      const userRef = doc(db, "users", app.developer.userId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists())
        return { success: false, error: "User not found" };

      // Update user
      await updateDoc(userRef, {
        "developerProfile.apps.submittedAppIds": arrayRemove(app.appId),
        "developerProfile.apps.rejectedAppIds": arrayUnion(app.appId),
      });

      return { success: true };
    } catch (err) {
      console.error("Reject app error:", err);
      return { success: false, error: err.message };
    }
  },

  // Suspend App
  onSuspend: async (app, reason) => {
    try {
      const appRef = doc(db, "apps", app.appId);
      const appSnap = await getDoc(appRef);
      if (!appSnap.exists()) return { success: false, error: "App not found" };

      // Update App document status
      await updateDoc(appRef, {
        "status.approval.isApproved": false,
        "status.rejection.isRejected": false,
        "status.suspension.isSuspended": true,
        "status.suspension.reason": reason,
        "status.suspension.suspendedAt": serverTimestamp(),
        "status.isActive": false,
      });

      // Find User
      const userRef = doc(db, "users", app.developer.userId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists())
        return { success: false, error: "User not found" };

      // Update user
      await updateDoc(userRef, {
        "developerProfile.apps.submittedAppIds": arrayRemove(app.appId),
        "developerProfile.apps.publishedAppIds": arrayRemove(app.appId),
        "developerProfile.apps.suspendedAppIds": arrayUnion(app.appId),
        "developerProfile.metrics.totalPublishedApps": increment(-1),
      });

      return { success: true };
    } catch (err) {
      console.error("Suspend app error:", err);
      return { success: false, error: err.message };
    }
  },

  // Restore App
  onRestore: async (app) => {
    try {
      const appRef = doc(db, "apps", app.appId);
      const appSnap = await getDoc(appRef);
      if (!appSnap.exists()) return { success: false, error: "App not found" };

      // Update App document status (back to pending review)
      await updateDoc(appRef, {
        "status.approval.isApproved": false,
        "status.rejection.isRejected": false,
        "status.rejection.reason": "",
        "status.suspension.isSuspended": false,
        "status.suspension.reason": "",
        "status.isActive": false,
      });

      // get User
      const userRef = doc(db, "users", app.developer.userId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists())
        return { success: false, error: "User not found" };

      // Update user
      await updateDoc(userRef, {
        "developerProfile.apps.rejectedAppIds": arrayRemove(app.appId),
        "developerProfile.apps.suspendedAppIds": arrayRemove(app.appId),
        "developerProfile.apps.submittedAppIds": arrayUnion(app.appId),
      });

      return { success: true };
    } catch (err) {
      console.error("Restore app error:", err);
      return { success: false, error: err.message };
    }
  },

  // --- User/Admin Actions ---
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
      if (!userSnap.exists())
        return { success: false, error: "User not found" };
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
      if (!userSnap.exists())
        return { success: false, error: "User not found" };
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
      if (!userSnap.exists())
        return { success: false, error: "User not found" };
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
      if (!userSnap.exists())
        return { success: false, error: "User not found" };
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

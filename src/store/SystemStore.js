import { create } from "zustand";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

const SEARCH_FIELD = "username";

export const useSystemStore = create((set, get) => ({
  userIds: [],
  developerIds: [],
  publishedAppIds: [],
  pendingAppIds: [],
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
        const published = [];
        const pending = [];

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.status === "published") published.push(doc.id);
          else pending.push(doc.id);
        });

        set({ publishedAppIds: published, pendingAppIds: pending });
      },
      (err) => set({ error: err.message })
    );

    set({ isListening: true });

    // Return unsubscribe function
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

  // Delete user by ID
  deleteUserById: async (uid) => {
    try {
      // Delete the user document from Firestore
      const userDocRef = doc(db, "users", uid);
      await deleteDoc(userDocRef);

      // Remove the user from the local state
      set((state) => ({
        userIds: state.userIds.filter((id) => id !== uid),
        developerIds: state.developerIds.filter((id) => id !== uid),
      }));

      return {
        success: true,
      };
    } catch (err) {
      set({ error: err.message });
      return { success: false, error: err.message };
    }
  },

  // Ban or Unban user by ID
  setUserBanStatusById: async (uid, reason) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.error("User not found");
        return;
      }

      const banStatus = userSnap.data().system?.banStatus?.isBanned || false;

      await updateDoc(userRef, {
        "system.banStatus.isBanned": !banStatus,
        "system.banStatus.reason": !banStatus ? reason : "",
      });
      return {
        success: true,
      };
    } catch (err) {
      set({ error: err.message });
      return { success: false, error: err.message };
    }
  },

  // Suspend developer by ID
  setDevSuspensionStatusById: async (uid, reason) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.error("User not found");
        return;
      }

      const suspensionStatus =
        userSnap.data().developerProfile?.suspendedStatus?.isSuspended || false;

      await updateDoc(userRef, {
        "developerProfile.suspendedStatus.isSuspended": !suspensionStatus,
        "developerProfile.suspendedStatus.reason": !suspensionStatus
          ? reason
          : "",
      });
      return {
        success: true,
      };
    } catch (err) {
      set({ error: err.message });
      return { success: false, error: err.message };
    }
  },

  // Dev verification status
  toggleDevVerifyStatus: async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.error("User not found");
        return;
      }

      const devVerifyStatus =
        userSnap.data().developerProfile.verifiedDeveloper;

      await updateDoc(userRef, {
        "developerProfile.verifiedDeveloper": !devVerifyStatus,
      });
      return {
        success: true,
      };
    } catch (err) {
      set({ error: err.message });
      return { success: false, error: err.message };
    }
  },

  // Toggle Admin Status
  toggleAdminStatus: async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.error("User not found");
        return;
      }

      const adminStatus = userSnap.data().system?.isAdmin;

      await updateDoc(userRef, {
        "system.isAdmin": !adminStatus,
      });
      return {
        success: true,
      };
    } catch (err) {
      set({ error: err.message });
      return { success: false, error: err.message };
    }
  },

  // Clear system state
  clearSystemState: () =>
    set({
      userIds: [],
      developerIds: [],
      publishedAppIds: [],
      pendingAppIds: [],
      isListening: false,
      error: null,
    }),
}));

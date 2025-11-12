import { create } from "zustand";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  getDocs,
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

  // Search for UIDs
  searchUserIdsByTerm: async (term) => {
    if (!term) return [];

    const lowerCaseTerm = term.toLowerCase();

    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where(SEARCH_FIELD, ">=", lowerCaseTerm),
      where(SEARCH_FIELD, "<=", lowerCaseTerm + "\uf8ff")
    );

    try {
      const snapshot = await getDocs(q);

      const resultIds = snapshot.docs.map((doc) => doc.id);

      return resultIds.slice(0, 50);
    } catch (err) {
      set({ error: err.message });
      console.error("Error executing server search:", err);
      return [];
    }
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

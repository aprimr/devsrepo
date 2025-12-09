import { db } from "../firebase/config";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  increment,
} from "firebase/firestore";
import { calculateRating } from "../utils/calculateRating";
import { toast } from "sonner";

// Fetch verified developers
export const fetchDevelopers = async () => {
  try {
    const snap = await getDocs(collection(db, "users"));

    const verified = [];
    const unverified = [];
    const admins = [];

    snap.docs.forEach((doc) => {
      const data = doc.data();
      const devProf = data.developerProfile;

      // Must be developer
      if (!devProf || !devProf.isDeveloper) return;

      // Dont include suspended developers
      if (devProf.suspendedStatus?.isSuspended) return;

      // Index Score Calculation
      const published = devProf.apps?.publishedAppIds?.length || 0;
      const rejected = devProf.apps?.rejectedAppIds?.length || 0;
      const suspendedApps = devProf.apps?.suspendedAppIds?.length || 0;

      const score = published - rejected - suspendedApps;

      const developerObj = {
        id: doc.id,
        ...data,
        rankingScore: score,
      };

      // Admin
      if (data.system?.isAdmin) {
        admins.push(developerObj);
        return;
      }

      // First Verified if space is empty then include Unverified also
      if (devProf.verifiedDeveloper) verified.push(developerObj);
      else unverified.push(developerObj);
    });

    // Sort verified & unverified
    verified.sort((a, b) => b.rankingScore - a.rankingScore);
    unverified.sort((a, b) => b.rankingScore - a.rankingScore);

    // If verified < 3 → push unverified
    while (verified.length < 100 && unverified.length > 0) {
      verified.push(unverified.shift());
    }

    // Merge Arrays
    let finalList = [...admins, ...verified, ...unverified];

    // Limit to 100 developers
    return finalList.slice(0, 100);
  } catch (error) {
    return [];
  }
};

// Fetch user by id
export const fetchUserById = async (userId) => {
  if (!userId) return { success: false, developer: null };

  try {
    const userRef = doc(db, "users", userId);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      return { success: false, developer: null };
    }

    return { success: true, developer: snapshot.data() };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, developer: null };
  }
};

// Fetch developer by devId
export const fetchDeveloperbyDevID = async (developerId) => {
  if (!developerId) return null;

  try {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("developerProfile.developerId", "==", developerId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const developerDoc = querySnapshot.docs[0];
    return { success: true, developer: { ...developerDoc.data() } };
  } catch (error) {
    return null;
  }
};

// Fetch app by id
export const fetchAppbyID = async (appId) => {
  if (!appId) return { success: false, app: null };

  try {
    const appsRef = collection(db, "apps");
    const q = query(appsRef, where("appId", "==", appId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return { success: false, app: null };

    const appDoc = querySnapshot.docs[0];
    return { success: true, app: { id: appDoc.id, ...appDoc.data() } };
  } catch (error) {
    console.error("Error fetching app by ID:", error);
    return { success: false, app: null };
  }
};

// Fetch top most downloaded apps
export const fetchMostDownloadedApps = async () => {
  try {
    const appsRef = collection(db, "apps");
    const querySnapshot = await getDocs(appsRef);

    const apps = querySnapshot.docs
      .map((doc) => doc.data())
      .filter((app) => app.status?.isActive && app.status?.approval?.isApproved)
      .sort((a, b) => (b.metrics?.downloads || 0) - (a.metrics?.downloads || 0))
      .slice(0, 15);

    return { success: true, apps };
  } catch (error) {
    console.error("Error fetching most downloaded apps:", error);
    toast.error("Failed to fetch most downloaded apps");
    return { success: false, apps: [] };
  }
};

// Fetch apps with most reviews
export const fetchMostReviewedApps = async () => {
  try {
    const appsRef = collection(db, "apps");
    const querySnapshot = await getDocs(appsRef);

    const apps = querySnapshot.docs
      .map((doc) => doc.data())
      .filter((app) => app.status?.isActive && app.status?.approval?.isApproved)
      .sort(
        (a, b) =>
          (calculateRating(b.metrics?.ratings?.breakdown) || 0) -
          (calculateRating(a.metrics?.ratings?.breakdown) || 0)
      )
      .slice(0, 15);

    return { success: true, apps };
  } catch (error) {
    console.error("Error fetching most reviewed apps:", error);
    toast.error("Failed to fetch most reviewed apps");
    return { success: false, apps: [] };
  }
};

// Fetch new apps
export const fetchNewApps = async () => {
  try {
    const appsRef = collection(db, "apps");
    const q = query(appsRef, orderBy("createdAt", "desc"), limit(50));
    const querySnapshot = await getDocs(q);

    let apps = querySnapshot.docs.map((doc) => doc.data());

    apps = apps.filter(
      (app) => app.status?.isActive && app.status?.approval?.isApproved
    );

    apps = apps.slice(0, 15);

    return {
      success: true,
      apps,
    };
  } catch (error) {
    toast.error("Failed to fetch new apps");
    return {
      success: false,
      apps: [],
    };
  }
};

// Fetch All Apps (fetch app stream)
export const appsStream = async (onChunk, batchSize = 10) => {
  try {
    const appsRef = collection(db, "apps");
    const snapshot = await getDocs(appsRef);

    const batch = [];
    const addedAppIds = new Set();

    for (let i = 0; i < snapshot.docs.length; i++) {
      const doc = snapshot.docs[i];
      const app = doc.data();
      const appId = app.appId || doc.id;

      // Skip duplicates
      if (addedAppIds.has(appId)) continue;
      addedAppIds.add(appId);

      const s = app.status;
      if (!s?.isActive || !s?.approval?.isApproved) continue;

      // determine app rank
      const breakdown = app.metrics?.ratings?.breakdown;
      const rating = calculateRating(breakdown);
      const downloads = app.metrics?.downloads;
      const safeDownloads = downloads > 0 ? downloads : 1;
      const score = rating * 0.7 + Math.log(safeDownloads) * 0.3;

      batch.push({ ...app, appId, rating, score });

      if (batch.length >= batchSize || i === snapshot.docs.length - 1) {
        onChunk([...batch]);
        batch.length = 0;
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error fetching apps:", error);
    return { success: false };
  }
};

// Fetch Apps By Type
export const fetchAppsByType = async (type) => {
  if (!type) {
    console.error("Type is required to fetch apps");
    return { success: false, apps: [] };
  }

  try {
    const appsRef = collection(db, "apps");
    const q = query(
      appsRef,
      where("details.type", "==", type),
      where("status.isActive", "==", true),
      where("status.approval.isApproved", "==", true)
    );

    const snapshot = await getDocs(q);
    const apps = snapshot.docs.map((doc) => ({ ...doc.data() }));

    return { success: true, apps };
  } catch (error) {
    console.error("Failed to fetch apps by type:", error);
    toast?.error?.("Failed to fetch apps");
    return { success: false, apps: [] };
  }
};

// Fetch details of a single app
export const fetchAppDetails = async (appId) => {};

// Add review
export const addReview = async (appId, review) => {};

// Increase download count
export const incrementDownload = async (appId) => {
  if (!appId) {
    return { success: false };
  }

  try {
    const appRef = doc(db, "apps", appId);

    await updateDoc(appRef, {
      "metrics.downloads": increment(1),
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to increment download:", error);
    toast.error("Failed to increment download count");
    return { success: false, error: error.message };
  }
};

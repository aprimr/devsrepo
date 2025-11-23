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
} from "firebase/firestore";
import { calculateRating } from "../utils/calculateRating";

// Fetch all apps
export const fetchAllApps = async () => {};

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
  if (!appId) return null;

  try {
    const usersRef = collection(db, "apps");
    const q = query(usersRef, where("appId", "==", appId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const appDoc = querySnapshot.docs[0];
    return { success: true, app: { ...appDoc.data() } };
  } catch (error) {
    return null;
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

// Fetch details of a single app
export const fetchAppDetails = async (appId) => {};

// Add review
export const addReview = async (appId, review) => {};

// Increase download count
export const downloadApp = async (appId) => {};

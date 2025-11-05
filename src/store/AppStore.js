const appModel = {
  appId: "",
  createdAt: "",
  updatedAt: "",
  publishedAt: "",

  // 🔹 Developer Info
  developer: {
    developerId: "",
    name: "",
    avatarUrl: "",
    email: "",
  },

  // 🔹 Main App Details
  details: {
    name: "",
    type: "Mobile App", // Mobile App | UI Clone | Tools | Game | Template
    category: "Social", // Social | Productivity | Communication | Shopping | Entertainment | Education | Health & Fitness | Utilities | Other
    tags: [], // keywords for search
    sourceCodeLink: "",
    hasAds: false,
    inAppPurchases: false,

    description: {
      short: "",
      long: "",
      whatsNew: "",
      featureBullets: [],
    },
    currentVersion: {
      version: "1.0.0",
      versionCode: 1,
      fileSizeMB: 0,
      androidApk: "",
      iosApk: "",
      releaseDate: "",
      permissions: [],
    },

    media: {
      icon: "",
      screenshots: [],
      promoVideoURL: "",
    },

    links: {
      website: "",
      contactEmail: "",
      privacyPolicyUrl: "",
      termsUrl: "",
    },
  },

  // 🔹 Publish & Moderation Status
  status: {
    stage: "in-review", // inReview | approved | rejected | removed

    isApproved: false, // true only when approved and visible to users

    rejection: {
      isRejected: false,
      reason: "",
      rejectedAt: "",
    },

    removal: {
      isRemoved: false,
      reason: "",
      removedAt: "",
    },
  },

  // 🔹 Metrics & Analytics
  metrics: {
    downloads: 0,
    ratings: {
      average: 0,
      totalReviews: 0,
      breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    },
  },

  // 🔹 User Feedback & Community
  community: {
    reviews: [
      // {
      //   userId: "",
      //   userName: "",
      //   userAvatar: "",
      //   rating: 5,
      //   comment: "",
      //   createdAt: "",
      //   helpfulCount: 0,
      //   developerReply: {
      //     comment: "",
      //     createdAt: "",
      //   },
      // },
    ],
    questions: [
      // {
      //   userId: "",
      //   question: "",
      //   createdAt: "",
      //   answers: [
      //     {
      //       userId: "",
      //       answer: "",
      //       createdAt: "",
      //       isDeveloper: false,
      //     },
      //   ],
      // },
    ],
    reportedIssues: [
      // {
      //   userId: "",
      //   type: "crash", // crash | malware | spam | inappropriate | other
      //   description: "",
      //   createdAt: "",
      //   resolved: false,
      // },
    ],
  },

  // 🔹 Discovery / SEO
  discovery: {
    searchKeywords: [],
    similarApps: [],
    trendingScore: 0,
    categoryRank: {},
    lastTrendingUpdate: "",
  },
};

export const winPosts = [
  {
    id: "potholes",
    project: "POTHOLES",
    event: "Drexel Senior Design Championship",
    result: "1st place",
    description:
      "Real-time road hazard detection with computer vision and geotagged reports.",
    detail: null,
    technologies: [],
    author: "Drexel University School of Engineering",
    embedUrl:
      "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7337936873501192192?collapsed=1",
    postUrl:
      "https://www.linkedin.com/feed/update/urn:li:activity:7337936874633678851/",
    linkLabel: "Drexel’s official announcement",
  },
  {
    id: "saving-spree",
    project: "SavingSpree",
    event: "DragonHacks",
    result: "Winning team",
    description:
      "A budgeting app that finds savings opportunities around calendar events.",
    detail:
      "We built an Android and iOS app with React and Expo, using spending predictions to suggest time for budget-friendly habits.",
    technologies: ["React / Expo", "Flask", "Machine learning"],
    author: "Kai Thompson",
    embedUrl: null,
    postUrl:
      "https://www.linkedin.com/feed/update/urn:li:activity:7323708122835947521/",
    linkLabel: "My LinkedIn repost",
  },
  {
    id: "syncsphere",
    project: "SyncSphere Console",
    event: "Philly CodeFest",
    result: "Winning team",
    description:
      "An AI-assisted event planner that brings distributed teams together.",
    detail:
      "Our project recommended shared events for remote teams, combining employee clustering with event search and machine learning.",
    technologies: ["DBSCAN", "SerpAPI", "XGBoost"],
    author: "Kai Thompson",
    embedUrl: null,
    postUrl:
      "https://www.linkedin.com/feed/update/urn:li:activity:7306485945883590656/",
    linkLabel: "My LinkedIn repost",
  },
] as const;

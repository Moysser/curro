// services/applications.service.js
const STORAGE_KEY = "curro-job-tracker";

export const applicationsService = {
  list: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  statuses: () => ["Applied", "Interview", "Offer", "Rejected"],

  create: (data) => {
    const now = Date.now();
    const item = {
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...data,
    };
    const next = [item, ...applicationsService.list()];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return item;
  },

  update: (id, patch) => {
    const now = Date.now();
    const next = applicationsService
      .list()
      .map((x) => (x.id !== id ? x : { ...x, ...patch, updatedAt: now }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next.find((x) => x.id === id);
  },

  remove: (id) => {
    const next = applicationsService.list().filter((x) => x.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  },

  resetAndSeedDemo: () => {
    localStorage.removeItem(STORAGE_KEY);
    const seeds = [
      {
        company: "Northstar Labs",
        role: "Junior Developer",
        location: "Manchester",
        status: "Applied",
        appliedDate: "2026-01-26",
        notes: "Follow up next week.",
      },
      {
        company: "River & Co.",
        role: "Admin Officer",
        location: "Greater Manchester",
        status: "Interview",
        appliedDate: "2026-01-19",
        notes: "Prepare STAR examples.",
      },
      {
        company: "BrightBridge Tech",
        role: "Data Engineer",
        location: "Manchester",
        status: "Rejected",
        appliedDate: "2025-12-31",
        notes: "Ask for feedback.",
      },
    ];
    seeds.forEach(applicationsService.create);
  },
};

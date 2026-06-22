/** Mock data shaped like App Store Connect + Play Developer API responses */

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function genSeries(days, base, variance) {
  return Array.from({ length: days }, (_, i) => {
    const date = daysAgo(days - 1 - i);
    const noise = Math.sin(i / 3) * variance + Math.random() * variance * 0.4;
    const ios = Math.round(base * 0.55 + noise);
    const android = Math.round(base * 0.45 + noise * 0.8);
    return {
      date,
      appStoreNew: ios,
      appStoreRedownloads: Math.round(ios * 0.12),
      appStoreUpdates: Math.round(ios * 0.08),
      playNewInstalls: android,
      playUninstalls: Math.round(android * 0.06),
      netInstalls: ios + android - Math.round(android * 0.06),
    };
  });
}

export const LAST_SYNCED = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();

export const DATE_PRESETS = ["7d", "30d", "90d", "1yr"];

export const KPI_METRICS = [
  {
    id: "downloads",
    label: "Total Downloads",
    value: 284_920,
    change: 12.4,
    sparkline: [42, 48, 45, 52, 58, 55, 62, 68, 64, 72, 78, 84],
    accent: "primary",
    stores: ["apple", "play"],
    source: "units + installs",
  },
  {
    id: "active",
    label: "Active Install Base",
    value: 198_440,
    change: 3.1,
    sparkline: [88, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100],
    accent: "green",
    stores: ["apple", "play"],
    source: "device installs",
  },
  {
    id: "crash",
    label: "Crash-Free Rate",
    value: 99.62,
    change: 0.18,
    suffix: "%",
    sparkline: [99.1, 99.2, 99.3, 99.4, 99.5, 99.5, 99.6, 99.6, 99.6, 99.6, 99.6, 99.62],
    accent: "red",
    stores: ["apple"],
    source: "diagnostics API",
    meta: "142 crashes · 891 users",
  },
  {
    id: "rating",
    label: "Average Rating",
    value: 4.72,
    change: 0.06,
    sparkline: [4.6, 4.62, 4.63, 4.65, 4.66, 4.67, 4.68, 4.69, 4.7, 4.71, 4.71, 4.72],
    accent: "orange",
    stores: ["apple", "play"],
    source: "reviews API",
    meta: "12,840 reviews",
  },
  {
    id: "version",
    label: "Version Adoption",
    value: 78.4,
    change: 14.2,
    suffix: "%",
    sparkline: [52, 55, 58, 61, 64, 66, 68, 70, 72, 74, 76, 78.4],
    accent: "violet",
    stores: ["apple", "play"],
    source: "version distribution",
    meta: "v2.3.1 latest",
  },
];

export const DOWNLOADS_SERIES = genSeries(30, 1200, 280);

export const VERSION_RELEASES = [
  { date: daysAgo(22), version: "v2.3.0" },
  { date: daysAgo(8), version: "v2.3.1" },
];

export const REVENUE_SERIES = DOWNLOADS_SERIES.map((d) => ({
  date: d.date,
  appStoreGross: Math.round(d.appStoreNew * 2.4 + 800),
  appStoreNet: Math.round((d.appStoreNew * 2.4 + 800) * 0.7),
  playGross: Math.round(d.playNewInstalls * 1.9 + 600),
  playNet: Math.round((d.playNewInstalls * 1.9 + 600) * 0.85),
}));

export const REVENUE_BREAKDOWN = {
  appStore: [
    { name: "Subscriptions", value: 42, color: "#0A84FF" },
    { name: "In-App Purchases", value: 31, color: "#64B5FF" },
    { name: "Paid Downloads", value: 27, color: "#A8D4FF" },
  ],
  playStore: [
    { name: "Subscriptions", value: 38, color: "#30D158" },
    { name: "In-App Purchases", value: 35, color: "#6EE7A0" },
    { name: "Paid Downloads", value: 27, color: "#B8F0D0" },
  ],
};

export const REVENUE_TABLE = [
  {
    period: "This week",
    appGross: 12_840,
    appNet: 8_988,
    playGross: 9_420,
    playNet: 8_007,
  },
  {
    period: "Last week",
    appGross: 11_290,
    appNet: 7_903,
    playGross: 8_880,
    playNet: 7_548,
  },
  {
    period: "This month",
    appGross: 28_440,
    appNet: 19_908,
    playGross: 19_850,
    playNet: 16_872,
  },
];

export const VERSION_ROWS = [
  {
    version: "v2.3.1",
    releaseDate: daysAgo(8),
    ios: 92_400,
    android: 63_200,
    adoption: 78.4,
    rating: 4.8,
    crashes: 12,
    status: "LATEST",
  },
  {
    version: "v2.3.0",
    releaseDate: daysAgo(22),
    ios: 18_200,
    android: 12_800,
    adoption: 14.2,
    rating: 4.7,
    crashes: 28,
    status: "STABLE",
  },
  {
    version: "v2.2.4",
    releaseDate: daysAgo(45),
    ios: 8_400,
    android: 5_900,
    adoption: 5.1,
    rating: 4.6,
    crashes: 41,
    status: "DEPRECATED",
  },
  {
    version: "v2.2.0-beta",
    releaseDate: daysAgo(60),
    ios: 1_200,
    android: 890,
    adoption: 0.8,
    rating: 4.2,
    crashes: 61,
    status: "BETA",
  },
];

export const OS_DISTRIBUTION = {
  ios: [
    { name: "iOS 18", value: 52 },
    { name: "iOS 17", value: 34 },
    { name: "iOS 16", value: 11 },
    { name: "Older", value: 3 },
  ],
  android: [
    { name: "Android 15", value: 28 },
    { name: "Android 14", value: 38 },
    { name: "Android 13", value: 22 },
    { name: "Android 12", value: 9 },
    { name: "Older", value: 3 },
  ],
};

export const CRASH_TREND = genSeries(30, 8, 4).map((d) => ({
  date: d.date,
  crashes: Math.max(2, Math.round(8 + Math.random() * 6)),
  crashFree: 99.2 + Math.random() * 0.5,
}));

export const CRASH_REPORTS = [
  {
    type: "EXC_BAD_ACCESS",
    users: 312,
    occurrences: 891,
    version: "v2.3.1",
    os: "iOS 18.2",
    firstSeen: daysAgo(6),
    lastSeen: daysAgo(0),
    status: "Investigating",
    category: "Crashes",
  },
  {
    type: "Hang on main thread",
    users: 89,
    occurrences: 142,
    version: "v2.3.0",
    os: "iOS 17.6",
    firstSeen: daysAgo(14),
    lastSeen: daysAgo(1),
    status: "Open",
    category: "Hangs",
  },
  {
    type: "Disk write threshold",
    users: 44,
    occurrences: 67,
    version: "v2.3.1",
    os: "iOS 18.1",
    firstSeen: daysAgo(3),
    lastSeen: daysAgo(0),
    status: "Open",
    category: "Disk Writes",
  },
  {
    type: "High energy impact",
    users: 28,
    occurrences: 38,
    version: "v2.2.4",
    os: "iOS 16.7",
    firstSeen: daysAgo(20),
    lastSeen: daysAgo(4),
    status: "Resolved",
    category: "Energy Impact",
  },
];

export const RATING_DISTRIBUTION = {
  appStore: [62, 18, 8, 6, 6],
  playStore: [58, 20, 10, 7, 5],
};

export const RATING_TREND = genSeries(30, 4.65, 0.08).map((d, i) => ({
  date: d.date,
  appStore: 4.6 + i * 0.004 + Math.random() * 0.02,
  playStore: 4.55 + i * 0.003 + Math.random() * 0.02,
}));

export const RECENT_REVIEWS = [
  {
    store: "apple",
    stars: 5,
    title: "Game changer for our clinic",
    snippet: "Helix streamlined our entire onboarding workflow...",
    version: "v2.3.1",
    country: "GH",
    date: daysAgo(1),
    replied: true,
  },
  {
    store: "play",
    stars: 4,
    title: "Great app, minor bugs",
    snippet: "Works well overall. Occasional sync delay on older devices.",
    version: "v2.3.0",
    country: "NG",
    date: daysAgo(2),
    replied: false,
  },
  {
    store: "apple",
    stars: 5,
    title: "Excellent support",
    snippet: "The team responded within hours to our setup questions.",
    version: "v2.3.1",
    country: "KE",
    date: daysAgo(3),
    replied: true,
  },
  {
    store: "play",
    stars: 3,
    title: "Needs offline mode",
    snippet: "Would love better offline support in rural areas.",
    version: "v2.2.4",
    country: "TZ",
    date: daysAgo(4),
    replied: false,
  },
];

export const GEO_COUNTRIES = [
  { rank: 1, country: "Ghana", lat: 7.9, lng: -1.0, ios: 42_800, android: 38_200, revenue: 12_400, rating: 4.8 },
  { rank: 2, country: "Nigeria", lat: 9.1, lng: 7.5, ios: 28_400, android: 31_600, revenue: 9_800, rating: 4.6 },
  { rank: 3, country: "Kenya", lat: -0.02, lng: 37.9, ios: 18_200, android: 14_800, revenue: 6_200, rating: 4.7 },
  { rank: 4, country: "South Africa", lat: -28.5, lng: 25.5, ios: 12_400, android: 11_200, revenue: 5_400, rating: 4.5 },
  { rank: 5, country: "United States", lat: 39.5, lng: -98.0, ios: 8_900, android: 4_200, revenue: 4_800, rating: 4.9 },
  { rank: 6, country: "United Kingdom", lat: 54.5, lng: -2.5, ios: 6_200, android: 3_100, revenue: 3_200, rating: 4.7 },
  { rank: 7, country: "Tanzania", lat: -6.3, lng: 34.9, ios: 5_800, android: 6_400, revenue: 1_900, rating: 4.4 },
  { rank: 8, country: "Uganda", lat: 1.4, lng: 32.3, ios: 4_600, android: 5_200, revenue: 1_600, rating: 4.5 },
];

export const GEO_REGIONS = [
  { name: "Africa", downloads: 168_400, revenue: 38_200 },
  { name: "Americas", downloads: 24_800, revenue: 12_400 },
  { name: "Europe", downloads: 18_600, revenue: 9_800 },
  { name: "Asia Pacific", downloads: 12_400, revenue: 6_200 },
];

export const DEVICE_APPLE = [
  { name: "iPhone", value: 72 },
  { name: "iPad", value: 18 },
  { name: "Mac", value: 8 },
  { name: "Vision Pro", value: 2 },
];

export const DEVICE_ANDROID_TOP = [
  { model: "Samsung Galaxy A54", installs: 18_400 },
  { model: "Samsung Galaxy S23", installs: 12_800 },
  { model: "Google Pixel 8", installs: 8_200 },
  { model: "Tecno Spark 20", installs: 7_600 },
  { model: "Infinix Note 30", installs: 6_400 },
];

export const SCREEN_SIZES = [
  { size: "6.1–6.5\"", value: 42 },
  { size: "6.6–6.9\"", value: 28 },
  { size: "5.5–6.0\"", value: 18 },
  { size: "Tablet", value: 12 },
];

export const RAM_DISTRIBUTION = [
  { ram: "8 GB+", value: 34 },
  { ram: "6 GB", value: 38 },
  { ram: "4 GB", value: 22 },
  { ram: "< 4 GB", value: 6 },
];

export function filterByDateRange(series, range, store) {
  const days = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365;
  const sliced = series.slice(-days);
  if (store === "apple") {
    return sliced.map((d) => ({
      ...d,
      playNewInstalls: 0,
      playUninstalls: 0,
    }));
  }
  if (store === "play") {
    return sliced.map((d) => ({
      ...d,
      appStoreNew: 0,
      appStoreRedownloads: 0,
    }));
  }
  return sliced;
}

export function formatNumber(n, opts = {}) {
  const { prefix = "", suffix = "", decimals = 0 } = opts;
  const val =
    decimals > 0
      ? n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : n.toLocaleString();
  return `${prefix}${val}${suffix}`;
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatSyncTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

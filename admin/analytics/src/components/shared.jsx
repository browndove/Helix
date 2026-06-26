import {
  BarChart3,
  Download,
  Package,
  AlertTriangle,
  Star,
  Globe,
  Smartphone,
  Settings,
  LayoutDashboard,
  Play,
  TabletSmartphone,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    label: "Analytics",
    items: [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "downloads", label: "Downloads & Installs", icon: Download },
      { id: "versions", label: "Versions", icon: Package },
      { id: "crashes", label: "Crashes & Diagnostics", icon: AlertTriangle },
      { id: "ratings", label: "Ratings & Reviews", icon: Star },
      { id: "geography", label: "Geography", icon: Globe },
      { id: "devices", label: "Devices", icon: Smartphone },
    ],
  },
  {
    label: "Configuration",
    items: [{ id: "settings", label: "API Configuration", icon: Settings }],
  },
];

export function StoreBadge({ store }) {
  const Icon = store === "apple" ? TabletSmartphone : Play;
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[var(--fill-tertiary)] text-text-secondary">
      <Icon size={10} strokeWidth={1.5} />
    </span>
  );
}

export function StatDelta({ change }) {
  const up = change >= 0;
  return (
    <span className={`stat-delta ${up ? "up" : "down"}`}>
      {up ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
    </span>
  );
}

/** @deprecated Use StatDelta */
export function TrendArrow({ change }) {
  return <StatDelta change={change} />;
}

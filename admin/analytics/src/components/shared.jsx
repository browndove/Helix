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
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-black/5 text-text-secondary">
      <Icon size={10} strokeWidth={2.5} />
    </span>
  );
}

export function TrendArrow({ change }) {
  const up = change >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums ${
        up ? "text-accent-green" : "text-accent-red"
      }`}
    >
      {up ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
    </span>
  );
}

import { useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import TitleBar from "./components/TitleBar";
import FreshnessBanner from "./components/FreshnessBanner";
import FilterBar from "./components/FilterBar";
import SlideIn from "./components/ui/SlideIn";
import OverviewPage from "./pages/OverviewPage";
import DownloadsPage from "./pages/DownloadsPage";
import VersionsPage from "./pages/VersionsPage";
import CrashesPage from "./pages/CrashesPage";
import RatingsPage from "./pages/RatingsPage";
import GeographyPage from "./pages/GeographyPage";
import DevicesPage from "./pages/DevicesPage";
import SettingsPage from "./pages/SettingsPage";

const PAGE_TITLES = {
  overview: "Overview",
  downloads: "Downloads & Installs",
  versions: "Versions",
  crashes: "Crashes & Diagnostics",
  ratings: "Ratings & Reviews",
  geography: "Geography",
  devices: "Devices",
  settings: "API Configuration",
};

const DEFAULT_FILTERS = {
  dateRange: "30d",
  store: "all",
  version: "all",
  region: "all",
};

export default function App() {
  const [activePage, setActivePage] = useState("overview");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const page = useMemo(() => {
    switch (activePage) {
      case "downloads":
        return <DownloadsPage filters={filters} />;
      case "versions":
        return <VersionsPage filters={filters} />;
      case "crashes":
        return <CrashesPage filters={filters} />;
      case "ratings":
        return <RatingsPage filters={filters} />;
      case "geography":
        return <GeographyPage filters={filters} />;
      case "devices":
        return <DevicesPage filters={filters} />;
      case "settings":
        return <SettingsPage />;
      default:
        return <OverviewPage filters={filters} />;
    }
  }, [activePage, filters]);

  const showFilters = activePage !== "settings";

  return (
    <div className="flex min-h-screen bg-secondary font-sans">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TitleBar title={PAGE_TITLES[activePage] || "Analytics"} />

        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-page space-y-5">
            <SlideIn>
              <FreshnessBanner />
            </SlideIn>
            {showFilters && (
              <SlideIn delay={0.05}>
                <FilterBar filters={filters} onChange={setFilters} />
              </SlideIn>
            )}
            <SlideIn delay={0.1}>{page}</SlideIn>
          </div>
        </main>
      </div>
    </div>
  );
}

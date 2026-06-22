import { Download, RefreshCw } from "lucide-react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { DATE_PRESETS } from "../data/mockData";

export default function FilterBar({ filters, onChange }) {
  const selectClass =
    "rounded-full border-0 bg-tertiary px-3 py-1.5 text-xs font-semibold text-text-primary focus:ring-2 focus:ring-accent-primary/30";

  return (
    <Card hover={false} padding="p-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-full bg-tertiary p-1">
          {DATE_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange({ ...filters, dateRange: p })}
              className={
                filters.dateRange === p ? "filter-pill filter-pill-active" : "filter-pill"
              }
            >
              {p}
            </button>
          ))}
        </div>

        <select
          value={filters.store}
          onChange={(e) => onChange({ ...filters, store: e.target.value })}
          className={selectClass}
        >
          <option value="all">All stores</option>
          <option value="apple">App Store only</option>
          <option value="play">Play Store only</option>
        </select>

        <select
          value={filters.version}
          onChange={(e) => onChange({ ...filters, version: e.target.value })}
          className={selectClass}
        >
          <option value="all">All versions</option>
          <option value="v2.3.1">v2.3.1</option>
          <option value="v2.3.0">v2.3.0</option>
          <option value="v2.2.4">v2.2.4</option>
        </select>

        <select
          value={filters.region}
          onChange={(e) => onChange({ ...filters, region: e.target.value })}
          className={selectClass}
        >
          <option value="all">All regions</option>
          <option value="africa">Africa</option>
          <option value="americas">Americas</option>
          <option value="europe">Europe</option>
        </select>

        <div className="ml-auto flex gap-2">
          <Button variant="ghost" size="sm">
            <RefreshCw size={13} />
            Refresh
          </Button>
          <Button variant="primary" size="sm">
            <Download size={13} />
            Export
          </Button>
        </div>
      </div>
    </Card>
  );
}

import { Download, RefreshCw } from "lucide-react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DATE_PRESETS } from "../data/mockData";

const STORE_OPTIONS = [
  { value: "all", label: "All stores" },
  { value: "apple", label: "App Store only" },
  { value: "play", label: "Play Store only" },
];

const VERSION_OPTIONS = [
  { value: "all", label: "All versions" },
  { value: "v2.3.1", label: "v2.3.1" },
  { value: "v2.3.0", label: "v2.3.0" },
  { value: "v2.2.4", label: "v2.2.4" },
];

const REGION_OPTIONS = [
  { value: "all", label: "All regions" },
  { value: "africa", label: "Africa" },
  { value: "americas", label: "Americas" },
  { value: "europe", label: "Europe" },
];

function FilterSelect({ value, onValueChange, options, ariaLabel }) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger aria-label={ariaLabel}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function FilterBar({ filters, onChange }) {
  return (
    <Card hover={false} padding="p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="time-selector">
          {DATE_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange({ ...filters, dateRange: p })}
              className={`time-option${filters.dateRange === p ? " active" : ""}`}
            >
              {p}
            </button>
          ))}
        </div>

        <FilterSelect
          value={filters.store}
          onValueChange={(store) => onChange({ ...filters, store })}
          options={STORE_OPTIONS}
          ariaLabel="Store filter"
        />

        <FilterSelect
          value={filters.version}
          onValueChange={(version) => onChange({ ...filters, version })}
          options={VERSION_OPTIONS}
          ariaLabel="Version filter"
        />

        <FilterSelect
          value={filters.region}
          onValueChange={(region) => onChange({ ...filters, region })}
          options={REGION_OPTIONS}
          ariaLabel="Region filter"
        />

        <div className="ml-auto flex gap-2">
          <Button variant="ghost" size="sm">
            <RefreshCw size={14} strokeWidth={1.5} />
            Refresh
          </Button>
          <Button variant="primary" size="sm">
            <Download size={14} strokeWidth={1.5} />
            Export
          </Button>
        </div>
      </div>
    </Card>
  );
}

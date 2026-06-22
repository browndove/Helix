import Sparkline from "./Sparkline";
import Text from "./ui/Text";
import { TrendArrow, StoreBadge } from "./shared";
import { formatNumber } from "../data/mockData";
import { kpiAccentColors } from "../lib/theme";

export default function KpiCard({ metric, index = 0 }) {
  const color = kpiAccentColors[metric.accent] || kpiAccentColors.primary;
  const display =
    metric.prefix || metric.suffix
      ? formatNumber(metric.value, {
          prefix: metric.prefix || "",
          suffix: metric.suffix || "",
          decimals: metric.suffix === "%" ? 2 : metric.id === "rating" ? 2 : 0,
        })
      : formatNumber(metric.value);

  return (
    <article
      className="dashboard-card hover-lift p-5"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <Text as="p" variant="body-sm" color="text-secondary">
          {metric.label}
        </Text>
        <div className="flex gap-1">
          {metric.stores?.map((s) => (
            <StoreBadge key={s} store={s} />
          ))}
        </div>
      </div>
      <Text as="p" variant="metric-lg" color="text-primary" className="animate-value-reveal">
        {display}
      </Text>
      <div className="mt-3 flex items-end justify-between gap-2">
        <TrendArrow change={metric.change} />
        <Sparkline data={metric.sparkline} color={color} />
      </div>
      {metric.meta && (
        <Text as="p" variant="body-xs" color="text-tertiary" className="mt-2">
          {metric.meta}
        </Text>
      )}
      <Text as="p" variant="body-xs" color="text-tertiary" className="mt-1">
        {metric.source}
      </Text>
    </article>
  );
}

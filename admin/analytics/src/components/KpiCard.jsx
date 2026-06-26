import Sparkline from "./Sparkline";
import { StatDelta, StoreBadge } from "./shared";
import { formatNumber } from "../data/mockData";

export default function KpiCard({ metric, index = 0 }) {
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
      className="stat-card"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="stat-label">{metric.label}</p>
        {metric.stores?.length > 0 && (
          <div className="flex gap-1">
            {metric.stores.map((s) => (
              <StoreBadge key={s} store={s} />
            ))}
          </div>
        )}
      </div>

      <p className="stat-value animate-value-reveal">{display}</p>

      <div className="flex items-center justify-between gap-2">
        <StatDelta change={metric.change} />
        <Sparkline data={metric.sparkline} />
      </div>

      {metric.meta && <p className="stat-sublabel">{metric.meta}</p>}
      <p className="stat-sublabel">{metric.source}</p>
    </article>
  );
}

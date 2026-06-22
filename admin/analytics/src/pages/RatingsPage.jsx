import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip, CHART_AXIS, CHART_GRID } from "../components/ChartTooltip";
import {
  RATING_DISTRIBUTION,
  RATING_TREND,
  RECENT_REVIEWS,
  formatDate,
} from "../data/mockData";
import { StoreBadge } from "../components/shared";

function StarBars({ distribution, color }) {
  return (
    <div className="space-y-1.5">
      {[5, 4, 3, 2, 1].map((star, i) => (
        <div key={star} className="flex items-center gap-2 text-[11px]">
          <span className="w-6 text-text-tertiary">{star}★</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/[0.04]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${distribution[i]}%`,
                background: color,
              }}
            />
          </div>
          <span className="tabular-nums w-8 text-right text-text-secondary">
            {distribution[i]}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default function RatingsPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="dashboard-card hover-lift p-5">
          <h2 className="mb-1 text-[15px] font-semibold text-text-primary">Rating overview</h2>
          <p className="mb-4 text-xs text-text-tertiary">Combined across both stores</p>
          <p className="tabular-nums text-[48px] font-bold leading-none tracking-[-0.5px] text-text-primary">
            4.72
          </p>
          <p className="mt-1 text-sm text-accent-orange">★★★★★</p>
          <p className="mt-2 text-xs text-text-tertiary">12,840 total reviews</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold text-text-secondary">App Store</p>
              <StarBars distribution={RATING_DISTRIBUTION.appStore} color="var(--accent-primary)" />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-text-secondary">Play Store</p>
              <StarBars distribution={RATING_DISTRIBUTION.playStore} color="var(--accent-green)" />
            </div>
          </div>

          <div className="mt-6 h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RATING_TREND}>
                <CartesianGrid {...CHART_GRID} />
                <XAxis dataKey="date" {...CHART_AXIS} tickFormatter={(v) => v.slice(5)} />
                <YAxis domain={[4.4, 5]} {...CHART_AXIS} width={32} />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="appStore"
                  name="App Store"
                  stroke="var(--accent-primary)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="playStore"
                  name="Play Store"
                  stroke="var(--accent-green)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="dashboard-card hover-lift p-5">
          <h2 className="mb-4 text-[15px] font-semibold text-text-primary">Recent reviews</h2>
          <div className="space-y-3">
            {RECENT_REVIEWS.map((r, i) => (
              <article key={i} className="nested-panel p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <StoreBadge store={r.store} />
                    <span
                      className="text-xs font-medium"
                      style={{
                        color:
                          r.stars >= 4
                            ? "var(--accent-green)"
                            : r.stars === 3
                              ? "#FF9F0A"
                              : "var(--accent-red)",
                      }}
                    >
                      {"★".repeat(r.stars)}
                    </span>
                  </div>
                  <span className="text-[10px] text-text-tertiary">{formatDate(r.date)}</span>
                </div>
                <p className="text-sm font-medium text-text-primary">{r.title}</p>
                <p className="mt-1 text-xs text-text-secondary">{r.snippet}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-text-tertiary">
                    {r.version} · {r.country}
                  </span>
                  {r.replied ? (
                    <span className="text-[10px] font-medium text-accent-green">Replied</span>
                  ) : (
                    <button
                      type="button"
                      className="text-[10px] font-medium text-accent-primary hover:underline"
                    >
                      Reply
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

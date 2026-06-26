import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartTooltip,
  CHART_AXIS,
  CHART_GRID,
  CHART_CURSOR,
} from "../components/ChartTooltip";
import { chartColors } from "../lib/theme";
import {
  RATING_DISTRIBUTION,
  RATING_TREND,
  RECENT_REVIEWS,
  formatDate,
} from "../data/mockData";
import { StoreBadge } from "../components/shared";

function StarBars({ distribution, color = "var(--chart-accent)" }) {
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((star, i) => (
        <div key={star} className="flex items-center gap-2 text-[11px]">
          <span className="w-6 text-text-tertiary">{star}★</span>
          <div className="progress-track progress-bar-h flex-1">
            <div
              className="progress-fill"
              style={{ width: `${distribution[i]}%`, background: color }}
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
        <section className="stat-card">
          <h2 className="chart-title">Rating overview</h2>
          <p className="chart-subtitle !mb-2">Combined across both stores</p>
          <p className="stat-value">4.72</p>
          <p className="stat-sublabel">12,840 total reviews</p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-3 text-[13px] text-text-secondary">App Store</p>
              <StarBars distribution={RATING_DISTRIBUTION.appStore} />
            </div>
            <div>
              <p className="mb-3 text-[13px] text-text-secondary">Play Store</p>
              <StarBars distribution={RATING_DISTRIBUTION.playStore} color="var(--chart-accent-2)" />
            </div>
          </div>

          <div className="chart-container mt-6 h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RATING_TREND}>
                <CartesianGrid {...CHART_GRID} />
                <XAxis dataKey="date" {...CHART_AXIS} tickFormatter={(v) => v.slice(5)} />
                <YAxis domain={[4.4, 5]} {...CHART_AXIS} width={32} />
                <Tooltip content={<ChartTooltip />} cursor={CHART_CURSOR} />
                <Line
                  type="monotone"
                  dataKey="appStore"
                  name="App Store"
                  stroke={chartColors.appStore}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="playStore"
                  name="Play Store"
                  stroke={chartColors.playStore}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            <span className="chart-legend-item">
              <span className="chart-legend-swatch" style={{ background: chartColors.appStore }} />
              App Store
            </span>
            <span className="chart-legend-item">
              <span
                className="chart-legend-swatch"
                style={{ background: chartColors.playStore }}
              />
              Play Store
            </span>
          </div>
        </section>

        <section className="dashboard-card hover-lift p-8">
          <h2 className="chart-title">Recent reviews</h2>
          <p className="chart-subtitle">Latest feedback from both stores</p>
          <div className="space-y-3">
            {RECENT_REVIEWS.map((r, i) => (
              <article key={i} className="nested-panel p-4">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <StoreBadge store={r.store} />
                    <span
                      className="text-[13px] font-medium"
                      style={{
                        color:
                          r.stars >= 4
                            ? "var(--system-green)"
                            : r.stars === 3
                              ? "var(--system-orange)"
                              : "var(--system-red)",
                      }}
                    >
                      {"★".repeat(r.stars)}
                    </span>
                  </div>
                  <span className="text-[11px] text-text-tertiary">{formatDate(r.date)}</span>
                </div>
                <p className="text-[15px] font-medium text-text-primary">{r.title}</p>
                <p className="mt-1 text-[13px] text-text-secondary">{r.snippet}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-text-tertiary">
                    {r.version} · {r.country}
                  </span>
                  {r.replied ? (
                    <span className="text-[11px] font-medium text-accent-green">Replied</span>
                  ) : (
                    <button
                      type="button"
                      className="text-[11px] font-medium text-accent-primary transition-opacity hover:opacity-75"
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

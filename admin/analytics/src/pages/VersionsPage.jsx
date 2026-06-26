import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip, CHART_AXIS, CHART_GRID, CHART_CURSOR } from "../components/ChartTooltip";
import { chartColors } from "../lib/theme";
import { VERSION_ROWS, OS_DISTRIBUTION, formatDate } from "../data/mockData";

const STATUS_STYLES = {
  LATEST: "stat-delta up",
  STABLE: "stat-delta muted",
  DEPRECATED: "stat-delta muted",
  BETA: "stat-delta neutral",
};

function HorizontalBars({ data, color = "var(--chart-accent)" }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.name}>
          <div className="mb-1.5 flex justify-between text-[11px]">
            <span className="text-text-secondary">{d.name}</span>
            <span className="tabular-nums font-medium text-text-primary">{d.value}%</span>
          </div>
          <div className="progress-track progress-bar-h">
            <div
              className="progress-fill"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function VersionsPage() {
  const chartData = VERSION_ROWS.map((r) => ({
    version: r.version,
    ios: r.ios,
    android: r.android,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="dashboard-card hover-lift p-8">
          <h2 className="chart-title">Active installs by version</h2>
          <p className="chart-subtitle">iOS and Android install base per release</p>
          <div className="chart-container h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="30%">
                <CartesianGrid {...CHART_GRID} />
                <XAxis dataKey="version" {...CHART_AXIS} />
                <YAxis {...CHART_AXIS} width={48} />
                <Tooltip content={<ChartTooltip />} cursor={CHART_CURSOR} />
                <Bar
                  dataKey="ios"
                  name="iOS"
                  fill={chartColors.appStore}
                  stackId="a"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="android"
                  name="Android"
                  fill={chartColors.playStore}
                  stackId="a"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            <span className="chart-legend-item">
              <span className="chart-legend-swatch" style={{ background: chartColors.appStore }} />
              iOS
            </span>
            <span className="chart-legend-item">
              <span
                className="chart-legend-swatch"
                style={{ background: chartColors.playStore }}
              />
              Android
            </span>
          </div>
        </section>

        <section className="dashboard-card hover-lift overflow-hidden p-8">
          <h2 className="chart-title">Version table</h2>
          <p className="chart-subtitle">Adoption, ratings, and crash counts</p>
          <div className="overflow-x-auto">
            <table className="data-table min-w-[520px]">
              <thead>
                <tr>
                  <th>Version</th>
                  <th>Released</th>
                  <th className="num">Adoption</th>
                  <th className="num">Rating</th>
                  <th className="num">Crashes</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {VERSION_ROWS.map((row) => (
                  <tr key={row.version}>
                    <td className="font-medium">{row.version}</td>
                    <td className="text-text-secondary">{formatDate(row.releaseDate)}</td>
                    <td className="num text-text-secondary">{row.adoption}%</td>
                    <td className="num text-text-secondary">{row.rating}</td>
                    <td className="num text-text-secondary">{row.crashes}</td>
                    <td>
                      <span className={STATUS_STYLES[row.status]}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="dashboard-card hover-lift p-8">
          <h3 className="chart-title">iOS version distribution</h3>
          <p className="chart-subtitle">Share of active iOS devices</p>
          <HorizontalBars data={OS_DISTRIBUTION.ios} />
        </section>
        <section className="dashboard-card hover-lift p-8">
          <h3 className="chart-title">Android version distribution</h3>
          <p className="chart-subtitle">Share of active Android devices</p>
          <HorizontalBars data={OS_DISTRIBUTION.android} color="var(--chart-accent-2)" />
        </section>
      </div>
    </div>
  );
}

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip, CHART_AXIS, CHART_GRID } from "../components/ChartTooltip";
import { VERSION_ROWS, OS_DISTRIBUTION, formatDate } from "../data/mockData";

const STATUS_STYLES = {
  LATEST: "bg-[rgba(48,209,88,0.12)] text-accent-green",
  STABLE: "bg-[rgba(10,132,255,0.1)] text-accent-primary",
  DEPRECATED: "bg-black/[0.04] text-[#8E8E93]",
  BETA: "bg-[rgba(255,159,10,0.12)] text-accent-orange",
};

function HorizontalBars({ data, color }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.name}>
          <div className="mb-1 flex justify-between text-[11px]">
            <span className="text-text-secondary">{d.name}</span>
            <span className="tabular-nums font-medium text-text-primary">{d.value}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-black/[0.04]">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${(d.value / max) * 100}%`, background: color }}
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
        <section className="dashboard-card hover-lift p-5">
          <h2 className="mb-4 text-[15px] font-semibold text-text-primary">
            Active installs by version
          </h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid {...CHART_GRID} />
                <XAxis dataKey="version" {...CHART_AXIS} />
                <YAxis {...CHART_AXIS} width={48} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="ios" name="iOS" fill="var(--accent-primary)" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar
                  dataKey="android"
                  name="Android"
                  fill="var(--accent-green)"
                  stackId="a"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="dashboard-card hover-lift overflow-hidden p-5">
          <h2 className="mb-4 text-[15px] font-semibold text-text-primary">Version table</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-[11px]">
              <thead>
                <tr className="text-text-tertiary">
                  <th className="pb-2 font-medium">Version</th>
                  <th className="pb-2 font-medium">Released</th>
                  <th className="pb-2 font-medium">Adoption</th>
                  <th className="pb-2 font-medium">Rating</th>
                  <th className="pb-2 font-medium">Crashes</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {VERSION_ROWS.map((row) => (
                  <tr
                    key={row.version}
                    className={`${row.status === "LATEST" ? "bg-[rgba(10,132,255,0.04)]" : ""}`}
                  >
                    <td className="py-2 font-semibold text-text-primary">{row.version}</td>
                    <td className="py-2 text-text-secondary">{formatDate(row.releaseDate)}</td>
                    <td className="tabular-nums py-2 text-text-secondary">{row.adoption}%</td>
                    <td className="tabular-nums py-2 text-text-secondary">★ {row.rating}</td>
                    <td className="tabular-nums py-2 text-text-secondary">{row.crashes}</td>
                    <td className="py-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                          STATUS_STYLES[row.status]
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="dashboard-card hover-lift p-5">
          <h3 className="mb-4 text-sm font-semibold text-text-primary">iOS version distribution</h3>
          <HorizontalBars data={OS_DISTRIBUTION.ios} color="var(--accent-primary)" />
        </section>
        <section className="dashboard-card hover-lift p-5">
          <h3 className="mb-4 text-sm font-semibold text-text-primary">
            Android version distribution
          </h3>
          <HorizontalBars data={OS_DISTRIBUTION.android} color="var(--accent-green)" />
        </section>
      </div>
    </div>
  );
}

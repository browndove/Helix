import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip, CHART_AXIS, CHART_GRID, CHART_CURSOR } from "../components/ChartTooltip";
import { CRASH_TREND, CRASH_REPORTS, formatDate } from "../data/mockData";

const STATUS_BADGE = {
  Open: "stat-delta down",
  Investigating: "stat-delta neutral",
  Resolved: "stat-delta up",
};

export default function CrashesPage() {
  const crashFree = 99.62;
  const target = 99.5;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <article className="stat-card text-center">
          <p className="stat-label">Crash-free users</p>
          <p className="stat-value">{crashFree}%</p>
          <p className="stat-sublabel">Target above {target}%</p>
          <div className="progress-track mx-auto mt-4 max-w-[200px]">
            <div
              className="progress-fill !bg-[var(--system-green)]"
              style={{ width: `${((crashFree - 98) / 2) * 100}%` }}
            />
          </div>
        </article>

        <section className="dashboard-card hover-lift col-span-2 p-8">
          <h2 className="chart-title">Crash trend</h2>
          <p className="chart-subtitle !mb-4">Daily crash reports across active versions</p>
          <div className="chart-container h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CRASH_TREND}>
                <defs>
                  <linearGradient id="crashFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--system-red)" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="var(--system-red)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...CHART_GRID} />
                <XAxis dataKey="date" {...CHART_AXIS} tickFormatter={(v) => v.slice(5)} />
                <YAxis {...CHART_AXIS} width={32} />
                <Tooltip content={<ChartTooltip />} cursor={CHART_CURSOR} />
                <Area
                  type="monotone"
                  dataKey="crashes"
                  name="Crashes"
                  stroke="var(--system-red)"
                  fill="url(#crashFill)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="dashboard-card hover-lift p-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="chart-title">Top crash reports</h2>
            <p className="chart-subtitle !mb-0">
              iOS via App Store Connect. Android via Firebase Crashlytics.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table min-w-[800px]">
            <thead>
              <tr>
                <th>Type</th>
                <th>Category</th>
                <th className="num">Users</th>
                <th className="num">Occurrences</th>
                <th>Version</th>
                <th>OS</th>
                <th>First seen</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {CRASH_REPORTS.map((row) => (
                <tr key={row.type}>
                  <td className="font-medium">{row.type}</td>
                  <td className="text-text-secondary">{row.category}</td>
                  <td className="num text-text-secondary">{row.users}</td>
                  <td className="num text-text-secondary">{row.occurrences}</td>
                  <td className="text-text-secondary">{row.version}</td>
                  <td className="text-text-secondary">{row.os}</td>
                  <td className="text-text-secondary">{formatDate(row.firstSeen)}</td>
                  <td>
                    <span className={STATUS_BADGE[row.status]}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

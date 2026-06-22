import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip, CHART_AXIS, CHART_GRID } from "../components/ChartTooltip";
import { CRASH_TREND, CRASH_REPORTS, formatDate } from "../data/mockData";

const STATUS_BADGE = {
  Open: "bg-[rgba(255,69,58,0.1)] text-accent-red",
  Investigating: "bg-[rgba(255,159,10,0.12)] text-accent-orange",
  Resolved: "bg-[rgba(48,209,88,0.12)] text-accent-green",
};

export default function CrashesPage() {
  const crashFree = 99.62;
  const target = 99.5;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="dashboard-card p-5 text-center">
          <p className="text-xs text-text-secondary">Crash-free users</p>
          <p className="tabular-nums mt-2 text-[38px] font-bold tracking-[-0.5px] text-text-primary">
            {crashFree}%
          </p>
          <p className="mt-1 text-[11px] text-accent-green">Target: &gt;{target}%</p>
          <div className="mx-auto mt-4 h-2 max-w-[200px] overflow-hidden rounded-full bg-black/[0.04]">
            <div
              className="h-full rounded-full bg-accent-green"
              style={{ width: `${((crashFree - 98) / 2) * 100}%` }}
            />
          </div>
        </div>

        <section className="dashboard-card hover-lift col-span-2 p-5">
          <h2 className="mb-4 text-[15px] font-semibold text-text-primary">Crash trend</h2>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CRASH_TREND}>
                <defs>
                  <linearGradient id="crashFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,69,58,0.12)" />
                    <stop offset="100%" stopColor="rgba(255,69,58,0)" />
                  </linearGradient>
                </defs>
                <CartesianGrid {...CHART_GRID} />
                <XAxis dataKey="date" {...CHART_AXIS} tickFormatter={(v) => v.slice(5)} />
                <YAxis {...CHART_AXIS} width={32} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="crashes"
                  name="Crashes"
                  stroke="var(--accent-red)"
                  fill="url(#crashFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="dashboard-card hover-lift p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-[15px] font-semibold text-text-primary">Top crash reports</h2>
          <p className="text-[11px] text-text-tertiary">
            iOS via App Store Connect Diagnostics. Android: use Firebase Crashlytics.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-[11px]">
            <thead>
              <tr className="text-text-tertiary">
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Category</th>
                <th className="pb-2 font-medium">Users</th>
                <th className="pb-2 font-medium">Occurrences</th>
                <th className="pb-2 font-medium">Version</th>
                <th className="pb-2 font-medium">OS</th>
                <th className="pb-2 font-medium">First seen</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {CRASH_REPORTS.map((row) => (
                <tr key={row.type} className="nested-panel">
                  <td className="py-2.5 pl-2 font-medium text-text-primary">{row.type}</td>
                  <td className="py-2.5 text-text-secondary">{row.category}</td>
                  <td className="tabular-nums py-2.5 text-text-secondary">{row.users}</td>
                  <td className="tabular-nums py-2.5 text-text-secondary">{row.occurrences}</td>
                  <td className="py-2.5 text-text-secondary">{row.version}</td>
                  <td className="py-2.5 text-text-secondary">{row.os}</td>
                  <td className="py-2.5 text-text-secondary">{formatDate(row.firstSeen)}</td>
                  <td className="py-2.5">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                        STATUS_BADGE[row.status]
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
  );
}

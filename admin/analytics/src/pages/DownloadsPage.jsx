import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip, CHART_AXIS, CHART_GRID } from "../components/ChartTooltip";
import {
  DOWNLOADS_SERIES,
  VERSION_RELEASES,
  filterByDateRange,
  formatDate,
} from "../data/mockData";

export default function DownloadsPage({ filters }) {
  const data = filterByDateRange(DOWNLOADS_SERIES, filters.dateRange, filters.store).map(
    (d) => ({
      ...d,
      playUninstallsNeg: -d.playUninstalls,
    })
  );

  return (
    <div className="space-y-6">
      <section className="dashboard-card hover-lift p-5">
        <h2 className="mb-1 text-[15px] font-semibold text-text-primary">
          Downloads &amp; installs over time
        </h2>
        <p className="mb-4 text-xs text-text-tertiary">
          App Store units, re-downloads, Play installs, uninstalls, and net installs
        </p>
        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} stackOffset="sign">
              <CartesianGrid {...CHART_GRID} />
              <XAxis dataKey="date" {...CHART_AXIS} tickFormatter={(v) => v.slice(5)} />
              <YAxis {...CHART_AXIS} width={48} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {VERSION_RELEASES.map((r) => (
                <ReferenceLine
                  key={r.version}
                  x={r.date}
                  stroke="rgba(10,132,255,0.25)"
                  strokeDasharray="4 4"
                  label={{
                    value: r.version,
                    position: "insideTopLeft",
                    fill: "#9CA3AF",
                    fontSize: 10,
                  }}
                />
              ))}
              {(filters.store === "all" || filters.store === "apple") && (
                <>
                  <Bar
                    dataKey="appStoreNew"
                    name="App Store New"
                    fill="var(--accent-primary)"
                    radius={[3, 3, 0, 0]}
                    stackId="pos"
                  />
                  <Bar
                    dataKey="appStoreRedownloads"
                    name="Re-downloads"
                    fill="#64B5FF"
                    radius={[3, 3, 0, 0]}
                    stackId="pos"
                  />
                </>
              )}
              {(filters.store === "all" || filters.store === "play") && (
                <>
                  <Bar
                    dataKey="playNewInstalls"
                    name="Play Installs"
                    fill="var(--accent-green)"
                    radius={[3, 3, 0, 0]}
                    stackId="pos"
                  />
                  <Bar
                    dataKey="playUninstallsNeg"
                    name="Uninstalls"
                    fill="var(--accent-red)"
                    radius={[0, 0, 3, 3]}
                    stackId="neg"
                  />
                </>
              )}
              <Line
                type="monotone"
                dataKey="netInstalls"
                name="Net installs"
                stroke="#1A1A1A"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="dashboard-card hover-lift p-5">
        <h3 className="mb-3 text-sm font-semibold text-text-primary">Version release markers</h3>
        <div className="flex flex-wrap gap-3">
          {VERSION_RELEASES.map((r) => (
            <div key={r.version} className="nested-panel px-3 py-2 text-xs">
              <span className="font-medium text-accent-primary">{r.version}</span>
              <span className="ml-2 text-text-tertiary">{formatDate(r.date)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

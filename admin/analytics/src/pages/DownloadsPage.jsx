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
import {
  ChartTooltip,
  CHART_AXIS,
  CHART_GRID,
  CHART_CURSOR,
  CHART_LEGEND,
} from "../components/ChartTooltip";
import { chartColors } from "../lib/theme";
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

  const seriesCount =
    (filters.store === "all" || filters.store === "apple" ? 2 : 0) +
    (filters.store === "all" || filters.store === "play" ? 2 : 0) +
    1;

  return (
    <div className="space-y-6">
      <section className="dashboard-card hover-lift p-8">
        <h2 className="chart-title">Downloads &amp; installs over time</h2>
        <p className="chart-subtitle">
          App Store units, re-downloads, Play installs, uninstalls, and net installs
        </p>
        <div className="chart-container h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} stackOffset="sign">
              <CartesianGrid {...CHART_GRID} />
              <XAxis dataKey="date" {...CHART_AXIS} tickFormatter={(v) => v.slice(5)} />
              <YAxis {...CHART_AXIS} width={48} />
              <Tooltip content={<ChartTooltip />} cursor={CHART_CURSOR} />
              {seriesCount > 2 && <Legend {...CHART_LEGEND} />}
              {VERSION_RELEASES.map((r) => (
                <ReferenceLine
                  key={r.version}
                  x={r.date}
                  stroke="var(--chart-axis)"
                  strokeDasharray="3 3"
                  label={{
                    value: r.version,
                    position: "insideTopLeft",
                    fill: "var(--chart-label)",
                    fontSize: 10,
                  }}
                />
              ))}
              {(filters.store === "all" || filters.store === "apple") && (
                <>
                  <Bar
                    dataKey="appStoreNew"
                    name="App Store"
                    fill={chartColors.appStore}
                    radius={[4, 4, 0, 0]}
                    stackId="pos"
                  />
                  <Bar
                    dataKey="appStoreRedownloads"
                    name="Re-downloads"
                    fill="var(--chart-neutral-light)"
                    radius={[4, 4, 0, 0]}
                    stackId="pos"
                  />
                </>
              )}
              {(filters.store === "all" || filters.store === "play") && (
                <>
                  <Bar
                    dataKey="playNewInstalls"
                    name="Play Store"
                    fill={chartColors.playStore}
                    radius={[4, 4, 0, 0]}
                    stackId="pos"
                  />
                  <Bar
                    dataKey="playUninstallsNeg"
                    name="Uninstalls"
                    fill={chartColors.red}
                    radius={[0, 0, 4, 4]}
                    stackId="neg"
                  />
                </>
              )}
              <Line
                type="monotone"
                dataKey="netInstalls"
                name="Net installs"
                stroke={chartColors.neutral}
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="dashboard-card hover-lift p-8">
        <h3 className="chart-title">Version release markers</h3>
        <p className="chart-subtitle !mb-4">Ship dates for recent releases</p>
        <div className="flex flex-wrap gap-3">
          {VERSION_RELEASES.map((r) => (
            <div key={r.version} className="nested-panel px-4 py-2.5 text-[13px]">
              <span className="font-medium text-accent-primary">{r.version}</span>
              <span className="ml-2 text-text-tertiary">{formatDate(r.date)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

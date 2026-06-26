import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import KpiCard from "../components/KpiCard";
import Card from "../components/ui/Card";
import {
  ChartTooltip,
  CHART_AXIS,
  CHART_GRID,
  CHART_CURSOR,
  CHART_LEGEND,
} from "../components/ChartTooltip";
import { chartColors } from "../lib/theme";
import { KPI_METRICS, filterByDateRange, DOWNLOADS_SERIES } from "../data/mockData";

export default function OverviewPage({ filters }) {
  const data = filterByDateRange(DOWNLOADS_SERIES, filters.dateRange, filters.store);
  const showBoth = filters.store === "all";
  const showLegend = showBoth;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {KPI_METRICS.map((m, i) => (
          <KpiCard key={m.id} metric={m} index={i} />
        ))}
      </div>

      <Card>
        <h2 className="chart-title">Downloads overview</h2>
        <p className="chart-subtitle">Combined App Store and Play Store activity</p>
        <div className="chart-container h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="iosFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-accent)" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="var(--chart-accent)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="playFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-accent-2)" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="var(--chart-accent-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...CHART_GRID} />
              <XAxis dataKey="date" {...CHART_AXIS} tickFormatter={(v) => v.slice(5)} />
              <YAxis {...CHART_AXIS} width={40} />
              <Tooltip content={<ChartTooltip />} cursor={CHART_CURSOR} />
              {showLegend && <Legend {...CHART_LEGEND} />}
              {(filters.store === "all" || filters.store === "apple") && (
                <Area
                  type="monotone"
                  dataKey="appStoreNew"
                  name="App Store"
                  stroke={chartColors.appStore}
                  fill="url(#iosFill)"
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {(filters.store === "all" || filters.store === "play") && (
                <Area
                  type="monotone"
                  dataKey="playNewInstalls"
                  name="Play Store"
                  stroke={chartColors.playStore}
                  fill="url(#playFill)"
                  strokeWidth={2}
                  dot={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

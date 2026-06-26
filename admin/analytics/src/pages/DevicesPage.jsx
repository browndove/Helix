import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartTooltip } from "../components/ChartTooltip";
import { chartSeriesColors } from "../lib/theme";
import {
  DEVICE_APPLE,
  DEVICE_ANDROID_TOP,
  SCREEN_SIZES,
  RAM_DISTRIBUTION,
  formatNumber,
} from "../data/mockData";

function BarList({ items, labelKey, valueKey, color = "var(--chart-accent)" }) {
  const max = Math.max(...items.map((d) => d[valueKey]));
  return (
    <div className="space-y-3">
      {items.map((d) => (
        <div key={d[labelKey]}>
          <div className="mb-1.5 flex justify-between text-[11px]">
            <span className="text-text-secondary">{d[labelKey]}</span>
            <span className="tabular-nums font-medium text-text-primary">
              {typeof d[valueKey] === "number" && d[valueKey] > 100
                ? formatNumber(d[valueKey])
                : `${d[valueKey]}%`}
            </span>
          </div>
          <div className="progress-track progress-bar-h">
            <div
              className="progress-fill"
              style={{
                width: `${(d[valueKey] / max) * 100}%`,
                background: color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DevicesPage() {
  const topDevice = DEVICE_APPLE[0];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="dashboard-card hover-lift p-8">
          <h2 className="chart-title">App Store device types</h2>
          <p className="chart-subtitle">iPhone, iPad, and iPod share of installs</p>
          <div className="relative chart-container h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DEVICE_APPLE}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={2}
                  stroke="none"
                >
                  {DEVICE_APPLE.map((_, i) => (
                    <Cell key={i} fill={chartSeriesColors[i % chartSeriesColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[28px] font-semibold tabular-nums tracking-[-0.02em] text-text-primary">
                {topDevice?.value}%
              </span>
              <span className="text-[12px] text-text-secondary">{topDevice?.name}</span>
            </div>
          </div>
          <div className="chart-legend justify-center">
            {DEVICE_APPLE.map((d, i) => (
              <span key={d.name} className="chart-legend-item">
                <span
                  className="chart-legend-swatch"
                  style={{ background: chartSeriesColors[i % chartSeriesColors.length] }}
                />
                {d.name} {d.value}%
              </span>
            ))}
          </div>
        </section>

        <section className="dashboard-card hover-lift p-8">
          <h2 className="chart-title">Top Android devices</h2>
          <p className="chart-subtitle">Install share by manufacturer model</p>
          <BarList
            items={DEVICE_ANDROID_TOP}
            labelKey="model"
            valueKey="installs"
            color="var(--chart-accent-2)"
          />
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="dashboard-card hover-lift p-8">
          <h2 className="chart-title">Screen size distribution</h2>
          <p className="chart-subtitle">Active devices by display class</p>
          <BarList items={SCREEN_SIZES} labelKey="size" valueKey="value" />
        </section>
        <section className="dashboard-card hover-lift p-8">
          <h2 className="chart-title">Android RAM</h2>
          <p className="chart-subtitle">Memory tier distribution</p>
          <BarList
            items={RAM_DISTRIBUTION}
            labelKey="ram"
            valueKey="value"
            color="var(--chart-accent-2)"
          />
        </section>
      </div>
    </div>
  );
}

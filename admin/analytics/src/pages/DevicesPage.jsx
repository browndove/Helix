import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartTooltip } from "../components/ChartTooltip";
import {
  DEVICE_APPLE,
  DEVICE_ANDROID_TOP,
  SCREEN_SIZES,
  RAM_DISTRIBUTION,
  formatNumber,
} from "../data/mockData";

const APPLE_COLORS = ["var(--accent-primary)", "#64B5FF", "#A8D4FF", "#D4EAFF"];

function BarList({ items, labelKey, valueKey, color }) {
  const max = Math.max(...items.map((d) => d[valueKey]));
  return (
    <div className="space-y-2">
      {items.map((d) => (
        <div key={d[labelKey]}>
          <div className="mb-1 flex justify-between text-[11px]">
            <span className="text-text-secondary">{d[labelKey]}</span>
            <span className="tabular-nums font-medium text-text-primary">
              {typeof d[valueKey] === "number" && d[valueKey] > 100
                ? formatNumber(d[valueKey])
                : `${d[valueKey]}%`}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-black/[0.04]">
            <div
              className="h-full rounded-full"
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
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="dashboard-card hover-lift p-5">
          <h2 className="mb-4 text-[15px] font-semibold text-text-primary">
            App Store device types
          </h2>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DEVICE_APPLE}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {DEVICE_APPLE.map((_, i) => (
                    <Cell key={i} fill={APPLE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-3 text-[11px] text-text-secondary">
            {DEVICE_APPLE.map((d, i) => (
              <span key={d.name} className="flex items-center gap-1">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: APPLE_COLORS[i] }}
                />
                {d.name} {d.value}%
              </span>
            ))}
          </div>
        </section>

        <section className="dashboard-card hover-lift p-5">
          <h2 className="mb-4 text-[15px] font-semibold text-text-primary">
            Top Android devices
          </h2>
          <BarList
            items={DEVICE_ANDROID_TOP}
            labelKey="model"
            valueKey="installs"
            color="var(--accent-green)"
          />
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="dashboard-card hover-lift p-5">
          <h2 className="mb-4 text-sm font-semibold text-text-primary">
            Screen size distribution
          </h2>
          <BarList items={SCREEN_SIZES} labelKey="size" valueKey="value" color="var(--accent-primary)" />
        </section>
        <section className="dashboard-card hover-lift p-5">
          <h2 className="mb-4 text-sm font-semibold text-text-primary">Android RAM</h2>
          <BarList items={RAM_DISTRIBUTION} labelKey="ram" valueKey="value" color="var(--accent-green)" />
        </section>
      </div>
    </div>
  );
}

import { useId } from "react";
import { Area, AreaChart, Line, ResponsiveContainer } from "recharts";

export default function Sparkline({ data, color = "var(--chart-accent)" }) {
  const gradientId = useId().replace(/:/g, "");
  const points = data.map((v, i) => ({ i, v }));

  return (
    <div className="sparkline h-7 w-20 opacity-90">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.12} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke="none"
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

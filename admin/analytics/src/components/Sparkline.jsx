import { Line, LineChart, ResponsiveContainer } from "recharts";

export default function Sparkline({ data, color = "#0A84FF" }) {
  const points = data.map((v, i) => ({ i, v }));
  return (
    <div className="h-8 w-20 opacity-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

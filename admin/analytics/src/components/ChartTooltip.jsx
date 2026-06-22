import Text from "./ui/Text";

export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <Text as="p" variant="body-sm-semibold" className="mb-1.5">
        {label}
      </Text>
      {payload.map((entry) => (
        <Text key={entry.name} as="p" variant="body-xs" color="text-secondary">
          <span style={{ color: entry.color }}>{entry.name}: </span>
          {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
        </Text>
      ))}
    </div>
  );
}

export const CHART_GRID = {
  stroke: "rgba(35, 66, 88, 0.06)",
  vertical: false,
};

export const CHART_AXIS = {
  tick: { fill: "#A3B2BE", fontSize: 11, fontFamily: "Montserrat" },
  axisLine: false,
  tickLine: false,
};

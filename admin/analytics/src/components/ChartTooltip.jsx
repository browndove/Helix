const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';

export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const primary = payload[0];
  const value =
    typeof primary.value === "number"
      ? primary.value.toLocaleString()
      : primary.value;

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-date">{label}</p>
      <p className="chart-tooltip-value">{value}</p>
      {payload.length === 1 ? (
        <p className="chart-tooltip-series">{primary.name}</p>
      ) : (
        payload.map((entry) => (
          <p key={entry.name} className="chart-tooltip-series">
            <span style={{ color: entry.color }}>{entry.name}: </span>
            {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
          </p>
        ))
      )}
    </div>
  );
}

export const CHART_GRID = {
  stroke: "var(--chart-grid)",
  strokeWidth: 0.5,
  vertical: false,
};

export const CHART_AXIS = {
  tick: {
    fill: "var(--chart-label)",
    fontSize: 11,
    fontWeight: 400,
    fontFamily: FONT_STACK,
    fontVariantNumeric: "tabular-nums",
  },
  axisLine: { stroke: "var(--chart-axis)", strokeWidth: 0.5 },
  tickLine: false,
};

export const CHART_LEGEND = {
  wrapperStyle: {
    fontSize: 12,
    fontFamily: FONT_STACK,
    color: "var(--label-secondary)",
    paddingTop: 16,
  },
  iconType: "square",
  iconSize: 8,
};

export const CHART_CURSOR = {
  stroke: "var(--chart-axis)",
  strokeWidth: 0.5,
  strokeDasharray: "3 3",
};

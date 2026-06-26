import { useMemo, useState } from "react";
import world from "@svg-maps/world";
import { formatNumber } from "../data/mockData";

const [vbX, vbY, vbW, vbH] = world.viewBox.split(" ").map(Number);

function project(lat, lng) {
  return {
    x: ((lng + 180) / 360) * vbW,
    y: ((90 - lat) / 180) * vbH,
  };
}

function pinRadius(total, maxTotal) {
  const min = 5;
  const max = 14;
  const ratio = Math.sqrt(total / maxTotal);
  return min + (max - min) * ratio;
}

export default function WorldDownloadMap({ countries }) {
  const [active, setActive] = useState(null);

  const { pins, maxTotal } = useMemo(() => {
    const withTotals = countries.map((c) => ({
      ...c,
      total: c.ios + c.android,
      ...project(c.lat, c.lng),
    }));
    const peak = Math.max(...withTotals.map((c) => c.total), 1);
    return { pins: withTotals, maxTotal: peak };
  }, [countries]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--separator)] bg-[var(--bg-tertiary)]">
      <svg
        viewBox={world.viewBox}
        className="block h-auto w-full"
        role="img"
        aria-label="World map showing download locations"
      >
        <rect x={vbX} y={vbY} width={vbW} height={vbH} fill="var(--bg-secondary)" />
        {world.locations.map((location) => (
          <path
            key={location.id}
            d={location.path}
            fill="var(--fill-primary)"
            stroke="var(--separator)"
            strokeWidth={0.5}
          />
        ))}
        {pins.map((pin) => {
          const r = pinRadius(pin.total, maxTotal);
          const isActive = active?.country === pin.country;
          return (
            <g
              key={pin.country}
              transform={`translate(${pin.x}, ${pin.y})`}
              className="cursor-pointer"
              onMouseEnter={() => setActive(pin)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(pin)}
              onBlur={() => setActive(null)}
              tabIndex={0}
              role="button"
              aria-label={`${pin.country}: ${formatNumber(pin.total)} downloads`}
            >
              <circle
                r={r + 4}
                fill="var(--accent-blue)"
                opacity={isActive ? 0.25 : 0.12}
              />
              <circle
                r={r}
                fill="var(--accent-blue)"
                opacity={isActive ? 1 : 0.85}
                stroke="var(--bg-base)"
                strokeWidth={1.5}
              />
            </g>
          );
        })}
      </svg>

      {active && (
        <div className="chart-tooltip pointer-events-none absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-48">
          <p className="text-[15px] font-semibold text-text-primary">{active.country}</p>
          <p className="mt-1 text-[13px] text-text-secondary">
            {formatNumber(active.total)} total downloads
          </p>
          <p className="text-[13px] tabular-nums text-text-tertiary">
            iOS {formatNumber(active.ios)} · Android {formatNumber(active.android)}
          </p>
        </div>
      )}
    </div>
  );
}

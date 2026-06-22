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
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[#4a5568] to-[#2d3748]">
      <svg
        viewBox={world.viewBox}
        className="block h-auto w-full"
        role="img"
        aria-label="World map showing download locations"
      >
        <defs>
          <linearGradient id="mapOcean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a5568" />
            <stop offset="100%" stopColor="#2d3748" />
          </linearGradient>
        </defs>
        <rect x={vbX} y={vbY} width={vbW} height={vbH} fill="url(#mapOcean)" />
        {world.locations.map((location) => (
          <path
            key={location.id}
            d={location.path}
            fill="#ffffff"
            stroke="#e8eaed"
            strokeWidth={0.35}
          />
        ))}
        {pins.map((pin) => {
          const r = pinRadius(pin.total, maxTotal);
          const isActive = active?.country === pin.country;
          return (
            <g
              key={pin.country}
              onMouseEnter={() => setActive(pin)}
              onMouseLeave={() => setActive(null)}
              className="cursor-pointer"
            >
              <circle
                cx={pin.x}
                cy={pin.y}
                r={r + 4}
                fill="var(--accent-green)"
                opacity={isActive ? 0.35 : 0.18}
              />
              <circle
                cx={pin.x}
                cy={pin.y}
                r={r}
                fill="var(--accent-green)"
                opacity={isActive ? 0.95 : 0.72}
                stroke="#ffffff"
                strokeWidth={1.25}
              />
            </g>
          );
        })}
      </svg>

      {active && (
        <div className="pointer-events-none absolute left-4 top-4 rounded-lg bg-primary/95 px-3 py-2 shadow-soft backdrop-blur-sm">
          <p className="text-xs font-semibold text-text-primary">{active.country}</p>
          <p className="tabular-nums mt-0.5 text-[11px] text-text-secondary">
            {formatNumber(active.total)} downloads
          </p>
        </div>
      )}
    </div>
  );
}

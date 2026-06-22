import WorldDownloadMap from "../components/WorldDownloadMap";
import { GEO_COUNTRIES, GEO_REGIONS, formatNumber } from "../data/mockData";

export default function GeographyPage({ filters }) {
  return (
    <div className="space-y-6">
      <section className="dashboard-card hover-lift p-5">
        <h2 className="mb-1 text-[15px] font-semibold text-text-primary">Global distribution</h2>
        <p className="mb-4 text-xs text-text-tertiary">
          Download locations by country — hover pins for totals
        </p>
        <WorldDownloadMap countries={GEO_COUNTRIES} />
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="dashboard-card hover-lift overflow-hidden p-5 lg:col-span-2">
          <h2 className="mb-4 text-[15px] font-semibold text-text-primary">Top countries</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[11px]">
              <thead>
                <tr className="text-text-tertiary">
                  <th className="pb-2 font-medium">#</th>
                  <th className="pb-2 font-medium">Country</th>
                  <th className="pb-2 font-medium">iOS</th>
                  <th className="pb-2 font-medium">Android</th>
                  <th className="pb-2 font-medium">Total</th>
                  <th className="pb-2 font-medium">Revenue</th>
                  <th className="pb-2 font-medium">Rating</th>
                </tr>
              </thead>
              <tbody>
                {GEO_COUNTRIES.map((row) => (
                  <tr key={row.country} className="nested-panel">
                    <td className="py-2 pl-2 text-text-tertiary">{row.rank}</td>
                    <td className="py-2 font-medium text-text-primary">{row.country}</td>
                    <td className="tabular-nums py-2 text-text-secondary">
                      {formatNumber(row.ios)}
                    </td>
                    <td className="tabular-nums py-2 text-text-secondary">
                      {formatNumber(row.android)}
                    </td>
                    <td className="tabular-nums py-2 font-semibold text-text-primary">
                      {formatNumber(row.ios + row.android)}
                    </td>
                    <td className="tabular-nums py-2 text-text-secondary">
                      {formatNumber(row.revenue, { prefix: "$" })}
                    </td>
                    <td className="tabular-nums py-2 text-text-secondary">★ {row.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-card hover-lift p-5">
          <h2 className="mb-4 text-[15px] font-semibold text-text-primary">By region</h2>
          <div className="space-y-3">
            {GEO_REGIONS.map((r) => (
              <div key={r.name} className="nested-panel p-3">
                <p className="text-sm font-medium text-text-primary">{r.name}</p>
                <p className="tabular-nums mt-1 text-xs text-text-secondary">
                  {formatNumber(r.downloads)} downloads
                </p>
                <p className="tabular-nums text-xs text-text-secondary">
                  {formatNumber(r.revenue, { prefix: "$" })} revenue
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

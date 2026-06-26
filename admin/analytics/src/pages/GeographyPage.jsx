import WorldDownloadMap from "../components/WorldDownloadMap";
import { GEO_COUNTRIES, GEO_REGIONS, formatNumber } from "../data/mockData";

export default function GeographyPage() {
  return (
    <div className="space-y-6">
      <section className="dashboard-card hover-lift p-8">
        <h2 className="chart-title">Global distribution</h2>
        <p className="chart-subtitle">Download locations by country — hover pins for totals</p>
        <WorldDownloadMap countries={GEO_COUNTRIES} />
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="dashboard-card hover-lift overflow-hidden p-8 lg:col-span-2">
          <h2 className="chart-title">Top countries</h2>
          <p className="chart-subtitle">Ranked by combined store downloads</p>
          <div className="overflow-x-auto">
            <table className="data-table min-w-[640px]">
              <thead>
                <tr>
                  <th className="num">#</th>
                  <th>Country</th>
                  <th className="num">iOS</th>
                  <th className="num">Android</th>
                  <th className="num">Total</th>
                  <th className="num">Revenue</th>
                  <th className="num">Rating</th>
                </tr>
              </thead>
              <tbody>
                {GEO_COUNTRIES.map((row) => (
                  <tr key={row.country}>
                    <td className="num text-text-tertiary">{row.rank}</td>
                    <td className="font-medium">{row.country}</td>
                    <td className="num text-text-secondary">{formatNumber(row.ios)}</td>
                    <td className="num text-text-secondary">{formatNumber(row.android)}</td>
                    <td className="num font-medium">{formatNumber(row.ios + row.android)}</td>
                    <td className="num text-text-secondary">
                      {formatNumber(row.revenue, { prefix: "$" })}
                    </td>
                    <td className="num text-text-secondary">{row.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-card hover-lift p-8">
          <h2 className="chart-title">By region</h2>
          <p className="chart-subtitle">Aggregated downloads and revenue</p>
          <div className="space-y-3">
            {GEO_REGIONS.map((r) => (
              <div key={r.name} className="nested-panel p-4">
                <p className="text-[15px] font-medium text-text-primary">{r.name}</p>
                <p className="stat-sublabel mt-1">{formatNumber(r.downloads)} downloads</p>
                <p className="stat-sublabel">{formatNumber(r.revenue, { prefix: "$" })} revenue</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

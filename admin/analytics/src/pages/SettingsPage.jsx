import { Key, Link2, RefreshCw } from "lucide-react";
import { StoreBadge } from "../components/shared";

const FIELDS = [
  {
    label: "App Store Connect API Key",
    placeholder: "Issuer ID · Key ID · Private key (.p8)",
    store: "apple",
  },
  {
    label: "Google Play Service Account",
    placeholder: "service-account.json",
    store: "play",
  },
  {
    label: "Firebase Crashlytics (Android)",
    placeholder: "Project ID for crash data",
    store: "play",
  },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="dashboard-card p-6">
        <h2 className="mb-1 text-[15px] font-semibold text-text-primary">API configuration</h2>
        <p className="mb-6 text-xs text-text-tertiary">
          Connect store APIs to replace mock data with live metrics. Credentials are stored
          server-side only in production.
        </p>

        <div className="space-y-5">
          {FIELDS.map((f) => (
            <div key={f.label}>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-text-secondary">
                <StoreBadge store={f.store} />
                {f.label}
              </label>
              <input
                type="text"
                placeholder={f.placeholder}
                className="w-full rounded-lg border-0 bg-black/[0.04] px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-mac-blue/50"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-accent-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#0077ED]"
          >
            <Key size={14} />
            Save credentials
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-black/[0.04] px-4 py-2 text-sm font-medium text-text-primary hover:bg-black/[0.06]"
          >
            <RefreshCw size={14} />
            Test connection
          </button>
        </div>
      </section>

      <section className="dashboard-card p-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Link2 size={15} />
          Related integrations
        </h3>
        <ul className="space-y-2 text-xs text-text-secondary">
          <li className="nested-panel px-3 py-2">AppsFlyer — real-time install attribution</li>
          <li className="nested-panel px-3 py-2">Adjust — campaign analytics</li>
          <li className="nested-panel px-3 py-2">
            Firebase Crashlytics — Android crash reports
          </li>
        </ul>
      </section>

      <p className="text-center text-[11px] text-text-tertiary">
        <a href="../index.html" className="text-accent-primary hover:underline">
          ← Back to Facility Submissions
        </a>
      </p>
    </div>
  );
}

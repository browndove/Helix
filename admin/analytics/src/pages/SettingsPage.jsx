import { Key, Link2, RefreshCw } from "lucide-react";
import Button from "../components/ui/Button";
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
      <section className="dashboard-card p-8">
        <h2 className="card-title mb-1">API configuration</h2>
        <p className="card-subtitle mb-6">
          Connect store APIs to replace mock data with live metrics. Credentials are stored
          server-side only in production.
        </p>

        <div className="space-y-5">
          {FIELDS.map((f) => (
            <div key={f.label}>
              <label className="mb-2 flex items-center gap-2 text-[15px] text-text-secondary">
                <StoreBadge store={f.store} />
                {f.label}
              </label>
              <input
                type="text"
                placeholder={f.placeholder}
                className="apple-input"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="primary" size="md">
            <Key size={16} strokeWidth={1.5} />
            Save credentials
          </Button>
          <Button variant="secondary" size="md">
            <RefreshCw size={16} strokeWidth={1.5} />
            Test connection
          </Button>
        </div>
      </section>

      <section className="dashboard-card p-8">
        <h3 className="card-title mb-4 flex items-center gap-2">
          <Link2 size={18} strokeWidth={1.5} />
          Related integrations
        </h3>
        <ul className="space-y-2 text-[15px] text-text-secondary">
          <li className="nested-panel px-4 py-3">AppsFlyer — real-time install attribution</li>
          <li className="nested-panel px-4 py-3">Adjust — campaign analytics</li>
          <li className="nested-panel px-4 py-3">
            Firebase Crashlytics — Android crash reports
          </li>
        </ul>
      </section>

      <p className="text-center text-[13px] text-text-tertiary">
        <a href="../index.html" className="text-accent-primary transition-opacity hover:opacity-75">
          ← Back to Facility Submissions
        </a>
      </p>
    </div>
  );
}

import { Settings } from "lucide-react";
import Text from "./ui/Text";
import { NAV_SECTIONS } from "./shared";

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="glass-panel flex w-[248px] shrink-0 flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <img src="./brand-logo.svg" alt="Helix" className="h-9 w-9 rounded-lg" />
        <Text as="span" variant="body-md-semibold" color="text-primary">
          Helix Analytics
        </Text>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Analytics navigation">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="eyebrow mb-1 mt-5 px-3 first:mt-2">{section.label}</p>
            {section.items.map(({ id, label, icon: Icon }) => {
              const active = activePage === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavigate(id)}
                  className={active ? "nav-item nav-item-active" : "nav-item"}
                >
                  <Icon size={18} strokeWidth={1.5} />
                  {label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--separator)] px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--fill-secondary)] text-[13px] font-semibold text-accent-primary">
            HA
          </div>
          <div className="min-w-0 flex-1">
            <Text as="p" variant="body-sm-semibold" truncate>
              Helix Admin
            </Text>
            <Text as="p" variant="caption" color="text-tertiary" truncate>
              admin@helix.health
            </Text>
          </div>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-[var(--fill-tertiary)] hover:text-text-primary"
            aria-label="Settings"
            onClick={() => onNavigate("settings")}
          >
            <Settings size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </aside>
  );
}

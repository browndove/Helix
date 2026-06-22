import { Settings } from "lucide-react";
import Text from "./ui/Text";
import { NAV_SECTIONS } from "./shared";

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-tertiary bg-primary shadow-input">
      <div className="flex items-center gap-3 px-5 py-5">
        <img src="./brand-logo.svg" alt="Helix" className="h-8 w-8 rounded-[10px]" />
        <Text as="span" variant="body-md-semibold" color="text-primary">
          Helix Analytics
        </Text>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <Text
              as="p"
              variant="body-xs-semibold"
              color="text-tertiary"
              className="mb-1 mt-5 px-3 uppercase tracking-wider first:mt-2"
            >
              {section.label}
            </Text>
            {section.items.map(({ id, label, icon: Icon }) => {
              const active = activePage === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavigate(id)}
                  className={active ? "nav-item nav-item-active" : "nav-item"}
                >
                  <Icon size={16} strokeWidth={2} />
                  {label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-tertiary px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-accent-primary">
            HA
          </div>
          <div className="min-w-0 flex-1">
            <Text as="p" variant="body-sm-semibold" truncate>
              Helix Admin
            </Text>
            <Text as="p" variant="body-xs" color="text-tertiary" truncate>
              admin@helix.health
            </Text>
          </div>
          <button
            type="button"
            className="rounded-[10px] p-2 text-text-secondary hover:bg-primary-light"
            aria-label="Settings"
            onClick={() => onNavigate("settings")}
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

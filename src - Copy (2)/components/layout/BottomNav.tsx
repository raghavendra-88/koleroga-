import { Link } from "@tanstack/react-router";

import { useT } from "@/lib/i18n";
import { mobileNavItems } from "@/components/layout/navigation";

export function BottomNav() {
  const t = useT();

  return (
    <nav
      aria-label={t("nav.home")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto grid max-w-2xl grid-cols-5">
        {mobileNavItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              activeProps={{ className: "text-primary", "aria-current": "page" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="flex min-h-16 flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            >
              <item.icon size={24} aria-hidden />
              <span className="w-full truncate text-center">{t(item.labelKey)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
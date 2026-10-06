import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { sidebarNavItems } from "@/components/layout/navigation";

export function AppSidebar() {
  const t = useT();
  const navigate = useNavigate();
  const { logout, isGuest } = useAuth();

  const handleLogout = () => {
    logout();
    void navigate({ to: "/login" });
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-border bg-sidebar px-4 py-6 lg:flex">
      <Link to="/dashboard" className="px-2" aria-label={t("app.name")}>
        <Logo />
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-1.5" aria-label={t("nav.dashboard")}>
        {sidebarNavItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeProps={{
              className: "bg-accent text-accent-foreground font-bold",
              "aria-current": "page",
            }}
            inactiveProps={{ className: "text-muted-foreground hover:bg-accent/60" }}
            className="flex h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <item.icon size={20} aria-hidden className="shrink-0" />
            <span className="truncate">{t(item.labelKey)}</span>
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex h-12 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut size={20} aria-hidden />
        <span>{isGuest ? "Exit Guest Mode" : t("profile.logout")}</span>
      </button>
    </aside>
  );
}
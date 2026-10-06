import {
  BarChart3,
  CloudSun,
  History,
  LayoutDashboard,
  ScanLine,
  Settings,
  Sprout,
  User,
  type LucideIcon,
} from "lucide-react";
import type { LinkProps } from "@tanstack/react-router";

import type { TranslationKey } from "@/lib/i18n";

export interface NavItem {
  to: LinkProps["to"];
  labelKey: TranslationKey;
  icon: LucideIcon;
}

/** Bottom navigation on phones — primary destinations. */
export const mobileNavItems: NavItem[] = [
  { to: "/dashboard", labelKey: "nav.home", icon: LayoutDashboard },
  { to: "/scan", labelKey: "nav.scan", icon: ScanLine },
  { to: "/farm", labelKey: "nav.farm", icon: Sprout },
  { to: "/weather", labelKey: "nav.weather", icon: CloudSun },
  { to: "/profile", labelKey: "nav.profile", icon: User },
];

/** Sidebar on tablet and desktop. */
export const sidebarNavItems: NavItem[] = [
  { to: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { to: "/scan", labelKey: "nav.scanner", icon: ScanLine },
  { to: "/farm", labelKey: "nav.farm", icon: Sprout },
  { to: "/weather", labelKey: "nav.weather", icon: CloudSun },
  { to: "/history", labelKey: "nav.farmHistory", icon: History },
  { to: "/reports", labelKey: "nav.reports", icon: BarChart3 },
  { to: "/settings", labelKey: "nav.settings", icon: Settings },
];
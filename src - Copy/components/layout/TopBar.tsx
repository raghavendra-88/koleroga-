import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Check, LogOut, Settings, Sprout, User } from "lucide-react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/lib/auth";
import { useLanguage, type TranslationKey } from "@/lib/i18n";

function greetingKey(): TranslationKey {
  const hour = new Date().getHours();
  if (hour < 12) return "greeting.morning";
  if (hour < 17) return "greeting.afternoon";
  return "greeting.evening";
}

export function getUserInitials(name?: string | null): string {
  if (!name || !name.trim()) return "G";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0] ? parts[0].substring(0, 2).toUpperCase() : "G";
  const first = parts[0] ? parts[0][0] : "";
  const last = parts[parts.length - 1] ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showGreeting?: boolean;
}

export function TopBar({ title, subtitle, showGreeting = false }: TopBarProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, isGuest, notifications, markNotificationRead, logout } = useAuth();

  const [greeting, setGreeting] = useState<TranslationKey>("greeting.morning");
  useEffect(() => setGreeting(greetingKey()), []);

  const displayName = isGuest ? "Guest Farmer" : user?.fullName || "Farmer";
  const initials = isGuest ? "GF" : getUserInitials(user?.fullName);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    void navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/dashboard" className="lg:hidden" aria-label={t("app.name")}>
            <Logo showWordmark={false} size="sm" />
          </Link>
          <div className="min-w-0">
            {showGreeting ? (
              <>
                <p className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
                  {t(greeting)}
                </p>
                <h1 className="truncate text-lg font-bold sm:text-xl text-foreground">
                  {displayName}
                </h1>
              </>
            ) : (
              <>
                <h1 className="truncate text-lg font-bold sm:text-xl text-foreground">{title}</h1>
                {subtitle && (
                  <p className="truncate text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageToggle />
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Notifications Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="soft"
                size="icon"
                className="relative rounded-full"
                aria-label={t("dash.alerts")}
              >
                <Bell aria-hidden size={18} />
                {unreadCount > 0 && (
                  <span
                    aria-hidden
                    className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-card animate-pulse"
                  />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 rounded-2xl p-4 shadow-xl" align="end">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h4 className="text-sm font-bold">Notifications</h4>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="py-4 text-center text-xs text-muted-foreground">
                    You're all caught up! No notifications.
                  </p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`cursor-pointer rounded-xl p-3 text-xs transition-colors ${
                        notif.read ? "bg-accent/30 text-muted-foreground" : "bg-primary/10 text-foreground font-medium"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{notif.title}</span>
                        {!notif.read && <Check size={12} className="text-primary" />}
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="shrink-0 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-10 w-10 border-2 border-primary/30 transition-transform hover:scale-105">
                  <AvatarFallback className="bg-primary/15 text-xs font-extrabold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-2xl p-2 shadow-xl" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {isGuest ? "Guest User" : user?.email || "Arecanut Grower"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                <Link to="/profile" className="flex items-center gap-2">
                  <User size={16} />
                  <span>Profile Overview</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                <Link to="/farm" className="flex items-center gap-2">
                  <Sprout size={16} />
                  <span>My Farm Details</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                <Link to="/settings" className="flex items-center gap-2">
                  <Settings size={16} />
                  <span>Account Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="rounded-xl cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut size={16} className="mr-2" />
                <span>{isGuest ? "Exit Guest Mode" : t("profile.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
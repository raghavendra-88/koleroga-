import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CloudRain, Info, Key, Languages, Lock, Moon, ShieldAlert, Sprout, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/common/PageTransition";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useT, type TranslationKey } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Koleroga AI" },
      {
        name: "description",
        content:
          "Choose your language, appearance and the disease, rainfall and scheme alerts you want to receive.",
      },
      { property: "og:title", content: "Settings — Koleroga AI" },
      { property: "og:description", content: "Language, appearance and alert preferences." },
    ],
  }),
  component: SettingsPage,
});

const alertToggles: { id: string; labelKey: TranslationKey; icon: typeof ShieldAlert }[] = [
  { id: "disease", labelKey: "settings.diseaseAlerts", icon: ShieldAlert },
  { id: "weather", labelKey: "settings.weatherAlerts", icon: CloudRain },
  { id: "scheme", labelKey: "settings.schemeAlerts", icon: Sprout },
];

function SettingsPage() {
  const t = useT();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { user, isGuest, changePassword, deleteAccount } = useAuth();

  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    disease: true,
    weather: true,
    scheme: false,
  });

  const [changePassOpen, setChangePassOpen] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passLoading, setPassLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPass !== confirmPass) {
      toast.error("New passwords do not match.");
      return;
    }

    setPassLoading(true);
    const res = await changePassword(oldPass, newPass);
    setPassLoading(false);

    if (res.success) {
      toast.success("Password changed successfully!");
      setChangePassOpen(false);
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
    } else {
      toast.error(res.error || "Failed to change password.");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to permanently delete your Koleroga AI account and farm history?")) {
      await deleteAccount();
      toast.info("Your account has been deleted.");
      void navigate({ to: "/welcome" });
    }
  };

  return (
    <AppShell title={t("settings.title")}>
      <PageTransition className="mx-auto max-w-3xl space-y-5">
        <section className="surface-card divide-y divide-border" aria-label={t("settings.appearance")}>
          <h2 className="p-5 pb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            {t("settings.appearance")}
          </h2>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-5">
            <span className="flex min-w-0 items-center gap-3 font-semibold">
              <Languages size={20} aria-hidden className="shrink-0 text-primary" />
              <span className="truncate">{t("profile.language")}</span>
            </span>
            <LanguageToggle />
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-5">
            <label
              htmlFor="settings-dark"
              className="flex min-w-0 items-center gap-3 font-semibold cursor-pointer"
            >
              <Moon size={20} aria-hidden className="shrink-0 text-primary" />
              <span className="truncate">{t("profile.darkMode")}</span>
            </label>
            <Switch id="settings-dark" checked={isDark} onCheckedChange={toggleTheme} />
          </div>
        </section>

        <section
          className="surface-card divide-y divide-border"
          aria-label={t("settings.alertsSection")}
        >
          <h2 className="p-5 pb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            {t("settings.alertsSection")}
          </h2>
          {alertToggles.map((toggle) => (
            <div
              key={toggle.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-5"
            >
              <label
                htmlFor={`toggle-${toggle.id}`}
                className="flex min-w-0 items-center gap-3 font-semibold cursor-pointer"
              >
                <toggle.icon size={20} aria-hidden className="shrink-0 text-primary" />
                <span className="truncate">{t(toggle.labelKey)}</span>
              </label>
              <Switch
                id={`toggle-${toggle.id}`}
                checked={enabled[toggle.id] ?? false}
                onCheckedChange={(value) =>
                  setEnabled((prev) => ({ ...prev, [toggle.id]: value }))
                }
              />
            </div>
          ))}
        </section>

        {!isGuest && user && (
          <section className="surface-card p-5 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Security & Password
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Key className="text-primary" size={20} />
                <div>
                  <p className="text-sm font-bold">Change Password</p>
                  <p className="text-xs text-muted-foreground">Update your login security credentials</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setChangePassOpen(true)}>
                <Lock size={14} className="mr-1.5" />
                Update Password
              </Button>
            </div>
          </section>
        )}

        {!isGuest && user && (
          <section className="surface-card p-5 border-l-4 border-l-destructive space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-destructive">
              Danger Zone
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">Delete Farm Account</p>
                <p className="text-xs text-muted-foreground">Permanently delete your profile and all saved disease scans</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleDelete} className="text-destructive border-destructive/40 hover:bg-destructive/10">
                <Trash2 size={14} className="mr-1.5" />
                Delete Account
              </Button>
            </div>
          </section>
        )}

        <section className="surface-card p-5" aria-label={t("settings.aboutApp")}>
          <Logo />
          <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
            <Info size={18} aria-hidden className="mt-0.5 shrink-0" />
            {t("app.tagline")} · {t("settings.version")}
          </p>
        </section>

        {/* Change Password Modal */}
        <Dialog open={changePassOpen} onOpenChange={setChangePassOpen}>
          <DialogContent className="rounded-3xl sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Change Account Password</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleChangePassword} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground">
                  Current Password
                </label>
                <Input
                  type="password"
                  required
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  className="mt-1 h-11 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground">
                  New Password (min 6 chars)
                </label>
                <Input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="mt-1 h-11 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="mt-1 h-11 rounded-xl text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <Button type="button" variant="outline" onClick={() => setChangePassOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="hero" disabled={passLoading}>
                  {passLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageTransition>
    </AppShell>
  );
}
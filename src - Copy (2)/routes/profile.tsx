import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Building2,
  ChevronRight,
  FileText,
  Info,
  LogOut,
  Mail,
  MapPin,
  Moon,
  Pencil,
  Phone,
  Ruler,
  ScanLine,
  ShieldCheck,
  Trees,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/common/PageTransition";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth, getUserInitials } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Farmer Profile — Koleroga AI" },
      {
        name: "description",
        content:
          "Your farm details, language preference, dark mode, notification settings and saved report count.",
      },
      { property: "og:title", content: "Farmer Profile — Koleroga AI" },
      { property: "og:description", content: "Manage your farm profile and app preferences." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { user, farm, scans, updateProfile, updateFarm, logout, isGuest } = useAuth();

  const [editOpen, setEditOpen] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [farmName, setFarmName] = useState(farm?.farmName || "");
  const [village, setVillage] = useState(farm?.village || "");
  const [plantationArea, setPlantationArea] = useState(farm?.plantationArea || "");
  const [plantCount, setPlantCount] = useState(farm?.plantCount || 650);
  const [saving, setSaving] = useState(false);

  const displayName = isGuest ? "Guest Farmer" : user?.fullName || "Farmer";
  const initials = isGuest ? "GF" : getUserInitials(user?.fullName);

  const stats = [
    { icon: Trees, label: t("profile.trees"), value: String(farm?.plantCount || 650) },
    { icon: ScanLine, label: t("profile.scans"), value: String(scans.length) },
    { icon: FileText, label: t("profile.saved"), value: String(scans.length) },
  ];

  const links = [
    { icon: Bell, label: t("profile.notifications"), to: "/settings" as const },
    { icon: Info, label: t("profile.about"), to: "/settings" as const },
    { icon: ShieldCheck, label: t("profile.privacy"), to: "/settings" as const },
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (user) {
      await updateProfile({ fullName, phone });
    }
    await updateFarm({
      farmName: farmName || `${fullName}'s Plantation`,
      village,
      plantationArea,
      plantCount: Number(plantCount) || 500,
    });
    setSaving(false);
    setEditOpen(false);
    toast.success("Profile and farm details updated!");
  };

  const handleLogout = () => {
    logout();
    void navigate({ to: "/login" });
  };

  return (
    <AppShell title={t("profile.title")}>
      <PageTransition className="mx-auto max-w-3xl space-y-5">
        <section className="surface-card p-6">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-md">
              <AvatarFallback className="bg-primary/15 text-2xl font-extrabold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-2xl font-extrabold">{displayName}</h2>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                <MapPin size={16} aria-hidden />
                {farm?.village || "Shivamogga"}, {farm?.district || "Karnataka"}
              </p>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                <Building2 size={16} aria-hidden />
                {farm?.farmName || "Arecanut Plantation"}
              </p>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                <Ruler size={16} aria-hidden />
                {t("profile.farmSize")}: {farm?.plantationArea || "3.5 acres"}
              </p>
            </div>
            {!isGuest && (
              <Button
                variant="soft"
                size="lg"
                onClick={() => {
                  setFullName(user?.fullName || "");
                  setPhone(user?.phone || "");
                  setFarmName(farm?.farmName || "");
                  setVillage(farm?.village || "");
                  setPlantationArea(farm?.plantationArea || "");
                  setPlantCount(farm?.plantCount || 650);
                  setEditOpen(true);
                }}
                className="shrink-0"
              >
                <Pencil aria-hidden />
                {t("profile.edit")}
              </Button>
            )}
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-accent/60 p-4 text-center">
                <stat.icon size={20} aria-hidden className="mx-auto text-primary" />
                <dd className="mt-2 text-xl font-bold">{stat.value}</dd>
                <dt className="text-xs text-muted-foreground">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        {/* Account Details Card */}
        {!isGuest && user && (
          <section className="surface-card p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Registered Contact Info
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div className="flex items-center gap-3 rounded-xl bg-accent/30 p-3">
                <Mail size={18} className="text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-semibold truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-accent/30 p-3">
                <Phone size={18} className="text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Mobile Phone</p>
                  <p className="font-semibold truncate">{user.phone || "Not provided"}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="surface-card divide-y divide-border">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-5">
            <p className="truncate font-semibold">{t("profile.language")}</p>
            <LanguageToggle />
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-5">
            <label htmlFor="dark-mode" className="flex min-w-0 items-center gap-3 font-semibold cursor-pointer">
              <Moon size={20} aria-hidden className="shrink-0 text-primary" />
              <span className="truncate">{t("profile.darkMode")}</span>
            </label>
            <Switch id="dark-mode" checked={isDark} onCheckedChange={toggleTheme} />
          </div>
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-5 transition-colors hover:bg-accent/50"
            >
              <span className="flex min-w-0 items-center gap-3 font-semibold">
                <link.icon size={20} aria-hidden className="shrink-0 text-primary" />
                <span className="truncate">{link.label}</span>
              </span>
              <ChevronRight size={18} aria-hidden className="text-muted-foreground" />
            </Link>
          ))}
        </section>

        <Button
          variant="outline"
          size="xl"
          onClick={handleLogout}
          className="w-full text-destructive hover:bg-destructive/10"
        >
          <LogOut aria-hidden />
          {isGuest ? "Exit Guest Mode" : t("profile.logout")}
        </Button>

        {/* Edit Profile Modal */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="rounded-3xl sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Farmer Profile</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground">
                  Full Name
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 h-11 rounded-xl text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground">
                  Phone Number
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 h-11 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground">
                  Farm Name
                </label>
                <Input
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="mt-1 h-11 rounded-xl text-sm"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground">
                    Village / Town
                  </label>
                  <Input
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="mt-1 h-11 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground">
                    Area (acres)
                  </label>
                  <Input
                    value={plantationArea}
                    onChange={(e) => setPlantationArea(e.target.value)}
                    className="mt-1 h-11 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="hero" disabled={saving}>
                  {saving ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageTransition>
    </AppShell>
  );
}
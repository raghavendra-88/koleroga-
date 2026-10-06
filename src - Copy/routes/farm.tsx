import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  MapPin,
  Pencil,
  Ruler,
  Sprout,
  Trees,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/common/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/farm")({
  head: () => ({
    meta: [
      { title: "My Farm — Koleroga AI" },
      {
        name: "description",
        content: "Arecanut plantation details, total trees, location, and health monitoring.",
      },
    ],
  }),
  component: FarmPage,
});

function FarmPage() {
  const t = useT();
  const { farm, user, scans, updateFarm } = useAuth();

  const [editOpen, setEditOpen] = useState(false);
  const [farmName, setFarmName] = useState(farm?.farmName || "Arecanut Plantation");
  const [village, setVillage] = useState(farm?.village || "Shivamogga");
  const [district, setDistrict] = useState(farm?.district || "Shivamogga");
  const [state, setState] = useState(farm?.state || "Karnataka");
  const [plantationArea, setPlantationArea] = useState(farm?.plantationArea || "3.5 acres");
  const [plantCount, setPlantCount] = useState(farm?.plantCount || 650);
  const [saving, setSaving] = useState(false);

  // Compute farm health metrics
  const totalScans = scans.length;
  const diseasedScans = scans.filter((s) => s.diseaseCode !== "healthy").length;
  const healthyScans = totalScans - diseasedScans;
  const healthPercent = totalScans > 0 ? Math.round((healthyScans / totalScans) * 100) : 92;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateFarm({
      farmName,
      village,
      district,
      state,
      plantationArea,
      plantCount: Number(plantCount) || 500,
    });
    setSaving(false);
    setEditOpen(false);
    toast.success("Farm details updated successfully!");
  };

  return (
    <AppShell title={t("farm.title")} subtitle={t("farm.sub")}>
      <PageTransition className="space-y-6">
        {/* Farm Hero Card */}
        <section className="surface-card p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                <Sprout size={32} />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  <Building2 size={13} />
                  Active Arecanut Estate
                </span>
                <h1 className="text-2xl font-extrabold sm:text-3xl">
                  {farm?.farmName || `${user?.fullName || "Farmer"}'s Arecanut Plantation`}
                </h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin size={16} />
                  {farm?.village || "Shivamogga"}, {farm?.district || "Shivamogga"}, {farm?.state || "Karnataka"}
                </p>
              </div>
            </div>

            <Button
              variant="soft"
              size="lg"
              onClick={() => {
                setFarmName(farm?.farmName || "");
                setVillage(farm?.village || "");
                setDistrict(farm?.district || "");
                setState(farm?.state || "");
                setPlantationArea(farm?.plantationArea || "");
                setPlantCount(farm?.plantCount || 650);
                setEditOpen(true);
              }}
              className="shrink-0"
            >
              <Pencil size={18} />
              {t("profile.edit")}
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl bg-accent/60 p-4">
              <Trees size={22} className="text-primary" />
              <p className="mt-2 text-2xl font-bold">{farm?.plantCount || 650}</p>
              <p className="text-xs text-muted-foreground">Arecanut Palms</p>
            </div>

            <div className="rounded-2xl bg-accent/60 p-4">
              <Ruler size={22} className="text-primary" />
              <p className="mt-2 text-2xl font-bold">{farm?.plantationArea || "3.5 acres"}</p>
              <p className="text-xs text-muted-foreground">Plantation Area</p>
            </div>

            <div className="rounded-2xl bg-accent/60 p-4">
              <Activity size={22} className="text-primary" />
              <p className="mt-2 text-2xl font-bold">{healthPercent}%</p>
              <p className="text-xs text-muted-foreground">Overall Health Index</p>
            </div>

            <div className="rounded-2xl bg-accent/60 p-4">
              <CheckCircle2 size={22} className="text-primary" />
              <p className="mt-2 text-2xl font-bold">{totalScans}</p>
              <p className="text-xs text-muted-foreground">Total Scans Recorded</p>
            </div>
          </div>
        </section>

        {/* Plantation Status Breakdown */}
        <div className="grid gap-6 md:grid-cols-2">
          <section className="surface-card p-6">
            <h2 className="text-lg font-bold">Plantation Health Summary</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Based on historical disease scans and weather risk indicators
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-accent/40 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-success" size={20} />
                  <div>
                    <p className="text-sm font-bold">Healthy Palms Ratio</p>
                    <p className="text-xs text-muted-foreground">{healthyScans} scans verified clean</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-success">{healthPercent}%</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-accent/40 p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-destructive" size={20} />
                  <div>
                    <p className="text-sm font-bold">Diseased / Rot Cases</p>
                    <p className="text-xs text-muted-foreground">{diseasedScans} scans flagged for Koleroga</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-destructive">
                  {totalScans > 0 ? Math.round((diseasedScans / totalScans) * 100) : 8}%
                </span>
              </div>
            </div>
          </section>

          <section className="surface-card p-6">
            <h2 className="text-lg font-bold">Recommended Prophylactic Schedule</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Malnad Arecanut Agricultural Board Standards
            </p>

            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3 rounded-xl border border-border p-3.5 text-xs">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/20 font-bold text-primary">
                  1
                </span>
                <div>
                  <p className="font-semibold text-foreground">Pre-Monsoon Bordeaux Spray (1%)</p>
                  <p className="text-muted-foreground mt-0.5">Apply thoroughly before heavy rains begin in June.</p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-border p-3.5 text-xs">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/20 font-bold text-primary">
                  2
                </span>
                <div>
                  <p className="font-semibold text-foreground">Bunch Polythene Covering</p>
                  <p className="text-muted-foreground mt-0.5">Tie protective plastic bags over heavy bearing bunches.</p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-border p-3.5 text-xs">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/20 font-bold text-primary">
                  3
                </span>
                <div>
                  <p className="font-semibold text-foreground">Second Spraying (40–45 Days Later)</p>
                  <p className="text-muted-foreground mt-0.5">Repeat fungicide spray during monsoon rain breaks.</p>
                </div>
              </li>
            </ul>
          </section>
        </div>

        {/* Edit Farm Modal */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="rounded-3xl sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{t("farm.editTitle")}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground">
                  Farm Name
                </label>
                <Input
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="mt-1 h-11 rounded-xl text-sm"
                  required
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
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground">
                    District
                  </label>
                  <Input
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="mt-1 h-11 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground">
                    Plantation Area
                  </label>
                  <Input
                    value={plantationArea}
                    onChange={(e) => setPlantationArea(e.target.value)}
                    className="mt-1 h-11 rounded-xl text-sm"
                    placeholder="3.5 acres"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground">
                    Number of Arecanut Plants
                  </label>
                  <Input
                    type="number"
                    value={plantCount}
                    onChange={(e) => setPlantCount(Number(e.target.value))}
                    className="mt-1 h-11 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditOpen(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button type="submit" variant="hero" disabled={saving}>
                  {saving ? "Saving..." : t("common.save")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageTransition>
    </AppShell>
  );
}

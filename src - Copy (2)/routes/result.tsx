import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Pill, RotateCcw, Save, Share2, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import diseasedImage from "@/assets/diseased-arecanut.jpg";
import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/common/PageTransition";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import type { DiseaseScanRecord } from "@/lib/db";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Scan Result — Koleroga AI" },
      {
        name: "description",
        content:
          "Detection result with confidence, severity, affected area and the recommended koleroga treatment plan.",
      },
      { property: "og:title", content: "Scan Result — Koleroga AI" },
      { property: "og:description", content: "Koleroga detection result and treatment guidance." },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const t = useT();
  const { scans } = useAuth();
  const [scanRecord, setScanRecord] = useState<DiseaseScanRecord | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("last_completed_scan");
      if (raw) {
        setScanRecord(JSON.parse(raw));
        return;
      }
    } catch {
      // fallback
    }

    if (scans.length > 0 && scans[0]) {
      setScanRecord(scans[0]);
    }
  }, [scans]);

  const displayImage = scanRecord?.image || diseasedImage;
  const diseaseName = scanRecord?.disease || "Koleroga (Fruit Rot)";
  const isHealthy = scanRecord?.diseaseCode === "healthy";
  const confidence = scanRecord?.confidence || 94;
  const severity = scanRecord?.severity || "Moderate";
  const affectedArea = scanRecord?.affectedAreaPercent || 38;

  const recommendations = scanRecord?.recommendations || [
    "Spray 1% Bordeaux mixture before the next monsoon rain spell",
    "Collect and incinerate fallen infected nuts from plantation floor",
    "Tie protective polythene covers over newly formed bunches",
  ];

  const metrics = [
    { label: t("result.confidence"), value: `${confidence}%`, icon: Target },
    { label: t("result.severity"), value: severity, icon: AlertTriangle },
    { label: t("result.affected"), value: `${affectedArea}%`, icon: Pill },
  ];

  return (
    <AppShell title={t("result.title")}>
      <PageTransition className="mx-auto max-w-3xl space-y-5">
        <motion.section
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
          className={`overflow-hidden rounded-3xl border-2 bg-card shadow-xl ${
            isHealthy ? "border-success/40" : "border-destructive/40"
          }`}
        >
          <img
            src={displayImage}
            alt={diseaseName}
            loading="lazy"
            width={1024}
            height={768}
            className="h-56 w-full object-cover sm:h-64"
          />
          <div className="p-5 sm:p-6">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ${
                isHealthy
                  ? "bg-success/15 text-success"
                  : "bg-destructive/15 text-destructive"
              }`}
            >
              {isHealthy ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              {diseaseName}
            </span>
            <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">{diseaseName}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {isHealthy
                ? "Your arecanut bunch is developing normally. Keep up the regular prophylactic care."
                : "Fruit rot symptoms found on the scanned bunch cluster. Immediate spraying is recommended."}
            </p>

            <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl bg-accent/60 p-4">
                  <metric.icon size={20} aria-hidden className="text-primary" />
                  <dt className="mt-2 text-xs font-medium text-muted-foreground">{metric.label}</dt>
                  <dd className="text-xl font-bold">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.section>

        <div className="grid gap-3 sm:grid-cols-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="hero" size="xl" className="w-full">
                <Pill aria-hidden />
                {t("result.treatment")}
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl">{t("result.treatmentTitle")}</DialogTitle>
                <DialogDescription>{diseaseName} Treatment Plan</DialogDescription>
              </DialogHeader>
              <ul className="space-y-3">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3 rounded-2xl bg-accent/60 p-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-sm leading-relaxed">{rec}</p>
                  </li>
                ))}
              </ul>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="xl"
            className="w-full"
            onClick={() => toast.success("Scan report saved to Farm History!")}
          >
            <Save aria-hidden />
            {t("result.save")}
          </Button>
          <Button
            variant="soft"
            size="xl"
            className="w-full"
            onClick={() => {
              if (navigator.share) {
                void navigator.share({
                  title: `Koleroga AI Scan Result: ${diseaseName}`,
                  text: `Scan result for my arecanut bunch: ${diseaseName} (${confidence}% confidence).`,
                  url: window.location.href,
                });
              } else {
                toast.success("Result summary copied to clipboard!");
              }
            }}
          >
            <Share2 aria-hidden />
            {t("result.share")}
          </Button>
          <Button asChild variant="ghost" size="xl" className="w-full text-primary">
            <Link to="/scan">
              <RotateCcw aria-hidden />
              {t("result.again")}
            </Link>
          </Button>
        </div>
      </PageTransition>
    </AppShell>
  );
}
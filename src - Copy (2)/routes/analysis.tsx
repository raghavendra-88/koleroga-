import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/common/PageTransition";
import { useT, type TranslationKey } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { analyzeArecanutImage, createScanRecordFromAnalysis } from "@/lib/ai-scanner";
import diseasedImage from "@/assets/diseased-arecanut.jpg";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title: "Analysing Scan — Koleroga AI" },
      {
        name: "description",
        content: "Your arecanut photo is being checked for koleroga symptoms and severity.",
      },
      { property: "og:title", content: "Analysing Scan — Koleroga AI" },
      { property: "og:description", content: "Symptom check and severity estimate in progress." },
    ],
  }),
  component: AnalysisPage,
});

const steps: TranslationKey[] = [
  "analysis.step1",
  "analysis.step2",
  "analysis.step3",
  "analysis.step4",
];

const CIRCUMFERENCE = 2 * Math.PI * 76;

function AnalysisPage() {
  const t = useT();
  const navigate = useNavigate();
  const { user, addScanRecord } = useAuth();
  const [progress, setProgress] = useState(4);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 3));
    }, 80);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 100) return;

    async function processAndSave() {
      const storedImage = sessionStorage.getItem("pending_scan_image") || diseasedImage;
      const analysisResult = await analyzeArecanutImage(storedImage);
      const userId = user?.id || "guest_user";
      const record = createScanRecordFromAnalysis(
        userId,
        storedImage,
        analysisResult,
        "North Plot · Arecanut Block 1"
      );

      if (user) {
        await addScanRecord(record);
      }

      sessionStorage.setItem("last_completed_scan", JSON.stringify(record));
      void navigate({ to: "/result" });
    }

    const timer = window.setTimeout(() => {
      void processAndSave();
    }, 400);

    return () => window.clearTimeout(timer);
  }, [progress, navigate, user, addScanRecord]);

  const activeStep = Math.min(steps.length - 1, Math.floor(progress / 25));

  return (
    <AppShell title={t("analysis.title")} subtitle={t("analysis.hint")}>
      <PageTransition className="mx-auto flex max-w-xl flex-col items-center py-6">
        <div className="relative h-52 w-52">
          <svg viewBox="0 0 176 176" className="h-full w-full -rotate-90" aria-hidden>
            <circle cx="88" cy="88" r="76" fill="none" stroke="var(--color-muted)" strokeWidth="12" />
            <circle
              cx="88"
              cy="88"
              r="76"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - progress / 100)}
              style={{ transition: "stroke-dashoffset 120ms linear" }}
            />
          </svg>
          <div
            className="absolute inset-0 grid place-items-center"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t("analysis.title")}
          >
            <div className="text-center">
              <p className="text-4xl font-extrabold tabular-nums">{progress}%</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">{t("scan.title")}</p>
            </div>
          </div>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        <h2 className="mt-8 text-center text-xl font-bold">{t("analysis.title")}</h2>

        <ul className="mt-6 w-full space-y-3">
          {steps.map((step, index) => {
            const done = index < activeStep || progress === 100;
            const active = index === activeStep && progress < 100;
            return (
              <li
                key={step}
                className={cn(
                  "surface-card flex items-center gap-3 p-4 transition-opacity",
                  !done && !active && "opacity-55",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                    done ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground",
                  )}
                >
                  {done ? (
                    <Check size={20} />
                  ) : (
                    <Loader2 size={20} className={active ? "animate-spin" : ""} />
                  )}
                </span>
                <p className="min-w-0 truncate text-sm font-semibold">{t(step)}</p>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-center text-sm text-muted-foreground">{t("analysis.hint")}</p>
      </PageTransition>
    </AppShell>
  );
}
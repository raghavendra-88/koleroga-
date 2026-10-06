import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BadgeIndianRupee,
  BarChart3,
  Bell,
  CloudSun,
  Lightbulb,
  ScanLine,
  Sprout,
  Trees,
} from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { PageTransition, staggerContainer, staggerItem } from "@/components/common/PageTransition";
import { SectionHeading } from "@/components/common/SectionHeading";
import { QuickActionCard } from "@/components/cards/QuickActionCard";
import { ScanRecordCard } from "@/components/cards/ScanRecordCard";
import { WeatherSummaryCard } from "@/components/cards/WeatherSummaryCard";
import { Button } from "@/components/ui/button";
import { alerts, dailyTips, schemes } from "@/data/mock";
import { localized, useLanguage } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Farm Dashboard — Koleroga AI" },
      {
        name: "description",
        content:
          "Daily weather risk, latest koleroga detections, farming tips and government scheme updates for your arecanut plantation.",
      },
      { property: "og:title", content: "Farm Dashboard — Koleroga AI" },
      {
        property: "og:description",
        content: "Weather risk, recent scans and alerts for your arecanut farm.",
      },
    ],
  }),
  component: DashboardPage,
});

const alertTone = {
  low: "border-l-success",
  moderate: "border-l-warning",
  high: "border-l-destructive",
} as const;

function DashboardPage() {
  const { t, language } = useLanguage();
  const { scans } = useAuth();
  const latestScan = scans.length > 0 ? scans[0] : null;

  return (
    <AppShell showGreeting>
      <PageTransition className="space-y-8">
        <WeatherSummaryCard />

        <section className="space-y-4">
          <SectionHeading icon={Sprout} title={t("dash.quickActions")} />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
          >
            <motion.div variants={staggerItem}>
              <QuickActionCard
                icon={ScanLine}
                label={t("dash.scanDisease")}
                description={t("scan.sub")}
                to="/scan"
                tone="primary"
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <QuickActionCard
                icon={CloudSun}
                label={t("nav.weather")}
                description={t("weather.sub")}
                to="/weather"
                tone="sky"
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <QuickActionCard
                icon={Trees}
                label={t("dash.myFarm")}
                description={t("farm.sub")}
                to="/farm"
                tone="leaf"
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <QuickActionCard
                icon={BarChart3}
                label={t("nav.reports")}
                description={t("reports.sub")}
                to="/reports"
                tone="warning"
              />
            </motion.div>
          </motion.div>
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="space-y-4">
            <SectionHeading
              icon={ScanLine}
              title={t("dash.recentDetection")}
              action={
                <Button asChild variant="ghost" size="sm">
                  <Link to="/history">{t("common.viewAll")}</Link>
                </Button>
              }
            />
            {latestScan ? (
              <ScanRecordCard record={latestScan} />
            ) : (
              <div className="surface-card flex flex-col items-center justify-center p-8 text-center">
                <ScanLine size={40} className="text-muted-foreground/60" />
                <h3 className="mt-3 text-base font-bold">No disease scans yet</h3>
                <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                  Scan your first arecanut bunch to start tracking your plantation health and Koleroga risk.
                </p>
                <Button asChild variant="hero" size="sm" className="mt-4">
                  <Link to="/scan">{t("dash.scanDisease")}</Link>
                </Button>
              </div>
            )}
          </section>

          <section className="space-y-4">
            <SectionHeading icon={Lightbulb} title={t("dash.tips")} />
            <div className="space-y-3">
              {dailyTips.map((tip) => (
                <article key={tip.id} className="surface-card p-5">
                  <h3 className="text-base font-bold">{localized(language, tip.title)}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {localized(language, tip.body)}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="space-y-4">
          <SectionHeading icon={Bell} title={t("dash.alerts")} />
          <div className="grid gap-3 md:grid-cols-2">
            {alerts.map((alert) => (
              <article
                key={alert.id}
                className={cn("surface-card border-l-4 p-5", alertTone[alert.level])}
              >
                <h3 className="text-base font-bold">{localized(language, alert.title)}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {localized(language, alert.detail)}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeading icon={BadgeIndianRupee} title={t("dash.schemes")} />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {schemes.map((scheme) => (
              <article key={scheme.id} className="surface-card flex flex-col gap-3 p-5">
                <div>
                  <h3 className="text-base font-bold">{localized(language, scheme.name)}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {localized(language, scheme.benefit)}
                  </p>
                  <p className="mt-2 text-xs font-medium text-primary">
                    {localized(language, scheme.department)}
                  </p>
                </div>
                <Button variant="soft" size="sm" className="mt-auto self-start">
                  {t("dash.applyNow")}
                </Button>
              </article>
            ))}
          </div>
        </section>
      </PageTransition>
    </AppShell>
  );
}
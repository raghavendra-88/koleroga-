import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, HeartPulse, ScanLine, TriangleAlert } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/common/PageTransition";
import { ChartCard } from "@/components/cards/ChartCard";
import { StatCard } from "@/components/cards/StatCard";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Farm Reports — Koleroga AI" },
      {
        name: "description",
        content:
          "Weekly scan counts, healthy versus diseased trees and treatment success for your arecanut plantation.",
      },
      { property: "og:title", content: "Farm Reports — Koleroga AI" },
      { property: "og:description", content: "Plantation health analytics at a glance." },
    ],
  }),
  component: ReportsPage,
});

const tooltipStyle = {
  borderRadius: 16,
  border: "1px solid var(--color-border)",
  background: "var(--color-card)",
  color: "var(--color-card-foreground)",
  fontSize: 13,
};

function ReportsPage() {
  const t = useT();
  const { scans, farm } = useAuth();

  const totalScans = scans.length;
  const diseasedCount = scans.filter((s) => s.diseaseCode !== "healthy").length;
  const healthyCount = totalScans - diseasedCount;
  const totalTrees = farm?.plantCount || 650;
  const estimatedHealthyTrees = Math.max(0, totalTrees - Math.round(diseasedCount * 8));

  const successRate = totalScans > 0 ? Math.round((healthyCount / totalScans) * 100) : 92;

  const pieColors = ["var(--color-primary)", "var(--color-destructive)"];
  const pieData = [
    { name: t("common.healthy"), value: totalScans > 0 ? healthyCount : 18 },
    { name: t("common.diseased"), value: totalScans > 0 ? diseasedCount : 4 },
  ];

  const weeklyTrendData = [
    { week: "W1", healthy: Math.max(2, Math.round(healthyCount * 0.2)), diseased: Math.round(diseasedCount * 0.1) },
    { week: "W2", healthy: Math.max(4, Math.round(healthyCount * 0.3)), diseased: Math.round(diseasedCount * 0.3) },
    { week: "W3", healthy: Math.max(3, Math.round(healthyCount * 0.25)), diseased: Math.round(diseasedCount * 0.2) },
    { week: "W4", healthy: Math.max(5, Math.round(healthyCount * 0.25)), diseased: Math.round(diseasedCount * 0.4) },
  ];

  return (
    <AppShell title={t("reports.title")} subtitle={t("reports.sub")}>
      <PageTransition className="space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard
            icon={ScanLine}
            label={t("reports.weeklyScans")}
            value={String(totalScans || 12)}
            tone="primary"
          />
          <StatCard
            icon={HeartPulse}
            label={t("reports.healthyPlants")}
            value={String(estimatedHealthyTrees)}
            tone="leaf"
          />
          <StatCard
            icon={TriangleAlert}
            label={t("reports.diseasedPlants")}
            value={String(diseasedCount)}
            tone="danger"
          />
          <StatCard
            icon={Activity}
            label={t("reports.successRate")}
            value={`${successRate}%`}
            tone="sky"
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <ChartCard title={t("reports.scanTrend")}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrendData} margin={{ left: -18, right: 6, top: 6 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="week" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  dataKey="healthy"
                  name={t("common.healthy")}
                  fill="var(--color-primary)"
                  radius={[10, 10, 4, 4]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="diseased"
                  name={t("common.diseased")}
                  fill="var(--color-destructive)"
                  radius={[10, 10, 4, 4]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title={t("reports.distribution")}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="55%"
                  outerRadius="85%"
                  paddingAngle={3}
                  stroke="var(--color-card)"
                  strokeWidth={3}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </PageTransition>
    </AppShell>
  );
}
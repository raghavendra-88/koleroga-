import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CloudRain, Droplets, Thermometer, Wind } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/common/PageTransition";
import { RiskMeter } from "@/components/common/RiskMeter";
import { ChartCard } from "@/components/cards/ChartCard";
import { StatCard } from "@/components/cards/StatCard";
import { WeatherSummaryCard } from "@/components/cards/WeatherSummaryCard";
import { currentWeather, hourlyForecast, weeklyRainfall } from "@/data/mock";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/weather")({
  head: () => ({
    meta: [
      { title: "Plantation Weather — Koleroga AI" },
      {
        name: "description",
        content:
          "Hourly and weekly plantation weather with a koleroga risk meter driven by humidity and rainfall.",
      },
      { property: "og:title", content: "Plantation Weather — Koleroga AI" },
      {
        property: "og:description",
        content: "Rainfall, humidity and disease risk for arecanut growers.",
      },
    ],
  }),
  component: WeatherPage,
});

const tooltipStyle = {
  borderRadius: 16,
  border: "1px solid var(--color-border)",
  background: "var(--color-card)",
  color: "var(--color-card-foreground)",
  fontSize: 13,
};

function WeatherPage() {
  const t = useT();
  const { farm } = useAuth();
  const locationSubtitle = `Plantation forecast for ${farm?.village || "Thirthahalli"}, ${farm?.district || "Shivamogga"}`;

  return (
    <AppShell title={t("weather.title")} subtitle={locationSubtitle}>
      <PageTransition className="space-y-6">
        <WeatherSummaryCard />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard
            icon={Thermometer}
            label={t("dash.temperature")}
            value={`${currentWeather.temperatureC}°C`}
            tone="warning"
          />
          <StatCard
            icon={Droplets}
            label={t("dash.humidity")}
            value={`${currentWeather.humidityPercent}%`}
            tone="sky"
          />
          <StatCard
            icon={Wind}
            label={t("weather.wind")}
            value={`${currentWeather.windKph} km/h`}
            tone="leaf"
          />
          <StatCard
            icon={CloudRain}
            label={t("weather.rainProb")}
            value={`${currentWeather.rainChancePercent}%`}
            tone="primary"
          />
        </div>

        <RiskMeter
          level={currentWeather.riskLevel}
          score={currentWeather.riskScore}
          note={t("weather.riskNote")}
        />

        <div className="grid gap-4 xl:grid-cols-2">
          <ChartCard title={t("weather.timeline")}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyForecast} margin={{ left: -18, right: 6, top: 6 }}>
                <defs>
                  <linearGradient id="rainFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-sky)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="var(--color-sky)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="rainChancePercent"
                  name={t("weather.rainProb")}
                  stroke="var(--color-sky)"
                  strokeWidth={3}
                  fill="url(#rainFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title={t("weather.week")}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyRainfall} margin={{ left: -18, right: 6, top: 6 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar
                  dataKey="rainMm"
                  name="mm"
                  fill="var(--color-primary)"
                  radius={[10, 10, 4, 4]}
                  maxBarSize={34}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </PageTransition>
    </AppShell>
  );
}
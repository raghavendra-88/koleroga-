import { motion } from "framer-motion";
import { CloudRain, Droplets, Thermometer, Wind } from "lucide-react";

import { useLanguage, localized } from "@/lib/i18n";
import { currentWeather } from "@/data/mock";
import { cn } from "@/lib/utils";

const riskLabelKey = {
  low: "dash.riskLow",
  moderate: "dash.riskModerate",
  high: "dash.riskHigh",
} as const;

export function WeatherSummaryCard({ className }: { className?: string }) {
  const { t, language } = useLanguage();
  const metrics = [
    { icon: Thermometer, label: t("dash.temperature"), value: `${currentWeather.temperatureC}°C` },
    { icon: Droplets, label: t("dash.humidity"), value: `${currentWeather.humidityPercent}%` },
    { icon: CloudRain, label: t("dash.rain"), value: `${currentWeather.rainChancePercent}%` },
    { icon: Wind, label: t("weather.wind"), value: `${currentWeather.windKph} km/h` },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "relative overflow-hidden rounded-3xl bg-gradient-sky p-6 text-white shadow-[var(--shadow-card)]",
        className,
      )}
      aria-label={t("dash.weatherSummary")}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-16 h-52 w-52 rounded-full bg-white/15 blur-2xl"
      />
      <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-white/80">{t("dash.weatherSummary")}</p>
          <p className="mt-1 text-5xl font-bold leading-none">{currentWeather.temperatureC}°</p>
          <p className="mt-2 truncate text-sm text-white/90">
            {localized(language, currentWeather.condition)}
          </p>
        </div>
        <div className="shrink-0 rounded-2xl bg-white/20 px-4 py-3 text-right backdrop-blur-sm">
          <p className="text-xs font-medium text-white/85">{t("dash.diseaseRisk")}</p>
          <p className="text-lg font-bold">{t(riskLabelKey[currentWeather.riskLevel])}</p>
        </div>
      </div>

      <dl className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
            <metric.icon size={20} aria-hidden className="text-white/90" />
            <dt className="mt-2 truncate text-xs text-white/85">{metric.label}</dt>
            <dd className="text-lg font-bold">{metric.value}</dd>
          </div>
        ))}
      </dl>
    </motion.section>
  );
}
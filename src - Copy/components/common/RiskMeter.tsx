import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

import { useT, type TranslationKey } from "@/lib/i18n";
import type { RiskLevel } from "@/data/mock";
import { cn } from "@/lib/utils";

const riskStyles: Record<RiskLevel, { bar: string; chip: string; labelKey: TranslationKey }> = {
  low: { bar: "bg-success", chip: "bg-success/20 text-success-foreground", labelKey: "dash.riskLow" },
  moderate: {
    bar: "bg-warning",
    chip: "bg-warning/25 text-warning-foreground",
    labelKey: "dash.riskModerate",
  },
  high: {
    bar: "bg-destructive",
    chip: "bg-destructive/15 text-destructive",
    labelKey: "dash.riskHigh",
  },
};

interface RiskMeterProps {
  level: RiskLevel;
  score: number;
  title?: string;
  note?: string;
  className?: string;
}

export function RiskMeter({ level, score, title, note, className }: RiskMeterProps) {
  const t = useT();
  const style = riskStyles[level];

  return (
    <div className={cn("surface-card p-5", className)}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground"
          >
            <ShieldAlert size={20} />
          </span>
          <p className="truncate font-semibold">{title ?? t("weather.riskMeter")}</p>
        </div>
        <span
          className={cn("shrink-0 rounded-full px-3 py-1 text-sm font-bold", style.chip)}
        >
          {t(style.labelKey)} · {score}%
        </span>
      </div>

      <div
        className="mt-4 h-3 w-full overflow-hidden rounded-full bg-muted"
        role="meter"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={title ?? t("weather.riskMeter")}
      >
        <motion.div
          className={cn("h-full rounded-full", style.bar)}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      {note && <p className="mt-3 text-sm text-muted-foreground">{note}</p>}
    </div>
  );
}
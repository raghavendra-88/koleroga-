import { CheckCircle2, AlertTriangle } from "lucide-react";

import { useT } from "@/lib/i18n";
import type { HealthStatus } from "@/data/mock";
import { cn } from "@/lib/utils";

export function StatusBadge({
  status,
  className,
}: {
  status: HealthStatus;
  className?: string;
}) {
  const t = useT();
  const healthy = status === "healthy";
  const Icon = healthy ? CheckCircle2 : AlertTriangle;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
        healthy ? "bg-success/25 text-success-foreground" : "bg-destructive/12 text-destructive",
        className,
      )}
    >
      <Icon size={14} aria-hidden />
      {healthy ? t("common.healthy") : t("common.diseased")}
    </span>
  );
}
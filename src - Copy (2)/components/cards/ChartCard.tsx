import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, description, children, className }: ChartCardProps) {
  const t = useT();

  return (
    <section className={cn("surface-card p-5", className)} aria-label={title}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold sm:text-lg">{title}</h2>
          {description && (
            <p className="truncate text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-[11px] font-semibold text-muted-foreground">
          {t("common.placeholderData")}
        </span>
      </div>
      <div className="mt-5 h-56 w-full sm:h-64">{children}</div>
    </section>
  );
}
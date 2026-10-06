import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type StatTone = "primary" | "leaf" | "sky" | "warning" | "danger" | "earth";

const toneStyles: Record<StatTone, string> = {
  primary: "bg-primary/12 text-primary",
  leaf: "bg-leaf/18 text-leaf",
  sky: "bg-sky/25 text-sky-foreground",
  warning: "bg-warning/25 text-warning-foreground",
  danger: "bg-destructive/12 text-destructive",
  earth: "bg-earth/15 text-earth",
};

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: StatTone;
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "primary",
  className,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={cn("surface-card p-5", className)}
    >
      <span
        aria-hidden
        className={cn("grid h-12 w-12 place-items-center rounded-2xl", toneStyles[tone])}
      >
        <Icon size={24} />
      </span>
      <p className="mt-4 text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </motion.div>
  );
}
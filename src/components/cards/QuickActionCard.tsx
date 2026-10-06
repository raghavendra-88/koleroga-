import { Link, type LinkProps } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { StatTone } from "@/components/cards/StatCard";

const toneStyles: Record<StatTone, string> = {
  primary: "bg-primary/12 text-primary",
  leaf: "bg-leaf/18 text-leaf",
  sky: "bg-sky/25 text-sky-foreground",
  warning: "bg-warning/25 text-warning-foreground",
  danger: "bg-destructive/12 text-destructive",
  earth: "bg-earth/15 text-earth",
};

export interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  description: string;
  to: LinkProps["to"];
  tone?: StatTone;
}

export function QuickActionCard({
  icon: Icon,
  label,
  description,
  to,
  tone = "primary",
}: QuickActionCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} className="h-full">
      <Link
        to={to}
        className="surface-card flex h-full min-h-32 flex-col justify-between gap-3 p-5 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span
          aria-hidden
          className={cn("grid h-12 w-12 place-items-center rounded-2xl", toneStyles[tone])}
        >
          <Icon size={24} />
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-base font-bold">
            <span className="truncate">{label}</span>
            <ChevronRight size={16} aria-hidden className="shrink-0 text-muted-foreground" />
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
}
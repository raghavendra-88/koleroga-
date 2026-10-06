import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  animated?: boolean;
  className?: string;
}

const markSizes = {
  sm: "h-9 w-9 rounded-xl [&_svg]:size-5",
  md: "h-11 w-11 rounded-2xl [&_svg]:size-6",
  lg: "h-20 w-20 rounded-3xl [&_svg]:size-10",
} as const;

const textSizes = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-3xl",
} as const;

export function Logo({ size = "md", showWordmark = true, animated = false, className }: LogoProps) {
  const t = useT();

  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <motion.div
        aria-hidden
        initial={animated ? { scale: 0.6, opacity: 0, rotate: -12 } : false}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}
        className={cn(
          "grid shrink-0 place-items-center bg-gradient-leaf text-primary-foreground shadow-[var(--shadow-float)]",
          markSizes[size],
        )}
      >
        <Leaf strokeWidth={2.2} />
      </motion.div>
      {showWordmark && (
        <div className="min-w-0">
          <p className={cn("truncate font-bold leading-tight", textSizes[size])}>{t("app.name")}</p>
          {size === "lg" && (
            <p className="text-sm text-muted-foreground">{t("app.tagline")}</p>
          )}
        </div>
      )}
    </div>
  );
}
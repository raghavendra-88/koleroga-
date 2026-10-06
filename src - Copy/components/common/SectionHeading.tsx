import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeading({ icon: Icon, title, description, action }: SectionHeadingProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <span
            aria-hidden
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground"
          >
            <Icon size={20} />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold sm:text-xl">{title}</h2>
          {description && (
            <p className="truncate text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}
import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, type Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageOption {
  value: Language;
  flag: string;
  label: string;
}

const options: [LanguageOption, LanguageOption] = [
  { value: "en", flag: "🇬🇧", label: "English" },
  { value: "kn", flag: "🇮🇳", label: "ಕನ್ನಡ" },
];

export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const active = options.find((option) => option.value === language) ?? options[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="soft"
          size="sm"
          className={cn("h-11 gap-2 rounded-full px-3", className)}
          aria-label="Change language"
        >
          <Languages aria-hidden />
          <span className="text-base leading-none">{active.flag}</span>
          <span className="hidden text-sm sm:inline">{active.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44 rounded-2xl p-2">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => setLanguage(option.value)}
            className={cn(
              "h-11 cursor-pointer gap-3 rounded-xl px-3 text-sm font-medium",
              option.value === language && "bg-accent text-accent-foreground",
            )}
          >
            <span className="text-lg leading-none">{option.flag}</span>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
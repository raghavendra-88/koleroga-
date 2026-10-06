import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopBar } from "@/components/layout/TopBar";
import { useAuth } from "@/lib/auth";

interface AppShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showGreeting?: boolean;
}

/** Responsive app frame: sidebar on desktop, bottom navigation on phones, with protected route protection. */
export function AppShell({ children, title, subtitle, showGreeting = false }: AppShellProps) {
  const navigate = useNavigate();
  const { user, isGuest, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user && !isGuest) {
      void navigate({ to: "/welcome" });
    }
  }, [isLoading, user, isGuest, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading Koleroga AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {showGreeting ? (
          <TopBar showGreeting />
        ) : (
          <TopBar {...(title ? { title } : {})} {...(subtitle ? { subtitle } : {})} />
        )}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-5 sm:px-6 sm:pt-6 lg:pb-12">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
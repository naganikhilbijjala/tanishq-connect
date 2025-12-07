"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { RSOSelector } from "@/components/layout/rso-selector";
import { useCurrentRSO } from "@/hooks/use-current-rso";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentRSOId } = useCurrentRSO();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state while checking RSO
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <div className="animate-pulse text-amber-600">Loading...</div>
      </div>
    );
  }

  // Show RSO selector if no RSO is selected
  if (!currentRSOId) {
    return <RSOSelector />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pb-20">{children}</main>
      <MobileNav />
      <Toaster position="top-center" />
    </div>
  );
}

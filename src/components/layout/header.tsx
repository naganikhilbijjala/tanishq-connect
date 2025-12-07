"use client";

import { useRouter } from "next/navigation";
import { useCurrentRSO } from "@/hooks/use-current-rso";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function Header() {
  const router = useRouter();
  const { currentRSOName, clearCurrentRSO } = useCurrentRSO();

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    clearCurrentRSO();
    router.push("/login");
    router.refresh();
  };

  const handleChangeRSO = () => {
    clearCurrentRSO();
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-amber-600 text-white">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-amber-600 text-lg font-bold">T</span>
          </div>
          <span className="text-xl font-bold hidden sm:inline">
            Tanishq Connect
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentRSOName && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleChangeRSO}
              className="text-white hover:bg-amber-700 gap-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{currentRSOName}</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-white hover:bg-amber-700"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

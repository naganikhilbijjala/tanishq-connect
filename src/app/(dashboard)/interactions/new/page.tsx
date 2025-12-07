"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { InteractionForm } from "@/components/forms/interaction-form";

function NewInteractionContent() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold">New Interaction</h1>
      </div>

      <InteractionForm mode="create" />
    </div>
  );
}

export default function NewInteractionPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-32 bg-gray-200 rounded" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      }
    >
      <NewInteractionContent />
    </Suspense>
  );
}

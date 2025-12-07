"use client";

import { useEffect, useState } from "react";
import { useCurrentRSO } from "@/hooks/use-current-rso";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Plus } from "lucide-react";
import type { RSO } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RSOSelectorProps {
  onComplete?: () => void;
}

export function RSOSelector({ onComplete }: RSOSelectorProps) {
  const [rsos, setRsos] = useState<RSO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRsoName, setNewRsoName] = useState("");
  const [adding, setAdding] = useState(false);
  const { setCurrentRSO } = useCurrentRSO();

  const fetchRsos = async () => {
    try {
      const response = await fetch("/api/rsos");
      const data = await response.json();
      setRsos(data.data || []);
    } catch (error) {
      console.error("Error fetching RSOs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRsos();
  }, []);

  const handleSelectRSO = (rso: RSO) => {
    setCurrentRSO(rso.id, rso.name);
    onComplete?.();
  };

  const handleAddRSO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRsoName.trim()) return;

    setAdding(true);
    try {
      const response = await fetch("/api/rsos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newRsoName.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setRsos([...rsos, data.data]);
        setNewRsoName("");
        setShowAddForm(false);
        // Auto-select the new RSO
        handleSelectRSO(data.data);
      }
    } catch (error) {
      console.error("Error adding RSO:", error);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <div className="animate-pulse text-amber-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-amber-800">
            Who is using the app?
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select your name to continue
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {rsos.map((rso) => (
            <Button
              key={rso.id}
              variant="outline"
              className="w-full h-14 text-lg justify-start gap-3 hover:bg-amber-50 hover:border-amber-300"
              onClick={() => handleSelectRSO(rso)}
            >
              <User className="h-5 w-5 text-amber-600" />
              {rso.name}
            </Button>
          ))}

          {showAddForm ? (
            <form onSubmit={handleAddRSO} className="space-y-3 pt-2">
              <div className="space-y-2">
                <Label htmlFor="newRsoName">Your Name</Label>
                <Input
                  id="newRsoName"
                  value={newRsoName}
                  onChange={(e) => setNewRsoName(e.target.value)}
                  placeholder="Enter your name"
                  className="h-12"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewRsoName("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                  disabled={adding || !newRsoName.trim()}
                >
                  {adding ? "Adding..." : "Add & Select"}
                </Button>
              </div>
            </form>
          ) : (
            <Button
              variant="ghost"
              className="w-full h-14 text-lg justify-start gap-3 text-amber-600 hover:bg-amber-50"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="h-5 w-5" />
              Add New Person
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

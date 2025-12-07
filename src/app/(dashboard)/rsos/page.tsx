"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import type { RSO } from "@/types";

export default function RSOsPage() {
  const [rsos, setRsos] = useState<RSO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRso, setSelectedRso] = useState<RSO | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    employeeCode: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchRsos = async () => {
    try {
      const response = await fetch("/api/rsos");
      const data = await response.json();
      setRsos(data.data || []);
    } catch (error) {
      console.error("Error fetching RSOs:", error);
      toast.error("Failed to load RSOs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRsos();
  }, []);

  const resetForm = () => {
    setFormData({ name: "", employeeCode: "", phone: "" });
    setSelectedRso(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/rsos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("RSO added successfully");
        setShowAddDialog(false);
        resetForm();
        fetchRsos();
      } else {
        toast.error("Failed to add RSO");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRso || !formData.name.trim()) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/rsos/${selectedRso.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("RSO updated successfully");
        setShowEditDialog(false);
        resetForm();
        fetchRsos();
      } else {
        toast.error("Failed to update RSO");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRso) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/rsos/${selectedRso.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("RSO removed successfully");
        setShowDeleteDialog(false);
        resetForm();
        fetchRsos();
      } else {
        toast.error("Failed to remove RSO");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const openEditDialog = (rso: RSO) => {
    setSelectedRso(rso);
    setFormData({
      name: rso.name,
      employeeCode: rso.employeeCode || "",
      phone: rso.phone || "",
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (rso: RSO) => {
    setSelectedRso(rso);
    setShowDeleteDialog(true);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Manage RSOs</h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button
              className="bg-amber-600 hover:bg-amber-700"
              onClick={resetForm}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add RSO
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAdd}>
              <DialogHeader>
                <DialogTitle>Add New RSO</DialogTitle>
                <DialogDescription>
                  Add a new Retail Sales Officer to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter name"
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeCode">Employee Code (optional)</Label>
                  <Input
                    id="employeeCode"
                    value={formData.employeeCode}
                    onChange={(e) =>
                      setFormData({ ...formData, employeeCode: e.target.value })
                    }
                    placeholder="e.g., RSO001"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                    className="h-12"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700"
                  disabled={saving}
                >
                  {saving ? "Adding..." : "Add RSO"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : rsos.length === 0 ? (
        <div className="text-center py-12">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-muted-foreground mb-4">No RSOs found</p>
          <Button
            className="bg-amber-600 hover:bg-amber-700"
            onClick={() => {
              resetForm();
              setShowAddDialog(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add First RSO
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {rsos.map((rso) => (
            <Card key={rso.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-full">
                    <User className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">{rso.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {rso.employeeCode || "No employee code"}
                      {rso.phone && ` • ${rso.phone}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openEditDialog(rso)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => openDeleteDialog(rso)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>Edit RSO</DialogTitle>
              <DialogDescription>
                Update the RSO information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editName">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="editName"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter name"
                  className="h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmployeeCode">
                  Employee Code (optional)
                </Label>
                <Input
                  id="editEmployeeCode"
                  value={formData.employeeCode}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeCode: e.target.value })
                  }
                  placeholder="e.g., RSO001"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPhone">Phone (optional)</Label>
                <Input
                  id="editPhone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                  className="h-12"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove RSO</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedRso?.name}? They will no
              longer appear in the RSO list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={saving}
            >
              {saving ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

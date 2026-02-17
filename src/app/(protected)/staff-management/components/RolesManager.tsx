"use client";

import { useState } from "react";
import Icon from "@/app/components/AppIcon";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { rolesApi } from "@/app/services/roles.api";
import { StaffRoles } from "../types";

interface RolesManagerProps {
  roles: StaffRoles[];
  onAddRole?: (role: StaffRoles) => void;
  onUpdateRole?: (id: string, name: string) => void;
  onDeleteRole?: (id: string) => void;
}

const RolesManager = ({
  roles,
  onAddRole,
  onUpdateRole,
  onDeleteRole,
}: RolesManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [error, setError] = useState("");

  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editingRoleName, setEditingRoleName] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [editingLoadingId, setEditingLoadingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCancelEdit = () => {
    setEditingRoleId(null);
    setEditingRoleName("");
  };

  const handleSaveEdit = async (roleId: string) => {
    if (!editingRoleName.trim()) return;

    try {
      setEditingLoadingId(roleId);
      await rolesApi.updateRole(roleId, {
        name: editingRoleName.trim(),
      });
      onUpdateRole?.(roleId, editingRoleName.trim());
      handleCancelEdit();
    } catch (err) {
      console.error("Failed to update role", err);
    } finally {
      setEditingLoadingId(null);
    }
  };

  const handleAddRole = async () => {
    if (!newRoleName.trim()) {
      setError("Role name is required");
      return;
    }

    if (
      roles.some(
        (role) => role.name.toLowerCase() === newRoleName.toLowerCase(),
      )
    ) {
      setError("Role already exists");
      return;
    }
    try {
      const res = await rolesApi.createRoles({ name: newRoleName.trim() });
      const createdRole = res?.data || res?.role;

      if (createdRole) {
        onAddRole?.(createdRole); // send full role object
      }
      setNewRoleName("");
      setError("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add role");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRoleId) return;

    try {
      setIsDeleting(true);
      await rolesApi.deleteRole(selectedRoleId);
      onDeleteRole?.(selectedRoleId);

      setConfirmOpen(false);
      setSelectedRoleId(null);
    } catch (err) {
      console.error("Failed to delete role", err);
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
      setSelectedRoleId(null);
    }
  };

  return (
    <div className="mb-6">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        iconName="Users"
        iconPosition="left"
        iconSize={16}
      >
        Manage Roles
      </Button>

      {isOpen && (
        <div className="mt-4 bg-card border border-border rounded-lg p-4">
          {/* Add role */}
          <div className="flex items-center gap-3 mb-4">
            <Input
              placeholder="New role name"
              value={newRoleName}
              onChange={(e) => {
                setNewRoleName(e.target.value);
                setError("");
              }}
              error={error}
            />
            <Button iconName="Plus" onClick={handleAddRole} disabled={isAdding}>
              {isAdding ? "Adding..." : "Add"}
            </Button>
          </div>

          {/* Role list */}
          <div className="space-y-2">
            {roles.map((role) => (
              <div
                key={role._id}
                className="flex items-center justify-between p-3 bg-muted rounded-md"
              >
                {/* Name / Edit */}
                {editingRoleId === role._id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editingRoleName}
                      onChange={(e) => setEditingRoleName(e.target.value)}
                      className="h-8"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      iconName="Check"
                      disabled={editingLoadingId === role._id}
                      onClick={() => handleSaveEdit(role._id)}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      iconName="X"
                      disabled={editingLoadingId === role._id}
                      onClick={handleCancelEdit}
                    />
                  </div>
                ) : (
                  <span className="font-medium">{role.name}</span>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    iconName="Pencil"
                    disabled={isDeleting || isAdding}
                    onClick={() => {
                      setEditingRoleId(role._id);
                      setEditingRoleName(role.name);
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    iconName="Trash2"
                    disabled={isDeleting}
                    onClick={() => handleDeleteRole(role._id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Role"
        description="Are you sure you want to delete this role? This action cannot be undone."
        onCancel={() => !isDeleting && setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default RolesManager;

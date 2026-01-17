"use client";

import { useState } from "react";
import Icon from "@/app/components/AppIcon";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { customerTagApi } from "@/app/services/tags.api";
import { CustomerTagItem } from "../types";

interface Props {
  tags: CustomerTagItem[];
  onAddTag: (name: string, id: string) => void;
  onUpdateTag: (id: string, name: string) => void;
  onDeleteTag: (id: string) => void;
}

const CustomerTagManager = ({
  tags,
  onAddTag,
  onUpdateTag,
  onDeleteTag,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const addTag = async () => {
    if (!newTag.trim()) return;

    const res = await customerTagApi.createCustomerTag({
      name: newTag.trim(),
    });

    onAddTag(newTag.trim(), res.data._id);
    setNewTag("");
  };

  const saveEdit = async (id: string) => {
    await customerTagApi.updateCustomerTag(id, { name: editingName.trim() });
    onUpdateTag(id, editingName.trim());
    setEditingId(null);
  };

  const confirmDelete = async () => {
    if (!confirmId) return;
    await customerTagApi.deleteCustomerTag(confirmId);
    onDeleteTag(confirmId);
    setConfirmId(null);
  };

  return (
    <div className="mb-6">
      <Button
        variant="outline"
        iconName="Tag"
        onClick={() => setIsOpen(!isOpen)}
      >
        Manage Customer Tags
      </Button>

      {isOpen && (
        <div className="mt-4 bg-card border rounded-lg p-4">
          {/* Add */}
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="New tag name"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <Button iconName="Plus" onClick={addTag}>
              Add
            </Button>
          </div>

          {/* List */}
          <div className="space-y-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between bg-muted p-3 rounded-md"
              >
                {editingId === tag.id ? (
                  <div className="flex gap-2">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="h-8"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      iconName="Check"
                      onClick={() => saveEdit(tag.id)}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      iconName="X"
                      onClick={() => setEditingId(null)}
                    />
                  </div>
                ) : (
                  <span className="font-medium">{tag.name}</span>
                )}

                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    iconName="Pencil"
                    onClick={() => {
                      setEditingId(tag.id);
                      setEditingName(tag.name);
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    iconName="Trash2"
                    onClick={() => setConfirmId(tag.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!confirmId}
        title="Delete Tag"
        description="Are you sure you want to delete this tag?"
        onCancel={() => setConfirmId(null)}
        onConfirm={confirmDelete}
      />
      
    </div>
  );
};

export default CustomerTagManager;

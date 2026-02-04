"use client";
import { useState } from "react";
import { ServiceCategory } from "../types";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { categoryApi } from "@/app/services/category.api";
import ConfirmModal from "@/app/components/ui/ConfirmModal";

interface CategoryManagerProps {
  categories: ServiceCategory[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onUpdateCategory: (id: string, name: string) => void;
  onReorderCategories: (categories: ServiceCategory[]) => void;
}

const CategoryManager = ({
  categories,
  onAddCategory,
  onDeleteCategory,
  onUpdateCategory,
  onReorderCategories,
}: CategoryManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [editingCategoryName, setEditingCategoryName] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

  const handleSaveEdit = async (categoryId: string) => {
    if (!editingCategoryName.trim()) return;

    try {
      await categoryApi.updateCategory(categoryId, {
        name: editingCategoryName.trim(),
      });

      // ✅ update parent state
      onUpdateCategory(categoryId, editingCategoryName.trim());

      handleCancelEdit();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setError("Category name is required");
      return;
    }

    if (
      categories.some(
        (cat) => cat.name.toLowerCase() === newCategoryName.toLowerCase(),
      )
    ) {
      setError("Category already exists");
      return;
    }

    try {
      await categoryApi.createCategory({ name: newCategoryName.trim() });
      onAddCategory(newCategoryName.trim());
      setNewCategoryName("");
      setError("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add category");
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategoryId) return;

    try {
      await categoryApi.deleteCategory(selectedCategoryId);

      onDeleteCategory(selectedCategoryId);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete category");
    }

    setConfirmOpen(false);
    setSelectedCategoryId(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newCategories = [...categories];
    [newCategories[index - 1], newCategories[index]] = [
      newCategories[index],
      newCategories[index - 1],
    ];
    onReorderCategories(newCategories.map((cat, i) => ({ ...cat, order: i })));
  };

  const handleMoveDown = (index: number) => {
    if (index === categories.length - 1) return;
    const newCategories = [...categories];
    [newCategories[index], newCategories[index + 1]] = [
      newCategories[index + 1],
      newCategories[index],
    ];
    onReorderCategories(newCategories.map((cat, i) => ({ ...cat, order: i })));
  };

  return (
    <div className="mb-6">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        iconName="Grid3x3"
        iconPosition="left"
        iconSize={16}
      >
        Manage Categories
      </Button>

      {isOpen && (
        <div className="mt-4 bg-card border border-border rounded-lg p-4">
          {/* Add category */}
          <div className="flex items-center gap-3 mb-4">
            <Input
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                setError("");
                setError("");
              }}
              error={error}
            />
            <Button iconName="Plus" onClick={handleAddCategory}>
              Add
            </Button>
          </div>

          {/* Category list */}
          <div className="space-y-2">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-muted rounded-md"
              >
                <div className="flex items-center gap-3">
                  {/* <div className="flex flex-col gap-1">
                    <button onClick={() => handleMoveUp(index)} disabled={index === 0}>
                      <Icon name="ChevronUp" size={16} />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === categories.length - 1}
                    >
                      <Icon name="ChevronDown" size={16} />
                    </button>
                  </div> */}

                  {/* Name / Edit */}
                  {editingCategoryId === category.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editingCategoryName}
                        onChange={(e) => setEditingCategoryName(e.target.value)}
                        className="h-8"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        iconName="Check"
                        onClick={() => handleSaveEdit(category.id)}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        iconName="X"
                        onClick={handleCancelEdit}
                      />
                    </div>
                  ) : (
                    <div>
                      <span className="font-medium">{category.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({category.serviceCount} services)
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    iconName="Pencil"
                    onClick={() => {
                      setEditingCategoryId(category.id);
                      setEditingCategoryName(category.name);
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    iconName="Trash2"
                    onClick={() => handleDeleteCategory(category.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default CategoryManager;

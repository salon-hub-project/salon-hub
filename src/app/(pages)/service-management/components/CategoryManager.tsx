"use client";
import { useState } from 'react';
import { ServiceCategory } from '../types';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { categoryApi } from '@/app/services/category.api';

interface CategoryManagerProps {
  categories: ServiceCategory[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onReorderCategories: (categories: ServiceCategory[]) => void;
}

const CategoryManager = ({
  categories,
  onAddCategory,
  onDeleteCategory,
  onReorderCategories,
}: CategoryManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
const [editingCategoryName, setEditingCategoryName] = useState('');
const handleCancelEdit = () => {
  setEditingCategoryId(null);
  setEditingCategoryName('');
};

const handleSaveEdit = async (categoryId: string) => {
  if (!editingCategoryName.trim()) return;

  try {
    await categoryApi.updateCategory(categoryId, {
      name: editingCategoryName.trim(),
    });

    // ✅ refresh categories from backend
    await categoryApi. getAllCategories();

    handleCancelEdit();
  } catch (error) {
    console.error('Error updating category:', error);
  }
};

  // const handleAddCategory = () => {
  //   if (!newCategoryName.trim()) {
  //     setError('Category name is required');
  //     return;
  //   }

  //   if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase())) {
  //     setError('Category already exists');
  //     return;
  //   }

  //   onAddCategory(newCategoryName.trim());
  //   setNewCategoryName('');
  //   setError('');
  // };
  // const [categories, setCategories] = useState<any[]>([]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setError("Category name is required");
      return;
    }
  
    if (
      categories.some(
        (cat) => cat.name.toLowerCase() === newCategoryName.toLowerCase()
      )
    ) {
      setError("Category already exists");
      return;
    }
  
    try {
      await categoryApi.createCategory({ name: newCategoryName.trim() });
  
      // ✅ Tell parent to update UI
      onAddCategory(newCategoryName.trim());
  
      setNewCategoryName("");
      setError("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add category");
    }
  };
  const handleDeleteCategory = async (categoryId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
  
    if (!confirmDelete) return;
  
    try {
      await categoryApi.deleteCategory(categoryId);
  
      // ✅ update UI via parent
      onDeleteCategory(categoryId);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete category");
    }
  };
  
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newCategories = [...categories];
    [newCategories[index - 1], newCategories[index]] = [newCategories[index], newCategories[index - 1]];
    onReorderCategories(newCategories.map((cat, idx) => ({ ...cat, order: idx })));
  };

  const handleMoveDown = (index: number) => {
    if (index === categories.length - 1) return;
    const newCategories = [...categories];
    [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
    onReorderCategories(newCategories.map((cat, idx) => ({ ...cat, order: idx })));
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
          <div className="flex items-center gap-3 mb-4">
            <Input
              type="text"
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                setError('');
              }}
              error={error}
            />
            <Button
              variant="default"
              onClick={handleAddCategory}
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
            >
              Add
            </Button>
          </div>
       
          <div className="space-y-2">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-muted rounded-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="flex items-center justify-center w-6 h-6 rounded hover:bg-background transition-smooth disabled:opacity-30"
                      aria-label="Move up"
                    >
                      <Icon name="ChevronUp" size={16} className="text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === categories.length - 1}
                      className="flex items-center justify-center w-6 h-6 rounded hover:bg-background transition-smooth disabled:opacity-30"
                      aria-label="Move down"
                    >
                      <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">
                      {category.name}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({category.serviceCount} service{category.serviceCount !== 1 ? 's' : ''})
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  // onClick={() => onDeleteCategory(category.id)}
                  onClick={() => handleDeleteCategory(category.id)}
                  disabled={category.serviceCount > 0}
                  iconName="Trash2"
                  iconSize={16}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
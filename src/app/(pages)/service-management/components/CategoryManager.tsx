"use client";
import { useState } from 'react';
import { ServiceCategory } from '../types';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

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

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      setError('Category name is required');
      return;
    }

    if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase())) {
      setError('Category already exists');
      return;
    }

    onAddCategory(newCategoryName.trim());
    setNewCategoryName('');
    setError('');
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
                  onClick={() => onDeleteCategory(category.id)}
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
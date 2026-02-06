import { ServiceFilters } from "../types";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import { useEffect, useState } from "react";
import { useDebounce } from "@/app/store/hooks";

interface ServiceFiltersProps {
  filters: ServiceFilters;
  categories: string[];
  onFilterChange: (filters: ServiceFilters) => void;
  onReset: () => void;
}

const ServiceFiltersComponent = ({
  filters,
  categories,
  onFilterChange,
  onReset,
}: ServiceFiltersProps) => {
  const [search, setSearch] = useState(filters.searchQuery);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    onFilterChange({ ...filters, searchQuery: debouncedSearch });
  }, [debouncedSearch]);

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active Only" },
    { value: "inactive", label: "Inactive Only" },
  ];

  const sortByOptions = [
    { value: "name", label: "Name" },
    { value: "price", label: "Price" },
    { value: "duration", label: "Duration" },
    { value: "category", label: "Category" },
  ];

  const sortOrderOptions = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <Input
            type="search"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select
          options={categoryOptions}
          value={filters.category}
          onChange={(value) =>
            onFilterChange({ ...filters, category: value as string })
          }
          placeholder="Filter by category"
        />

        {/* <Select
          options={statusOptions}
          value={filters.status}
          onChange={(value) =>
            onFilterChange({
              ...filters,
              status: value as "all" | "active" | "inactive",
            })
          }
          placeholder="Filter by status"
        /> */}

        {/* <div className="flex gap-2">
          <Select
            options={sortByOptions}
            value={filters.sortBy}
            onChange={(value) =>
              onFilterChange({ ...filters, sortBy: value as ServiceFilters['sortBy'] })
            }
            placeholder="Sort by"
          />
          <Select
            options={sortOrderOptions}
            value={filters.sortOrder}
            onChange={(value) =>
              onFilterChange({ ...filters, sortOrder: value as 'asc' | 'desc' })
            }
            placeholder="Order"
          />
        </div> */}
      </div>

      <div className="flex justify-end mt-4">
        <Button variant="outline" size="sm" onClick={onReset}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default ServiceFiltersComponent;

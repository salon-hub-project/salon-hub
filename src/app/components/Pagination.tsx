"use client";

import clsx from "clsx";
import Button from "./ui/Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = ({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div
      className={clsx(
        "flex items-center justify-center gap-2 mt-6",
        className
      )}
    >
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </Button>

      {Array.from({ length: totalPages }).map((_, idx) => {
        const pageNumber = idx + 1;
        const isActive = pageNumber === page;

        return (
          <Button
            key={pageNumber}
            size="sm"
            variant={isActive ? "default" : "outline"}
            className={clsx(
              "min-w-[36px]",
              isActive &&
                "bg-primary text-primary-foreground hover:bg-primary"
            )}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;

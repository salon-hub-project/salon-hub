"use client";

import Icon from "./AppIcon";

interface NoDataProps {
  title?: string;
  description?: string;
}

const NoData = ({
  title = "No data found",
  description = "There is nothing to display here yet.",
}: NoDataProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon name="Inbox" size={24} className="text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default NoData;


import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { ViewMode } from '../types';

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onPreviousClick: () => void;
  onNextClick: () => void;
  onTodayClick: () => void;
}

const CalendarHeader = ({
  currentDate,
  viewMode,
  onViewModeChange,
  onPreviousClick,
  onNextClick,
  onTodayClick,
}: CalendarHeaderProps) => {
  const formatDateDisplay = () => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      year: 'numeric',
    };

    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }

    return currentDate.toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-card border-b border-border">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onPreviousClick}
            aria-label="Previous period"
          >
            <Icon name="ChevronLeft" size={20} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onNextClick}
            aria-label="Next period"
          >
            <Icon name="ChevronRight" size={20} />
          </Button>
        </div>

        <h2 className="text-lg font-semibold text-foreground">
          {formatDateDisplay()}
        </h2>

        <Button variant="outline" size="sm" onClick={onTodayClick}>
          Today
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-muted rounded-md p-1">
          <button
            onClick={() => onViewModeChange('viewAll')}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-smooth min-h-touch ${
              viewMode === 'viewAll' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            View All
          </button>
          <button
            onClick={() => onViewModeChange('day')}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-smooth min-h-touch ${
              viewMode === 'day' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => onViewModeChange('week')}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-smooth min-h-touch ${
              viewMode === 'week' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Week
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
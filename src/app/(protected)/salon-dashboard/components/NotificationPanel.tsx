import { Notification } from '../types';
import Icon from '../../../components/AppIcon';

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const NotificationPanel = ({
  notifications,
  onMarkAsRead,
  onDismiss,
}: NotificationPanelProps) => {
  const getNotificationIcon = (type: Notification['type']) => {
    const icons = {
      info: 'Info',
      warning: 'AlertTriangle',
      success: 'CheckCircle',
      error: 'XCircle',
    };
    return icons[type];
  };

  const getNotificationColor = (type: Notification['type']) => {
    const colors = {
      info: 'bg-primary/10 text-primary border-primary/20',
      warning: 'bg-warning/10 text-warning border-warning/20',
      success: 'bg-success/10 text-success border-success/20',
      error: 'bg-error/10 text-error border-error/20',
    };
    return colors[type];
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium rounded-full bg-accent text-accent-foreground">
              {unreadCount}
            </span>
          )}
        </div>
        <button className="text-sm text-primary hover:text-primary/80 font-medium transition-smooth">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {notifications.slice(0, 5).map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border transition-smooth ${
              notification.read ? 'bg-muted/50' : 'bg-card'
            } ${getNotificationColor(notification.type)}`}
          >
            <div className="flex items-start gap-3">
              <Icon
                name={getNotificationIcon(notification.type)}
                size={20}
                className="flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground">
                  {notification.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {getTimeAgo(notification.timestamp)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!notification.read && (
                  <button
                    onClick={() => onMarkAsRead(notification.id)}
                    className="text-xs text-primary hover:text-primary/80 font-medium transition-smooth"
                    aria-label="Mark as read"
                  >
                    <Icon name="Check" size={16} />
                  </button>
                )}
                <button
                  onClick={() => onDismiss(notification.id)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-smooth"
                  aria-label="Dismiss notification"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
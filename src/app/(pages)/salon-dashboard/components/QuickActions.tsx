// import { useNavigate } from 'react-router-dom';
import { QuickAction } from '../types';
import Icon from '../../../components/AppIcon';
import { useRouter } from 'next/navigation';

interface QuickActionsProps {
  actions: QuickAction[];
}

const QuickActions = ({ actions }: QuickActionsProps) => {
  // const navigate = useNavigate();
  const router = useRouter();

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => router.push(action.path)}
            className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-smooth group"
          >
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-lg ${action.color} group-hover:scale-110 transition-smooth`}
            >
              <Icon name={action.icon} size={24} className="text-white" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">{action.label}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
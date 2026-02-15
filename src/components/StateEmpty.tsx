import { LucideIcon } from "lucide-react";

interface StateEmptyProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

const StateEmpty = ({ icon: Icon, title, subtitle, action, secondaryAction }: StateEmptyProps) => (
  <div className="text-center py-16 text-muted-foreground animate-fade-in">
    <Icon className="w-12 h-12 mx-auto mb-3 opacity-30" />
    <p className="text-sm font-medium">{title}</p>
    {subtitle && <p className="text-xs mt-1">{subtitle}</p>}
    {action && (
      <button
        onClick={action.onClick}
        className="mt-4 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium border border-primary/20 hover:bg-primary/20 transition-colors"
      >
        {action.label}
      </button>
    )}
    {secondaryAction && (
      <button
        onClick={secondaryAction.onClick}
        className="mt-2 block mx-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {secondaryAction.label}
      </button>
    )}
  </div>
);

export default StateEmpty;

import { AlertCircle } from "lucide-react";

interface StateErrorProps {
  message?: string;
  onRetry?: () => void;
}

const StateError = ({ message = "Error al cargar los datos", onRetry }: StateErrorProps) => (
  <div className="text-center py-16 animate-fade-in">
    <AlertCircle className="w-12 h-12 mx-auto mb-3 text-destructive opacity-60" />
    <p className="text-sm text-muted-foreground">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 hover:bg-destructive/20 transition-colors"
      >
        Reintentar
      </button>
    )}
  </div>
);

export default StateError;

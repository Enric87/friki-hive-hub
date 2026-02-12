import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Receipt, ShoppingBag, Calendar, MoreHorizontal, MessageCircle } from "lucide-react";

const tabs = [
  { path: "/home", icon: Home, label: "Inicio" },
  { path: "/tickets", icon: Receipt, label: "Tickets" },
  { path: "/reservas", icon: ShoppingBag, label: "Reservas" },
  { path: "/eventos", icon: Calendar, label: "Eventos" },
  { path: "/mas", icon: MoreHorizontal, label: "Más" },
];

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 pb-20 overflow-y-auto scrollbar-hide">
        <Outlet />
      </main>

      {/* Floating Chat Help Button */}
      <button
        onClick={() => navigate("/chatbot")}
        className="fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full gradient-neon shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity glow-primary-strong"
        aria-label="Chat de ayuda"
      >
        <MessageCircle className="w-5 h-5 text-primary-foreground" />
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg safe-bottom">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {tabs.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path || 
              (path !== "/home" && location.pathname.startsWith(path));
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center justify-center gap-0.5 w-16 h-14 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "text-primary glow-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "animate-pulse-glow" : ""}`} />
                <span className="text-[10px] font-medium text-display tracking-wider">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Calendar, Home, MessageCircle, MoreHorizontal, Receipt, ShoppingBag } from "lucide-react";

const tabs = [
  { path: "/home", icon: Home, label: "Inicio" },
  { path: "/tickets", icon: Receipt, label: "Tickets" },
  { path: "/reservas", icon: ShoppingBag, label: "Reservas" },
  { path: "/eventos", icon: Calendar, label: "Eventos" },
  { path: "/mas", icon: MoreHorizontal, label: "Mas" },
];

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        <Outlet />
      </main>

      <button
        onClick={() => navigate("/chatbot")}
        className="fixed bottom-24 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/30 gradient-neon shadow-lg transition-transform hover:scale-105 active:scale-95 glow-primary-strong"
        aria-label="Chat de ayuda"
      >
        <MessageCircle className="h-5 w-5 text-primary-foreground" />
      </button>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-purple-300/20 bg-[#07081a]/90 shadow-[0_-18px_42px_rgba(3,5,18,0.68)] backdrop-blur-xl safe-bottom">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
          {tabs.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path || (path !== "/home" && location.pathname.startsWith(path));

            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex h-14 w-16 flex-col items-center justify-center gap-0.5 rounded-xl transition-all duration-200 ${
                  isActive ? "text-white" : "text-slate-400 hover:text-slate-100"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    isActive ? "bg-violet-600 text-white shadow-[0_0_22px_rgba(168,85,247,0.75)]" : ""
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className={`text-[10px] font-semibold tracking-tight ${isActive ? "text-white" : "text-slate-400"}`}>
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

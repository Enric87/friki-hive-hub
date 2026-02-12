import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Receipt, ShoppingBag, Calendar, Gift,
  MessageCircle, ChevronLeft, Menu, X,
} from "lucide-react";
import { useState } from "react";

const adminTabs = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/tickets", icon: Receipt, label: "Tickets" },
  { path: "/admin/reservas", icon: ShoppingBag, label: "Reservas" },
  { path: "/admin/eventos", icon: Calendar, label: "Eventos" },
  { path: "/admin/sorteos", icon: Gift, label: "Sorteos" },
  { path: "/admin/chatbot", icon: MessageCircle, label: "Chatbot KB" },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-background border-r border-border transition-all duration-300 ${
          sidebarOpen ? "w-60" : "w-16"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-border">
          {sidebarOpen && (
            <span className="text-sm font-bold text-gradient-neon text-display tracking-wider">
              FrikiAdmin
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-surface-hover transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
          {adminTabs.map(({ path, icon: Icon, label }) => {
            const isActive =
              location.pathname === path ||
              (path !== "/admin" && location.pathname.startsWith(path));
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary border-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-primary" : ""}`} />
                {sidebarOpen && <span>{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Back to app */}
        <div className="p-2 border-t border-border">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            <ChevronLeft className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>Volver a la app</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-60" : "ml-16"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

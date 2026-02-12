import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import AdminLayout from "./components/AdminLayout";
import HomePage from "./pages/HomePage";
import TicketsPage from "./pages/TicketsPage";
import ReservasPage from "./pages/ReservasPage";
import EventosPage from "./pages/EventosPage";
import MorePage from "./pages/MorePage";
import SorteosPage from "./pages/SorteosPage";
import TCGPage from "./pages/TCGPage";
import ChatbotPage from "./pages/ChatbotPage";
import PerfilPage from "./pages/PerfilPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminReservas from "./pages/admin/AdminReservas";
import AdminEventos from "./pages/admin/AdminEventos";
import AdminSorteos from "./pages/admin/AdminSorteos";
import AdminChatbot from "./pages/admin/AdminChatbot";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Client App */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/reservas" element={<ReservasPage />} />
            <Route path="/eventos" element={<EventosPage />} />
            <Route path="/mas" element={<MorePage />} />
            <Route path="/sorteos" element={<SorteosPage />} />
            <Route path="/tcg" element={<TCGPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/cupones" element={<PerfilPage />} />
          </Route>
          {/* Admin Panel */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/tickets" element={<AdminTickets />} />
            <Route path="/admin/reservas" element={<AdminReservas />} />
            <Route path="/admin/eventos" element={<AdminEventos />} />
            <Route path="/admin/sorteos" element={<AdminSorteos />} />
            <Route path="/admin/chatbot" element={<AdminChatbot />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

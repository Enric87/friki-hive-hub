import { useState, useRef } from "react";
import { Camera, Upload, Clock, CheckCircle, XCircle, ChevronRight, X, Loader2, ImageIcon } from "lucide-react";
import { useTickets, useCreateTicket } from "@/hooks/useTickets";
import { useAuth } from "@/contexts/AuthContext";
import StateEmpty from "@/components/StateEmpty";
import StateError from "@/components/StateError";
import StateSkeleton from "@/components/StateSkeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TicketFilter = "all" | "pending" | "approved" | "rejected";

const statusConfig = {
  pending: { label: "Pendiente", icon: Clock, color: "text-neon-orange", bg: "bg-neon-orange/10" },
  approved: { label: "Aprobado", icon: CheckCircle, color: "text-neon-green", bg: "bg-neon-green/10" },
  rejected: { label: "Rechazado", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
};

const filters: { value: TicketFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendientes" },
  { value: "approved", label: "Aprobados" },
  { value: "rejected", label: "Rechazados" },
];

const TicketsPage = () => {
  const { user } = useAuth();
  const { data: tickets, isLoading, isError, refetch } = useTickets();
  const createTicket = useCreateTicket();
  const [filter, setFilter] = useState<TicketFilter>("all");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = filter === "all" ? tickets : tickets?.filter((t: any) => t.status === filter);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    try {
      await createTicket.mutateAsync({ imageFile: selectedFile });
      setPreviewImage(null);
      setSelectedFile(null);
    } catch {
      // error handled by mutation state
    }
  };

  const cancelPreview = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-display">Mis Tickets</h1>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Preview & Submit */}
      {previewImage ? (
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <div className="relative">
            <img src={previewImage} alt="Preview" className="w-full rounded-lg max-h-48 object-cover" />
            <button onClick={cancelPreview} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleSubmit}
            disabled={createTicket.isPending}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {createTicket.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {createTicket.isPending ? "Enviando..." : "Confirmar envío"}
          </button>
          {createTicket.isError && (
            <p className="text-xs text-destructive text-center">Error al enviar. Inténtalo de nuevo.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 py-4 rounded-xl bg-card border-glow glow-primary hover:bg-surface-hover transition-all"
          >
            <Camera className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Foto Ticket</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 py-4 rounded-xl bg-card border border-border/50 hover:bg-surface-hover transition-all"
          >
            <Upload className="w-5 h-5 text-neon-purple" />
            <span className="text-sm font-medium">Subir imagen</span>
          </button>
        </div>
      )}

      {/* Success toast inline */}
      {createTicket.isSuccess && !previewImage && (
        <div className="bg-neon-green/10 border border-neon-green/20 rounded-xl p-3 text-center text-sm text-neon-green font-medium">
          ✅ Ticket enviado correctamente. Estado: Pendiente
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Ticket List */}
      {isLoading ? (
        <StateSkeleton count={3} type="row" />
      ) : isError ? (
        <StateError onRetry={() => refetch()} />
      ) : !filtered?.length ? (
        <StateEmpty
          icon={ImageIcon}
          title="No hay tickets"
          subtitle={filter !== "all" ? "No tienes tickets con este estado" : "Sube una foto de tu ticket de compra para ganar puntos 📸"}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((ticket: any) => {
            const cfg = statusConfig[ticket.status as keyof typeof statusConfig] || statusConfig.pending;
            const StatusIcon = cfg.icon;
            return (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="w-full flex items-center gap-3 bg-card rounded-xl p-4 border border-border/50 text-left hover:bg-surface-hover transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg ${cfg.bg} flex items-center justify-center`}>
                  <StatusIcon className={`w-5 h-5 ${cfg.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {ticket.total_amount ? `${ticket.total_amount}€` : "Ticket"}
                    </p>
                    {ticket.points_awarded > 0 && (
                      <span className="text-xs text-neon-green font-semibold">+{ticket.points_awarded} pts</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(ticket.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      )}

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalle del Ticket</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              {selectedTicket.image_url && (
                <img src={selectedTicket.image_url} alt="Ticket" className="w-full rounded-lg max-h-48 object-cover" />
              )}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estado</span>
                  <span className={statusConfig[selectedTicket.status as keyof typeof statusConfig]?.color || ""}>
                    {statusConfig[selectedTicket.status as keyof typeof statusConfig]?.label || selectedTicket.status}
                  </span>
                </div>
                {selectedTicket.total_amount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total</span>
                    <span>{selectedTicket.total_amount}€</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fecha</span>
                  <span>{new Date(selectedTicket.created_at).toLocaleDateString("es-ES")}</span>
                </div>
                {selectedTicket.status === "approved" && selectedTicket.points_awarded > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Puntos</span>
                    <span className="text-neon-green font-semibold">+{selectedTicket.points_awarded}</span>
                  </div>
                )}
                {selectedTicket.status === "rejected" && (
                  <div className="bg-destructive/10 rounded-lg p-3 space-y-2">
                    <p className="text-sm text-destructive font-medium">Motivo de rechazo:</p>
                    <p className="text-xs text-muted-foreground">{selectedTicket.rejection_reason || "No especificado"}</p>
                    <button
                      onClick={() => {
                        setSelectedTicket(null);
                        fileInputRef.current?.click();
                      }}
                      className="w-full py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                    >
                      Reenviar ticket
                    </button>
                  </div>
                )}
                {selectedTicket.status === "pending" && (
                  <div className="bg-neon-orange/10 rounded-lg p-3 text-center">
                    <p className="text-xs text-neon-orange font-medium">⏳ En revisión</p>
                    <p className="text-xs text-muted-foreground mt-1">Te notificaremos cuando sea procesado</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketsPage;

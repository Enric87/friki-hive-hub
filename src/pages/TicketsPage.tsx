import { useRef, useState } from "react";
import { Camera, CheckCircle, ChevronRight, Clock, FileImage, ImageIcon, Loader2, ReceiptText, X, XCircle } from "lucide-react";
import { useCreateTicket, useTickets } from "@/hooks/useTickets";
import StateEmpty from "@/components/StateEmpty";
import StateError from "@/components/StateError";
import StateSkeleton from "@/components/StateSkeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type TicketFilter = "all" | "pending" | "approved" | "rejected";

const statusConfig = {
  pending: {
    label: "Pendiente",
    subtitle: "En revision",
    icon: Clock,
    text: "text-yellow-300",
    border: "border-yellow-300/35",
    bg: "bg-yellow-300/10",
    pill: "bg-yellow-300 text-slate-950",
  },
  approved: {
    label: "Aprobado",
    subtitle: "Ticket aprobado",
    icon: CheckCircle,
    text: "text-emerald-300",
    border: "border-emerald-300/35",
    bg: "bg-emerald-300/10",
    pill: "bg-emerald-400 text-slate-950",
  },
  rejected: {
    label: "Rechazado",
    subtitle: "Ticket rechazado",
    icon: XCircle,
    text: "text-red-400",
    border: "border-red-400/35",
    bg: "bg-red-500/10",
    pill: "bg-red-500 text-white",
  },
};

const filters: { value: TicketFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendientes" },
  { value: "approved", label: "Aprobados" },
  { value: "rejected", label: "Rechazados" },
];

const TicketsPage = () => {
  const { data: tickets, isLoading, isError, refetch } = useTickets();
  const createTicket = useCreateTicket();
  const [filter, setFilter] = useState<TicketFilter>("all");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const filtered = filter === "all" ? tickets : tickets?.filter((ticket: any) => ticket.status === filter);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (readerEvent) => setPreviewImage(readerEvent.target?.result as string);
    reader.readAsDataURL(file);
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const openCamera = async () => {
    setCameraError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      fileInputRef.current?.click();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
      window.setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => undefined);
        }
      }, 0);
    } catch {
      setCameraError("No se ha podido abrir la camara. Revisa permisos o sube una imagen.");
      fileInputRef.current?.click();
    }
  };

  const closeCamera = () => {
    stopCamera();
    setCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1080;
    canvas.height = video.videoHeight || 1440;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `ticket-${Date.now()}.jpg`, { type: "image/jpeg" });
      setSelectedFile(file);
      setPreviewImage(canvas.toDataURL("image/jpeg", 0.92));
      closeCamera();
    }, "image/jpeg", 0.92);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    try {
      await createTicket.mutateAsync({ imageFile: selectedFile });
      setPreviewImage(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      // Mutation state renders the error.
    }
  };

  const cancelPreview = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pb-4 pt-5 animate-fade-in">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Tickets</p>
          <h1 className="mt-1 text-2xl font-black">Mis tickets</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openCamera}
            className="flex h-11 items-center gap-2 rounded-xl border border-cyan-300/45 bg-cyan-500/10 px-3 text-xs font-black text-cyan-200 shadow-[0_0_22px_rgba(34,211,238,0.18)]"
          >
            <Camera className="h-5 w-5" />
            Foto
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-11 items-center gap-2 rounded-xl border border-sky-400/35 bg-blue-600/10 px-3 text-xs font-black text-sky-200 shadow-[0_0_22px_rgba(59,130,246,0.16)]"
          >
            <FileImage className="h-5 w-5" />
            Archivo
          </button>
        </div>
      </header>

      {previewImage && (
        <section className="app-card rounded-2xl p-4">
          <div className="relative overflow-hidden rounded-xl border border-white/10">
            <img src={previewImage} alt="Vista previa del ticket" className="max-h-64 w-full object-cover" />
            <button onClick={cancelPreview} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/75 text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={handleSubmit}
            disabled={createTicket.isPending}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-600 px-4 py-3 text-sm font-black text-white shadow-[0_0_28px_rgba(34,211,238,0.2)] disabled:opacity-55"
          >
            {createTicket.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {createTicket.isPending ? "Enviando..." : "Confirmar envio"}
          </button>
          {createTicket.isError && <p className="mt-3 text-center text-xs font-bold text-red-300">Error al enviar. Intentalo de nuevo.</p>}
        </section>
      )}

      {createTicket.isSuccess && !previewImage && (
        <div className="rounded-xl border border-emerald-300/25 bg-emerald-400/10 p-3 text-center text-sm font-bold text-emerald-300">
          Ticket enviado correctamente. Estado: Pendiente
        </div>
      )}

      {cameraError && (
        <div className="rounded-xl border border-yellow-300/25 bg-yellow-300/10 p-3 text-center text-xs font-bold text-yellow-200">
          {cameraError}
        </div>
      )}

      <div className="flex gap-5 overflow-x-auto border-b border-white/10 scrollbar-hide">
        {filters.map((item) => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value)}
            className={`relative pb-3 text-sm font-bold transition-colors ${
              filter === item.value ? "text-cyan-300" : "text-slate-300"
            }`}
          >
            {item.label}
            {filter === item.value && <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.8)]" />}
          </button>
        ))}
      </div>

      {isLoading ? (
        <StateSkeleton count={4} type="row" />
      ) : isError ? (
        <StateError onRetry={() => refetch()} />
      ) : !filtered?.length ? (
        <section className="app-card rounded-2xl p-6">
          <StateEmpty
            icon={ImageIcon}
            title="Aun no tienes mas tickets"
            subtitle={filter !== "all" ? "No tienes tickets con este estado." : "Sube tu ticket y empieza a ganar puntos."}
            actionLabel="Subir mi primer ticket"
            onAction={openCamera}
          />
        </section>
      ) : (
        <div className="space-y-3">
          {filtered.map((ticket: any) => {
            const cfg = statusConfig[ticket.status as keyof typeof statusConfig] || statusConfig.pending;
            const StatusIcon = cfg.icon;
            const created = new Date(ticket.created_at);

            return (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="app-card flex w-full items-center gap-3 rounded-2xl p-4 text-left transition-transform active:scale-[0.99]"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${cfg.border} ${cfg.bg}`}>
                  <StatusIcon className={`h-6 w-6 ${cfg.text}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-black leading-tight">
                        {ticket.total_amount ? `${Number(ticket.total_amount).toFixed(2)} EUR` : "Ticket"}
                      </p>
                      <p className="mt-1 text-xs text-slate-300">
                        {created.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })} · {created.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <p className={`mt-1 text-xs font-bold ${cfg.text}`}>{cfg.subtitle}</p>
                      {ticket.status === "rejected" && ticket.rejection_reason && (
                        <p className="mt-2 text-[11px] font-medium text-red-300">Motivo: {ticket.rejection_reason}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${cfg.pill}`}>{cfg.label}</span>
                      {ticket.points_awarded > 0 && (
                        <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2 py-1 text-[10px] font-black text-emerald-300">
                          +{ticket.points_awarded} pts
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="border-purple-300/25 bg-[#090a20] text-white">
          <DialogHeader>
            <DialogTitle>Detalle del ticket</DialogTitle>
          </DialogHeader>
          {selectedTicket && <TicketDetail ticket={selectedTicket} onRetry={() => fileInputRef.current?.click()} />}
        </DialogContent>
      </Dialog>

      <Dialog open={cameraOpen} onOpenChange={(open) => (open ? setCameraOpen(true) : closeCamera())}>
        <DialogContent className="border-cyan-300/25 bg-[#090a20] text-white">
          <DialogHeader>
            <DialogTitle>Foto del ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
              <video ref={videoRef} playsInline muted className="max-h-[60vh] w-full object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={closeCamera} className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-black text-slate-200">
                Cancelar
              </button>
              <button onClick={capturePhoto} className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-600 px-4 py-3 text-sm font-black text-white shadow-[0_0_28px_rgba(34,211,238,0.22)]">
                Hacer foto
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const TicketDetail = ({ ticket, onRetry }: { ticket: any; onRetry: () => void }) => {
  const cfg = statusConfig[ticket.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = cfg.icon;

  return (
    <div className="space-y-4">
      {ticket.image_url ? (
        <img src={ticket.image_url} alt="Ticket" className="max-h-56 w-full rounded-xl object-cover" />
      ) : (
        <div className="flex h-36 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          <ReceiptText className="h-10 w-10 text-slate-400" />
        </div>
      )}

      <div className="app-card rounded-2xl p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${cfg.border} ${cfg.bg}`}>
            <StatusIcon className={`h-5 w-5 ${cfg.text}`} />
          </div>
          <div>
            <p className="text-sm font-black">{cfg.label}</p>
            <p className={`text-xs font-bold ${cfg.text}`}>{cfg.subtitle}</p>
          </div>
        </div>

        <InfoRow label="Total" value={ticket.total_amount ? `${Number(ticket.total_amount).toFixed(2)} EUR` : "Pendiente"} />
        <InfoRow label="Fecha" value={new Date(ticket.created_at).toLocaleDateString("es-ES")} />
        {ticket.points_awarded > 0 && <InfoRow label="Puntos" value={`+${ticket.points_awarded} pts`} accent="text-emerald-300" />}
      </div>

      {ticket.status === "rejected" && (
        <div className="rounded-xl border border-red-400/25 bg-red-500/10 p-4">
          <p className="text-sm font-black text-red-300">Motivo de rechazo</p>
          <p className="mt-1 text-xs text-slate-300">{ticket.rejection_reason || "No especificado"}</p>
          <button onClick={onRetry} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400/10 px-4 py-3 text-xs font-black text-cyan-300">
            Reenviar ticket <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ label, value, accent = "text-white" }: { label: string; value: string; accent?: string }) => (
  <div className="flex items-center justify-between border-t border-white/10 py-3 first:border-t-0 first:pt-0 last:pb-0">
    <span className="text-sm text-slate-400">{label}</span>
    <span className={`text-sm font-black ${accent}`}>{value}</span>
  </div>
);

export default TicketsPage;

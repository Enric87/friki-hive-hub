import { useState } from "react";
import { MessageCircle, Plus, Edit, Trash2, Save, X } from "lucide-react";

const mockKB = [
  { id: 1, question: "¿Cuál es vuestro horario?", answer: "Lunes a Viernes: 10:00 – 20:00\nSábados: 10:00 – 14:00 y 17:00 – 20:00\nDomingos: Cerrado", tags: ["horario"] },
  { id: 2, question: "¿Cuál es la política de devoluciones?", answer: "Aceptamos devoluciones en 15 días con ticket original y producto sin abrir. Para TCG sellado, 7 días.", tags: ["devolucion", "política"] },
  { id: 3, question: "¿Cómo reservo una figura?", answer: "Ve a la sección Reservas en la app y elige el producto. También puedes pedir info en el chat.", tags: ["reserva", "figura"] },
  { id: 4, question: "¿Cómo funcionan los puntos?", answer: "Ganas 1 punto por cada 1€ gastado. Sube de nivel para desbloquear recompensas exclusivas.", tags: ["puntos", "fidelización"] },
  { id: 5, question: "¿Aceptáis pedidos online?", answer: "Actualmente solo vendemos en tienda física. Puedes reservar productos desde la app para recoger.", tags: ["stock", "pedidos"] },
];

const mockLogs = [
  { id: 1, user: "Carlos M.", question: "¿Tenéis boosters de Pokémon?", matched: false, time: "Hace 10 min" },
  { id: 2, user: "Ana R.", question: "¿Cuál es vuestro horario?", matched: true, time: "Hace 25 min" },
  { id: 3, user: "Pedro L.", question: "¿Cuántos puntos tengo?", matched: true, time: "Hace 1h" },
  { id: 4, user: "Laura G.", question: "¿Hacéis envíos?", matched: false, time: "Hace 2h" },
];

const AdminChatbot = () => {
  const [tab, setTab] = useState<"kb" | "logs">("kb");

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-display">Chatbot</h1>
        {tab === "kb" && (
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />Añadir FAQ
          </button>
        )}
      </div>

      <div className="flex bg-muted rounded-xl p-1 max-w-xs">
        {[
          { key: "kb" as const, label: "Base de Conocimiento" },
          { key: "logs" as const, label: "Logs" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
              tab === t.key ? "bg-card text-foreground glow-primary" : "text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "kb" ? (
        <div className="space-y-3">
          {mockKB.map((item) => (
            <div key={item.id} className="bg-card rounded-xl p-4 border border-border/50 space-y-2">
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold">{item.question}</p>
                <div className="flex gap-1 shrink-0 ml-2">
                  <button className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-surface-hover">
                    <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center hover:bg-destructive/20">
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground whitespace-pre-line">{item.answer}</p>
              <div className="flex gap-1">
                {item.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Usuario</th>
                  <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Pregunta</th>
                  <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Match</th>
                  <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Hora</th>
                </tr>
              </thead>
              <tbody>
                {mockLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border/50 hover:bg-surface-hover transition-colors">
                    <td className="px-4 py-3">{log.user}</td>
                    <td className="px-4 py-3 max-w-[300px] truncate">{log.question}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${log.matched ? "bg-neon-green/10 text-neon-green" : "bg-neon-orange/10 text-neon-orange"}`}>
                        {log.matched ? "Sí" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChatbot;

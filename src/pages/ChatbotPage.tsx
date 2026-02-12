import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ShoppingBag, Calendar, Gift, Star, Phone } from "lucide-react";

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
  actions?: { label: string; icon: typeof Star; path: string }[];
};

const initialMessages: Message[] = [
  {
    id: 1,
    role: "bot",
    text: "¡Hola! 👋 Soy el asistente de la tienda. ¿En qué puedo ayudarte?",
    actions: [
      { label: "Ver mis puntos", icon: Star, path: "/perfil" },
      { label: "Reservar figura", icon: ShoppingBag, path: "/reservas" },
      { label: "Ver eventos", icon: Calendar, path: "/eventos" },
      { label: "Mis sorteos", icon: Gift, path: "/sorteos" },
    ],
  },
];

const botResponses: Record<string, string> = {
  horario: "🕐 Nuestro horario es:\nLunes a Viernes: 10:00 – 20:00\nSábados: 10:00 – 14:00 y 17:00 – 20:00\nDomingos: Cerrado",
  puntos: "⭐ Tienes 1.250 puntos acumulados. Nivel: Pro Gamer. ¡Te faltan 750 para subir a Legendario!",
  reserva: "📦 Para reservar una figura, ve a la sección Reservas y elige el producto. También puedes pedir info aquí sobre cualquier figura.",
  eventos: "📅 Próximos eventos:\n• 15 Feb - Torneo Pokémon TCG (4 plazas)\n• 20 Feb - Lanzamiento One Piece OP-10\n• 22 Feb - Quedada Warhammer",
  devolucion: "🔄 Aceptamos devoluciones en 15 días con ticket original y producto sin abrir. Para TCG sellado, 7 días.",
  stock: "📋 No tengo esa info en este momento. Te sugiero reservar para ser el primero cuando llegue, o pregunta directamente en tienda.",
};

const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const lower = input.toLowerCase();
      let response = "🤔 No tengo esa info ahora. ¿Quieres que te ponga en contacto con la tienda?";
      for (const [key, val] of Object.entries(botResponses)) {
        if (lower.includes(key)) {
          response = val;
          break;
        }
      }
      const botMsg: Message = { id: Date.now() + 1, role: "bot", text: response };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-lg mx-auto animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-6 pb-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-display">Chat</h1>
        <a href="tel:+34600000000" className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
          <Phone className="w-4 h-4 text-muted-foreground" />
        </a>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 space-y-3 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "bot" && (
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div className={`max-w-[80%] space-y-2 ${msg.role === "user" ? "items-end" : ""}`}>
              <div className={`rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border/50 rounded-bl-md"
              }`}>
                {msg.text}
              </div>
              {msg.actions && (
                <div className="flex flex-wrap gap-1.5">
                  {msg.actions.map((a) => (
                    <button key={a.label} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-muted text-xs hover:bg-surface-hover transition-colors">
                      <a.icon className="w-3 h-3 text-primary" />
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe tu pregunta..."
            className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
          />
          <button
            onClick={handleSend}
            className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;

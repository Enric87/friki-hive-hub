import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Bot, User, ShoppingBag, Calendar, Gift, Star, Phone, Loader2, Receipt, MapPin, MessageCircle, HelpCircle, AlertCircle, RefreshCw } from "lucide-react";

/* ── Types ── */
type QuickAction = {
  label: string;
  icon: typeof Star;
  path?: string;
  href?: string; // for external links (tel:, whatsapp)
};

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
  actions?: QuickAction[];
  isError?: boolean;
};

type Intent =
  | "greeting"
  | "help"
  | "points"
  | "tickets"
  | "rewards"
  | "reservations"
  | "events"
  | "contact"
  | "fallback";

/* ── Intent detection ── */
const normalize = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^\w\s]/g, " ") // remove punctuation
    .replace(/\s+/g, " ")
    .trim();

const intentKeywords: { intent: Intent; keywords: string[] }[] = [
  { intent: "contact", keywords: ["contacto", "whatsapp", "telefono", "llamar", "direccion", "horario"] },
  { intent: "tickets", keywords: ["ticket", "enviar ticket", "subir ticket", "qr", "escanear", "compra"] },
  { intent: "rewards", keywords: ["canjear", "recompensa", "premio", "cupon", "cupones", "descuento"] },
  { intent: "points", keywords: ["punto", "saldo", "nivel", "mis puntos"] },
  { intent: "events", keywords: ["evento", "torneo", "inscribirme", "inscripcion", "quedada"] },
  { intent: "reservations", keywords: ["reservar", "reserva", "figura", "preorder", "encargar", "manga"] },
  { intent: "help", keywords: ["ayuda", "opciones", "que puedes hacer", "menu", "como funciona"] },
  { intent: "greeting", keywords: ["hola", "buenas", "hey", "hello", "holaa", "buenos dias", "buenas tardes", "buenas noches", "hi", "saludos", "que tal"] },
];

const detectIntent = (text: string): Intent => {
  const norm = normalize(text);
  if (!norm) return "fallback";

  for (const { intent, keywords } of intentKeywords) {
    for (const kw of keywords) {
      if (norm.includes(kw)) {
        console.log(`[Chatbot] Intent: ${intent} | keyword: "${kw}" | input: "${text}"`);
        return intent;
      }
    }
  }

  console.log(`[Chatbot] Intent: fallback | input: "${text}"`);
  return "fallback";
};

/* ── Quick action presets ── */
const coreChips: QuickAction[] = [
  { label: "Ver puntos", icon: Star, path: "/perfil" },
  { label: "Enviar ticket", icon: Receipt, path: "/tickets" },
  { label: "Recompensas", icon: Gift, path: "/recompensas" },
  { label: "Reservar", icon: ShoppingBag, path: "/reservas" },
  { label: "Ver eventos", icon: Calendar, path: "/eventos" },
  { label: "Contactar tienda", icon: Phone, path: "/contacto" },
];

const contactChips: QuickAction[] = [
  { label: "Contacto", icon: Phone, path: "/contacto" },
  { label: "WhatsApp", icon: MessageCircle, path: "/contacto" },
  { label: "Dirección", icon: MapPin, path: "/contacto" },
];

/* ── Responses per intent ── */
const intentResponses: Record<Intent, { text: string; actions: QuickAction[] }> = {
  greeting: {
    text: "¡Hola! 👋 ¿Qué quieres hacer hoy? Puedo ayudarte con puntos, tickets, recompensas, reservas y eventos.",
    actions: coreChips,
  },
  help: {
    text: "🤝 Puedo ayudarte con: puntos, tickets, recompensas, reservas y eventos. Elige una opción:",
    actions: coreChips,
  },
  points: {
    text: "⭐ Aquí tienes tus puntos. ¿Quieres ver el historial?",
    actions: [
      { label: "Ver puntos", icon: Star, path: "/perfil" },
      { label: "Enviar ticket", icon: Receipt, path: "/tickets" },
    ],
  },
  tickets: {
    text: "🧾 Puedes subir un ticket con foto o QR. Te aviso cuando esté revisado.",
    actions: [
      { label: "Enviar ticket", icon: Receipt, path: "/tickets" },
    ],
  },
  rewards: {
    text: "🎁 Aquí puedes canjear tus puntos por premios y ver tus cupones.",
    actions: [
      { label: "Ir a recompensas", icon: Gift, path: "/recompensas" },
    ],
  },
  reservations: {
    text: "📦 Vamos a reservas. ¿Qué quieres reservar?",
    actions: [
      { label: "Ver reservas", icon: ShoppingBag, path: "/reservas" },
    ],
  },
  events: {
    text: "📅 Aquí están los próximos eventos. Puedes inscribirte desde la lista.",
    actions: [
      { label: "Ver eventos", icon: Calendar, path: "/eventos" },
    ],
  },
  contact: {
    text: "📞 Te paso las opciones para contactar con la tienda:",
    actions: contactChips,
  },
  fallback: {
    text: "Aún no tengo esa información en el chat 😅 ¿Te refieres a puntos, tickets, recompensas, reservas o eventos?",
    actions: coreChips,
  },
};

/* ── Initial message ── */
const initialMessages: Message[] = [
  {
    id: 1,
    role: "bot",
    text: "¡Hola! 👋 ¿Qué quieres hacer hoy? Puedo ayudarte con puntos, tickets, recompensas, reservas y eventos.",
    actions: coreChips,
  },
];

/* ── Component ── */
const ChatbotPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const handleAction = (action: QuickAction) => {
    if (action.href) {
      window.open(action.href, "_blank", "noopener");
    } else if (action.path) {
      navigate(action.path);
    }
  };

  const processMessage = (text: string) => {
    try {
      const intent = detectIntent(text);
      const response = intentResponses[intent];
      const botMsg: Message = {
        id: Date.now() + 1,
        role: "bot",
        text: response.text,
        actions: response.actions,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("[Chatbot] Error processing message:", err);
      const errorMsg: Message = {
        id: Date.now() + 1,
        role: "bot",
        text: "⚠️ Ha ocurrido un error. Pulsa Reintentar o elige una opción.",
        actions: coreChips,
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (text?: string) => {
    const value = text ?? input;
    if (!value.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now(), role: "user", text: value.trim() };
    setMessages((prev) => [...prev, userMsg]);
    const query = value;
    if (!text) setInput("");
    setIsTyping(true);

    setTimeout(() => processMessage(query), 500 + Math.random() * 300);
  };

  const handleRetry = () => {
    // Find last user message and retry
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) {
      // Remove last error message
      setMessages((prev) => prev.filter((m) => !m.isError || m.id !== prev[prev.length - 1]?.id));
      handleSend(lastUser.text);
    }
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
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.isError ? "bg-destructive/10" : "bg-primary/10"}`}>
                {msg.isError ? (
                  <AlertCircle className="w-4 h-4 text-destructive" />
                ) : (
                  <Bot className="w-4 h-4 text-primary" />
                )}
              </div>
            )}
            <div className={`max-w-[80%] space-y-2 ${msg.role === "user" ? "items-end" : ""}`}>
              <div
                className={`rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : msg.isError
                      ? "bg-destructive/5 border border-destructive/20 rounded-bl-md"
                      : "bg-card border border-border/50 rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
              {msg.isError && (
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs hover:bg-destructive/20 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reintentar
                </button>
              )}
              {msg.actions && !msg.isError && (
                <div className="flex flex-wrap gap-1.5">
                  {msg.actions.map((a) => (
                    <button
                      key={a.label}
                      onClick={() => handleAction(a)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-muted text-xs hover:bg-accent active:scale-95 transition-all"
                    >
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
        {isTyping && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="rounded-2xl px-3.5 py-2.5 bg-card border border-border/50 rounded-bl-md flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Escribiendo...</span>
            </div>
          </div>
        )}
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
            onClick={() => handleSend()}
            disabled={isTyping || !input.trim()}
            className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;

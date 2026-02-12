import { MapPin, Clock, Phone, MessageCircle, ExternalLink } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";

const ContactoPage = () => {
  const { config } = useStore();

  const contactItems = [
    { icon: MapPin, label: "Dirección", value: config.address, color: "text-primary" },
    { icon: Clock, label: "Horario", value: config.schedule, color: "text-neon-orange" },
    { icon: Phone, label: "Teléfono", value: config.phone, color: "text-neon-purple" },
  ].filter((i) => i.value);

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-display">Contacto</h1>

      <div className="bg-card rounded-2xl p-5 border border-border text-center space-y-2">
        {config.logo_url ? (
          <img src={config.logo_url} alt={config.store_name} className="w-16 h-16 mx-auto rounded-xl object-contain" />
        ) : (
          <div className="w-16 h-16 mx-auto rounded-xl gradient-neon flex items-center justify-center text-2xl">🏪</div>
        )}
        <h2 className="text-lg font-bold text-display">{config.store_name}</h2>
        <p className="text-sm text-muted-foreground">Tu tienda friki de confianza</p>
      </div>

      <div className="space-y-3">
        {contactItems.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-card rounded-xl p-4 border border-border flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground whitespace-pre-line">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {config.whatsapp_url && (
        <a
          href={config.whatsapp_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-neon-green/10 text-neon-green font-medium text-sm border border-neon-green/20 hover:bg-neon-green/20 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          Escríbenos por WhatsApp
        </a>
      )}

      {Object.keys(config.social_links).length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-display tracking-wider uppercase mb-3">Redes Sociales</h2>
          <div className="space-y-2">
            {Object.entries(config.social_links).map(([name, url]) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-card rounded-xl p-3 border border-border hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium capitalize">{name}</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ContactoPage;

import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-frikiquest.png";
import iconEscanea from "@/assets/Escanea tickets.png";
import iconGana from "@/assets/Gana Puntos.png";
import iconCanjea from "@/assets/Canjea recompensas.png";
import iconEventos from "@/assets/Eventos y reservas.png";
import iconAlerta from "@/assets/Alerta TCG.png";

const features = [
  { img: iconEscanea, text: "Escanea tickets", highlight: "y acumula puntos" },
  { img: iconGana, text: "Gana puntos", highlight: "con tus compras" },
  { img: iconCanjea, text: "Canjea recompensas", highlight: "por tus puntos" },
  { img: iconEventos, text: "Eventos y reservas", highlight: "exclusivos" },
  { img: iconAlerta, text: "Alertas TCG", highlight: "novedades al instante" },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 text-center">
      {/* Logo */}
      <h1 className="text-4xl font-extrabold text-gradient-neon text-display tracking-tight mb-1">
        FrikiQuest
      </h1>
      <p className="text-muted-foreground text-base mb-8">
        Tu mundo friki en un solo lugar
      </p>

      {/* Hero Image */}
      <img
        src={heroImage}
        alt="FrikiQuest mascota"
        className="w-64 h-64 object-contain mx-auto mb-10"
      />

      {/* Features */}
      <div className="space-y-4 mb-10 w-full max-w-sm text-left">
        {features.map(({ img, text, highlight }) => (
          <div key={text} className="flex items-center gap-3">
            <img src={img} alt={text} className="w-12 h-12 object-contain shrink-0" />
            <p className="text-sm text-foreground">
              <span className="font-semibold">{text}</span>{" "}
              <span className="text-muted-foreground">{highlight}</span>
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate("/")}
        className="w-full max-w-sm py-3.5 rounded-2xl gradient-neon text-white font-semibold text-base shadow-lg hover:opacity-90 transition-opacity mb-4"
      >
        Crear cuenta
      </button>

      <p className="text-sm text-muted-foreground mb-6">
        Ya tengo cuenta →{" "}
        <button onClick={() => navigate("/")} className="text-primary font-semibold hover:underline">
          Iniciar sesión
        </button>
      </p>

      <p className="text-xs text-muted-foreground/60">
        Únete a tu tienda friki favorita
      </p>
    </div>
  );
};

export default LandingPage;

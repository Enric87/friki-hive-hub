

## Tema claro con fondo blanco limpio

Cambiar la estética de la app de tema oscuro gaming/neon a un diseño limpio con fondo blanco, manteniendo los acentos de color pero adaptados para modo claro.

### Cambios principales

**1. `src/index.css` - Variables CSS del tema**
- Cambiar `--background` a blanco (`0 0% 100%`)
- Cambiar `--foreground` a oscuro (`230 25% 10%`)
- Cambiar `--card` a gris muy claro (`0 0% 98%`)
- Cambiar `--muted` a gris suave (`220 14% 96%`)
- Cambiar `--border` a gris claro (`220 13% 91%`)
- Adaptar `--surface-hover` y `--surface-active` para modo claro
- Adaptar `--sidebar-*` para fondo blanco
- Adaptar `--popover` para modo claro
- Mantener los colores neon (primary cyan, purple, orange, pink, green) pero con tonos ligeramente ajustados para contrastar bien sobre blanco

**2. `src/index.css` - Utilidades de glow**
- Reducir intensidad de los box-shadow de glow para que sean sutiles sobre fondo blanco
- Ajustar `.border-glow` para que sea mas sutil

**3. `src/components/AppLayout.tsx`**
- Cambiar `bg-card/95` del nav inferior a `bg-white/95` para consistencia

**4. `src/components/AdminLayout.tsx`**
- Adaptar sidebar al tema claro

No se cambian componentes de pagina individuales ya que todos usan las variables CSS que se actualizan centralmente.

### Detalles tecnicos

Las variables HSL en `:root` controlan todo el tema. Al cambiarlas a valores claros, todas las paginas (HomePage, Tickets, Reservas, Eventos, Sorteos, TCG, Chatbot, Perfil y Admin) se actualizan automaticamente sin tocar sus archivos.


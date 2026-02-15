

## Quitar botón "TCG Alerts" de la Home

Se eliminará el botón de acceso rápido "TCG Alerts" de la página principal (`src/pages/HomePage.tsx`).

### Cambios

**`src/pages/HomePage.tsx`**
- Eliminar la entrada `{ icon: Bell, label: "TCG Alerts", path: "/tcg", color: "text-neon-green", badge: 3 }` del array `quickActions` (línea 10)
- Eliminar la importación de `Bell` de lucide-react (ya no se usa)
- Los 3 botones restantes (Enviar Ticket, Reservar, Eventos) se redistribuirán automáticamente en el grid de 4 columnas, o se puede ajustar a `grid-cols-3` para que queden centrados




# Plan: FrikiQuest V2 - Fase 1 (Core de Negocio)

Este plan cubre las funcionalidades prioritarias del PRD. Dado el alcance, se divide en **Fase 1** (este plan) y Fase 2 (posterior).

---

## Fase 1A: Sistema de Recompensas

### Base de datos
- Crear tabla `rewards` (id, name, description, points_cost, image_url, reward_type, stock, active, created_at)
- Crear tabla `reward_redemptions` (id, user_id, reward_id, coupon_code, status [disponible/usado/caducado], redeemed_at, expires_at)
- RLS: usuarios ven recompensas activas (lectura publica) y solo sus propios canjes
- Politica admin via tabla `user_roles` con funcion `has_role()` para gestionar recompensas

### Frontend cliente
- Nueva pagina `/recompensas` con catalogo de premios canjeables
- Cada recompensa muestra: imagen, nombre, coste en puntos, stock
- Boton "Canjear" que descuenta puntos y genera cupon unico
- Seccion "Mis Canjes" con estado del cupon
- Anadir acceso rapido desde HomePage y desde MorePage

### Panel admin
- Nueva pagina `/admin/recompensas` para CRUD de recompensas
- Tabla con nombre, coste, stock, estado activo
- Formulario para crear/editar recompensas
- Vista de canjes realizados por usuarios

---

## Fase 1B: Marca Blanca por Tienda

### Base de datos
- Crear tabla `store_config` (id, store_name, logo_url, primary_color, secondary_color, address, schedule, phone, whatsapp_url, social_links jsonb)
- Una sola fila por tienda (singleton pattern)
- RLS: lectura publica, escritura solo admin

### Frontend
- Crear contexto `StoreContext` que carga la configuracion al inicio
- Aplicar logo y nombre de tienda en: pantalla de bienvenida, Home header, Eventos
- Los colores de acento se aplican dinamicamente via CSS variables
- Nueva pagina `/contacto` con direccion, horario, telefono, boton WhatsApp y redes sociales

### Panel admin
- Seccion en admin para editar la configuracion de la tienda (nombre, logo, colores, datos de contacto)

---

## Fase 1C: Gamificacion Real - Niveles Mejorados

### Base de datos
- Crear tabla `levels` (id, name, min_points, icon, badge_image_url, benefits text[], sort_order)
- Crear tabla `achievements` (id, name, description, icon, condition_type, condition_value)
- Crear tabla `user_achievements` (id, user_id, achievement_id, unlocked_at)
- Trigger o funcion que actualiza el nivel del perfil cuando cambian los puntos

### Frontend
- Mejorar la seccion de niveles en PerfilPage con datos reales de la tabla `levels`
- Mostrar beneficios por nivel
- Badge visual junto al nombre del usuario
- Seccion de logros desbloqueados en perfil

---

## Fase 1D: Perfil de Usuario Mejorado

### Conectar datos reales
- Perfil carga datos de `profiles` (puntos, nivel, display_name, avatar)
- Mostrar estadisticas reales: tickets enviados, reservas realizadas, eventos asistidos
- Mostrar cupones activos desde `reward_redemptions`
- Mostrar logros desbloqueados desde `user_achievements`
- Boton de cerrar sesion funcional conectado a `signOut()` del AuthContext

---

## Fase 1E: Reservas con Urgencia

### Mejoras en UI
- Anadir indicador "Quedan X unidades" en las tarjetas de producto
- Mostrar "Reserva expira en 48h" con countdown visual
- Estado adicional "caducada" en el flujo
- Indicador visual de urgencia (color rojo/naranja) cuando quedan pocas unidades

---

## Detalles Tecnicos

### Nuevas tablas SQL (resumen)

```text
rewards            -> catalogo de recompensas
reward_redemptions -> canjes de usuarios
store_config       -> configuracion marca blanca
levels             -> definicion de niveles
achievements       -> logros disponibles
user_achievements  -> logros desbloqueados
user_roles         -> roles admin (con has_role function)
```

### Nuevas rutas

```text
/recompensas          -> catalogo de recompensas (cliente)
/contacto             -> info de contacto de la tienda
/admin/recompensas    -> gestion de recompensas (admin)
/admin/config-tienda  -> configuracion marca blanca (admin)
```

### Archivos nuevos principales

- `src/pages/RecompensasPage.tsx`
- `src/pages/ContactoPage.tsx`
- `src/contexts/StoreContext.tsx`
- `src/pages/admin/AdminRecompensas.tsx`
- `src/pages/admin/AdminConfigTienda.tsx`
- `src/hooks/useProfile.ts`
- `src/hooks/useRewards.ts`

### Archivos modificados

- `src/App.tsx` - nuevas rutas
- `src/pages/HomePage.tsx` - datos reales del perfil, acceso a recompensas, branding tienda
- `src/pages/PerfilPage.tsx` - datos reales, estadisticas, logros, cerrar sesion funcional
- `src/pages/ReservasPage.tsx` - indicadores de urgencia y stock
- `src/pages/MorePage.tsx` - enlace a recompensas y contacto
- `src/components/AppLayout.tsx` - branding de tienda
- `src/components/AdminLayout.tsx` - nuevas secciones admin
- `src/index.css` - variables CSS dinamicas para marca blanca

### Nota sobre Fase 2
La Fase 2 (push notifications, historial completo, dashboard mejorado) se abordara en un plan posterior una vez completada la Fase 1.


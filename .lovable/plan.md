

## Emails de confirmacion para Reservas y Eventos

### Estado actual

- No existen tablas `reservations` ni `event_registrations` en la base de datos (ambas paginas usan datos mock).
- La tabla `profiles` no tiene columna `email`.
- No hay infraestructura de envio de emails.

Por tanto, este plan cubre la creacion completa del backend de reservas/eventos + el sistema de emails.

---

### Paso 1 -- Agregar columna `email` a `profiles`

Agregar `email TEXT` a la tabla `profiles` y actualizar el trigger `handle_new_user()` para copiar el email de `auth.users` al crear el perfil.

---

### Paso 2 -- Crear tablas principales

**`public.events`**
- `id`, `title`, `description`, `date` (timestamptz), `time` (text), `location`, `category`, `price`, `image_url`, `spots_total`, `spots_taken`, `created_at`
- RLS: lectura publica, escritura solo admin

**`public.event_registrations`**
- `id`, `event_id` (FK events), `user_id`, `status` (confirmed/cancelled), `created_at`
- RLS: usuarios ven/crean las suyas, admin ve todas

**`public.reservations`**
- `id`, `user_id`, `product_name`, `product_image_url`, `category`, `price`, `status` (solicitada/confirmada/en_camino/lista/retirada/cancelada), `expires_at`, `created_at`
- RLS: usuarios ven/crean las suyas, admin ve y actualiza todas

**`public.email_outbox`**
- `id`, `type` (reservation_confirmed, event_registered), `user_id`, `to_email`, `payload` (jsonb), `status` (pending/sent/failed), `created_at`, `sent_at`, `error`
- RLS: solo admin/service_role puede leer/actualizar. Usuarios no acceden.

---

### Paso 3 -- Triggers para encolar emails

- **AFTER INSERT en `reservations`**: inserta fila en `email_outbox` con type `reservation_confirmed`, el email del usuario desde `profiles`, y payload con nombre del producto, estado y fecha de expiracion.
- **AFTER INSERT en `event_registrations`**: inserta fila en `email_outbox` con type `event_registered`, email del usuario, y payload con nombre del evento y fecha.

Ambos triggers usan `SECURITY DEFINER` para poder leer `profiles.email`.

---

### Paso 4 -- Configurar secret de Resend

Se pedira la API key de Resend para almacenarla como secret del proyecto. Se usara desde la edge function.

---

### Paso 5 -- Edge Function `process-email-outbox`

Funcion que:
1. Lee filas con `status = 'pending'` de `email_outbox` (usando service_role key).
2. Segun `type`, renderiza el asunto y cuerpo HTML:
   - `reservation_confirmed`: asunto "Reserva confirmada -- {producto}", cuerpo con producto, estado, fecha expiracion.
   - `event_registered`: asunto "Inscripcion confirmada -- {evento}", cuerpo con evento, fecha, ubicacion.
3. Envia con la API de Resend (`POST https://api.resend.com/emails`).
4. Marca `status = 'sent'` y `sent_at = now()`, o `status = 'failed'` con el error.

Se configura `verify_jwt = false` en config.toml y se valida auth en codigo.

---

### Paso 6 -- Cron para procesar la cola

Programar con `pg_cron` + `pg_net` la invocacion automatica de `process-email-outbox` cada 2 minutos.

---

### Paso 7 -- Actualizar frontend

**`ReservasPage.tsx`**
- Reemplazar mock data por queries reales a `reservations`.
- El boton "Reservar" hace INSERT en `reservations` (el trigger encola el email automaticamente).
- Tab "Mis Reservas" muestra reservas del usuario logueado.

**`EventosPage.tsx`**
- Cargar eventos desde tabla `events`.
- Boton "Inscribirme" hace INSERT en `event_registrations` (el trigger encola el email).
- Mostrar estado "Inscrito" basado en datos reales.

**`AdminReservas.tsx` y `AdminEventos.tsx`**
- Conectar a datos reales en lugar de mocks.
- Admin puede cambiar estados de reservas.

**`PerfilPage.tsx`**
- Mostrar email del usuario (solo lectura).

---

### Paso 8 -- Seed de eventos

Insertar 4-5 eventos de ejemplo en la tabla `events` para que la pagina no aparezca vacia.

---

### Seccion tecnica

**Dependencias**: Resend API key (secret).

**Tablas nuevas**: `events`, `event_registrations`, `reservations`, `email_outbox`.

**Triggers DB**: 2 funciones PL/pgSQL con `SECURITY DEFINER`.

**Edge Function**: 1 (`process-email-outbox`).

**Cron job**: 1 (cada 2 min via `pg_cron`).

**Archivos frontend modificados**: `ReservasPage.tsx`, `EventosPage.tsx`, `AdminReservas.tsx`, `AdminEventos.tsx`, `PerfilPage.tsx`, nuevos hooks `useReservations.ts`, `useEvents.ts`.


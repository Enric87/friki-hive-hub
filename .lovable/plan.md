

# PDR FrikiQuest -- Plan de Implementacion MVP

## Resumen

Este plan aborda las 5 epicas del PDR para cerrar el loop completo: Ticket -> Puntos -> Recompensa -> Cupon -> Validacion. Se priorizan los arreglos visibles (chat roto, recompensas vacias) y la funcionalidad minima vendible.

**Nota:** Pagos quedan fuera de alcance segun el PDR. Las inscripciones a eventos y reservas se registran sin cobro online.

---

## Estado actual detectado

| Area | Estado |
|---|---|
| Chat | Tiene respuestas por reglas pero los chips de accion NO navegan (sin onClick). No hay "Escribiendo...", ni retry, ni feedback de error |
| Recompensas | Backend completo (tabla rewards, RPC redeem_reward, hook useRewards) pero **0 recompensas en la base de datos** |
| Tickets | UI estatica con datos mock. Botones "Foto Ticket" y "Escanear QR" no hacen nada |
| Eventos | Datos mock hardcodeados. Boton "Inscribirme" sin onClick |
| Reservas | Datos mock. Boton "Reservar" sin onClick |
| Historial | Solo muestra canjes de recompensas, no hay ledger de puntos |
| Estados globales | No existen componentes reutilizables de skeleton/empty/error |

---

## EPICA 1 -- Chat funcional

### 1.1 Envio de mensajes con feedback

Archivo: `src/pages/ChatbotPage.tsx`

- Anadir indicador "Escribiendo..." mientras el bot procesa
- Mostrar estado de error con boton "Reintentar" si falla
- Prevenir doble envio (deshabilitar boton mientras procesa)
- Mantener autoscroll existente (ya funciona)

### 1.2 Chips de accion funcionales

Archivo: `src/pages/ChatbotPage.tsx`

- Anadir `onClick={() => navigate(a.path)}` a los botones de accion rapida
- Rutas validas: `/perfil`, `/reservas`, `/eventos`, `/sorteos`
- Usar `useNavigate` de react-router-dom

### 1.3 Bot fallback mejorado

Archivo: `src/pages/ChatbotPage.tsx`

- Ampliar diccionario de intents con mas keywords: contacto, cupon, nivel, ayuda, tienda
- Cuando no entiende: mostrar chips de sugerencia ("Ver puntos", "Eventos", "Contactar tienda")
- Respuesta por defecto incluye opcion de contacto directo

---

## EPICA 2 -- Recompensas con contenido

### 2.1 Seed de recompensas demo

Insertar 6 recompensas de ejemplo en la tabla `rewards` via herramienta de datos:

| Nombre | Puntos | Tipo | Tags |
|---|---|---|---|
| 10% Descuento en compra | 200 | discount | Popular |
| Funda Dragon Shield gratis | 500 | product | Nuevo |
| Dado D20 metalico exclusivo | 750 | product | Exclusivo |
| Entrada gratis torneo TCG | 300 | event | Popular |
| 20% Descuento en figuras | 1000 | discount | Limitado |
| Pack Booster TCG sorpresa | 1500 | product | Exclusivo |

### 2.2 Empty state mejorado

Archivo: `src/pages/RecompensasPage.tsx`

- El empty state ya existe pero se mejorara con un CTA "Como funciona" que explique el sistema de puntos
- Si el usuario es admin (verificar via user_roles), mostrar CTA "Crear recompensa" que navega a `/admin/recompensas`

### 2.3 Canje (ya funciona)

El flujo de canje ya esta implementado correctamente:
- Validacion de puntos
- Modal de confirmacion
- RPC `redeem_reward` atomico
- Generacion de cupon

No requiere cambios.

---

## EPICA 3 -- Puntos con transparencia (Ledger)

### 3.1 Crear tabla points_ledger

Nueva tabla en base de datos:

```text
points_ledger
- id (UUID, PK)
- user_id (UUID, NOT NULL)
- delta (INTEGER, NOT NULL) -- positivo o negativo
- type (TEXT) -- "ticket_approved", "reward_redeemed", "manual_adjustment"
- ref_id (UUID, nullable) -- referencia a ticket o recompensa
- note (TEXT, nullable)
- created_at (TIMESTAMPTZ)
```

Politicas RLS:
- Usuarios ven sus propios movimientos
- Admins ven todos

### 3.2 Pantalla Historial mejorada

Archivo: `src/pages/HistorialPage.tsx`

- Reemplazar la vista actual (solo canjes) por el ledger completo
- Mostrar saldo actual arriba
- Lista cronologica con icono segun tipo (ticket verde +, canje rojo -)
- Cada movimiento muestra delta, tipo, fecha y nota

---

## EPICA 4 -- Tickets funcionales

### 4.1 Crear tabla tickets

Nueva tabla en base de datos:

```text
tickets
- id (UUID, PK)
- user_id (UUID, NOT NULL)
- status (TEXT) -- "pending", "approved", "rejected"
- total_amount (NUMERIC, nullable)
- points_awarded (INTEGER, default 0)
- image_url (TEXT, nullable)
- rejection_reason (TEXT, nullable)
- created_at (TIMESTAMPTZ)
- reviewed_at (TIMESTAMPTZ, nullable)
```

Politicas RLS:
- Usuarios pueden crear e insertar sus propios tickets
- Usuarios ven sus propios tickets
- Admins ven y actualizan todos

### 4.2 Storage bucket para imagenes de tickets

Crear bucket `ticket-images` para subir fotos de tickets.

### 4.3 Flujo de envio

Archivo: `src/pages/TicketsPage.tsx`

- Boton "Foto Ticket": abrir selector de archivo (accept="image/*" capture="environment")
- Preview de la imagen antes de enviar
- Boton "Confirmar envio" que sube imagen al storage y crea registro en tickets
- Mostrar confirmacion con ID y estado "Pendiente"
- Reemplazar datos mock por consulta real a la tabla tickets

### 4.4 Detalle de ticket

Archivo: `src/pages/TicketsPage.tsx`

- Al pulsar un ticket, mostrar dialogo con detalle
- Si rechazado: mostrar motivo y CTA "Reenviar"
- Si aprobado: mostrar puntos generados
- Si pendiente: mostrar "En revision"

---

## EPICA 5 -- Estados globales

### 5.1 Componentes reutilizables

Crear 3 componentes nuevos:

**`src/components/StateEmpty.tsx`**
- Icono, titulo, subtitulo, CTA opcional
- Reutilizable en todas las listas vacias

**`src/components/StateError.tsx`**
- Mensaje de error con boton "Reintentar"
- Acepta onRetry callback

**`src/components/StateSkeleton.tsx`**
- Skeleton de tarjeta animada
- Configurable por numero de items

### 5.2 Aplicar en todas las paginas

Actualizar las siguientes paginas para usar los componentes globales:
- TicketsPage (loading, empty, error)
- RecompensasPage (ya tiene parcialmente)
- EventosPage (loading, empty, error)
- ReservasPage (loading, empty, error)
- HistorialPage (ya tiene parcialmente)

---

## Detalles tecnicos

### Migraciones de base de datos (2 migraciones):

**Migracion 1: tickets + storage**
- Crear tabla `tickets` con RLS
- Crear bucket `ticket-images` con politica de upload para usuarios autenticados

**Migracion 2: points_ledger**
- Crear tabla `points_ledger` con RLS
- Crear trigger opcional: al aprobar ticket, insertar en ledger automaticamente

### Archivos a crear:

| Archivo | Descripcion |
|---|---|
| `src/components/StateEmpty.tsx` | Componente empty state reutilizable |
| `src/components/StateError.tsx` | Componente error state reutilizable |
| `src/components/StateSkeleton.tsx` | Componente skeleton reutilizable |
| `src/hooks/useTickets.ts` | Hook para CRUD de tickets |
| `src/hooks/usePointsLedger.ts` | Hook para leer ledger de puntos |

### Archivos a modificar:

| Archivo | Cambio |
|---|---|
| `src/pages/ChatbotPage.tsx` | Chips navegables, typing indicator, retry, mas intents |
| `src/pages/TicketsPage.tsx` | Reescribir con datos reales, upload de imagen, detalle |
| `src/pages/HistorialPage.tsx` | Mostrar ledger completo en vez de solo canjes |
| `src/pages/RecompensasPage.tsx` | Empty state mejorado con CTAs |
| `src/pages/EventosPage.tsx` | Aplicar estados globales (datos siguen mock por ahora) |
| `src/pages/ReservasPage.tsx` | Aplicar estados globales (datos siguen mock por ahora) |

### Insercion de datos:

- 6 recompensas seed en tabla `rewards`

### Orden de implementacion sugerido:

1. Componentes de estado globales (base para todo lo demas)
2. Chat: chips + typing + retry + intents
3. Seed de recompensas + empty state mejorado
4. Migracion tickets + storage + flujo de envio
5. Migracion ledger + pantalla historial mejorada
6. Aplicar estados globales en todas las paginas


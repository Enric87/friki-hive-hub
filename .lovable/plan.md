
# Eventos funcionales + Pagos con Stripe

## Resumen

Actualmente los botones "Inscribirme" y "Reservar" no hacen nada porque son datos mock sin conexion a base de datos. Este plan conecta todo con el backend y anade pagos reales con Stripe para eventos de pago.

---

## 1. Crear tablas en la base de datos

Se necesitan dos tablas nuevas:

**`events`** - Eventos creados por el admin
- id, title, date, time, location, category, price (nullable), max_spots, image_url, created_at

**`event_registrations`** - Inscripciones de usuarios
- id, event_id, user_id, status (pendiente/confirmada/cancelada), payment_intent_id (nullable), created_at

Politicas RLS:
- Cualquier usuario autenticado puede ver eventos
- Usuarios pueden ver sus propias inscripciones
- Usuarios pueden crear inscripciones propias
- Admins pueden gestionar todo

---

## 2. Integrar Stripe para pagos

Se habilitara Stripe para procesar pagos de eventos con precio.

**Flujo de pago:**
1. Usuario pulsa "Inscribirme" en evento de pago
2. Se abre un dialogo de confirmacion mostrando el precio
3. Se crea un Payment Intent via edge function
4. Se muestra formulario de tarjeta embebido (Stripe Elements)
5. Al confirmar pago, se crea la inscripcion automaticamente

**Para eventos gratuitos:**
1. Usuario pulsa "Inscribirme"
2. Dialogo de confirmacion simple
3. Se crea la inscripcion directamente sin pago

---

## 3. Actualizar pagina de Eventos

Cambios en `EventosPage.tsx`:
- Cargar eventos desde la base de datos en lugar de mock data
- Boton "Inscribirme" funcional con dialogo de confirmacion
- Para eventos con precio: mostrar formulario de pago Stripe
- Para eventos gratis: inscripcion directa
- Mostrar plazas disponibles en tiempo real
- Cambiar estado a "Inscrito" tras inscripcion exitosa
- Boton "Completo" cuando no hay plazas

---

## 4. Actualizar pagina de Reservas

Cambios en `ReservasPage.tsx`:
- Boton "Reservar" funcional con dialogo de confirmacion
- Crear registro de reserva en la base de datos
- Feedback visual con toast de exito

*(Las reservas no requieren pago, solo registro)*

---

## 5. Verificar enlaces de HomePage

Revisar que los botones "Inscribirme" y "Participar" en la pagina de inicio navegan correctamente a las paginas correspondientes.

---

## Detalles tecnicos

### Migracion de base de datos:

```sql
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Evento',
  price NUMERIC(10,2),
  max_spots INTEGER NOT NULL DEFAULT 16,
  image_url TEXT,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id),
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmada',
  payment_intent_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Authenticated can view events"
  ON public.events FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage events"
  ON public.events FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own registrations"
  ON public.event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register"
  ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage registrations"
  ON public.event_registrations FOR ALL USING (has_role(auth.uid(), 'admin'));
```

### Edge function para pagos:

- `create-event-payment` - Crea un Stripe Payment Intent y devuelve el client_secret
- Valida que el evento existe, tiene precio, y hay plazas
- Tras pago exitoso, crea la inscripcion

### Archivos a modificar/crear:

| Archivo | Cambio |
|---|---|
| `src/pages/EventosPage.tsx` | Cargar datos reales, dialogo inscripcion, integracion Stripe Elements |
| `src/pages/ReservasPage.tsx` | Boton "Reservar" funcional con confirmacion |
| `src/pages/HomePage.tsx` | Verificar que enlaces funcionan correctamente |
| `supabase/functions/create-event-payment/index.ts` | **Nuevo** - Edge function para Payment Intent |

### Dependencias nuevas:

- `@stripe/stripe-js` - SDK de Stripe para frontend
- `@stripe/react-stripe-js` - Componentes React de Stripe

### Prerequisito:

- Habilitar Stripe en el proyecto (se pedira la clave secreta de Stripe)

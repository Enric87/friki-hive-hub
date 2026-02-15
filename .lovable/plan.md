
# PDR FrikiQuest -- Plan de Implementacion MVP

## Estado de implementacion

| Tarea | Estado |
|---|---|
| Componentes globales (StateEmpty, StateError, StateSkeleton) | ✅ Completado |
| Chat: chips navegables + typing + intents expandidos | ✅ Completado |
| Seed de 6 recompensas demo | ✅ Completado |
| Migracion tickets + storage + points_ledger | ✅ Completado |
| TicketsPage: upload real + detalle + estados | ✅ Completado |
| HistorialPage: ledger completo + saldo | ✅ Completado |
| Hooks: useTickets, usePointsLedger | ✅ Completado |
| RecompensasPage: empty state mejorado | Pendiente (ya tiene seed, funciona) |
| EventosPage/ReservasPage: estados globales | Pendiente (siguen mock) |

## Archivos creados

- `src/components/StateEmpty.tsx`
- `src/components/StateError.tsx`
- `src/components/StateSkeleton.tsx`
- `src/hooks/useTickets.ts`
- `src/hooks/usePointsLedger.ts`

## Archivos modificados

- `src/pages/ChatbotPage.tsx` - Chips con navigate, typing indicator, intents expandidos, fallback con acciones
- `src/pages/TicketsPage.tsx` - Upload real, datos de DB, detalle con dialogo, estados globales
- `src/pages/HistorialPage.tsx` - Ledger completo, saldo, timeline unificada

## Tablas creadas

- `public.tickets` (con RLS)
- `public.points_ledger` (con RLS)
- Storage bucket `ticket-images`

## Datos insertados

- 6 recompensas seed en tabla `rewards`

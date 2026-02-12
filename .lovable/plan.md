
# Plan de Seguridad y Preparacion para Publicacion

## Resumen

Basado en el escaneo de seguridad y la revision del codigo, hay 4 areas principales a abordar antes de publicar la app para usuarios reales.

---

## 1. Activar proteccion de contrasenas filtradas

El escaneo detecta que "Leaked Password Protection" esta desactivada. Se activara mediante la configuracion de autenticacion para que los usuarios no puedan registrarse con contrasenas comprometidas.

Ademas, se anadira validacion de contrasena en el formulario de registro:
- Minimo 8 caracteres
- Al menos una mayuscula y un numero
- Feedback visual al usuario

---

## 2. Proteger datos de contacto en store_config

**Problema detectado (nivel error):** La tabla `store_config` es legible publicamente y expone telefono y direccion fisica.

**Solucion:** Los datos de contacto deben seguir siendo publicos porque se muestran en la pagina de Contacto a usuarios autenticados. Sin embargo, se modificara la politica RLS para que solo usuarios autenticados puedan leer la configuracion, en lugar de cualquier persona anonima.

- Cambiar la politica SELECT de `true` a `auth.uid() IS NOT NULL`
- Esto evita que bots o visitantes no autenticados accedan a la informacion

---

## 3. Validacion de inputs en formularios

Se anadira validacion con feedback visual en:
- **AuthPage (registro):** Email valido, contrasena con requisitos (8+ chars, mayuscula, numero)
- **AdminConfigTienda:** Validar URLs (WhatsApp, logo), telefono, longitud de campos
- Uso de `encodeURIComponent` para el enlace de WhatsApp en ContactoPage

---

## 4. Proteccion del panel admin

**Problema actual:** Las rutas `/admin/*` no tienen `ProtectedRoute` ni verificacion de rol admin. Cualquier usuario autenticado puede acceder al panel de administracion.

**Solucion:** Crear un componente `AdminRoute` que verifique que el usuario tiene el rol `admin` en la tabla `user_roles` antes de permitir acceso.

---

## Detalles tecnicos

### Archivos a modificar:

| Archivo | Cambio |
|---|---|
| `src/pages/AuthPage.tsx` | Validacion de contrasena (8+ chars, mayuscula, numero) con mensajes de error |
| `src/pages/ContactoPage.tsx` | `encodeURIComponent` en URL de WhatsApp |
| `src/pages/admin/AdminConfigTienda.tsx` | Validacion basica de URLs y longitud de campos |
| `src/components/AdminRoute.tsx` | **Nuevo** - Componente que verifica rol admin via `user_roles` |
| `src/App.tsx` | Envolver rutas admin con `AdminRoute` |

### Migracion de base de datos:

```sql
-- Restringir store_config a usuarios autenticados
DROP POLICY IF EXISTS "Anyone can read store config" ON public.store_config;
CREATE POLICY "Authenticated users can read store config"
  ON public.store_config FOR SELECT
  USING (auth.uid() IS NOT NULL);
```

### Configuracion de autenticacion:

- Activar "Leaked Password Protection" via herramienta de configuracion de auth

### Componente AdminRoute (nuevo):

- Consulta `user_roles` para verificar si el usuario actual tiene rol `admin`
- Muestra spinner mientras carga
- Redirige a `/home` si no es admin
- Se usara en `App.tsx` envolviendo el `AdminLayout`

### Validacion de contrasena en registro:

- Mostrar lista de requisitos con iconos check/x
- Deshabilitar boton hasta cumplir todos los requisitos
- Requisitos: 8+ caracteres, 1 mayuscula, 1 numero

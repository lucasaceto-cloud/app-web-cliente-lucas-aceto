# Vértice Ultralight

E-commerce de equipamiento ultraliviano de montaña (mochilas, refugios, aislamiento, cocina y filtros) hecho para la materia **Aplicaciones Web Cliente** (ISTEA, 2C 2026).

**Sitio publicado:** https://lucasaceto-cloud.github.io/app-web-cliente-lucas-aceto/

## Stack

100% nativo, sin librerías, frameworks ni CDNs:

- HTML5 semántico
- CSS3 (variables, Grid, Flexbox, `position: sticky`)
- JavaScript Vanilla con scripts clásicos `defer` (sin módulos: `type="module"` falla con CORS en `file://`)
- Supabase (PostgREST) como base de datos, consultada con `fetch` nativo

## Qué hace

- **Catálogo** dibujado desde Supabase, con filtros por categoría y precio, orden y búsqueda predictiva accesible.
- **Ficha de producto** dinámica (`producto.html?id=...`) con especificaciones técnicas.
- **Mochila** con presupuesto de peso, guardada en `localStorage` y sincronizada entre pestañas.
- **Carrito** dinámico: cantidades, eliminar, total, descuento por transferencia y formulario de despacho con validación nativa (la confirmación es una simulación).

## Estructura

```
index.html  producto.html  carrito.html  contacto.html
style.css
favicon.svg
js/
  config.js      URL y clave publishable de Supabase, constantes
  utilidades.js  formato de moneda, búsqueda por id, normalización de texto
  api.js         único archivo que hace fetch a Supabase (promesa productosListos)
  almacen.js     lectura y escritura de la mochila en localStorage
  contador.js    contador del header
  filtros.js     estado de los filtros en sessionStorage
  catalogo.js    render del catálogo, filtros y orden
  busqueda.js    sugerencias del buscador (combobox)
  mochila.js     panel "Mi mochila"
  producto.js    ficha de producto
  carrito.js     carrito
supabase/seed.sql   esquema, política RLS y datos de los 12 productos
Predictions.md      predicción técnica y prompt de cada cambio
```

## Cómo correrlo

1. Clonar el repositorio.
2. Abrir la carpeta en VS Code y levantarla con la extensión **Live Server** (o abrir `index.html`).
3. No hace falta instalar nada: el catálogo se pide a Supabase al cargar.

## Supabase

- La tabla `productos` y sus datos están documentados en `supabase/seed.sql`, que es idempotente (`on conflict ... do update`).
- El navegador usa la clave **publishable**, que es pública por diseño. Lo que protege los datos es **RLS**: hay una única política de lectura pública y ninguna de escritura, así que `INSERT`, `UPDATE` y `DELETE` desde el front son rechazados.
- Una clave `secret` o `service_role` nunca va en este repositorio.
- Todo texto que viene de la red se inserta con `textContent`, nunca con `innerHTML`.

## Flujo de trabajo

Una rama por tarea, commits atómicos con mensajes semánticos (`feat`, `fix`, `style`, `perf`, `docs`, `chore`) y Pull Requests con la plantilla de `.github/pull_request_template.md`. Cada cambio de código registra su prompt y su predicción técnica en `Predictions.md`.

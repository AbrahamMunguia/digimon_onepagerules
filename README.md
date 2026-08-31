# Digimon One Page Rules

Frontend de catálogo de Digimon: lista de digimons, detalle de digimon, DigiFarm
y árbol genealógico (digievoluciones). Next.js App Router + React 19, priorizando
performance sobre diseño (sin estilos aún).

## Correr en local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # build de producción (genera ~2600 páginas estáticas)
npm run lint    # eslint
```

## Vistas

- `/digimons` — lista paginada (24 por página) con búsqueda por nombre vía `?q=`.
  Server Component, renderizado dinámico (depende de `searchParams`).
- `/digimons/[id]` — detalle de un digimon. Estático, prerenderizado en build con
  `generateStaticParams` para las 1317 fichas del catálogo.
- `/digimons/[id]/relationships` — árbol genealógico (formas anteriores y
  siguientes de digievolución). También estático.
- `/digifarm` — Client Component. Lee los ids guardados en `localStorage` y
  resuelve los datos completos vía un Server Action (`lib/actions.ts`), para no
  enviar el catálogo completo al bundle del cliente.

## Datos

Los datos vienen de `data/digimon.json` (scrapeado desde el enciclopedia oficial
de Digimon con `../digimon_scraper.py`, en el directorio padre). Cada registro
solo trae `id`, `name` y `stage` — el scraper no captura líneas de digievolución.

`data/relationships.json` es una muestra curada a mano (Botamon → Koromon → Agumon
→ Greymon → MetalGreymon → WarGreymon, y Tsunomon → Gabumon → Garurumon) para
tener contenido real que probar el árbol genealógico. **No cubre el catálogo
completo**: la mayoría de los digimons no tendrán datos de digievolución hasta
que se capture esa relación (por ejemplo ampliando el scraper para leer la
página de detalle de cada Digimon, que sí muestra sus líneas de evolución).

## Arquitectura / decisiones de performance

- `lib/data.ts` centraliza el acceso a datos, envuelto en `React.cache()` y con
  funciones `async` aunque hoy lean un JSON local — así se puede apuntar a una
  API o base de datos real sin tocar los call sites.
- Todas las vistas son Server Components salvo las islas que necesitan
  interactividad o `localStorage` (`DigifarmButton`, `DigifarmCount`, la página
  `/digifarm`), para mantener el JS de cliente al mínimo.
- El estado de DigiFarm usa `useSyncExternalStore` sobre `localStorage` en vez
  de `useState` + `useEffect`, evitando un render extra y el parpadeo de
  hidratación típico de leer storage del navegador tras montar.
- `/digimons/[id]` y `/digimons/[id]/relationships` se generan 100% estáticas en
  build (`generateStaticParams`), listas para servirse desde CDN. Si el catálogo
  crece mucho, cambiar a ISR (`dynamicParams: true` + `revalidate`) en vez de
  generar todo en build.

## Nota sobre Next.js 16

Este proyecto usa Next.js 16 (Turbopack) con el modelo de caché "clásico"
(sin `cacheComponents` / Cache Components activado). Los tipos de rutas
(`PageProps<'/ruta'>`, `LayoutProps<'/ruta'>`) se regeneran corriendo
`next dev`, `next build` o `next typegen`.

# Digimon One Page Rules

Frontend de catálogo de Digimon: lista de digimons, detalle de digimon, DigiFarm
y árbol genealógico (digievoluciones). Next.js App Router + React 19, priorizando
performance sobre diseño (sin estilos aún). Disponible en español e inglés.

## Correr en local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # build de producción (genera ~5300 páginas estáticas, es + en)
npm run lint    # eslint
```

## Idiomas (i18n)

El sitio soporta español (`es`, idioma por defecto) e inglés (`en`) mediante rutas
con prefijo de idioma bajo `app/[lang]` (`/es/...`, `/en/...`). `proxy.ts` en la
raíz redirige cualquier ruta sin prefijo (p. ej. `/digimons`) a `/es/digimons`. Los
textos de UI viven en `app/[lang]/dictionaries/{es,en}.json` y se cargan vía
`app/[lang]/dictionaries.ts` (`getDictionary`). El dropdown de idioma en el navbar
(`components/LanguageSwitcher.tsx`) cambia de idioma preservando la página actual.

**Los nombres y datos de digimons (`data/`) nunca se traducen** — solo se traduce
la interfaz (navegación, botones, disclaimers, copy de páginas).

## Vistas

- `/[lang]/digimons` — lista paginada (24 por página) con búsqueda por nombre vía
  `?q=`. Server Component, renderizado dinámico (depende de `searchParams`).
- `/[lang]/digimons/[id]` — detalle de un digimon. Estático, prerenderizado en
  build con `generateStaticParams` para las 1317 fichas del catálogo, en ambos
  idiomas.
- `/[lang]/digimons/[id]/relationships` — árbol genealógico (formas anteriores y
  siguientes de digievolución). También estático.
- `/[lang]/digifarm` — Client Component. Lee los ids guardados en `localStorage` y
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
  interactividad o `localStorage` (`DigifarmButton`, `DigifarmCount`,
  `LanguageSwitcher`, la vista `/[lang]/digifarm`), para mantener el JS de
  cliente al mínimo.
- El estado de DigiFarm usa `useSyncExternalStore` sobre `localStorage` en vez
  de `useState` + `useEffect`, evitando un render extra y el parpadeo de
  hidratación típico de leer storage del navegador tras montar.
- `/[lang]/digimons/[id]` y `/[lang]/digimons/[id]/relationships` se generan
  100% estáticas en build (`generateStaticParams`, combinado con los locales de
  `app/[lang]/layout.tsx`), listas para servirse desde CDN. Si el catálogo crece
  mucho, cambiar a ISR (`dynamicParams: true` + `revalidate`) en vez de generar
  todo en build.

## Convenciones de commits, branches y PRs

Para poder generar el changelog automáticamente, este repo exige:

- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) —
  `<type>(<scope>)?: <descripción>`, con `type` en `feat, fix, docs, style, refactor, perf, test,
  build, ci, chore, revert`. Ejemplo: `feat(digifarm): agregar botón de favoritos`.
- **Branches**: [Conventional Branch](https://conventional-branch.github.io/) —
  `<type>/<descripción-corta>`, con `type` en `feature, bugfix, hotfix, release, chore, docs,
  refactor, test`. Ejemplo: `feature/digifarm-favoritos`. `main`, `master`, `develop` y las
  branches `claude/*` (worktrees de Claude Code) están exentas.
- **Títulos de PR**: mismo formato que los commits.

`npm install` configura automáticamente `git config core.hooksPath .githooks`, que valida commits
(`commit-msg`) y nombres de branch (`pre-push`) en local. Los PRs se validan también en CI
([.github/workflows/code-standards.yml](.github/workflows/code-standards.yml)). Las reglas viven en
[.githooks/lib/conventional.sh](.githooks/lib/conventional.sh) — es la única fuente de verdad, tanto
para los hooks como para el skill `code-standards` de Claude Code.

## Nota sobre Next.js 16

Este proyecto usa Next.js 16 (Turbopack) con el modelo de caché "clásico"
(sin `cacheComponents` / Cache Components activado). Los tipos de rutas
(`PageProps<'/ruta'>`, `LayoutProps<'/ruta'>`) se regeneran corriendo
`next dev`, `next build` o `next typegen`. El archivo `middleware.js` está
deprecado en Next 16 y fue renombrado a `proxy.js` — por eso el enrutamiento de
idioma vive en `proxy.ts`, no en `middleware.ts`.

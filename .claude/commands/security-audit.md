---
description: Sin argumento, corre una auditoría de seguridad completa (agente `security`). Con un ID de finding (ej. SEC-004), implementa el fix de ese finding específico. Con --all o --by-severity <SEVERIDAD>, implementa el fix de varios findings en lote.
argument-hint: "[SEC-NNN | --all | --by-severity <CRITICAL|HIGH|MEDIUM|LOW|INFO>]"
---

Este comando tiene cuatro modos, según la forma de `$ARGUMENTS`:

- vacío → **Modo 1: auditoría**
- `SEC-NNN` (un solo ID) → **Modo 2: fix puntual**
- `--all` → **Modo 3: fix en lote, todos los findings accionables**
- `--by-severity <SEVERIDAD>` → **Modo 4: fix en lote, filtrado por severidad**

Determina el modo antes de hacer nada más. Si `$ARGUMENTS` no calza con ninguna de estas formas
(por ejemplo un ID mal formado, o `--by-severity` sin severidad, o una severidad que no es
`CRITICAL|HIGH|MEDIUM|LOW|INFO`), dile al usuario qué formas son válidas y detente — no adivines.

## Modo 1: sin argumento → auditoría

Si `$ARGUMENTS` está vacío, delega la auditoría completa al agente `security` (definido en
[.claude/agents/security.md](.claude/agents/security.md)) usando la herramienta Agent con
`subagent_type: "security"`. No le pases nada más — es una auditoría estándar que él mismo decide
cómo versionar y dónde escribir (`security-report/`).

Si la herramienta Agent no reconoce `subagent_type: "security"` (por ejemplo en una sesión donde el
subagente de proyecto aún no fue registrado), no te detengas a pedir permiso por eso: sigue tú mismo
las instrucciones completas de [.claude/agents/security.md](.claude/agents/security.md) como si
fueras ese agente — incluyendo su restricción dura de no editar código de la app, solo escribir en
`security-report/` — y dilo explícitamente en tu respuesta.

## Modo 2: `SEC-NNN` → implementar el fix de un finding puntual

Si `$ARGUMENTS` es un único ID de finding generado por una auditoría previa
(formato `SEC-NNN`, ej. `SEC-004`, ver [security-report/CHANGELOG.md](../../security-report/CHANGELOG.md)).
Este modo **no es una auditoría** — es implementación de código, así que lo haces tú directamente
(la sesión principal), no el agente `security` (que es audit-only y no tiene `Edit`).

1. Si no existe `security-report/CHANGELOG.md`, dile al usuario que corra `/security-audit` sin
   argumentos primero para generar el reporte, y detente ahí — no inventes un finding que no existe.
2. Busca `$ARGUMENTS` en [security-report/CHANGELOG.md](../../security-report/CHANGELOG.md) y
   [security-report/SUGGESTIONS.md](../../security-report/SUGGESTIONS.md). Si el ID no aparece en
   ninguno de los dos, dile al usuario que no lo encontraste y sugiere revisar el ID o correr
   `/security-audit` sin argumentos para refrescar el reporte. No implementes nada a ciegas.
3. Si el finding existe pero:
   - está marcado `✅ RESOLVED` en la entrada más reciente que lo menciona: dile al usuario que el
     reporte ya lo da por resuelto y pregunta si de todas formas quiere revisarlo (podría ser una
     regresión no detectada aún por una nueva auditoría).
   - es severidad INFO con "no code change needed" / "no se requiere acción" en `SUGGESTIONS.md`:
     dile al usuario por qué ese ID no requiere cambio de código — no fuerces una implementación
     donde el propio reporte dice que no hace falta.
4. Si el finding es accionable (con remediación concreta en `SUGGESTIONS.md`):
   a. Lee el finding completo en `CHANGELOG.md` y su remediación sugerida en `SUGGESTIONS.md`.
   b. Lee el/los archivo(s) reales involucrados — pueden haber cambiado desde la auditoría, así que
      usa la remediación como guía, no como texto a copiar literalmente si el código actual difiere.
   c. Implementa el cambio mínimo necesario para resolver **ese finding específico** — nada más.
      No aproveches para hacer refactors, arreglar otros findings, o tocar código no relacionado.
   d. Verifica el cambio de forma apropiada al tipo de fix (ej. `npm run lint`, revisar en el
      navegador si afecta algo visible, `npm audit` si es una dependencia).
5. Nunca edites nada bajo `security-report/` — ese directorio es salida exclusiva del agente
   `security`. Marcar el finding como resuelto en `CHANGELOG.md` le corresponde a la próxima
   auditoría (`/security-audit` sin argumentos), no a este modo.
6. Resume en el chat qué finding se resolvió, qué archivos cambiaste y qué le recomiendas al usuario
   correr después (típicamente: `/security-audit` sin argumentos, para que el reporte refleje el fix).

## Modos 3 y 4: `--all` / `--by-severity <SEVERIDAD>` → fix en lote

Ambos son variantes del mismo procedimiento de lote; solo difieren en qué findings seleccionan.
Igual que el Modo 2, esto es implementación de código en la sesión principal, no el agente
`security`.

### Selección de findings

1. Si no existe `security-report/CHANGELOG.md`, dile al usuario que corra `/security-audit` sin
   argumentos primero para generar el reporte, y detente ahí.
2. Toma la entrada más reciente (`[vN]`, la de más arriba) de
   [security-report/CHANGELOG.md](../../security-report/CHANGELOG.md) — es la vista vigente de qué
   sigue abierto. Lista todos sus `SEC-NNN`.
3. Descarta automáticamente (sin preguntar, uno por uno sería ruido en modo lote), pero anótalos
   para el resumen final:
   - findings marcados `✅ RESOLVED` en esa entrada.
   - findings INFO cuya entrada en [security-report/SUGGESTIONS.md](../../security-report/SUGGESTIONS.md)
     diga "no code change needed" / "no se requiere acción" — no forzar una implementación donde el
     propio reporte dice que no hace falta.
4. De lo que queda:
   - **`--all`**: todos son candidatos.
   - **`--by-severity <SEVERIDAD>`**: valida que `<SEVERIDAD>` sea una de `CRITICAL|HIGH|MEDIUM|LOW|INFO`
     (case-insensitive; normalízala a mayúsculas). Si no lo es, dile al usuario las severidades
     válidas y detente. Filtra la lista a solo los findings con esa severidad exacta según
     `CHANGELOG.md`.
5. Si la lista de candidatos queda vacía (todo ya resuelto, todo era INFO sin acción, o no hay
   findings de la severidad pedida), dile eso al usuario explícitamente y detente — no hay nada que
   implementar.
6. Ordena los candidatos por severidad (CRITICAL → HIGH → MEDIUM → LOW → INFO) y luego por número de
   ID ascendente. Ese es el orden de ejecución.

### Ejecución (uno a la vez, no en paralelo)

Procesa los candidatos **secuencialmente**, uno completo antes de pasar al siguiente — varios
findings pueden tocar el mismo archivo (ej. varios relacionados a `next.config.ts`), y procesarlos en
paralelo arriesga pisarse las ediciones entre sí. Para cada finding, repite exactamente los pasos
4a–4d del Modo 2:

a. Lee el finding completo en `CHANGELOG.md` y su remediación sugerida en `SUGGESTIONS.md`.
b. Lee el/los archivo(s) reales involucrados — pueden haber cambiado desde la auditoría, así que usa
   la remediación como guía, no como texto a copiar literalmente si el código actual difiere.
c. Implementa el cambio mínimo necesario para resolver **ese finding específico** — nada más. No
   aproveches para hacer refactors, arreglar otros findings en el mismo cambio, o tocar código no
   relacionado. Aunque estés resolviendo varios findings en esta corrida, cada uno debe seguir siendo
   una edición aislada y atribuible a su propio ID.
d. Verifica el cambio de forma apropiada al tipo de fix (ej. `npm run lint`, revisar en el navegador
   si afecta algo visible, `npm audit` si es una dependencia).

Si un finding requiere una decisión que solo le corresponde al usuario (ej. una llamada de negocio,
una elección de proveedor/infraestructura, algo con blast radius alto o difícil de revertir), no la
adivines: sáltalo, sigue con el resto de la lista, y anótalo en el resumen final como "omitido, requiere
decisión del usuario" junto con la pregunta puntual que haría falta responder.

### Cierre

5. Nunca edites nada bajo `security-report/` — ese directorio es salida exclusiva del agente
   `security`. Marcar los findings como resueltos en `CHANGELOG.md` le corresponde a la próxima
   auditoría (`/security-audit` sin argumentos), no a este modo.
6. Da un resumen consolidado único al final (no uno por finding intermedio): qué findings se
   resolvieron y qué archivos cambió cada uno, cuáles se omitieron automáticamente y por qué (ya
   resueltos / INFO sin acción / fuera del filtro de severidad), y cuáles se omitieron por requerir
   decisión del usuario. Cierra recomendando correr `/security-audit` sin argumentos para que el
   reporte refleje los fixes.

Argumento recibido para esta ejecución: $ARGUMENTS

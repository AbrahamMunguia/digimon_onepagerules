---
description: Sin argumento, corre una auditoría de seguridad completa (agente `security`). Con un ID de finding (ej. SEC-004), implementa el fix de ese finding específico del reporte.
argument-hint: "[SEC-NNN opcional]"
---

Este comando tiene dos modos, según si `$ARGUMENTS` viene vacío o no.

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

## Modo 2: con argumento → implementar el fix de un finding puntual

Si `$ARGUMENTS` no está vacío, se asume que es un ID de finding generado por una auditoría previa
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

Argumento recibido para esta ejecución: $ARGUMENTS

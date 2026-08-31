---
name: library-support-validation
description: Antes de instalar o recomendar una librería NUEVA (npm/yarn/pnpm install|add), valida que tenga al menos 1 año de historial de soporte activo en el registro npm. Úsalo proactivamente antes de cualquier instalación de una dependencia nueva, aunque el usuario no lo pida explícitamente. No aplica a actualizar una dependencia ya existente. Las librerías ya instaladas que incumplan la norma no se bloquean aquí — se reportan como finding en el agente `security` / `/security-audit`.
---

Este skill hace cumplir una norma del proyecto: no se instalan librerías nuevas que no tengan al
menos un año de historial de soporte activo. Lee todo este archivo antes de actuar.

## La norma

Una librería nueva necesita **al menos 365 días de span** entre su primer release publicado y su
release más reciente en el registro npm. Ese span es lo que cuenta como "soporte" — no hace falta
que los releases dentro de ese año sean grandes: **parches pequeños de seguridad o releases de
nuevas features cuentan igual de bien como evidencia de soporte activo.** Lo que no cuenta es un
paquete con un solo release histórico (span = 0) o uno publicado hace menos de un año.

## Fuente de verdad — no reimplementes el cálculo

El cálculo vive en un único script, compartido con el agente `security` para que ambos midan
exactamente lo mismo y nunca haya drift entre lo que este skill aprueba y lo que
`/security-audit` reporta después:

```bash
.claude/skills/library-support-validation/check-library-support.sh <paquete>
```

- Exit `0` → cumple la norma (imprime un JSON con `verdict:"PASS"` en stdout y un resumen legible
  en stderr).
- Exit `1` → **no** cumple la norma (`verdict:"FAIL"`, con `spanDays` y las fechas de primer/último
  release).
- Exit `2` → error de consulta (nombre mal escrito, paquete privado/no publicado en el registro
  público, o sin conexión) — esto no es un veredicto sobre la norma, no lo trates como un fallo de
  la librería.

No calcules el span de memoria ni leas `npm view` a mano — siempre corre este script.

## Cuándo actuar

Antes de ejecutar `npm install <pkg>`, `npm i <pkg>`, `yarn add <pkg>`, `pnpm add <pkg>` (o editar
`package.json` a mano para agregar una entrada nueva) para una **dependencia que no está ya en
`package.json`**. También antes de recomendarle al usuario que agregue una librería nueva al
proyecto, aunque todavía no la vaya a instalar en el momento.

**No aplica** a:
- Actualizar el rango de versión de una dependencia que ya está en `package.json` (`npm update`,
  bump de versión) — eso no es una librería nueva.
- `devDependencies` de tooling que ya está establecido en el ecosistema si ya pasó por esta
  validación antes (no re-valides en cada sesión algo que ya se instaló y aprobó).

## Procedimiento

1. Identifica el nombre exacto del paquete en el registro npm (para paquetes con scope, incluye el
   scope: `@org/paquete`).
2. Corre el script:
   ```bash
   .claude/skills/library-support-validation/check-library-support.sh <paquete>
   ```
3. **Si el exit code es `0` (PASS)**: procede con la instalación normalmente. No hace falta
   mencionárselo al usuario salvo que pregunte — es el camino esperado.
4. **Si el exit code es `1` (FAIL)**: **no instales la librería.** Muéstrale al usuario el resumen
   del script (fechas de primer/último release, `spanDays`, cantidad de releases) y explica que
   incumple la norma del proyecto de 1 año mínimo de soporte. Pregúntale si quiere:
   - elegir una alternativa con más trayectoria, o
   - instalarla de todas formas, como excepción consciente (por ejemplo porque no hay alternativa
     madura, o el caso de uso es experimental/descartable).

   Solo procede con la instalación tras una confirmación explícita del usuario en el chat —no
   asumas que "seguramente está bien" ni reintentes la instalación sin preguntar. Esto es una
   decisión de producto/riesgo, no algo que debas resolver solo.
5. **Si el exit code es `2` (error de consulta)**: no asumas que pasa ni que falla. Dile al usuario
   que no se pudo verificar (nombre incorrecto, paquete privado, o problema de red) y pídele que
   confirme el nombre o decida cómo proceder — no instales a ciegas cuando la validación no pudo
   correr.
6. Si el script imprime el `AVISO` de release reciente muy antiguo (posible paquete abandonado)
   aunque haya pasado la norma de 1 año, menciónaselo al usuario como una observación aparte — no
   es un fallo de la norma, pero es información relevante para la decisión.

## Librerías ya instaladas que incumplen la norma

Este skill **no desinstala nada ni bloquea el build/dev** por dependencias que ya estaban en
`package.json` antes de esta validación. Ese seguimiento le corresponde al agente `security`
(ver [.claude/agents/security.md](../../agents/security.md)), que en cada corrida de
`/security-audit` corre este mismo script contra todas las dependencias declaradas y reporta
cualquier incumplimiento como un finding `SEC-NNN` en `security-report/CHANGELOG.md` — nunca lo
arregles aquí ni edites `security-report/` desde este skill.

## Qué no hacer

- No inventes un umbral distinto a 365 días ni cambies qué cuenta como "release" — si la norma
  necesita ajustarse, edita `check-library-support.sh` (única fuente de verdad) y dilo
  explícitamente.
- No bloquees en silencio: si una instalación no pasa, muestra el resultado exacto del script y la
  razón, no solo "no cumple la norma".
- No apliques esta norma a dependencias que ya estaban instaladas antes de que existiera este
  skill — esas se reportan, no se bloquean (ver sección anterior).
- No la apliques a proyectos distintos a este repo.

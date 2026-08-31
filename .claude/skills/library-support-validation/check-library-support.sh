#!/usr/bin/env bash
# Fuente única de verdad para la norma de soporte de librerías: una dependencia nueva
# necesita >= 365 días de span entre su primer y su último release publicado en el
# registro npm. Ese span es lo que cuenta como "soporte" — parches de seguridad
# pequeños o releases de nuevas features son evidencia válida, no hace falta que sean
# cambios grandes.
#
# Uso: check-library-support.sh <paquete>[@<version-o-rango>]
#
# Exit codes:
#   0 = cumple la norma (span >= 365 días)
#   1 = NO cumple la norma (span < 365 días, o un solo release, o no encontrado)
#   2 = error de uso o de consulta al registro (no es un veredicto sobre la norma)
#
# Salida: una línea JSON con los datos crudos (para que quien llama decida qué hacer),
# más un resumen legible en stderr.
set -euo pipefail

PKG="${1:-}"
if [ -z "$PKG" ]; then
  echo "Uso: check-library-support.sh <paquete>[@<version-o-rango>]" >&2
  exit 2
fi

RAW_TIME=$(npm view "$PKG" time --json 2>/dev/null) || {
  echo "ERROR: no se pudo consultar el registro npm para '$PKG' (¿nombre mal escrito, paquete privado, o sin conexión?)" >&2
  exit 2
}

if [ -z "$RAW_TIME" ] || [ "$RAW_TIME" = "undefined" ]; then
  echo "ERROR: el registro npm no devolvió datos de tiempo para '$PKG'" >&2
  exit 2
fi

node -e "
const time = ${RAW_TIME};
const MIN_SPAN_DAYS = 365;
const DAY = 86400000;

const dates = Object.entries(time)
  .filter(([k]) => k !== 'created' && k !== 'modified')
  .map(([, v]) => new Date(v).getTime())
  .filter((t) => !Number.isNaN(t));

if (dates.length === 0) {
  console.log(JSON.stringify({ pkg: '${PKG}', verdict: 'FAIL', reason: 'NO_VERSIONS' }));
  process.exit(1);
}

const first = Math.min(...dates);
const last = Math.max(...dates);
const now = Date.now();
const spanDays = Math.floor((last - first) / DAY);
const sinceLastReleaseDays = Math.floor((now - last) / DAY);
const pass = spanDays >= MIN_SPAN_DAYS;

const result = {
  pkg: '${PKG}',
  verdict: pass ? 'PASS' : 'FAIL',
  releaseCount: dates.length,
  firstRelease: new Date(first).toISOString().slice(0, 10),
  lastRelease: new Date(last).toISOString().slice(0, 10),
  spanDays,
  sinceLastReleaseDays,
};

console.log(JSON.stringify(result));

const human = pass
  ? \`OK: '${PKG}' tiene \${spanDays} días de span entre su primer release (\${result.firstRelease}) y el más reciente (\${result.lastRelease}) — cumple el mínimo de \${MIN_SPAN_DAYS} días.\`
  : \`FALLA: '${PKG}' tiene solo \${spanDays} días de span entre su primer release (\${result.firstRelease}) y el más reciente (\${result.lastRelease}) — no llega al mínimo de \${MIN_SPAN_DAYS} días (\${dates.length} release(s) publicados en total).\`;
console.error(human);

if (sinceLastReleaseDays > 548) {
  console.error(\`AVISO: el último release fue hace \${sinceLastReleaseDays} días (~\${Math.floor(sinceLastReleaseDays / 365)} año(s)) — revisa si el paquete sigue mantenido activamente, aunque esto no reprueba la norma de 1 año por sí solo.\`);
}

process.exit(pass ? 0 : 1);
"

#!/usr/bin/env bash
# Validates a PR title against Conventional Commits (same rule as commit messages, so PR titles
# can drive changelog generation the same way squash-merge commit messages would).
# Usage: check-pr-title.sh "<pr title>"
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$DIR/conventional.sh"

title="${1:?usage: check-pr-title.sh <pr-title>}"

if [[ ! "$title" =~ $COMMIT_MSG_REGEX ]]; then
  echo "✖ El título del PR no sigue Conventional Commits:" >&2
  echo "  \"$title\"" >&2
  echo "  Formato esperado: <type>(<scope>)?: <descripción>" >&2
  echo "  Tipos válidos: ${COMMIT_TYPES//|/, }" >&2
  echo "  Ejemplo: feat(digifarm): agregar botón de favoritos" >&2
  echo "  Más info: https://www.conventionalcommits.org/" >&2
  exit 1
fi

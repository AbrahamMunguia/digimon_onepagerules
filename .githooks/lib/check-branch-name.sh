#!/usr/bin/env bash
# Validates a branch name against Conventional Branch naming.
# Usage: check-branch-name.sh <branch-name>
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$DIR/conventional.sh"

branch="${1:?usage: check-branch-name.sh <branch-name>}"

if [[ "$branch" =~ $EXEMPT_BRANCH_REGEX ]]; then
  exit 0
fi

if [[ ! "$branch" =~ $BRANCH_NAME_REGEX ]]; then
  echo "✖ El nombre de branch '$branch' no sigue Conventional Branch:" >&2
  echo "  Formato esperado: <type>/<descripción-corta> (minúsculas, separado por guiones)" >&2
  echo "  Tipos válidos: ${BRANCH_TYPES//|/, }" >&2
  echo "  Ejemplo: feature/digifarm-favoritos" >&2
  echo "  Más info: https://conventional-branch.github.io/" >&2
  exit 1
fi

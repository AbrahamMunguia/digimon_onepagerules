#!/usr/bin/env bash
# Validates a commit message file against Conventional Commits.
# Usage: check-commit-msg.sh <path-to-message-file>
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$DIR/conventional.sh"

msg_file="${1:?usage: check-commit-msg.sh <message-file>}"
first_line="$(head -n1 "$msg_file")"

if is_merge_commit_msg "$msg_file"; then
  exit 0
fi

if [[ ! "$first_line" =~ $COMMIT_MSG_REGEX ]]; then
  echo "✖ El mensaje de commit no sigue Conventional Commits:" >&2
  echo "  \"$first_line\"" >&2
  echo "  Formato esperado: <type>(<scope>)?: <descripción>" >&2
  echo "  Tipos válidos: ${COMMIT_TYPES//|/, }" >&2
  echo "  Ejemplo: feat(digifarm): agregar botón de favoritos" >&2
  echo "  Más info: https://www.conventionalcommits.org/" >&2
  exit 1
fi

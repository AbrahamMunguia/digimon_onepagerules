---
name: code-standards
description: Valida que el mensaje de commit, el nombre de branch y el título del PR sigan Conventional Commits / Conventional Branch antes de hacer `git commit`, `git push` a una branch fuera de main, o crear un pull request (`gh pr create`). Úsalo proactivamente justo antes de cualquiera de esas tres acciones, aunque el usuario no lo pida explícitamente.
---

Este skill hace cumplir los estándares de nomenclatura del repo para que el changelog se pueda
generar automáticamente a partir de los tipos de Conventional Commits. Lee todo este archivo antes
de actuar.

## Fuente de verdad — no dupliques las reglas

Las reglas (regex de tipos válidos, formato de mensaje, formato de branch, excepciones) viven en
[.githooks/lib/conventional.sh](../../../.githooks/lib/conventional.sh) y se aplican con:

- [.githooks/lib/check-commit-msg.sh](../../../.githooks/lib/check-commit-msg.sh) `<archivo-con-el-mensaje>`
- [.githooks/lib/check-branch-name.sh](../../../.githooks/lib/check-branch-name.sh) `<nombre-de-branch>`
- [.githooks/lib/check-pr-title.sh](../../../.githooks/lib/check-pr-title.sh) `<título-del-pr>`

Estos mismos scripts son los que corren en el git hook local (`commit-msg`, `pre-push`) y en
[.github/workflows/code-standards.yml](../../../.github/workflows/code-standards.yml) para el PR.
**Siempre valida ejecutando estos scripts, no reimplementes la regex de memoria** — así nunca hay
drift entre lo que tú apruebas y lo que el hook/CI va a exigir de todas formas.

## Cuándo actuar

### 1. Antes de `git commit`

Antes de correr `git commit -m "..."` (o `git commit` con editor), valida el mensaje propuesto:

```bash
printf '%s\n' "<mensaje propuesto>" > /tmp/commit-msg-check && \
  .githooks/lib/check-commit-msg.sh /tmp/commit-msg-check
```

Si falla, no ejecutes el commit. Reescribe el mensaje al formato `<type>(<scope>)?: <descripción>`
(tipos: `feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert`) conservando la
intención del usuario, muéstraselo, y vuelve a validar. Los commits de merge (`Merge branch...`,
`Merge pull request...`) están exentos — no los toques.

### 2. Antes de `git push` a una branch nueva

Antes de crear/pushear una branch (o justo antes del primer `git push -u origin <branch>`), valida
su nombre:

```bash
.githooks/lib/check-branch-name.sh "<nombre-de-branch>"
```

Si falla, propón un nombre en formato `<type>/<descripción-corta>` (tipos:
`feature, bugfix, hotfix, release, chore, docs, refactor, test`, minúsculas, separado por guiones)
antes de crear la branch. **Excepciones que no se validan**: `main`, `master`, `develop`, y
cualquier branch `claude/*` (las que genera automáticamente un worktree de Claude Code) — no
sugieras renombrarlas.

### 3. Antes de crear un PR (`gh pr create` o similar)

Antes de crear el PR, valida el título propuesto:

```bash
.githooks/lib/check-pr-title.sh "<título propuesto>"
```

Si falla, reescribe el título al mismo formato que los commits (`<type>(<scope>)?: <descripción>`)
antes de correr `gh pr create --title "..."`. Esto es lo mismo que valida
`.github/workflows/code-standards.yml` en CI — mejor detectarlo antes de abrir el PR que dejar que
falle el check.

## Si los scripts no existen o los hooks no están instalados

Si `.githooks/lib/*.sh` no existe en el repo, este skill no aplica — dile al usuario que el proyecto
no tiene configurado code-standards. Si existen pero `git config core.hooksPath` no apunta a
`.githooks` (se configura solo vía el script `prepare` de `package.json` al correr `npm install`,
pero pudo no haberse corrido), los scripts igual funcionan invocados directamente como arriba: no
dependen de que el hook esté instalado, así que valida igual aunque el hook local no vaya a
disparar.

## Qué no hacer

- No inventes reglas nuevas ni cambies los tipos válidos — si el usuario quiere agregar un tipo,
  edítalo en `.githooks/lib/conventional.sh` (única fuente de verdad) y dilo explícitamente.
- No bloquees silenciosamente: si un mensaje/branch/título no pasa, muestra el error exacto del
  script y la corrección propuesta, no solo "no cumple el estándar".
- No apliques estas reglas a repos o proyectos que no sean este — son específicas de este repo.

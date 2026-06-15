# CLAUDE.md — HYDRA product repo

HYDRA is a licensable TypeScript marketplace **platform**. Each marketplace product is
an OpCo ("head") built on the shared platform. This repo is an **Nx monorepo**; the
strategy/IP/corporate docs live in a separate planning workspace, **not here**.

## The one rule that everything else depends on

**Provenance and host boundaries are enforced in CI, not by convention.** Every project
carries an `ip:` (provenance) and `host:` tag, and `@nx/enforce-module-boundaries`
fails the build on a crossing import:

- `libs/shared/*` (shared platform IP) MUST NOT import `libs/opco/*`.
- No OpCo may import another OpCo. OpCo code is always a snippable leaf.
- `host:client` projects MUST NOT reach `host:server` internals (only the SDK / shared UI).

The matrix lives in `eslint.config.mjs`. If you add a project, give it all four tag
dimensions (`ip:`, `scope:`, `host:`, `type:`) or CI's tag-presence check fails.

## Toolchain — who owns what

- **Biome** (`biome.jsonc`) owns ALL formatting, linting, and complexity/size caps.
- **ESLint** (`eslint.config.mjs`) is retained for **exactly one rule**:
  `@nx/enforce-module-boundaries`. It loads no style rules — the two never overlap.
- **`tools/check-file-length.mjs`** adds the per-file line cap Biome has no rule for.
- TypeScript is `strict`. Vitest runs tests. Changesets versions shared libs.

Run `pnpm biome:fix` before committing (Lefthook does this on staged files automatically).

## Code quality

Mechanical caps are enforced by the tools above. The **judgment** rubric
(single-responsibility, comment _why_ not _what_, no premature abstraction,
prose-economy) lives in the `code-quality` skill (`.claude/skills/code-quality/`) —
currently a placeholder, authored in a later slice. Design rationale goes in the
PR/commit body, **not** in code comments.

## Layout

```
apps/<opco>/<app>     thin deployable shells (a thin OpCo composition API + storefront)
apps/platform/*       shared reference API + the control plane
libs/shared/*         shared platform IP (publishable @hydra/* packages)
libs/opco/<name>/*    OpCo-specific leaves (private; snippable)
```

See `CONTRIBUTING.md` for the workflow (trunk-based) and the flags-vs-entitlements rule.

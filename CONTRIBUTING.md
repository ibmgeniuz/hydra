# Contributing to HYDRA

## Workflow — trunk-based

- **`main` is always shippable.** Work on short-lived branches; merge small, auditable
  slices behind review.
- **Conventional Commits** are required (enforced by the Lefthook `commit-msg` hook and
  re-checked in CI). They feed the per-lib changelogs Changesets emits.
- Before pushing, the pre-commit hook runs Biome autofix on staged files. CI is the
  authoritative gate — see `.github/workflows/ci.yml`.

## Feature flags vs entitlements — keep them distinct

These look similar and are routinely conflated. They are not the same thing, and they
live in different places:

| | **Feature flag** | **Entitlement** |
|---|---|---|
| Purpose | Temporary release switch (keep `main` shippable) | Permanent licensing gate (what an OpCo is allowed to run) |
| Lifetime | **Temporary** — deletion-tracked, removed once shipped | **Permanent** — part of the licensing model |
| Owner | The team shipping the change | The platform / control plane (Phase 1) |

Neither is built in Phase 0. When they land: flags are temporary and must be tracked for
deletion; entitlements are permanent and are served/revoked by the control plane. Do not
implement a licensing decision as a feature flag, or vice versa.

## Adding a project

Every project must carry all four tag dimensions — `ip:`, `scope:`, `host:`, `type:` —
or the CI tag-presence check fails. Dependencies must satisfy the boundary matrix in
`eslint.config.mjs`; a crossing import fails the `Module boundaries` CI gate. A util
genuinely shared by client and server is an **extension point** (add a `host:shared`
tag when it actually exists), not a reason to relax a rule.

## Useful commands

```sh
pnpm build            # nx run-many -t build
pnpm typecheck        # strict tsc
pnpm test             # vitest
pnpm lint:boundaries  # @nx/enforce-module-boundaries
pnpm biome:check      # format + lint + caps
pnpm tags:check       # every project has ip: + host:
pnpm filelen:check    # per-file line cap
pnpm changeset        # record a shared-lib version bump
```

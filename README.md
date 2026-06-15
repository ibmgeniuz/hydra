# HYDRA

A licensable TypeScript marketplace **platform**, built as an Nx monorepo. Each
marketplace product is an OpCo ("head") composed from the shared platform libraries.

> **Phase 0 — scaffold only.** Every project here is an empty, tagged shell that builds.
> There is no business logic, schema, auth, or framework wiring yet — this slice exists
> to make the IP/provenance boundary a checked CI rule from the first commit.

## Layout

```
apps/
  platform/api            shared REFERENCE/baseline API        [ip:shared,        host:server]
  platform/control-plane  control plane (build after Phase 1)  [ip:shared,        host:server]
  agricca/api             Agricca's deployable OpCo API         [ip:opco-agricca,  host:server]
  agricca/storefront-web  Agricca storefront (Next.js)          [ip:opco-agricca,  host:client]
libs/
  shared/financial-engine,orders,entitlements   shared platform IP      [ip:shared, host:server]
  shared/sdk,ui                                  shared client IP        [ip:shared, host:client]
  opco/agricca/core                              Agricca server leaf     [ip:opco-agricca, host:server]
  opco/refleek/core                              Refleek server leaf     [ip:opco-refleek, host:server]
```

## The boundary

`@nx/enforce-module-boundaries` (in `eslint.config.mjs`) fails CI on any import that
crosses provenance or host lines: shared code can't reach OpCo code, no OpCo can reach
another OpCo, and client code can't reach server internals. `apps/agricca/api` is the
one project that legally composes a shared lib **and** its own OpCo leaf — the proof the
model works.

## Toolchain

Biome (format + lint + caps) · retained boundary-only ESLint · strict TypeScript ·
Vitest · Lefthook + lint-staged (pre-commit) · Changesets (release). See `CLAUDE.md` for
who owns what and `CONTRIBUTING.md` for the workflow.

## Commands

```sh
pnpm install
pnpm build          # build all projects
pnpm typecheck      # strict tsc
pnpm test           # vitest (passWithNoTests on empty shells)
pnpm biome:check    # format + lint + complexity/size caps
pnpm lint:boundaries
pnpm tags:check
```

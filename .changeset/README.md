# Changesets

HYDRA versions each **shared** library independently (independent semver) with
[Changesets](https://github.com/changesets/changesets). Apps and OpCo leaves are
`private` and never published.

- Add a changeset for any user-facing change to a shared lib: `pnpm changeset`.
- Versions + changelogs are applied with `pnpm changeset:version`.
- Publishing (`pnpm changeset:publish`) is **wired but unused in Phase 0** — the
  private registry is a placeholder (see `.npmrc`) and nothing ships yet.

OpCos consume shared libs at **pinned versions** so a future lift-out is a one-line
resolution change, not a refactor.

// Conventional Commits, enforced both locally (Lefthook commit-msg hook) and in CI.
// Conventional-commit history is what feeds the per-lib changelogs Changesets emits.
export default {
  extends: ['@commitlint/config-conventional'],
};

// Boundary-only ESLint flat config.
//
// ESLint is retained in HYDRA for exactly ONE job: @nx/enforce-module-boundaries,
// the machine-readable IP/provenance gate (Biome has no module-boundary equivalent).
// Formatting, style, correctness, and complexity/size caps are owned entirely by
// Biome (see biome.jsonc) — so this config deliberately does NOT load
// eslint:recommended, @typescript-eslint, or any stylistic rule set. It registers
// the @nx plugin (flat/base) and a TypeScript-capable parser, nothing more. Keeping
// the two tools disjoint is what prevents double-linting.
import nx from '@nx/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  // Registers the `@nx` plugin only — no rules, no style config.
  ...nx.configs['flat/base'],

  {
    ignores: [
      '**/dist',
      '**/out-tsc',
      '**/.next',
      '**/node_modules',
      '**/.nx',
      '**/coverage',
      // Declaration files carry no boundary-relevant import edges (and generated
      // ones ship stale @typescript-eslint disable directives this config won't load).
      '**/*.d.ts',
      '**/vitest.config.*.timestamp*',
    ],
  },

  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    languageOptions: {
      // No `project` / type information: the boundary rule only reads the import
      // graph from the AST, so a fast syntax-only parse is all it needs.
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          // Keep the failure surface to the tag matrix alone — buildability is a
          // separate concern not exercised by this slice.
          enforceBuildableLibDependency: false,
          allow: [],
          depConstraints: [
            // Provenance (ip:) — shared is self-contained; each OpCo may depend on
            // shared platform IP and ITSELF only. No OpCo may reach another OpCo.
            {
              sourceTag: 'ip:shared',
              onlyDependOnLibsWithTags: ['ip:shared'],
            },
            {
              sourceTag: 'ip:opco-agricca',
              onlyDependOnLibsWithTags: ['ip:shared', 'ip:opco-agricca'],
            },
            {
              sourceTag: 'ip:opco-refleek',
              onlyDependOnLibsWithTags: ['ip:shared', 'ip:opco-refleek'],
            },
            {
              sourceTag: 'ip:opco-general',
              onlyDependOnLibsWithTags: ['ip:shared', 'ip:opco-general'],
            },

            // Hosting (host:) — client code never reaches server internals and
            // vice versa. A genuinely neutral util becomes a host:shared extension
            // point when it actually exists; not before.
            {
              sourceTag: 'host:client',
              onlyDependOnLibsWithTags: ['host:client'],
            },
            {
              sourceTag: 'host:server',
              onlyDependOnLibsWithTags: ['host:server'],
            },

            // App/lib hygiene — apps compose libs; libs depend on libs.
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:lib'],
            },
            {
              sourceTag: 'type:lib',
              onlyDependOnLibsWithTags: ['type:lib'],
            },
          ],
        },
      ],
    },
  },
];

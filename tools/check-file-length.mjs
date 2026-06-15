// CI guard: a hard max-lines-per-FILE cap. Biome enforces per-FUNCTION caps
// (cognitive complexity + lines-per-function) but has no per-file rule, so this
// closes that one gap — the "1,000-line god file" failure mode. Per-function limits
// remain Biome's job; this is only the outer file-size backstop.
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const MAX_LINES = 300;
const ROOT = process.cwd();
const SOURCE_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
]);
const IGNORED_DIRS = new Set([
  'node_modules',
  'dist',
  'out-tsc',
  '.next',
  '.nx',
  'coverage',
  '.git',
]);

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        yield* walk(join(dir, entry.name));
      }
      continue;
    }
    const path = join(dir, entry.name);
    // Generated declaration files are not authored code — skip them.
    if (entry.name.endsWith('.d.ts')) {
      continue;
    }
    if (SOURCE_EXTENSIONS.has(extname(entry.name))) {
      yield path;
    }
  }
}

const offenders = [];
for (const path of walk(ROOT)) {
  const lines = readFileSync(path, 'utf8').split('\n').length;
  if (lines > MAX_LINES) {
    offenders.push({ path: relative(ROOT, path), lines });
  }
}

if (offenders.length > 0) {
  console.error(`✖ Files exceeding the ${MAX_LINES}-line cap:\n`);
  for (const { path, lines } of offenders) {
    console.error(`  ${path} — ${lines} lines`);
  }
  console.error(
    '\nSplit the file by responsibility, or justify a raised cap in review.',
  );
  process.exit(1);
}

console.log(`✓ No file exceeds the ${MAX_LINES}-line cap.`);

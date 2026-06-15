// CI guard: every Nx project MUST carry an `ip:` provenance tag and a `host:` tag.
// These two are the machine-readable IP/host boundary the module-boundary rule keys
// off (see eslint.config.mjs). A project missing either is a hole in the boundary —
// fail the build rather than let it merge silently.
import { createProjectGraphAsync } from '@nx/devkit';

const REQUIRED_PREFIXES = ['ip:', 'host:'];

const graph = await createProjectGraphAsync({ exitOnError: true });

const failures = [];
for (const [name, node] of Object.entries(graph.nodes)) {
  const tags = node.data.tags ?? [];
  const missing = REQUIRED_PREFIXES.filter(
    (prefix) => !tags.some((tag) => tag.startsWith(prefix)),
  );
  if (missing.length > 0) {
    failures.push({ name, missing, tags });
  }
}

if (failures.length > 0) {
  console.error('✖ Projects missing required boundary tags:\n');
  for (const { name, missing, tags } of failures) {
    console.error(`  ${name}`);
    console.error(`    missing: ${missing.join(', ')}`);
    console.error(`    has:     ${tags.length ? tags.join(', ') : '(none)'}`);
  }
  console.error(
    `\n${failures.length} project(s) failed. Every project needs an ip: and a host: tag.`,
  );
  process.exit(1);
}

const count = Object.keys(graph.nodes).length;
console.log(`✓ All ${count} projects carry ip: and host: tags.`);

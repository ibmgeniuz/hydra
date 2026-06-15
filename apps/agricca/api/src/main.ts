// Phase 0 COMPOSITION PROOF. agricca-api is Agricca's deployable OpCo API. Under the
// boundary matrix (ip:opco-agricca, host:server, type:app) it MAY legally compose
// shared platform libs (ip:shared) AND its own OpCo server leaf (ip:opco-agricca) —
// and nothing from any other OpCo. The two imports below are exactly that proof: the
// ESLint boundary check passes on them. NestJS wiring is a later slice.
import { agriccaCore } from '@hydra/agricca-core';
import { financialEngine } from '@hydra/financial-engine';

process.stdout.write(
  `agricca-api: Phase 0 shell composing [${financialEngine}, ${agriccaCore}]\n`,
);

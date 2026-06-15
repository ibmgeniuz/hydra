# platform-control-plane

**Build after Phase 1.** This is an inert, tagged shell in Phase 0.

The control plane is the per-OpCo serving layer for the economically sensitive
crown-jewel _values_ (rates / tiers / escrow-timing / payout-batching / heuristics) and
the licensing **kill-switch** — revoking a license stops the control plane serving valid
config. None of that exists yet.

It currently carries `host:server` as a **temporary simplification**. When it is built,
it splits into a server project + a client project like the other apps.

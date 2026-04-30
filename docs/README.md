# Documentation ownership

Keep docs lean. Each file should have one main job and one main source of truth.

## Ownership rules

- `design-spec.md` owns the product contract:
  - what the service is
  - goals and non-goals
  - users
  - version 1 scope
  - high-level functional, UX, content, data, and accessibility requirements

- the implemented journey lives in code:
  - `apps/public/src/lib/journey/config.ts` owns implemented step order, route slugs, labels, and branching
  - `apps/public/src/routes/**` own implemented page behaviour

- `journey-future.md` owns non-implemented journey notes only:
  - deferred or future journey ideas
  - flow notes that are not yet canonical in the shipped product

- `triage-rules.md` owns the triage logic:
  - canonical result-state identifiers
  - hard gates
  - soft gates
  - evidence-readiness heuristics
  - priority order
  - summary outputs produced by the rules engine

- `policy-context.md` owns changeable external assumptions:
  - current policy context
  - policy-sensitive product assumptions
  - what sources to watch
  - how policy changes should be reflected in the repo

- `local-supabase.md` owns local database workflow:
  - local Supabase stack setup
  - local reset, seed, and type generation commands

- `adr/*.md` own decision rationale:
  - why a significant decision was made
  - consequences of that decision
  - when it should be revisited

## Redundancy rules

- Do not define the same canonical list in more than one file.
- Do not repeat ADR rationale in spec documents.
- Do not repeat product requirements in journey docs unless the requirement changes how a specific screen works.
- If a piece of information changes often, it should not live in `design-spec.md`.
- If a fact is needed in multiple places, pick one canonical owner and let the other docs refer to it indirectly.

## Current canonical owners

- result-state identifiers: `triage-rules.md`
- implemented route map and screen catalogue: `apps/public/src/lib/journey/config.ts`
- deferred journey notes: `journey-future.md`
- product requirements: `design-spec.md`
- external policy assumptions: `policy-context.md`
- significant decision rationale: `adr/*.md`
- local database workflow: `local-supabase.md`

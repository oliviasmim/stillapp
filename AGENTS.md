<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax


<!-- nx configuration end-->

---

# Still App — Architecture Directives

These rules apply to ALL code written in this repository. Enforce them on every edit, generation, and refactor.

## Domain-Driven Design (DDD)

- **Bounded contexts** map 1:1 to `libs/domain/*` packages: `writing`, `library`, `intelligence`, `publishing`. Never let logic from one context bleed into another directly — use events or ports.
- **Entities** own identity (ID value object) and enforce invariants in their methods. Never expose raw mutable props.
- **Value objects** are immutable, validated at construction, and carry no identity. Throw on invalid input.
- **Repository interfaces** (`I*Repository`) live in `libs/domain/*` and are implemented in `apps/api`. The domain layer NEVER imports from apps.
- **Ports** (`I*Port`) express external dependencies (platform APIs, AI services) as interfaces the domain defines and infra implements.
- **Domain events** represent something that already happened. Name them in past tense (`DraftSaved`, `DraftDiscarded`).
- **No framework imports in domain libs** — zero NestJS, React, Prisma, or HTTP references inside `libs/domain/*`.

## Collocation

- Keep code **as close as possible to where it is used**. Don't create shared utilities preemptively.
- Feature-specific components, hooks, and helpers live inside the feature folder, not in a global `utils/`.
- Only promote to a shared lib (`libs/ui/*`, `libs/api-contracts`) when genuinely reused by 2+ consumers.
- Test files live **next to** the source files they test (`foo.ts` → `foo.spec.ts`).

## KISS (Keep It Simple, Stupid)

- Prefer the simplest solution that satisfies the requirement. No speculative abstractions.
- Avoid over-engineering: no abstract factory for a thing that has one implementation.
- If a function exceeds ~30 lines or does more than one thing, split it.
- Resist adding parameters "for future flexibility" — YAGNI until proven otherwise.

## Maintainability

- **Explicit over implicit**: types everywhere, no `any`, no implicit returns in non-trivial functions.
- Every public method on an entity or service must be understandable from its signature alone.
- Avoid deep nesting — early returns over nested `if/else`.
- Dependencies flow inward: `apps → libs/domain`, never `libs/domain → apps`.
- Keep `tsconfig.base.json` paths up to date whenever a new lib is added.
- When changing a repository interface, update the mock/stub in tests immediately — don't leave them stale.

## Intelligence Layer — Protected IP

- `libs/domain/intelligence/` contains **original creative work** by Iasmim Oliveira (see LICENSE).
- Do NOT replicate, extract, or repurpose the `ResurfacingService`, `StillMoment`, or `SimilarityScore` logic outside this repository.
- When extending this layer, preserve the domain purity: no external SDK imports, only ports.
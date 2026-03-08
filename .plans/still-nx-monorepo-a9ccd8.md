# Still — Nx Monorepo Plan

Single-workspace Nx monorepo under `still/` with **pnpm** (Nx's most stable partner), five apps across web/desktop/mobile/api/ai-service, database-agnostic domain layer via DDD repositories, and isolated CI per app via path-filtered GitHub Actions.

---

## Build System: Nx (over Turborepo)

**Turborepo v2 is the Rust-written one** (rewritten from Go by Vercel). But for Still, Nx wins:

| | Nx | Turborepo |
|---|---|---|
| Written in | TS + Rust binaries (hashing/graph) | **Rust** (full task engine) |
| Code generation | `nx generate` — NestJS, Vite, Expo in one command | None |
| Plugin ecosystem | `@nx/nest`, `@nx/vite`, `@nx/expo`, Python executors | None — BYO everything |
| IDE tooling | Nx Console (VS Code/Windsurf): visual graph + task runner | None |
| Remote cache | Nx Cloud — free 500 hrs/month | Vercel Remote Cache (Vercel-centric) |
| Lock-in | Higher | Lower |
| Solo dev DX | Better — generators save hours per experiment | Better only if you want to own every config line |

**Decision: Nx + Nx Cloud free tier.** The generator/plugin value pays back immediately when you're spinning up NestJS modules, Vite apps, and Expo projects across 5 app types solo. Turborepo would win if this were a Vercel-hosted, all-Next.js setup.

---

## Package Manager: pnpm (with Rust already in the stack)

The Rust in this stack lives in two places:
- **Turborepo** (not chosen, but worth knowing) — full Rust task engine
- **Nx** — Rust binaries for file hashing and project-graph since v15.8, expanding in 2025
- **Tauri** — desktop shell is pure Rust (~3 MB installer vs ~150 MB Electron)
- **uv** — Rust-based Python package resolver (10–100× faster than pip)

**pnpm** is the right call: most mature for Nx, strict dependency isolation, disk-efficient, first-class workspace support. Bun is faster at installs but less mature for Nx plugin integrations and React Native toolchains.

---

## Workspace Root

```
still/                              ← existing git repo, Nx root
├── apps/
│   ├── web/                        ← Vite + React SPA, PWA (offline-first Writing Room)
│   ├── desktop/                    ← Tauri (Rust shell wrapping web app)
│   ├── mobile/                     ← React Native + Expo
│   ├── api/                        ← NestJS (auth, CRUD, Twitter/X, sync gateway)
│   └── ai-service/                 ← Python/FastAPI + uv (Whisper, embeddings, resurfacing)
├── libs/
│   ├── domain/                     ← DDD bounded contexts (pure TS, zero framework deps)
│   │   ├── writing/
│   │   ├── library/
│   │   ├── intelligence/
│   │   └── publishing/
│   ├── ui/
│   │   ├── web/                    ← React components (warm palette, minimal)
│   │   └── native/                 ← React Native components (shared tokens)
│   └── api-contracts/              ← OpenAPI spec + generated TS client
├── .github/workflows/
│   ├── ci-web.yml
│   ├── ci-desktop.yml
│   ├── ci-mobile.yml
│   ├── ci-api.yml
│   └── ci-ai-service.yml
└── nx.json
```

---

## App Breakdown

| App | Stack | Notes |
|---|---|---|
| `web` | Vite + React + Workbox PWA | Offline-first; IndexedDB local store; syncs when online |
| `desktop` | Tauri (Rust) + web | Wraps `web` app; native file access, system tray |
| `mobile` | React Native + Expo | SQLite local store; shares domain libs |
| `api` | NestJS + Prisma | Auth, CRUD, social OAuth, sync server |
| `ai-service` | Python 3.12 + FastAPI + uv | Whisper, embeddings, vector search |

> **Why SPA, not Next.js**: The Writing Room must be fast, smooth, and fully offline-capable. SSR adds latency and a hard network dependency. Vite gives sub-100ms HMR, tree-shakeable output, and a native PWA plugin. Next.js would be reconsidered only if a public-facing marketing site is needed.

---

## DDD Bounded Contexts (collocated pattern)

Each context owns its entities, value objects, repository **interfaces**, domain services, and events. Infrastructure implementations live in the consuming app — never in the domain.

```
libs/domain/writing/
├── entities/         Draft, EditorSession
├── value-objects/    DraftId, Content, WordCount
├── repositories/     IDraftRepository          ← interface only
├── services/         DraftService
└── events/           DraftSaved, DraftDiscarded

libs/domain/library/
├── entities/         LibraryItem, Highlight, Annotation
├── repositories/     ILibraryRepository, IImportSourceRepository
└── services/         LibraryService, ImportService

libs/domain/intelligence/
├── entities/         Embedding, StillMoment
├── repositories/     IVectorSearchRepository, IEmbeddingRepository
└── services/         ResurfacingService, SemanticSearchService

libs/domain/publishing/
├── entities/         Thread, Post, PublishJob
├── repositories/     ISocialPlatformRepository
└── services/         PublishingService, ThreadFormatterService
```

---

## Database-Agnostic Strategy

The domain layer defines **repository interfaces** — concrete implementations are injected per-environment. This means the app can swap storage engines without touching domain logic.

| Context | MVP Implementation | Future Options |
|---|---|---|
| Drafts / Library (cloud) | PostgreSQL via Prisma (`apps/api`) | CockroachDB, Supabase |
| Embeddings / Vector search | **pgvector** (same Postgres, separate schema) | Qdrant, Pinecone, Weaviate |
| Graph connections | Relationship tables in Postgres (MVP) | Neo4j, Dgraph if query complexity grows |
| Offline / browser | **IndexedDB** via Dexie.js (`apps/web`) | OPFS for larger local stores |
| Offline / mobile | **SQLite** via Expo SQLite (`apps/mobile`) | WatermelonDB for reactive queries |
| Offline / desktop | **SQLite** via Tauri plugin (`apps/desktop`) | Same as mobile |

**Sync strategy**: Domain events emitted on write → background sync queue → server reconciliation. For conflict resolution, a simple **last-write-wins with vector clock** is sufficient for solo-use MVP; CRDT (Yjs) is the path for collaborative future.

Each app registers its own concrete repository at bootstrap — the domain layer never imports any ORM or DB driver directly.

```
apps/api/src/infrastructure/persistence/
├── postgres/    PostgresDraftRepository implements IDraftRepository
└── pgvector/    PgVectorEmbeddingRepository implements IEmbeddingRepository

apps/web/src/infrastructure/persistence/
└── indexeddb/   IndexedDbDraftRepository implements IDraftRepository

apps/mobile/src/infrastructure/persistence/
└── sqlite/      SqliteDraftRepository implements IDraftRepository
```

---

## Python Integration

- `ai-service` managed by **uv**, has a `project.json` so Nx can run `serve`, `test`, `lint`, `build` targets
- Communicates with `api` over internal HTTP — no shared Node modules
- Contract: `libs/api-contracts` holds the OpenAPI spec; Python stays in sync via FastAPI's auto-generated docs; a CI step diffs them on PR

---

## CI Strategy — Isolated Per App

Path-filtered GitHub Actions; no Nx Cloud required for isolation.

```
ci-web.yml          paths: apps/web/**, libs/domain/**, libs/ui/web/**
ci-desktop.yml      paths: apps/desktop/**, apps/web/**
ci-mobile.yml       paths: apps/mobile/**, libs/domain/**, libs/ui/native/**
ci-api.yml          paths: apps/api/**, libs/domain/**, libs/api-contracts/**
ci-ai-service.yml   paths: apps/ai-service/**
```

- Node apps: `pnpm nx run <app>:<target>` (lint → test → build)
- Python: `uv run ruff check` → `uv run pytest` → Docker build
- Desktop: Tauri build only on tag/release (slow Rust compile skipped on every push)

---

## Performance Principles (baked in from day 1)

- **Zero heavy deps in domain libs** — pure TS, no ORM, no framework imports
- **Vite** for web: code-split by route, dynamic imports for editor extensions
- **Tauri** over Electron: ~3 MB installer vs ~150 MB, lower memory
- **uv** over pip/poetry: Rust-based resolver, 10–100× faster installs
- Nx task caching prevents re-building unchanged apps

---

## Bootstrap Order

1. Init Nx workspace at `still/` — pnpm, preset: `ts`
2. Generate `libs/domain/*` (TS libraries, no framework)
3. Generate `libs/ui/web` and `libs/ui/native`
4. Generate `libs/api-contracts`
5. Generate `apps/api` (`@nx/nest`)
6. Generate `apps/web` (`@nx/vite` + React + PWA plugin)
7. Scaffold `apps/ai-service` (FastAPI + uv + `project.json`)
8. Add `apps/mobile` (Expo + `@nx/expo` or `@nx/react-native`)
9. Add `apps/desktop` (Tauri — runs after web is stable)
10. Wire per-app CI workflows

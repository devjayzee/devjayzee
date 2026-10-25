# Jerome Zarate

Full-stack engineer. I build the parts that are expensive to get wrong: commission ledgers, message delivery state, AI pipelines with a human sign-off.

Five years across Node.js, TypeScript and React. I own products from schema to deploy pipeline, often as the only engineer. Available for remote full-time or contract work · Philippines, UTC+8.

[Portfolio](https://jeromezarate.vercel.app) · [LinkedIn](https://linkedin.com/in/jerome-zarate-1403831a1) · [Email](mailto:jeromedzarate@gmail.com)

## Proof, not adjectives

Most of my work lives in private client repositories, so the numbers below come from `git blame` and `git log` on those codebases and from the systems' own records, not from estimates.

| Domain | What I built | Evidence |
| --- | --- | --- |
| **Ledgers** | Invoicing, payments and an append-only commission ledger with a reconciliation engine, for an agency billing platform | $338K invoiced in the system's first month, 99% collected · about half of a 77,000-line codebase by blame |
| **Messaging** | The chat service of a fintech super-app: mobile sync, per-recipient delivery state, group chat, read-replica routing | 55% of its production code, 89% of its tests, 309 commits |
| **AI pipelines** | Screenshot-to-ledger sales extraction with operator approval; an autonomous blog pipeline with a deterministic quality gate | GPT-4o vision and Claude on Upstash Workflow, nine durable steps inside Vercel's 60-second limit; the model never writes to the ledger |
| **Product** | A hotel management system built solo for a working hotel | 261 pull requests, 1,374 tests (more test code than application code), lint-enforced layering · public, below |

## Selected systems

- **[Scone Willow Tree Hotel](https://github.com/devjayzee/Scone-Willow-Tree-Hotel)** · bookings, rooms, staff, calendar and reports behind a role-gated dashboard. Next.js 16, Prisma 7, NextAuth, TanStack Query. Ten Redis rate limiters, a timing-safe password reset, audit context on every mutation, CI with a Playwright smoke job that fails on CSP violations or hydration errors. Live and in use. Public, MIT.
- **[FVATeam](https://jeromezarate.vercel.app/work/fvateam)** · agency operations and billing platform. Next.js, Prisma, PostgreSQL. Batch invoicing and payments, the append-only ledger and its reconciliation engine, scheduled bulk email, two AI features with a human in the loop.
- **[Trilloan](https://jeromezarate.vercel.app/work/trilloan)** · chat service of a fintech super-app. Node.js, Express, MySQL, Kafka, Socket.IO, React Native. Per-topic sequence numbers with a per-user cursor, idempotent sends, a sync endpoint for reconnecting devices, transaction-aware replica routing.
- **[OnlyTool](https://jeromezarate.vercel.app/work/onlytool)** · multi-tenant SaaS orchestrating a platform gateway and an AI inference service. NestJS, Prisma, pg-boss, Socket.IO. Durable webhook queues, tenant-scoped realtime rooms, a commission and credit ledger with a revenue dashboard.
- **[Hacker Hero](https://jeromezarate.vercel.app/work/hacker-hero)** and **[Coding Dojo](https://jeromezarate.vercel.app/work/coding-dojo)** · a gamified learn-to-code platform and a bootcamp LMS. A 112-commit rebuild into one AJAX content shell with a staged-rollout permalink migration; the Admin Student Access module (441 commits) and a HubSpot integration that replaced Zapier.

## How I build

- **Tests first.** The tests are written and seen failing before the build starts; the suite is the contract, and nobody loosens a test to get a pass.
- **Architecture enforced by tooling.** Per-folder ESLint rules keep routes, services, hooks and components from crossing boundaries, so the rules hold without a reviewer watching.
- **Agent teams with rules.** I build with Claude Code under `CLAUDE.md`, rules, hooks and skills, with agents split by role: planning, building, testing, QA, security and review. In the hotel repository, ESLint enforces the same architecture rules the agents follow, so neither a person nor an agent can break them unnoticed.
- **Evidence over adjectives.** Every number I publish comes from the code, its commit history or the system's own records, never from an estimate.

## Stack

- **Backend** · TypeScript, Node.js, Express, NestJS, Prisma, Mongoose, REST, WebSockets, Socket.IO, Kafka, pg-boss
- **Frontend** · React, Next.js (App Router), Redux Toolkit, TanStack Query, Tailwind CSS, shadcn/ui, Zod, React Native (Expo)
- **Data** · PostgreSQL, MySQL (read replicas, migrations), MongoDB, SQLite, Redis (Upstash)
- **AI** · Anthropic Claude API, OpenAI (GPT-4o vision, DALL-E), Upstash Workflow and QStash, Claude Code agent workflows
- **Delivery** · Vitest, Jest, Mocha/Chai, Playwright, SonarQube, GitHub Actions, Jenkins, AWS CodePipeline, Docker, Vercel, Sentry, AWS S3

## Now

Open to remote full-time roles and contract work, from the Philippines (UTC+8). The fastest way to reach me is [email](mailto:jeromedzarate@gmail.com); the case studies on the [portfolio](https://jeromezarate.vercel.app) explain each system and the decisions behind it.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/banner-dark.svg">
  <img alt="Jerome Zarate, full-stack engineer. I build commission ledgers that reconcile, message sync that survives reconnects, AI pipelines with a human sign-off, and whole products from schema to deploy. Available for remote full-time and contract work." src="./assets/banner-light.svg" width="100%">
</picture>

<p align="center">
  <a href="mailto:jeromedzarate@gmail.com"><img alt="Available for work: remote, full-time or contract" src="https://img.shields.io/badge/Available_for_work-remote%2C_full--time_or_contract-2ea043?style=for-the-badge"></a>
</p>
<p align="center">
  <a href="https://jeromezarate.vercel.app"><img alt="Portfolio" src="https://img.shields.io/badge/Portfolio-jeromezarate.vercel.app-16130f?style=flat-square&logo=vercel&logoColor=white"></a>
  <a href="https://linkedin.com/in/jerome-zarate-1403831a1"><img alt="LinkedIn" src="https://img.shields.io/badge/LinkedIn-Jerome_Zarate-0A66C2?style=flat-square"></a>
  <a href="mailto:jeromedzarate@gmail.com"><img alt="Email" src="https://img.shields.io/badge/Email-jeromedzarate%40gmail.com-EA4335?style=flat-square&logo=gmail&logoColor=white"></a>
  <a href="https://github.com/devjayzee/Scone-Willow-Tree-Hotel"><img alt="Open-source project: Scone Willow Tree Hotel" src="https://img.shields.io/badge/Open_source-Scone_Willow_Tree_Hotel-7ee59d?style=flat-square&logo=github&logoColor=black"></a>
</p>

## 👋 Hey, I'm Jerome

Full-stack engineer with five years across Node.js, TypeScript and React. I build the parts of a product that are expensive to get wrong: **commission ledgers**, **message delivery state**, and **AI pipelines with a human sign-off**. I usually own them from schema to deploy pipeline, often as the only engineer on them.

Most of my work lives in private client repositories, so every number on this page comes from `git blame`, `git log` or the system's own records, never from an estimate.

## 🤖 Building with AI

| System | What the model does | What keeps it honest | Built with |
| --- | --- | --- | --- |
| **Sales extraction** · [FVATeam](https://jeromezarate.vercel.app/work/fvateam) | GPT-4o vision reads revenue screenshots into structured sales records | A 0–1 confidence per field, a traffic-light review form, and an operator's approval before anything reaches the ledger. Manual entry stays as the fallback | OpenAI · Zod · Cloudinary |
| **Blog Bot** · [FVATeam](https://jeromezarate.vercel.app/work/fvateam) | Claude drafts posts from the least-used keywords; DALL-E 3 draws the banner | A deterministic AI-pattern checker with up to two targeted rewrites, nine durable Upstash Workflow steps that outlast Vercel's 60-second limit, and publish-or-draft as a setting | Claude · Upstash Workflow · QStash |
| **Reply orchestration** · [OnlyTool](https://jeromezarate.vercel.app/work/onlytool) | A separate AI inference service answers inbound conversations; I built the orchestration around it | Inbound webhooks land in durable pg-boss queues, so AI-service slowdowns retry instead of dropping conversations; revenue is attributed to AI or human senders | NestJS · pg-boss · Socket.IO |
| **My agent team** · team-starter | A Claude Code team plans, builds, tests, reviews and verifies changes in my own repositories | Tests seen failing before the build starts, and hooks that refuse a "done" report without evidence (below) | Claude Code · hooks · skills |

## 🧭 How I build

I build my own projects with a Claude Code team I set up: a lead session and nine agents with fixed scopes. A builder, a test engineer who only writes tests, QA that checks the running app and writes no code, a security reviewer who tries to abuse each change, a code reviewer, a designer, an architect, a tech lead and DevOps. The rules are what make it work:

- **Tests first.** The test engineer writes the tests from the acceptance criteria, the lead sees them fail, and only then does the builder start. The builder may never edit, skip or loosen a test.
- **Mockup first.** A screen is built only from a mockup I approved in a design round.
- **Claims are not evidence.** Anything one agent hands another is marked unverified. Reviewers get the diff and the gate output, never the builder's word.
- **Hooks with teeth.** A stop hook refuses a "Done" report while the run note has an unticked criterion or an empty verification section. Another sends an agent back if its report doesn't say what it didn't check.
- **Architecture in the linter.** ESLint encodes the layering rules the agents follow, so neither a person nor an agent crosses a boundary unnoticed.

I don't quote a speed-up for any of this, because I haven't measured one. What I can show is the gates.

## 💻 Tech stack

**Languages and runtime**<br>
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white">
<img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black">
<img alt="Node.js" src="https://img.shields.io/badge/Node.js-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white">

**Frontend**<br>
<img alt="React" src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black">
<img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white">
<img alt="React Native" src="https://img.shields.io/badge/React_Native-61DAFB?style=flat-square&logo=react&logoColor=black">
<img alt="Expo" src="https://img.shields.io/badge/Expo-1C2024?style=flat-square&logo=expo&logoColor=white">
<img alt="Redux Toolkit" src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white">
<img alt="TanStack Query" src="https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white">
<img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white">
<img alt="shadcn/ui" src="https://img.shields.io/badge/shadcn%2Fui-000000?style=flat-square&logo=shadcnui&logoColor=white">
<img alt="Zod" src="https://img.shields.io/badge/Zod-408AFF?style=flat-square&logo=zod&logoColor=white">

**Backend and data**<br>
<img alt="Express" src="https://img.shields.io/badge/Express-0A0A0A?style=flat-square&logo=express&logoColor=white">
<img alt="NestJS" src="https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white">
<img alt="Prisma" src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white">
<img alt="Mongoose" src="https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white">
<img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white">
<img alt="MySQL" src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white">
<img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white">
<img alt="SQLite" src="https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white">
<img alt="Redis" src="https://img.shields.io/badge/Redis-FF4438?style=flat-square&logo=redis&logoColor=white">
<img alt="Upstash" src="https://img.shields.io/badge/Upstash-00E9A3?style=flat-square&logo=upstash&logoColor=black">
<img alt="Apache Kafka" src="https://img.shields.io/badge/Apache_Kafka-231F20?style=flat-square&logo=apachekafka&logoColor=white">
<img alt="Socket.IO" src="https://img.shields.io/badge/Socket.IO-010101?style=flat-square&logo=socketdotio&logoColor=white">

**AI and background jobs**<br>
<img alt="Claude API" src="https://img.shields.io/badge/Claude_API-191919?style=flat-square&logo=anthropic&logoColor=white">
<img alt="Claude Code" src="https://img.shields.io/badge/Claude_Code-D97757?style=flat-square&logo=claudecode&logoColor=white">
<img alt="OpenAI GPT-4o" src="https://img.shields.io/badge/OpenAI_GPT--4o-10A37F?style=flat-square">
<img alt="Upstash Workflow" src="https://img.shields.io/badge/Upstash_Workflow-00E9A3?style=flat-square&logo=upstash&logoColor=black">
<img alt="QStash" src="https://img.shields.io/badge/QStash-00E9A3?style=flat-square&logo=upstash&logoColor=black">
<img alt="pg-boss" src="https://img.shields.io/badge/pg--boss-3c3c3c?style=flat-square">
<img alt="node-cron" src="https://img.shields.io/badge/node--cron-3c3c3c?style=flat-square">

**Testing and delivery**<br>
<img alt="Vitest" src="https://img.shields.io/badge/Vitest-00FF74?style=flat-square&logo=vitest&logoColor=black">
<img alt="Jest" src="https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white">
<img alt="Mocha" src="https://img.shields.io/badge/Mocha-8D6748?style=flat-square&logo=mocha&logoColor=white">
<img alt="Playwright" src="https://img.shields.io/badge/Playwright-2EAD33?style=flat-square">
<img alt="SonarQube" src="https://img.shields.io/badge/SonarQube-126ED3?style=flat-square&logo=sonarqubeserver&logoColor=white">
<img alt="GitHub Actions" src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white">
<img alt="Jenkins" src="https://img.shields.io/badge/Jenkins-D24939?style=flat-square&logo=jenkins&logoColor=white">
<img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white">
<img alt="Vercel" src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white">
<img alt="Sentry" src="https://img.shields.io/badge/Sentry-362D59?style=flat-square&logo=sentry&logoColor=white">
<img alt="AWS S3" src="https://img.shields.io/badge/AWS_S3-FF9900?style=flat-square">

## 🛠️ What I specialize in

- **Ledgers and billing that stay correct.** Append-only balances with no stored balance column, reconciliation that emits adjustments instead of rewriting history, invoicing and payment webhooks.
- **Realtime messaging and mobile sync.** Per-topic sequence numbers with a per-user cursor, idempotent sends, per-recipient delivery state, transaction-aware read replicas.
- **AI features with a human in the loop.** Confidence scores, approval before any write, durable multi-step pipelines on serverless.
- **Whole products, shipped alone.** Schema, API, UI, CI gates and release discipline, with more test code than application code when it matters.

## 💼 Experience

| Role | Company | When | Work |
| --- | --- | --- | --- |
| Full-Stack Engineer (Contract) | Nexacore Innovations FZCO | Apr 2025 – Aug 2026 | FVATeam · FVAChatting · Skillura |
| Full-Stack Engineer (Contract) | Fansvine | Jan 2026 – Jul 2026, in parallel | OnlyTool |
| Software Engineer | Armadalogics | Feb 2024 – May 2025, part-time to Aug 2025 | Trilloan |
| Junior Software Engineer | Village88, Inc. | Dec 2020 – Jan 2024 | Coding Dojo · Hacker Hero · Questionary |

## 📌 Featured work

| Project | What it is | My part | Stack |
| --- | --- | --- | --- |
| [**FVATeam**](https://jeromezarate.vercel.app/work/fvateam) | Agency operations and billing platform | About half of a 77,000-line codebase: invoicing and payments, the append-only ledger and its reconciliation engine, bulk email, two AI features | Next.js · Prisma · PostgreSQL · Claude · GPT-4o |
| [**Trilloan**](https://jeromezarate.vercel.app/work/trilloan) | Fintech super-app | Opened and owned the chat service: mobile sync, per-recipient delivery state, group chat, replica routing | Node.js · Express · MySQL · Kafka · Socket.IO · React Native |
| [**OnlyTool**](https://jeromezarate.vercel.app/work/onlytool) | Multi-tenant SaaS between a platform gateway and an AI service | All backend services, frontend surfaces and CI, with tests gating every PR | NestJS · Prisma · pg-boss · Socket.IO · Next.js |
| [**Scone Willow Tree Hotel**](https://github.com/devjayzee/Scone-Willow-Tree-Hotel) | Hotel management system, live at a working hotel | Everything, solo: 261 pull requests, 1,374 tests, lint-enforced layering, ten Redis rate limiters | Next.js 16 · Prisma 7 · NextAuth · Upstash |
| [**FVAChatting**](https://fvachatting.com) | Lead-generation site and funnel | Server-side Meta Conversions API, the lead pipeline, exit-intent capture, a custom CAPTCHA | Next.js · Prisma · Resend · Twilio |
| [**Skillura**](https://skillura.com) | Training and onboarding SaaS | Agency dashboard and pipeline analytics, single sign-in, the trial-plan system, billing history | Node.js · Express · MongoDB · React |

<details>
<summary><b>Earlier work at Village88</b></summary>
<br>

| Project | What it is | My part |
| --- | --- | --- |
| [**Hacker Hero**](https://jeromezarate.vercel.app/work/hacker-hero) | Gamified learn-to-code platform | A 112-commit rebuild into one AJAX content shell with a staged-rollout permalink migration; a performance and data-integrity sprint |
| [**Coding Dojo**](https://jeromezarate.vercel.app/work/coding-dojo) | Bootcamp learning platform | The Admin Student Access module across 441 commits; the HubSpot integration that replaced Zapier |
| **Questionary** | Assessment platform | The comment and reaction subsystem, and an encrypted database-ID primitive five other engineers adopted |
| **Blockchain analytics crawler** | Multi-chain explorer scraper | The scraping engine and the whole persistence layer |

</details>

## 📊 By the numbers

| | | Source |
| --- | --- | --- |
| **$338K** | invoiced in a billing system's first month, 99% collected | the system's records |
| **~50%** | of a 77,000-line agency platform | `git blame` |
| **55% · 89%** | of a fintech chat service's production code · of its tests | `git blame` |
| **1,374** | tests in a solo-built hotel system, across 261 pull requests | the test suite, PR history |
| **733** | commits across five Node.js and React platforms | `git log` |
| **5 years** | of Node.js, TypeScript and React | |

## 📈 Activity

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://streak-stats.demolab.com/?user=devjayzee&hide_border=true&background=16130F&stroke=37322D&ring=FCBE54&fire=FCBE54&currStreakNum=F2F0EC&sideNums=F2F0EC&currStreakLabel=FCBE54&sideLabels=B5B0AA&dates=8D8883">
  <img alt="GitHub contribution streak for devjayzee" src="https://streak-stats.demolab.com/?user=devjayzee&hide_border=true&background=FBF8F4&stroke=DCD7CF&ring=9A5500&fire=9A5500&currStreakNum=1A1510&sideNums=1A1510&currStreakLabel=9A5500&sideLabels=5D5750&dates=867F77" width="100%">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github-readme-activity-graph.vercel.app/graph?username=devjayzee&bg_color=16130f&color=b5b0aa&title_color=f2f0ec&line=71dcd6&point=fcbe54&area=true&area_color=71dcd6&hide_border=true&custom_title=Contributions%2C%20last%2031%20days">
  <img alt="GitHub contribution graph for devjayzee, last 31 days" src="https://github-readme-activity-graph.vercel.app/graph?username=devjayzee&bg_color=fbf8f4&color=5d5750&title_color=1a1510&line=00696a&point=9a5500&area=true&area_color=00696a&hide_border=true&custom_title=Contributions%2C%20last%2031%20days" width="100%">
</picture>

Most of these contributions are to private repositories.

## 📬 Get in touch

Open to remote full-time roles and contract work: backend-heavy full-stack, billing and ledger systems, realtime messaging, and AI features that need a human in the loop. Philippines, UTC+8.

The fastest way to reach me is [email](mailto:jeromedzarate@gmail.com). The case studies on my [portfolio](https://jeromezarate.vercel.app) explain each system and the decisions behind it.

<p align="right"><img alt="Profile views" src="https://komarev.com/ghpvc/?username=devjayzee&style=flat-square&color=8d8883&label=profile+views"></p>

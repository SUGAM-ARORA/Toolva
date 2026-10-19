# ToolVa — System Inventory & Repository Audit (v2.0)

## 1. Overview
This audit inventories the components, routes, models, authentication, security controls, and deployment assets across the ToolVa codebase.

## 2. Component Hierarchy & Front-end Structure
- **Framework**: React 19, TypeScript 5.7, Vite 6.2, Tailwind CSS 3.4.
- **State & Routing**: React Router v7 (`src/App.tsx`), LocalStorage & IndexedDB caches, Context/State hooks.
- **Core Views & Modules**:
  - `TAAFTHome.tsx` / `ToolvaHome.tsx`: Primary mission-control homepage, spotlight tools, and directory navigation.
  - `AIStackPlanner.tsx`: Multi-stage AI pipeline generator (Audio, LLM, Vision, Video, Code, Local vs Cloud).
  - `CostEstimator.tsx`: Cost calculator with pricing sources, token models, and stale-price detection.
  - `HardwareBenchmarks.tsx`: Benchmark comparison matrix (tokens/sec, VRAM, GPU vs CPU).
  - `MomentumIndex.tsx`: GitHub velocity and star growth tracking.
  - `SubmitTool.tsx`: Dual-path tool submission wizard (GitHub PR generator vs web queue).
  - `ToolCard.tsx` & `ToolDetailModal.tsx`: Cards and deep-dive detail sheets with Bayesian score, RAM/VRAM specs, and proof of capability.
  - `AdminDashboard.tsx`: Moderation queue, tool approval, review moderation, and activity logs.

## 3. Back-end Architecture (`backend/`)
- **Runtime**: Go 1.22+, Gin Web Framework, GORM ORM.
- **Databases**: SQLite (local development & portable mode) / PostgreSQL (production scalable mode).
- **Search Engine**: Meilisearch client integration for high-speed typo-tolerant text search.
- **REST Endpoints**:
  - `/api/health`: Health status, DB ping, uptime, and system metadata.
  - `/api/auth/register`, `/api/auth/login`, `/api/auth/verify-email`, `/api/auth/send-phone-otp`, `/api/auth/reset-password`: Identity & auth.
  - `/api/tools`: Catalog retrieval with filtering, sorting, and pagination.
  - `/api/tools/:id`: Detailed tool metadata with specs, benchmarks, and proofs.
  - `/api/tools/:id/reviews`: Bayesian rating retrieval and review submission.
  - `/api/badges/:id/:type.svg`: Dynamic SVG badges for GitHub READMEs.
  - `/api/admin/tools`, `/api/admin/pending-tools`: Moderator actions.

## 4. Environment Variables
- **Frontend**:
  - `VITE_API_BASE_URL`: Base URL for ToolVa Go backend (default: `http://localhost:8080/api`).
  - `VITE_GA_MEASUREMENT_ID`: Google Analytics 4 Measurement ID.
- **Backend**:
  - `PORT`: HTTP server port (default: `8080`).
  - `ENV`: Environment mode (`development`, `production`).
  - `DATABASE_URL`: Connection string (SQLite file path or PostgreSQL DSN).
  - `JWT_SECRET`: Secret key for HMAC-SHA256 session token signing.
  - `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins.
  - `MEILI_HOST`, `MEILI_API_KEY`: Meilisearch credentials.

## 5. Security Controls
- **SSRF Prevention**: `src/lib/security.ts` blocks local loopbacks (`127.0.0.1`), private RFC 1918 ranges, link-local addresses, and cloud instance metadata services (`169.254.169.254`).
- **Input Sanitization**: HTML tag stripping and URL protocol white-listing (`http://`, `https://`).
- **Authorization**: GORM parameterized queries against SQL injection; Gin middleware checking role hierarchy (`visitor < user < contributor < moderator < admin < superadmin`).
- **Anti-Manipulation**: Review engine blocks authors from self-rating and limits users to one review per tool.

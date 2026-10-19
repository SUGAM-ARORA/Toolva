# ToolVa — Architecture Decision Record & Topology Plan (Phase 9)

## 1. Title: Post-Phase-1 Architecture Checkpoint & Production Topology

### Status: APPROVED (Phase 9 Checkpoint)
### Date: 2026-10-19

## 2. Requirements & Workload Measurement (Task 9.1)
- **Catalog Size**: ~1,500 curated tools, ~5,000 community submissions over Year 1.
- **Query Patterns**: High read-to-write ratio (98% reads: directory searches, filters, tool lookups, badge hits; 2% writes: reviews, corrections, submissions).
- **Badge Endpoint Traffic**: Potential high frequency from public GitHub READMEs. Requires 5-minute HTTP caching headers (`Cache-Control: public, max-age=300`).
- **Freshness Jobs**: Weekly automated URL check job visiting all listings with polite 1-second pacing to avoid remote rate limits.

## 3. Database Evaluation & TCO Comparison (Task 9.2)

| Criteria | SQLite with WAL | Managed PostgreSQL (Supabase / Neon) | Self-Hosted PostgreSQL |
|----------|-----------------|--------------------------------------|------------------------|
| **Operational Burden** | Minimal (Single binary/file) | Low (Provider managed) | Medium (Maintenance, patches) |
| **Persistence / Scale** | Up to 100K tools / 100 req/sec | Unlimited horizontal read replicas | High, scalable |
| **Full-Text / Vector** | Built-in FTS5; vector via sqlite-vss | pgvector extension | pgvector extension |
| **Monthly Cost** | $0 (included in VPS disk) | $0 - $25/mo | $10 - $40/mo |
| **Portability** | Universal | High | High |
| **Recommendation** | **Default for Stage 1 MVP** | **Recommended Upgrade Path** | Optional for private enterprise |

## 4. Hosting & Deployment Evaluation (Task 9.3)

| Provider / Topology | Pros | Cons | Free Tier / Base Cost |
|---------------------|------|------|------------------------|
| **Single VPS (Docker Compose: Frontend + Backend + Meili)** | Zero external network hops, low latency, full control | Single point of failure if unmonitored | ~$5 - $10/mo |
| **Vercel (Frontend) + Render/Fly.io (Backend)** | Global CDN for frontend, automated git deploys | Free tier sleep delays on backend | $0 - $7/mo |
| **Kubernetes (k8s/ manifests provided)** | Enterprise auto-scaling, zero-downtime rolling deploys | High complexity for initial MVP | $50+/mo |

## 5. Decision Record & Topology (Task 9.4)
- **Stage 1 (Current MVP Launch)**:
  - Frontend: High-performance SPA statically served via Nginx with aggressive HTTP caching and gzip/brotli compression.
  - Backend: Go REST API running containerized with SQLite WAL mode.
  - Dynamic README Badges: Served directly from Go with 5-minute CDN cache headers.
- **Stage 2 (Post-MVP Scale Checkpoint)**:
  - Migrate database to Managed PostgreSQL using GORM auto-migrations.
  - Connect Meilisearch cluster for instant fuzzy multi-language query indexing.

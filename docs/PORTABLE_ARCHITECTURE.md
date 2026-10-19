# ToolVa — Portable Architecture & Deployment Standards (v2.0)

## 1. Principles of Portability
ToolVa avoids vendor lock-in by adhering strictly to portable cloud-native standards:

1. **Database Independence**:
   - GORM ORM abstraction enables zero-code switching between SQLite (local single-node or edge deployments) and PostgreSQL (managed RDS, Supabase, Neon, or self-hosted).
2. **Containerized Deployments**:
   - Complete multi-stage Dockerfiles for both Frontend (Nginx Alpine) and Backend (Go scratch/alpine).
   - Standard `docker-compose.yml` for 1-command local development or VPS deployment.
3. **Stateless API Design**:
   - RESTful endpoints authenticate using standard JWT bearer tokens.
   - Any multi-instance deployment can scale horizontally behind any standard reverse proxy (Nginx, Traefik, Caddy, Cloudflare).
4. **Health & Observability Contract**:
   - `/api/health` reports status, database latency, active workers, and uptime.
   - Standard stdout JSON logs suitable for Datadog, Prometheus/Grafana Loki, or standard Docker logging drivers.
5. **Backup & Restore Portability**:
   - Database schemas managed via versioned migrations.
   - Data exports use open JSON formats compatible with any object storage (S3, MinIO, R2).

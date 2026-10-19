# ToolVa — Operations, Backup & Disaster Recovery Guide (v2.0)

## 1. System Inventory & Persistence Boundaries
ToolVa data resides in:
1. **Primary Relational Store**: SQLite database file (`toolva.db`) or PostgreSQL cluster.
2. **Catalog Seed Assets**: Version-controlled JSON in `src/data/`.
3. **Cache & Search Indexes**: Meilisearch index store.

## 2. Backup Strategy

### A. Automated Daily Snapshot (SQLite Mode)
Using SQLite's online `.backup` command ensures ACID consistency without taking the server offline:
```bash
# SQLite Consistent Backup
sqlite3 /data/toolva.db ".backup '/backups/toolva-$(date +%Y%m%d_%H%M%S).db'"
gzip /backups/toolva-*.db
```

### B. Automated Daily Dump (PostgreSQL Mode)
```bash
pg_dump -Fc -h $DB_HOST -U $DB_USER -d toolva > /backups/toolva-$(date +%Y%m%d_%H%M%S).dump
```

### C. Offsite Replication
Backups are encrypted via AES-256 and pushed to S3/Cloudflare R2 bucket with 30-day retention and 7-day immutable object lock.

## 3. Disaster Recovery & Rollback Runbook

### Rollback Procedure (Frontend & Backend)
1. If a bad release is deployed:
   - Identify previous Git tag (e.g. `v1.9.0` or previous Docker image digest).
   - Roll back container image: `docker compose down && sed -i 's/v2.0.0/v1.9.0/' .env && docker compose up -d`.
2. Database Rollback:
   - If a schema migration failed: Restore latest verified daily snapshot:
     ```bash
     cp /backups/latest-verified.db /data/toolva.db
     systemctl restart toolva-backend
     ```
3. Post-Recovery Verification:
   - Run health check: `curl -f http://localhost:8080/api/health`.
   - Verify tool count matches expected catalog size.

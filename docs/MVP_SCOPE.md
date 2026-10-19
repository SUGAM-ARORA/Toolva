# ToolVa — MVP Scope & Product Specification (v2.0)

## 1. Executive Summary
ToolVa is the definitive open-source and local AI discovery, benchmarking, and intelligence platform. It bridges the gap between raw model repositories (e.g. Hugging Face, GitHub) and practical adoption by developers, AI engineers, and enterprises.

## 2. Confirmed MVP Workstreams (Phases 0 — 8)
The ToolVa MVP commits strictly to the following 9 workstreams:

1. **Baseline & System Architecture (Phase 0)**:
   - Defined scope, canonical branding ("ToolVa"), repository boundary, and portable architecture standards.
2. **Engineering Foundation (Phase 1)**:
   - Centralized environment configuration, standardized REST API error format, automated CI checks, unit tests, and production Docker containers.
3. **Authentication & Identity (Phase 2)**:
   - Multi-role identity (`visitor`, `user`, `contributor`, `moderator`, `admin`, `superadmin`), JWT sessions, rate-limited auth routes, and developer hardware profiles.
4. **Directory & Intelligence (Phase 3)**:
   - Sourced open-source/local AI catalog with RAM/VRAM specs, model formats (GGUF, Safetensors, ONNX), and one-click install commands.
   - Sourced Hardware Benchmarks (tokens/sec, VRAM footprint, tested hardware, methodology).
   - Intent-based AI Stack Planner v1 generating multi-stage pipelines with compatibility checks.
   - Transparent Cost Estimator with maintained pricing sources and stale-price flags (>90 days).
   - Proof of Capability gallery with reproducible examples and provenance.
   - GitHub Momentum Index with star velocity tracking over time.
   - Dynamic README badges (Rating, Verified Active, Hardware requirements, Momentum).
   - Company intelligence with explicit country labels (HQ vs Project Origin) and product links.
5. **Trust & Freshness (Phase 4)**:
   - Claim-level provenance tracking.
   - Automated dead-link and HTTP status checker with SSRF safety protections.
   - Stale-data policy flagging unreviewed tools (>180 days) and stale prices (>90 days).
   - Community correction submission workflow with moderator review.
6. **Submissions & GitHub Integration (Phase 5)**:
   - Dual submission paths: Direct schema-valid GitHub Pull Request generator and web submission queue.
   - Submission tiers: Free Standard Community PR ($0, target 100 days), Community-Vouched Fast-Track ($0 with ≥10 developer vouches, target 20 days), Verified Benchmark Review ($9), and transparent sponsorship packages.
   - Mandatory trust guardrail: Payment never guarantees acceptance, score, or verified badge.
7. **Ratings & Reviews (Phase 6)**:
   - Documented Bayesian weighted scoring formula:
     $$WR = \frac{v}{v + m} R + \frac{m}{v + m} C \quad (m=10, C=4.2)$$
   - Categorized rating dimensions (Quality, Ease of Use, DX / API, Value, Local Performance).
   - Low-sample confidence indicators ($v < 10$).
   - Anti-manipulation: Submitters/owners prohibited from rating their own tools; 1 review per user.
8. **Brand Cleanup & UI Polish (Phase 7)**:
   - Complete removal of legacy competitor banners or outdated naming.
   - Cohesive ToolVa visual identity, high-contrast dark/light modes, accessible navigation, and rich interactive states.
9. **Launch Hardening & Operations (Phase 8)**:
   - Security audit (SSRF, authz, input sanitization, rate limits).
   - End-to-end automated smoke tests.
   - Backup/restore and migration runbooks.
   - Complete launch readiness checklist verification.

## 3. Explicit Non-Goals for MVP (Phase 10 — Post-MVP)
- **Native Mobile Apps (iOS/Android)**: Defer until core web adoption and catalog quality are proven.
- **Anonymous Hosted Cloud Inference Sandbox**: Requires GPU cloud infrastructure, threat modeling, and cost caps.
- **SaaS Stack Audit**: Requires deep OAuth integrations and corporate billing models.
- **Ongoing Revenue Share Policy**: Defer commercial rev-share agreements until Phase 3.

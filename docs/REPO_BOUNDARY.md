# ToolVa — Repository Boundary & Public Contribution Architecture (v2.0)

## 1. Context & Purpose
ToolVa operates as an open ecosystem while protecting sensitive infrastructure, credentials, user PII, and administrative auditing logs.

## 2. Public vs. Private Boundaries

### A. Public Surfaces (Open for Community Contribution)
- **Tool Catalog Schema & Definitions**:
  - The catalog schemas in `src/data/` and canonical tool definitions.
  - Community tool submissions generated as GitHub Pull Requests against `data/tools/<tool-slug>.json`.
- **Frontend SPA Codebase**:
  - React components, styling, benchmarking views, and documentation.
  - Dynamic README badge endpoints and client embed code.
- **Contribution Documentation & Policies**:
  - Contributor guidelines (`CONTRIBUTING.md`, `docs/SUBMISSION_AND_PR_GUIDE.md`).
  - Trust, scoring, and review policies (`docs/TRUST_AND_SCORING_POLICY.md`).

### B. Private / Protected Surfaces (Internal Only)
- **Backend Infrastructure & Secrets**:
  - Backend database credentials, private API keys (OpenAI, Anthropic, Meilisearch admin keys), and JWT encryption secrets.
  - Email SMTP / SMS OTP provider credentials.
- **User PII & Authentication Records**:
  - Passwords (bcrypt hashes), user emails, phone numbers, TOTP seeds, and session audit logs.
- **Admin Moderation & Anti-Abuse Internal Metrics**:
  - Internal IP address logs, anti-fraud flags, rate-limiting counters, and private moderation notes.

## 3. Contribution Workflow Boundary
1. External contributors fork the repository or use the ToolVa Web Submission wizard.
2. The wizard validates fields against schema rules and exports an exact schema-compliant Pull Request.
3. CI automatically validates URL safety, checks for duplicate slugs, and verifies license validity without executing arbitrary code.
4. Maintainers merge approved pull requests, which automatically trigger idempotent catalog ingestion into production.

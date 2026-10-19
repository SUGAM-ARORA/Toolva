# ToolVa — Security Audit & Threat Modeling Review (v2.0)

## 1. Threat Modeling & Scope
ToolVa handles public catalog intelligence, user-generated reviews, community tool submissions, and dynamic SVG README badge generation. The security audit covers:
- Server-Side Request Forgery (SSRF) in link and freshness checkers.
- Cross-Site Scripting (XSS) and Content Security Policy (CSP).
- SQL Injection & Parameter Tampering.
- Authentication, Token Security & Session Invalidation.
- Anti-Manipulation & Rate Limiting.

## 2. Controls & Verification

### A. SSRF Protections (`src/lib/security.ts` & backend HTTP clients)
All outbound URL validation enforces strict IP blocking:
- Blocks Loopback addresses (`127.0.0.0/8`, `localhost`, `::1`).
- Blocks Private RFC 1918 networks (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`).
- Blocks Link-Local & Multicast (`169.254.0.0/16`, `224.0.0.0/4`).
- Blocks Cloud Metadata Services (`169.254.169.254`, `metadata.google.internal`).
- Enforces allowable protocols: `http://` and `https://` only; blocks `file://`, `gopher://`, `javascript:`.

### B. Cross-Site Scripting (XSS) & Input Sanitization
- All text inputs (tool descriptions, reviews, correction notes) are sanitized by escaping HTML special characters.
- Strict CSP headers configured in Nginx (`nginx.conf` and `nginx-security-headers.conf`):
  `default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:;`

### C. Authentication & Role-Based Access Control
- JWTs signed using HMAC-SHA256 with strong secrets (`JWT_SECRET`).
- Passwords hashed using bcrypt (cost factor 10+).
- Role hierarchy strictly enforced on the server: `visitor < user < contributor < moderator < admin < superadmin`.
- SuperAdmin and Admin endpoints guarded by explicit Go middleware rejecting unprivileged tokens with 403 Forbidden.

### D. Anti-Manipulation & Abuse Rate Limiting
- Submitters and founders cannot review their own listings.
- Review duplicate check limits users to 1 review per tool.
- Auth endpoints (`/api/auth/*`) rate-limited to 5 requests per minute per IP to prevent brute-force attacks.
- Community report threshold automatically isolates suspect reviews.

## 3. Residual Risk Assessment
- **Status**: PASSED. No critical or high-severity vulnerabilities remain.

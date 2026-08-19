# Security Policy

## Supported Versions

| Version | Supported |
|---------|----------|
| 1.x.x | ✅ Active support |
| < 1.0 | ❌ End of life |

## Reporting a Vulnerability

We take security seriously. If you discover a vulnerability:

### ⚠️ Do NOT
- Open a public GitHub issue
- Discuss in public channels
- Exploit the vulnerability

### ✅ Do
1. Email **security@toolva.com** with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Suggested fix (if any)
2. Allow up to **48 hours** for initial response
3. Work with us on responsible disclosure

## Security Architecture

### Frontend (Public Repository)
- ✅ No secrets or API keys in source code
- ✅ URL sanitization (`javascript:`, `data:`, `vbscript:` blocked)
- ✅ XSS prevention (HTML escaping, input validation)
- ✅ Content Security Policy headers
- ✅ HTTPS-only in production
- ✅ Rate limiting on client-side actions

### Backend (Private Repository)
- ✅ JWT v5 authentication (HMAC-SHA256)
- ✅ bcrypt password hashing (cost factor 10)
- ✅ CORS with explicit origin allowlist
- ✅ SQL injection prevention (parameterized queries via GORM)
- ✅ Graceful shutdown with connection draining
- ✅ Non-root container execution

### CI/CD Security
- ✅ Gitleaks secret scanning on every push/PR
- ✅ GitHub CodeQL SAST analysis
- ✅ npm audit on every build
- ✅ Dependabot alerts enabled
- ✅ Automated PR validation for tool submissions

### Infrastructure
- ✅ Docker containers run as non-root (UID 1001)
- ✅ Kubernetes NetworkPolicies restrict pod communication
- ✅ TLS via cert-manager + Let's Encrypt
- ✅ Resource limits prevent DoS
- ✅ Health checks with automatic restart

## Dependency Management

| Ecosystem | Scanner | Frequency |
|-----------|---------|----------|
| npm | `npm audit` + Dependabot | Every PR + daily |
| Go | Dependabot + govulncheck | Every PR + daily |
| Docker | Trivy | Weekly |
| Secrets | Gitleaks | Every push |

## Security Headers

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; ...
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Contact

- 📧 Security issues: security@toolva.com
- 📧 General: sugam.arora23@gmail.com
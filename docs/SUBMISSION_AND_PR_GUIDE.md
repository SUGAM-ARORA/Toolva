# ToolVa — Contributor Guide & Submission Workflow (v2.0)

## 1. Overview
ToolVa provides two distinct paths for listing and updating AI tools in our open directory. Both paths are evaluated against the same strict open schema, safety validations, and evidence criteria.

## 2. Submission Paths

### Path A: Direct GitHub Pull Request (Founder & Developer Path)
1. **Fork the Repository**:
   Fork the ToolVa repository on GitHub.
2. **Create Tool Data File**:
   Add a structured tool definition JSON in `data/tools/<tool-slug>.json`.
3. **Local Validation**:
   Run `npm run test` or `node .github/scripts/validate-tool-submission.js` to ensure zero validation errors.
4. **Open Pull Request**:
   Submit a PR against `main` using the provided Pull Request template.
5. **CI Automation**:
   GitHub Actions CI automatically runs SSRF safe URL checks, verifies license legitimacy, and checks for duplicate slugs.
6. **Publication**:
   Upon maintainer merge, the entry is published to the catalog idempotently.

### Path B: Web-Based Submission Wizard (Interactive Path)
1. Click **Submit a Tool** in the ToolVa header or sidebar.
2. **Step 1: Choose Submission Tier** (see Review Options below).
3. **Step 2: Enter Tool & Open-Source Specs**:
   - Official URL & GitHub repository / Hugging Face Space.
   - Open-source license (e.g. MIT, Apache 2.0, AGPL, Proprietary).
   - Local AI support (runtimes: Ollama, vLLM, Docker, LM Studio).
   - Minimum and Recommended RAM/VRAM specs.
   - One-click install commands (e.g., `ollama run ...`).
4. **Step 3: Pricing & Proof Evidence**:
   - Pricing model & link to canonical pricing source.
   - Capability proof link (demo, benchmark, or reproducible sample).
5. **Step 4: Live Schema & SSRF Safety Validation**.
6. **Step 5: Submission Route**:
   - **Instant GitHub PR**: Wizard pre-fills the exact JSON file and opens a ready-to-merge GitHub PR.
   - **Web Submission Queue**: Direct submission to the moderation review dashboard.

---

## 3. Review Tiers & Policies (From Master Tracker)

| Tier | Price | Review SLA Target | Description & Guardrail |
|------|-------|-------------------|--------------------------|
| **Free Community PR** | **$0** | 100 days target | Standard community review queue. Review priority follows queue order. |
| **Community-Vouched Fast-Track** | **$0** | 20 days target | Expedited review triggered when **≥10 developers vouch** on the PR. Accelerates review only; never guarantees acceptance. |
| **Verified Benchmark Review** | **$9** | 5 business days | Technical review of submitted hardware benchmarks, memory logs, and setup reproducibility. Payment covers review effort; does not guarantee passing stamp. |
| **One-Time Submission** | **$49** ($39 early bird) | 3 business days | Priority review queue. Payment never guarantees acceptance or rating. |
| **Category Sponsorship** | **$25/mo** ($200/yr) | Immediate upon approval | Featured category banner. Strictly labelled `Sponsored`. Zero impact on Bayesian score or verified status. |
| **Bulk Submission** | **$150** | 5 business days | Package for 5 tool submissions. Each tool evaluated under identical quality standards. |
| **All-in-One Category Package** | **$229** | 3 business days | 4 tool reviews + 1 category sponsorship section + 1 verified benchmark review. |

> [!IMPORTANT]
> **Strict Trust Guardrail**: Payment pays for reviewer time and expedited processing only. Payment **never** buys tool acceptance, favorable ratings, or an unearned verification badge.

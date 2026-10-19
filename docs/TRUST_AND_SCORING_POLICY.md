# ToolVa — Trust, Provenance & Bayesian Scoring Policy (v2.0)

## 1. The Bayesian Rating Formula
To eliminate review manipulation, score inflation from small sample sizes, and early review bias, ToolVa calculates all tool ratings using the canonical Bayesian Weighted Rating formula:

$$WR = \left(\frac{v}{v + m}\right) R + \left(\frac{m}{v + m}\right) C$$

Where:
- **$v$**: Number of verified community ratings/reviews for this specific tool.
- **$m$**: Minimum prior threshold weight, fixed at **$m = 10$**.
- **$R$**: Arithmetic mean of the verified reviews for this tool.
- **$C$**: Global mean rating across the entire catalog, fixed at **$C = 4.20$**.

### Worked Examples
1. **Tool with 1 perfect review ($v=1, R=5.0$)**:
   $$WR = \left(\frac{1}{1 + 10}\right) 5.0 + \left(\frac{10}{1 + 10}\right) 4.20 = 0.454 + 3.818 = 4.27$$
   *Result*: Mitigates fake 5-star inflation for brand-new tools. Marked with `Low Confidence (1 review)`.
2. **Tool with 10 reviews ($v=10, R=4.8$)**:
   $$WR = \left(\frac{10}{20}\right) 4.8 + \left(\frac{10}{20}\right) 4.20 = 2.40 + 2.10 = 4.50$$
   *Result*: Marked with `Moderate Confidence (10 reviews)`.
3. **Established tool with 100 reviews ($v=100, R=4.8$)**:
   $$WR = \left(\frac{100}{110}\right) 4.8 + \left(\frac{10}{110}\right) 4.20 = 4.364 + 0.382 = 4.75$$
   *Result*: Strong organic confidence. Marked with `High Confidence (100 reviews)`.

## 2. Rating Dimensions
Each review collects ratings (1.0 to 5.0) across 5 core dimensions:
1. **Overall Quality**: Reliability, output accuracy, and responsiveness.
2. **Ease of Use**: Onboarding experience, UI clarity, and setup documentation.
3. **Developer Experience / API**: SDK quality, API consistency, and error messages.
4. **Value for Price**: Free tier generosity and pricing transparency.
5. **Local Performance**: RAM/VRAM efficiency, latency, and CPU/GPU resource utilization.

## 3. Reviewer Trust & Weighting Policy
- **Verified User**: Standard user authenticated via email/GitHub. Base weight = 1.0x.
- **Practitioner**: User with verified public GitHub commits or verifiable local AI deployment. Base weight = 1.25x.
- **Verified Benchmark Author**: Expert reviewer who submits reproducible benchmark logs. Base weight = 1.50x.
- **Anti-Manipulation Guarantee**:
  - The tool submitter or listed founder **cannot** submit reviews for their own tool.
  - Maximum of 1 review per user account per tool.
  - Reviews flagged by 3+ community members enter the moderator review queue.

## 4. Trust Badges & Separation of Status
ToolVa strictly separates organic quality from commercial placement:
1. **Community Bayesian Score**: Purely mathematical calculation based on verified reviews.
2. **Verified Active Badge**: Awarded only when automated weekly URL checks pass HTTP 200/301 without broken redirections.
3. **Verified Benchmark Badge**: Awarded when an independent reproducible benchmark report with hardware specs is verified by moderators.
4. **Sponsored Category Placement**: Clearly labelled with `Sponsored`. **Never** influences Bayesian score, organic ranking, or verification status.

## 5. Provenance & Stale-Data Policy
- **Claim-Level Provenance**: Every factual claim (RAM requirement, licensing, pricing, benchmarks) records a source URL and verification date.
- **Stale Price Warning**: If pricing data has not been re-verified within **90 days**, a `Stale Pricing` banner is displayed.
- **Unverified Listing Flag**: If tool links or capabilities have not been reviewed within **180 days**, the listing is marked `Needs Community Review`.

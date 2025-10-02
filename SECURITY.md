# Security & Supply Chain Overview

This document summarizes the implemented security hardening measures and how to reproduce Software Bill of Materials (SBOM) artifacts for this project (Backend + Frontend).

## Contents
- Runtime Hardening (Backend)
- GraphQL Safeguards
- Rate Limiting
- Secure HTTP Response Headers
- JWT Handling
- Persisted Queries (GraphQL)
- Actuator Exposure
- SBOM Generation (Backend)
- SBOM Generation (Frontend)
- Recommended Operational Practices
- Future Improvements (Backlog)

---
## Runtime Hardening (Backend)
Implemented in `SecurityConfig` & related filters:
- Strict header set (see below) applied before business logic.
- Centralized rate limiting filter positioned before authentication.
- Isolation of test profile (in-memory H2 + disabled Flyway) for deterministic CI.

## GraphQL Safeguards
- Query depth limit & complexity instrumentation (prevents resource exhaustion / DoS style queries).
- Optional persisted query allowlist (JSON) with properties toggle: prevents arbitrary ad‑hoc large / malicious queries when enabled.

## Rate Limiting
- Bucket4j based filter applied to `/graphql` and other sensitive endpoints early in the chain.
- Mitigates brute force or flood attempts prior to expensive JWT parsing or DB access.

## Secure HTTP Response Headers
Configured defensive headers include (intended CSP example below; adjust if you extend frontend origins):
- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer`
- `X-XSS-Protection: 0` (modern browsers rely on CSP)
- `Strict-Transport-Security` (when behind TLS)

## JWT Handling
- Updated to `jjwt` 0.13.0.
- Secret length validation (minimum entropy enforced at startup) prevents weak key usage.

## Persisted Queries
- Allowlist file: `graphql-persisted-queries.json`.
- Feature flags via application properties: enable/disable enforcement and dynamic registration.
- Reduces attack surface by limiting accepted GraphQL operations.

## Actuator Exposure
- Non-essential actuator endpoints restricted; only health/metrics (Prometheus) exposed as needed.

---
## SBOM Generation (Backend)
Tooling: CycloneDX Gradle Plugin.

Command (from `Backend/`):
```
./gradlew cyclonedxBom
```
Primary output: `Backend/build/reports/application.cdx.json` (CycloneDX JSON). Depending on plugin defaults your environment may place it under `build/cyclonedx/`; adjust docs if path changes.

Use cases:
- Dependency inventory for vulnerability scanning (e.g. Syft/Grype, Dependency-Track).
- Licensing overview.

## SBOM Generation (Frontend)
Tooling: `@cyclonedx/cyclonedx-npm` executed in a pnpm workspace. Because the CLI expects an npm style tree, it emits many `npm error missing/invalid` messages under pnpm. These are suppressed logically via flags while still producing valid CycloneDX output.

Commands (from `Frontend/`):
```
pnpm run sbom      # Produces sbom-frontend.json
pnpm run sbom:xml  # Produces sbom-frontend.xml
```
Flags rationale:
- `--ignore-npm-errors` allows generation despite pnpm layout warnings.
- `--omit dev` limits the SBOM to production dependencies.
- `|| true` ensures CI does not fail purely due to noisy warnings.

Outputs committed (baseline):
- `Frontend/sbom-frontend.json`
- `Frontend/sbom-frontend.xml`

Regenerate & refresh before releases or after dependency updates.

## Recommended Operational Practices
- Run SBOM generation in CI (post build) and publish artifacts.
- Feed SBOMs into Dependency-Track / OSS Review Toolkit for continuous monitoring.
- Enforce minimum JWT secret length in deployment automation (fail fast if under threshold).
- Monitor rate limiting metrics (export from Bucket4j if extended) to spot abuse.
- Regularly review GraphQL complexity thresholds based on real usage patterns.

## Future Improvements (Backlog)
| Area | Proposal |
|------|----------|
| SBOM | Automate in CI, sign artifacts (e.g. cosign) |
| SBOM | Add vulnerability scan stage (Grype or Snyk) |
| Security Headers | Add CSP nonce pipeline if inline scripts become necessary |
| Auth | Add refresh token rotation & token revocation list |
| Logging | Structured security event log for authentication & rate limit hits |
| Monitoring | Rate limit metrics export & alert thresholds |
| Supply Chain | Add provenance attestation (SLSA level build metadata) |

---
Maintainer note: update this file when adding new security controls or changing SBOM processes.

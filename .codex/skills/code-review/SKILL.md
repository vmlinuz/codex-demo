---
name: code-review
description: Perform read-only code reviews and code analysis for whole codebases, diffs, pull requests, or explicitly mentioned files. Use whenever the user asks to review code, analyze code, inspect a change, or look for bugs, regressions, logic errors, type hazards, security issues, performance problems, maintainability risks, or other user-specified focus areas. Thoroughly inspect all in-scope files and never modify code while reviewing.
---

# Code Review

Perform deep, read-only reviews and risk-oriented code analysis. Analyze the code carefully, understand how it behaves, and produce a comprehensive evidence-based report. Never change the code while reviewing it.

## Non-Negotiables

- Never modify code during review.
- Never create patches, rewrite files, or perform cleanup as part of the review.
- If the user asks for a full-codebase review, inspect every in-scope file. Do not sample.
- If the user names files, inspect every mentioned file completely. Do not partially review them.
- Expand into related files when needed to validate behavior, contracts, or risk, and state that expansion in the report.
- Treat user-requested focus areas as mandatory review axes.
- Always check logic, type safety, security, and performance even if the user does not mention them explicitly.
- Do not claim a file was reviewed unless it was actually opened and analyzed.

## Review Modes

- Whole codebase review: build a full file inventory and inspect every in-scope file.
- Diff or pull request review: inspect every changed file, then open related callers, callees, tests, configs, schemas, and migrations as needed.
- Named-file review: inspect all explicitly mentioned files, then pull in adjacent files only when required to validate behavior.
- Code analysis request: explain behavior and structure first, then report risks, findings, and testing gaps separately.

## Workflow

1. Define scope and any user-requested focus areas.
2. Build an exact file inventory for the review scope.
3. Open every in-scope file.
4. Review each file against the required watchlist below.
5. Cross-check surrounding code when behavior depends on contracts, configuration, storage, or call chains.
6. Produce a findings-first report for review requests, or an explanation-plus-risks report for analysis requests.

## Required Watchlist

- Logic and correctness
  - Check control flow, edge cases, null and empty handling, state transitions, partial updates, stale assumptions, and dead paths.
- Types and contracts
  - Check nullable hazards, unsafe casts, schema drift, mismatched interfaces, serialization issues, and client-server contract breaks.
- Security and trust boundaries
  - Check auth and authz, injection risks, XSS, CSRF, SSRF, path traversal, secret leakage, unsafe redirects, and overexposed data.
- Performance and scale
  - Check N+1 patterns, repeated heavy work, large payloads, unbounded loops, wasted rendering, synchronous bottlenecks, and cache misuse.
- Reliability and resilience
  - Check swallowed errors, brittle fallbacks, missing retries or timeouts, race conditions, double submits, cleanup gaps, and resource leaks.
- Regression and maintainability risk
  - Check hidden coupling, backward-compatibility breaks, migration risk, configuration assumptions, and hard-to-debug behavior.
- Tests and observability
  - Check whether risky logic has meaningful coverage, whether assertions are strong enough, and whether critical paths are diagnosable.
- User-requested focus areas
  - Treat any requested axes such as accessibility, architecture, API consistency, documentation, or developer experience as first-class review categories.

## Findings Bar

- Report only issues supported by concrete code evidence.
- Prefer real bugs, regressions, and risks over style commentary.
- Distinguish actionable findings from optional improvements.
- Mark uncertainty explicitly and state what would confirm or refute it.
- If no actionable findings are found, say so clearly and list residual risks or testing gaps.

## Final Report

For code reviews, present findings first, ordered by severity, with direct file and line references.

For each finding, include:

- Severity
- File and line reference
- Problem
- Impact
- Minimal fix direction

Then include:

- Scope summary
- Files or areas reviewed with no issues found
- Open questions or assumptions
- Residual risk or testing gaps

For analysis-only requests, explain the code plainly first, then include separate sections for risks, open questions, and testing gaps.

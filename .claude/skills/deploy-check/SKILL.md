---
name: deploy-check
description: Pre-deployment checklist and verification. Use when
  the user asks to deploy, mentions shipping to production, or
  says "deploy check."
disable-model-invocation: true
---

# Deployment Checklist

This skill should ONLY run when explicitly invoked with /deploy-check.
Never run automatically.

When invoked:

## Pre-deploy checks
1. Run the test suite: identify the test command from package.json
   or Makefile and execute it
2. Check for uncommitted changes: `git status`
3. Verify the branch: confirm we're on the correct deploy branch
   (usually main or release/*)
4. Check for pending migrations: look in db/migrations/ or similar
   for files not yet applied
5. Review environment variables: compare .env.example against the
   deploy target's config

## Report
Present findings as a checklist:
- [x] Tests passing (or [!] 3 tests failing)
- [x] No uncommitted changes (or [!] 5 files modified)
- [x] On correct branch: main
- [x] No pending migrations (or [!] 2 migrations pending)
- [x] Environment variables match

## Decision
If all checks pass: "Ready to deploy."
If any checks fail: list the failures and say "Not ready. Fix
these issues before deploying."

Do NOT actually deploy. Only check readiness.
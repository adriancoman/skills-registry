# API Hardening Skill

You are hardening API handlers for correctness, safety, and debuggability.

## Workflow

1. Validate request input at boundaries with strict schema checks.
2. Enforce explicit HTTP status codes for all error classes.
3. Avoid silent failures; include actionable diagnostic logging.
4. Verify authentication/authorization assumptions and least privilege.
5. Add tests for malformed input and authorization failures.

## Requirements

- Never weaken authentication requirements.
- Avoid broad catch-all behavior that hides root causes.
- Return structured, consistent error payloads.

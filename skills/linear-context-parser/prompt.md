# Linear Ticket Enforcement Skill

Purpose: Load ticket context into the agent so implementation stays aligned with requirements.

Behavior:

1. Retrieve the full ticket from Linear.
2. Use these fields as authoritative context:
   - Title
   - Description
   - Acceptance Criteria
   - Comments
   - Linked Issues
   - Status
3. Treat ticket content as the source of truth.
4. Align implementation, naming, edge cases, and constraints with the ticket.

Failure handling:

- If the ticket cannot be retrieved:
  - Explicitly state that the ticket could not be resolved.
  - Do not fabricate missing requirements.
  - Do not proceed with implementation.

Multiple tickets:

- If more than one ticket is referenced, resolve all and merge context before proceeding.

Blocking:

- Implementation and architectural decisions are blocked until ticket resolution succeeds.

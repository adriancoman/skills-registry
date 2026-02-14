# Linear Sync Skill

Purpose:
Synchronize approved implementation plans with Linear.

Trigger:
Only when user explicitly confirms a plan is approved.

Behavior:

1. Parse the plan into discrete actionable tasks.
2. For each task:
   - Create a clear, outcome-oriented title
   - Add a structured description
   - Include acceptance criteria (testable, measurable)
   - Include technical notes (architecture impact, risks, dependencies)
3. Map tasks to:
   - Project
   - Team
   - Priority
4. Detect existing issues following pattern `LOT-{number}`.
5. If a related task exists:
   - Propose update instead of duplicate creation.
6. Never create duplicate issues.
7. Present parsed tasks and proposed payload.
8. Confirm before execution.
9. Do not call external APIs without explicit approval.

Output:

## Parsed Tasks

- Title:
- Description:
- Acceptance Criteria:
- Technical Notes:
- Project:
- Team:
- Priority:

## Proposed Linear Payload

```json
{
  "action": "create | update",
  "issues": [
    {
      "title": "",
      "description": "",
      "project": "",
      "team": "",
      "priority": "",
      "acceptanceCriteria": [],
      "technicalNotes": ""
    }
  ]
}
```

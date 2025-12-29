# MCP Server & Subagent Usage 🔧

## Repository purpose ✅
This repository contains examples and documentation for using the GitHub MCP server and invoking subagents to automate common workflows (issues, sub-issues, comments, and closing/reopening items).

---

## Prerequisites ⚠️
- A GitHub account with access to the target repository.
- A personal or automation token with minimal scopes required (e.g., `repo` for private repos, `public_repo` for public repos, `issues`). Do NOT grant more scopes than needed.
- Ensure tokens are stored securely (secrets manager / GitHub Actions secrets). Do not embed tokens in payloads or code.

---

## Quick start — Common MCP tasks 💡
Each example shows which MCP tool to call or which subagent payload to send.

1. Create an issue
```json
// Tool: mcp_io_github_git_issue_write
{
  "method": "create",
  "owner": "Z1-Test",
  "repo": "temp-dhruvil-st15",
  "title": "Example issue",
  "body": "Short description"
}
```

2. Add a sub-issue to a parent issue
```json
// Tool: mcp_io_github_git_sub_issue_write
{
  "method": "add",
  "issue_number": 12,
  "sub_issue_id": 345,
  "owner": "Z1-Test",
  "repo": "temp-dhruvil-st15"
}
```

3. Add a comment
```json
// Tool: mcp_io_github_git_add_issue_comment
{
  "owner": "Z1-Test",
  "repo": "temp-dhruvil-st15",
  "issue_number": 12,
  "body": "This is an automated comment"
}
```

4. Close an issue
```json
// Tool: mcp_io_github_git_issue_write
{
  "method": "update",
  "owner": "Z1-Test",
  "repo": "temp-dhruvil-st15",
  "issue_number": 12,
  "state": "closed",
  "state_reason": "completed"
}
```

---

## Example `runSubagent` payload (skeleton) 📤
This is a JSON skeleton used to invoke a subagent to close issues. Do not include secrets.

```json
{
  "name": "close-issues-subagent",
  "inputs": {
    "owner": "Z1-Test",
    "repo": "temp-dhruvil-st15",
    "issueNumbers": [12, 34],
    "reason": "automated-closure"
  },
  "options": {
    "dryRun": false
  }
}
```

---

## Safety & best practices 🛡️
- Principle of least privilege: use tokens with minimal scopes and rotate them regularly.
- Limit subagent permissions and scope to a single sandbox repo for testing before running against production.
- Use a `dryRun` or `preview` mode when available to see changes without committing them.
- Log and audit subagent actions; keep runs idempotent and reversible when possible.
- Re-run carefully: re-submit the `runSubagent` payload (ensure the inputs are correct). To revert changes made by a subagent, either reopen affected issues or create a revert PR for code changes.

> **Note:** Always test subagents on a sandbox repository before running against production data.

---

## Re-run & revert guidance 🔁
- Re-run: re-send the same `runSubagent` payload or trigger the subagent with adjusted inputs (use `dryRun` first).
- Revert: reopen closed issues via `mcp_io_github_git_issue_write` (set `state` to `open`), or create a revert PR for changed files.

---

## Contact / Maintainers 📫
- Open an issue in this repository for questions or support.
- Maintainers: GitHub team `@Z1-Test` (or create an issue to reach the maintainers).

---

## License
This repository is provided under the **MIT License**. See `LICENSE` for details.

# Claude Project Rules

## Version Control Discipline

- Before editing files, run `git status --short --branch` and identify any existing user or generated changes.
- After every logical file update, keep the change traceable in Git: review the diff, stage only the files intentionally changed, and commit before handing work back unless the user explicitly asks not to commit.
- Never leave new or modified source/config/content files untracked silently. If a file should not be committed, state why and leave it unstaged.
- Do not revert or overwrite unrelated user changes. If an unrelated dirty file blocks the task, stop and ask how to proceed.
- Use concise commit messages that describe the user-facing change, not generic labels like `updates` or `fixes`.

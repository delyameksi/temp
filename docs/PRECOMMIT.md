# Pre-commit Setup

This project uses [pre-commit](https://pre-commit.com/) to automate code quality checks and enforce message conventions before every Git commit (**Prettier**, **ESLint**, **Gitleaks**, and **Commitlint**).

---

## Quick Setup

### 1. Install Node.js Dependencies

Ensure all developer tools (Prettier, ESLint, Commitlint) are installed in the project:

```bash
npm install
```

---

### 2. Install `pre-commit` on your system

If `pre-commit` is not yet installed on your machine:

- **macOS (Homebrew):**
  ```bash
  brew install pre-commit
  ```
- **Linux / Windows / Python (Pip):**
  ```bash
  pip install pre-commit
  ```

---

### 3. Install `gitleaks` on your system

The secret scanner is a standalone binary, not an npm package, so it has to be
installed separately:

- **macOS (Homebrew):**
  ```bash
  brew install gitleaks
  ```
- **Linux / Windows:** download a release binary from
  [github.com/gitleaks/gitleaks/releases](https://github.com/gitleaks/gitleaks/releases).

Without it the `gitleaks` hook fails with a "command not found" error. CI runs
the same scan, so a missing local binary does not silently weaken the check.

---

### 4. Enable Git Hooks in the Repository

Activate both the `pre-commit` (code format/linting) and `commit-msg` (commit message validation) hooks:

```bash
pre-commit install
pre-commit install --hook-type commit-msg
```

> **Note:** You only need to run this command once after cloning the project.

---

## Usage & Workflows

### Automatic Execution

1. **Code Quality Checks (`pre-commit`)**:
   When running `git commit`, local npm binaries are triggered:
   - **Prettier**: Auto-formats files (`.json`, `.yaml`, `.js`, `.md`, etc.).
   - **ESLint**: Auto-fixes and validates JavaScript and TypeScript code.
   - **Gitleaks**: Scans the staged diff for credentials and blocks the commit
     if any is found. Findings are redacted, so the secret itself is never
     printed to the terminal.

   > _If Prettier formats any staged files during a commit, the hook will fail to notify you. Simply run `git add .` to stage the formatted files and rerun `git commit`._

2. **Commit Message Validation (`commit-msg`)**:
   Commit messages are validated against the [Conventional Commits](https://www.conventionalcommits.org/) specification using **Commitlint**.

   - **Valid format examples:**
     - `chore(git): setup pre-commit hooks`
     - `feat(auth): add user login endpoint`
     - `fix(api): correct payload validation response`

---

### Manual Execution

Trigger code checks across all repository files at any time without committing:

```bash
pre-commit run --all-files
```

---

## ⚙️ Configuration Files

- `.pre-commit-config.yaml` — Pre-commit hook configuration using local `npx` binaries.
- `.commitlintrc.json` — Commitlint rules (Conventional Commits configuration).
- `.prettierrc` — Prettier code formatting preferences.
- `.prettierignore` — Paths Prettier never touches (build output, vendored assets).
- `eslint.config.mjs` — ESLint flat config (rules, globals, ignored paths).

Gitleaks runs on its default ruleset; add a `.gitleaks.toml` only if a false
positive needs an allowlist entry.

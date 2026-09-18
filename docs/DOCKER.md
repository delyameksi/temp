# Docker

The image contains the application only. MySQL is wired up through Docker
Compose.

## Quick start

Persistence is MySQL-only, and the application exits at startup when it cannot
reach the database, so both passwords are required:

```bash
export MYSQL_ROOT_PASSWORD=... MYSQL_PASSWORD=...
docker compose up -d --build
open http://localhost:3000/api-docs
```

The schema in `database.sql` is applied automatically on the first start, while
the MySQL data directory is still empty. Data lives in the `mysql-data` named
volume; `docker compose down -v` drops it, and the schema is reapplied on the
next start.

## Environment

| Variable              | Default | Notes                                 |
| --------------------- | ------- | ------------------------------------- |
| `MYSQL_ROOT_PASSWORD` | —       | Required, used by the MySQL container |
| `MYSQL_PASSWORD`      | —       | Required, password of the app's user  |
| `MYSQL_USER`          | `todo`  | Created on first start                |
| `MYSQL_DB`            | `todos` | Must match the database in the schema |
| `APP_PORT`            | `3000`  | Host port the app is published on     |

## Building the image on its own

```bash
docker build --target runtime -t epitech-legacy-project:1.0.0 \
  --build-arg VERSION=1.0.0 \
  --build-arg VCS_REF=$(git rev-parse --short HEAD) \
  --build-arg BUILD_DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ) .
```

The image on its own is not runnable: without a reachable MySQL server the
process exits with code 1.

## Development with hot reload

```bash
docker build --target dev -t epitech-legacy-project:dev .
docker run --rm -it -p 3000:3000 -v "$PWD/src:/app/src" epitech-legacy-project:dev
```

## What the image guarantees

| Concern                   | Implementation                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| Small surface             | Multi-stage build: no devDependencies and no TypeScript sources in the final image               |
| Non-root                  | `USER node`; application code is owned by `root` and read-only                                   |
| Read-only root filesystem | `read_only: true` plus `tmpfs /tmp`; nothing is written to disk, persistence lives in MySQL      |
| Privileges                | `cap_drop: ALL`, `no-new-privileges`                                                             |
| Health check              | Request against `/api-docs/` using native `fetch` — no curl/wget shipped in the image            |
| Startup ordering          | `depends_on: service_healthy`, because `init()` only runs `SELECT 1` and does not wait for MySQL |
| Graceful shutdown         | Exec form: `node` runs as PID 1, receives SIGTERM and closes the pool (`src/index.ts`)           |
| Reproducibility           | Pinned base tag (`node:22.22.0-bookworm-slim`) plus `npm ci` against the lockfile                |
| Traceability              | OCI labels (`version`, `revision`, `created`)                                                    |

## Things to know

- `npm run build` (plain `tsc`) only emits JavaScript. The assets under
  `src/static` are copied explicitly to `dist/static` by the Dockerfile, because
  `src/index.ts` serves them from `__dirname + "/static"`. Running `npm start`
  outside Docker after a bare `npm run build` returns 404s for those files.
- The health check targets `/api-docs/` because it proves Express is serving
  without depending on MySQL. A dedicated `/health` route would be steadier, as
  it would not tie container health to the documentation UI.
- `sqlite3` is still declared in `package.json` but nothing imports it since the
  persistence layer became MySQL-only. Dropping it would remove a native module
  from the build and shrink the image.

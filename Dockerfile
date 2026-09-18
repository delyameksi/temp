# syntax=docker/dockerfile:1.9

ARG NODE_VERSION=22.22.0
ARG NODE_IMAGE=node:${NODE_VERSION}-bookworm-slim

# Base
FROM ${NODE_IMAGE} AS base
ENV NODE_ENV=production \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_AUDIT=false
WORKDIR /app

# Deps
FROM base AS deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --include=dev

# Build
FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build \
    && cp -R src/static dist/static \
    && node -e "const f=require('fs');f.accessSync('dist/index.js');f.accessSync('dist/static/index.html')"
RUN npm prune --omit=dev

# Dev (hot reaload)
FROM deps AS dev
ENV NODE_ENV=development
COPY tsconfig.json ./
COPY src ./src
RUN chown -R node:node /app
USER node
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Runtime (minimal, unprivileged)
FROM base AS runtime

# Redeclared: an ARG defined before the first FROM is only in scope for FROM
# instructions, so without this line ${NODE_IMAGE} expands to an empty string.
ARG NODE_IMAGE
ARG VERSION=1.0.0
ARG VCS_REF=unknown
ARG BUILD_DATE=unknown
LABEL org.opencontainers.image.title="epitech-legacy-project" \
      org.opencontainers.image.description="Todo app" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.base.name="${NODE_IMAGE}"

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api-docs/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]

# exec: node is PID 1 and receive SIGTERM/SIGINT only from index.ts to properly shutdown
CMD ["node", "dist/index.js"]

FROM node:22-alpine
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install native build deps required by Vite/Rollup on Alpine.
RUN apk add --no-cache python3 make g++

COPY . .
RUN pnpm install --frozen-lockfile

# Build all workspaces
RUN pnpm -w run build

# Copy the built frontend into a fixed location that the API server can serve.
RUN mkdir -p /app/public && cp -R /app/artifacts/special-message/dist/public/. /app/public/

CMD ["pnpm", "--filter", "./artifacts/api-server", "start"]

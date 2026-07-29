FROM node:22-alpine
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .
RUN pnpm install --frozen-lockfile

# Build all workspaces
RUN pnpm -w run build

CMD ["pnpm", "--filter", "./artifacts/api-server", "start"]

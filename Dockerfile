FROM node:22-bookworm-slim AS frontend-builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app/frontend

RUN corepack enable

COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY frontend/ ./
RUN pnpm build

FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/app/backend/.venv/bin:$PATH"

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY backend/ ./backend/
RUN cd backend && uv sync --frozen --no-dev

COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 8080

CMD ["sh", "-c", "gunicorn --chdir backend --bind :${PORT:-8080} 'app:create_app()'"]

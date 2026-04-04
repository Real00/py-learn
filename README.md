# Python Starter

一个面向零基础学习者的移动端 Python 学习网站。

## Frontend

- `cd frontend`
- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm test`

## Backend

- `cd backend`
- `uv sync --python 3.11`
- `uv run flask --app app:create_app run --debug`
- `uv run pytest`

生产环境下，先构建前端 `dist`，再启动 Flask。Flask 会直接托管 `frontend/dist`。

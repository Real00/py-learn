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

## Container Image Build

项目现在支持通过 Git tag 触发 GitHub Actions，构建单容器镜像并推送到 Docker Hub。

- 触发规则：推送 `v*` tag，例如 `v0.1.0`
- 镜像仓库：Docker Hub 公共仓库

### GitHub Repository Variables

在 GitHub 仓库的 `Settings -> Secrets and variables -> Actions -> Variables` 里配置：

- `DOCKERHUB_REPOSITORY`
  示例：`real00/python-learn`

### GitHub Repository Secrets

在 GitHub 仓库的 `Settings -> Secrets and variables -> Actions -> Secrets` 里配置：

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

### Build And Push

```bash
git tag v0.1.0
git push origin v0.1.0
```

workflow 会先登录 Docker Hub，然后把镜像推送为两个 tag：

- `${tag}`，例如 `v0.1.0`
- `latest`

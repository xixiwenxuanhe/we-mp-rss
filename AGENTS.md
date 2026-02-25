# Repository Guidelines

## Project Structure & Module Organization
- Backend API and business logic live at the repository root: `apis/`, `core/`, `jobs/`, `driver/`, and `web.py` (FastAPI entry).
- Frontend source is in `web_ui/` (Vue 3 + Vite). Built assets are copied into `static/` and served by backend.
- Docker and runtime assets: `Dockerfile`, `docker-compose.yml`, `docker-compose.dev.yml`, and `Dockerfiles/`.
- Utility scripts: `deploy.sh`, `restart.sh`, `install.sh`, and tools under `tools/`.
- Tests are currently script-style files at root and under modules (for example `test_article.py`, `test_ak_auth.py`, `core/lax/test_template_parser.py`).

## Build, Test, and Development Commands
- `bash web_ui/build.sh`: install frontend deps, build Vite app, and sync output to `static/`.
- `bash deploy.sh`: one-shot deploy flow (`web_ui` build + `docker compose build` + `docker compose up -d`).
- `docker compose up -d --build`: start standard environment.
- `docker compose -f docker-compose.dev.yml up -d`: start mounted-source dev environment.
- `bash restart.sh`: restart dev compose service quickly.
- `python main.py -job True -init True`: local non-container backend start.
- `python test_article.py` / `python test_ak_auth.py`: run existing script tests.

## Coding Style & Naming Conventions
- Python: 4-space indentation, `snake_case` for functions/modules, `PascalCase` for classes.
- Vue/TS: keep existing SFC patterns; component files use `PascalCase` (e.g., `ArticleListDesktop.vue`).
- Prefer small, targeted changes; avoid broad refactors in feature branches.
- Keep logs machine-readable where possible (project already uses structured final status logs).

## Testing Guidelines
- Add or update focused tests/scripts for changed behavior.
- Minimum before PR: frontend build succeeds (`bash web_ui/build.sh`) and affected backend path boots/runs.
- For crawling/refresh changes, include at least one success and one failure-path verification in logs.

## Commit & Pull Request Guidelines
- Use Angular-style Conventional Commits seen in history, e.g.:
  - `feat(article): add article refresh capability`
  - `fix(wxarticle): retry when WeChat verify page is detected`
- PRs should include: purpose, scope, key files changed, validation steps, and screenshots for UI changes.
- Rebase feature branch onto latest `main` before merge when team policy requires linear history.

## Security & Configuration Tips
- Do not commit secrets; use `config.example.yaml` as template.
- Set runtime env vars in compose files (not Dockerfile) for deploy-specific settings.

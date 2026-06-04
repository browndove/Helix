# Helix Pre-Onboarding API (FastAPI + PostgreSQL)

Backend for the facility **on-boarding** portal and **admin** dashboard.

## Setup

```bash
cd backend
python3.11 -m venv .venv          # use 3.11 — 3.14 may fail on psycopg2
source .venv/bin/activate         # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env — set DATABASE_URL, SECRET_KEY, ADMIN_PASSWORD (never commit .env)
```

Start the server **with the venv** (not system `python` / `uvicorn`):

```bash
./run.sh
# or:
.venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs

## Environment

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon/Postgres URL (`postgresql://...?sslmode=require`) |
| `SECRET_KEY` | JWT signing secret |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin login |
| `CORS_ORIGINS` | Comma-separated frontend origins |
| `UPLOAD_DIR` | Local folder for CSV/Excel uploads (default `uploads`) |

## API overview

### Onboarding (public)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/onboarding/submissions` | Create draft |
| `GET` | `/api/v1/onboarding/submissions/{id}` | Get submission |
| `PATCH` | `/api/v1/onboarding/submissions/{id}` | Update answers / phase |
| `PUT` | `/api/v1/onboarding/submissions/{id}` | Replace full payload |
| `POST` | `/api/v1/onboarding/submissions/{id}/submit` | Validate & submit (status → `pending`) |
| `POST` | `/api/v1/onboarding/submissions/import` | Import full portal JSON in one shot |
| `POST` | `/api/v1/onboarding/submissions/{id}/files/{upload_key}` | Upload file (`departments`, `units`, `staff`, `roles`, `patients`) |
| `DELETE` | `/api/v1/onboarding/submissions/{id}/files/{upload_key}` | Remove file |

### Admin (Bearer JWT)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/admin/auth/login` | `{ email, password }` → token |
| `GET` | `/api/v1/admin/stats` | Dashboard counts |
| `GET` | `/api/v1/admin/submissions` | List + filters (`search`, `status`, `region`, `facility_type`, `date_from`, `date_to`, `sort`, `order`, `page`, `per_page`) |
| `GET` | `/api/v1/admin/submissions/{id}` | Detail drawer payload |
| `PATCH` | `/api/v1/admin/submissions/{id}/status` | `{ status: pending\|approved\|rejected\|incomplete }` |
| `GET` | `/api/v1/admin/submissions/{id}/files/{upload_key}/download` | Download attachment |

## Frontend configuration

Set the API base before loading scripts:

```html
<script>window.HELIX_API_BASE = "http://localhost:8000/api/v1";</script>
```

- On-boarding: `on-boarding/assets/api-client.js` (wired in `index.html`)
- Admin: `admin/api.js` (wired in `index.html`)

If `HELIX_API_BASE` is unset, both UIs keep working offline with local/mock behaviour.

## Database

Tables are created automatically on startup (`submissions`, `submission_files`). For production migrations, use Alembic (included in requirements).

## Security notes

- Do **not** commit `.env` or database credentials.
- Rotate any credentials that were shared in chat.
- Restrict CORS origins in production.
- Use a strong `SECRET_KEY` and bcrypt-hashed `ADMIN_PASSWORD` for production admin accounts.

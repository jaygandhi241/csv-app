CSV App

Full-stack CSV upload and processing app (Node.js + React + Postgres) with Docker
Quick start

1. Copy envs (optional – defaults work with docker-compose):
```
cp backend/.env.example backend/.env
```
2. Build and run:
```
docker compose up -d --build
```
3. Open: http://localhost

API available under `/api/*`.

Development

- Backend dev: `npm run dev` in `backend/`
- Frontend dev: `npm run dev` in `frontend/` (set `VITE_API_URL=http://localhost:4000/api`)

Auth

- Register: `POST /api/auth/register` { name, email, password }
- Login: `POST /api/auth/login` { email, password }
- Use `Authorization: Bearer <token>` for protected routes.

CSV

- Upload: `POST /api/upload` form-data with field `file` (.csv, <=10MB)
- List: `GET /api/records?q=&page=&limit=`
- Download: `GET /api/records/download?q=` returns CSV

Health

- `GET /api/health` returns uptime and DB status




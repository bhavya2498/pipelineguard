# PipelineGuard

A MERN full-stack pipeline monitoring prototype: simulated sensor data flows into a rule-based
health/risk engine, which drives a live dashboard, alerts, inspections, maintenance prioritization,
and a "what-if" risk simulator with history.

## Stack
- **Frontend:** React (Vite) + React Router + Axios
- **Backend:** Node.js + Express
- **Database:** MongoDB (Atlas or local) via Mongoose

## Project structure
```
pipelineguard/
  backend/     Express API, Mongoose models, health/risk engine, seed script
  frontend/    React app (Vite)
```

## Setup

### 1. Database
Use a free MongoDB Atlas cluster, or run MongoDB locally.

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI
npm run seed            # loads sample pipelines + monitoring readings
npm run dev              # starts the API on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev              # starts the app on http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to `http://localhost:5000`, so no CORS
configuration is needed in development.

## API overview
| Method | Endpoint | Purpose |
|---|---|---|
| GET/POST | `/api/pipelines` | List / create pipelines |
| PUT/DELETE | `/api/pipelines/:id` | Update / delete a pipeline |
| GET/POST | `/api/monitoring` | List readings / submit a reading (auto-computes health & risk, raises alerts) |
| GET/PATCH | `/api/alerts` | List alerts / acknowledge or resolve one |
| GET/POST | `/api/inspections` | List / log inspections |
| GET/POST/PATCH | `/api/maintenance` | List / create (auto-priority) / update status |
| POST | `/api/simulation` | Run the risk simulator on hypothetical values |
| GET | `/api/simulations` | Simulation history |
| POST | `/api/users/register`, `/api/users/login` | Prototype-only auth (no hashing/JWT yet) |

## Health & risk engine
See `backend/services/healthEngine.js`. Each parameter (pressure, flow, temperature, vibration,
corrosion) has a configurable safe/critical range and weight; risk is a weighted sum, and
`healthScore = 100 - risk`. These thresholds are prototype defaults — tune them in one place.

## Notes / what's intentionally out of scope
- No physical sensors, PLC, or SCADA integration — all monitoring data is simulated or manually entered.
- Login uses plain-text password comparison; replace with bcrypt + JWT before any real deployment.
- No test suite yet — recommend adding one before extending the health engine further.

## Suggested next steps
1. `npm install` in both folders, add your `MONGO_URI`, run `npm run seed`, then `npm run dev` in both.
2. Open http://localhost:5173 — Dashboard should show the 3 seeded pipelines and their segment health.
3. Try the Risk Simulator with high vibration/corrosion values to see CRITICAL risk + a recommendation.
4. Submit a real monitoring reading above a threshold (e.g. vibration > 60) and confirm an alert appears.

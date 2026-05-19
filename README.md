# Flight Booking Pricing System — Modular Monolith

Production-style assessment solution using Node.js, Vue 3, MySQL, Redis, RabbitMQ and Docker.

## Run

```bash
docker compose up --build
```

URLs:
- Frontend: http://localhost:5173
- Backend health: http://localhost:5000/api/health
- RabbitMQ UI: http://localhost:15672 (guest / guest)
- MySQL: localhost:3307, database `flight_booking`

## Demo login

Register from UI or use seed user:

```txt
admin@example.com
Password123!
```

## Key points for interview

- Modular monolith: auth, flight search, pricing config, discount/coupon, SVG export modules.
- Backend-only supplier API calls.
- Backend-only markup, commission, and discount calculation.
- Frontend never receives raw supplier fare fields.
- Redis cache for cities, airlines, supplier search and config.
- RabbitMQ for background audit/export events.
- MySQL repository pattern.
- SVG placeholder editing and PNG generation through backend.

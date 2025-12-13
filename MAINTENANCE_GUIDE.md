
# Maintenance & Update Guide

## 1. Modular Architecture
This system is compartmentalized into:
- **Backend (Node.js)**: API, Webhook, Database Logic.
- **Frontend (Angular)**: UI, Dashboard, PWA.
- **Database (Firestore)**: NoSQL Data Storage.

## 2. How to Update Backend
- **Location:** `backend/src/`
- **Services:** Logic is in `services/`.
  - `salesMatcherService.js`: Logic for matching waitlist.
  - `orderProcessorService.js`: Logic for creating codes.
  - `security/masterKeyService.js`: Logic for hourly keys.
- **Routes:** API endpoints are in `routes/api.js`.
- **Controllers:** Request handling in `controllers/`.
- **Action:**
  1. Modify the specific service.
  2. Run tests: `node tests/unit/test_sales_matcher.js`
  3. Deploy backend.

## 3. How to Update Frontend
- **Location:** `frontend/src/app/`
- **Components:** Views are in `components/`.
  - `dashboard`: Main layout.
  - `access-list`: Table of codes.
- **Services:** API calls are in `services/api.service.ts`.
- **Action:**
  1. Modify component or style.
  2. Run `ng build`.
  3. Deploy static files.

## 4. Troubleshooting
- **Logs:** Check backend console logs (`pm2 logs` or Docker logs).
- **Security:** If "Unauthorized" errors occur, check `authMiddleware.js` and ensure Firebase token is being sent from frontend.

## 5. Scaling
- **Database:** Firestore scales automatically.
- **Backend:** Stateless. Can run on multiple servers/containers behind a load balancer.

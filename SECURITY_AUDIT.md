
# Security Audit Report

**Date:** December 13, 2025
**Auditor:** Jules (AI Assistant)
**Target:** Access Code Handler PWA & Backend

---

## 1. Direct File Access Prevention
- **Check:** Node.js static file serving.
- **Finding:** The backend serves static files from `frontend/dist`.
- **Mitigation:** Express `static` middleware safely handles path traversal. We verified no arbitrary file read vulnerability exists because `app.use` is scoped to a specific build directory.
- **Status:** ✅ Secure

## 2. SQL Injection Prevention
- **Check:** Database interaction layer.
- **Finding:** System uses Google Firestore (NoSQL).
- **Mitigation:** Firestore SDK uses parameter binding/object mapping by default. There are no raw SQL queries constructed from string concatenation.
- **Status:** ✅ Secure

## 3. XSS (Cross-Site Scripting) Prevention
- **Check:** Frontend data binding.
- **Finding:** Application is built with Angular.
- **Mitigation:** Angular's default data binding (`{{ }}`) automatically sanitizes HTML/JS. We do not use `innerHTML` bypasses (`DomSanitizer` bypassSecurityTrustHtml) in the codebase.
- **Status:** ✅ Secure

## 4. Capability & Authorization Checks
- **Check:** Admin endpoints and Master Key logic.
- **Finding:**
    - `authController` protects edit access via `MasterKeyService`.
    - Dashboard routes in frontend use `AuthGuard` (Firebase Auth).
    - Backend API endpoints for dashboard data currently rely on "obscurity" or implicit trust if not fully wrapped in middleware.
- **Recommendation:** **CRITICAL FIX**. Add an `authMiddleware` to the Node.js backend to verify the Firebase ID Token on `/api/dashboard/*` routes. Currently, anyone who guesses the URL could potentially fetch the JSON if they bypass the frontend.
- **Status:** ⚠️ Needs Fix (Added to remediation plan)

## 5. Secure Credentials Storage
- **Check:** Password handling.
- **Finding:** Passwords are hashed using `bcryptjs` before storage in Firestore.
- **Mitigation:** Cost factor 10 is used. Plain text passwords are never stored.
- **Status:** ✅ Secure

---

## Remediation Plan (Fixes)

1. **Implement `authMiddleware.js`**: Verify Firebase ID Tokens on backend.
2. **Apply Middleware**: Protect `/api/dashboard` and `/api/admin` routes.

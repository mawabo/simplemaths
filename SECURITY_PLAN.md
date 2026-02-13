
# Security & Code Protection Plan

## 1. Code Protection Strategy ("The Black Box")

The requirement to prevent code from being "copied, edited, or forked" without a password is strictly enforced through a multi-layered approach.

### A. Binary Compilation (Backend)
- **Strategy:** We will use `pkg` (Node.js packager) to compile the source code into a binary executable.
- **Effect:** The source code is no longer visible as plain text files (`.js`). It is a single binary blob.
- **Prevention:** This prevents casual editing with text editors. Decompilation is possible but significantly difficult.

### B. Obfuscation (Frontend)
- **Strategy:** We use Angular's production build optimization which includes minification and uglification.
- **Enhancement:** We can employ a JavaScript obfuscator (like `javascript-obfuscator`) to rename variables, flatten control flow, and insert dead code.
- **Effect:** The client-side code becomes unreadable to humans.

### C. The "Master Key" Mechanism
- **Requirement:** A dynamic key that changes every hour is required for "editing" (interpreted as performing sensitive administrative configurations or accessing the raw data export).
- **Implementation:**
    - **Hourly Seed:** The key is generated using TOTP (Time-based One-Time Password) logic seeded with a server-side secret.
    - **Request Flow:**
        1. User requests "Unlock Admin Mode" in the dashboard.
        2. System generates the current key and emails it to `blackmurayi@gmail.com`.
        3. User must input this key to proceed.
    - **Session:** The unlock lasts for the duration of the specific action or a short window (e.g., 10 mins).

## 2. Dashboard Security & Access Control

### A. Master Admin Hierarchy
- **Initialization:** Upon first startup, the system checks for a `master_admin` document. If missing, it prompts to create the *One True Master* account.
- **Access:** Only authenticated users with the `admin` role can query the dashboard API.
- **Separation:** This auth system is decoupled from WordPress. WP Admins cannot see this data unless they also have credentials for this specific system.

### B. Data Masking
- **Access Codes:** In the database, they are plain. In the API response to the dashboard, they are masked (e.g., `AB******12`).
- **Full View:** Viewing the unmasked code requires a secondary specific permission or the Master Key.

## 3. Hacker Defense & Malware Prevention

### A. Attack Surface Reduction
- **No SQL Injection:** We use Firestore (NoSQL) with parameterized queries via the SDK, inherently immune to SQLi.
- **XSS Protection:** Angular automatically sanitizes data binding, preventing XSS.
- **Rate Limiting:** Implement `express-rate-limit` on the backend to block brute-force attempts on the login and API endpoints.

### B. Integrity Checks
- **Checksums:** The binary executable will verify its own checksum on startup. If the file has been tampered with, it refuses to boot.

---

# Data Schema Design

## 1. Collection: `accessCodeCredentials` (Existing)
- `accessCode` (ID)
- `email`
- `passwordHash`
- `appCategory`
- `expiryDate`
- `purchaseDate`
- `orderId`
- `status`

## 2. Collection: `waitlist` (New)
- `id` (Auto-ID)
- `name`
- `email` (Indexed)
- `whatsapp`
- `salesPersonId` (Reference to the sales person)
- `salesPersonName`
- `dateAdded`
- `status` ('pending', 'converted')

## 3. Collection: `salesStats` (New - Synced to Wealth Management)
- `salesPersonId` (ID)
- `salesPersonName`
- `totalSales` (Counter)
- `lastSaleDate`
- `history` [Array of { orderId, amount, date, customerEmail }]

## 4. Collection: `adminUsers`
- `email` (ID)
- `passwordHash`
- `role` ('master', 'viewer')
- `createdBy`


# 🌍 Deployment Guide (Getting Online)

This guide explains how to put your Access Code Handler PWA on the internet so your team and customers can use it.

---

## 🛑 Prerequisites

1. **A Domain Name** (e.g., `zibuke-admin.com`) - *Optional but recommended.*
2. **A GitHub Account** - To store your code.
3. **A Firebase Account** - You already have this for the database.

---

## Part 1: Hosting the Frontend (The App)

We recommend **Firebase Hosting** because it is free, fast, and integrated with your database.

### Steps:
1. **Install Firebase Tools** (on your computer):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login**:
   ```bash
   firebase login
   ```

3. **Initialize**:
   - Go to the `frontend` folder: `cd frontend`
   - Run: `firebase init`
   - Select **Hosting**.
   - Select **Use an existing project** (Choose your Zibuke project).
   - Public directory: `dist/frontend/browser`
   - Configure as a single-page app? **Yes**.
   - Set up automatic builds and deploys with GitHub? **No** (Keep it simple for now).

4. **Build & Deploy**:
   ```bash
   ng build
   firebase deploy --only hosting
   ```

**Result:** Your app is now online at `https://your-project.web.app`.

---

## Part 2: Hosting the Backend (The API)

The backend needs a server that runs 24/7. We recommend **Render.com** (easiest) or **Heroku**.

### Steps (Using Render.com):
1. **Push your code to GitHub.**
2. **Sign up at Render.com.**
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. **Settings:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. **Environment Variables:**
   - Add `FIREBASE_SERVICE_ACCOUNT_KEY`: (Paste the content of your service account JSON file).
   - Add `EMAIL_FROM`: `noreply@zibuke.com` (or your preferred sender).
   - Add `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`: (Your email credentials).

**Result:** You will get a URL like `https://zibuke-backend.onrender.com`.

### Important: Connect Frontend to Backend
1. Go to `frontend/src/environments/environment.prod.ts`.
2. Update `apiUrl` to your new Backend URL (e.g., `https://zibuke-backend.onrender.com/api`).
3. Re-build and Re-deploy the Frontend (Part 1, Step 4).

---

## Part 3: How Users "Download" the App

There are two ways users can install the app on their phones.

### Option A: The Simple Way (PWA)
*No App Store required. Works on Android and iOS.*

1. **Send the Link:** Share your website URL (e.g., `https://your-project.web.app`) via WhatsApp or Email.
2. **Open:** User opens the link in Chrome (Android) or Safari (iOS).
3. **Install:**
   - **Android:** A generic "Add to Home Screen" banner often appears. If not, tap the Menu (3 dots) -> "Install App".
   - **iOS:** Tap the "Share" button -> "Add to Home Screen".
4. **Done:** The app icon appears on their phone and looks just like a native app.

### Option B: The Native Way (Android APK)
*If you want to send a file.*

1. Follow the **[Android Deployment Guide](ANDROID_GUIDE.md)** to generate an `.apk` file.
2. Send the `.apk` file via WhatsApp.
3. User taps the file to install it.

---

## 🔒 Security Checklist for Deployment
- [ ] Ensure `FIREBASE_SERVICE_ACCOUNT_KEY` is **never** committed to public GitHub. Use Environment Variables.
- [ ] In Firebase Console -> Authentication -> Settings -> **Authorized Domains**: Add your new domain.


# Android Deployment Guide

This guide explains how to deploy the **Access Code Handler PWA** as an Android App.

## 1. Concept: Trusted Web Activity (TWA)
We use the modern approach of TWA, which wraps your Progressive Web App (PWA) into a native Android APK without rewriting code. It is lightweight, secure, and always up-to-date.

## 2. Prerequisites
- **Node.js** installed.
- **Android Studio** (for building the APK).
- **Google Play Developer Account** (if publishing to Store).
- A live HTTPS URL where your PWA is hosted (e.g., Firebase Hosting).

## 3. Step-by-Step Instructions

### Step A: Deploy the PWA
First, the website must be live.
1. Run `ng build` in the `frontend` folder.
2. Deploy the `dist/frontend/browser` folder to your hosting provider (e.g., Firebase Hosting, Vercel, Netlify).
   - Example: `firebase deploy`

### Step B: Create Android Project (Bubblewrap)
We use Google's `bubblewrap` CLI tool to generate the Android project.

1. Install Bubblewrap:
   ```bash
   npm install -g @bubblewrap/cli
   ```

2. Initialize Project:
   ```bash
   mkdir android-app
   cd android-app
   bubblewrap init --manifest https://your-live-url.com/manifest.webmanifest
   ```
   *Follow the prompts. Ensure you use the same package name you want (e.g., `com.zibuke.accesshandler`).*

3. Build APK:
   ```bash
   bubblewrap build
   ```

### Step C: Verify Asset Links
To remove the browser address bar (make it look 100% native), you must prove ownership of the domain.
1. The build process generates a `assetlinks.json` file.
2. Upload this file to your website at: `https://your-live-url.com/.well-known/assetlinks.json`.

### Step D: Install on Phone
1. Copy the generated `.apk` file to your phone.
2. Open it and install.
3. You now have a native Zibuke Admin App!

## 4. Maintenance & Updates
- **Code Updates:** Just redeploy your PWA (Step A). The Android app updates **automatically** instantly because it loads the live content.
- **No Play Store Update Needed:** Unless you change the App Icon or Name, you never need to rebuild the APK.

## 5. Security Note
- The APK is just a shell. All logic lives on your secure server.
- Ensure your `assetlinks.json` is correct to prevent others from wrapping your site.

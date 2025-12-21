# 🚀 Quick Start Guide - Sugaries Mobile App

## Step-by-Step Setup (5 minutes)

### 1. Install Dependencies

Open PowerShell in the `mobile` folder and run:

```powershell
cd mobile
npm install
```

### 2. Configure Your Backend URL

Edit `mobile/app.json` and find this section:

```json
"extra": {
  "apiUrl": "https://your-api-url.com"
}
```

Replace with your actual backend URL:
- **Production**: Your Vercel URL (e.g., `https://sugaries.vercel.app`)
- **Local Dev**: Your computer's IP (e.g., `http://192.168.1.100:3000`)

To find your IP address:
```powershell
ipconfig
# Look for "IPv4 Address" under your active network
```

### 3. Start the App

```powershell
npm start
```

You'll see a QR code in the terminal.

### 4. Test on Your Phone

**Option A: Use Expo Go (Fastest)**
1. Install "Expo Go" from App Store (iOS) or Play Store (Android)
2. Open Expo Go
3. Scan the QR code from step 3
4. App loads instantly!

**Option B: Use Simulator/Emulator**
```powershell
# iOS (Mac only)
npm run ios

# Android
npm run android
```

## Testing the App

### Test Authentication
1. Open the app → you'll see sign in screen
2. Tap "Don't have an account? Sign up"
3. Create an account
4. Complete onboarding

### Test Letter Viewing
1. Get a letter code from your web app
2. Open letter URL: `sugaries://letter/ABC123`
3. Confirm your name
4. Tap envelope to open
5. Enter PIN if required

### Test Letter Composition
1. From home screen, tap "✨ Compose Letter"
2. Fill in sender name, recipient, message
3. Optional: Add 4-digit PIN
4. Choose envelope color
5. Tap "Send Letter ✨"
6. Share the code!

## Building for Production

### One-Time Setup

```powershell
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo account (create one at expo.dev if needed)
eas login

# Configure project
eas build:configure
```

### Build Android APK

```powershell
npm run build:android
```

This creates an APK you can install on Android devices.

### Build iOS App

```powershell
npm run build:ios
```

Note: Requires Apple Developer account ($99/year).

## Common Issues & Fixes

### "Cannot connect to server"
- ✅ Check API URL in `app.json`
- ✅ Make sure backend is running
- ✅ Try using IP address instead of localhost

### "Module not found"
```powershell
rm -r node_modules
npm install
```

### Metro bundler stuck
```powershell
npm start -- --clear
```

### "Unable to resolve module"
```powershell
# Restart with clean cache
npm start -- --reset-cache
```

## What's Included

✅ Complete authentication system
✅ Letter viewing with animations
✅ PIN protection
✅ Letter composition
✅ User profile
✅ Haptic feedback
✅ Smooth animations
✅ Secure storage
✅ Offline support

## File Structure

```
mobile/
├── app/              # All screens (Expo Router)
├── src/
│   ├── components/   # Reusable UI components
│   ├── contexts/     # Auth & state management
│   ├── services/     # API calls
│   └── utils/        # Helper functions
├── app.json          # Configuration
└── package.json      # Dependencies
```

## Next Steps

1. **Customize assets**:
   - Replace `assets/icon.png` with your app icon (1024x1024)
   - Replace `assets/splash.png` with splash screen
   - Run `npx expo prebuild --clean`

2. **Add app to stores**:
   - Configure bundle IDs in `app.json`
   - Create store listings
   - Submit for review

3. **Add features**:
   - Push notifications for new letters
   - Camera for adding photos
   - Share functionality
   - Analytics

## Resources

- 📚 [Expo Docs](https://docs.expo.dev)
- 📱 [React Native Docs](https://reactnative.dev)
- 🏗️ [EAS Build](https://docs.expo.dev/build/introduction/)
- 🍎 [App Store Connect](https://appstoreconnect.apple.com)
- 🤖 [Google Play Console](https://play.google.com/console)

## Getting Help

1. Check `MOBILE_CONVERSION.md` for detailed info
2. Review `mobile/README.md` for full documentation
3. Check Expo documentation
4. Review console logs for errors

---

**You're all set! 🎉**

Your Sugaries app is now available on mobile. Start it with `npm start` in the mobile folder!

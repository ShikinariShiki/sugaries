```
   🍬 SUGARIES MOBILE APP 📱
   
   Your web app is now mobile!
   Built with React Native + Expo
```

# Quick Start

```powershell
npm install
npm start
```

Scan QR code with Expo Go app on your phone!

---

## 📚 Full Documentation

All documentation is in the **root folder**:

- **[START_HERE.md](../START_HERE.md)** ← Read this first!
- **[MOBILE_QUICKSTART.md](../MOBILE_QUICKSTART.md)** - 5 min guide
- **[MOBILE_DOCS_INDEX.md](../MOBILE_DOCS_INDEX.md)** - All docs index

---

## ✨ What's Included

✅ Sign in / Sign up
✅ Letter viewing with PIN
✅ Letter composition  
✅ Haptic feedback
✅ Native animations
✅ Offline support

---

## 🚀 Commands

```powershell
npm start              # Start dev server
npm run ios           # Run on iOS simulator
npm run android       # Run on Android emulator
npm run build:android # Build for Android
npm run build:ios     # Build for iOS
```

---

## 📁 Structure

```
app/               ← All screens
src/
  components/      ← UI components
  contexts/        ← State management
  services/        ← API calls
  utils/           ← Utilities
app.json          ← Configuration
```

---

## ⚙️ Configuration

Edit `app.json` to set your backend URL:

```json
"extra": {
  "apiUrl": "https://your-backend.vercel.app"
}
```

---

## 🆘 Troubleshooting

**Can't connect to server?**
- Check API URL in `app.json`
- Make sure backend is running

**Module not found?**
```powershell
rm -r node_modules
npm install
```

**Metro bundler stuck?**
```powershell
npm start -- --clear
```

---

## 📖 Learn More

- [Expo Docs](https://docs.expo.dev)
- [React Native](https://reactnative.dev)
- [Project Docs](../MOBILE_DOCS_INDEX.md)

---

**Made with 🍬 for Sugaries**

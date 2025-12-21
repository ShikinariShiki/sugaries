# 🚀 Build APK - Step by Step

## Ini NATIVE APP, bukan webview! 💪

Native Android app pakai React Native:
- ✅ UI Native (bukan HTML)
- ✅ Performance Native (60fps)
- ✅ Animasi Native
- ✅ Akses ke semua fitur Android

## Quick Build APK

### 1. Install EAS CLI (kalau belum)
```powershell
npm install -g eas-cli
```

### 2. Login/Buat Akun Expo
```powershell
eas login
```

Kalau belum punya akun:
1. Buka https://expo.dev
2. Sign up gratis
3. Balik ke terminal, login

### 3. Build APK!
```powershell
# Build APK untuk testing (GRATIS!)
eas build --platform android --profile preview

# Atau build production
eas build --platform android --profile production
```

### 4. Download & Install
- Build selesai (~15 menit)
- Download APK dari link yang dikasih
- Transfer ke HP Android
- Install!

## Cara Cepat: Local Build (No Internet Needed)

Kalau mau build lokal tanpa upload ke cloud:

### 1. Install Android Studio
Download dari: https://developer.android.com/studio

### 2. Setup Android SDK
Di Android Studio:
- Tools → SDK Manager
- Install Android SDK (API 33 atau 34)

### 3. Build dengan Expo
```powershell
# Generate android folder
npx expo prebuild --platform android

# Build APK
cd android
.\gradlew assembleRelease

# APK ada di: android\app\build\outputs\apk\release\app-release.apk
```

## Verifikasi: Ini Native, Bukan Webview!

Cek di kode:
1. Buka `mobile/src/components/Button.tsx`
   - Pakai `TouchableOpacity` (native)
   - Bukan `<button>` HTML!

2. Buka `mobile/app/(app)/home.tsx`
   - Pakai `View`, `Text`, `ScrollView` (native)
   - Bukan `<div>`, `<p>`, `<scroll>` HTML!

3. Animasi pakai `react-native-reanimated`
   - Native animations, 60fps
   - Bukan CSS animations!

## Apa Bedanya dengan Webview?

| Feature | Native (Ini!) | Webview |
|---------|---------------|---------|
| UI | Native components | HTML/CSS |
| Performance | 60fps smooth | Kadang lag |
| Akses hardware | Full access | Limited |
| Animasi | Native thread | JavaScript thread |
| Offline | Full support | Limited |
| Size | ~20-30MB | ~5-10MB |

## Next Steps

```powershell
# 1. Login ke Expo
eas login

# 2. Build APK
eas build -p android --profile preview

# 3. Download & install di HP!
```

---

**Ini 100% native Android app!** 🔥

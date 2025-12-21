# 📱 Sugaries Mobile App

A React Native mobile app built with Expo for the Sugaries digital stationery platform.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app on your phone (for development)
- iOS Simulator (Mac only) or Android Emulator

### Installation

1. **Navigate to the mobile directory**:
   ```bash
   cd mobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure the API URL**:
   Edit `app.json` and update the `extra.apiUrl` field:
   ```json
   {
     "extra": {
       "apiUrl": "https://your-backend-url.com"
     }
   }
   ```

   For local development, the app will automatically use `http://localhost:3000`.

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Run on your device**:
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `i` for iOS simulator or `a` for Android emulator

## 📱 Features

- ✅ User authentication (sign in/sign up)
- ✅ Onboarding flow
- ✅ View received letters
- ✅ Compose and send new letters
- ✅ PIN-protected letters
- ✅ Envelope opening animations
- ✅ Haptic feedback
- ✅ Music player integration
- ✅ Image picker for attachments
- ✅ Offline-first architecture with secure storage

## 🏗️ Project Structure

```
mobile/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication screens
│   ├── (app)/             # Main app screens
│   ├── letter/            # Letter viewing
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Entry point
├── src/
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts (Auth, Music)
│   ├── services/          # API integration
│   ├── utils/             # Utility functions
│   └── config/            # Configuration
├── assets/                # Images, fonts, etc.
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── eas.json              # Build configuration
```

## 🔧 Development

### Running on Different Platforms

```bash
# iOS
npm run ios

# Android
npm run android

# Web (for testing)
npm run web
```

### Testing with Your Backend

1. Make sure your Next.js backend is running
2. Update the API URL in `src/config/environment.ts`
3. For local testing on a physical device, use your computer's IP address:
   ```typescript
   apiUrl: 'http://192.168.1.100:3000'
   ```

## 📦 Building for Production

### Setup EAS Build

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure your project**:
   ```bash
   eas build:configure
   ```

### Build for iOS

```bash
npm run build:ios
```

### Build for Android

```bash
npm run build:android
```

### Submit to App Stores

```bash
# iOS
npm run submit:ios

# Android
npm run submit:android
```

## 🎨 Customization

### Colors

Edit the color constants in your components or create a theme file:
- Primary: `#ffc1e3` (Pink)
- Secondary: `#c4e7ff` (Blue)
- Background: `#fdfbf7` (Warm Rice Paper)

### Fonts

Add custom fonts to `assets/fonts/` and load them in `app/_layout.tsx`.

### Icons and Splash Screen

1. Replace images in `assets/`:
   - `icon.png` - App icon (1024x1024)
   - `splash.png` - Splash screen
   - `adaptive-icon.png` - Android adaptive icon

2. Regenerate assets:
   ```bash
   npx expo prebuild --clean
   ```

## 🔐 Environment Variables

Create a `.env` file in the mobile directory:

```env
API_URL=https://your-api-url.com
```

## 📚 Key Libraries

- **Expo Router** - File-based routing
- **React Native Reanimated** - Animations
- **Expo Secure Store** - Encrypted local storage
- **Expo Haptics** - Touch feedback
- **Expo AV** - Audio/video playback
- **Expo Image Picker** - Image selection
- **Axios** - HTTP client

## 🐛 Troubleshooting

### Metro bundler issues
```bash
npx expo start --clear
```

### iOS build issues
```bash
cd ios && pod install && cd ..
```

### Android build issues
```bash
cd android && ./gradlew clean && cd ..
```

### Reset cache
```bash
npm start -- --reset-cache
```

## 📱 App Store Submission Checklist

- [ ] Update version in `app.json`
- [ ] Add app privacy policy URL
- [ ] Add app terms of service URL
- [ ] Create app screenshots (required sizes)
- [ ] Write app description
- [ ] Add app preview video (optional)
- [ ] Configure app store keywords
- [ ] Test on multiple devices
- [ ] Run production build
- [ ] Submit for review

## 🤝 Backend Integration

This app connects to the Sugaries Next.js backend. Required API endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/onboarding` - Complete onboarding
- `GET /api/letter/:code` - Get letter by code
- `POST /api/letter/:code/verify` - Verify PIN
- `POST /api/letter` - Create new letter
- `GET /api/letter/my-letters` - Get user's letters
- `POST /api/upload` - Upload images

## 📄 License

Same as the main Sugaries project.

## 🎉 Next Steps

1. Install dependencies: `npm install`
2. Configure API URL in `app.json`
3. Start development server: `npm start`
4. Build and deploy when ready!

Happy coding! 🍬

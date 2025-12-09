# Google OAuth Setup Guide

## Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - For local: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://your-domain.com/api/auth/callback/google`
7. Copy the Client ID and Client Secret

## Environment Variables

Add these to your `.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID="your-client-id-here"
GOOGLE_CLIENT_SECRET="your-client-secret-here"

# NextAuth
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"  # Change to production URL when deploying
```

To generate a secure NEXTAUTH_SECRET, run:
```bash
openssl rand -base64 32
```

## Admin Accounts

These emails are automatically granted admin privileges:
- natkevin143@gmail.com
- theseproyt@gmail.com

All other users will have regular user access.

## Features

✅ **Delete optimization**: Instant UI updates with optimistic rendering
✅ **Google Sign-In**: One-click authentication
✅ **Role-based access**: 
  - Admins see ALL letters from all users
  - Regular users see only their own letters
✅ **Protected routes**: Middleware automatically redirects unauthorized users
✅ **Session management**: Logout from TopBar profile menu

## Testing Locally

1. Set up Google OAuth credentials
2. Add credentials to `.env`
3. Run `npm run dev`
4. Visit `http://localhost:3000/auth/signin`
5. Sign in with Google
6. If using admin email, you'll be redirected to `/admin/dashboard`
7. If regular user, you'll stay on home page with limited access

## Deployment Notes

- Update `NEXTAUTH_URL` in production `.env`
- Add production callback URL to Google OAuth settings
- Database migrations already applied with `prisma migrate`

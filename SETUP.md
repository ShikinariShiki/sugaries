# 🚀 Setup Guide for Sugar Cubes

## Step-by-Step Setup

### 1. Install Dependencies

```powershell
npm install
```

This will install:
- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Prisma
- bcryptjs
- react-confetti
- And all other dependencies

### 2. Set Up PostgreSQL Database

**Option A: Local PostgreSQL**

1. Install PostgreSQL on your machine
2. Create a new database:
   ```sql
   CREATE DATABASE sugar_cubes;
   ```

**Option B: Cloud Database (Recommended for Production)**

Use one of these services:
- [Supabase](https://supabase.com/) (Free tier)
- [Neon](https://neon.tech/) (Free tier)
- [Railway](https://railway.app/)
- [Heroku Postgres](https://www.heroku.com/postgres)

### 3. Configure Environment Variables

1. Copy the example env file:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Edit `.env` and update the `DATABASE_URL`:
   ```
   DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE"
   ```

   Example (local):
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/sugar_cubes"
   ```

   Example (Supabase):
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"
   ```

### 4. Initialize Prisma & Database

```powershell
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init
```

This will:
- Generate the Prisma Client
- Create the `Letter` table in your database

### 5. Run Development Server

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Test the App

1. **Create a letter**:
   - Go to `/admin/compose`
   - Fill in recipient name, message, and PIN
   - Copy the generated URL

2. **Open the letter**:
   - Paste URL in a new incognito window
   - Enter the recipient name
   - Click the envelope
   - Enter the PIN
   - Watch the magic happen! 🎉

## 🛠 Useful Commands

### Prisma

```powershell
# Open Prisma Studio (Database GUI)
npx prisma studio

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Create a new migration
npx prisma migrate dev --name your_migration_name
```

### Next.js

```powershell
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## 🐛 Troubleshooting

### Database Connection Issues

**Error: Can't reach database server**
- Check if PostgreSQL is running
- Verify DATABASE_URL is correct
- Check firewall settings

**Error: Authentication failed**
- Verify username and password in DATABASE_URL
- Check database user permissions

### Prisma Issues

**Error: Prisma Client is not generated**
```powershell
npx prisma generate
```

**Error: Migration failed**
```powershell
npx prisma migrate reset
npx prisma migrate dev --name init
```

### TypeScript Errors

**Error: Cannot find module**
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Port Already in Use

**Error: Port 3000 is already in use**
```powershell
# Kill the process using port 3000
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force

# Or use a different port
$env:PORT=3001; npm run dev
```

## 🔐 Security Notes

1. **Never commit `.env`** - It's already in `.gitignore`
2. **Use strong database passwords** in production
3. **Enable SSL** for database connections in production
4. **Rate limit API routes** for production deployment

## 🚢 Deploy to Production

### Vercel (Easiest)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variable: `DATABASE_URL`
5. Deploy!

### Environment Variables for Production

Add these in your hosting platform:
```
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="generate-a-secure-random-string"
NEXTAUTH_URL="https://your-domain.com"
```

Generate a secure secret:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 📚 Next Steps

- [ ] Add rate limiting to API routes
- [ ] Implement letter expiration
- [ ] Add email notifications
- [ ] Create letter templates
- [ ] Add rich text editor
- [ ] Implement letter deletion

## 🆘 Need Help?

- Check the [README.md](./README.md) for more details
- Review the code comments
- Check Next.js documentation: https://nextjs.org/docs
- Check Prisma documentation: https://www.prisma.io/docs

---

Happy coding! 💌

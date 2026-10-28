# Sugaries

**Personal letters, thoughtfully delivered.**

Sugaries is a digital letter-writing experience built around the anticipation of opening a real envelope. Create a letter, personalize its appearance, and share a link that leads the recipient through a name check, an envelope reveal, and an optional PIN prompt.

[Explore Sugaries](https://sugaries-delta.vercel.app)

## The experience

Sugaries combines familiar stationery details with an interactive web interface. Letter themes, typography, envelope animations, and optional media make each message feel personal without turning the writing itself into a template.

The repository includes two applications:

- **Web:** a Next.js application for composing, managing, and opening letters.
- **Mobile:** a React Native / Expo application with its own screens and API integration.

## What you can do

- Write and share personalized letters using individual links or short codes.
- Choose the letter's colors, fonts, and introductory text.
- Add images or music to a letter.
- Open letters through the recipient and PIN flow, where configured.
- React to letters and send replies.
- Access account, dashboard, and letter-management views.
- Explore the companion mobile experience built with Expo.

## Technology

| Area | Stack |
| --- | --- |
| Web | Next.js 14, React, TypeScript |
| UI | Tailwind CSS, Framer Motion |
| Database | PostgreSQL, Prisma |
| Accounts | NextAuth |
| PIN verification | bcryptjs |
| Mobile | React Native, Expo, Expo Router |

## Get started

### Web application

```bash
git clone https://github.com/ShikinariShiki/sugaries.git
cd sugaries
npm ci
cp .env.example .env
```

Configure your PostgreSQL connection and account-provider settings in `.env`. The database configuration uses both `DATABASE_URL` and `DIRECT_URL`, as defined in `prisma/schema.prisma`.

```bash
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Mobile application

```bash
cd mobile
npm ci
npm start
```

The mobile project has its own dependencies and runtime configuration. Follow [the mobile setup guide](mobile/README.md) for API configuration and Expo development.

## Repository guide

```text
src/app/           Web routes and API endpoints
src/components/    Web interface components
src/lib/           Shared web utilities
prisma/            Data models and migrations
public/            Static web assets
mobile/            Expo / React Native app
```

Detailed guides are available for [web setup](SETUP.md), [deployment](DEPLOYMENT.md), [mobile development](mobile/README.md), and [system architecture](ARCHITECTURE.md).

## Design approach

Sugaries draws from folded paper, colorful envelopes, handwritten notes, and tactile motion. The interface uses soft paper tones, layered surfaces, and gentle transitions to give private correspondence a recognizable visual identity.

---

Sugaries · A digital stationery and personal-letter project

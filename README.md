# 🍬 Sugar Cubes

> A whimsical digital stationery app for sending encrypted, highly aesthetic letters with a "soft paper" design system.

![Sugar Cubes](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-10-ff69b4?style=flat-square)

## ✨ Features

- **🔒 Zero-Trust Security**: Content never sent to client until full verification passes
- **💌 Four-Stage Reveal**: NAME_CHECK → LOCKED_ENVELOPE → PIN_CHECK → READING
- **🎨 Soft Paper Aesthetics**: Matte cardstock textures, layered shadows, warm rice paper background
- **✨ Whimsical Animations**: Envelope opening, paper unfolding, shake effects, confetti celebration
- **🔐 PIN Protection**: Bcrypt-encrypted 4-digit PIN verification
- **📱 Responsive Design**: Beautiful on all devices

## 🎨 Design Language

**Visual Style**: "Soft Paper" & "Messy Desk" (NOT Claymorphism)

**Colors**:
- `#fdfbf7` - Warm Rice Paper (Background)
- Pastel Pink, Blue, Yellow, Lavender (Envelope variations)

**Shadows**: 
- `stack-sm` - Subtle paper stack effect
- `stack-floating` - Elevated paper layers

**Animations**:
- Shake (on error)
- Unfold (envelope opening)
- Float (idle hover)
- Confetti (success celebration)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd sugar-snuggles
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your PostgreSQL connection string:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/sugar_cubes"
   ```

4. **Initialize database**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Run development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
sugar-snuggles/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/letter/        # API routes (zero-trust security)
│   │   │   ├── create/route.ts
│   │   │   ├── verify-name/route.ts
│   │   │   └── unlock/route.ts
│   │   ├── admin/compose/     # Letter composition page
│   │   ├── letter/[id]/       # Recipient view page
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   │   ├── SquishButton.tsx
│   │   │   ├── Envelope.tsx
│   │   │   ├── PaperCard.tsx
│   │   │   ├── PINInput.tsx
│   │   │   └── ShakeWrapper.tsx
│   │   └── LetterClientView.tsx
│   ├── hooks/
│   │   ├── useLetterReveal.ts  # State machine for letter reveal
│   │   └── useWindowSize.ts
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── utils.ts
│   └── types/
│       └── letter.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🔐 Security Architecture

**Zero-Trust Flow**:

1. **Server Component** (`letter/[id]/page.tsx`): 
   - Only receives letter ID from URL
   - Never fetches content server-side

2. **Client-Side State Machine**:
   - State 1: `NAME_CHECK` → Verify recipient name
   - State 2: `LOCKED_ENVELOPE` → Display sealed envelope
   - State 3: `PIN_CHECK` → Verify 4-digit PIN
   - State 4: `READING` → Show decrypted content

3. **API Routes**:
   - `/api/letter/verify-name`: Returns ONLY correct name (no content)
   - `/api/letter/unlock`: Returns content ONLY after PIN verification
   - PIN stored as bcrypt hash

## 🎭 State Machine Flow

```typescript
NAME_CHECK
   ↓ (verifyName)
LOCKED_ENVELOPE
   ↓ (openEnvelope)
PIN_CHECK
   ↓ (verifyPin)
READING
```

Each state has:
- **Entry**: Animation & UI mount
- **Error Handling**: Shake animation
- **Exit**: Graceful transition with AnimatePresence

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + clsx + tailwind-merge
- **Animation**: Framer Motion
- **Database**: Prisma (PostgreSQL)
- **Authentication**: Bcrypt (PIN hashing)
- **State Management**: React Hooks (useReducer)

## 📝 Usage

### Creating a Letter

1. Navigate to `/admin/compose`
2. Fill in:
   - Recipient's name
   - Your message
   - 4-digit PIN
3. Copy the generated URL
4. Share URL with recipient + PIN (separately!)

### Opening a Letter

1. Recipient clicks the URL
2. Enters their name → Sees sealed envelope
3. Clicks envelope → Prompted for PIN
4. Enters PIN → Letter unfolds with confetti!

## 🎨 Customization

### Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  'rice-paper': '#fdfbf7',
  'pastel-pink': '#ffd6e7',
  'pastel-blue': '#d6e7ff',
  'pastel-yellow': '#fff9d6',
  'pastel-lavender': '#e7d6ff',
}
```

### Animations

Adjust in `tailwind.config.ts` under `keyframes` and `animation`.

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### Manual Deployment

```bash
npm run build
npm start
```

## 📜 License

MIT

## 🙏 Credits

Built with love using:
- [Next.js](https://nextjs.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)

---

Made with 💌 by a Senior Creative Technologist

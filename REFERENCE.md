# 🎨 Sugaries - Component & Architecture Reference

## 📋 Table of Contents

1. [File Structure Overview](#file-structure-overview)
2. [Key Components](#key-components)
3. [State Machine Flow](#state-machine-flow)
4. [API Endpoints](#api-endpoints)
5. [Styling System](#styling-system)
6. [Animation Patterns](#animation-patterns)

---

## 📁 File Structure Overview

```
sugar-snuggles/
├── 📄 Configuration Files
│   ├── package.json              # Dependencies & scripts
│   ├── tsconfig.json             # TypeScript config
│   ├── tailwind.config.ts        # Tailwind + custom shadows/colors
│   ├── next.config.js            # Next.js config
│   └── postcss.config.js         # PostCSS config
│
├── 🗄️ Database
│   └── prisma/
│       └── schema.prisma         # Letter model schema
│
├── 🎨 Source Code
│   └── src/
│       ├── 🌐 App (Next.js App Router)
│       │   ├── page.tsx                    # Homepage
│       │   ├── layout.tsx                  # Root layout
│       │   ├── globals.css                 # Global styles
│       │   ├── admin/compose/page.tsx      # Letter creation
│       │   ├── letter/[id]/page.tsx        # Letter view (server)
│       │   └── api/letter/
│       │       ├── create/route.ts         # POST: Create letter
│       │       ├── verify-name/route.ts    # POST: Verify recipient
│       │       └── unlock/route.ts         # POST: Verify PIN
│       │
│       ├── 🧩 Components
│       │   ├── LetterClientView.tsx        # Main recipient flow
│       │   └── ui/
│       │       ├── SquishButton.tsx        # Animated button
│       │       ├── Envelope.tsx            # Envelope component
│       │       ├── PaperCard.tsx           # Card container
│       │       ├── PINInput.tsx            # PIN input UI
│       │       └── ShakeWrapper.tsx        # Error shake animation
│       │
│       ├── 🪝 Hooks
│       │   ├── useLetterReveal.ts          # State machine logic
│       │   └── useWindowSize.ts            # Window dimensions
│       │
│       ├── 📚 Library
│       │   ├── prisma.ts                   # Prisma client
│       │   └── utils.ts                    # cn() utility
│       │
│       └── 📝 Types
│           └── letter.ts                   # TypeScript types
│
└── 📖 Documentation
    ├── README.md                # Project overview
    ├── SETUP.md                 # Setup instructions
    └── REFERENCE.md             # This file
```

---

## 🧩 Key Components

### 1. **LetterClientView** (`src/components/LetterClientView.tsx`)
Main orchestrator for the recipient experience.

**Props**:
- `letterId: string` - The unique letter ID from URL

**States**:
- `NAME_CHECK` - Name verification form
- `LOCKED_ENVELOPE` - Sealed envelope display
- `PIN_CHECK` - PIN entry modal
- `READING` - Unfolded letter with content

**Key Features**:
- State-based rendering with `AnimatePresence`
- Error handling with shake animation
- Automatic PIN submission on 4th digit
- Confetti celebration on unlock

---

### 2. **SquishButton** (`src/components/ui/SquishButton.tsx`)
Animated button with squish effect.

**Props**:
- `variant?: 'primary' | 'secondary' | 'ghost'`
- `size?: 'sm' | 'md' | 'lg'`
- Standard `button` HTML attributes

**Animations**:
- Hover: Scale 1.02, translate Y -2px
- Tap: Scale 0.98
- Spring physics: stiffness 400, damping 17

---

### 3. **Envelope** (`src/components/ui/Envelope.tsx`)
Animated envelope component.

**Props**:
- `recipientName: string` - Name displayed on envelope
- `isOpen?: boolean` - Open/closed state
- `onClick?: () => void` - Click handler
- `color?: 'pink' | 'blue' | 'yellow' | 'lavender'`

**Features**:
- 3D rotation animation (rotateX)
- Wax seal with "SC" logo
- Hover scaling effect

---

### 4. **PINInput** (`src/components/ui/PINInput.tsx`)
4-digit PIN input with visual feedback.

**Props**:
- `value: string` - Current PIN value
- `onChange: (value: string) => void` - Change handler
- `maxLength?: number` - Default: 4
- `error?: boolean` - Error state styling

**Features**:
- Masked display (dots)
- Auto-focus on current digit
- Numeric keyboard on mobile
- Staggered animation on mount

---

### 5. **ShakeWrapper** (`src/components/ui/ShakeWrapper.tsx`)
Error animation wrapper.

**Props**:
- `children: React.ReactNode`
- `shouldShake: boolean` - Trigger shake
- `onShakeComplete?: () => void` - Callback after shake

**Animation**:
- Horizontal shake: -10px to +10px
- Rotation: -2° to +2°
- Duration: 0.5s

---

## 🔄 State Machine Flow

### States & Transitions

```
┌─────────────┐
│ NAME_CHECK  │ ← Initial state
└──────┬──────┘
       │ verifyName(name)
       │ ✓ Success → NAME_VERIFIED
       │ ✗ Failure → NAME_FAILED (stays in NAME_CHECK)
       ▼
┌──────────────────┐
│ LOCKED_ENVELOPE  │
└──────┬───────────┘
       │ openEnvelope()
       ▼
┌─────────────┐
│  PIN_CHECK  │
└──────┬──────┘
       │ verifyPin(pin)
       │ ✓ Success → PIN_VERIFIED
       │ ✗ Failure → PIN_FAILED (stays in PIN_CHECK)
       ▼
┌─────────────┐
│   READING   │ ← Final state
└─────────────┘
```

### State Data Structure

```typescript
interface LetterStateData {
  state: LetterState
  recipientName?: string    // Set after NAME_VERIFIED
  content?: string          // Set after PIN_VERIFIED
  error?: string           // Set on any failure
  isLoading?: boolean      // During API calls
}
```

### Actions

```typescript
type LetterAction =
  | { type: 'VERIFY_NAME'; payload: { name: string } }
  | { type: 'NAME_VERIFIED'; payload: { recipientName: string } }
  | { type: 'NAME_FAILED'; payload: { error: string } }
  | { type: 'OPEN_ENVELOPE' }
  | { type: 'VERIFY_PIN'; payload: { pin: string } }
  | { type: 'PIN_VERIFIED'; payload: { content: string } }
  | { type: 'PIN_FAILED'; payload: { error: string } }
  | { type: 'RESET' }
```

---

## 🌐 API Endpoints

### POST `/api/letter/create`
Create a new letter.

**Request**:
```json
{
  "recipientName": "Alice",
  "content": "Your secret message",
  "pin": "1234"
}
```

**Response**:
```json
{
  "letterId": "uuid-here",
  "url": "/letter/uuid-here"
}
```

**Security**:
- PIN is bcrypt hashed (10 rounds)
- Returns only letter ID, no sensitive data

---

### POST `/api/letter/verify-name`
Verify recipient name (State 1 → State 2).

**Request**:
```json
{
  "letterId": "uuid-here",
  "name": "alice"
}
```

**Response** (Success):
```json
{
  "correctName": "Alice"
}
```

**Response** (Failure):
```json
{
  "error": "Name does not match"
}
```

**Security**:
- Case-insensitive comparison
- Returns ONLY the correctly formatted name
- NEVER returns content or pinHash

---

### POST `/api/letter/unlock`
Unlock letter with PIN (State 3 → State 4).

**Request**:
```json
{
  "letterId": "uuid-here",
  "pin": "1234"
}
```

**Response** (Success):
```json
{
  "content": "Your secret message"
}
```

**Response** (Failure):
```json
{
  "error": "Incorrect PIN"
}
```

**Security**:
- bcrypt comparison (prevents timing attacks)
- Marks letter as `isOpened: true` on first unlock
- Returns content ONLY after successful verification

---

## 🎨 Styling System

### Colors

```css
--rice-paper: #fdfbf7      /* Warm background */
--ink: #2d2d2d             /* Text color */
--pastel-pink: #ffd6e7     /* Accent 1 */
--pastel-blue: #d6e7ff     /* Accent 2 */
--pastel-yellow: #fff9d6   /* Accent 3 */
--pastel-lavender: #e7d6ff /* Accent 4 */
```

### Shadows (Layered Paper Effect)

```css
/* Subtle stack */
shadow-stack-sm: 
  0 1px 0 0 rgba(0,0,0,0.08),
  0 2px 0 0 rgba(0,0,0,0.06),
  0 3px 0 0 rgba(0,0,0,0.04)

/* Elevated stack */
shadow-stack-floating:
  0 2px 4px 0 rgba(0,0,0,0.06),
  0 4px 8px 0 rgba(0,0,0,0.08),
  0 8px 16px 0 rgba(0,0,0,0.10),
  0 12px 24px 0 rgba(0,0,0,0.12)

/* Standard paper */
shadow-paper:
  0 1px 3px 0 rgba(0,0,0,0.08),
  0 1px 2px 0 rgba(0,0,0,0.06)
```

### Typography

```css
font-sans: Inter (system sans-serif fallback)
font-handwriting: Caveat (Google Fonts)
```

---

## ✨ Animation Patterns

### 1. **Shake Animation** (Error Feedback)
```css
@keyframes shake {
  10%, 90%: translate3d(-1px, 0, 0)
  20%, 80%: translate3d(2px, 0, 0)
  30%, 50%, 70%: translate3d(-4px, 0, 0)
  40%, 60%: translate3d(4px, 0, 0)
}
```

**Usage**:
- Wrong name input
- Wrong PIN input
- Any validation error

---

### 2. **Unfold Animation** (Letter Reveal)
```css
@keyframes unfold {
  0%: perspective(1000px) rotateX(0deg) scale(0.95)
  50%: perspective(1000px) rotateX(-90deg) scale(1)
  100%: perspective(1000px) rotateX(0deg) scale(1)
}
```

**Usage**:
- Transition from PIN_CHECK to READING
- Creates 3D paper unfolding effect

---

### 3. **Float Animation** (Idle State)
```css
@keyframes float {
  0%, 100%: translateY(0px)
  50%: translateY(-10px)
}
```

**Usage**:
- Envelope hover state
- Idle decorative elements

---

### 4. **Button Squish** (Interaction Feedback)
```typescript
whileHover={{ scale: 1.02, y: -2 }}
whileTap={{ scale: 0.98, y: 0 }}
transition={{ type: 'spring', stiffness: 400, damping: 17 }}
```

**Usage**:
- All buttons (SquishButton component)
- Provides tactile feedback

---

## 🔐 Security Best Practices

1. **Never expose sensitive data in Server Components**
   - Letter content fetched only via API routes
   - After full verification passes

2. **Use bcrypt for PIN hashing**
   - 10 rounds (good balance of security/performance)
   - Prevents timing attacks

3. **Case-insensitive name matching**
   - User-friendly
   - Prevents case-based lockouts

4. **Rate limiting** (TODO for production)
   - Prevent brute force PIN attacks
   - Use middleware or API route wrapper

---

## 🎯 Development Tips

### Adding a New Component

1. Create in `src/components/ui/`
2. Use Framer Motion for animations
3. Accept `className` prop for composability
4. Use `cn()` utility for class merging

Example:
```typescript
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function MyComponent({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn('base-classes', className)}
      whileHover={{ scale: 1.05 }}
    >
      Content
    </motion.div>
  )
}
```

### Adding a New State

1. Add to `LetterState` type in `src/types/letter.ts`
2. Add actions in `LetterAction` type
3. Update reducer in `useLetterReveal.ts`
4. Add UI case in `LetterClientView.tsx`

### Testing Locally

```powershell
# Terminal 1: Run dev server
npm run dev

# Terminal 2: Open Prisma Studio
npx prisma studio

# Create a test letter
# Open in incognito to test recipient flow
```

---

## 📚 Resources

- [Next.js App Router](https://nextjs.org/docs/app)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Prisma](https://www.prisma.io/docs)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

---

**Built with 💌 by a Senior Creative Technologist**

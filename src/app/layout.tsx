import type { Metadata } from 'next'
import { Inter, Quicksand, Poppins, Kalam, Pacifico, Dancing_Script, Satisfy, Indie_Flower, Shadows_Into_Light } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import { MusicPlayerProvider } from '@/contexts/MusicPlayerContext'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

const kalam = Kalam({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-handwriting',
})

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pacifico',
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
})

const satisfy = Satisfy({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-satisfy',
})

const indieFlower = Indie_Flower({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-indie',
})

const shadowsIntoLight = Shadows_Into_Light({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-shadows',
})

export const metadata: Metadata = {
  title: 'Sugaries | Digital Love Letters',
  description: 'Send encrypted, aesthetic digital letters with music and memories',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.variable} ${quicksand.variable} ${poppins.variable} ${kalam.variable} ${pacifico.variable} ${dancingScript.variable} ${satisfy.variable} ${indieFlower.variable} ${shadowsIntoLight.variable} font-sans antialiased`}>
        <AuthProvider>
          <MusicPlayerProvider>
            {children}
          </MusicPlayerProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

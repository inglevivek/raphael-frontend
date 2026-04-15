import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import Silk from '@/components/react-bits/Silk' // Adjust import path if needed
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Raphael | The Digital Curator',
  description: 'AI-Powered Learning Architecture',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} dark`}>
      <body className="bg-background text-on-surface font-inter antialiased min-h-screen selection:bg-primary-container selection:text-white relative">

        {/* Global Anchored Backdrop */}
        <div className="fixed inset-0 z-[-1] w-full h-full pointer-events-none">
          {/* Customizing the Silk props to match your dark/violet aesthetic */}
          <Silk
            color="#2e0166ff"
            speed={4}
            scale={1.5}
            noiseIntensity={1.2}
          />
        </div>

        {/* Main Application Content */}
        <div className="relative z-0 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
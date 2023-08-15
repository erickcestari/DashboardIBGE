import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import MuiTheme from './theme'

const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: 'Dashboad IBGE',
  description: 'Made using IBGE API by Erick Cestari',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <link rel="icon" href="./favicon.png" sizes="any" />
      <body className={inter.className}><MuiTheme>{children}</MuiTheme></body>
    </html>
  )
}

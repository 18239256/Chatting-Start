import './globals.css'
import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
import ToasterContext from './context/ToasterContext'
import AuthContext from './context/AuthContext'
import ActiveStatus from './components/ActiveStatus'
import {Providers} from "./providers";

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chatting',
  description: 'Chatting',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    //NextUI automatically adds two themes, light and dark
    <html lang="en" className='light'>
      <body>
        <Providers>
          <AuthContext>
            <ToasterContext />
            <ActiveStatus />
            {children}
          </AuthContext>
        </Providers>
      </body>
    </html>
  )
}

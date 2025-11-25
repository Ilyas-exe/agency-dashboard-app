import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider, SignIn, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { LayoutDashboard, Users, Building2 } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Agency Dashboard',
  description: 'Agency and Contact Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex h-screen bg-gray-50/50">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b p-4 flex justify-between items-center z-10">
              <div className="flex items-center gap-2 font-bold text-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <span>AgencyDash</span>
              </div>
              <UserButton />
            </div>

            {/* Sidebar */}
            <SignedIn>
              <aside className="w-64 bg-white border-r hidden md:flex flex-col flex-shrink-0">
                <div className="p-6 border-b">
                  <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                      <LayoutDashboard className="w-5 h-5" />
                    </div>
                    <span>AgencyDash</span>
                  </div>
                </div>
                
                <nav className="flex-1 p-4 space-y-1">
                  <Link 
                    href="/agencies" 
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  >
                    <Building2 className="w-5 h-5" />
                    Agencies
                  </Link>
                  <Link 
                    href="/contacts" 
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  >
                    <Users className="w-5 h-5" />
                    Contacts
                  </Link>
                </nav>

                <div className="p-4 border-t bg-gray-50/50">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <UserButton afterSignOutUrl="/"/>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">My Account</span>
                      <span className="text-xs text-gray-500">Manage settings</span>
                    </div>
                  </div>
                </div>
              </aside>
            </SignedIn>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
              <SignedOut>
                <div className="flex items-center justify-center h-full bg-gray-50">
                  <div className="bg-white p-8 rounded-xl shadow-lg border">
                    <div className="mb-6 text-center">
                      <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                      <p className="text-gray-500 mt-2">Please sign in to access the dashboard</p>
                    </div>
                    <SignIn routing="hash" />
                  </div>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="p-4 md:p-8 mt-16 md:mt-0 pb-24 md:pb-8 max-w-7xl mx-auto">
                  {children}
                </div>
              </SignedIn>
            </main>

            {/* Mobile Bottom Nav */}
            <SignedIn>
              <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-4 z-10 pb-safe">
                <Link href="/agencies" className="flex flex-col items-center gap-1 text-xs font-medium text-gray-600 hover:text-blue-600">
                  <Building2 className="w-6 h-6" />
                  Agencies
                </Link>
                <Link href="/contacts" className="flex flex-col items-center gap-1 text-xs font-medium text-gray-600 hover:text-blue-600">
                  <Users className="w-6 h-6" />
                  Contacts
                </Link>
              </nav>
            </SignedIn>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}

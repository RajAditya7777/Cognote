'use client'

import AuthCard from '@/components/ui/auth-card'

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
        <AuthCard />
      </div>
    </main>
  )
}
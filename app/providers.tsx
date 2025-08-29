'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { ToastProvider } from '@/components/ui/toast'
import { RealtimeProvider } from '@/contexts/realtime-context'
import { CampaignProvider } from '@/contexts/campaign-context'
import { DonationProvider } from '@/contexts/donation-context'
import { UserProvider } from '@/contexts/user-context'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ToastProvider>
          <UserProvider>
            <RealtimeProvider>
              <CampaignProvider>
                <DonationProvider>
                  {children}
                </DonationProvider>
              </CampaignProvider>
            </RealtimeProvider>
          </UserProvider>
        </ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}

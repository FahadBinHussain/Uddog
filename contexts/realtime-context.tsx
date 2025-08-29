'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { supabase, subscribeToDonations, subscribeToCampaignUpdates, subscribeToComments, subscribeToVerificationUpdates, unsubscribeAll } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface RealtimeContextType {
  isConnected: boolean
  subscribeToCampaign: (campaignId: number) => void
  unsubscribeFromCampaign: (campaignId: number) => void
  broadcastDonation: (campaignId: number, donation: any) => Promise<void>
  onlineUsers: number
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

interface RealtimeProviderProps {
  children: React.ReactNode
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')
  const [subscribedCampaigns, setSubscribedCampaigns] = useState<Set<number>>(new Set())

  // Connection management
  useEffect(() => {
    if (!session?.user) return

    const setupConnection = async () => {
      try {
        setConnectionStatus('connecting')

        // Listen to connection status
        supabase.realtime.onOpen(() => {
          setIsConnected(true)
          setConnectionStatus('connected')
          console.log('Realtime connection established')
        })

        supabase.realtime.onClose(() => {
          setIsConnected(false)
          setConnectionStatus('disconnected')
          console.log('Realtime connection closed')
        })

        supabase.realtime.onError((error) => {
          setIsConnected(false)
          setConnectionStatus('error')
          console.error('Realtime connection error:', error)
          toast({
            title: 'Connection Error',
            description: 'Lost real-time connection. Trying to reconnect...',
            variant: 'destructive',
          })
        })

        // Connect to realtime
        await supabase.realtime.connect()

      } catch (error) {
        console.error('Failed to setup realtime connection:', error)
        setConnectionStatus('error')
      }
    }

    setupConnection()

    return () => {
      unsubscribeAll()
      supabase.realtime.disconnect()
    }
  }, [session, toast])

  // Subscribe to a campaign's real-time updates
  const subscribeToCampaign = useCallback((campaignId: number) => {
    if (subscribedCampaigns.has(campaignId)) return

    console.log(`Subscribing to real-time updates for campaign ${campaignId}`)

    // Subscribe to donation updates
    const donationSubscription = subscribeToDonations(campaignId, (payload) => {
      console.log('New donation received:', payload)

      // Show toast notification for new donations
      if (payload.eventType === 'INSERT') {
        toast({
          title: 'New Donation!',
          description: `Someone just donated to this campaign`,
          variant: 'success',
        })
      }

      // Dispatch custom event for components to listen to
      window.dispatchEvent(new CustomEvent('donation-update', {
        detail: { campaignId, donation: payload.new }
      }))
    })

    // Subscribe to campaign updates
    const campaignSubscription = subscribeToCampaignUpdates(campaignId, (payload) => {
      console.log('Campaign updated:', payload)

      if (payload.eventType === 'UPDATE') {
        // Dispatch custom event for campaign updates
        window.dispatchEvent(new CustomEvent('campaign-update', {
          detail: { campaignId, campaign: payload.new }
        }))
      }
    })

    // Subscribe to comments
    const commentSubscription = subscribeToComments(campaignId, (payload) => {
      console.log('New comment:', payload)

      if (payload.eventType === 'INSERT') {
        toast({
          title: 'New Comment',
          description: 'Someone commented on this campaign',
          variant: 'default',
        })

        // Dispatch custom event for comment updates
        window.dispatchEvent(new CustomEvent('comment-update', {
          detail: { campaignId, comment: payload.new }
        }))
      }
    })

    // Subscribe to verification updates
    const verificationSubscription = subscribeToVerificationUpdates(campaignId, (payload) => {
      console.log('Verification status updated:', payload)

      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        const status = payload.new?.status
        let title = 'Verification Update'
        let description = 'Campaign verification status has been updated'
        let variant: 'default' | 'success' | 'destructive' = 'default'

        switch (status) {
          case 'verified':
            title = 'Campaign Verified!'
            description = 'This campaign has been verified by our team'
            variant = 'success'
            break
          case 'rejected':
            title = 'Verification Rejected'
            description = 'This campaign verification was rejected'
            variant = 'destructive'
            break
          case 'pending':
            title = 'Under Review'
            description = 'This campaign is under review for verification'
            break
        }

        toast({
          title,
          description,
          variant,
        })

        // Dispatch custom event for verification updates
        window.dispatchEvent(new CustomEvent('verification-update', {
          detail: { campaignId, verification: payload.new }
        }))
      }
    })

    setSubscribedCampaigns(prev => new Set([...prev, campaignId]))

    // Store subscriptions for cleanup
    if (typeof window !== 'undefined') {
      if (!window.realtimeSubscriptions) {
        window.realtimeSubscriptions = new Map()
      }
      window.realtimeSubscriptions.set(campaignId, {
        donation: donationSubscription,
        campaign: campaignSubscription,
        comment: commentSubscription,
        verification: verificationSubscription,
      })
    }
  }, [subscribedCampaigns, toast])

  // Unsubscribe from a campaign's real-time updates
  const unsubscribeFromCampaign = useCallback((campaignId: number) => {
    if (!subscribedCampaigns.has(campaignId)) return

    console.log(`Unsubscribing from real-time updates for campaign ${campaignId}`)

    // Clean up subscriptions
    if (typeof window !== 'undefined' && window.realtimeSubscriptions) {
      const subscriptions = window.realtimeSubscriptions.get(campaignId)
      if (subscriptions) {
        Object.values(subscriptions).forEach(subscription => {
          if (subscription && typeof subscription.unsubscribe === 'function') {
            subscription.unsubscribe()
          }
        })
        window.realtimeSubscriptions.delete(campaignId)
      }
    }

    setSubscribedCampaigns(prev => {
      const newSet = new Set(prev)
      newSet.delete(campaignId)
      return newSet
    })
  }, [subscribedCampaigns])

  // Broadcast a donation event
  const broadcastDonation = useCallback(async (campaignId: number, donation: any) => {
    try {
      await supabase
        .channel(`donations-${campaignId}`)
        .send({
          type: 'broadcast',
          event: 'donation',
          payload: donation
        })
      console.log('Donation broadcast sent:', donation)
    } catch (error) {
      console.error('Failed to broadcast donation:', error)
    }
  }, [])

  // Monitor online users (simplified implementation)
  useEffect(() => {
    const updateOnlineUsers = () => {
      // This is a simplified implementation
      // In a real app, you might use presence to track actual online users
      setOnlineUsers(Math.floor(Math.random() * 100) + 50)
    }

    updateOnlineUsers()
    const interval = setInterval(updateOnlineUsers, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      subscribedCampaigns.forEach(campaignId => {
        unsubscribeFromCampaign(campaignId)
      })
    }
  }, [subscribedCampaigns, unsubscribeFromCampaign])

  const value: RealtimeContextType = {
    isConnected,
    subscribeToCampaign,
    unsubscribeFromCampaign,
    broadcastDonation,
    onlineUsers,
    connectionStatus,
  }

  return (
    <RealtimeContext.Provider value={value}>
      {children}

      {/* Connection Status Indicator */}
      {connectionStatus === 'connecting' && (
        <div className="fixed bottom-4 left-4 bg-yellow-500 text-white px-3 py-2 rounded-md text-sm z-50">
          Connecting to real-time updates...
        </div>
      )}

      {connectionStatus === 'error' && (
        <div className="fixed bottom-4 left-4 bg-red-500 text-white px-3 py-2 rounded-md text-sm z-50">
          Connection error - retrying...
        </div>
      )}
    </RealtimeContext.Provider>
  )
}

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider')
  }
  return context
}

// Extend window interface for TypeScript
declare global {
  interface Window {
    realtimeSubscriptions?: Map<number, any>
  }
}

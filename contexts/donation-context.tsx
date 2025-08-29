'use client'

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'

// Types
interface Donation {
  donation_id: number
  amount: number
  donationDate: string
  isRecurring: boolean
  campaign_id: number
  user_id: number
  campaign: {
    title: string
    user: {
      name: string
    }
  }
  user: {
    name: string
    email: string
  }
  stripePaymentId?: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  recurringFrequency?: 'monthly' | 'quarterly' | 'annually'
  nextPaymentDate?: string
}

interface RecurringDonation {
  id: string
  campaignId: number
  amount: number
  frequency: 'monthly' | 'quarterly' | 'annually'
  status: 'active' | 'paused' | 'cancelled'
  nextPaymentDate: string
  createdAt: string
  campaign: {
    title: string
    status: string
  }
  totalPaid: number
  paymentCount: number
}

interface DonationState {
  donations: Donation[]
  recurringDonations: RecurringDonation[]
  userDonations: Donation[]
  campaignDonations: Donation[]
  loading: boolean
  error: string | null
  processingPayment: boolean
  donationStats: {
    totalDonated: number
    totalCampaigns: number
    totalRecurring: number
    thisMonthDonated: number
  }
}

type DonationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROCESSING_PAYMENT'; payload: boolean }
  | { type: 'SET_DONATIONS'; payload: Donation[] }
  | { type: 'SET_RECURRING_DONATIONS'; payload: RecurringDonation[] }
  | { type: 'SET_USER_DONATIONS'; payload: Donation[] }
  | { type: 'SET_CAMPAIGN_DONATIONS'; payload: Donation[] }
  | { type: 'ADD_DONATION'; payload: Donation }
  | { type: 'UPDATE_DONATION'; payload: { id: number; updates: Partial<Donation> } }
  | { type: 'ADD_RECURRING_DONATION'; payload: RecurringDonation }
  | { type: 'UPDATE_RECURRING_DONATION'; payload: { id: string; updates: Partial<RecurringDonation> } }
  | { type: 'REMOVE_RECURRING_DONATION'; payload: string }
  | { type: 'SET_DONATION_STATS'; payload: DonationState['donationStats'] }

const initialState: DonationState = {
  donations: [],
  recurringDonations: [],
  userDonations: [],
  campaignDonations: [],
  loading: false,
  error: null,
  processingPayment: false,
  donationStats: {
    totalDonated: 0,
    totalCampaigns: 0,
    totalRecurring: 0,
    thisMonthDonated: 0,
  },
}

function donationReducer(state: DonationState, action: DonationAction): DonationState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }

    case 'SET_PROCESSING_PAYMENT':
      return { ...state, processingPayment: action.payload }

    case 'SET_DONATIONS':
      return { ...state, donations: action.payload, loading: false, error: null }

    case 'SET_RECURRING_DONATIONS':
      return { ...state, recurringDonations: action.payload }

    case 'SET_USER_DONATIONS':
      return { ...state, userDonations: action.payload }

    case 'SET_CAMPAIGN_DONATIONS':
      return { ...state, campaignDonations: action.payload }

    case 'ADD_DONATION':
      return {
        ...state,
        donations: [action.payload, ...state.donations],
        userDonations: [action.payload, ...state.userDonations],
      }

    case 'UPDATE_DONATION':
      const updateDonationInArray = (donations: Donation[]) =>
        donations.map(donation =>
          donation.donation_id === action.payload.id
            ? { ...donation, ...action.payload.updates }
            : donation
        )

      return {
        ...state,
        donations: updateDonationInArray(state.donations),
        userDonations: updateDonationInArray(state.userDonations),
        campaignDonations: updateDonationInArray(state.campaignDonations),
      }

    case 'ADD_RECURRING_DONATION':
      return {
        ...state,
        recurringDonations: [action.payload, ...state.recurringDonations],
      }

    case 'UPDATE_RECURRING_DONATION':
      return {
        ...state,
        recurringDonations: state.recurringDonations.map(donation =>
          donation.id === action.payload.id
            ? { ...donation, ...action.payload.updates }
            : donation
        ),
      }

    case 'REMOVE_RECURRING_DONATION':
      return {
        ...state,
        recurringDonations: state.recurringDonations.filter(
          donation => donation.id !== action.payload
        ),
      }

    case 'SET_DONATION_STATS':
      return { ...state, donationStats: action.payload }

    default:
      return state
  }
}

interface DonationContextType {
  state: DonationState
  makeDonation: (campaignId: number, amount: number, isRecurring?: boolean, frequency?: string) => Promise<boolean>
  fetchUserDonations: () => Promise<void>
  fetchCampaignDonations: (campaignId: number) => Promise<void>
  fetchRecurringDonations: () => Promise<void>
  cancelRecurringDonation: (id: string) => Promise<void>
  pauseRecurringDonation: (id: string) => Promise<void>
  resumeRecurringDonation: (id: string) => Promise<void>
  updateRecurringDonation: (id: string, updates: { amount?: number; frequency?: string }) => Promise<void>
  fetchDonationStats: () => Promise<void>
  refundDonation: (donationId: number) => Promise<void>
  createPaymentIntent: (amount: number, campaignId: number) => Promise<{ clientSecret: string } | null>
}

const DonationContext = createContext<DonationContextType | undefined>(undefined)

interface DonationProviderProps {
  children: ReactNode
}

export function DonationProvider({ children }: DonationProviderProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [state, dispatch] = useReducer(donationReducer, initialState)

  const createPaymentIntent = useCallback(async (amount: number, campaignId: number) => {
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          campaignId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const data = await response.json()
      return { clientSecret: data.clientSecret }
    } catch (error) {
      console.error('Error creating payment intent:', error)
      toast({
        title: 'Payment Error',
        description: 'Failed to initialize payment',
        variant: 'destructive',
      })
      return null
    }
  }, [toast])

  const makeDonation = useCallback(async (
    campaignId: number,
    amount: number,
    isRecurring: boolean = false,
    frequency: string = 'monthly'
  ): Promise<boolean> => {
    if (!session?.user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to make a donation',
        variant: 'destructive',
      })
      return false
    }

    try {
      dispatch({ type: 'SET_PROCESSING_PAYMENT', payload: true })

      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId,
          amount,
          isRecurring,
          frequency: isRecurring ? frequency : null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to process donation')
      }

      const data = await response.json()
      dispatch({ type: 'ADD_DONATION', payload: data.donation })

      if (isRecurring && data.recurringDonation) {
        dispatch({ type: 'ADD_RECURRING_DONATION', payload: data.recurringDonation })
      }

      toast({
        title: 'Thank you!',
        description: `Your donation of $${amount} has been processed successfully`,
        variant: 'success',
      })

      // Update campaign amount in real-time
      window.dispatchEvent(new CustomEvent('donation-success', {
        detail: { campaignId, amount, donation: data.donation }
      }))

      return true

    } catch (error) {
      console.error('Error processing donation:', error)
      toast({
        title: 'Donation Failed',
        description: error instanceof Error ? error.message : 'Failed to process donation',
        variant: 'destructive',
      })
      return false
    } finally {
      dispatch({ type: 'SET_PROCESSING_PAYMENT', payload: false })
    }
  }, [session, toast])

  const fetchUserDonations = useCallback(async () => {
    if (!session?.user) return

    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      const response = await fetch('/api/donations/user')

      if (!response.ok) {
        throw new Error('Failed to fetch donations')
      }

      const data = await response.json()
      dispatch({ type: 'SET_USER_DONATIONS', payload: data.donations })

    } catch (error) {
      console.error('Error fetching user donations:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load your donations' })
    }
  }, [session])

  const fetchCampaignDonations = useCallback(async (campaignId: number) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/donations`)

      if (!response.ok) {
        throw new Error('Failed to fetch campaign donations')
      }

      const data = await response.json()
      dispatch({ type: 'SET_CAMPAIGN_DONATIONS', payload: data.donations })

    } catch (error) {
      console.error('Error fetching campaign donations:', error)
    }
  }, [])

  const fetchRecurringDonations = useCallback(async () => {
    if (!session?.user) return

    try {
      const response = await fetch('/api/donations/recurring')

      if (!response.ok) {
        throw new Error('Failed to fetch recurring donations')
      }

      const data = await response.json()
      dispatch({ type: 'SET_RECURRING_DONATIONS', payload: data.recurringDonations })

    } catch (error) {
      console.error('Error fetching recurring donations:', error)
      toast({
        title: 'Error',
        description: 'Failed to load recurring donations',
        variant: 'destructive',
      })
    }
  }, [session, toast])

  const cancelRecurringDonation = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/donations/recurring/${id}/cancel`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to cancel recurring donation')
      }

      dispatch({
        type: 'UPDATE_RECURRING_DONATION',
        payload: { id, updates: { status: 'cancelled' } }
      })

      toast({
        title: 'Success',
        description: 'Recurring donation cancelled successfully',
        variant: 'success',
      })

    } catch (error) {
      console.error('Error cancelling recurring donation:', error)
      toast({
        title: 'Error',
        description: 'Failed to cancel recurring donation',
        variant: 'destructive',
      })
    }
  }, [toast])

  const pauseRecurringDonation = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/donations/recurring/${id}/pause`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to pause recurring donation')
      }

      dispatch({
        type: 'UPDATE_RECURRING_DONATION',
        payload: { id, updates: { status: 'paused' } }
      })

      toast({
        title: 'Success',
        description: 'Recurring donation paused successfully',
        variant: 'success',
      })

    } catch (error) {
      console.error('Error pausing recurring donation:', error)
      toast({
        title: 'Error',
        description: 'Failed to pause recurring donation',
        variant: 'destructive',
      })
    }
  }, [toast])

  const resumeRecurringDonation = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/donations/recurring/${id}/resume`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to resume recurring donation')
      }

      dispatch({
        type: 'UPDATE_RECURRING_DONATION',
        payload: { id, updates: { status: 'active' } }
      })

      toast({
        title: 'Success',
        description: 'Recurring donation resumed successfully',
        variant: 'success',
      })

    } catch (error) {
      console.error('Error resuming recurring donation:', error)
      toast({
        title: 'Error',
        description: 'Failed to resume recurring donation',
        variant: 'destructive',
      })
    }
  }, [toast])

  const updateRecurringDonation = useCallback(async (
    id: string,
    updates: { amount?: number; frequency?: string }
  ) => {
    try {
      const response = await fetch(`/api/donations/recurring/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update recurring donation')
      }

      const data = await response.json()
      dispatch({
        type: 'UPDATE_RECURRING_DONATION',
        payload: { id, updates: data.recurringDonation }
      })

      toast({
        title: 'Success',
        description: 'Recurring donation updated successfully',
        variant: 'success',
      })

    } catch (error) {
      console.error('Error updating recurring donation:', error)
      toast({
        title: 'Error',
        description: 'Failed to update recurring donation',
        variant: 'destructive',
      })
    }
  }, [toast])

  const fetchDonationStats = useCallback(async () => {
    if (!session?.user) return

    try {
      const response = await fetch('/api/donations/stats')

      if (!response.ok) {
        throw new Error('Failed to fetch donation stats')
      }

      const data = await response.json()
      dispatch({ type: 'SET_DONATION_STATS', payload: data.stats })

    } catch (error) {
      console.error('Error fetching donation stats:', error)
    }
  }, [session])

  const refundDonation = useCallback(async (donationId: number) => {
    try {
      const response = await fetch(`/api/donations/${donationId}/refund`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to process refund')
      }

      dispatch({
        type: 'UPDATE_DONATION',
        payload: { id: donationId, updates: { status: 'refunded' } }
      })

      toast({
        title: 'Refund Processed',
        description: 'Your refund has been processed and will appear in 5-10 business days',
        variant: 'success',
      })

    } catch (error) {
      console.error('Error processing refund:', error)
      toast({
        title: 'Refund Failed',
        description: 'Failed to process refund. Please contact support.',
        variant: 'destructive',
      })
    }
  }, [toast])

  const value: DonationContextType = {
    state,
    makeDonation,
    fetchUserDonations,
    fetchCampaignDonations,
    fetchRecurringDonations,
    cancelRecurringDonation,
    pauseRecurringDonation,
    resumeRecurringDonation,
    updateRecurringDonation,
    fetchDonationStats,
    refundDonation,
    createPaymentIntent,
  }

  return (
    <DonationContext.Provider value={value}>
      {children}
    </DonationContext.Provider>
  )
}

export function useDonations() {
  const context = useContext(DonationContext)
  if (context === undefined) {
    throw new Error('useDonations must be used within a DonationProvider')
  }
  return context
}

'use client'

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'

// Types
interface Campaign {
  campaign_id: number
  title: string
  description: string
  goalAmount: number
  currentAmount: number
  status: string
  createdAt: string
  user_id: number
  user: {
    name: string
    email: string
  }
  _count?: {
    donations: number
    comments: number
  }
  isVerified?: boolean
  images?: string[]
  category?: string
  location?: string
  endDate?: string
}

interface CampaignState {
  campaigns: Campaign[]
  featuredCampaigns: Campaign[]
  userCampaigns: Campaign[]
  currentCampaign: Campaign | null
  loading: boolean
  error: string | null
  searchQuery: string
  filters: {
    category: string
    status: string
    location: string
    verified: boolean | null
  }
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

type CampaignAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CAMPAIGNS'; payload: Campaign[] }
  | { type: 'SET_FEATURED_CAMPAIGNS'; payload: Campaign[] }
  | { type: 'SET_USER_CAMPAIGNS'; payload: Campaign[] }
  | { type: 'SET_CURRENT_CAMPAIGN'; payload: Campaign | null }
  | { type: 'ADD_CAMPAIGN'; payload: Campaign }
  | { type: 'UPDATE_CAMPAIGN'; payload: { id: number; updates: Partial<Campaign> } }
  | { type: 'DELETE_CAMPAIGN'; payload: number }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<CampaignState['filters']> }
  | { type: 'SET_PAGINATION'; payload: Partial<CampaignState['pagination']> }
  | { type: 'RESET_CAMPAIGNS' }

const initialState: CampaignState = {
  campaigns: [],
  featuredCampaigns: [],
  userCampaigns: [],
  currentCampaign: null,
  loading: false,
  error: null,
  searchQuery: '',
  filters: {
    category: '',
    status: '',
    location: '',
    verified: null,
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    hasMore: true,
  },
}

function campaignReducer(state: CampaignState, action: CampaignAction): CampaignState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }

    case 'SET_CAMPAIGNS':
      return { ...state, campaigns: action.payload, loading: false, error: null }

    case 'SET_FEATURED_CAMPAIGNS':
      return { ...state, featuredCampaigns: action.payload }

    case 'SET_USER_CAMPAIGNS':
      return { ...state, userCampaigns: action.payload }

    case 'SET_CURRENT_CAMPAIGN':
      return { ...state, currentCampaign: action.payload, loading: false, error: null }

    case 'ADD_CAMPAIGN':
      return {
        ...state,
        campaigns: [action.payload, ...state.campaigns],
        userCampaigns: [action.payload, ...state.userCampaigns],
      }

    case 'UPDATE_CAMPAIGN':
      const updateCampaign = (campaigns: Campaign[]) =>
        campaigns.map(campaign =>
          campaign.campaign_id === action.payload.id
            ? { ...campaign, ...action.payload.updates }
            : campaign
        )

      return {
        ...state,
        campaigns: updateCampaign(state.campaigns),
        featuredCampaigns: updateCampaign(state.featuredCampaigns),
        userCampaigns: updateCampaign(state.userCampaigns),
        currentCampaign: state.currentCampaign?.campaign_id === action.payload.id
          ? { ...state.currentCampaign, ...action.payload.updates }
          : state.currentCampaign,
      }

    case 'DELETE_CAMPAIGN':
      const filterOut = (campaigns: Campaign[]) =>
        campaigns.filter(campaign => campaign.campaign_id !== action.payload)

      return {
        ...state,
        campaigns: filterOut(state.campaigns),
        featuredCampaigns: filterOut(state.featuredCampaigns),
        userCampaigns: filterOut(state.userCampaigns),
        currentCampaign: state.currentCampaign?.campaign_id === action.payload
          ? null
          : state.currentCampaign,
      }

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }

    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } }

    case 'SET_PAGINATION':
      return { ...state, pagination: { ...state.pagination, ...action.payload } }

    case 'RESET_CAMPAIGNS':
      return {
        ...state,
        campaigns: [],
        pagination: { ...initialState.pagination },
        searchQuery: '',
        filters: { ...initialState.filters },
      }

    default:
      return state
  }
}

interface CampaignContextType {
  state: CampaignState
  fetchCampaigns: (options?: { page?: number; reset?: boolean }) => Promise<void>
  fetchFeaturedCampaigns: () => Promise<void>
  fetchUserCampaigns: () => Promise<void>
  fetchCampaign: (id: number) => Promise<void>
  createCampaign: (campaignData: any) => Promise<Campaign | null>
  updateCampaign: (id: number, updates: Partial<Campaign>) => Promise<void>
  deleteCampaign: (id: number) => Promise<void>
  setSearchQuery: (query: string) => void
  setFilters: (filters: Partial<CampaignState['filters']>) => void
  resetCampaigns: () => void
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined)

interface CampaignProviderProps {
  children: ReactNode
}

export function CampaignProvider({ children }: CampaignProviderProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [state, dispatch] = useReducer(campaignReducer, initialState)

  const fetchCampaigns = useCallback(async (options: { page?: number; reset?: boolean } = {}) => {
    try {
      const { page = 1, reset = false } = options

      if (reset) {
        dispatch({ type: 'RESET_CAMPAIGNS' })
      }

      dispatch({ type: 'SET_LOADING', payload: true })

      const params = new URLSearchParams({
        page: page.toString(),
        limit: state.pagination.limit.toString(),
        search: state.searchQuery,
        category: state.filters.category,
        status: state.filters.status,
        location: state.filters.location,
        verified: state.filters.verified?.toString() || '',
      })

      const response = await fetch(`/api/campaigns?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch campaigns')
      }

      const data = await response.json()

      if (page === 1 || reset) {
        dispatch({ type: 'SET_CAMPAIGNS', payload: data.campaigns })
      } else {
        dispatch({ type: 'SET_CAMPAIGNS', payload: [...state.campaigns, ...data.campaigns] })
      }

      dispatch({
        type: 'SET_PAGINATION',
        payload: {
          page: data.pagination.page,
          total: data.pagination.total,
          hasMore: data.pagination.hasMore,
        },
      })

    } catch (error) {
      console.error('Error fetching campaigns:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load campaigns' })
      toast({
        title: 'Error',
        description: 'Failed to load campaigns',
        variant: 'destructive',
      })
    }
  }, [state.pagination.limit, state.searchQuery, state.filters, state.campaigns, toast])

  const fetchFeaturedCampaigns = useCallback(async () => {
    try {
      const response = await fetch('/api/campaigns?featured=true&limit=6')

      if (!response.ok) {
        throw new Error('Failed to fetch featured campaigns')
      }

      const data = await response.json()
      dispatch({ type: 'SET_FEATURED_CAMPAIGNS', payload: data.campaigns })

    } catch (error) {
      console.error('Error fetching featured campaigns:', error)
    }
  }, [])

  const fetchUserCampaigns = useCallback(async () => {
    if (!session?.user) return

    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      const response = await fetch('/api/campaigns/user')

      if (!response.ok) {
        throw new Error('Failed to fetch user campaigns')
      }

      const data = await response.json()
      dispatch({ type: 'SET_USER_CAMPAIGNS', payload: data.campaigns })
      dispatch({ type: 'SET_LOADING', payload: false })

    } catch (error) {
      console.error('Error fetching user campaigns:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load your campaigns' })
      toast({
        title: 'Error',
        description: 'Failed to load your campaigns',
        variant: 'destructive',
      })
    }
  }, [session, toast])

  const fetchCampaign = useCallback(async (id: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      const response = await fetch(`/api/campaigns/${id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch campaign')
      }

      const data = await response.json()
      dispatch({ type: 'SET_CURRENT_CAMPAIGN', payload: data.campaign })

    } catch (error) {
      console.error('Error fetching campaign:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load campaign' })
      toast({
        title: 'Error',
        description: 'Failed to load campaign',
        variant: 'destructive',
      })
    }
  }, [toast])

  const createCampaign = useCallback(async (campaignData: any): Promise<Campaign | null> => {
    if (!session?.user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to create a campaign',
        variant: 'destructive',
      })
      return null
    }

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create campaign')
      }

      const data = await response.json()
      dispatch({ type: 'ADD_CAMPAIGN', payload: data.campaign })

      toast({
        title: 'Success!',
        description: 'Campaign created successfully',
        variant: 'success',
      })

      return data.campaign

    } catch (error) {
      console.error('Error creating campaign:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create campaign',
        variant: 'destructive',
      })
      return null
    }
  }, [session, toast])

  const updateCampaign = useCallback(async (id: number, updates: Partial<Campaign>) => {
    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update campaign')
      }

      const data = await response.json()
      dispatch({ type: 'UPDATE_CAMPAIGN', payload: { id, updates: data.campaign } })

      toast({
        title: 'Success!',
        description: 'Campaign updated successfully',
        variant: 'success',
      })

    } catch (error) {
      console.error('Error updating campaign:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update campaign',
        variant: 'destructive',
      })
    }
  }, [toast])

  const deleteCampaign = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete campaign')
      }

      dispatch({ type: 'DELETE_CAMPAIGN', payload: id })

      toast({
        title: 'Success!',
        description: 'Campaign deleted successfully',
        variant: 'success',
      })

    } catch (error) {
      console.error('Error deleting campaign:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete campaign',
        variant: 'destructive',
      })
    }
  }, [toast])

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query })
  }, [])

  const setFilters = useCallback((filters: Partial<CampaignState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters })
  }, [])

  const resetCampaigns = useCallback(() => {
    dispatch({ type: 'RESET_CAMPAIGNS' })
  }, [])

  const value: CampaignContextType = {
    state,
    fetchCampaigns,
    fetchFeaturedCampaigns,
    fetchUserCampaigns,
    fetchCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    setSearchQuery,
    setFilters,
    resetCampaigns,
  }

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  )
}

export function useCampaigns() {
  const context = useContext(CampaignContext)
  if (context === undefined) {
    throw new Error('useCampaigns must be used within a CampaignProvider')
  }
  return context
}

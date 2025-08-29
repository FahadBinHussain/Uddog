'use client'

import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'

// Types
interface User {
  user_id: number
  name: string
  email: string
  role: 'donor' | 'creator' | 'admin'
  dateJoined: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  totalDonated?: number
  totalRaised?: number
  campaignCount?: number
  donationCount?: number
  verifiedCampaigns?: number
  isEmailVerified?: boolean
  preferences?: {
    emailNotifications: boolean
    smsNotifications: boolean
    marketingEmails: boolean
    publicProfile: boolean
  }
}

interface UserProfile {
  user_id: number
  name: string
  email: string
  role: string
  dateJoined: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  socialLinks?: {
    twitter?: string
    facebook?: string
    instagram?: string
    linkedin?: string
  }
  stats: {
    totalDonated: number
    totalRaised: number
    campaignCount: number
    donationCount: number
    verifiedCampaigns: number
  }
  preferences: {
    emailNotifications: boolean
    smsNotifications: boolean
    marketingEmails: boolean
    publicProfile: boolean
    twoFactorEnabled: boolean
  }
}

interface UserState {
  currentUser: User | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
  updating: boolean
  isOnline: boolean
  lastActive: string | null
}

type UserAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_UPDATING'; payload: boolean }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'SET_PROFILE'; payload: UserProfile | null }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'SET_LAST_ACTIVE'; payload: string }
  | { type: 'RESET_USER' }

const initialState: UserState = {
  currentUser: null,
  profile: null,
  loading: false,
  error: null,
  updating: false,
  isOnline: true,
  lastActive: null,
}

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false, updating: false }

    case 'SET_UPDATING':
      return { ...state, updating: action.payload }

    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload, loading: false, error: null }

    case 'SET_PROFILE':
      return { ...state, profile: action.payload, loading: false, error: null }

    case 'UPDATE_USER':
      return {
        ...state,
        currentUser: state.currentUser ? { ...state.currentUser, ...action.payload } : null,
        updating: false,
        error: null
      }

    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: state.profile ? { ...state.profile, ...action.payload } : null,
        updating: false,
        error: null
      }

    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload }

    case 'SET_LAST_ACTIVE':
      return { ...state, lastActive: action.payload }

    case 'RESET_USER':
      return { ...initialState }

    default:
      return state
  }
}

interface UserContextType {
  state: UserState
  fetchProfile: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  deleteAccount: () => Promise<void>
  uploadAvatar: (file: File) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  enableTwoFactor: () => Promise<{ qrCode: string; backupCodes: string[] }>
  disableTwoFactor: (code: string) => Promise<void>
  exportData: () => Promise<Blob>
  refreshStats: () => Promise<void>
  updateLastActive: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [state, dispatch] = useReducer(userReducer, initialState)

  // Initialize user from session
  useEffect(() => {
    if (status === 'loading') return

    if (session?.user) {
      dispatch({
        type: 'SET_CURRENT_USER',
        payload: {
          user_id: parseInt(session.user.id),
          name: session.user.name || '',
          email: session.user.email || '',
          role: session.user.role as 'donor' | 'creator' | 'admin',
          dateJoined: new Date().toISOString(), // This should come from the session
        }
      })
      fetchProfile()
    } else {
      dispatch({ type: 'RESET_USER' })
    }
  }, [session, status])

  // Track online status
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true })
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false })

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Track user activity
  useEffect(() => {
    const updateActivity = () => {
      dispatch({ type: 'SET_LAST_ACTIVE', payload: new Date().toISOString() })
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => document.addEventListener(event, updateActivity, true))

    return () => {
      events.forEach(event => document.removeEventListener(event, updateActivity, true))
    }
  }, [])

  const fetchProfile = useCallback(async () => {
    if (!session?.user) return

    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      const response = await fetch('/api/users/profile')

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()
      dispatch({ type: 'SET_PROFILE', payload: data.profile })

    } catch (error) {
      console.error('Error fetching profile:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load profile' })
    }
  }, [session])

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      dispatch({ type: 'SET_UPDATING', payload: true })

      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update profile')
      }

      const data = await response.json()
      dispatch({ type: 'UPDATE_PROFILE', payload: data.profile })

      toast({
        title: 'Success!',
        description: 'Profile updated successfully',
        variant: 'success',
      })

    } catch (error) {
      console.error('Error updating profile:', error)
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update profile' })
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      })
    }
  }, [toast])

  const updatePreferences = useCallback(async (preferences: Partial<UserProfile['preferences']>) => {
    try {
      dispatch({ type: 'SET_UPDATING', payload: true })

      const response = await fetch('/api/users/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error('Failed to update preferences')
      }

      const data = await response.json()
      dispatch({ type: 'UPDATE_PROFILE', payload: { preferences: data.preferences } })

      toast({
        title: 'Success!',
        description: 'Preferences updated successfully',
        variant: 'success',
      })

    } catch (error) {
      console.error('Error updating preferences:', error)
      toast({
        title: 'Error',
        description: 'Failed to update preferences',
        variant: 'destructive',
      })
    }
  }, [toast])

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      dispatch({ type: 'SET_UPDATING', payload: true })

      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to change password')
      }

      dispatch({ type: 'SET_UPDATING', payload: false })

      toast({
        title: 'Success!',
        description: 'Password changed successfully',
        variant: 'success',
      })

    } catch (error) {
      console.error('Error changing password:', error)
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to change password' })
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to change password',
        variant: 'destructive',
      })
    }
  }, [toast])

  const deleteAccount = useCallback(async () => {
    try {
      dispatch({ type: 'SET_UPDATING', payload: true })

      const response = await fetch('/api/users/delete', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete account')
      }

      dispatch({ type: 'RESET_USER' })

      toast({
        title: 'Account Deleted',
        description: 'Your account has been permanently deleted',
        variant: 'success',
      })

      // Redirect to home or sign out
      window.location.href = '/'

    } catch (error) {
      console.error('Error deleting account:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete account',
        variant: 'destructive',
      })
    }
  }, [toast])

  const uploadAvatar = useCallback(async (file: File) => {
    try {
      dispatch({ type: 'SET_UPDATING', payload: true })

      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/users/avatar', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload avatar')
      }

      const data = await response.json()
      dispatch({ type: 'UPDATE_PROFILE', payload: { avatar: data.avatarUrl } })

      toast({
        title: 'Success!',
        description: 'Avatar updated successfully',
        variant: 'success',
      })

    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast({
        title: 'Error',
        description: 'Failed to upload avatar',
        variant: 'destructive',
      })
    }
  }, [toast])

  const verifyEmail = useCallback(async (token: string) => {
    try {
      const response = await fetch('/api/users/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      if (!response.ok) {
        throw new Error('Invalid or expired verification token')
      }

      dispatch({ type: 'UPDATE_PROFILE', payload: { isEmailVerified: true } })

      toast({
        title: 'Email Verified!',
        description: 'Your email has been successfully verified',
        variant: 'success',
      })

    } catch (error) {
      console.error('Error verifying email:', error)
      toast({
        title: 'Verification Failed',
        description: error instanceof Error ? error.message : 'Failed to verify email',
        variant: 'destructive',
      })
    }
  }, [toast])

  const enableTwoFactor = useCallback(async () => {
    try {
      const response = await fetch('/api/users/2fa/enable', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to enable two-factor authentication')
      }

      const data = await response.json()
      return { qrCode: data.qrCode, backupCodes: data.backupCodes }

    } catch (error) {
      console.error('Error enabling 2FA:', error)
      toast({
        title: 'Error',
        description: 'Failed to enable two-factor authentication',
        variant: 'destructive',
      })
      throw error
    }
  }, [toast])

  const disableTwoFactor = useCallback(async (code: string) => {
    try {
      const response = await fetch('/api/users/2fa/disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        throw new Error('Invalid authentication code')
      }

      dispatch({ type: 'UPDATE_PROFILE', payload: {
        preferences: { ...state.profile?.preferences, twoFactorEnabled: false }
      } })

      toast({
        title: 'Success!',
        description: 'Two-factor authentication has been disabled',
        variant: 'success',
      })

    } catch (error) {
      console.error('Error disabling 2FA:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to disable two-factor authentication',
        variant: 'destructive',
      })
    }
  }, [toast, state.profile])

  const exportData = useCallback(async () => {
    try {
      const response = await fetch('/api/users/export')

      if (!response.ok) {
        throw new Error('Failed to export data')
      }

      const blob = await response.blob()

      toast({
        title: 'Export Complete',
        description: 'Your data has been exported successfully',
        variant: 'success',
      })

      return blob

    } catch (error) {
      console.error('Error exporting data:', error)
      toast({
        title: 'Export Failed',
        description: 'Failed to export your data',
        variant: 'destructive',
      })
      throw error
    }
  }, [toast])

  const refreshStats = useCallback(async () => {
    try {
      const response = await fetch('/api/users/stats')

      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data = await response.json()
      dispatch({ type: 'UPDATE_PROFILE', payload: { stats: data.stats } })

    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }, [])

  const updateLastActive = useCallback(() => {
    dispatch({ type: 'SET_LAST_ACTIVE', payload: new Date().toISOString() })
  }, [])

  const value: UserContextType = {
    state,
    fetchProfile,
    updateProfile,
    updatePreferences,
    changePassword,
    deleteAccount,
    uploadAvatar,
    verifyEmail,
    enableTwoFactor,
    disableTwoFactor,
    exportData,
    refreshStats,
    updateLastActive,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

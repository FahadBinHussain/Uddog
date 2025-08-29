'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Save,
  ArrowLeft,
  Upload,
  X,
  AlertTriangle,
  CheckCircle,
  Calendar,
  DollarSign,
  MapPin,
  Target,
  Image as ImageIcon,
  Trash2,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/utils'

interface Campaign {
  campaign_id: number
  title: string
  description: string
  goalAmount: number
  currentAmount: number
  status: string
  createdAt: string
  endDate?: string
  category: string
  location: string
  images: string[]
  user: {
    name: string
    email: string
  }
  _count: {
    donations: number
  }
}

interface FormData {
  title: string
  description: string
  goalAmount: string
  category: string
  location: string
  endDate: string
  images: string[]
  status: string
}

const CATEGORIES = [
  'medical',
  'education',
  'emergency',
  'community',
  'animals',
  'environment',
  'sports',
  'creative',
  'business',
  'other'
]

const CAMPAIGN_STATUSES = [
  'active',
  'paused',
  'completed'
]

export default function EditCampaignPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    goalAmount: '',
    category: '',
    location: '',
    endDate: '',
    images: [],
    status: 'active'
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasChanges, setHasChanges] = useState(false)

  const campaignId = Array.isArray(params.id) ? params.id[0] : params.id

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push(`/auth/signin?callbackUrl=/campaigns/${campaignId}/edit`)
      return
    }
    fetchCampaign()
  }, [campaignId, session, status, router])

  useEffect(() => {
    // Check for changes
    if (!campaign) return

    const hasFormChanges =
      formData.title !== campaign.title ||
      formData.description !== campaign.description ||
      formData.goalAmount !== campaign.goalAmount.toString() ||
      formData.category !== campaign.category ||
      formData.location !== campaign.location ||
      formData.status !== campaign.status ||
      (formData.endDate || '') !== (campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : '') ||
      JSON.stringify(formData.images) !== JSON.stringify(campaign.images)

    setHasChanges(hasFormChanges)
  }, [formData, campaign])

  const fetchCampaign = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/campaigns/${campaignId}`)

      if (!response.ok) {
        throw new Error('Campaign not found')
      }

      const data = await response.json()
      const campaignData = data.campaign

      // Check if user owns this campaign
      if (campaignData.user.email !== session?.user?.email && session?.user?.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to edit this campaign.",
          variant: "destructive"
        })
        router.push(`/campaigns/${campaignId}`)
        return
      }

      setCampaign(campaignData)
      setFormData({
        title: campaignData.title,
        description: campaignData.description,
        goalAmount: campaignData.goalAmount.toString(),
        category: campaignData.category,
        location: campaignData.location,
        endDate: campaignData.endDate ? new Date(campaignData.endDate).toISOString().split('T')[0] : '',
        images: campaignData.images || [],
        status: campaignData.status
      })
    } catch (error) {
      console.error('Error fetching campaign:', error)
      toast({
        title: "Error",
        description: "Failed to load campaign. Please try again.",
        variant: "destructive"
      })
      router.push('/campaigns')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length > 5000) {
      newErrors.description = 'Description cannot exceed 5000 characters'
    }

    const goalAmount = parseFloat(formData.goalAmount)
    if (!formData.goalAmount || isNaN(goalAmount) || goalAmount < 1) {
      newErrors.goalAmount = 'Goal amount must be at least $1'
    } else if (goalAmount > 1000000) {
      newErrors.goalAmount = 'Goal amount cannot exceed $1,000,000'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (formData.endDate) {
      const endDate = new Date(formData.endDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (endDate < today) {
        newErrors.endDate = 'End date cannot be in the past'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving.",
        variant: "destructive"
      })
      return
    }

    try {
      setSaving(true)

      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        goalAmount: parseFloat(formData.goalAmount),
        category: formData.category,
        location: formData.location.trim(),
        endDate: formData.endDate || null,
        images: formData.images,
        status: formData.status
      }

      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update campaign')
      }

      toast({
        title: "Success",
        description: "Campaign updated successfully!",
      })

      // Refresh campaign data
      fetchCampaign()

    } catch (error: any) {
      console.error('Error updating campaign:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update campaign. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleImageAdd = (url: string) => {
    if (formData.images.length >= 5) {
      toast({
        title: "Limit Reached",
        description: "You can only add up to 5 images per campaign.",
        variant: "destructive"
      })
      return
    }

    setFormData({
      ...formData,
      images: [...formData.images, url]
    })
  }

  const handleImageRemove = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    })
  }

  const handleDeleteCampaign = async () => {
    if (!campaign) return

    const confirmMessage = campaign._count.donations > 0
      ? "This campaign has received donations and cannot be deleted. You can pause it instead."
      : "Are you sure you want to delete this campaign? This action cannot be undone."

    if (campaign._count.donations > 0) {
      toast({
        title: "Cannot Delete",
        description: confirmMessage,
        variant: "destructive"
      })
      return
    }

    if (!confirm(confirmMessage)) {
      return
    }

    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete campaign')
      }

      toast({
        title: "Success",
        description: "Campaign deleted successfully.",
      })

      router.push('/dashboard')

    } catch (error: any) {
      console.error('Error deleting campaign:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete campaign. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading campaign...</p>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Campaign Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The campaign you're trying to edit doesn't exist or has been removed.
            </p>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/campaigns/${campaignId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaign
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Campaign</h1>
            <p className="text-muted-foreground">
              Make changes to your fundraising campaign
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
            {campaign.status}
          </Badge>
          <Link href={`/campaigns/${campaignId}`}>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </Link>
        </div>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(campaign.currentAmount)}
              </div>
              <div className="text-sm text-muted-foreground">Raised</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {campaign._count.donations}
              </div>
              <div className="text-sm text-muted-foreground">Donations</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((campaign.currentAmount / campaign.goalAmount) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">of Goal</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warning for campaigns with donations */}
      {campaign._count.donations > 0 && (
        <Alert className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This campaign has received donations. Some changes may affect your donors' expectations.
            Consider posting an update to explain any major changes.
          </AlertDescription>
        </Alert>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Update your campaign's core details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter your campaign title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell your story..."
                rows={8}
                className={errors.description ? 'border-red-500' : ''}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{errors.description && <span className="text-red-500">{errors.description}</span>}</span>
                <span>{formData.description.length}/5000</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goalAmount">Funding Goal *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="goalAmount"
                    type="number"
                    value={formData.goalAmount}
                    onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
                    placeholder="0.00"
                    className={`pl-10 ${errors.goalAmount ? 'border-red-500' : ''}`}
                    min="1"
                    step="0.01"
                  />
                </div>
                {errors.goalAmount && (
                  <p className="text-sm text-red-500">{errors.goalAmount}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, Country"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className={`pl-10 ${errors.endDate ? 'border-red-500' : ''}`}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {errors.endDate && (
                  <p className="text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Status */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Status</CardTitle>
            <CardDescription>
              Control your campaign's visibility and activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CAMPAIGN_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {formData.status === 'active' && "Campaign is visible and accepting donations"}
                {formData.status === 'paused' && "Campaign is visible but not accepting donations"}
                {formData.status === 'completed' && "Campaign has ended and is no longer accepting donations"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Campaign Images
            </CardTitle>
            <CardDescription>
              Add up to 5 images to showcase your campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Campaign image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleImageRemove(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {formData.images.length < 5 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Image upload functionality would go here
                </p>
                <Button type="button" variant="outline" disabled>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Images
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteCampaign}
            disabled={campaign._count.donations > 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Campaign
          </Button>

          <div className="flex items-center gap-4">
            <Link href={`/campaigns/${campaignId}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={saving || !hasChanges}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>

      {/* Unsaved changes warning */}
      {hasChanges && (
        <div className="fixed bottom-4 right-4">
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You have unsaved changes
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}

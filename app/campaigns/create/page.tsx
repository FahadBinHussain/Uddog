'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Upload,
  X,
  DollarSign,
  Calendar,
  MapPin,
  Target,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Save,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency, validateCampaignData } from '@/lib/utils'
import { useCampaigns } from '@/contexts/campaign-context'

interface FormData {
  title: string
  description: string
  goalAmount: string
  category: string
  location: string
  endDate: string
  images: string[]
}

export default function CreateCampaignPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const { createCampaign } = useCampaigns()

  const [step, setStep] = useState(1)
  const totalSteps = 4
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    goalAmount: '',
    category: '',
    location: '',
    endDate: '',
    images: []
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/campaigns/create')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const categories = [
    'Medical', 'Education', 'Emergency', 'Community', 'Animals',
    'Environment', 'Sports', 'Arts', 'Technology', 'Other'
  ]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (stepNumber) {
      case 1:
        if (!formData.title.trim()) {
          newErrors.title = 'Campaign title is required'
        } else if (formData.title.trim().length < 5) {
          newErrors.title = 'Title must be at least 5 characters long'
        } else if (formData.title.trim().length > 100) {
          newErrors.title = 'Title cannot exceed 100 characters'
        }

        if (!formData.description.trim()) {
          newErrors.description = 'Campaign description is required'
        } else if (formData.description.trim().length < 50) {
          newErrors.description = 'Description must be at least 50 characters long'
        } else if (formData.description.trim().length > 5000) {
          newErrors.description = 'Description cannot exceed 5000 characters'
        }
        break

      case 2:
        if (!formData.goalAmount) {
          newErrors.goalAmount = 'Fundraising goal is required'
        } else {
          const amount = parseFloat(formData.goalAmount)
          if (isNaN(amount) || amount < 100) {
            newErrors.goalAmount = 'Goal must be at least $100'
          } else if (amount > 1000000) {
            newErrors.goalAmount = 'Goal cannot exceed $1,000,000'
          }
        }

        if (!formData.category) {
          newErrors.category = 'Please select a category'
        }
        break

      case 3:
        // Location and end date are optional, but if provided should be valid
        if (formData.endDate) {
          const endDate = new Date(formData.endDate)
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          if (endDate <= today) {
            newErrors.endDate = 'End date must be in the future'
          }
        }
        break

      case 4:
        // Final validation
        const validation = validateCampaignData(formData)
        if (!validation.isValid) {
          validation.errors.forEach(error => {
            newErrors.general = error
          })
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploadingImage(true)

    try {
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          toast({
            title: 'File too large',
            description: 'Images must be less than 5MB',
            variant: 'destructive'
          })
          continue
        }

        if (!file.type.startsWith('image/')) {
          toast({
            title: 'Invalid file type',
            description: 'Only image files are allowed',
            variant: 'destructive'
          })
          continue
        }

        // Create form data for upload
        const uploadData = new FormData()
        uploadData.append('image', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData
        })

        if (response.ok) {
          const { url } = await response.json()
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, url]
          }))
        } else {
          toast({
            title: 'Upload failed',
            description: 'Failed to upload image. Please try again.',
            variant: 'destructive'
          })
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload error',
        description: 'An unexpected error occurred during upload',
        variant: 'destructive'
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setLoading(true)

    try {
      const campaignData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        goalAmount: parseFloat(formData.goalAmount),
        category: formData.category,
        location: formData.location.trim(),
        endDate: formData.endDate || null,
        images: formData.images
      }

      const campaign = await createCampaign(campaignData)

      if (campaign) {
        toast({
          title: 'Campaign Created!',
          description: 'Your campaign has been created successfully and is now live.',
          variant: 'success'
        })

        // Redirect to the new campaign page
        setTimeout(() => {
          router.push(`/campaigns/${campaign.campaign_id}`)
        }, 2000)
      }
    } catch (error) {
      console.error('Campaign creation error:', error)
      toast({
        title: 'Error',
        description: 'Failed to create campaign. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Campaign Basics
              </CardTitle>
              <CardDescription>
                Tell people what you're raising money for and why it matters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter a compelling title for your campaign"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  maxLength={100}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{errors.title && <span className="text-red-500">{errors.title}</span>}</span>
                  <span>{formData.title.length}/100</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Campaign Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your cause, why it's important, and how the funds will be used. Be specific and compelling."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={8}
                  maxLength={5000}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{errors.description && <span className="text-red-500">{errors.description}</span>}</span>
                  <span>{formData.description.length}/5000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Fundraising Details
              </CardTitle>
              <CardDescription>
                Set your fundraising goal and choose a category for your campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="goalAmount">Fundraising Goal (USD) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="goalAmount"
                    type="number"
                    placeholder="10000"
                    value={formData.goalAmount}
                    onChange={(e) => handleInputChange('goalAmount', e.target.value)}
                    className="pl-10"
                    min="100"
                    max="1000000"
                    step="1"
                  />
                </div>
                {errors.goalAmount && (
                  <p className="text-xs text-red-500">{errors.goalAmount}</p>
                )}
                {formData.goalAmount && !errors.goalAmount && (
                  <p className="text-xs text-muted-foreground">
                    Goal: {formatCurrency(parseFloat(formData.goalAmount) || 0)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Campaign Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs text-red-500">{errors.category}</p>
                )}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Fundraising Tips
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Set a realistic and achievable goal</li>
                  <li>• Consider all costs including fees and taxes</li>
                  <li>• You can always create additional campaigns if needed</li>
                  <li>• Campaigns with clear goals tend to be more successful</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Additional Details
              </CardTitle>
              <CardDescription>
                Add location information and set an end date for your campaign (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="location"
                    placeholder="City, State/Country"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Help donors find campaigns in their area
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Campaign End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="pl-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {errors.endDate && (
                  <p className="text-xs text-red-500">{errors.endDate}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Leave blank for no end date. You can always update this later.
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                  Campaign Best Practices
                </h4>
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <li>• Campaigns with photos raise 3x more money</li>
                  <li>• Regular updates keep donors engaged</li>
                  <li>• Share your campaign on social media</li>
                  <li>• Thank your donors personally when possible</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" />
                Images & Review
              </CardTitle>
              <CardDescription>
                Add compelling images and review your campaign before publishing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Campaign Images</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Drag and drop images here, or click to select
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                      id="image-upload"
                      disabled={uploadingImage}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Images
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Maximum 5MB per image. JPG, PNG, GIF supported.
                    </p>
                  </div>
                </div>

                {/* Uploaded Images */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Campaign image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Campaign Preview */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Campaign Preview
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">{formData.title || 'Campaign Title'}</h4>
                    <p className="text-sm text-muted-foreground">by {session.user?.name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge>{formData.category || 'Category'}</Badge>
                    {formData.location && (
                      <Badge variant="outline">
                        <MapPin className="w-3 h-3 mr-1" />
                        {formData.location}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm line-clamp-3">
                    {formData.description || 'Campaign description will appear here...'}
                  </p>
                  <div className="text-lg font-bold">
                    Goal: {formatCurrency(parseFloat(formData.goalAmount) || 0)}
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {errors.general && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/campaigns"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaigns
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Your Campaign
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Tell your story and start raising funds for your cause
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round((step / totalSteps) * 100)}% Complete
            </span>
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-4">
            {step < totalSteps ? (
              <Button onClick={nextStep} className="flex items-center">
                Next
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creating Campaign...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Publish Campaign
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Need Help?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
            <div>
              <h4 className="font-medium mb-2">Campaign Guidelines</h4>
              <ul className="space-y-1">
                <li>• Be honest and transparent about your cause</li>
                <li>• Use clear, high-quality images</li>
                <li>• Provide regular updates to donors</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Support Resources</h4>
              <ul className="space-y-1">
                <li>• <a href="/help" className="underline">Campaign Creation Guide</a></li>
                <li>• <a href="/contact" className="underline">Contact Support</a></li>
                <li>• <a href="/guidelines" className="underline">Community Guidelines</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

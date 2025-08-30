"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Heart,
  Share,
  Flag,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  Edit,
  TrendingUp,
  Clock,
  Target,
  Award,
  FileText,
  Send,
} from "lucide-react";
import {
  formatCurrency,
  calculatePercentage,
  formatRelativeTime,
  formatDate,
} from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { StripeProvider } from "@/components/stripe-provider";
import { PaymentForm } from "@/components/payment-form";

interface Campaign {
  campaign_id: number;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  status: string;
  createdAt: string;
  endDate?: string;
  category: string;
  location: string;
  images: string[];
  user: {
    name: string;
    email: string;
  };
  donations: Donation[];
  comments: Comment[];
  impactStories: ImpactStory[];
  isVerified: boolean;
  verificationInfo?: {
    status: string;
    verifiedAt: string;
    admin: {
      name: string;
    };
  };
  _count: {
    donations: number;
    comments: number;
    fraudReports: number;
  };
}

interface Donation {
  donation_id: number;
  amount: number;
  donationDate: string;
  isRecurring: boolean;
  user: {
    name: string;
  };
}

interface Comment {
  comment_id: number;
  content: string;
  createdAt: string;
  user: {
    name: string;
  };
}

interface ImpactStory {
  story_id: number;
  title: string;
  content: string;
  postedAt: string;
}

export default function CampaignPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [donating, setDonating] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("story");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const campaignId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/campaigns/${campaignId}`);

      if (!response.ok) {
        throw new Error("Campaign not found");
      }

      const data = await response.json();
      setCampaign(data.campaign);
    } catch (error) {
      console.error("Error fetching campaign:", error);
      toast({
        title: "Error",
        description: "Failed to load campaign. Please try again.",
        variant: "destructive",
      });
      router.push("/campaigns");
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async () => {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=/campaigns/${campaignId}`);
      return;
    }

    const amount = parseFloat(donationAmount);
    if (!amount || amount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount (minimum $1).",
        variant: "destructive",
      });
      return;
    }

    try {
      setDonating(true);

      // Create payment intent
      const paymentResponse = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          campaignId: parseInt(campaignId),
          isRecurring,
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.error || "Failed to create payment intent");
      }

      const { clientSecret: secret } = await paymentResponse.json();
      setClientSecret(secret);
      setShowPaymentModal(true);
    } catch (error) {
      console.error("Error creating donation:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to process donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDonating(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setClientSecret(null);
    setDonationAmount("");
    fetchCampaign(); // Refresh campaign data
    toast({
      title: "Thank you!",
      description: "Your donation has been processed successfully.",
      variant: "success",
    });
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setClientSecret(null);
  };

  const handleComment = async () => {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=/campaigns/${campaignId}`);
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Invalid Comment",
        description: "Please enter a comment.",
        variant: "destructive",
      });
      return;
    }

    try {
      setCommenting(true);

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: parseInt(campaignId),
          content: newComment.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      toast({
        title: "Comment Posted",
        description: "Your comment has been added successfully.",
      });

      setNewComment("");
      fetchCampaign(); // Refresh to show new comment
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCommenting(false);
    }
  };

  const handleReport = async () => {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=/campaigns/${campaignId}`);
      return;
    }

    if (!reportReason.trim()) {
      toast({
        title: "Invalid Report",
        description: "Please provide a reason for reporting.",
        variant: "destructive",
      });
      return;
    }

    try {
      setReporting(true);

      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: parseInt(campaignId),
          reason: reportReason.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      toast({
        title: "Report Submitted",
        description: "Thank you for your report. We'll review it shortly.",
      });

      setReportReason("");
      setShowReportDialog(false);
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setReporting(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/campaigns/${campaignId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: campaign?.title,
          text: campaign?.description,
          url: url,
        });
      } catch (error) {
        // User cancelled the share
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: "Link Copied",
          description: "Campaign link has been copied to your clipboard.",
        });
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Campaign Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The campaign you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/campaigns">
              <Button>Browse Campaigns</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressPercentage = calculatePercentage(
    campaign.currentAmount,
    campaign.goalAmount,
  );
  const isOwner = session?.user?.id === campaign.user.email; // Adjust based on your user ID structure
  const isExpired = campaign.endDate && new Date(campaign.endDate) < new Date();
  const daysLeft = campaign.endDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(campaign.endDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline">{campaign.category}</Badge>
              {campaign.isVerified && (
                <Badge
                  variant="secondary"
                  className="text-green-700 bg-green-100"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified
                </Badge>
              )}
              <Badge
                variant={campaign.status === "active" ? "default" : "secondary"}
              >
                {campaign.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              {!isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReportDialog(true)}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </Button>
              )}
              {isOwner && (
                <Link href={`/campaigns/${campaignId}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {campaign.title}
          </h1>

          <div className="flex items-center gap-6 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              by {campaign.user.name}
            </div>
            {campaign.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {campaign.location}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Created {formatRelativeTime(campaign.createdAt)}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Campaign Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Images */}
            {campaign.images && campaign.images.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <Image
                      src={campaign.images[0]}
                      alt={campaign.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Campaign Tabs */}
            <Card>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <CardHeader>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="story">Story</TabsTrigger>
                    <TabsTrigger value="updates">
                      Updates ({campaign.impactStories.length})
                    </TabsTrigger>
                    <TabsTrigger value="comments">
                      Comments ({campaign.comments.length})
                    </TabsTrigger>
                    <TabsTrigger value="donations">
                      Donations ({campaign.donations.length})
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent>
                  <TabsContent value="story" className="space-y-4">
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">
                        {campaign.description}
                      </p>
                    </div>

                    {campaign.isVerified && campaign.verificationInfo && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          This campaign was verified by{" "}
                          {campaign.verificationInfo.admin.name} on{" "}
                          {formatDate(campaign.verificationInfo.verifiedAt)}
                        </AlertDescription>
                      </Alert>
                    )}
                  </TabsContent>

                  <TabsContent value="updates" className="space-y-4">
                    {campaign.impactStories.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No updates yet</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {campaign.impactStories.map((story) => (
                          <div
                            key={story.story_id}
                            className="border-l-4 border-blue-200 pl-4"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{story.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {formatRelativeTime(story.postedAt)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {story.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="comments" className="space-y-4">
                    {/* Add Comment Form */}
                    {session && (
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Leave a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          rows={3}
                        />
                        <Button
                          onClick={handleComment}
                          disabled={commenting || !newComment.trim()}
                          size="sm"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {commenting ? "Posting..." : "Post Comment"}
                        </Button>
                      </div>
                    )}

                    <Separator />

                    {/* Comments List */}
                    {campaign.comments.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No comments yet</p>
                        {!session && (
                          <p className="text-sm text-muted-foreground mt-2">
                            <Link
                              href={`/auth/signin?callbackUrl=/campaigns/${campaignId}`}
                              className="text-blue-600 hover:underline"
                            >
                              Sign in
                            </Link>{" "}
                            to leave a comment
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {campaign.comments.map((comment) => (
                          <div key={comment.comment_id} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {comment.user.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatRelativeTime(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="donations" className="space-y-4">
                    {campaign.donations.length === 0 ? (
                      <div className="text-center py-8">
                        <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          No donations yet
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Be the first to support this campaign!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {campaign.donations.map((donation) => (
                          <div
                            key={donation.donation_id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">
                                {donation.user.name} donated{" "}
                                {formatCurrency(donation.amount)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatRelativeTime(donation.donationDate)}
                                {donation.isRecurring && " • Recurring"}
                              </p>
                            </div>
                            <Heart className="w-5 h-5 text-red-500" />
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Column - Donation Widget */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {formatCurrency(campaign.currentAmount)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    raised of {formatCurrency(campaign.goalAmount)} goal
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Progress value={progressPercentage} className="h-3" />

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold">
                      {progressPercentage}%
                    </div>
                    <div className="text-xs text-muted-foreground">Funded</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {campaign._count.donations}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Donations
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {daysLeft !== null ? (isExpired ? "0" : daysLeft) : "∞"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Days left
                    </div>
                  </div>
                </div>

                {isExpired && (
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      This campaign has ended.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Donation Form */}
            {!isExpired && campaign.status === "active" && (
              <Card>
                <CardHeader>
                  <CardTitle>Support this campaign</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Donation Amount
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="pl-10"
                        min="1"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[10, 25, 50, 100].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setDonationAmount(amount.toString())}
                        className="text-xs"
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      id="recurring"
                      type="checkbox"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="recurring" className="text-sm">
                      Make this a monthly donation
                    </label>
                  </div>

                  <Button
                    onClick={handleDonate}
                    disabled={
                      donating ||
                      !donationAmount ||
                      parseFloat(donationAmount) < 1
                    }
                    className="w-full"
                    size="lg"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {donating ? "Processing..." : "Donate Now"}
                  </Button>

                  {!session && (
                    <p className="text-xs text-center text-muted-foreground">
                      <Link
                        href={`/auth/signin?callbackUrl=/campaigns/${campaignId}`}
                        className="text-blue-600 hover:underline"
                      >
                        Sign in
                      </Link>{" "}
                      to donate
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Share Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Share this campaign</CardTitle>
              </CardHeader>

              <CardContent>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="w-full"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share Campaign
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Report Dialog */}
        {showReportDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Report Campaign</CardTitle>
                <CardDescription>
                  Please provide a reason for reporting this campaign
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe why you're reporting this campaign..."
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  rows={4}
                />
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowReportDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReport}
                  disabled={reporting || !reportReason.trim()}
                  className="flex-1"
                >
                  {reporting ? "Submitting..." : "Submit Report"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Payment Modal */}
        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Your Donation</DialogTitle>
            </DialogHeader>
            {clientSecret && (
              <StripeProvider clientSecret={clientSecret}>
                <PaymentForm
                  clientSecret={clientSecret}
                  amount={Math.round(parseFloat(donationAmount || "0") * 100)}
                  campaignTitle={campaign?.title || "Unknown Campaign"}
                  onSuccess={handlePaymentSuccess}
                  onCancel={handlePaymentCancel}
                />
              </StripeProvider>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

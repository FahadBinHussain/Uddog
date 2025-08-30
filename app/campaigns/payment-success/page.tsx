"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<{
    amount?: number;
    campaignId?: string;
    campaignTitle?: string;
  }>({});

  useEffect(() => {
    // Get payment details from URL parameters
    const amount = searchParams.get("amount");
    const campaignId = searchParams.get("campaign_id");
    const campaignTitle = searchParams.get("campaign_title");
    const paymentIntentId = searchParams.get("payment_intent");

    if (paymentIntentId && amount && campaignId) {
      setPaymentDetails({
        amount: parseInt(amount),
        campaignId,
        campaignTitle: campaignTitle || "Unknown Campaign",
      });
    }

    setLoading(false);
  }, [searchParams]);

  const handleBackToCampaign = () => {
    if (paymentDetails.campaignId) {
      router.push(`/campaigns/${paymentDetails.campaignId}`);
    } else {
      router.push("/campaigns");
    }
  };

  const handleShare = () => {
    if (paymentDetails.campaignId) {
      const url = `${window.location.origin}/campaigns/${paymentDetails.campaignId}`;
      const text = `I just donated to "${paymentDetails.campaignTitle}" on UdDog! Join me in supporting this great cause.`;

      if (navigator.share) {
        navigator.share({
          title: "I Made a Donation!",
          text,
          url,
        }).catch(() => {
          // Fallback to copying to clipboard
          navigator.clipboard.writeText(`${text} ${url}`);
          toast({
            title: "Link Copied!",
            description: "Campaign link has been copied to your clipboard.",
          });
        });
      } else {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(`${text} ${url}`);
        toast({
          title: "Link Copied!",
          description: "Campaign link has been copied to your clipboard.",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-700">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900">
              Thank you for your generous donation!
            </p>
            {paymentDetails.amount && (
              <p className="text-2xl font-bold text-primary">
                ${(paymentDetails.amount / 100).toFixed(2)}
              </p>
            )}
            {paymentDetails.campaignTitle && (
              <p className="text-gray-600">
                to "{paymentDetails.campaignTitle}"
              </p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              Your donation has been processed successfully. A confirmation email
              has been sent to your registered email address.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleBackToCampaign}
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaign
            </Button>

            <Button
              onClick={handleShare}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Campaign
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Want to make a difference?{" "}
              <button
                onClick={() => router.push("/campaigns")}
                className="text-primary hover:underline"
              >
                Discover more campaigns
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

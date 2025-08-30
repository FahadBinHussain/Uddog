"use client";

import { useState } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  campaignTitle: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentForm({
  clientSecret,
  amount,
  campaignTitle,
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError("Payment system is not ready. Please try again.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/campaigns/payment-success`,
        },
        redirect: "if_required",
      });

      if (stripeError) {
        if (stripeError.type === "card_error" || stripeError.type === "validation_error") {
          setError(stripeError.message || "Payment failed. Please check your card details.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        // Payment succeeded
        toast({
          title: "Payment Successful!",
          description: `Thank you for your donation of $${(amount / 100).toFixed(2)} to ${campaignTitle}`,
          variant: "success",
        });
        onSuccess();
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Complete Your Donation
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          <p>Amount: <span className="font-semibold">${(amount / 100).toFixed(2)}</span></p>
          <p>Campaign: <span className="font-semibold">{campaignTitle}</span></p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border rounded-md p-3">
            <PaymentElement
              options={{
                layout: "tabs",
              }}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!stripe || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Donate $${(amount / 100).toFixed(2)}`
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

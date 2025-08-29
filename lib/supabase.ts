import { createClient } from "@supabase/supabase-js";

// Use NEXT_PUBLIC_ env vars for client-side access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Real-time subscription for campaign donations
export const subscribeToDonations = (
  campaignId: number,
  callback: (donation: any) => void,
) => {
  return supabase
    .channel(`donations-${campaignId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "Donation",
        filter: `campaign_id=eq.${campaignId}`,
      },
      callback,
    )
    .subscribe();
};

// Real-time subscription for campaign updates
export const subscribeToCampaignUpdates = (
  campaignId: number,
  callback: (update: any) => void,
) => {
  return supabase
    .channel(`campaign-${campaignId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "Campaign",
        filter: `campaign_id=eq.${campaignId}`,
      },
      callback,
    )
    .subscribe();
};

// Real-time subscription for comments
export const subscribeToComments = (
  campaignId: number,
  callback: (comment: any) => void,
) => {
  return supabase
    .channel(`comments-${campaignId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "Comment",
        filter: `campaign_id=eq.${campaignId}`,
      },
      callback,
    )
    .subscribe();
};

// Real-time subscription for verification status changes
export const subscribeToVerificationUpdates = (
  campaignId: number,
  callback: (verification: any) => void,
) => {
  return supabase
    .channel(`verification-${campaignId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "Verification",
        filter: `campaign_id=eq.${campaignId}`,
      },
      callback,
    )
    .subscribe();
};

// Broadcast donation events for real-time progress updates
export const broadcastDonation = async (campaignId: number, donation: any) => {
  return supabase.channel(`donations-${campaignId}`).send({
    type: "broadcast",
    event: "donation",
    payload: donation,
  });
};

// Helper function to unsubscribe from all channels
export const unsubscribeAll = () => {
  supabase.removeAllChannels();
};

// Helper function to get campaign progress in real-time
export const getCampaignProgress = async (campaignId: number) => {
  const { data, error } = await supabase
    .from("Campaign")
    .select("currentAmount, goalAmount")
    .eq("campaign_id", campaignId)
    .single();

  if (error) {
    console.error("Error fetching campaign progress:", error);
    return null;
  }

  return data;
};

// Real-time presence for active users on a campaign page
export const subscribeToPresence = (campaignId: number, userId: string) => {
  const channel = supabase.channel(`presence-${campaignId}`, {
    config: {
      presence: {
        key: userId,
      },
    },
  });

  channel
    .on("presence", { event: "sync" }, () => {
      console.log("Online users:", channel.presenceState());
    })
    .on("presence", { event: "join" }, ({ newPresences }) => {
      console.log("New users joined:", newPresences);
    })
    .on("presence", { event: "leave" }, ({ leftPresences }) => {
      console.log("Users left:", leftPresences);
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString(),
        });
      }
    });

  return channel;
};

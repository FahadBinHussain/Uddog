import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@uddog.com" },
    update: {},
    create: {
      name: "Platform Admin",
      email: "admin@uddog.com",
      passwordHash: adminPassword,
      role: "admin",
    },
  });
  console.log("✅ Created admin user:", admin.email);

  // Create sample users
  const users = [];
  for (let i = 1; i <= 5; i++) {
    const userPassword = await bcrypt.hash(`user${i}123`, 12);
    const user = await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: {
        name: `Sample User ${i}`,
        email: `user${i}@example.com`,
        passwordHash: userPassword,
        role: "creator",
      },
    });
    users.push(user);
    console.log(`✅ Created user: ${user.email}`);
  }

  // Create sample campaigns
  const campaigns = [];
  const campaignData = [
    {
      title: "Help Build a Community Garden",
      description:
        "We are raising funds to build a beautiful community garden in downtown Springfield. This garden will provide fresh produce for local families and create a green space for everyone to enjoy. Our goal is to create sustainable food sources while bringing the community together through gardening workshops and events.",
      goalAmount: 5000,
      category: "community",
      location: "Springfield, USA",
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      images: [
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1592419044706-39796d40b6ab?w=800&h=600&fit=crop",
      ],
    },
    {
      title: "Emergency Medical Fund for Sarah",
      description:
        "Our dear friend Sarah was recently diagnosed with a rare condition that requires expensive treatment not covered by insurance. She is a single mother of two who has always been there for others in need. Now it's our turn to help her during this difficult time. Every donation, no matter how small, will make a difference.",
      goalAmount: 15000,
      category: "medical",
      location: "Austin, Texas",
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      images: [
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
      ],
    },
    {
      title: "Save the Local Animal Shelter",
      description:
        "Our beloved animal shelter is facing closure due to funding cuts. This shelter has been home to hundreds of animals over the years, providing them with care, medical treatment, and finding them loving families. We need your help to keep the doors open and continue saving lives. Your donation will go directly to operational costs, veterinary care, and facility maintenance.",
      goalAmount: 25000,
      category: "animals",
      location: "Portland, Oregon",
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      images: [
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop",
      ],
    },
    {
      title: "Scholarship Fund for Underprivileged Students",
      description:
        "Education should be accessible to everyone, regardless of their economic background. This scholarship fund aims to provide financial assistance to talented students who cannot afford higher education. We believe that investing in education is investing in our future. Help us break the cycle of poverty through education.",
      goalAmount: 20000,
      category: "education",
      location: "Chicago, Illinois",
      endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days from now
      images: [
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
      ],
    },
    {
      title: "Hurricane Relief Fund",
      description:
        "Recent hurricanes have devastated our coastal communities, leaving thousands of families without homes, food, or basic necessities. This emergency relief fund will provide immediate assistance including temporary shelter, food supplies, medical aid, and help families rebuild their lives. Time is critical - these families need our help now.",
      goalAmount: 50000,
      category: "emergency",
      location: "Miami, Florida",
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      images: [
        "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop",
      ],
    },
  ];

  for (let i = 0; i < campaignData.length; i++) {
    const data = campaignData[i];
    const creator = users[i % users.length];

    const campaign = await prisma.campaign.create({
      data: {
        title: data.title,
        description: data.description,
        goalAmount: data.goalAmount,
        currentAmount: Math.floor(Math.random() * (data.goalAmount * 0.7)), // Random progress up to 70%
        status: "active",
        category: data.category,
        location: data.location,
        endDate: data.endDate,
        images: data.images,
        user_id: creator.user_id,
      },
    });
    campaigns.push(campaign);
    console.log(`✅ Created campaign: ${campaign.title}`);
  }

  // Create sample donations
  const donors = [];
  for (let i = 1; i <= 10; i++) {
    const donorPassword = await bcrypt.hash(`donor${i}123`, 12);
    const donor = await prisma.user.create({
      data: {
        name: `Donor ${i}`,
        email: `donor${i}@example.com`,
        passwordHash: donorPassword,
        role: "user",
      },
    });
    donors.push(donor);
  }
  console.log(`✅ Created ${donors.length} donor users`);

  // Create donations for each campaign
  for (const campaign of campaigns) {
    const donationCount = Math.floor(Math.random() * 15) + 5; // 5-20 donations per campaign

    for (let i = 0; i < donationCount; i++) {
      const donor = donors[Math.floor(Math.random() * donors.length)];
      const donationAmount = [10, 25, 50, 100, 250, 500][
        Math.floor(Math.random() * 6)
      ];
      const isRecurring = Math.random() < 0.15; // 15% chance of recurring donation

      // Random date within the last 30 days
      const donationDate = new Date(
        Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
      );

      await prisma.donation.create({
        data: {
          amount: donationAmount,
          donationDate,
          isRecurring,
          campaign_id: campaign.campaign_id,
          donor_id: donor.user_id,
        },
      });
    }
    console.log(`✅ Created ${donationCount} donations for: ${campaign.title}`);
  }

  // Update campaign current amounts based on actual donations
  for (const campaign of campaigns) {
    const totalDonations = await prisma.donation.aggregate({
      where: { campaign_id: campaign.campaign_id },
      _sum: { amount: true },
    });

    await prisma.campaign.update({
      where: { campaign_id: campaign.campaign_id },
      data: { currentAmount: totalDonations._sum.amount || 0 },
    });
  }

  // Create sample comments
  const commentTexts = [
    "This is such an amazing cause! Proud to support this initiative.",
    "Thank you for making a difference in our community.",
    "Donated what I could. Hoping this reaches the goal soon!",
    "This campaign touched my heart. Best of luck!",
    "Shared with my friends and family. Hope this helps!",
    "Great work organizing this. The community needs more people like you.",
    "Small donation but big support. Every bit helps!",
    "This is exactly what our city needs. Count me in!",
    "Inspiring to see people coming together for such a good cause.",
    "Wishing you all the success in reaching your goal!",
  ];

  for (const campaign of campaigns) {
    const commentCount = Math.floor(Math.random() * 8) + 2; // 2-10 comments per campaign

    for (let i = 0; i < commentCount; i++) {
      const commenter = [...users, ...donors][
        Math.floor(Math.random() * (users.length + donors.length))
      ];
      const commentText =
        commentTexts[Math.floor(Math.random() * commentTexts.length)];
      const commentDate = new Date(
        Date.now() - Math.floor(Math.random() * 25 * 24 * 60 * 60 * 1000),
      );

      await prisma.comment.create({
        data: {
          content: commentText,
          createdAt: commentDate,
          campaign_id: campaign.campaign_id,
          user_id: commenter.user_id,
        },
      });
    }
    console.log(`✅ Created ${commentCount} comments for: ${campaign.title}`);
  }

  // Create sample impact stories
  const impactStories = [
    {
      title: "Great Progress Update!",
      content:
        "We're thrilled to announce that we've reached 25% of our goal in just the first week! The support from the community has been overwhelming. We've already started purchasing seeds and tools for the garden.",
    },
    {
      title: "Medical Update - Good News!",
      content:
        "Sarah's treatment is going well! The doctors are optimistic about her recovery. We're halfway to our goal and every donation is making a real difference in her treatment journey.",
    },
    {
      title: "Animals Finding Homes",
      content:
        "Thanks to your support, we've been able to find homes for 15 animals this month! The shelter is still in need of funds, but we're making progress. Every donation helps us save more lives.",
    },
    {
      title: "First Scholarships Awarded",
      content:
        "We're excited to announce that our first three scholarships have been awarded to deserving students! These bright minds will now have the opportunity to pursue their dreams in higher education.",
    },
    {
      title: "Relief Supplies Distributed",
      content:
        "We've been able to distribute emergency supplies to over 200 families affected by the hurricane. Food, water, clothing, and temporary shelter have been provided. Thank you for making this possible!",
    },
  ];

  for (let i = 0; i < campaigns.length; i++) {
    const campaign = campaigns[i];
    const story = impactStories[i];

    await prisma.impactStory.create({
      data: {
        title: story.title,
        content: story.content,
        postedAt: new Date(
          Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000),
        ),
        campaign_id: campaign.campaign_id,
      },
    });
    console.log(`✅ Created impact story for: ${campaign.title}`);
  }

  // Create sample verifications (verify 60% of campaigns)
  const campaignsToVerify = campaigns.slice(
    0,
    Math.floor(campaigns.length * 0.6),
  );

  for (const campaign of campaignsToVerify) {
    await prisma.verification.create({
      data: {
        status: "verified",
        verifiedAt: new Date(
          Date.now() - Math.floor(Math.random() * 20 * 24 * 60 * 60 * 1000),
        ),
        campaign_id: campaign.campaign_id,
        verified_by: admin.user_id,
      },
    });
    console.log(`✅ Verified campaign: ${campaign.title}`);
  }

  console.log("🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`- Created 1 admin user`);
  console.log(`- Created ${users.length} creator users`);
  console.log(`- Created ${donors.length} donor users`);
  console.log(`- Created ${campaigns.length} campaigns`);
  console.log(`- Created donations for all campaigns`);
  console.log(`- Created comments for all campaigns`);
  console.log(`- Created ${campaigns.length} impact stories`);
  console.log(`- Verified ${campaignsToVerify.length} campaigns`);
  console.log("\n🔐 Login credentials:");
  console.log("Admin: admin@uddog.com / admin123");
  console.log("Users: user1@example.com / user1123 (or user2, user3, etc.)");
  console.log(
    "Donors: donor1@example.com / donor1123 (or donor2, donor3, etc.)",
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

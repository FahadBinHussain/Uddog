import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "USD",
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
}

export function calculatePercentage(current: number, goal: number): number {
  if (goal === 0) return 0;
  return Math.min(Math.round((current / goal) * 100), 100);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const CAMPAIGN_STATUSES = {
  DRAFT: "draft",
  ACTIVE: "active",
  COMPLETED: "completed",
  PAUSED: "paused",
  CANCELLED: "cancelled",
} as const;

export const USER_ROLES = {
  DONOR: "donor",
  CREATOR: "creator",
  ADMIN: "admin",
} as const;

export const VERIFICATION_STATUSES = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
} as const;

export const FRAUD_REPORT_STATUSES = {
  OPEN: "open",
  INVESTIGATING: "investigating",
  RESOLVED: "resolved",
  DISMISSED: "dismissed",
} as const;

export const DONATION_FREQUENCIES = {
  ONE_TIME: "one_time",
  MONTHLY: "monthly",
  QUARTERLY: "quarterly",
  ANNUALLY: "annually",
} as const;

export type CampaignStatus =
  (typeof CAMPAIGN_STATUSES)[keyof typeof CAMPAIGN_STATUSES];
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type VerificationStatus =
  (typeof VERIFICATION_STATUSES)[keyof typeof VERIFICATION_STATUSES];
export type FraudReportStatus =
  (typeof FRAUD_REPORT_STATUSES)[keyof typeof FRAUD_REPORT_STATUSES];
export type DonationFrequency =
  (typeof DONATION_FREQUENCIES)[keyof typeof DONATION_FREQUENCIES];

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "paused":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "verified":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getDaysRemaining(endDate: Date | string): number {
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function validateCampaignData(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length < 5) {
    errors.push("Title must be at least 5 characters long");
  }

  if (!data.description || data.description.trim().length < 50) {
    errors.push("Description must be at least 50 characters long");
  }

  if (!data.goalAmount || data.goalAmount < 100) {
    errors.push("Goal amount must be at least $100");
  }

  if (data.goalAmount > 1000000) {
    errors.push("Goal amount cannot exceed $1,000,000");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

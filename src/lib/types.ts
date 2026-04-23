export type Role = "agency" | "brand" | "influencer";

export interface Influencer {
  id: string;
  name: string;
  platforms: string[];
  followers: number;
  engagementRate: number;
  category: string;
  performanceScore: number;
  ratePerPost: number;
  stylePresent: string[];
}

export interface Campaign {
  id: string;
  title: string;
  objective: string;
  budget: number;
  status: "draft" | "active" | "completed";
  roleOwner: "agency" | "brand";
  applicants: number;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  sentAt: string;
}

export const INTERACTION_TYPES = [
  { value: "phone_call", label: "Phone Call", icon: "Phone" },
  { value: "whatsapp", label: "WhatsApp", icon: "MessageCircle" },
  { value: "walk_in", label: "Walk-In", icon: "User" },
  { value: "email", label: "Email", icon: "Mail" },
  { value: "social_media", label: "Social Media", icon: "Share2" },
] as const;

export const INTERACTION_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "in_progress", label: "In Progress", color: "bg-blue-500" },
  { value: "completed", label: "Completed", color: "bg-green-500" },
] as const;

export const DEFAULT_REQUIREMENT_TAGS = [
  // Jewelry Types
  { name: "Necklace", category: "jewelry_type" },
  { name: "Ring", category: "jewelry_type" },
  { name: "Earrings", category: "jewelry_type" },
  { name: "Bangles", category: "jewelry_type" },
  { name: "Bracelet", category: "jewelry_type" },
  { name: "Chain", category: "jewelry_type" },
  { name: "Pendant", category: "jewelry_type" },
  { name: "Mangalsutra", category: "jewelry_type" },
  // Occasions
  { name: "Wedding", category: "occasion" },
  { name: "Engagement", category: "occasion" },
  { name: "Anniversary", category: "occasion" },
  { name: "Birthday", category: "occasion" },
  { name: "Festival", category: "occasion" },
  { name: "Daily Wear", category: "occasion" },
  // Services
  { name: "Repair", category: "service" },
  { name: "Resize", category: "service" },
  { name: "Exchange", category: "service" },
  { name: "Gold Rate Inquiry", category: "service" },
  { name: "EMI/Finance", category: "service" },
  { name: "Custom Order", category: "service" },
  // Materials
  { name: "Gold", category: "material" },
  { name: "Diamond", category: "material" },
  { name: "Platinum", category: "material" },
  { name: "Silver", category: "material" },
  { name: "Polki", category: "material" },
];

export const DEFAULT_RSOS = [
  { name: "Rahul Sharma", employeeCode: "RSO001" },
  { name: "Priya Patel", employeeCode: "RSO002" },
  { name: "Amit Kumar", employeeCode: "RSO003" },
  { name: "Neha Singh", employeeCode: "RSO004" },
];

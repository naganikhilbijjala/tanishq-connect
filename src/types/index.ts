export type InteractionType =
  | "phone_call"
  | "whatsapp"
  | "walk_in"
  | "email"
  | "social_media";

export type InteractionStatus = "pending" | "in_progress" | "completed";

export interface RSO {
  id: number;
  name: string;
  employeeCode: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Interaction {
  id: number;
  customerName: string | null;
  customerPhone: string | null;
  type: InteractionType;
  status: InteractionStatus;
  requirement: string;
  requirementTags: string | null;
  notes: string | null;
  assignedToId: number | null;
  createdById: number | null;
  interactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: RSO;
}

export interface RequirementTag {
  id: number;
  name: string;
  category: string | null;
  isActive: boolean;
  sortOrder: number | null;
}

// Form types
export interface InteractionFormData {
  customerName?: string;
  customerPhone?: string;
  type: InteractionType;
  status: InteractionStatus;
  requirement: string;
  requirementTags?: string[];
  notes?: string;
  assignedToId: number;
}

export interface RSOFormData {
  name: string;
  employeeCode?: string;
  phone?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

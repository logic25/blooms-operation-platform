// Core types for Blooms Operations Platform

export interface Product {
  id: string;
  name: string;
  photoUrl?: string;
  category: 'roses' | 'mixed' | 'premium' | 'budget' | 'seasonal';
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeItem {
  id: string;
  productId: string;
  flowerType: string;
  quantity: number;
  notes?: string;
}

export interface Recipe {
  productId: string;
  items: RecipeItem[];
}

export interface Vendor {
  id: string;
  name: string;
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
  leadTimeDays: number;
  orderCutoff: string; // e.g., "Tue 5pm"
  deliveryDays: string[]; // e.g., ["Mon", "Wed", "Fri"]
  paymentTerms?: string;
  reliabilityRating: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  specialties?: string[];
}

export interface VendorInventory {
  id: string;
  vendorId: string;
  flowerType: string;
  regularPrice: number;
  peakPrice: number;
  qualityRating: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface ProductionPlan {
  id: string;
  eventName: string;
  eventDate: Date;
  createdAt: Date;
  items: PlanItem[];
}

export interface PlanItem {
  id: string;
  planId: string;
  productId: string;
  plannedQuantity: number;
  lastYearQuantity?: number;
}

export interface FlowerNeed {
  flowerType: string;
  totalStems: number;
  stemsByProduct: {
    productName: string;
    productId: string;
    quantity: number;
    stemsPerUnit: number;
    totalStems: number;
  }[];
}

export interface Order {
  id: string;
  planId: string;
  vendorId: string;
  flowerType: string;
  quantity: number;
  orderDate: Date;
  expectedDelivery: Date;
  status: 'pending' | 'ordered' | 'delivered' | 'issue';
  notes?: string;
}

export interface SalesHistory {
  id: string;
  productId: string;
  eventName: string;
  eventDate: Date;
  quantitySold: number;
  revenue?: number;
}

// ===== NEW TYPES FOR DUAL-MODE SYSTEM =====

// App mode
export type AppMode = 'daily' | 'event';

// Daily customer order
export interface DailyOrder {
  id: string;
  productId: string;
  quantity: number;
  deliveryDate: Date;
  customerName?: string;
  notes?: string;
  status: 'pending' | 'fulfilled';
  createdAt: Date;
  eventId?: string; // if associated with an event
}

// Cooler inventory item
export interface CoolerInventoryItem {
  id: string;
  flowerType: string;
  quantity: number;
  lastUpdated: Date;
}

// Shopping list item (calculated)
export interface ShoppingListItem {
  flowerType: string;
  needed: number;
  inStock: number;
  toBuy: number;
  purchased: boolean;
}

// Custom event configuration
export interface CustomEvent {
  id: string;
  name: string;
  eventDate: Date;
  planningWindowDays: number; // how many days before to show banner
  isActive: boolean;
  isRecurring: boolean;
  recurrenceRule?: string; // e.g., "2nd Sunday of May"
}

// Expected delivery (flowers ordered but not yet received)
export interface ExpectedDelivery {
  id: string;
  vendorId: string;
  flowerType: string;
  quantity: number;
  orderDate: Date;
  expectedDate: Date;
  received: boolean;
  eventId?: string;
}

// User preferences
export interface UserPreferences {
  currentMode: AppMode;
  activeEventId?: string;
  defaultPlanningWindow: number;
}

// UI-specific types
export type StatusType = 'urgent' | 'warning' | 'success' | 'neutral';

export interface Deadline {
  id: string;
  title: string;
  date: Date;
  type: 'order' | 'delivery' | 'production' | 'event';
  status: StatusType;
  vendorName?: string;
}

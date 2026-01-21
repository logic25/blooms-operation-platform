import type { Product, Vendor, RecipeItem, ProductionPlan, Deadline } from '@/types';

// Sample Products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Dozen Roses',
    photoUrl: '/placeholder.svg',
    category: 'roses',
    price: 85,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Mixed Spring Bouquet',
    photoUrl: '/placeholder.svg',
    category: 'mixed',
    price: 65,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Premium Romance',
    photoUrl: '/placeholder.svg',
    category: 'premium',
    price: 150,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    name: 'Sweet Petite',
    photoUrl: '/placeholder.svg',
    category: 'budget',
    price: 35,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '5',
    name: 'Garden Elegance',
    photoUrl: '/placeholder.svg',
    category: 'mixed',
    price: 95,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '6',
    name: 'Blush & Bloom',
    photoUrl: '/placeholder.svg',
    category: 'roses',
    price: 75,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Sample Recipes
export const mockRecipes: Record<string, RecipeItem[]> = {
  '1': [
    { id: 'r1', productId: '1', flowerType: 'Red Roses', quantity: 12, notes: 'Premium grade' },
    { id: 'r2', productId: '1', flowerType: 'Baby\'s Breath', quantity: 8 },
    { id: 'r3', productId: '1', flowerType: 'Leather Leaf Fern', quantity: 5 },
  ],
  '2': [
    { id: 'r4', productId: '2', flowerType: 'Pink Roses', quantity: 6 },
    { id: 'r5', productId: '2', flowerType: 'White Tulips', quantity: 6 },
    { id: 'r6', productId: '2', flowerType: 'Eucalyptus', quantity: 5 },
    { id: 'r7', productId: '2', flowerType: 'Stock', quantity: 3 },
  ],
  '3': [
    { id: 'r8', productId: '3', flowerType: 'Red Roses', quantity: 24, notes: 'Long stem premium' },
    { id: 'r9', productId: '3', flowerType: 'Pink Roses', quantity: 12 },
    { id: 'r10', productId: '3', flowerType: 'Hydrangea', quantity: 3 },
    { id: 'r11', productId: '3', flowerType: 'Eucalyptus', quantity: 8 },
  ],
  '4': [
    { id: 'r12', productId: '4', flowerType: 'Carnations', quantity: 6 },
    { id: 'r13', productId: '4', flowerType: 'Baby\'s Breath', quantity: 5 },
  ],
  '5': [
    { id: 'r14', productId: '5', flowerType: 'Garden Roses', quantity: 8 },
    { id: 'r15', productId: '5', flowerType: 'Ranunculus', quantity: 6 },
    { id: 'r16', productId: '5', flowerType: 'Dusty Miller', quantity: 4 },
    { id: 'r17', productId: '5', flowerType: 'Eucalyptus', quantity: 6 },
  ],
  '6': [
    { id: 'r18', productId: '6', flowerType: 'Pink Roses', quantity: 10 },
    { id: 'r19', productId: '6', flowerType: 'Spray Roses', quantity: 5 },
    { id: 'r20', productId: '6', flowerType: 'Waxflower', quantity: 4 },
  ],
};

// Sample Vendors
export const mockVendors: Vendor[] = [
  {
    id: 'v1',
    name: 'NH Blossom Wholesale',
    contactInfo: {
      phone: '(603) 555-0123',
      email: 'orders@nhblossom.com',
      website: 'nhblossom.com',
    },
    leadTimeDays: 3,
    orderCutoff: 'Tue 5pm',
    deliveryDays: ['Mon', 'Wed', 'Fri'],
    paymentTerms: 'Net 30',
    reliabilityRating: 4,
    specialties: ['Roses', 'Premium Flowers'],
    notes: 'Reliable, good grading. Best for roses.',
  },
  {
    id: 'v2',
    name: 'DV Wholesale Flowers',
    contactInfo: {
      phone: '(617) 555-0456',
      email: 'sales@dvwholesale.com',
    },
    leadTimeDays: 5,
    orderCutoff: 'Mon 3pm',
    deliveryDays: ['Tue', 'Thu'],
    paymentTerms: 'Net 15',
    reliabilityRating: 3,
    specialties: ['Mixed Flowers', 'Greenery'],
    notes: 'Cheaper but sometimes stem length issues. Good for basics.',
  },
  {
    id: 'v3',
    name: 'Prime Petals',
    contactInfo: {
      phone: '(978) 555-0789',
      email: 'info@primepetals.com',
      website: 'primepetals.com',
    },
    leadTimeDays: 2,
    orderCutoff: 'Wed 6pm',
    deliveryDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    paymentTerms: 'COD',
    reliabilityRating: 5,
    specialties: ['Premium', 'Same-day', 'Exotics'],
    notes: 'Most expensive but highest quality. Use for premium orders.',
  },
  {
    id: 'v4',
    name: 'Garden Gate Supply',
    contactInfo: {
      phone: '(802) 555-0321',
      email: 'orders@gardengate.com',
    },
    leadTimeDays: 4,
    orderCutoff: 'Sun 8pm',
    deliveryDays: ['Wed', 'Sat'],
    reliabilityRating: 4,
    specialties: ['Greenery', 'Filler Flowers', 'Local Seasonal'],
    notes: 'Great for eucalyptus and greens. Local farm.',
  },
];

// Sample Production Plan
export const mockProductionPlan: ProductionPlan = {
  id: 'plan1',
  eventName: "Valentine's Day 2025",
  eventDate: new Date('2025-02-14'),
  createdAt: new Date(),
  items: [
    { id: 'pi1', planId: 'plan1', productId: '1', plannedQuantity: 100, lastYearQuantity: 87 },
    { id: 'pi2', planId: 'plan1', productId: '2', plannedQuantity: 50, lastYearQuantity: 45 },
    { id: 'pi3', planId: 'plan1', productId: '3', plannedQuantity: 25, lastYearQuantity: 20 },
    { id: 'pi4', planId: 'plan1', productId: '4', plannedQuantity: 75, lastYearQuantity: 80 },
    { id: 'pi5', planId: 'plan1', productId: '5', plannedQuantity: 30, lastYearQuantity: 28 },
    { id: 'pi6', planId: 'plan1', productId: '6', plannedQuantity: 40, lastYearQuantity: 35 },
  ],
};

// Sample Deadlines
export const mockDeadlines: Deadline[] = [
  {
    id: 'd1',
    title: 'Order from DV Wholesale',
    date: new Date('2025-02-05'),
    type: 'order',
    status: 'urgent',
    vendorName: 'DV Wholesale Flowers',
  },
  {
    id: 'd2',
    title: 'Order from NH Blossom',
    date: new Date('2025-02-07'),
    type: 'order',
    status: 'warning',
    vendorName: 'NH Blossom Wholesale',
  },
  {
    id: 'd3',
    title: 'Deliveries arrive',
    date: new Date('2025-02-10'),
    type: 'delivery',
    status: 'neutral',
  },
  {
    id: 'd4',
    title: 'Production begins',
    date: new Date('2025-02-12'),
    type: 'production',
    status: 'neutral',
  },
  {
    id: 'd5',
    title: "Valentine's Day",
    date: new Date('2025-02-14'),
    type: 'event',
    status: 'success',
  },
];

// Flower types list
export const flowerTypes = [
  'Red Roses',
  'Pink Roses',
  'White Roses',
  'Garden Roses',
  'Spray Roses',
  'White Tulips',
  'Pink Tulips',
  'Carnations',
  'Hydrangea',
  'Ranunculus',
  'Stock',
  'Waxflower',
  'Baby\'s Breath',
  'Eucalyptus',
  'Dusty Miller',
  'Leather Leaf Fern',
  'Ruscus',
] as const;

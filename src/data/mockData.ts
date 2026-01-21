import type { Product, Vendor, RecipeItem, ProductionPlan, Deadline, VendorInventory } from '@/types';

// Product images
import classicDozenRoses from '@/assets/products/classic-dozen-roses.jpg';
import mixedSpringBouquet from '@/assets/products/mixed-spring-bouquet.jpg';
import premiumRomance from '@/assets/products/premium-romance.jpg';
import sweetPetite from '@/assets/products/sweet-petite.jpg';
import gardenElegance from '@/assets/products/garden-elegance.jpg';
import blushAndBloom from '@/assets/products/blush-and-bloom.jpg';

// Sample Products with real images
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Dozen Roses',
    photoUrl: classicDozenRoses,
    category: 'romance',
    price: 85,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Mixed Spring Bouquet',
    photoUrl: mixedSpringBouquet,
    category: 'everyday',
    price: 65,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Premium Romance',
    photoUrl: premiumRomance,
    category: 'romance',
    price: 150,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    name: 'Sweet Petite',
    photoUrl: sweetPetite,
    category: 'birthday',
    price: 35,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '5',
    name: 'Garden Elegance',
    photoUrl: gardenElegance,
    category: 'wedding',
    price: 95,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '6',
    name: 'Blush & Bloom',
    photoUrl: blushAndBloom,
    category: 'everyday',
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

// Vendor Inventory - what each vendor carries with pricing and quality
export const mockVendorInventory: VendorInventory[] = [
  // NH Blossom Wholesale - roses specialist
  { id: 'vi1', vendorId: 'v1', flowerType: 'Red Roses', regularPrice: 1.20, peakPrice: 2.40, qualityRating: 5, notes: 'Excellent long stems, consistent color' },
  { id: 'vi2', vendorId: 'v1', flowerType: 'Pink Roses', regularPrice: 1.15, peakPrice: 2.30, qualityRating: 5, notes: 'Beautiful blush shades' },
  { id: 'vi3', vendorId: 'v1', flowerType: 'White Roses', regularPrice: 1.10, peakPrice: 2.20, qualityRating: 4, notes: 'Good quality' },
  { id: 'vi4', vendorId: 'v1', flowerType: 'Garden Roses', regularPrice: 2.50, peakPrice: 4.00, qualityRating: 5, notes: 'Premium David Austin varieties' },
  { id: 'vi5', vendorId: 'v1', flowerType: 'Hydrangea', regularPrice: 4.50, peakPrice: 7.00, qualityRating: 4, notes: 'Large heads, good color' },
  
  // DV Wholesale - budget option
  { id: 'vi6', vendorId: 'v2', flowerType: 'Red Roses', regularPrice: 0.95, peakPrice: 1.90, qualityRating: 3, notes: 'Shorter stems, okay for budget' },
  { id: 'vi7', vendorId: 'v2', flowerType: 'Carnations', regularPrice: 0.35, peakPrice: 0.55, qualityRating: 4, notes: 'Great value, long lasting' },
  { id: 'vi8', vendorId: 'v2', flowerType: 'Baby\'s Breath', regularPrice: 0.15, peakPrice: 0.25, qualityRating: 4, notes: 'Standard quality' },
  { id: 'vi9', vendorId: 'v2', flowerType: 'Stock', regularPrice: 0.85, peakPrice: 1.40, qualityRating: 3, notes: 'Variable quality' },
  { id: 'vi10', vendorId: 'v2', flowerType: 'White Tulips', regularPrice: 0.75, peakPrice: 1.50, qualityRating: 3, notes: 'Decent but not premium' },
  
  // Prime Petals - premium supplier
  { id: 'vi11', vendorId: 'v3', flowerType: 'Red Roses', regularPrice: 1.50, peakPrice: 3.00, qualityRating: 5, notes: 'Best roses, worth the price' },
  { id: 'vi12', vendorId: 'v3', flowerType: 'Garden Roses', regularPrice: 3.00, peakPrice: 5.50, qualityRating: 5, notes: 'Incredible fragrance and form' },
  { id: 'vi13', vendorId: 'v3', flowerType: 'Ranunculus', regularPrice: 1.25, peakPrice: 2.50, qualityRating: 5, notes: 'Perfect layers, amazing colors' },
  { id: 'vi14', vendorId: 'v3', flowerType: 'Hydrangea', regularPrice: 5.50, peakPrice: 9.00, qualityRating: 5, notes: 'Huge heads, stunning colors' },
  { id: 'vi15', vendorId: 'v3', flowerType: 'Pink Roses', regularPrice: 1.45, peakPrice: 2.90, qualityRating: 5, notes: 'Premium blush pinks' },
  { id: 'vi16', vendorId: 'v3', flowerType: 'Spray Roses', regularPrice: 1.80, peakPrice: 3.20, qualityRating: 5, notes: 'Multiple blooms per stem' },
  
  // Garden Gate Supply - greenery specialist
  { id: 'vi17', vendorId: 'v4', flowerType: 'Eucalyptus', regularPrice: 0.45, peakPrice: 0.75, qualityRating: 5, notes: 'Fresh from local farm, amazing scent' },
  { id: 'vi18', vendorId: 'v4', flowerType: 'Dusty Miller', regularPrice: 0.35, peakPrice: 0.55, qualityRating: 5, notes: 'Beautiful silvery leaves' },
  { id: 'vi19', vendorId: 'v4', flowerType: 'Leather Leaf Fern', regularPrice: 0.25, peakPrice: 0.40, qualityRating: 4, notes: 'Standard quality' },
  { id: 'vi20', vendorId: 'v4', flowerType: 'Ruscus', regularPrice: 0.30, peakPrice: 0.50, qualityRating: 4, notes: 'Good filler' },
  { id: 'vi21', vendorId: 'v4', flowerType: 'Waxflower', regularPrice: 0.55, peakPrice: 0.85, qualityRating: 4, notes: 'Nice texture, local' },
  { id: 'vi22', vendorId: 'v4', flowerType: 'Baby\'s Breath', regularPrice: 0.12, peakPrice: 0.22, qualityRating: 4, notes: 'Fresh and fluffy' },
];

// Valentine's Day 2026 dates (today is Jan 21, 2026)
export const mockProductionPlan: ProductionPlan = {
  id: 'plan1',
  eventName: "Valentine's Day 2026",
  eventDate: new Date('2026-02-14'),
  createdAt: new Date('2026-01-15'),
  items: [
    { id: 'pi1', planId: 'plan1', productId: '1', plannedQuantity: 100, lastYearQuantity: 87 },
    { id: 'pi2', planId: 'plan1', productId: '2', plannedQuantity: 50, lastYearQuantity: 45 },
    { id: 'pi3', planId: 'plan1', productId: '3', plannedQuantity: 25, lastYearQuantity: 20 },
    { id: 'pi4', planId: 'plan1', productId: '4', plannedQuantity: 75, lastYearQuantity: 80 },
    { id: 'pi5', planId: 'plan1', productId: '5', plannedQuantity: 30, lastYearQuantity: 28 },
    { id: 'pi6', planId: 'plan1', productId: '6', plannedQuantity: 40, lastYearQuantity: 35 },
  ],
};

// Updated deadlines for Valentine's Day 2026
export const mockDeadlines: Deadline[] = [
  {
    id: 'd1',
    title: 'Order from DV Wholesale',
    date: new Date('2026-02-05'),
    type: 'order',
    status: 'warning',
    vendorName: 'DV Wholesale Flowers',
  },
  {
    id: 'd2',
    title: 'Order from NH Blossom',
    date: new Date('2026-02-07'),
    type: 'order',
    status: 'warning',
    vendorName: 'NH Blossom Wholesale',
  },
  {
    id: 'd3',
    title: 'Order from Garden Gate',
    date: new Date('2026-02-08'),
    type: 'order',
    status: 'neutral',
    vendorName: 'Garden Gate Supply',
  },
  {
    id: 'd4',
    title: 'Deliveries arrive',
    date: new Date('2026-02-10'),
    type: 'delivery',
    status: 'neutral',
  },
  {
    id: 'd5',
    title: 'Production begins',
    date: new Date('2026-02-12'),
    type: 'production',
    status: 'neutral',
  },
  {
    id: 'd6',
    title: "Valentine's Day",
    date: new Date('2026-02-14'),
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

// Historical flower usage by vendor (for rating which vendor gives best flowers)
export const mockFlowerHistory = [
  // Red Roses history
  { flowerType: 'Red Roses', vendorId: 'v1', event: "Valentine's Day 2025", qualityScore: 5, pricePerStem: 2.40, notes: 'Perfect, no rejects' },
  { flowerType: 'Red Roses', vendorId: 'v2', event: "Valentine's Day 2025", qualityScore: 3, pricePerStem: 1.90, notes: '15% rejected for short stems' },
  { flowerType: 'Red Roses', vendorId: 'v3', event: "Valentine's Day 2025", qualityScore: 5, pricePerStem: 3.00, notes: 'Gorgeous, clients loved them' },
  { flowerType: 'Red Roses', vendorId: 'v1', event: "Mother's Day 2025", qualityScore: 4, pricePerStem: 1.80, notes: 'Few wilted early' },
  
  // Pink Roses history
  { flowerType: 'Pink Roses', vendorId: 'v1', event: "Valentine's Day 2025", qualityScore: 5, pricePerStem: 2.30, notes: 'Beautiful blush color' },
  { flowerType: 'Pink Roses', vendorId: 'v3', event: "Mother's Day 2025", qualityScore: 5, pricePerStem: 2.20, notes: 'Stunning, worth the cost' },
  
  // Eucalyptus history
  { flowerType: 'Eucalyptus', vendorId: 'v4', event: "Valentine's Day 2025", qualityScore: 5, pricePerStem: 0.75, notes: 'Fresh, amazing fragrance' },
  { flowerType: 'Eucalyptus', vendorId: 'v4', event: "Mother's Day 2025", qualityScore: 5, pricePerStem: 0.55, notes: 'Local and fresh' },
  
  // Baby's Breath history  
  { flowerType: 'Baby\'s Breath', vendorId: 'v2', event: "Valentine's Day 2025", qualityScore: 4, pricePerStem: 0.25, notes: 'Standard quality' },
  { flowerType: 'Baby\'s Breath', vendorId: 'v4', event: "Valentine's Day 2025", qualityScore: 5, pricePerStem: 0.22, notes: 'Fluffier, better value' },
];

// Historical sales by FLOWER (not product) for analytics
export const mockFlowerSalesHistory = [
  // Valentine's 2025
  { flowerType: 'Red Roses', event: "Valentine's Day 2025", totalStems: 3600, totalCost: 7200, avgQuality: 4.3, topVendor: 'NH Blossom Wholesale' },
  { flowerType: 'Pink Roses', event: "Valentine's Day 2025", totalStems: 1800, totalCost: 3960, avgQuality: 4.8, topVendor: 'NH Blossom Wholesale' },
  { flowerType: 'Eucalyptus', event: "Valentine's Day 2025", totalStems: 1400, totalCost: 1050, avgQuality: 5.0, topVendor: 'Garden Gate Supply' },
  { flowerType: 'Baby\'s Breath', event: "Valentine's Day 2025", totalStems: 1200, totalCost: 276, avgQuality: 4.5, topVendor: 'Garden Gate Supply' },
  { flowerType: 'Carnations', event: "Valentine's Day 2025", totalStems: 600, totalCost: 330, avgQuality: 4.0, topVendor: 'DV Wholesale Flowers' },
  { flowerType: 'Garden Roses', event: "Valentine's Day 2025", totalStems: 400, totalCost: 1600, avgQuality: 5.0, topVendor: 'Prime Petals' },
  { flowerType: 'Hydrangea', event: "Valentine's Day 2025", totalStems: 150, totalCost: 1050, avgQuality: 4.5, topVendor: 'Prime Petals' },
  
  // Mother's Day 2025
  { flowerType: 'Pink Roses', event: "Mother's Day 2025", totalStems: 2400, totalCost: 4800, avgQuality: 4.9, topVendor: 'NH Blossom Wholesale' },
  { flowerType: 'Red Roses', event: "Mother's Day 2025", totalStems: 1200, totalCost: 2160, avgQuality: 4.5, topVendor: 'NH Blossom Wholesale' },
  { flowerType: 'Garden Roses', event: "Mother's Day 2025", totalStems: 600, totalCost: 1800, avgQuality: 5.0, topVendor: 'Prime Petals' },
  { flowerType: 'Eucalyptus', event: "Mother's Day 2025", totalStems: 1800, totalCost: 990, avgQuality: 5.0, topVendor: 'Garden Gate Supply' },
  { flowerType: 'Ranunculus', event: "Mother's Day 2025", totalStems: 500, totalCost: 1250, avgQuality: 5.0, topVendor: 'Prime Petals' },
  
  // Valentine's 2024
  { flowerType: 'Red Roses', event: "Valentine's Day 2024", totalStems: 3200, totalCost: 6080, avgQuality: 4.0, topVendor: 'NH Blossom Wholesale' },
  { flowerType: 'Pink Roses', event: "Valentine's Day 2024", totalStems: 1500, totalCost: 3150, avgQuality: 4.5, topVendor: 'NH Blossom Wholesale' },
];

import type { FlowerType } from '@/types';

// Pre-populated flower library for onboarding
export const defaultFlowers: Omit<FlowerType, 'id'>[] = [
  // ROSES
  { name: 'Red Roses', category: 'roses', costPerStem: 2.50, stemsPerBunch: 25, isActive: false },
  { name: 'Pink Roses', category: 'roses', costPerStem: 2.50, stemsPerBunch: 25, isActive: false },
  { name: 'White Roses', category: 'roses', costPerStem: 2.50, stemsPerBunch: 25, isActive: false },
  { name: 'Yellow Roses', category: 'roses', costPerStem: 2.25, stemsPerBunch: 25, isActive: false },
  { name: 'Peach Roses', category: 'roses', costPerStem: 2.75, stemsPerBunch: 25, isActive: false },
  { name: 'Garden Roses', category: 'roses', costPerStem: 5.50, stemsPerBunch: 12, isActive: false },
  { name: 'Spray Roses', category: 'roses', costPerStem: 3.00, stemsPerBunch: 10, isActive: false },
  
  // SPECIALTY FLOWERS
  { name: 'Hydrangea', category: 'specialty', costPerStem: 8.00, stemsPerBunch: 5, isActive: false },
  { name: 'Lilies', category: 'specialty', costPerStem: 4.50, stemsPerBunch: 10, isActive: false },
  { name: 'Tulips', category: 'specialty', costPerStem: 2.00, stemsPerBunch: 10, isActive: false },
  { name: 'Ranunculus', category: 'specialty', costPerStem: 3.50, stemsPerBunch: 10, isActive: false },
  { name: 'Peonies', category: 'specialty', costPerStem: 8.00, stemsPerBunch: 5, isActive: false },
  { name: 'Orchids', category: 'specialty', costPerStem: 6.00, stemsPerBunch: 10, isActive: false },
  { name: 'Sunflowers', category: 'specialty', costPerStem: 3.00, stemsPerBunch: 5, isActive: false },
  { name: 'Lisianthus', category: 'specialty', costPerStem: 3.50, stemsPerBunch: 10, isActive: false },
  { name: 'Gerbera Daisies', category: 'specialty', costPerStem: 2.00, stemsPerBunch: 10, isActive: false },
  { name: 'Delphinium', category: 'specialty', costPerStem: 4.00, stemsPerBunch: 10, isActive: false },
  { name: 'Snapdragons', category: 'specialty', costPerStem: 2.50, stemsPerBunch: 10, isActive: false },
  { name: 'Freesia', category: 'specialty', costPerStem: 2.00, stemsPerBunch: 10, isActive: false },
  { name: 'Asters', category: 'specialty', costPerStem: 1.75, stemsPerBunch: 10, isActive: false },
  { name: 'Stock', category: 'specialty', costPerStem: 2.50, stemsPerBunch: 10, isActive: false },
  { name: 'Anemones', category: 'specialty', costPerStem: 3.00, stemsPerBunch: 10, isActive: false },
  
  // FILLERS
  { name: 'Carnations', category: 'fillers', costPerStem: 0.75, stemsPerBunch: 25, isActive: false },
  { name: "Baby's Breath", category: 'fillers', costPerStem: 0.50, stemsPerBunch: 10, isActive: false },
  { name: 'Alstroemeria', category: 'fillers', costPerStem: 1.50, stemsPerBunch: 10, isActive: false },
  { name: 'Chrysanthemums', category: 'fillers', costPerStem: 1.25, stemsPerBunch: 10, isActive: false },
  { name: 'Waxflower', category: 'fillers', costPerStem: 1.00, stemsPerBunch: 10, isActive: false },
  { name: 'Statice', category: 'fillers', costPerStem: 1.00, stemsPerBunch: 10, isActive: false },
  { name: 'Solidago', category: 'fillers', costPerStem: 0.75, stemsPerBunch: 10, isActive: false },
  
  // GREENS
  { name: 'Eucalyptus', category: 'greens', costPerStem: 1.50, stemsPerBunch: 10, isActive: false },
  { name: 'Leather Leaf Fern', category: 'greens', costPerStem: 0.40, stemsPerBunch: 25, isActive: false },
  { name: 'Dusty Miller', category: 'greens', costPerStem: 1.25, stemsPerBunch: 10, isActive: false },
  { name: 'Salal', category: 'greens', costPerStem: 0.50, stemsPerBunch: 25, isActive: false },
  { name: 'Israeli Ruscus', category: 'greens', costPerStem: 1.50, stemsPerBunch: 10, isActive: false },
  { name: 'Italian Ruscus', category: 'greens', costPerStem: 1.25, stemsPerBunch: 10, isActive: false },
  { name: 'Seeded Eucalyptus', category: 'greens', costPerStem: 2.00, stemsPerBunch: 10, isActive: false },
  { name: 'Silver Dollar Eucalyptus', category: 'greens', costPerStem: 2.25, stemsPerBunch: 10, isActive: false },
];

export const flowerCategories = {
  roses: { label: 'Roses', emoji: '🌹' },
  specialty: { label: 'Specialty Flowers', emoji: '🌸' },
  fillers: { label: 'Fillers', emoji: '🌼' },
  greens: { label: 'Greens', emoji: '🌿' },
} as const;

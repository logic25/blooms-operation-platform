import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { FlowerType, Vendor, Product, RecipeItem } from '@/types';
import { defaultFlowers } from '@/data/defaultFlowers';

interface OnboardingContextType {
  step: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // Flower library
  flowers: FlowerType[];
  toggleFlower: (id: string) => void;
  updateFlower: (id: string, updates: Partial<FlowerType>) => void;
  addCustomFlower: (flower: Omit<FlowerType, 'id'>) => void;
  
  // Vendors
  vendors: Vendor[];
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  removeVendor: (id: string) => void;
  
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  
  // Recipes
  recipes: Record<string, RecipeItem[]>;
  setRecipe: (productId: string, items: RecipeItem[]) => void;
  
  // Complete onboarding
  completeOnboarding: () => { flowers: FlowerType[]; vendors: Vendor[]; products: Product[]; recipes: Record<string, RecipeItem[]> };
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (value: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

// Initialize flowers with IDs
const initializeFlowers = (): FlowerType[] => {
  return defaultFlowers.map((f, idx) => ({
    ...f,
    id: `flower-${idx}`,
  }));
};

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [flowers, setFlowers] = useState<FlowerType[]>(initializeFlowers);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [recipes, setRecipes] = useState<Record<string, RecipeItem[]>>({});
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('blooms_onboarding_complete') === 'true';
  });

  const nextStep = useCallback(() => setStep(prev => Math.min(prev + 1, 4)), []);
  const prevStep = useCallback(() => setStep(prev => Math.max(prev - 1, 1)), []);

  const toggleFlower = useCallback((id: string) => {
    setFlowers(prev => prev.map(f => 
      f.id === id ? { ...f, isActive: !f.isActive } : f
    ));
  }, []);

  const updateFlower = useCallback((id: string, updates: Partial<FlowerType>) => {
    setFlowers(prev => prev.map(f => 
      f.id === id ? { ...f, ...updates } : f
    ));
  }, []);

  const addCustomFlower = useCallback((flower: Omit<FlowerType, 'id'>) => {
    const newFlower: FlowerType = {
      ...flower,
      id: `flower-custom-${Date.now()}`,
      isActive: true,
    };
    setFlowers(prev => [...prev, newFlower]);
  }, []);

  const addVendor = useCallback((vendor: Omit<Vendor, 'id'>) => {
    const newVendor: Vendor = {
      ...vendor,
      id: `vendor-${Date.now()}`,
    };
    setVendors(prev => [...prev, newVendor]);
  }, []);

  const removeVendor = useCallback((id: string) => {
    setVendors(prev => prev.filter(v => v.id !== id));
  }, []);

  const addProduct = useCallback((product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct.id;
  }, []);

  const setRecipe = useCallback((productId: string, items: RecipeItem[]) => {
    setRecipes(prev => ({ ...prev, [productId]: items }));
  }, []);

  const completeOnboarding = useCallback(() => {
    const activeFlowers = flowers.filter(f => f.isActive);
    localStorage.setItem('blooms_onboarding_complete', 'true');
    localStorage.setItem('blooms_flowers', JSON.stringify(activeFlowers));
    localStorage.setItem('blooms_vendors', JSON.stringify(vendors));
    localStorage.setItem('blooms_products', JSON.stringify(products));
    localStorage.setItem('blooms_recipes', JSON.stringify(recipes));
    setHasCompletedOnboarding(true);
    return { flowers: activeFlowers, vendors, products, recipes };
  }, [flowers, vendors, products, recipes]);

  return (
    <OnboardingContext.Provider value={{
      step,
      setStep,
      nextStep,
      prevStep,
      flowers,
      toggleFlower,
      updateFlower,
      addCustomFlower,
      vendors,
      addVendor,
      removeVendor,
      products,
      addProduct,
      recipes,
      setRecipe,
      completeOnboarding,
      hasCompletedOnboarding,
      setHasCompletedOnboarding,
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowLeft, Package, DollarSign, ImagePlus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOnboarding } from '@/context/OnboardingContext';
import type { RecipeItem, Product } from '@/types';

const PRODUCT_CATEGORIES = [
  { value: 'birthday', label: 'Birthday' },
  { value: 'romance', label: 'Romance' },
  { value: 'sympathy', label: 'Sympathy' },
  { value: 'everyday', label: 'Everyday' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'corporate', label: 'Corporate' },
];

interface ProductFormData {
  name: string;
  category: Product['category'];
  price: number;
  photoUrl: string;
}

const emptyProductForm: ProductFormData = {
  name: '',
  category: 'everyday',
  price: 0,
  photoUrl: '',
};

export function FirstProductStep() {
  const { flowers, products, addProduct, recipes, setRecipe, prevStep, nextStep } = useOnboarding();
  const [productForm, setProductForm] = useState<ProductFormData>(emptyProductForm);
  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>([]);
  const [selectedFlower, setSelectedFlower] = useState('');
  const [flowerQuantity, setFlowerQuantity] = useState(1);
  const [isCreating, setIsCreating] = useState(products.length === 0);

  // Active flowers from step 1
  const activeFlowers = flowers.filter(f => f.isActive);

  // Calculate recipe cost
  const recipeCost = useMemo(() => {
    return recipeItems.reduce((sum, item) => {
      const flower = flowers.find(f => f.name === item.flowerType);
      return sum + (flower?.costPerStem || 0) * item.quantity;
    }, 0);
  }, [recipeItems, flowers]);

  // Calculate margin
  const margin = productForm.price > 0 
    ? ((productForm.price - recipeCost) / productForm.price) * 100 
    : 0;

  const handleAddFlowerToRecipe = () => {
    if (selectedFlower && flowerQuantity > 0) {
      const existingIndex = recipeItems.findIndex(r => r.flowerType === selectedFlower);
      if (existingIndex >= 0) {
        setRecipeItems(prev => prev.map((item, i) => 
          i === existingIndex 
            ? { ...item, quantity: item.quantity + flowerQuantity }
            : item
        ));
      } else {
        setRecipeItems(prev => [...prev, {
          id: `recipe-${Date.now()}`,
          productId: '',
          flowerType: selectedFlower,
          quantity: flowerQuantity,
        }]);
      }
      setSelectedFlower('');
      setFlowerQuantity(1);
    }
  };

  const handleRemoveFlower = (flowerType: string) => {
    setRecipeItems(prev => prev.filter(item => item.flowerType !== flowerType));
  };

  const handleSaveProduct = () => {
    if (productForm.name.trim() && productForm.price > 0) {
      const productId = `product-${Date.now()}`;
      addProduct({
        name: productForm.name.trim(),
        category: productForm.category,
        price: productForm.price,
        photoUrl: productForm.photoUrl || '/placeholder.svg',
        isActive: true,
      });
      
      // Save recipe with updated product ID
      const recipeWithProductId = recipeItems.map(item => ({
        ...item,
        productId,
      }));
      setRecipe(productId, recipeWithProductId);

      // Reset form for another product
      setProductForm(emptyProductForm);
      setRecipeItems([]);
      setIsCreating(false);
    }
  };

  const handleAddAnother = () => {
    setProductForm(emptyProductForm);
    setRecipeItems([]);
    setIsCreating(true);
  };

  const totalStems = recipeItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          Create your first arrangement
        </h2>
        <p className="text-muted-foreground">
          Add a product with its recipe. You'll see the cost and margin calculated automatically.
        </p>
      </div>

      {/* Created Products */}
      {products.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Products created</Label>
          <div className="flex flex-wrap gap-2">
            {products.map(product => (
              <Badge key={product.id} variant="secondary" className="py-1.5 px-3">
                <Check className="h-3.5 w-3.5 mr-1.5 text-primary" />
                {product.name} - ${product.price.toFixed(2)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Product Form */}
      <AnimatePresence mode="wait">
        {isCreating ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4 space-y-4">
                {/* Photo Preview */}
                <div className="flex justify-center">
                  <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-muted">
                    {productForm.photoUrl ? (
                      <img src={productForm.photoUrl} alt="Product" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImagePlus className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Product Name *</Label>
                  <Input
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Classic Dozen Roses"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={productForm.category}
                      onValueChange={(v) => setProductForm(prev => ({ ...prev, category: v as Product['category'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_CATEGORIES.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Retail Price *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={productForm.price || ''}
                        onChange={(e) => setProductForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00"
                        className="pl-7"
                      />
                    </div>
                  </div>
                </div>

                {/* Recipe Builder */}
                <div className="space-y-3 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <Label>Recipe Ingredients</Label>
                    {recipeItems.length > 0 && (
                      <span className="text-sm text-muted-foreground">{totalStems} stems</span>
                    )}
                  </div>

                  {/* Add Flower to Recipe */}
                  <div className="flex gap-2">
                    <Select value={selectedFlower} onValueChange={setSelectedFlower}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select flower..." />
                      </SelectTrigger>
                      <SelectContent>
                        {activeFlowers.map(flower => (
                          <SelectItem key={flower.id} value={flower.name}>
                            {flower.name} (${flower.costPerStem.toFixed(2)}/stem)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => setFlowerQuantity(prev => Math.max(1, prev - 1))}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-medium">{flowerQuantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => setFlowerQuantity(prev => prev + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      onClick={handleAddFlowerToRecipe}
                      disabled={!selectedFlower}
                      size="icon"
                      className="h-10 w-10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Recipe Items List */}
                  <AnimatePresence>
                    {recipeItems.map(item => {
                      const flower = flowers.find(f => f.name === item.flowerType);
                      const itemCost = (flower?.costPerStem || 0) * item.quantity;
                      return (
                        <motion.div
                          key={item.flowerType}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center justify-between p-2 bg-background rounded-lg border"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.flowerType}</span>
                            <Badge variant="secondary">×{item.quantity}</Badge>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">${itemCost.toFixed(2)}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleRemoveFlower(item.flowerType)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {recipeItems.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Add flowers from your library to build the recipe
                    </p>
                  )}
                </div>

                {/* Cost Summary */}
                {recipeItems.length > 0 && (
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Recipe Cost</span>
                      <span className="font-medium">${recipeCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Retail Price</span>
                      <span className="font-medium">${productForm.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t">
                      <span className="font-medium">Margin</span>
                      <span className={`font-semibold ${margin >= 50 ? 'text-primary' : margin >= 30 ? 'text-yellow-600' : 'text-destructive'}`}>
                        {margin.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <Button
                  onClick={handleSaveProduct}
                  disabled={!productForm.name.trim() || productForm.price <= 0}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Save Product
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Button
              variant="outline"
              onClick={handleAddAnother}
              className="w-full border-dashed py-8"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Another Product
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="pt-4 border-t flex gap-3">
        <Button
          variant="outline"
          onClick={prevStep}
          className="flex-1"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Button
          onClick={nextStep}
          disabled={products.length === 0}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          {products.length === 0 ? 'Create at least 1 product' : 'Start Using App'}
        </Button>
      </div>
    </div>
  );
}

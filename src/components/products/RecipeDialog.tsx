import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GripVertical, Flower2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { RecipeItem } from '@/types';
import { flowerTypes } from '@/data/mockData';

interface RecipeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string | null;
  productName: string;
  recipe: RecipeItem[];
  onSave: (productId: string, recipe: RecipeItem[]) => void;
}

const flowerCategories: Record<string, string[]> = {
  'Roses': ['Red Roses', 'Pink Roses', 'White Roses', 'Garden Roses', 'Spray Roses'],
  'Premium': ['Hydrangea', 'Ranunculus', 'Peonies', 'Orchids'],
  'Standard': ['Carnations', 'Stock', 'White Tulips', 'Pink Tulips', 'Waxflower'],
  'Greenery': ['Eucalyptus', 'Dusty Miller', 'Leather Leaf Fern', 'Ruscus', 'Baby\'s Breath'],
};

export function RecipeDialog({ open, onOpenChange, productId, productName, recipe, onSave }: RecipeDialogProps) {
  const [items, setItems] = useState<RecipeItem[]>([]);
  const [selectedFlower, setSelectedFlower] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    setItems(recipe);
  }, [recipe, open]);

  const handleAddItem = () => {
    if (!selectedFlower || !quantity || !productId) return;

    const newItem: RecipeItem = {
      id: `recipe-${Date.now()}`,
      productId,
      flowerType: selectedFlower,
      quantity: parseInt(quantity),
      notes: notes || undefined,
    };

    setItems(prev => [...prev, newItem]);
    setSelectedFlower('');
    setQuantity('');
    setNotes('');
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: string) => {
    const qty = parseInt(newQuantity) || 0;
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: qty } : item
    ));
  };

  const handleSave = () => {
    if (productId) {
      onSave(productId, items);
    }
  };

  const totalStems = items.reduce((sum, item) => sum + item.quantity, 0);
  const usedFlowers = items.map(i => i.flowerType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Flower2 className="h-5 w-5 text-primary" />
            Recipe Builder
          </DialogTitle>
          <DialogDescription>
            Define the flower composition for <span className="font-medium text-foreground">{productName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Add New Ingredient */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <Label className="text-sm font-medium">Add Ingredient</Label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <Select value={selectedFlower} onValueChange={setSelectedFlower}>
                <SelectTrigger className="sm:col-span-2 bg-background">
                  <SelectValue placeholder="Select flower type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(flowerCategories).map(([category, flowers]) => (
                    <div key={category}>
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{category}</div>
                      {flowers.map((flower) => (
                        <SelectItem 
                          key={flower} 
                          value={flower}
                          disabled={usedFlowers.includes(flower)}
                        >
                          {flower}
                          {usedFlowers.includes(flower) && ' (added)'}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Qty"
                className="bg-background"
              />
              <Button 
                onClick={handleAddItem} 
                disabled={!selectedFlower || !quantity}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            </div>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes (e.g., 'Premium grade only')"
              className="bg-background"
            />
          </div>

          {/* Recipe Items */}
          <div className="flex-1 min-h-0">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Recipe Ingredients</Label>
              <Badge variant="secondary" className="bg-sage-light text-sage">
                {items.length} types • {totalStems} stems
              </Badge>
            </div>
            
            <ScrollArea className="h-[200px] rounded-lg border">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <Flower2 className="h-10 w-10 text-muted-foreground/30" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    No ingredients yet. Add flowers above to build your recipe.
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  <AnimatePresence mode="popLayout">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        layout
                        className="flex items-center gap-3 rounded-lg border bg-card p-3"
                      >
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <GripVertical className="h-4 w-4 cursor-grab" />
                          <span className="text-xs font-medium w-5">{index + 1}.</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.flowerType}</p>
                          {item.notes && (
                            <p className="text-xs text-muted-foreground truncate">{item.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.id, e.target.value)}
                            className="w-16 h-8 text-center"
                          />
                          <span className="text-xs text-muted-foreground">stems</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Save Recipe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

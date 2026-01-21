import { motion } from 'framer-motion';
import { Edit2, Flower2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Product, RecipeItem } from '@/types';

interface ProductDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  recipe: RecipeItem[];
  onEditProduct: () => void;
  onEditRecipe: () => void;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  roses: { bg: 'bg-rose-light', text: 'text-rose' },
  mixed: { bg: 'bg-sage-light', text: 'text-sage' },
  premium: { bg: 'bg-peach-light', text: 'text-peach' },
  budget: { bg: 'bg-secondary', text: 'text-secondary-foreground' },
  seasonal: { bg: 'bg-accent', text: 'text-accent-foreground' },
};

export function ProductDetailDialog({ 
  open, 
  onOpenChange, 
  product, 
  recipe,
  onEditProduct,
  onEditRecipe,
}: ProductDetailDialogProps) {
  if (!product) return null;

  const categoryStyle = categoryColors[product.category] || categoryColors.mixed;
  const totalStems = recipe.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>Product details and recipe</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Header */}
          <div className="flex gap-4">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
              <img
                src={product.photoUrl || '/placeholder.svg'}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-display text-xl font-bold truncate">{product.name}</h2>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary" className={cn(categoryStyle.bg, categoryStyle.text, 'capitalize')}>
                      {product.category}
                    </Badge>
                    {product.isActive ? (
                      <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Archived
                      </Badge>
                    )}
                  </div>
                </div>
                <span className="font-display text-2xl font-bold text-primary">${product.price}</span>
              </div>
              <Button variant="outline" size="sm" className="mt-3" onClick={onEditProduct}>
                <Edit2 className="mr-2 h-3 w-3" />
                Edit Product
              </Button>
            </div>
          </div>

          <Separator />

          {/* Recipe Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flower2 className="h-4 w-4 text-primary" />
                <h3 className="font-display text-lg font-semibold">Recipe</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={onEditRecipe}>
                <Edit2 className="mr-2 h-3 w-3" />
                Edit
              </Button>
            </div>

            {recipe.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <Flower2 className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No recipe defined yet</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={onEditRecipe}>
                  Add Recipe
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {recipe.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background text-xs font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{item.flowerType}</p>
                        {item.notes && (
                          <p className="text-xs text-muted-foreground">{item.notes}</p>
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary">{item.quantity} stems</Badge>
                  </motion.div>
                ))}
                
                <div className="flex items-center justify-between rounded-lg bg-sage-light/50 px-3 py-2 mt-3">
                  <span className="text-sm font-medium text-sage">Total Stems</span>
                  <span className="font-display text-lg font-bold text-sage">{totalStems}</span>
                </div>
              </div>
            )}
          </div>

          {/* Meta info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
            <span>Created: {product.createdAt.toLocaleDateString()}</span>
            <span>Updated: {product.updatedAt.toLocaleDateString()}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

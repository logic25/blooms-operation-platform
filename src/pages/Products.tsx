import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Grid3X3, List, MoreHorizontal, Edit2, Archive, Copy, Trash2, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { mockProducts as initialProducts, mockRecipes as initialRecipes, flowerTypes } from '@/data/mockData';
import type { Product, RecipeItem } from '@/types';
import { ProductDialog } from '@/components/products/ProductDialog';
import { RecipeDialog } from '@/components/products/RecipeDialog';
import { ProductDetailDialog } from '@/components/products/ProductDetailDialog';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const categoryColors: Record<string, { bg: string; text: string }> = {
  roses: { bg: 'bg-rose-light', text: 'text-rose' },
  mixed: { bg: 'bg-sage-light', text: 'text-sage' },
  premium: { bg: 'bg-peach-light', text: 'text-peach' },
  budget: { bg: 'bg-secondary', text: 'text-secondary-foreground' },
  seasonal: { bg: 'bg-accent', text: 'text-accent-foreground' },
};

interface ProductCardProps {
  product: Product;
  recipe: RecipeItem[];
  onEdit: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onArchive: (productId: string) => void;
  onDelete: (productId: string) => void;
  onViewDetails: (product: Product) => void;
  onEditRecipe: (productId: string) => void;
}

function ProductCard({ product, recipe, onEdit, onDuplicate, onArchive, onDelete, onViewDetails, onEditRecipe }: ProductCardProps) {
  const categoryStyle = categoryColors[product.category] || categoryColors.mixed;

  return (
    <motion.div variants={itemVariants} layout>
      <Card className="group card-interactive overflow-hidden border-border/50">
        <div 
          className="relative aspect-square bg-muted cursor-pointer"
          onClick={() => onViewDetails(product)}
        >
          <img
            src={product.photoUrl || '/placeholder.svg'}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(product)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Product
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditRecipe(product.id)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Recipe
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(product)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArchive(product.id)}>
                <Archive className="mr-2 h-4 w-4" />
                {product.isActive ? 'Archive' : 'Restore'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(product.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-display text-lg font-semibold">{product.name}</h3>
              <button 
                onClick={() => onEditRecipe(product.id)}
                className="mt-0.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {recipe.length} flower types → Edit recipe
              </button>
            </div>
            <Badge variant="secondary" className={cn(categoryStyle.bg, categoryStyle.text, 'capitalize')}>
              {product.category}
            </Badge>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-display text-xl font-bold">${product.price}</span>
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
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [recipes, setRecipes] = useState<Record<string, RecipeItem[]>>(initialRecipes);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Dialog states
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [recipeDialogOpen, setRecipeDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductDialogOpen(true);
  };

  const handleSaveProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProduct) {
      // Update existing product
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...productData, updatedAt: new Date() }
          : p
      ));
      toast.success('Product updated successfully!');
    } else {
      // Create new product
      const newProduct: Product = {
        ...productData,
        id: `product-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProducts(prev => [...prev, newProduct]);
      setRecipes(prev => ({ ...prev, [newProduct.id]: [] }));
      toast.success('Product created successfully!');
      
      // Open recipe editor for new product
      setTimeout(() => {
        setEditingProductId(newProduct.id);
        setRecipeDialogOpen(true);
      }, 300);
    }
    setProductDialogOpen(false);
  };

  const handleDuplicate = (product: Product) => {
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}`,
      name: `${product.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts(prev => [...prev, newProduct]);
    // Copy recipe too
    if (recipes[product.id]) {
      setRecipes(prev => ({
        ...prev,
        [newProduct.id]: recipes[product.id].map(item => ({
          ...item,
          id: `recipe-${Date.now()}-${Math.random()}`,
          productId: newProduct.id,
        })),
      }));
    }
    toast.success('Product duplicated!');
  };

  const handleArchive = (productId: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, isActive: !p.isActive } : p
    ));
    const product = products.find(p => p.id === productId);
    toast.success(product?.isActive ? 'Product archived' : 'Product restored');
  };

  const handleDelete = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setRecipes(prev => {
      const newRecipes = { ...prev };
      delete newRecipes[productId];
      return newRecipes;
    });
    toast.success('Product deleted');
  };

  const handleViewDetails = (product: Product) => {
    setViewingProduct(product);
    setDetailDialogOpen(true);
  };

  const handleEditRecipe = (productId: string) => {
    setEditingProductId(productId);
    setRecipeDialogOpen(true);
  };

  const handleSaveRecipe = (productId: string, recipeItems: RecipeItem[]) => {
    setRecipes(prev => ({ ...prev, [productId]: recipeItems }));
    setRecipeDialogOpen(false);
    toast.success('Recipe updated!');
  };

  return (
    <div className="p-4 lg:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              Products
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage your floral arrangements and recipes
            </p>
          </div>
          <Button onClick={handleAddProduct} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="roses">Roses</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="seasonal">Seasonal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1 rounded-lg border p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={cn(
            'grid gap-4',
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          )}
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                recipe={recipes[product.id] || []}
                onEdit={handleEditProduct}
                onDuplicate={handleDuplicate}
                onArchive={handleArchive}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
                onEditRecipe={handleEditRecipe}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">No products found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={handleAddProduct} variant="outline" className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add your first product
            </Button>
          </div>
        )}
      </motion.div>

      {/* Dialogs */}
      <ProductDialog
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      <RecipeDialog
        open={recipeDialogOpen}
        onOpenChange={setRecipeDialogOpen}
        productId={editingProductId}
        productName={products.find(p => p.id === editingProductId)?.name || ''}
        recipe={editingProductId ? recipes[editingProductId] || [] : []}
        onSave={handleSaveRecipe}
      />

      <ProductDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        product={viewingProduct}
        recipe={viewingProduct ? recipes[viewingProduct.id] || [] : []}
        onEditProduct={() => {
          if (viewingProduct) {
            setDetailDialogOpen(false);
            handleEditProduct(viewingProduct);
          }
        }}
        onEditRecipe={() => {
          if (viewingProduct) {
            setDetailDialogOpen(false);
            handleEditRecipe(viewingProduct.id);
          }
        }}
      />
    </div>
  );
}

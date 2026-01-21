import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingUp, TrendingDown, Minus, AlertCircle, Package, Info, Flower2, DollarSign, Star, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { mockProducts, mockRecipes, mockProductionPlan, mockVendorInventory, mockVendors } from '@/data/mockData';
import type { FlowerNeed, VendorInventory } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'h-3 w-3',
            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted'
          )}
        />
      ))}
    </div>
  );
}

function VendorOption({ inventory, isSelected, onSelect }: { 
  inventory: VendorInventory; 
  isSelected: boolean;
  onSelect: () => void;
}) {
  const vendor = mockVendors.find(v => v.id === inventory.vendorId);
  
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onSelect}
      className={cn(
        'w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all',
        isSelected 
          ? 'border-primary bg-primary/5 ring-1 ring-primary' 
          : 'hover:bg-muted/50'
      )}
    >
      {isSelected && (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
          <Check className="h-3 w-3 text-primary-foreground" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{vendor?.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <RatingStars rating={inventory.qualityRating} />
          <span className="text-xs text-muted-foreground">Quality</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="font-medium">${inventory.peakPrice.toFixed(2)}/stem</p>
        <p className="text-xs text-muted-foreground">{vendor?.leadTimeDays}d lead</p>
      </div>
    </motion.button>
  );
}

export default function Planner() {
  const [plannedQuantities, setPlannedQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    mockProductionPlan.items.forEach(item => {
      initial[item.productId] = item.plannedQuantity;
    });
    return initial;
  });

  const [showResults, setShowResults] = useState(true);
  const [selectedVendors, setSelectedVendors] = useState<Record<string, string>>({});

  const handleQuantityChange = (productId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setPlannedQuantities(prev => ({ ...prev, [productId]: numValue }));
  };

  // Calculate flower needs
  const flowerNeeds = useMemo(() => {
    const needsMap: Record<string, FlowerNeed> = {};

    Object.entries(plannedQuantities).forEach(([productId, quantity]) => {
      if (quantity <= 0) return;
      
      const recipe = mockRecipes[productId] || [];
      const product = mockProducts.find(p => p.id === productId);
      
      recipe.forEach(item => {
        if (!needsMap[item.flowerType]) {
          needsMap[item.flowerType] = {
            flowerType: item.flowerType,
            totalStems: 0,
            stemsByProduct: [],
          };
        }
        
        const totalStems = item.quantity * quantity;
        needsMap[item.flowerType].totalStems += totalStems;
        needsMap[item.flowerType].stemsByProduct.push({
          productName: product?.name || 'Unknown',
          productId,
          quantity,
          stemsPerUnit: item.quantity,
          totalStems,
        });
      });
    });

    return Object.values(needsMap).sort((a, b) => b.totalStems - a.totalStems);
  }, [plannedQuantities]);

  const totalUnits = Object.values(plannedQuantities).reduce((sum, qty) => sum + qty, 0);
  const totalStems = flowerNeeds.reduce((sum, need) => sum + Math.ceil(need.totalStems * 1.05), 0);
  
  // Calculate total cost estimate
  const totalCost = useMemo(() => {
    return flowerNeeds.reduce((sum, need) => {
      const vendorId = selectedVendors[need.flowerType];
      const inventory = mockVendorInventory.find(i => i.flowerType === need.flowerType && i.vendorId === vendorId);
      if (inventory) {
        return sum + (Math.ceil(need.totalStems * 1.05) * inventory.peakPrice);
      }
      // Use cheapest option if no vendor selected
      const cheapest = mockVendorInventory
        .filter(i => i.flowerType === need.flowerType)
        .sort((a, b) => a.peakPrice - b.peakPrice)[0];
      return sum + (Math.ceil(need.totalStems * 1.05) * (cheapest?.peakPrice || 0));
    }, 0);
  }, [flowerNeeds, selectedVendors]);

  const handleSelectVendor = (flowerType: string, vendorId: string) => {
    setSelectedVendors(prev => ({ ...prev, [flowerType]: vendorId }));
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
              Production Planner
            </h1>
            <p className="mt-1 text-muted-foreground">
              Plan your arrangements and calculate total flower needs
            </p>
          </div>
          <Badge variant="secondary" className="w-fit bg-rose-light text-rose">
            {mockProductionPlan.eventName}
          </Badge>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-light">
                  <Package className="h-5 w-5 text-sage" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Arrangements</p>
                  <p className="font-display text-2xl font-bold">{totalUnits}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-light">
                  <Flower2 className="h-5 w-5 text-rose" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Stems</p>
                  <p className="font-display text-2xl font-bold">{totalStems.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-peach-light">
                  <Calculator className="h-5 w-5 text-peach" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Flower Types</p>
                  <p className="font-display text-2xl font-bold">{flowerNeeds.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-gradient-to-br from-sage-light/50 to-sage-light">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage">
                  <DollarSign className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-sage">Est. Flower Cost</p>
                  <p className="font-display text-2xl font-bold text-sage">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {/* Planning Input */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-display text-xl">
                  <Package className="h-5 w-5 text-primary" />
                  Planned Quantities
                </CardTitle>
                <CardDescription>
                  Enter how many of each arrangement you plan to make
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[45%]">Product</TableHead>
                        <TableHead className="text-center">Last Year</TableHead>
                        <TableHead className="text-center">Planned</TableHead>
                        <TableHead className="text-center">Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockProducts.filter(p => p.isActive).map((product, index) => {
                        const planItem = mockProductionPlan.items.find(i => i.productId === product.id);
                        const lastYear = planItem?.lastYearQuantity || 0;
                        const planned = plannedQuantities[product.id] || 0;
                        const changePercent = lastYear > 0 ? ((planned - lastYear) / lastYear) * 100 : 0;
                        const isSignificantChange = Math.abs(changePercent) > 30;

                        return (
                          <motion.tr
                            key={product.id}
                            variants={itemVariants}
                            className="group"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                                  <img
                                    src={product.photoUrl || '/placeholder.svg'}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate font-medium">{product.name}</p>
                                  <p className="text-xs text-muted-foreground">${product.price}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="text-muted-foreground">{lastYear}</span>
                            </TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                min="0"
                                value={planned}
                                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                className="mx-auto w-20 text-center"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              {lastYear > 0 ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className={cn(
                                        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                                        changePercent > 0 && 'bg-emerald-100 text-emerald-700',
                                        changePercent < 0 && 'bg-rose-100 text-rose-700',
                                        changePercent === 0 && 'bg-muted text-muted-foreground',
                                        isSignificantChange && 'ring-2 ring-amber-400/50'
                                      )}>
                                        {changePercent > 0 ? (
                                          <TrendingUp className="h-3 w-3" />
                                        ) : changePercent < 0 ? (
                                          <TrendingDown className="h-3 w-3" />
                                        ) : (
                                          <Minus className="h-3 w-3" />
                                        )}
                                        {changePercent > 0 ? '+' : ''}{changePercent.toFixed(0)}%
                                      </div>
                                    </TooltipTrigger>
                                    {isSignificantChange && (
                                      <TooltipContent>
                                        <p className="flex items-center gap-1">
                                          <AlertCircle className="h-3 w-3" />
                                          Significant change from last year
                                        </p>
                                      </TooltipContent>
                                    )}
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <span className="text-xs text-muted-foreground">New</span>
                              )}
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Panel */}
          <div className="space-y-4">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-display text-xl">
                  <Calculator className="h-5 w-5 text-primary" />
                  Flower Needs by Type
                </CardTitle>
                <CardDescription>
                  Aggregated totals with 5% waste buffer • Select preferred vendor for each
                </CardDescription>
              </CardHeader>
              <CardContent>
                {flowerNeeds.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Info className="h-10 w-10 text-muted-foreground/50" />
                    <p className="mt-3 text-sm text-muted-foreground">
                      Enter quantities above to see your flower needs
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {flowerNeeds.map((need, index) => {
                      const withBuffer = Math.ceil(need.totalStems * 1.05);
                      const maxStems = Math.max(...flowerNeeds.map(n => n.totalStems));
                      const percentage = (need.totalStems / maxStems) * 100;
                      const vendorOptions = mockVendorInventory.filter(i => i.flowerType === need.flowerType);
                      const selectedVendorId = selectedVendors[need.flowerType];

                      return (
                        <motion.div
                          key={need.flowerType}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="rounded-xl border p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Flower2 className="h-4 w-4 text-primary" />
                              <span className="font-medium">{need.flowerType}</span>
                            </div>
                            <Badge variant="secondary" className="bg-sage-light text-sage font-display text-lg">
                              {withBuffer} stems
                            </Badge>
                          </div>
                          <Progress value={percentage} className="h-1.5 mb-3" />
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="cursor-help text-xs text-muted-foreground mb-3">
                                  From {need.stemsByProduct.length} product{need.stemsByProduct.length > 1 ? 's' : ''} • Click for breakdown
                                </p>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="max-w-xs">
                                <div className="space-y-1 text-xs">
                                  {need.stemsByProduct.map(item => (
                                    <p key={item.productId}>
                                      {item.productName}: {item.quantity} × {item.stemsPerUnit} = {item.totalStems}
                                    </p>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {/* Vendor Options */}
                          {vendorOptions.length > 0 ? (
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-muted-foreground">Select Vendor:</p>
                              {vendorOptions.map(inv => (
                                <VendorOption
                                  key={inv.id}
                                  inventory={inv}
                                  isSelected={selectedVendorId === inv.vendorId}
                                  onSelect={() => handleSelectVendor(need.flowerType, inv.vendorId)}
                                />
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                              ⚠️ No vendor carries this flower
                            </p>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

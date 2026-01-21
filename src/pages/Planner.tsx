import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, TrendingDown, Minus, AlertCircle, Package, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { mockProducts, mockRecipes, mockProductionPlan } from '@/data/mockData';
import type { FlowerNeed } from '@/types';

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

export default function Planner() {
  const [plannedQuantities, setPlannedQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    mockProductionPlan.items.forEach(item => {
      initial[item.productId] = item.plannedQuantity;
    });
    return initial;
  });

  const [showResults, setShowResults] = useState(false);

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

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Planning Input */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="lg:col-span-3 space-y-4">
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

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Total: <span className="font-semibold text-foreground">{totalUnits}</span> arrangements
                  </div>
                  <Button onClick={() => setShowResults(true)} className="bg-primary hover:bg-primary/90">
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate Needs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <Card className={cn(
              'sticky top-20 border-border/50 transition-all',
              showResults ? 'ring-2 ring-primary/20' : ''
            )}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-display text-xl">
                  <Calculator className="h-5 w-5 text-primary" />
                  Flower Needs
                </CardTitle>
                <CardDescription>
                  Aggregated totals with 5% waste buffer
                </CardDescription>
              </CardHeader>
              <CardContent>
                {flowerNeeds.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Info className="h-10 w-10 text-muted-foreground/50" />
                    <p className="mt-3 text-sm text-muted-foreground">
                      Enter quantities and click calculate to see your flower needs
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {flowerNeeds.map((need, index) => {
                      const withBuffer = Math.ceil(need.totalStems * 1.05);
                      const maxStems = Math.max(...flowerNeeds.map(n => n.totalStems));
                      const percentage = (need.totalStems / maxStems) * 100;

                      return (
                        <motion.div
                          key={need.flowerType}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="rounded-lg border p-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{need.flowerType}</span>
                            <span className="font-display text-lg font-bold">{withBuffer}</span>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <Progress value={percentage} className="h-1.5 flex-1" />
                            <span className="text-xs text-muted-foreground">stems</span>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="mt-1 cursor-help text-xs text-muted-foreground">
                                  From {need.stemsByProduct.length} product{need.stemsByProduct.length > 1 ? 's' : ''}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="max-w-xs">
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
                        </motion.div>
                      );
                    })}

                    <div className="mt-4 rounded-lg bg-muted/50 p-3 text-center">
                      <p className="text-xs text-muted-foreground">
                        Totals include 5% waste buffer
                      </p>
                    </div>
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

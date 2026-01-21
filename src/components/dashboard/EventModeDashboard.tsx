import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import { 
  ArrowLeft, 
  Calendar, 
  Calculator, 
  TrendingUp, 
  Flower2, 
  DollarSign, 
  Star, 
  Check, 
  Package,
  Clock,
  ChevronDown,
  ChevronUp,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ModeToggle } from '@/components/dashboard/ModeToggle';
import { QuickOrderDialog } from '@/components/dashboard/QuickOrderDialog';
import { useAppMode } from '@/context/AppModeContext';
import { mockProducts, mockRecipes, mockProductionPlan, mockVendorInventory, mockVendors, mockDeadlines } from '@/data/mockData';
import { cn } from '@/lib/utils';
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

export function EventModeDashboard() {
  const { setMode, activeEventId, events, dailyOrders } = useAppMode();
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [expandedFlowers, setExpandedFlowers] = useState<Set<string>>(new Set());
  const [selectedVendors, setSelectedVendors] = useState<Record<string, string>>({});
  const [plannedQuantities, setPlannedQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    mockProductionPlan.items.forEach(item => {
      initial[item.productId] = item.plannedQuantity;
    });
    return initial;
  });

  // Get active event (or default to Valentine's Day)
  const activeEvent = events.find(e => e.id === activeEventId) || events[0];
  const daysUntilEvent = differenceInDays(activeEvent?.eventDate || mockProductionPlan.eventDate, new Date());

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
      const cheapest = mockVendorInventory
        .filter(i => i.flowerType === need.flowerType)
        .sort((a, b) => a.peakPrice - b.peakPrice)[0];
      return sum + (Math.ceil(need.totalStems * 1.05) * (cheapest?.peakPrice || 0));
    }, 0);
  }, [flowerNeeds, selectedVendors]);

  const handleQuantityChange = (productId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setPlannedQuantities(prev => ({ ...prev, [productId]: numValue }));
  };

  const toggleFlowerExpanded = (flowerType: string) => {
    setExpandedFlowers(prev => {
      const next = new Set(prev);
      if (next.has(flowerType)) {
        next.delete(flowerType);
      } else {
        next.add(flowerType);
      }
      return next;
    });
  };

  // Daily orders section (always visible)
  const pendingDailyOrders = dailyOrders.filter(o => o.status === 'pending' && !o.eventId).length;

  return (
    <div className="p-4 lg:p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="font-display text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                  {activeEvent?.name || mockProductionPlan.eventName}
                </h1>
                <p className="text-muted-foreground">
                  {format(activeEvent?.eventDate || mockProductionPlan.eventDate, 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <ModeToggle />
              <div className="flex items-center gap-2">
                <span className="font-display text-4xl font-bold text-rose">{daysUntilEvent}</span>
                <span className="text-muted-foreground">days to go</span>
              </div>
            </div>
          </div>

          {/* Daily Orders Banner */}
          {pendingDailyOrders > 0 && (
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">{pendingDailyOrders} daily orders</span> still pending
                </span>
              </div>
              <Button size="sm" variant="outline" onClick={() => setOrderDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Order
              </Button>
            </div>
          )}
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-light">
                  <Package className="h-5 w-5 text-sage" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Arrangements</p>
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
                  <p className="text-sm text-sage">Est. Cost</p>
                  <p className="font-display text-2xl font-bold text-sage">${totalCost.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Production Planning */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Production Planning
                </CardTitle>
                <CardDescription>
                  What are you making for {activeEvent?.name || 'this event'}?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockProducts.filter(p => p.isActive).map((product) => {
                    const planItem = mockProductionPlan.items.find(i => i.productId === product.id);
                    const lastYear = planItem?.lastYearQuantity || 0;
                    const planned = plannedQuantities[product.id] || 0;

                    return (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <img
                            src={product.photoUrl || '/placeholder.svg'}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Last year: {lastYear} • ${product.price}
                          </p>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          value={planned}
                          onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                          className="w-20 h-10 text-center"
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Flower Needs & Vendor Selection */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <Flower2 className="h-5 w-5 text-primary" />
                  Bulk Procurement
                </CardTitle>
                <CardDescription>
                  Aggregated needs with 5% buffer • Select vendors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {flowerNeeds.map((need) => {
                    const withBuffer = Math.ceil(need.totalStems * 1.05);
                    const vendorOptions = mockVendorInventory.filter(i => i.flowerType === need.flowerType);
                    const isExpanded = expandedFlowers.has(need.flowerType);
                    const selectedVendorId = selectedVendors[need.flowerType];
                    const selectedVendor = selectedVendorId 
                      ? mockVendors.find(v => v.id === selectedVendorId)
                      : null;

                    return (
                      <div key={need.flowerType} className="rounded-lg border">
                        <button
                          onClick={() => toggleFlowerExpanded(need.flowerType)}
                          className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/50 transition-colors"
                        >
                          <Flower2 className="h-4 w-4 text-primary shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{need.flowerType}</p>
                            {selectedVendor && (
                              <p className="text-xs text-muted-foreground truncate">
                                {selectedVendor.name}
                              </p>
                            )}
                          </div>
                          <Badge variant="secondary" className="bg-sage-light text-sage shrink-0">
                            {withBuffer} stems
                          </Badge>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>

                        {isExpanded && vendorOptions.length > 0 && (
                          <div className="border-t p-3 space-y-2 bg-muted/30">
                            <p className="text-xs font-medium text-muted-foreground">Select Vendor</p>
                            {vendorOptions.map(inv => {
                              const vendor = mockVendors.find(v => v.id === inv.vendorId);
                              const isSelected = selectedVendors[need.flowerType] === inv.vendorId;
                              const orderByDate = new Date(activeEvent?.eventDate || mockProductionPlan.eventDate);
                              orderByDate.setDate(orderByDate.getDate() - (vendor?.leadTimeDays || 3));

                              return (
                                <button
                                  key={inv.id}
                                  onClick={() => setSelectedVendors(prev => ({
                                    ...prev,
                                    [need.flowerType]: inv.vendorId
                                  }))}
                                  className={cn(
                                    'w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all',
                                    isSelected 
                                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                      : 'hover:bg-background'
                                  )}
                                >
                                  {isSelected && (
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary shrink-0">
                                      <Check className="h-3 w-3 text-primary-foreground" />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{vendor?.name}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <RatingStars rating={inv.qualityRating} />
                                      <span className="text-xs text-muted-foreground">
                                        Order by {format(orderByDate, 'MMM d')}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="font-medium">${inv.peakPrice.toFixed(2)}/stem</p>
                                    <p className="text-xs text-muted-foreground">
                                      {vendor?.leadTimeDays}d lead
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Procurement Timeline */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Procurement Timeline
              </CardTitle>
              <CardDescription>Key dates and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {mockDeadlines.map((deadline, index) => {
                  const daysAway = differenceInDays(deadline.date, new Date());
                  
                  return (
                    <div
                      key={deadline.id}
                      className={cn(
                        'flex-shrink-0 w-48 rounded-lg border p-4',
                        deadline.status === 'urgent' && 'border-destructive/50 bg-destructive/5',
                        deadline.status === 'warning' && 'border-amber-200 bg-amber-50/50',
                        deadline.status === 'success' && 'border-sage/50 bg-sage-light/50'
                      )}
                    >
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        {deadline.type}
                      </p>
                      <p className="font-medium mt-1 truncate">{deadline.title}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {format(deadline.date, 'MMM d')} • {daysAway === 0 ? 'Today' : `${daysAway}d`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <QuickOrderDialog 
        open={orderDialogOpen} 
        onOpenChange={setOrderDialogOpen} 
      />
    </div>
  );
}

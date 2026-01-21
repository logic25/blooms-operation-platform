import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { addDays, isBefore, startOfDay } from 'date-fns';
import { ShoppingCart, Check, Copy, Mail, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAppMode } from '@/context/AppModeContext';
import { mockProducts, mockRecipes } from '@/data/mockData';
import type { ShoppingListItem } from '@/types';
import { toast } from 'sonner';

export function ShoppingList() {
  const { dailyOrders, coolerInventory } = useAppMode();
  const [purchased, setPurchased] = useState<Set<string>>(new Set());
  const [daysAhead, setDaysAhead] = useState<3 | 4>(3);

  // Calculate flower needs for upcoming orders
  const shoppingItems: ShoppingListItem[] = useMemo(() => {
    const cutoffDate = addDays(startOfDay(new Date()), daysAhead);
    
    // Get pending orders within the date range
    const relevantOrders = dailyOrders.filter(
      order => order.status === 'pending' && 
      isBefore(startOfDay(order.deliveryDate), cutoffDate)
    );

    // Calculate total flower needs from orders
    const flowerNeeds: Record<string, number> = {};
    
    relevantOrders.forEach(order => {
      const recipe = mockRecipes[order.productId] || [];
      recipe.forEach(item => {
        flowerNeeds[item.flowerType] = (flowerNeeds[item.flowerType] || 0) + (item.quantity * order.quantity);
      });
    });

    // Compare with cooler inventory
    const items: ShoppingListItem[] = Object.entries(flowerNeeds).map(([flowerType, needed]) => {
      const inventoryItem = coolerInventory.find(i => i.flowerType === flowerType);
      const inStock = inventoryItem?.quantity || 0;
      const toBuy = Math.max(0, needed - inStock);

      return {
        flowerType,
        needed,
        inStock,
        toBuy,
        purchased: purchased.has(flowerType),
      };
    });

    // Sort by toBuy descending, then filter out items we don't need to buy
    return items
      .filter(item => item.toBuy > 0)
      .sort((a, b) => b.toBuy - a.toBuy);
  }, [dailyOrders, coolerInventory, daysAhead, purchased]);

  const togglePurchased = (flowerType: string) => {
    setPurchased(prev => {
      const next = new Set(prev);
      if (next.has(flowerType)) {
        next.delete(flowerType);
      } else {
        next.add(flowerType);
      }
      return next;
    });
  };

  const unpurchasedItems = shoppingItems.filter(i => !i.purchased);
  const purchasedItems = shoppingItems.filter(i => i.purchased);

  const copyToClipboard = () => {
    const text = unpurchasedItems
      .map(item => `${item.flowerType}: ${item.toBuy} stems`)
      .join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Shopping list copied to clipboard');
  };

  const emailList = () => {
    const body = unpurchasedItems
      .map(item => `• ${item.flowerType}: ${item.toBuy} stems`)
      .join('%0A');
    window.location.href = `mailto:?subject=Flower Order&body=Shopping List:%0A${body}`;
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Shopping List
            </CardTitle>
            <CardDescription>
              Flowers needed for next {daysAhead} days
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={daysAhead === 3 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDaysAhead(3)}
              className={cn(daysAhead === 3 && 'bg-primary hover:bg-primary/90')}
            >
              3 Days
            </Button>
            <Button
              variant={daysAhead === 4 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDaysAhead(4)}
              className={cn(daysAhead === 4 && 'bg-primary hover:bg-primary/90')}
            >
              4 Days
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {shoppingItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Check className="h-10 w-10 text-sage" />
            <p className="mt-3 font-medium text-foreground">Fully stocked!</p>
            <p className="text-sm text-muted-foreground">
              No flowers needed for the next {daysAhead} days of orders
            </p>
          </div>
        ) : (
          <>
            {/* Action buttons */}
            <div className="flex gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-2" />
                Copy List
              </Button>
              <Button variant="outline" size="sm" onClick={emailList}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>

            {/* Items to buy */}
            <div className="space-y-2">
              {unpurchasedItems.map((item, index) => (
                <motion.div
                  key={item.flowerType}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <Checkbox
                    id={`buy-${item.flowerType}`}
                    checked={item.purchased}
                    onCheckedChange={() => togglePurchased(item.flowerType)}
                    className="h-6 w-6"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.flowerType}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Need: {item.needed}</span>
                      <span>•</span>
                      <span className={cn(
                        item.inStock === 0 && 'text-destructive'
                      )}>
                        In stock: {item.inStock}
                      </span>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      'font-display text-base',
                      item.inStock === 0 && 'bg-destructive/10 text-destructive'
                    )}
                  >
                    Buy {item.toBuy}
                  </Badge>
                </motion.div>
              ))}
            </div>

            {/* Purchased items */}
            {purchasedItems.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Purchased</p>
                <div className="space-y-2">
                  {purchasedItems.map(item => (
                    <div
                      key={item.flowerType}
                      className="flex items-center gap-3 rounded-lg border border-dashed p-3 opacity-60"
                    >
                      <Checkbox
                        id={`bought-${item.flowerType}`}
                        checked={true}
                        onCheckedChange={() => togglePurchased(item.flowerType)}
                        className="h-6 w-6"
                      />
                      <span className="font-medium line-through">{item.flowerType}</span>
                      <Badge variant="outline" className="ml-auto">
                        {item.toBuy} stems
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Snowflake, Plus, Minus, Check, Truck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAppMode } from '@/context/AppModeContext';

export function CoolerInventory() {
  const { coolerInventory, updateInventoryQuantity, expectedDeliveries, markDeliveryReceived } = useAppMode();
  const [editingFlower, setEditingFlower] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const pendingDeliveries = expectedDeliveries.filter(d => !d.received);

  const handleStartEdit = (flowerType: string, currentQty: number) => {
    setEditingFlower(flowerType);
    setEditValue(currentQty);
  };

  const handleSaveEdit = () => {
    if (editingFlower) {
      updateInventoryQuantity(editingFlower, editValue);
      setEditingFlower(null);
    }
  };

  const handleQuickAdjust = (flowerType: string, currentQty: number, delta: number) => {
    updateInventoryQuantity(flowerType, Math.max(0, currentQty + delta));
  };

  const getStockLevel = (quantity: number) => {
    if (quantity === 0) return { label: 'Out', color: 'bg-destructive/10 text-destructive' };
    if (quantity <= 10) return { label: 'Low', color: 'bg-amber-100 text-amber-700' };
    return { label: 'OK', color: 'bg-emerald-100 text-emerald-700' };
  };

  // Sort: out of stock first, then low, then by name
  const sortedInventory = [...coolerInventory].sort((a, b) => {
    if (a.quantity === 0 && b.quantity !== 0) return -1;
    if (a.quantity !== 0 && b.quantity === 0) return 1;
    if (a.quantity <= 10 && b.quantity > 10) return -1;
    if (a.quantity > 10 && b.quantity <= 10) return 1;
    return a.flowerType.localeCompare(b.flowerType);
  });

  const lastUpdated = coolerInventory.length > 0 
    ? format(Math.max(...coolerInventory.map(i => i.lastUpdated.getTime())), 'h:mma')
    : 'Never';

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <Snowflake className="h-5 w-5 text-primary" />
              Cooler Inventory
            </CardTitle>
            <CardDescription>Last updated: {lastUpdated}</CardDescription>
          </div>
          {pendingDeliveries.length > 0 && (
            <Badge variant="secondary" className="bg-peach-light text-peach">
              <Truck className="h-3 w-3 mr-1" />
              {pendingDeliveries.length} incoming
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {sortedInventory.map((item, index) => {
            const stockLevel = getStockLevel(item.quantity);
            const isEditing = editingFlower === item.flowerType;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className={cn(
                  'flex items-center gap-3 rounded-lg border p-3 transition-all',
                  item.quantity === 0 && 'border-destructive/30 bg-destructive/5',
                  item.quantity <= 10 && item.quantity > 0 && 'border-amber-200 bg-amber-50/50'
                )}
              >
                <div className={cn('h-3 w-3 rounded-full', stockLevel.color.split(' ')[0])} />
                
                <span className="flex-1 font-medium truncate">{item.flowerType}</span>
                
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      value={editValue}
                      onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                      className="w-20 h-9 text-center"
                      autoFocus
                    />
                    <Button size="sm" onClick={handleSaveEdit} className="h-9">
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuickAdjust(item.flowerType, item.quantity, -5)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <button
                      onClick={() => handleStartEdit(item.flowerType, item.quantity)}
                      className={cn(
                        'min-w-[3rem] rounded-md px-2 py-1 text-center font-medium transition-colors',
                        stockLevel.color
                      )}
                    >
                      {item.quantity}
                    </button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuickAdjust(item.flowerType, item.quantity, 5)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Expected Deliveries */}
        {pendingDeliveries.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <Truck className="h-4 w-4" />
              Expected Deliveries
            </p>
            <div className="space-y-2">
              {pendingDeliveries.map(delivery => (
                <div
                  key={delivery.id}
                  className="flex items-center justify-between rounded-lg border border-dashed p-2 text-sm"
                >
                  <div>
                    <span className="font-medium">{delivery.flowerType}</span>
                    <span className="text-muted-foreground"> • {delivery.quantity} stems</span>
                    <p className="text-xs text-muted-foreground">
                      Expected {format(delivery.expectedDate, 'MMM d')}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markDeliveryReceived(delivery.id)}
                  >
                    Mark Received
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

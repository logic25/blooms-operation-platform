import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Package, Plus, AlertTriangle, Check, Truck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAppMode } from '@/context/AppModeContext';
import { mockVendors, flowerTypes } from '@/data/mockData';

export function AvailableInventory() {
  const { getAvailableInventory, addDelivery, expectedDeliveries, markDeliveryReceived } = useAppMode();
  const [deliveryDialogOpen, setDeliveryDialogOpen] = useState(false);
  const [newDelivery, setNewDelivery] = useState({
    flowerType: '',
    quantity: 25,
    vendorId: '',
    costTotal: 0,
  });

  const inventoryData = getAvailableInventory();
  const pendingDeliveries = expectedDeliveries.filter(d => !d.received);

  // Count warnings (negative or zero available)
  const warningCount = inventoryData.filter(item => item.available <= 0).length;
  const lowCount = inventoryData.filter(item => item.available > 0 && item.available <= 10).length;

  const handleRecordDelivery = () => {
    if (!newDelivery.flowerType || newDelivery.quantity <= 0) return;
    
    addDelivery({
      flowerType: newDelivery.flowerType,
      quantityStems: newDelivery.quantity,
      receivedDate: new Date(),
      vendorId: newDelivery.vendorId || undefined,
      costTotal: newDelivery.costTotal || undefined,
    });
    
    setNewDelivery({
      flowerType: '',
      quantity: 25,
      vendorId: '',
      costTotal: 0,
    });
    setDeliveryDialogOpen(false);
  };

  const getStockLevel = (available: number) => {
    if (available <= 0) return { label: available < 0 ? 'Short' : 'Out', color: 'bg-destructive/10 text-destructive', icon: AlertTriangle };
    if (available <= 10) return { label: 'Low', color: 'bg-amber-100 text-amber-700', icon: null };
    return { label: 'OK', color: 'bg-emerald-100 text-emerald-700', icon: Check };
  };

  return (
    <Card className="border-border/50 h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Available Inventory
            </CardTitle>
            <CardDescription>
              Auto-calculated: Deliveries - Committed Orders
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            {warningCount > 0 && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                {warningCount} short
              </Badge>
            )}
            {lowCount > 0 && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                {lowCount} low
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Record Delivery Button */}
        <Dialog open={deliveryDialogOpen} onOpenChange={setDeliveryDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-4" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Record Delivery
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Record Flower Delivery</DialogTitle>
              <DialogDescription>
                Log flowers received from a vendor
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Flower Type *</Label>
                <Select
                  value={newDelivery.flowerType}
                  onValueChange={(value) => setNewDelivery(prev => ({ ...prev, flowerType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select flower" />
                  </SelectTrigger>
                  <SelectContent>
                    {flowerTypes.map(flower => (
                      <SelectItem key={flower} value={flower}>
                        {flower}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Quantity (stems) *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newDelivery.quantity}
                    onChange={(e) => setNewDelivery(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Total Cost ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newDelivery.costTotal || ''}
                    onChange={(e) => setNewDelivery(prev => ({ ...prev, costTotal: parseFloat(e.target.value) || 0 }))}
                    placeholder="Optional"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Vendor</Label>
                <Select
                  value={newDelivery.vendorId}
                  onValueChange={(value) => setNewDelivery(prev => ({ ...prev, vendorId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockVendors.map(vendor => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeliveryDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRecordDelivery} disabled={!newDelivery.flowerType || newDelivery.quantity <= 0}>
                Record
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Inventory List */}
        <div className="space-y-2 flex-1 overflow-y-auto pr-1">
          {inventoryData.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Package className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No inventory data yet</p>
              <p className="text-xs">Record a delivery to get started</p>
            </div>
          ) : (
            inventoryData.map((item, index) => {
              const stockLevel = getStockLevel(item.available);

              return (
                <motion.div
                  key={item.flowerType}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border p-3 transition-all',
                    item.available <= 0 && 'border-destructive/30 bg-destructive/5',
                    item.available > 0 && item.available <= 10 && 'border-amber-200 bg-amber-50/50'
                  )}
                >
                  {stockLevel.icon && (
                    <stockLevel.icon className={cn(
                      'h-4 w-4 shrink-0',
                      item.available <= 0 ? 'text-destructive' : 'text-emerald-600'
                    )} />
                  )}
                  {!stockLevel.icon && (
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <span className="font-medium truncate block">{item.flowerType}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.delivered} delivered − {item.committed} committed
                    </span>
                  </div>
                  
                  <div className={cn(
                    'min-w-[3.5rem] rounded-md px-2 py-1 text-center font-medium text-sm',
                    stockLevel.color
                  )}>
                    {item.available}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Pending Deliveries */}
        {pendingDeliveries.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <Truck className="h-4 w-4" />
              Expected Deliveries ({pendingDeliveries.length})
            </p>
            <div className="space-y-2">
              {pendingDeliveries.slice(0, 3).map(delivery => (
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
                    Received
                  </Button>
                </div>
              ))}
              {pendingDeliveries.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{pendingDeliveries.length - 3} more pending
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

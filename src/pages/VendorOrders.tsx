import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, addDays } from 'date-fns';
import { Plus, Search, Truck, Package, Check, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAppMode } from '@/context/AppModeContext';
import { mockVendors } from '@/data/mockData';
import { flowerTypes } from '@/data/mockData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

type StatusFilter = 'all' | 'pending' | 'received';

export default function VendorOrders() {
  const { expectedDeliveries, addExpectedDelivery, markDeliveryReceived } = useAppMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  // New order form state
  const [newOrder, setNewOrder] = useState({
    vendorId: '',
    flowerType: '',
    quantity: 25,
    expectedDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
  });

  const filteredOrders = useMemo(() => {
    return expectedDeliveries.filter(order => {
      // Search filter
      const vendor = mockVendors.find(v => v.id === order.vendorId);
      const searchMatch = 
        order.flowerType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor?.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!searchMatch) return false;

      // Status filter
      if (statusFilter === 'pending' && order.received) return false;
      if (statusFilter === 'received' && !order.received) return false;

      return true;
    }).sort((a, b) => {
      // Pending first, then by expected date
      if (a.received !== b.received) return a.received ? 1 : -1;
      return a.expectedDate.getTime() - b.expectedDate.getTime();
    });
  }, [expectedDeliveries, searchQuery, statusFilter]);

  const handleAddOrder = () => {
    if (!newOrder.vendorId || !newOrder.flowerType) return;
    
    addExpectedDelivery({
      vendorId: newOrder.vendorId,
      flowerType: newOrder.flowerType,
      quantity: newOrder.quantity,
      orderDate: new Date(),
      expectedDate: new Date(newOrder.expectedDate),
      received: false,
    });
    
    setNewOrder({
      vendorId: '',
      flowerType: '',
      quantity: 25,
      expectedDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    });
    setAddDialogOpen(false);
  };

  const pendingCount = expectedDeliveries.filter(d => !d.received).length;
  const receivedCount = expectedDeliveries.filter(d => d.received).length;

  return (
    <div className="p-4 lg:p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              Vendor Orders
            </h1>
            <p className="text-muted-foreground">
              Track flower orders placed with your vendors
            </p>
          </div>
          
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Place Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Place Vendor Order</DialogTitle>
                <DialogDescription>
                  Order flowers from a vendor
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Vendor *</Label>
                  <Select
                    value={newOrder.vendorId}
                    onValueChange={(value) => setNewOrder(prev => ({ ...prev, vendorId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
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
                
                <div className="grid gap-2">
                  <Label>Flower Type *</Label>
                  <Select
                    value={newOrder.flowerType}
                    onValueChange={(value) => setNewOrder(prev => ({ ...prev, flowerType: value }))}
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
                    <Label>Quantity (stems)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newOrder.quantity}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Expected Delivery</Label>
                    <Input
                      type="date"
                      value={newOrder.expectedDate}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, expectedDate: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddOrder} disabled={!newOrder.vendorId || !newOrder.flowerType}>
                  Place Order
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{receivedCount}</p>
                <p className="text-sm text-muted-foreground">Received</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by flower or vendor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders List */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Vendor Orders ({filteredOrders.length})
              </CardTitle>
              <CardDescription>
                Track incoming flower deliveries from vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No vendor orders found</p>
                  <p className="text-sm">Place an order with a vendor to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order, index) => {
                    const vendor = mockVendors.find(v => v.id === order.vendorId);
                    const isOverdue = !order.received && order.expectedDate < new Date();

                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={cn(
                          'rounded-lg border p-4 transition-all',
                          order.received && 'bg-muted/30',
                          isOverdue && 'border-destructive/50 bg-destructive/5'
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            'h-10 w-10 rounded-full flex items-center justify-center',
                            order.received ? 'bg-emerald-100' : isOverdue ? 'bg-destructive/10' : 'bg-amber-100'
                          )}>
                            {order.received ? (
                              <Check className="h-5 w-5 text-emerald-600" />
                            ) : isOverdue ? (
                              <AlertCircle className="h-5 w-5 text-destructive" />
                            ) : (
                              <Truck className="h-5 w-5 text-amber-600" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{order.flowerType}</span>
                              <span className="text-muted-foreground">×{order.quantity} stems</span>
                              {order.received ? (
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                                  Received
                                </Badge>
                              ) : isOverdue ? (
                                <Badge variant="destructive">Overdue</Badge>
                              ) : (
                                <Badge variant="secondary">Pending</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <span>{vendor?.name || 'Unknown Vendor'}</span>
                              <span className="mx-2">•</span>
                              <span>
                                {order.received ? 'Received' : 'Expected'}: {format(order.expectedDate, 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>
                          
                          {!order.received && (
                            <Button
                              size="sm"
                              onClick={() => markDeliveryReceived(order.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Mark Received
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

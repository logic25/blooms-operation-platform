import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isTomorrow, isThisWeek, addDays } from 'date-fns';
import { Plus, Search, Filter, ShoppingBag, ChevronDown, Check, Trash2, Flower2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useAppMode } from '@/context/AppModeContext';
import { mockProducts, mockRecipes } from '@/data/mockData';
import type { DailyOrder } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

type DateFilter = 'all' | 'today' | 'tomorrow' | 'week';
type StatusFilter = 'all' | 'pending' | 'in_production' | 'fulfilled';

export default function CustomerOrders() {
  const { dailyOrders, addDailyOrder, updateDailyOrder, deleteDailyOrder } = useAppMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  // New order form state
  const [newOrder, setNewOrder] = useState({
    productId: '',
    quantity: 1,
    customerName: '',
    customerPhone: '',
    deliveryDate: format(new Date(), 'yyyy-MM-dd'),
    deliveryTime: '',
    notes: '',
  });

  const filteredOrders = useMemo(() => {
    return dailyOrders.filter(order => {
      // Search filter
      const product = mockProducts.find(p => p.id === order.productId);
      const searchMatch = 
        product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!searchMatch) return false;

      // Date filter
      if (dateFilter === 'today' && !isToday(order.deliveryDate)) return false;
      if (dateFilter === 'tomorrow' && !isTomorrow(order.deliveryDate)) return false;
      if (dateFilter === 'week' && !isThisWeek(order.deliveryDate)) return false;

      // Status filter
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;

      return true;
    }).sort((a, b) => a.deliveryDate.getTime() - b.deliveryDate.getTime());
  }, [dailyOrders, searchQuery, dateFilter, statusFilter]);

  const handleAddOrder = () => {
    if (!newOrder.productId) return;
    
    addDailyOrder({
      productId: newOrder.productId,
      quantity: newOrder.quantity,
      deliveryDate: new Date(newOrder.deliveryDate),
      deliveryTime: newOrder.deliveryTime || undefined,
      customerName: newOrder.customerName || undefined,
      customerPhone: newOrder.customerPhone || undefined,
      notes: newOrder.notes || undefined,
      status: 'pending',
    });
    
    setNewOrder({
      productId: '',
      quantity: 1,
      customerName: '',
      customerPhone: '',
      deliveryDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      deliveryTime: '',
      notes: '',
    });
    setAddDialogOpen(false);
  };

  const getStatusBadge = (status: DailyOrder['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'in_production':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">In Production</Badge>;
      case 'fulfilled':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Fulfilled</Badge>;
    }
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE, MMM d');
  };

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
              Customer Orders
            </h1>
            <p className="text-muted-foreground">
              Manage orders from your customers
            </p>
          </div>
          
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Customer Order</DialogTitle>
                <DialogDescription>
                  Create a new order for a customer
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Product *</Label>
                  <Select
                    value={newOrder.productId}
                    onValueChange={(value) => setNewOrder(prev => ({ ...prev, productId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProducts.filter(p => p.isActive).map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - ${product.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newOrder.quantity}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Delivery Date *</Label>
                    <Input
                      type="date"
                      value={newOrder.deliveryDate}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, deliveryDate: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Customer Name</Label>
                    <Input
                      value={newOrder.customerName}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Phone</Label>
                    <Input
                      value={newOrder.customerPhone}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, customerPhone: e.target.value }))}
                      placeholder="Optional"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label>Delivery Time</Label>
                  <Input
                    type="time"
                    value={newOrder.deliveryTime}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, deliveryTime: e.target.value }))}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={newOrder.notes}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any special instructions..."
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddOrder} disabled={!newOrder.productId}>
                  Add Order
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
                    <SelectTrigger className="w-[130px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="tomorrow">Tomorrow</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_production">In Production</SelectItem>
                      <SelectItem value="fulfilled">Fulfilled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders List */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Orders ({filteredOrders.length})
              </CardTitle>
              <CardDescription>
                Click an order to see flower requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No orders found</p>
                  <p className="text-sm">Add your first order to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order, index) => {
                    const product = mockProducts.find(p => p.id === order.productId);
                    const recipe = mockRecipes[order.productId] || [];
                    const isExpanded = expandedOrder === order.id;

                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Collapsible
                          open={isExpanded}
                          onOpenChange={() => setExpandedOrder(isExpanded ? null : order.id)}
                        >
                          <div className={cn(
                            'rounded-lg border transition-all',
                            isExpanded && 'ring-1 ring-primary/20'
                          )}>
                            <CollapsibleTrigger asChild>
                              <button className="w-full p-4 flex items-center gap-4 text-left hover:bg-muted/50 transition-colors">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium truncate">
                                      {product?.name || 'Unknown Product'}
                                    </span>
                                    <span className="text-muted-foreground">×{order.quantity}</span>
                                    {getStatusBadge(order.status)}
                                  </div>
                                  <div className="text-sm text-muted-foreground flex flex-wrap gap-x-3">
                                    <span>{getDateLabel(order.deliveryDate)}</span>
                                    {order.deliveryTime && <span>at {order.deliveryTime}</span>}
                                    {order.customerName && <span>• {order.customerName}</span>}
                                  </div>
                                </div>
                                <ChevronDown className={cn(
                                  'h-5 w-5 text-muted-foreground transition-transform',
                                  isExpanded && 'rotate-180'
                                )} />
                              </button>
                            </CollapsibleTrigger>
                            
                            <CollapsibleContent>
                              <div className="px-4 pb-4 border-t pt-3">
                                {/* Recipe needs */}
                                {recipe.length > 0 && (
                                  <div className="mb-4">
                                    <p className="text-sm font-medium mb-2 flex items-center gap-1">
                                      <Flower2 className="h-4 w-4 text-primary" />
                                      Flowers Needed (×{order.quantity})
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                      {recipe.map(item => (
                                        <div key={item.id} className="text-sm bg-muted/50 rounded px-2 py-1">
                                          <span className="font-medium">{item.flowerType}</span>
                                          <span className="text-muted-foreground ml-1">
                                            ×{item.quantity * order.quantity}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Notes */}
                                {order.notes && (
                                  <p className="text-sm text-muted-foreground mb-4">
                                    <span className="font-medium">Notes:</span> {order.notes}
                                  </p>
                                )}
                                
                                {/* Actions */}
                                <div className="flex gap-2">
                                  {order.status === 'pending' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateDailyOrder(order.id, { status: 'in_production' });
                                      }}
                                    >
                                      Start Production
                                    </Button>
                                  )}
                                  {order.status === 'in_production' && (
                                    <Button
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateDailyOrder(order.id, { status: 'fulfilled' });
                                      }}
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Mark Fulfilled
                                    </Button>
                                  )}
                                  {order.status === 'fulfilled' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateDailyOrder(order.id, { status: 'pending' });
                                      }}
                                    >
                                      Reopen
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteDailyOrder(order.id);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
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

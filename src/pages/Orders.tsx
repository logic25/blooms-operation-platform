import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, CheckCircle2, Package, Search, Filter, Calendar, User, Phone, FileText, Trash2, Edit2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format, isToday, isTomorrow, isThisWeek, differenceInDays } from 'date-fns';
import { useAppMode } from '@/context/AppModeContext';
import { QuickOrderDialog } from '@/components/dashboard/QuickOrderDialog';
import { mockProducts } from '@/data/mockData';

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

type FilterType = 'all' | 'today' | 'tomorrow' | 'week' | 'pending' | 'fulfilled';

export default function Orders() {
  const { dailyOrders, fulfillOrder, deleteDailyOrder } = useAppMode();
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  // Filter orders based on current filter and search
  const filteredOrders = dailyOrders
    .filter(order => {
      // Search filter
      const product = mockProducts.find(p => p.id === order.productId);
      const matchesSearch = 
        (product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      
      if (searchQuery && !matchesSearch) return false;

      // Status/date filter
      switch (filter) {
        case 'today':
          return isToday(order.deliveryDate);
        case 'tomorrow':
          return isTomorrow(order.deliveryDate);
        case 'week':
          return isThisWeek(order.deliveryDate);
        case 'pending':
          return order.status !== 'fulfilled';
        case 'fulfilled':
          return order.status === 'fulfilled';
        default:
          return true;
      }
    })
    .sort((a, b) => {
      // Unfulfilled first, then by date
      if (a.status === 'fulfilled' && b.status !== 'fulfilled') return 1;
      if (a.status !== 'fulfilled' && b.status === 'fulfilled') return -1;
      return a.deliveryDate.getTime() - b.deliveryDate.getTime();
    });

  // Calculate stats
  const stats = {
    pending: dailyOrders.filter(o => o.status === 'pending').length,
    inProduction: dailyOrders.filter(o => o.status === 'in_production').length,
    fulfilled: dailyOrders.filter(o => o.status === 'fulfilled').length,
    todayCount: dailyOrders.filter(o => isToday(o.deliveryDate) && o.status !== 'fulfilled').length,
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMM d');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'fulfilled':
        return <Badge className="bg-emerald-100 text-emerald-700">Fulfilled</Badge>;
      case 'in_production':
        return <Badge className="bg-amber-100 text-amber-700">In Production</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
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
              Orders
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage customer orders and track fulfillment
            </p>
          </div>
          <Button onClick={() => setOrderDialogOpen(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Order
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="border-border/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="font-display text-2xl font-bold">{stats.pending}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-peach-light">
                <Package className="h-6 w-6 text-peach" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Production</p>
                <p className="font-display text-2xl font-bold">{stats.inProduction}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fulfilled</p>
                <p className="font-display text-2xl font-bold">{stats.fulfilled}</p>
              </div>
            </CardContent>
          </Card>
          <Card className={cn(
            "border-border/50",
            stats.todayCount > 0 && "border-rose/30 bg-rose-light/30"
          )}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-light">
                <Calendar className="h-6 w-6 text-rose" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Today</p>
                <p className="font-display text-2xl font-bold">{stats.todayCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search customer or product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'today', 'tomorrow', 'week', 'pending', 'fulfilled'] as FilterType[]).map((f) => (
                  <Badge
                    key={f}
                    variant={filter === f ? 'default' : 'outline'}
                    className="cursor-pointer capitalize"
                    onClick={() => setFilter(f)}
                  >
                    {f === 'all' ? 'All Orders' : f}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-xl">
              {filter === 'all' ? 'All Orders' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Orders`}
            </CardTitle>
            <CardDescription>
              {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No orders found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {filter !== 'all' ? 'Try adjusting your filters' : 'Add your first order to get started'}
                </p>
                <Button onClick={() => setOrderDialogOpen(true)} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Order
                </Button>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                <AnimatePresence>
                  {filteredOrders.map((order) => {
                    const product = mockProducts.find(p => p.id === order.productId);
                    const daysUntil = differenceInDays(order.deliveryDate, new Date());
                    const isUrgent = daysUntil <= 0 && order.status !== 'fulfilled';
                    const isFulfilled = order.status === 'fulfilled';

                    return (
                      <motion.div
                        key={order.id}
                        variants={itemVariants}
                        layout
                        exit={{ opacity: 0, x: -20 }}
                        className={cn(
                          'flex items-start gap-4 rounded-xl border p-4 transition-all',
                          isUrgent && !isFulfilled && 'border-destructive/30 bg-destructive/5',
                          isFulfilled && 'border-emerald-200 bg-emerald-50/50 opacity-75'
                        )}
                      >
                        <Checkbox
                          checked={isFulfilled}
                          onCheckedChange={() => {
                            if (!isFulfilled) {
                              fulfillOrder(order.id);
                            }
                          }}
                          className="mt-1"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className={cn(
                                  "font-medium",
                                  isFulfilled && "line-through text-muted-foreground"
                                )}>
                                  {product?.name || 'Unknown Product'}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                  ×{order.quantity}
                                </Badge>
                                {getStatusBadge(order.status)}
                              </div>
                              
                              {/* Customer info */}
                              {(order.customerName || order.customerPhone) && (
                                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                                  {order.customerName && (
                                    <span className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      {order.customerName}
                                    </span>
                                  )}
                                  {order.customerPhone && (
                                    <span className="flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {order.customerPhone}
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              {/* Notes */}
                              {order.notes && (
                                <p className="mt-2 text-sm text-muted-foreground flex items-start gap-1">
                                  <FileText className="h-3 w-3 mt-0.5 shrink-0" />
                                  {order.notes}
                                </p>
                              )}
                            </div>
                            
                            <div className="text-right shrink-0">
                              <p className={cn(
                                "font-medium",
                                isUrgent && !isFulfilled && "text-destructive"
                              )}>
                                {getDateLabel(order.deliveryDate)}
                              </p>
                              {order.deliveryTime && (
                                <p className="text-xs text-muted-foreground">{order.deliveryTime}</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                            {!isFulfilled && (
                              <Button
                                size="sm"
                                onClick={() => fulfillOrder(order.id)}
                                className="bg-emerald-600 hover:bg-emerald-700"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Mark Fulfilled
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteDailyOrder(order.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Order Dialog */}
      <QuickOrderDialog
        open={orderDialogOpen}
        onOpenChange={setOrderDialogOpen}
      />
    </div>
  );
}

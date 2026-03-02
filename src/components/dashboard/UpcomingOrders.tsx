import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isTomorrow, addDays, isBefore, startOfDay } from 'date-fns';
import { Check, Package, User, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useAppMode } from '@/context/AppModeContext';
import { mockProducts } from '@/data/mockData';

type FilterType = 'all' | 'today' | 'tomorrow' | 'week';

export function UpcomingOrders() {
  const { dailyOrders, fulfillOrder } = useAppMode();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredOrders = useMemo(() => {
    const now = new Date();
    const weekEnd = addDays(now, 7);

    return dailyOrders
      .filter(order => {
        if (order.status === 'fulfilled') return false;
        
        switch (filter) {
          case 'today':
            return isToday(order.deliveryDate);
          case 'tomorrow':
            return isTomorrow(order.deliveryDate);
          case 'week':
            return isBefore(order.deliveryDate, weekEnd);
          default:
            return true;
        }
      })
      .sort((a, b) => a.deliveryDate.getTime() - b.deliveryDate.getTime());
  }, [dailyOrders, filter]);

  // Group orders by date
  const groupedOrders = useMemo(() => {
    const groups: Record<string, typeof filteredOrders> = {};
    
    filteredOrders.forEach(order => {
      const dateKey = format(order.deliveryDate, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(order);
    });

    return Object.entries(groups).map(([dateKey, orders]) => ({
      date: new Date(dateKey),
      orders,
    }));
  }, [filteredOrders]);

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMM d');
  };

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Tomorrow', value: 'tomorrow' },
    { label: 'This Week', value: 'week' },
  ];

  return (
    <Card className="border-border/50 h-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Upcoming Orders
            </CardTitle>
            <CardDescription>
              {filteredOrders.length} pending order{filteredOrders.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          
          {/* Filter Pills */}
          <div className="flex gap-1 overflow-x-auto">
            {filters.map(f => (
              <Button
                key={f.value}
                variant={filter === f.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f.value)}
                className={cn(
                  'whitespace-nowrap',
                  filter === f.value && 'bg-primary hover:bg-primary/90'
                )}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {groupedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Check className="h-10 w-10 text-sage" />
            <p className="mt-3 font-medium text-foreground">All caught up!</p>
            <p className="text-sm text-muted-foreground">No pending orders for this filter</p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {groupedOrders.map(({ date, orders }) => (
                <motion.div
                  key={date.toISOString()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <h3 className={cn(
                      'font-medium',
                      isToday(date) && 'text-rose'
                    )}>
                      {getDateLabel(date)}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {orders.length}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {orders.map(order => {
                      const product = mockProducts.find(p => p.id === order.productId);
                      
                      return (
                        <motion.div
                          key={order.id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className={cn(
                            'flex items-center gap-3 rounded-lg border p-3 transition-all',
                            'hover:bg-muted/50 min-h-[64px]'
                          )}
                        >
                          <Checkbox
                            id={`order-${order.id}`}
                            checked={order.status === 'fulfilled'}
                            onCheckedChange={() => fulfillOrder(order.id)}
                            className="h-6 w-6 rounded-full"
                          />
                          
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                            <img
                              src={product?.photoUrl || '/placeholder.svg'}
                              alt={product?.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">
                                {order.quantity}x {product?.name}
                              </p>
                            </div>
                            {order.customerName && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                                <User className="h-3 w-3" />
                                {order.customerName}
                              </p>
                            )}
                            {order.notes && (
                              <p className="text-xs text-muted-foreground truncate">
                                {order.notes}
                              </p>
                            )}
                          </div>
                          
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

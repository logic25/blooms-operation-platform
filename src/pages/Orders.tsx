import { motion } from 'framer-motion';
import { ShoppingCart, Clock, CheckCircle2, AlertTriangle, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import { mockDeadlines, mockVendors } from '@/data/mockData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Mock order data
const mockOrders = [
  {
    id: 'o1',
    vendorId: 'v2',
    flowers: ['Red Roses', 'Baby\'s Breath'],
    status: 'pending',
    orderByDate: new Date('2025-02-05'),
    expectedDelivery: new Date('2025-02-10'),
  },
  {
    id: 'o2',
    vendorId: 'v1',
    flowers: ['Pink Roses', 'Garden Roses', 'Spray Roses'],
    status: 'ordered',
    orderByDate: new Date('2025-02-07'),
    expectedDelivery: new Date('2025-02-10'),
  },
  {
    id: 'o3',
    vendorId: 'v3',
    flowers: ['Hydrangea', 'Ranunculus'],
    status: 'pending',
    orderByDate: new Date('2025-02-09'),
    expectedDelivery: new Date('2025-02-11'),
  },
  {
    id: 'o4',
    vendorId: 'v4',
    flowers: ['Eucalyptus', 'Dusty Miller', 'Leather Leaf Fern'],
    status: 'pending',
    orderByDate: new Date('2025-02-08'),
    expectedDelivery: new Date('2025-02-12'),
  },
];

export default function Orders() {
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
              Track your vendor orders and delivery schedule
            </p>
          </div>
          <Badge variant="secondary" className="w-fit bg-rose-light text-rose">
            Valentine's Day 2025
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-border/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="font-display text-2xl font-bold">3</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ordered</p>
                <p className="font-display text-2xl font-bold">1</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-light">
                <Package className="h-6 w-6 text-sage" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="font-display text-2xl font-bold">0</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-xl">Order Timeline</CardTitle>
            <CardDescription>Key dates and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

              <div className="space-y-6">
                {mockDeadlines.map((deadline, index) => {
                  const daysAway = differenceInDays(deadline.date, new Date());
                  const isPast = daysAway < 0;
                  const isToday = daysAway === 0;
                  const isSoon = daysAway > 0 && daysAway <= 3;

                  return (
                    <motion.div
                      key={deadline.id}
                      variants={itemVariants}
                      className="relative flex gap-4 pl-12"
                    >
                      {/* Timeline dot */}
                      <div className={cn(
                        'absolute left-4 h-4 w-4 rounded-full border-2 border-background',
                        deadline.status === 'urgent' && 'bg-destructive',
                        deadline.status === 'warning' && 'bg-amber-500',
                        deadline.status === 'success' && 'bg-emerald-500',
                        deadline.status === 'neutral' && 'bg-muted-foreground'
                      )} />

                      <div className={cn(
                        'flex-1 rounded-xl border p-4 transition-all',
                        deadline.status === 'urgent' && 'border-destructive/30 bg-destructive/5',
                        deadline.status === 'warning' && 'border-amber-500/30 bg-amber-50',
                        deadline.status === 'success' && 'border-emerald-500/30 bg-emerald-50',
                        deadline.status === 'neutral' && 'border-border'
                      )}>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{deadline.title}</h3>
                              {deadline.status === 'urgent' && (
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                              )}
                            </div>
                            {deadline.vendorName && (
                              <p className="mt-0.5 text-sm text-muted-foreground">
                                {deadline.vendorName}
                              </p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-medium">{format(deadline.date, 'EEE, MMM d')}</p>
                            <p className={cn(
                              'text-xs',
                              isSoon ? 'font-medium text-amber-600' : 'text-muted-foreground'
                            )}>
                              {isToday ? 'Today' : isPast ? 'Past' : `${daysAway} days`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-xl">Vendor Orders</CardTitle>
            <CardDescription>Track and manage your orders</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {mockOrders.map((order) => {
                const vendor = mockVendors.find(v => v.id === order.vendorId);
                const daysUntilOrder = differenceInDays(order.orderByDate, new Date());
                const isUrgent = daysUntilOrder <= 2 && order.status === 'pending';

                return (
                  <motion.div
                    key={order.id}
                    variants={itemVariants}
                    className={cn(
                      'flex items-start gap-4 rounded-xl border p-4',
                      isUrgent && 'border-destructive/30 bg-destructive/5',
                      order.status === 'ordered' && 'border-emerald-500/30 bg-emerald-50'
                    )}
                  >
                    <Checkbox
                      checked={order.status === 'ordered'}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium">{vendor?.name}</h3>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {order.flowers.map(flower => (
                              <Badge key={flower} variant="outline" className="text-xs">
                                {flower}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Badge
                          variant={order.status === 'ordered' ? 'default' : 'secondary'}
                          className={cn(
                            order.status === 'ordered' && 'bg-emerald-500',
                            order.status === 'pending' && isUrgent && 'bg-destructive'
                          )}
                        >
                          {order.status === 'ordered' ? 'Ordered' : 'Pending'}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Order by: {format(order.orderByDate, 'MMM d')}</span>
                        <span>•</span>
                        <span>Delivery: {format(order.expectedDelivery, 'MMM d')}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

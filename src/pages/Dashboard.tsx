import { motion } from 'framer-motion';
import { format, differenceInDays, isBefore } from 'date-fns';
import {
  Package,
  Users,
  TrendingUp,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flower2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { mockProducts, mockVendors, mockDeadlines, mockProductionPlan } from '@/data/mockData';
import { Link } from 'react-router-dom';
import type { StatusType } from '@/types';

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

const statusConfig: Record<StatusType, { color: string; icon: React.ElementType }> = {
  urgent: { color: 'status-urgent', icon: AlertTriangle },
  warning: { color: 'status-warning', icon: Clock },
  success: { color: 'status-success', icon: CheckCircle2 },
  neutral: { color: 'status-neutral', icon: Calendar },
};

export default function Dashboard() {
  const activePlan = mockProductionPlan;
  const daysUntilEvent = differenceInDays(activePlan.eventDate, new Date());
  const totalPlannedUnits = activePlan.items.reduce((sum, item) => sum + item.plannedQuantity, 0);
  const ordersPlaced = 2; // Mock data
  const totalOrders = 4;

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
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              Welcome back! 🌸
            </h1>
            <p className="mt-1 text-muted-foreground">
              Here's what's happening with your floral operations.
            </p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link to="/planner">
              Open Planner <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Event Countdown Card */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-none bg-gradient-to-br from-rose-light to-peach-light">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose/20">
                    <Flower2 className="h-7 w-7 text-rose" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground">
                      {activePlan.eventName}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {format(activePlan.eventDate, 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-5xl font-bold text-rose">
                    {daysUntilEvent}
                  </span>
                  <span className="text-lg text-muted-foreground">days to go</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Order Progress</span>
                  <span className="font-medium">{ordersPlaced} of {totalOrders} orders placed</span>
                </div>
                <Progress value={(ordersPlaced / totalOrders) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="card-interactive border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-light">
                  <Package className="h-5 w-5 text-sage" />
                </div>
                <Badge variant="secondary" className="bg-sage-light text-sage">
                  Active
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Products</p>
                <p className="font-display text-2xl font-bold">
                  {mockProducts.filter(p => p.isActive).length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-interactive border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-peach-light">
                  <Users className="h-5 w-5 text-peach" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Vendors</p>
                <p className="font-display text-2xl font-bold">{mockVendors.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-interactive border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-light">
                  <TrendingUp className="h-5 w-5 text-rose" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Planned Units</p>
                <p className="font-display text-2xl font-bold">{totalPlannedUnits}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-interactive border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <Calendar className="h-5 w-5 text-secondary-foreground" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Upcoming Deadlines</p>
                <p className="font-display text-2xl font-bold">{mockDeadlines.length}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Upcoming Deadlines */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <Card className="h-full border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-display text-xl">Upcoming Deadlines</CardTitle>
                    <CardDescription>Key dates for {activePlan.eventName}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/orders">View all</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockDeadlines.map((deadline, index) => {
                    const config = statusConfig[deadline.status];
                    const StatusIcon = config.icon;
                    const daysAway = differenceInDays(deadline.date, new Date());
                    
                    return (
                      <motion.div
                        key={deadline.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          'flex items-center gap-4 rounded-xl border p-4 transition-all hover:bg-muted/50',
                          config.color
                        )}
                      >
                        <div className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                          deadline.status === 'urgent' && 'bg-destructive/10',
                          deadline.status === 'warning' && 'bg-amber-100',
                          deadline.status === 'success' && 'bg-emerald-100',
                          deadline.status === 'neutral' && 'bg-muted'
                        )}>
                          <StatusIcon className={cn(
                            'h-5 w-5',
                            deadline.status === 'urgent' && 'text-destructive',
                            deadline.status === 'warning' && 'text-amber-600',
                            deadline.status === 'success' && 'text-emerald-600',
                            deadline.status === 'neutral' && 'text-muted-foreground'
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{deadline.title}</p>
                          {deadline.vendorName && (
                            <p className="text-sm text-muted-foreground truncate">{deadline.vendorName}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-medium">
                            {format(deadline.date, 'MMM d')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {daysAway === 0 ? 'Today' : daysAway === 1 ? 'Tomorrow' : `${daysAway} days`}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="h-full border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-xl">Quick Actions</CardTitle>
                <CardDescription>Get things done faster</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Button variant="outline" className="h-auto justify-start gap-3 p-4 text-left" asChild>
                  <Link to="/planner">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sage-light">
                      <TrendingUp className="h-5 w-5 text-sage" />
                    </div>
                    <div>
                      <p className="font-medium">Calculate Flower Needs</p>
                      <p className="text-sm text-muted-foreground">Get aggregated totals</p>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto justify-start gap-3 p-4 text-left" asChild>
                  <Link to="/products">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-light">
                      <Package className="h-5 w-5 text-rose" />
                    </div>
                    <div>
                      <p className="font-medium">Add New Product</p>
                      <p className="text-sm text-muted-foreground">Create arrangement</p>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto justify-start gap-3 p-4 text-left" asChild>
                  <Link to="/vendors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-peach-light">
                      <Users className="h-5 w-5 text-peach" />
                    </div>
                    <div>
                      <p className="font-medium">Manage Vendors</p>
                      <p className="text-sm text-muted-foreground">View & update suppliers</p>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto justify-start gap-3 p-4 text-left" asChild>
                  <Link to="/history">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <Calendar className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">View Past Events</p>
                      <p className="text-sm text-muted-foreground">Historical sales data</p>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

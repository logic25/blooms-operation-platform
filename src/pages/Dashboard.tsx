import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/dashboard/ModeToggle';
import { EventBanner } from '@/components/dashboard/EventBanner';
import { UpcomingOrders } from '@/components/dashboard/UpcomingOrders';
import { AvailableInventory } from '@/components/dashboard/AvailableInventory';
import { ShoppingList } from '@/components/dashboard/ShoppingList';
import { QuickOrderDialog } from '@/components/dashboard/QuickOrderDialog';
import { useAppMode } from '@/context/AppModeContext';
import { EventModeDashboard } from '@/components/dashboard/EventModeDashboard';

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

export default function Dashboard() {
  const { mode } = useAppMode();
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);

  // Format today's date
  const todayFormatted = format(new Date(), 'EEEE, MMMM d');

  // Show Event Mode Dashboard if in event mode
  if (mode === 'event') {
    return <EventModeDashboard />;
  }

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
            <p className="text-sm text-muted-foreground">Today</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              {todayFormatted}
            </h1>
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ModeToggle />
            <Button 
              onClick={() => setOrderDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 h-11 px-6"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Order
            </Button>
          </div>
        </motion.div>

        {/* Event Banner (shows when holiday is approaching) */}
        <motion.div variants={itemVariants}>
          <EventBanner />
        </motion.div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Row 1: Orders + Inventory */}
          <motion.div variants={itemVariants} className="lg:col-span-7">
            <UpcomingOrders />
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-5">
            <AvailableInventory />
          </motion.div>

          {/* Row 2: Shopping List - full width */}
          <motion.div variants={itemVariants} className="lg:col-span-12">
            <ShoppingList />
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Order Dialog */}
      <QuickOrderDialog 
        open={orderDialogOpen} 
        onOpenChange={setOrderDialogOpen} 
      />
    </div>
  );
}

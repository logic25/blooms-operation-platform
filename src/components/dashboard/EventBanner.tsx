import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppMode } from '@/context/AppModeContext';
import { useState } from 'react';

export function EventBanner() {
  const { upcomingEvent, daysToUpcomingEvent, setMode, setActiveEventId, mode } = useAppMode();
  const [dismissed, setDismissed] = useState(false);

  // Don't show if no upcoming event, already in event mode, or dismissed
  if (!upcomingEvent || !daysToUpcomingEvent || mode === 'event' || dismissed) {
    return null;
  }

  const handleStartPlanning = () => {
    setActiveEventId(upcomingEvent.id);
    setMode('event');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl border border-rose/30 bg-gradient-to-r from-rose-light via-peach-light to-rose-light p-4"
    >
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-background/50 hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose/20">
            <Sparkles className="h-5 w-5 text-rose" />
          </div>
          <div>
            <p className="font-display font-semibold text-foreground">
              {upcomingEvent.name} in {daysToUpcomingEvent} days
            </p>
            <p className="text-sm text-muted-foreground">
              Start planning to stay ahead of orders
            </p>
          </div>
        </div>
        <Button 
          onClick={handleStartPlanning}
          className="bg-rose hover:bg-rose/90 text-white"
        >
          Start Planning
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

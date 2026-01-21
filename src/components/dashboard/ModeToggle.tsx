import { Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppMode } from '@/context/AppModeContext';
import type { AppMode } from '@/types';

export function ModeToggle() {
  const { mode, setMode } = useAppMode();

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
  };

  return (
    <div className="inline-flex rounded-lg border border-border bg-muted/50 p-1">
      <button
        onClick={() => handleModeChange('daily')}
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all',
          mode === 'daily'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Clock className="h-4 w-4" />
        Daily Mode
      </button>
      <button
        onClick={() => handleModeChange('event')}
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all',
          mode === 'event'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Calendar className="h-4 w-4" />
        Event Mode
      </button>
    </div>
  );
}

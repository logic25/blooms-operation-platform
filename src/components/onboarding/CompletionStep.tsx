import { motion } from 'framer-motion';
import { Check, ShoppingCart, Package, ClipboardList, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/context/OnboardingContext';

interface CompletionStepProps {
  onComplete: () => void;
}

export function CompletionStep({ onComplete }: CompletionStepProps) {
  const { flowers, vendors, products, completeOnboarding } = useOnboarding();

  const activeFlowers = flowers.filter(f => f.isActive).length;

  const handleComplete = () => {
    completeOnboarding();
    onComplete();
  };

  const features = [
    { icon: ShoppingCart, text: 'Add orders as they come in', color: 'text-primary' },
    { icon: Package, text: 'See your shopping list', color: 'text-rose' },
    { icon: ClipboardList, text: 'Track inventory', color: 'text-accent-foreground' },
  ];

  return (
    <div className="text-center space-y-8">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-primary"
        >
          <Check className="h-8 w-8 text-primary-foreground" />
        </motion.div>
      </motion.div>

      {/* Title */}
      <div className="space-y-2">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-3xl font-semibold text-foreground"
        >
          You're all set!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground"
        >
          Your shop is ready to go
        </motion.p>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center gap-8"
      >
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">{activeFlowers}</p>
          <p className="text-sm text-muted-foreground">Flowers</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">{vendors.length}</p>
          <p className="text-sm text-muted-foreground">Vendors</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">{products.length}</p>
          <p className="text-sm text-muted-foreground">Products</p>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-muted/50 rounded-xl p-6 space-y-4"
      >
        <p className="text-sm text-muted-foreground font-medium">Here's what you can do now:</p>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-background ${feature.color}`}>
                <feature.icon className="h-4 w-4" />
              </div>
              <span className="font-medium">{feature.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={handleComplete}
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Go to Dashboard
        </Button>
      </motion.div>
    </div>
  );
}

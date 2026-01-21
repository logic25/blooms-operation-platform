import { motion, AnimatePresence } from 'framer-motion';
import { Flower2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useOnboarding } from '@/context/OnboardingContext';
import { FlowerLibraryStep } from './FlowerLibraryStep';
import { VendorSetupStep } from './VendorSetupStep';
import { FirstProductStep } from './FirstProductStep';
import { CompletionStep } from './CompletionStep';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { step } = useOnboarding();

  const steps = [
    { number: 1, title: 'Flowers', component: FlowerLibraryStep },
    { number: 2, title: 'Vendors', component: VendorSetupStep },
    { number: 3, title: 'Products', component: FirstProductStep },
    { number: 4, title: 'Done', component: CompletionStep },
  ];

  return (
    <div className="min-h-screen bg-background pattern-floral flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b bg-background/95 backdrop-blur">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Flower2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold">Blooms</span>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all ${
                    step === s.number
                      ? 'bg-primary text-primary-foreground'
                      : step > s.number
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s.number}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 ${step > s.number ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {step === 1 && <FlowerLibraryStep />}
                  {step === 2 && <VendorSetupStep />}
                  {step === 3 && <FirstProductStep />}
                  {step === 4 && <CompletionStep onComplete={onComplete} />}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

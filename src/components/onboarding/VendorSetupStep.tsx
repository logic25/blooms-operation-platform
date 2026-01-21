import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Phone, Building2, Truck, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useOnboarding } from '@/context/OnboardingContext';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface VendorFormData {
  name: string;
  phone: string;
  leadTime: number;
  deliveryDays: string[];
  notes: string;
}

const emptyForm: VendorFormData = {
  name: '',
  phone: '',
  leadTime: 2,
  deliveryDays: [],
  notes: '',
};

export function VendorSetupStep() {
  const { vendors, addVendor, removeVendor, nextStep, prevStep } = useOnboarding();
  const [form, setForm] = useState<VendorFormData>(emptyForm);
  const [isAdding, setIsAdding] = useState(vendors.length === 0);

  const toggleDay = (day: string) => {
    setForm(prev => ({
      ...prev,
      deliveryDays: prev.deliveryDays.includes(day)
        ? prev.deliveryDays.filter(d => d !== day)
        : [...prev.deliveryDays, day],
    }));
  };

  const handleAddVendor = () => {
    if (form.name.trim()) {
      addVendor({
        name: form.name.trim(),
        contactInfo: {
          phone: form.phone || undefined,
        },
        leadTimeDays: form.leadTime,
        orderCutoff: '5pm',
        deliveryDays: form.deliveryDays,
        reliabilityRating: 3,
        notes: form.notes || undefined,
      });
      setForm(emptyForm);
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          Who are your suppliers?
        </h2>
        <p className="text-muted-foreground">
          Add your flower vendors so we can help with ordering. You can skip this for now.
        </p>
      </div>

      {/* Vendor List */}
      <AnimatePresence mode="popLayout">
        {vendors.map((vendor, index) => (
          <motion.div
            key={vendor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      <span className="font-medium">{vendor.name}</span>
                    </div>
                    {vendor.contactInfo.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{vendor.contactInfo.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {vendor.leadTimeDays} day lead time
                      </span>
                      {vendor.deliveryDays.length > 0 && (
                        <div className="flex gap-1">
                          {vendor.deliveryDays.map(day => (
                            <Badge key={day} variant="secondary" className="text-xs px-1.5">
                              {day}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVendor(vendor.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add Vendor Form */}
      <AnimatePresence>
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label>Vendor Name *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Rose Valley Farms"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Lead Time (days)</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setForm(prev => ({ ...prev, leadTime: Math.max(1, prev.leadTime - 1) }))}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-medium text-lg">{form.leadTime}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setForm(prev => ({ ...prev, leadTime: prev.leadTime + 1 }))}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Delivery Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map(day => (
                      <label
                        key={day}
                        className={`flex items-center justify-center px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                          form.deliveryDays.includes(day)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border hover:border-primary/50'
                        }`}
                      >
                        <Checkbox
                          checked={form.deliveryDays.includes(day)}
                          onCheckedChange={() => toggleDay(day)}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Input
                    value={form.notes}
                    onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="e.g., Best for roses, cash only..."
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setForm(emptyForm);
                      setIsAdding(false);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddVendor}
                    disabled={!form.name.trim()}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Vendor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setIsAdding(true)}
            className="w-full border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Vendor
          </Button>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="pt-4 border-t flex gap-3">
        <Button
          variant="outline"
          onClick={prevStep}
          className="flex-1"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Button
          variant="ghost"
          onClick={nextStep}
          className="text-muted-foreground"
        >
          Skip
        </Button>
        <Button
          onClick={nextStep}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

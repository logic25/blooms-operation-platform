import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Flower2, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Vendor, VendorInventory } from '@/types';
import { flowerTypes } from '@/data/mockData';

type QualityRating = 1 | 2 | 3 | 4 | 5;

interface VendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: Vendor | null;
  inventory: VendorInventory[];
  onSave: (vendor: Omit<Vendor, 'id'>, inventory: Omit<VendorInventory, 'id' | 'vendorId'>[]) => void;
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const SPECIALTIES = [
  'Roses',
  'Premium Flowers',
  'Mixed Flowers',
  'Greenery',
  'Same-day',
  'Exotics',
  'Local Seasonal',
  'Filler Flowers',
];

function RatingStars({ rating, onRatingChange }: { rating: number; onRatingChange: (r: QualityRating) => void }) {
  return (
    <div className="flex gap-0.5">
      {([1, 2, 3, 4, 5] as const).map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className="p-0.5 hover:scale-110 transition-transform"
        >
          <Star
            className={cn(
              'h-5 w-5',
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted hover:text-amber-200'
            )}
          />
        </button>
      ))}
    </div>
  );
}

interface InventoryItem {
  flowerType: string;
  regularPrice: number;
  peakPrice: number;
  qualityRating: QualityRating;
  notes?: string;
}

export function VendorDialog({ open, onOpenChange, vendor, inventory, onSave }: VendorDialogProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [leadTimeDays, setLeadTimeDays] = useState('3');
  const [orderCutoff, setOrderCutoff] = useState('');
  const [deliveryDays, setDeliveryDays] = useState<string[]>([]);
  const [paymentTerms, setPaymentTerms] = useState('');
  const [reliabilityRating, setReliabilityRating] = useState<QualityRating>(4);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [newFlower, setNewFlower] = useState('');
  const [newRegularPrice, setNewRegularPrice] = useState('');
  const [newPeakPrice, setNewPeakPrice] = useState('');

  useEffect(() => {
    if (vendor) {
      setName(vendor.name);
      setPhone(vendor.contactInfo.phone || '');
      setEmail(vendor.contactInfo.email || '');
      setWebsite(vendor.contactInfo.website || '');
      setLeadTimeDays(vendor.leadTimeDays.toString());
      setOrderCutoff(vendor.orderCutoff || '');
      setDeliveryDays(vendor.deliveryDays || []);
      setPaymentTerms(vendor.paymentTerms || '');
      setReliabilityRating(vendor.reliabilityRating);
      setSpecialties(vendor.specialties || []);
      setNotes(vendor.notes || '');
      setInventoryItems(inventory.map(i => ({
        flowerType: i.flowerType,
        regularPrice: i.regularPrice,
        peakPrice: i.peakPrice,
        qualityRating: i.qualityRating,
        notes: i.notes,
      })));
    } else {
      setName('');
      setPhone('');
      setEmail('');
      setWebsite('');
      setLeadTimeDays('3');
      setOrderCutoff('');
      setDeliveryDays([]);
      setPaymentTerms('');
      setReliabilityRating(4);
      setSpecialties([]);
      setNotes('');
      setInventoryItems([]);
    }
  }, [vendor, inventory, open]);

  const toggleDeliveryDay = (day: string) => {
    setDeliveryDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleSpecialty = (specialty: string) => {
    setSpecialties(prev => 
      prev.includes(specialty) ? prev.filter(s => s !== specialty) : [...prev, specialty]
    );
  };

  const handleAddFlower = () => {
    if (!newFlower || !newRegularPrice || !newPeakPrice) return;
    setInventoryItems(prev => [...prev, {
      flowerType: newFlower,
      regularPrice: parseFloat(newRegularPrice),
      peakPrice: parseFloat(newPeakPrice),
      qualityRating: 4 as QualityRating,
    }]);
    setNewFlower('');
    setNewRegularPrice('');
    setNewPeakPrice('');
  };

  const handleRemoveFlower = (flowerType: string) => {
    setInventoryItems(prev => prev.filter(i => i.flowerType !== flowerType));
  };

  const handleUpdateFlowerQuality = (flowerType: string, quality: QualityRating) => {
    setInventoryItems(prev => prev.map(i => 
      i.flowerType === flowerType ? { ...i, qualityRating: quality } : i
    ));
  };

  const handleSave = () => {
    const vendorData: Omit<Vendor, 'id'> = {
      name,
      contactInfo: { phone, email, website },
      leadTimeDays: parseInt(leadTimeDays),
      orderCutoff,
      deliveryDays,
      paymentTerms,
      reliabilityRating,
      specialties,
      notes,
    };
    onSave(vendorData, inventoryItems);
  };

  const usedFlowers = inventoryItems.map(i => i.flowerType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {vendor ? 'Edit Vendor' : 'Add New Vendor'}
          </DialogTitle>
          <DialogDescription>
            {vendor ? 'Update vendor details and inventory pricing' : 'Add a new wholesale vendor with their flower inventory'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="name">Vendor Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., NH Blossom Wholesale"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 555-0123"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="orders@vendor.com"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="vendor.com"
                  />
                </div>
                <div>
                  <Label htmlFor="payment">Payment Terms</Label>
                  <Input
                    id="payment"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    placeholder="Net 30"
                  />
                </div>
              </div>
            </div>

            {/* Ordering Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Ordering Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="leadTime">Lead Time (days)</Label>
                  <Input
                    id="leadTime"
                    type="number"
                    min="1"
                    value={leadTimeDays}
                    onChange={(e) => setLeadTimeDays(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="cutoff">Order Cutoff</Label>
                  <Input
                    id="cutoff"
                    value={orderCutoff}
                    onChange={(e) => setOrderCutoff(e.target.value)}
                    placeholder="e.g., Tue 5pm"
                  />
                </div>
              </div>

              <div>
                <Label>Delivery Days</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {DAYS_OF_WEEK.map(day => (
                    <Badge
                      key={day}
                      variant={deliveryDays.includes(day) ? 'default' : 'outline'}
                      className={cn(
                        'cursor-pointer transition-all',
                        deliveryDays.includes(day) ? 'bg-primary' : 'hover:bg-muted'
                      )}
                      onClick={() => toggleDeliveryDay(day)}
                    >
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Specialties</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {SPECIALTIES.map(specialty => (
                    <Badge
                      key={specialty}
                      variant={specialties.includes(specialty) ? 'default' : 'outline'}
                      className={cn(
                        'cursor-pointer transition-all',
                        specialties.includes(specialty) ? 'bg-sage text-primary-foreground' : 'hover:bg-muted'
                      )}
                      onClick={() => toggleSpecialty(specialty)}
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Rating & Notes */}
            <div className="space-y-4">
              <div>
                <Label>Reliability Rating</Label>
                <div className="mt-2">
                  <RatingStars rating={reliabilityRating} onRatingChange={setReliabilityRating} />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any important notes about this vendor..."
                  rows={2}
                />
              </div>
            </div>

            {/* Flower Inventory */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Flower Inventory & Pricing</h3>
              
              {/* Add new flower */}
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <Label className="text-sm">Add Flower to Inventory</Label>
                <div className="grid grid-cols-4 gap-2">
                  <Select value={newFlower} onValueChange={setNewFlower}>
                    <SelectTrigger className="col-span-2 bg-background">
                      <SelectValue placeholder="Select flower" />
                    </SelectTrigger>
                    <SelectContent>
                      {flowerTypes.filter(f => !usedFlowers.includes(f)).map(flower => (
                        <SelectItem key={flower} value={flower}>{flower}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newRegularPrice}
                    onChange={(e) => setNewRegularPrice(e.target.value)}
                    placeholder="Regular $"
                    className="bg-background"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newPeakPrice}
                    onChange={(e) => setNewPeakPrice(e.target.value)}
                    placeholder="Peak $"
                    className="bg-background"
                  />
                </div>
                <Button 
                  onClick={handleAddFlower}
                  disabled={!newFlower || !newRegularPrice || !newPeakPrice}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Flower
                </Button>
              </div>

              {/* Inventory list */}
              {inventoryItems.length > 0 && (
                <div className="space-y-2">
                  <AnimatePresence>
                    {inventoryItems.map((item) => (
                      <motion.div
                        key={item.flowerType}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center gap-3 rounded-lg border bg-card p-3"
                      >
                        <Flower2 className="h-4 w-4 text-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.flowerType}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>${item.regularPrice.toFixed(2)} regular</span>
                            <span>•</span>
                            <span className="text-rose">${item.peakPrice.toFixed(2)} peak</span>
                          </div>
                        </div>
                        <RatingStars 
                          rating={item.qualityRating} 
                          onRatingChange={(r) => handleUpdateFlowerQuality(item.flowerType, r)} 
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveFlower(item.flowerType)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name} className="bg-primary hover:bg-primary/90">
            {vendor ? 'Save Changes' : 'Add Vendor'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

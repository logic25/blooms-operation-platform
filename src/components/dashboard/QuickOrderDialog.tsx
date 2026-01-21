import { useState } from 'react';
import { format, addDays } from 'date-fns';
import { CalendarIcon, Plus, Minus } from 'lucide-react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { mockProducts } from '@/data/mockData';
import { useAppMode } from '@/context/AppModeContext';
import { toast } from 'sonner';

interface QuickOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickOrderDialog({ open, onOpenChange }: QuickOrderDialogProps) {
  const { addDailyOrder } = useAppMode();
  const [productId, setProductId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState<Date>(addDays(new Date(), 1));
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');

  const activeProducts = mockProducts.filter(p => p.isActive);

  const handleSubmit = () => {
    if (!productId) {
      toast.error('Please select a product');
      return;
    }

    addDailyOrder({
      productId,
      quantity,
      deliveryDate,
      customerName: customerName || undefined,
      notes: notes || undefined,
      status: 'pending',
    });

    const product = activeProducts.find(p => p.id === productId);
    toast.success(`Order added: ${quantity}x ${product?.name}`);

    // Reset form
    setProductId('');
    setQuantity(1);
    setDeliveryDate(addDays(new Date(), 1));
    setCustomerName('');
    setNotes('');
    onOpenChange(false);
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add Order</DialogTitle>
          <DialogDescription>
            Quick order entry for daily sales
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Product Selection */}
          <div className="space-y-2">
            <Label htmlFor="product">Product *</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger id="product" className="h-12">
                <SelectValue placeholder="Select arrangement" />
              </SelectTrigger>
              <SelectContent>
                {activeProducts.map(product => (
                  <SelectItem key={product.id} value={product.id}>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.photoUrl || '/placeholder.svg'}
                        alt={product.name}
                        className="h-8 w-8 rounded object-cover"
                      />
                      <span>{product.name}</span>
                      <span className="text-muted-foreground">${product.price}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity with +/- buttons */}
          <div className="space-y-2">
            <Label>Quantity</Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-12 w-12 shrink-0"
                onClick={decrementQuantity}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="h-12 text-center text-lg font-medium"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-12 w-12 shrink-0"
                onClick={incrementQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Delivery Date */}
          <div className="space-y-2">
            <Label>Delivery Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'h-12 w-full justify-start text-left font-normal',
                    !deliveryDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deliveryDate ? format(deliveryDate, 'EEEE, MMM d') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deliveryDate}
                  onSelect={(date) => date && setDeliveryDate(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Customer Name (optional) */}
          <div className="space-y-2">
            <Label htmlFor="customer">Customer Name (optional)</Label>
            <Input
              id="customer"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g., Sarah Johnson"
              className="h-12"
            />
          </div>

          {/* Notes (optional) */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special instructions..."
              className="resize-none"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
            Add Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

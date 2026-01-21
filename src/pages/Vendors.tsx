import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Phone, Mail, Globe, Star, Clock, Truck, MoreHorizontal, Edit2, Trash2, Flower2, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { mockVendors as initialVendors, mockVendorInventory as initialInventory, mockFlowerHistory } from '@/data/mockData';
import { VendorDialog } from '@/components/vendors/VendorDialog';
import type { Vendor, VendorInventory } from '@/types';
import { toast } from 'sonner';

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

const RatingStars = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) => {
  const sizeClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClass,
            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted'
          )}
        />
      ))}
    </div>
  );
};

function FlowerInventoryItem({ item }: { item: VendorInventory }) {
  const history = mockFlowerHistory.filter(h => h.flowerType === item.flowerType && h.vendorId === item.vendorId);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Flower2 className="h-4 w-4 text-primary shrink-0" />
          <span className="font-medium truncate">{item.flowerType}</span>
        </div>
        {item.notes && (
          <p className="mt-0.5 text-xs text-muted-foreground truncate pl-6">{item.notes}</p>
        )}
        {history.length > 0 && (
          <p className="mt-1 text-xs text-sage pl-6">
            Last used: {history[0].event} — "{history[0].notes}"
          </p>
        )}
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right">
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-medium">${item.regularPrice.toFixed(2)}</span>
          </div>
          <span className="text-xs text-rose">Peak: ${item.peakPrice.toFixed(2)}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <RatingStars rating={item.qualityRating} />
          <span className="text-xs text-muted-foreground">Quality</span>
        </div>
      </div>
    </motion.div>
  );
}

interface VendorCardProps {
  vendor: Vendor;
  inventory: VendorInventory[];
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendorId: string) => void;
}

function VendorCard({ vendor, inventory, onEdit, onDelete }: VendorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const avgQuality = inventory.length > 0 
    ? (inventory.reduce((sum, i) => sum + i.qualityRating, 0) / inventory.length).toFixed(1)
    : 'N/A';

  return (
    <motion.div variants={itemVariants}>
      <Card className="group card-interactive h-full border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="truncate font-display text-xl">{vendor.name}</CardTitle>
              <div className="mt-1 flex items-center gap-2">
                <RatingStars rating={vendor.reliabilityRating} size="md" />
                <span className="text-sm text-muted-foreground">Reliability</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(vendor)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Vendor
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => onDelete(vendor.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Specialties */}
          {vendor.specialties && vendor.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {vendor.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="bg-sage-light text-sage text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          )}

          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center rounded-lg bg-muted/50 p-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="mt-1 text-sm font-medium">{vendor.leadTimeDays}d</span>
              <span className="text-xs text-muted-foreground">Lead</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-muted/50 p-2">
              <Flower2 className="h-4 w-4 text-muted-foreground" />
              <span className="mt-1 text-sm font-medium">{inventory.length}</span>
              <span className="text-xs text-muted-foreground">Flowers</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-muted/50 p-2">
              <Star className="h-4 w-4 text-amber-400" />
              <span className="mt-1 text-sm font-medium">{avgQuality}</span>
              <span className="text-xs text-muted-foreground">Avg Quality</span>
            </div>
          </div>

          {/* Delivery Days */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-muted-foreground">Delivers:</span>
            {vendor.deliveryDays.map((day) => (
              <Badge key={day} variant="outline" className="text-xs">
                {day}
              </Badge>
            ))}
          </div>

          {/* Contact Info */}
          <div className="space-y-2 border-t pt-4">
            {vendor.contactInfo.phone && (
              <a
                href={`tel:${vendor.contactInfo.phone}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4" />
                {vendor.contactInfo.phone}
              </a>
            )}
            {vendor.contactInfo.email && (
              <a
                href={`mailto:${vendor.contactInfo.email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span className="truncate">{vendor.contactInfo.email}</span>
              </a>
            )}
          </div>

          {/* Notes */}
          {vendor.notes && (
            <div className="rounded-lg bg-accent/50 p-3">
              <p className="text-sm text-accent-foreground italic">"{vendor.notes}"</p>
            </div>
          )}

          {/* Flower Inventory - Expandable */}
          {inventory.length > 0 && (
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Flower2 className="h-4 w-4" />
                    View Flower Inventory ({inventory.length})
                  </span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-2">
                <AnimatePresence>
                  {inventory.map((item) => (
                    <FlowerInventoryItem key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Vendors() {
  const [searchQuery, setSearchQuery] = useState('');
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [vendorInventory, setVendorInventory] = useState<VendorInventory[]>(initialInventory);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.specialties?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddVendor = () => {
    setEditingVendor(null);
    setDialogOpen(true);
  };

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setDialogOpen(true);
  };

  const handleDeleteVendor = (vendorId: string) => {
    setVendors(prev => prev.filter(v => v.id !== vendorId));
    setVendorInventory(prev => prev.filter(i => i.vendorId !== vendorId));
    toast.success('Vendor deleted');
  };

  const handleSaveVendor = (
    vendorData: Omit<Vendor, 'id'>, 
    inventory: Omit<VendorInventory, 'id' | 'vendorId'>[]
  ) => {
    if (editingVendor) {
      // Update existing vendor
      setVendors(prev => prev.map(v => 
        v.id === editingVendor.id ? { ...vendorData, id: editingVendor.id } : v
      ));
      // Update inventory
      setVendorInventory(prev => {
        const otherInventory = prev.filter(i => i.vendorId !== editingVendor.id);
        const newInventory = inventory.map((item, index) => ({
          ...item,
          id: `vi-${editingVendor.id}-${index}`,
          vendorId: editingVendor.id,
        }));
        return [...otherInventory, ...newInventory];
      });
      toast.success('Vendor updated');
    } else {
      // Add new vendor
      const newVendorId = `v${Date.now()}`;
      const newVendor: Vendor = { ...vendorData, id: newVendorId };
      setVendors(prev => [...prev, newVendor]);
      // Add inventory
      const newInventory = inventory.map((item, index) => ({
        ...item,
        id: `vi-${newVendorId}-${index}`,
        vendorId: newVendorId,
      }));
      setVendorInventory(prev => [...prev, ...newInventory]);
      toast.success('Vendor added');
    }
    setDialogOpen(false);
  };

  const getVendorInventory = (vendorId: string) => {
    return vendorInventory.filter(i => i.vendorId === vendorId);
  };

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
              Vendors
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage vendors and see which has the best flowers
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleAddVendor}>
            <Plus className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search vendors or specialties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Vendors Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2"
        >
          {filteredVendors.map((vendor) => (
            <VendorCard 
              key={vendor.id} 
              vendor={vendor} 
              inventory={getVendorInventory(vendor.id)}
              onEdit={handleEditVendor}
              onDelete={handleDeleteVendor}
            />
          ))}
        </motion.div>

        {filteredVendors.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">No vendors found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search criteria
            </p>
          </div>
        )}

        {/* Vendor Dialog */}
        <VendorDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          vendor={editingVendor}
          inventory={editingVendor ? getVendorInventory(editingVendor.id) : []}
          onSave={handleSaveVendor}
        />
      </motion.div>
    </div>
  );
}

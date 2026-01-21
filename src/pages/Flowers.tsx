import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Flower2, Edit2, Trash2, Check, X, ChevronDown, ChevronRight, Star, DollarSign, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { FlowerType } from '@/types';
import { defaultFlowers } from '@/data/defaultFlowers';
import { mockVendorInventory, mockVendors } from '@/data/mockData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const categoryColors: Record<string, string> = {
  'roses': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  'fillers': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'greens': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'specialty': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
};

const flowerEmojis: Record<string, string> = {
  'Roses': '🌹',
  'Carnations': '🌸',
  'Tulips': '🌷',
  'Sunflowers': '🌻',
  'Lilies': '💐',
  'Orchids': '🪻',
  'Hydrangea': '💠',
  'default': '🌼',
};

function getFlowerEmoji(name: string): string {
  for (const [key, emoji] of Object.entries(flowerEmojis)) {
    if (name.toLowerCase().includes(key.toLowerCase())) {
      return emoji;
    }
  }
  return flowerEmojis.default;
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'h-3 w-3',
            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted'
          )}
        />
      ))}
    </div>
  );
}

// Get vendor pricing for a specific flower
function getVendorPricing(flowerName: string) {
  return mockVendorInventory
    .filter(inv => inv.flowerType.toLowerCase().includes(flowerName.toLowerCase()) || 
                   flowerName.toLowerCase().includes(inv.flowerType.toLowerCase()))
    .map(inv => {
      const vendor = mockVendors.find(v => v.id === inv.vendorId);
      return {
        ...inv,
        vendorName: vendor?.name || 'Unknown Vendor',
        leadTime: vendor?.leadTimeDays || 0,
      };
    })
    .sort((a, b) => a.regularPrice - b.regularPrice);
}

export default function Flowers() {
  const { toast } = useToast();
  const [flowers, setFlowers] = useState<FlowerType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ costPerStem: number; stemsPerBunch: number }>({ costPerStem: 0, stemsPerBunch: 0 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedFlowers, setExpandedFlowers] = useState<Set<string>>(new Set());
  const [newFlower, setNewFlower] = useState<Partial<FlowerType>>({
    name: '',
    category: 'roses',
    costPerStem: 0,
    stemsPerBunch: 10,
    isActive: true,
  });

  // Load flowers from localStorage or use defaults
  useEffect(() => {
    const saved = localStorage.getItem('blooms_flowers');
    if (saved) {
      setFlowers(JSON.parse(saved));
    } else {
      const initialized = defaultFlowers.map((f, idx) => ({
        ...f,
        id: `flower-${idx}`,
        isActive: true,
      }));
      setFlowers(initialized);
    }
  }, []);

  // Save flowers to localStorage
  const saveFlowers = (updated: FlowerType[]) => {
    setFlowers(updated);
    localStorage.setItem('blooms_flowers', JSON.stringify(updated));
  };

  const filteredFlowers = flowers.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(flowers.map(f => f.category))];

  const handleStartEdit = (flower: FlowerType) => {
    setEditingId(flower.id);
    setEditValues({ costPerStem: flower.costPerStem, stemsPerBunch: flower.stemsPerBunch });
  };

  const handleSaveEdit = (id: string) => {
    const updated = flowers.map(f => 
      f.id === id ? { ...f, costPerStem: editValues.costPerStem, stemsPerBunch: editValues.stemsPerBunch } : f
    );
    saveFlowers(updated);
    setEditingId(null);
    toast({ title: 'Flower updated', description: 'Cost and bunch size saved.' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const updated = flowers.filter(f => f.id !== id);
    saveFlowers(updated);
    toast({ title: 'Flower removed', description: 'Flower has been removed from your library.' });
  };

  const handleAddFlower = () => {
    if (!newFlower.name) {
      toast({ title: 'Name required', description: 'Please enter a flower name.', variant: 'destructive' });
      return;
    }
    const flower: FlowerType = {
      id: `flower-custom-${Date.now()}`,
      name: newFlower.name,
      category: newFlower.category || 'roses',
      costPerStem: newFlower.costPerStem || 0,
      stemsPerBunch: newFlower.stemsPerBunch || 10,
      isActive: true,
    };
    saveFlowers([...flowers, flower]);
    setNewFlower({ name: '', category: 'roses', costPerStem: 0, stemsPerBunch: 10, isActive: true });
    setDialogOpen(false);
    toast({ title: 'Flower added', description: `${flower.name} has been added to your library.` });
  };

  const toggleExpanded = (id: string) => {
    setExpandedFlowers(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              Flower Library
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your flower types, costs, and compare vendor pricing
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Flower Type
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search flowers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant={categoryFilter === 'all' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setCategoryFilter('all')}
            >
              All
            </Badge>
            {categories.map(cat => (
              <Badge
                key={cat}
                variant={categoryFilter === cat ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Flower2 className="h-5 w-5 text-primary" />
                {filteredFlowers.length} Flower Types
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Click the arrow to expand and see vendor pricing comparison
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredFlowers.map(flower => {
                  const isExpanded = expandedFlowers.has(flower.id);
                  const vendorPricing = getVendorPricing(flower.name);
                  
                  return (
                    <Collapsible key={flower.id} open={isExpanded} onOpenChange={() => toggleExpanded(flower.id)}>
                      <div className={cn(
                        'rounded-lg border transition-colors',
                        isExpanded && 'border-primary/50 bg-primary/5'
                      )}>
                        {/* Main Row */}
                        <div className="flex items-center gap-3 p-3">
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          
                          <span className="text-xl shrink-0">{getFlowerEmoji(flower.name)}</span>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{flower.name}</p>
                            <Badge className={cn('text-xs', categoryColors[flower.category] || 'bg-muted text-muted-foreground')}>
                              {flower.category}
                            </Badge>
                          </div>
                          
                          {editingId === flower.id ? (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">$/stem:</span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editValues.costPerStem}
                                  onChange={(e) => setEditValues(prev => ({ ...prev, costPerStem: parseFloat(e.target.value) || 0 }))}
                                  className="w-20 text-right h-8"
                                />
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">stems/bunch:</span>
                                <Input
                                  type="number"
                                  value={editValues.stemsPerBunch}
                                  onChange={(e) => setEditValues(prev => ({ ...prev, stemsPerBunch: parseInt(e.target.value) || 0 }))}
                                  className="w-16 text-right h-8"
                                />
                              </div>
                              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleSaveEdit(flower.id)}>
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancelEdit}>
                                <X className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="text-right shrink-0">
                                <p className="font-medium">${flower.costPerStem.toFixed(2)}/stem</p>
                                <p className="text-xs text-muted-foreground">{flower.stemsPerBunch} stems/bunch</p>
                              </div>
                              
                              {vendorPricing.length > 0 && (
                                <Badge variant="secondary" className="bg-sage-light text-sage shrink-0">
                                  <Building2 className="h-3 w-3 mr-1" />
                                  {vendorPricing.length} vendors
                                </Badge>
                              )}
                              
                              <div className="flex gap-1 shrink-0">
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleStartEdit(flower)}>
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDelete(flower.id)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Collapsible Vendor Pricing */}
                        <CollapsibleContent>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="border-t px-3 py-2 bg-muted/30"
                              >
                                {vendorPricing.length === 0 ? (
                                  <p className="text-sm text-muted-foreground py-2">
                                    No vendors carry this flower yet. Add vendor inventory in the Vendors tab.
                                  </p>
                                ) : (
                                  <div className="space-y-2">
                                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                      <DollarSign className="h-3 w-3" />
                                      Vendor Pricing Comparison
                                    </p>
                                    <Table>
                                      <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                          <TableHead className="py-2">Vendor</TableHead>
                                          <TableHead className="text-center py-2">Regular Price</TableHead>
                                          <TableHead className="text-center py-2">Peak Price</TableHead>
                                          <TableHead className="text-center py-2">Quality</TableHead>
                                          <TableHead className="text-center py-2">Lead Time</TableHead>
                                          <TableHead className="py-2">Notes</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {vendorPricing.map((vp, idx) => (
                                          <TableRow key={vp.id} className={idx === 0 ? 'bg-emerald-50/50' : ''}>
                                            <TableCell className="py-2">
                                              <div className="flex items-center gap-2">
                                                {idx === 0 && (
                                                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">
                                                    Best Price
                                                  </Badge>
                                                )}
                                                <span className="font-medium">{vp.vendorName}</span>
                                              </div>
                                            </TableCell>
                                            <TableCell className="text-center py-2">
                                              ${vp.regularPrice.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-center py-2 font-medium text-rose">
                                              ${vp.peakPrice.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="py-2">
                                              <div className="flex items-center justify-center">
                                                <RatingStars rating={vp.qualityRating} />
                                              </div>
                                            </TableCell>
                                            <TableCell className="text-center py-2 text-muted-foreground">
                                              {vp.leadTime}d
                                            </TableCell>
                                            <TableCell className="py-2 text-sm text-muted-foreground max-w-[200px] truncate">
                                              {vp.notes}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Add Flower Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Flower Type</DialogTitle>
            <DialogDescription>
              Add a new flower to your library. You can set vendor pricing in the Vendors tab.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Flower Name</Label>
              <Input
                placeholder="e.g., Pink Peonies"
                value={newFlower.name}
                onChange={(e) => setNewFlower(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={newFlower.category}
                onValueChange={(value: 'roses' | 'fillers' | 'greens' | 'specialty') => setNewFlower(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roses">Roses</SelectItem>
                  <SelectItem value="fillers">Fillers</SelectItem>
                  <SelectItem value="greens">Greens</SelectItem>
                  <SelectItem value="specialty">Specialty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cost per Stem ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newFlower.costPerStem}
                  onChange={(e) => setNewFlower(prev => ({ ...prev, costPerStem: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Stems per Bunch</Label>
                <Input
                  type="number"
                  value={newFlower.stemsPerBunch}
                  onChange={(e) => setNewFlower(prev => ({ ...prev, stemsPerBunch: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddFlower}>Add Flower</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

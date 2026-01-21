import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, ChevronDown, ChevronUp, DollarSign, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useOnboarding } from '@/context/OnboardingContext';
import { flowerCategories } from '@/data/defaultFlowers';
import type { FlowerType } from '@/types';

export function FlowerLibraryStep() {
  const { flowers, toggleFlower, updateFlower, addCustomFlower, nextStep } = useOnboarding();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['roses', 'specialty', 'fillers', 'greens']);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingFlower, setEditingFlower] = useState<FlowerType | null>(null);
  
  // New flower form state
  const [newFlower, setNewFlower] = useState({
    name: '',
    category: 'specialty' as FlowerType['category'],
    costPerStem: 2.00,
    stemsPerBunch: 10,
  });

  const selectedCount = flowers.filter(f => f.isActive).length;

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleAddFlower = () => {
    if (newFlower.name.trim()) {
      addCustomFlower({
        ...newFlower,
        isActive: true,
      });
      setNewFlower({
        name: '',
        category: 'specialty',
        costPerStem: 2.00,
        stemsPerBunch: 10,
      });
      setShowAddDialog(false);
    }
  };

  const handleUpdateFlower = () => {
    if (editingFlower) {
      updateFlower(editingFlower.id, editingFlower);
      setEditingFlower(null);
    }
  };

  const groupedFlowers = flowers.reduce((acc, flower) => {
    if (!acc[flower.category]) acc[flower.category] = [];
    acc[flower.category].push(flower);
    return acc;
  }, {} as Record<string, FlowerType[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          Let's add the flowers you work with
        </h2>
        <p className="text-muted-foreground">
          Select the flowers you commonly use. You can adjust prices and add more later.
        </p>
      </div>

      {/* Selection summary */}
      <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          <span className="font-medium">{selectedCount} flowers selected</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Custom
        </Button>
      </div>

      {/* Flower categories */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {(Object.keys(flowerCategories) as Array<keyof typeof flowerCategories>).map(category => (
          <Collapsible
            key={category}
            open={expandedCategories.includes(category)}
            onOpenChange={() => toggleCategory(category)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between py-3 h-auto"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{flowerCategories[category].emoji}</span>
                  <span className="font-medium">{flowerCategories[category].label}</span>
                  <Badge variant="secondary" className="ml-2">
                    {groupedFlowers[category]?.filter(f => f.isActive).length || 0}/{groupedFlowers[category]?.length || 0}
                  </Badge>
                </div>
                {expandedCategories.includes(category) ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-1 gap-2 pl-8 pb-2">
                {groupedFlowers[category]?.map(flower => (
                  <motion.div
                    key={flower.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      flower.isActive 
                        ? 'bg-primary/5 border-primary/30' 
                        : 'bg-background border-border hover:border-primary/20'
                    }`}
                  >
                    <Checkbox
                      checked={flower.isActive}
                      onCheckedChange={() => toggleFlower(flower.id)}
                    />
                    <div className="flex-1 min-w-0" onClick={() => toggleFlower(flower.id)}>
                      <p className="font-medium truncate">{flower.name}</p>
                    </div>
                    {flower.isActive && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" />
                          <span>{flower.costPerStem.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-3.5 w-3.5" />
                          <span>{flower.stemsPerBunch}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingFlower(flower);
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Continue button */}
      <div className="pt-4 border-t">
        <Button 
          onClick={nextStep}
          disabled={selectedCount === 0}
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          Continue with {selectedCount} flowers
        </Button>
      </div>

      {/* Add Custom Flower Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Add Custom Flower</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Flower Name</Label>
              <Input
                value={newFlower.name}
                onChange={(e) => setNewFlower(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Blue Thistle"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select 
                value={newFlower.category} 
                onValueChange={(v) => setNewFlower(prev => ({ ...prev, category: v as FlowerType['category'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roses">Roses</SelectItem>
                  <SelectItem value="specialty">Specialty Flowers</SelectItem>
                  <SelectItem value="fillers">Fillers</SelectItem>
                  <SelectItem value="greens">Greens</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cost per Stem ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newFlower.costPerStem}
                  onChange={(e) => setNewFlower(prev => ({ ...prev, costPerStem: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Stems per Bunch</Label>
                <Input
                  type="number"
                  min="1"
                  value={newFlower.stemsPerBunch}
                  onChange={(e) => setNewFlower(prev => ({ ...prev, stemsPerBunch: parseInt(e.target.value) || 1 }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddFlower} disabled={!newFlower.name.trim()}>Add Flower</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Flower Dialog */}
      <Dialog open={!!editingFlower} onOpenChange={() => setEditingFlower(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Edit {editingFlower?.name}</DialogTitle>
          </DialogHeader>
          {editingFlower && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cost per Stem ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingFlower.costPerStem}
                    onChange={(e) => setEditingFlower(prev => prev ? { ...prev, costPerStem: parseFloat(e.target.value) || 0 } : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stems per Bunch</Label>
                  <Input
                    type="number"
                    min="1"
                    value={editingFlower.stemsPerBunch}
                    onChange={(e) => setEditingFlower(prev => prev ? { ...prev, stemsPerBunch: parseInt(e.target.value) || 1 } : null)}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingFlower(null)}>Cancel</Button>
            <Button onClick={handleUpdateFlower}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Phone, Mail, Globe, Star, Clock, Truck, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { mockVendors } from '@/data/mockData';
import type { Vendor } from '@/types';

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

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'h-4 w-4',
            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted'
          )}
        />
      ))}
    </div>
  );
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="group card-interactive h-full border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="truncate font-display text-xl">{vendor.name}</CardTitle>
              <div className="mt-1 flex items-center gap-2">
                <RatingStars rating={vendor.reliabilityRating} />
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
                <DropdownMenuItem>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Vendor
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
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
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Lead Time</p>
                <p className="truncate text-sm font-medium">{vendor.leadTimeDays} days</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2.5">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Order By</p>
                <p className="truncate text-sm font-medium">{vendor.orderCutoff}</p>
              </div>
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
            {vendor.contactInfo.website && (
              <a
                href={`https://${vendor.contactInfo.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe className="h-4 w-4" />
                {vendor.contactInfo.website}
              </a>
            )}
          </div>

          {/* Notes */}
          {vendor.notes && (
            <div className="rounded-lg bg-accent/50 p-3">
              <p className="text-sm text-accent-foreground italic">"{vendor.notes}"</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Vendors() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVendors = mockVendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.specialties?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
              Manage your wholesale suppliers and their offerings
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
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
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
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
      </motion.div>
    </div>
  );
}

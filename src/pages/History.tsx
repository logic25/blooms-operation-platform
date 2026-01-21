import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { History as HistoryIcon, TrendingUp, DollarSign, Package, Flower2, Star, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { mockFlowerSalesHistory, mockFlowerHistory, mockVendors } from '@/data/mockData';

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

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={cn(
          'h-3.5 w-3.5',
          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted'
        )}
      />
    ))}
  </div>
);

// Historical events list
const events = ["Valentine's Day 2025", "Mother's Day 2025", "Valentine's Day 2024"];

export default function History() {
  const [selectedEvent, setSelectedEvent] = useState<string>("Valentine's Day 2025");
  const [viewMode, setViewMode] = useState<'flowers' | 'vendors'>('flowers');

  // Filter data based on selected event - using useMemo for proper reactivity
  const eventFlowerData = useMemo(() => {
    return mockFlowerSalesHistory.filter(f => f.event === selectedEvent);
  }, [selectedEvent]);

  const eventVendorData = useMemo(() => {
    return mockFlowerHistory.filter(f => f.event === selectedEvent);
  }, [selectedEvent]);

  // Group vendor data by vendor - recalculated when selectedEvent changes
  const vendorPerformance = useMemo(() => {
    return mockVendors.map(vendor => {
      const vendorHistory = eventVendorData.filter(h => h.vendorId === vendor.id);
      const avgQuality = vendorHistory.length > 0 
        ? vendorHistory.reduce((sum, h) => sum + h.qualityScore, 0) / vendorHistory.length 
        : 0;
      const flowersSupplied = vendorHistory.map(h => h.flowerType);
      return {
        vendor,
        avgQuality,
        flowersSupplied,
        history: vendorHistory,
      };
    }).filter(v => v.history.length > 0);
  }, [eventVendorData]);

  const totalStems = useMemo(() => {
    return eventFlowerData.reduce((sum, f) => sum + f.totalStems, 0);
  }, [eventFlowerData]);

  const totalCost = useMemo(() => {
    return eventFlowerData.reduce((sum, f) => sum + f.totalCost, 0);
  }, [eventFlowerData]);

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
              Insights
            </h1>
            <p className="mt-1 text-muted-foreground">
              Review past events by flower type and vendor performance
            </p>
          </div>
          <Button variant="outline">
            Import Sales Data
          </Button>
        </div>

        {/* Event Selector */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map(event => (
                      <SelectItem key={event} value={event}>{event}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Flower2 className="h-5 w-5 text-sage" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total Stems</p>
                    <p className="font-display text-lg font-bold">{totalStems.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-rose" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total Cost</p>
                    <p className="font-display text-lg font-bold">${totalCost.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for view mode */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'flowers' | 'vendors')}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="flowers" className="flex items-center gap-2">
              <Flower2 className="h-4 w-4" />
              By Flower Type
            </TabsTrigger>
            <TabsTrigger value="vendors" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              By Vendor
            </TabsTrigger>
          </TabsList>

          {/* Flowers View */}
          <TabsContent value="flowers" className="mt-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={selectedEvent} // Re-animate when event changes
              className="space-y-4"
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-display text-xl flex items-center gap-2">
                    <Flower2 className="h-5 w-5 text-primary" />
                    Flower Usage for {selectedEvent}
                  </CardTitle>
                  <CardDescription>See which flowers you used most and their costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Flower Type</TableHead>
                          <TableHead className="text-center">Stems Used</TableHead>
                          <TableHead className="text-center">Total Cost</TableHead>
                          <TableHead className="text-center">Avg Quality</TableHead>
                          <TableHead>Top Vendor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {eventFlowerData.map((flower, index) => (
                          <motion.tr key={`${selectedEvent}-${flower.flowerType}`} variants={itemVariants}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Flower2 className="h-4 w-4 text-primary" />
                                <span className="font-medium">{flower.flowerType}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-medium">
                              {flower.totalStems.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-center">
                              ${flower.totalCost.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <RatingStars rating={Math.round(flower.avgQuality)} />
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({flower.avgQuality.toFixed(1)})
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="bg-sage-light text-sage">
                                {flower.topVendor}
                              </Badge>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {eventFlowerData.length === 0 && (
                    <div className="py-8 text-center text-muted-foreground">
                      No flower data for {selectedEvent} yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Vendors View */}
          <TabsContent value="vendors" className="mt-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={`vendors-${selectedEvent}`} // Re-animate when event changes
              className="grid gap-4 sm:grid-cols-2"
            >
              {vendorPerformance.map((vp) => (
                <motion.div key={`${selectedEvent}-${vp.vendor.id}`} variants={itemVariants}>
                  <Card className="border-border/50 h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="font-display text-lg">{vp.vendor.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <RatingStars rating={Math.round(vp.avgQuality)} />
                            <span className="text-sm text-muted-foreground">
                              Avg Quality: {vp.avgQuality.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            vp.avgQuality >= 4.5 && 'bg-emerald-100 text-emerald-700',
                            vp.avgQuality >= 3.5 && vp.avgQuality < 4.5 && 'bg-amber-100 text-amber-700',
                            vp.avgQuality < 3.5 && 'bg-rose-100 text-rose-700'
                          )}
                        >
                          {vp.avgQuality >= 4.5 ? 'Excellent' : vp.avgQuality >= 3.5 ? 'Good' : 'Fair'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs text-muted-foreground">Flowers supplied:</span>
                        {vp.flowersSupplied.map(flower => (
                          <Badge key={flower} variant="outline" className="text-xs">
                            {flower}
                          </Badge>
                        ))}
                      </div>

                      <div className="space-y-2">
                        {vp.history.map((h, i) => (
                          <div key={i} className="rounded-lg bg-muted/50 p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">{h.flowerType}</span>
                              <div className="flex items-center gap-1">
                                <RatingStars rating={h.qualityScore} />
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              ${h.pricePerStem.toFixed(2)}/stem • "{h.notes}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {vendorPerformance.length === 0 && (
                <div className="col-span-2 py-8 text-center text-muted-foreground">
                  No vendor data for {selectedEvent} yet.
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Year over Year Comparison - Only show for Valentine's events */}
        {selectedEvent.includes("Valentine's") && (
          <motion.div variants={itemVariants}>
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-peach-light">
                    <TrendingUp className="h-5 w-5 text-peach" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-xl">Year-over-Year: Valentine's Day</CardTitle>
                    <CardDescription>Flower usage growth comparison</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Flower Type</TableHead>
                        <TableHead className="text-center">V-Day 2024</TableHead>
                        <TableHead className="text-center">V-Day 2025</TableHead>
                        <TableHead className="text-center">Growth</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {['Red Roses', 'Pink Roses'].map(flowerType => {
                        const data2024 = mockFlowerSalesHistory.find(f => f.flowerType === flowerType && f.event === "Valentine's Day 2024");
                        const data2025 = mockFlowerSalesHistory.find(f => f.flowerType === flowerType && f.event === "Valentine's Day 2025");
                        const growth = data2024 && data2025 
                          ? ((data2025.totalStems - data2024.totalStems) / data2024.totalStems * 100)
                          : 0;

                        return (
                          <TableRow key={flowerType}>
                            <TableCell className="font-medium">{flowerType}</TableCell>
                            <TableCell className="text-center text-muted-foreground">
                              {data2024?.totalStems.toLocaleString() || '-'}
                            </TableCell>
                            <TableCell className="text-center">
                              {data2025?.totalStems.toLocaleString() || '-'}
                            </TableCell>
                            <TableCell className="text-center">
                              {growth !== 0 && (
                                <Badge
                                  variant="secondary"
                                  className={growth > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}
                                >
                                  {growth > 0 ? '+' : ''}{growth.toFixed(0)}%
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 rounded-lg bg-sage-light/50 p-4">
                  <p className="text-sm text-sage">
                    <strong>Insight:</strong> Red Roses grew 12.5% year-over-year for Valentine's Day. 
                    NH Blossom Wholesale consistently delivers the best rose quality.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

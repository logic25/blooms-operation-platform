import { motion } from 'framer-motion';
import { History as HistoryIcon, TrendingUp, DollarSign, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

// Mock historical data
const mockHistoricalEvents = [
  {
    id: 'h1',
    name: "Valentine's Day 2024",
    date: '2024-02-14',
    totalUnits: 280,
    revenue: 22450,
    topProducts: ['Classic Dozen Roses', 'Premium Romance', 'Mixed Spring Bouquet'],
  },
  {
    id: 'h2',
    name: "Mother's Day 2024",
    date: '2024-05-12',
    totalUnits: 320,
    revenue: 28800,
    topProducts: ['Mixed Spring Bouquet', 'Garden Elegance', 'Blush & Bloom'],
  },
  {
    id: 'h3',
    name: "Valentine's Day 2023",
    date: '2023-02-14',
    totalUnits: 245,
    revenue: 19200,
    topProducts: ['Classic Dozen Roses', 'Sweet Petite', 'Premium Romance'],
  },
];

const mockProductHistory = [
  { name: 'Classic Dozen Roses', vday2023: 75, vday2024: 87, growth: 16 },
  { name: 'Mixed Spring Bouquet', vday2023: 40, vday2024: 45, growth: 12.5 },
  { name: 'Premium Romance', vday2023: 18, vday2024: 22, growth: 22 },
  { name: 'Sweet Petite', vday2023: 65, vday2024: 72, growth: 11 },
  { name: 'Garden Elegance', vday2023: 25, vday2024: 30, growth: 20 },
  { name: 'Blush & Bloom', vday2023: 22, vday2024: 24, growth: 9 },
];

export default function History() {
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
              History
            </h1>
            <p className="mt-1 text-muted-foreground">
              Review past events and sales data to inform your planning
            </p>
          </div>
          <Button variant="outline">
            Import Sales Data
          </Button>
        </div>

        {/* Past Events Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {mockHistoricalEvents.map((event) => (
            <motion.div key={event.id} variants={itemVariants}>
              <Card className="card-interactive h-full border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="font-display text-lg">{event.name}</CardTitle>
                      <CardDescription>{new Date(event.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}</CardDescription>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-light">
                      <HistoryIcon className="h-5 w-5 text-sage" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Units Sold</span>
                      </div>
                      <p className="mt-1 font-display text-xl font-bold">{event.totalUnits}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Revenue</span>
                      </div>
                      <p className="mt-1 font-display text-xl font-bold">${event.revenue.toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Top Products
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {event.topProducts.map((product, index) => (
                        <Badge
                          key={product}
                          variant="secondary"
                          className={index === 0 ? 'bg-rose-light text-rose' : ''}
                        >
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Year over Year Comparison */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-peach-light">
                  <TrendingUp className="h-5 w-5 text-peach" />
                </div>
                <div>
                  <CardTitle className="font-display text-xl">Year-over-Year Comparison</CardTitle>
                  <CardDescription>Valentine's Day sales growth by product</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">V-Day 2023</TableHead>
                      <TableHead className="text-center">V-Day 2024</TableHead>
                      <TableHead className="text-center">Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProductHistory.map((product) => (
                      <TableRow key={product.name}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{product.vday2023}</TableCell>
                        <TableCell className="text-center">{product.vday2024}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-700"
                          >
                            +{product.growth}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 rounded-lg bg-sage-light/50 p-4">
                <p className="text-sm text-sage">
                  <strong>Insight:</strong> Overall Valentine's Day sales grew 14% from 2023 to 2024. 
                  Premium arrangements showed the strongest growth at 22%.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

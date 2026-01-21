import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Database, Palette } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function Settings() {
  return (
    <div className="p-4 lg:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Settings
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Info */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-light">
                    <User className="h-5 w-5 text-sage" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-lg">Business Information</CardTitle>
                    <CardDescription>Your shop details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Shop Name</Label>
                    <Input id="shopName" defaultValue="Blooms in Bunches" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="hello@bloomsinbunches.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="123 Flower Lane, Petalville, NH 03801" />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-peach-light">
                    <Bell className="h-5 w-5 text-peach" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-lg">Notifications</CardTitle>
                    <CardDescription>How you want to be reminded</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order Deadline Reminders</p>
                    <p className="text-sm text-muted-foreground">Get notified before order cutoffs</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delivery Reminders</p>
                    <p className="text-sm text-muted-foreground">Know when to expect deliveries</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Planning Summary</p>
                    <p className="text-sm text-muted-foreground">Overview of upcoming events</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-light">
                    <Database className="h-5 w-5 text-rose" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-lg">Data Management</CardTitle>
                    <CardDescription>Import and export your data</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Import Sales Data</p>
                    <p className="text-sm text-muted-foreground">Upload CSV from your POS system</p>
                  </div>
                  <Button variant="outline">Import</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Export All Data</p>
                    <p className="text-sm text-muted-foreground">Download your data as CSV</p>
                  </div>
                  <Button variant="outline">Export</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-display text-lg">Account Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Products</span>
                  <span className="font-medium">6</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Vendors</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Plans</span>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Historical Events</span>
                  <span className="font-medium">3</span>
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                    <Palette className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-lg">Appearance</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Theme customization coming soon. The app currently uses a beautiful sage and rose color palette designed for florists.
                </p>
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="border-border/50 bg-gradient-to-br from-sage-light to-peach-light/30">
              <CardContent className="p-5">
                <h3 className="font-display text-lg font-semibold">Need Help?</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Have questions about using Blooms Operations? We're here to help!
                </p>
                <Button className="mt-4 w-full" variant="outline">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

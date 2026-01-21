import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppModeProvider } from "@/context/AppModeContext";
import { OnboardingProvider, useOnboarding } from "@/context/OnboardingContext";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Flowers from "./pages/Flowers";
import Vendors from "./pages/Vendors";
import Planner from "./pages/Planner";
import CustomerOrders from "./pages/CustomerOrders";
import VendorOrders from "./pages/VendorOrders";
import History from "./pages/History";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { hasCompletedOnboarding, setHasCompletedOnboarding } = useOnboarding();

  if (!hasCompletedOnboarding) {
    return (
      <OnboardingFlow 
        onComplete={() => setHasCompletedOnboarding(true)} 
      />
    );
  }

  return (
    <AppModeProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<CustomerOrders />} />
            <Route path="/vendor-orders" element={<VendorOrders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/flowers" element={<Flowers />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AppModeProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <OnboardingProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </OnboardingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

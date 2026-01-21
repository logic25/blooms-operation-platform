import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { differenceInDays } from 'date-fns';
import type { AppMode, CustomEvent, DailyOrder, CoolerInventoryItem, ExpectedDelivery, Delivery } from '@/types';
import { mockRecipes } from '@/data/mockData';

// Default events (holidays)
const defaultEvents: CustomEvent[] = [
  {
    id: 'valentines-2026',
    name: "Valentine's Day",
    eventDate: new Date('2026-02-14'),
    planningWindowDays: 21,
    isActive: true,
    isRecurring: true,
    recurrenceRule: 'Feb 14',
  },
  {
    id: 'mothers-day-2026',
    name: "Mother's Day",
    eventDate: new Date('2026-05-10'), // 2nd Sunday of May 2026
    planningWindowDays: 21,
    isActive: true,
    isRecurring: true,
    recurrenceRule: '2nd Sunday of May',
  },
  {
    id: 'easter-2026',
    name: 'Easter',
    eventDate: new Date('2026-04-05'),
    planningWindowDays: 14,
    isActive: true,
    isRecurring: true,
  },
  {
    id: 'christmas-2026',
    name: 'Christmas',
    eventDate: new Date('2026-12-25'),
    planningWindowDays: 21,
    isActive: true,
    isRecurring: true,
    recurrenceRule: 'Dec 25',
  },
];

// Initial mock daily orders
const initialDailyOrders: DailyOrder[] = [
  {
    id: 'do1',
    productId: '1',
    quantity: 2,
    deliveryDate: new Date('2026-01-21'),
    customerName: 'Sarah Johnson',
    notes: 'Delivery by 2pm',
    status: 'pending',
    createdAt: new Date('2026-01-20'),
  },
  {
    id: 'do2',
    productId: '4',
    quantity: 1,
    deliveryDate: new Date('2026-01-21'),
    customerName: 'Mike Chen',
    status: 'pending',
    createdAt: new Date('2026-01-20'),
  },
  {
    id: 'do3',
    productId: '2',
    quantity: 3,
    deliveryDate: new Date('2026-01-22'),
    customerName: 'Emily Davis',
    notes: 'Birthday arrangement',
    status: 'pending',
    createdAt: new Date('2026-01-21'),
  },
  {
    id: 'do4',
    productId: '5',
    quantity: 1,
    deliveryDate: new Date('2026-01-22'),
    status: 'pending',
    createdAt: new Date('2026-01-21'),
  },
  {
    id: 'do5',
    productId: '3',
    quantity: 2,
    deliveryDate: new Date('2026-01-23'),
    customerName: 'Thompson Wedding',
    notes: 'High priority - wedding centerpieces',
    status: 'pending',
    createdAt: new Date('2026-01-20'),
  },
  {
    id: 'do6',
    productId: '1',
    quantity: 1,
    deliveryDate: new Date('2026-01-23'),
    customerName: 'Robert Williams',
    status: 'pending',
    createdAt: new Date('2026-01-21'),
  },
  {
    id: 'do7',
    productId: '6',
    quantity: 4,
    deliveryDate: new Date('2026-01-24'),
    customerName: 'Corporate - Apex Inc',
    notes: 'Monthly office flowers',
    status: 'pending',
    createdAt: new Date('2026-01-21'),
  },
];

// Initial cooler inventory
const initialCoolerInventory: CoolerInventoryItem[] = [
  { id: 'ci1', flowerType: 'Red Roses', quantity: 48, lastUpdated: new Date('2026-01-21T08:30:00') },
  { id: 'ci2', flowerType: 'Pink Roses', quantity: 24, lastUpdated: new Date('2026-01-21T08:30:00') },
  { id: 'ci3', flowerType: 'White Tulips', quantity: 30, lastUpdated: new Date('2026-01-21T08:30:00') },
  { id: 'ci4', flowerType: "Baby's Breath", quantity: 60, lastUpdated: new Date('2026-01-21T08:30:00') },
  { id: 'ci5', flowerType: 'Eucalyptus', quantity: 40, lastUpdated: new Date('2026-01-21T08:30:00') },
  { id: 'ci6', flowerType: 'Carnations', quantity: 36, lastUpdated: new Date('2026-01-21T08:30:00') },
  { id: 'ci7', flowerType: 'Leather Leaf Fern', quantity: 25, lastUpdated: new Date('2026-01-21T08:30:00') },
  { id: 'ci8', flowerType: 'Garden Roses', quantity: 12, lastUpdated: new Date('2026-01-21T08:30:00') },
  { id: 'ci9', flowerType: 'Ranunculus', quantity: 0, lastUpdated: new Date('2026-01-21T08:30:00') },
  { id: 'ci10', flowerType: 'Hydrangea', quantity: 6, lastUpdated: new Date('2026-01-21T08:30:00') },
  { id: 'ci11', flowerType: 'Dusty Miller', quantity: 15, lastUpdated: new Date('2026-01-21T08:30:00') },
  { id: 'ci12', flowerType: 'Spray Roses', quantity: 8, lastUpdated: new Date('2026-01-21T08:30:00') },
  { id: 'ci13', flowerType: 'Waxflower', quantity: 20, lastUpdated: new Date('2026-01-21T08:30:00') },
  { id: 'ci14', flowerType: 'Stock', quantity: 0, lastUpdated: new Date('2026-01-21T08:30:00') },
];

// Initial expected deliveries
const initialExpectedDeliveries: ExpectedDelivery[] = [
  {
    id: 'ed1',
    vendorId: 'v1',
    flowerType: 'Red Roses',
    quantity: 50,
    orderDate: new Date('2026-01-19'),
    expectedDate: new Date('2026-01-22'),
    received: false,
  },
  {
    id: 'ed2',
    vendorId: 'v4',
    flowerType: 'Eucalyptus',
    quantity: 40,
    orderDate: new Date('2026-01-18'),
    expectedDate: new Date('2026-01-22'),
    received: false,
  },
];

interface AppModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  activeEventId: string | null;
  setActiveEventId: (id: string | null) => void;
  
  // Events
  events: CustomEvent[];
  addEvent: (event: Omit<CustomEvent, 'id'>) => void;
  updateEvent: (id: string, event: Partial<CustomEvent>) => void;
  deleteEvent: (id: string) => void;
  upcomingEvent: CustomEvent | null;
  daysToUpcomingEvent: number | null;
  
  // Daily orders
  dailyOrders: DailyOrder[];
  addDailyOrder: (order: Omit<DailyOrder, 'id' | 'createdAt'>) => void;
  updateDailyOrder: (id: string, order: Partial<DailyOrder>) => void;
  deleteDailyOrder: (id: string) => void;
  fulfillOrder: (id: string) => void;
  
  // Cooler inventory (raw physical counts - now computed)
  coolerInventory: CoolerInventoryItem[];
  updateInventoryQuantity: (flowerType: string, quantity: number) => void;
  
  // Expected deliveries
  expectedDeliveries: ExpectedDelivery[];
  markDeliveryReceived: (id: string) => void;
  addExpectedDelivery: (delivery: Omit<ExpectedDelivery, 'id'>) => void;
  
  // Deliveries tracking (auto-deduction system)
  deliveries: Delivery[];
  addDelivery: (delivery: Omit<Delivery, 'id'>) => void;
  
  // Computed available inventory
  getAvailableInventory: () => { flowerType: string; delivered: number; committed: number; available: number }[];
}

const AppModeContext = createContext<AppModeContextType | null>(null);

export function AppModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode>('daily');
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [events, setEvents] = useState<CustomEvent[]>(defaultEvents);
  const [dailyOrders, setDailyOrders] = useState<DailyOrder[]>(initialDailyOrders);
  const [coolerInventory, setCoolerInventory] = useState<CoolerInventoryItem[]>(initialCoolerInventory);
  const [expectedDeliveries, setExpectedDeliveries] = useState<ExpectedDelivery[]>(initialExpectedDeliveries);
  
  // Find upcoming event within planning window
  const { upcomingEvent, daysToUpcomingEvent } = useMemo(() => {
    const now = new Date();
    const activeEvents = events.filter(e => e.isActive);
    
    for (const event of activeEvents) {
      const daysUntil = differenceInDays(event.eventDate, now);
      if (daysUntil > 0 && daysUntil <= event.planningWindowDays) {
        return { upcomingEvent: event, daysToUpcomingEvent: daysUntil };
      }
    }
    return { upcomingEvent: null, daysToUpcomingEvent: null };
  }, [events]);
  
  // Event management
  const addEvent = (event: Omit<CustomEvent, 'id'>) => {
    const newEvent: CustomEvent = {
      ...event,
      id: `event-${Date.now()}`,
    };
    setEvents(prev => [...prev, newEvent]);
  };
  
  const updateEvent = (id: string, eventUpdate: Partial<CustomEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...eventUpdate } : e));
  };
  
  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };
  
  // Daily order management
  const addDailyOrder = (order: Omit<DailyOrder, 'id' | 'createdAt'>) => {
    const newOrder: DailyOrder = {
      ...order,
      id: `do-${Date.now()}`,
      createdAt: new Date(),
    };
    setDailyOrders(prev => [...prev, newOrder]);
  };
  
  const updateDailyOrder = (id: string, orderUpdate: Partial<DailyOrder>) => {
    setDailyOrders(prev => prev.map(o => o.id === id ? { ...o, ...orderUpdate } : o));
  };
  
  const deleteDailyOrder = (id: string) => {
    setDailyOrders(prev => prev.filter(o => o.id !== id));
  };
  
  const fulfillOrder = (id: string) => {
    setDailyOrders(prev => prev.map(o => 
      o.id === id ? { ...o, status: 'fulfilled' as const } : o
    ));
  };
  
  // Inventory management
  const updateInventoryQuantity = (flowerType: string, quantity: number) => {
    setCoolerInventory(prev => {
      const existing = prev.find(i => i.flowerType === flowerType);
      if (existing) {
        return prev.map(i => 
          i.flowerType === flowerType 
            ? { ...i, quantity, lastUpdated: new Date() }
            : i
        );
      }
      return [...prev, {
        id: `ci-${Date.now()}`,
        flowerType,
        quantity,
        lastUpdated: new Date(),
      }];
    });
  };
  
  // Expected delivery management
  const markDeliveryReceived = (id: string) => {
    const delivery = expectedDeliveries.find(d => d.id === id);
    if (delivery) {
      // Add to cooler inventory when received
      updateInventoryQuantity(
        delivery.flowerType, 
        (coolerInventory.find(i => i.flowerType === delivery.flowerType)?.quantity || 0) + delivery.quantity
      );
      setExpectedDeliveries(prev => prev.map(d => 
        d.id === id ? { ...d, received: true } : d
      ));
    }
  };
  
  const addExpectedDelivery = (delivery: Omit<ExpectedDelivery, 'id'>) => {
    const newDelivery: ExpectedDelivery = {
      ...delivery,
      id: `ed-${Date.now()}`,
    };
    setExpectedDeliveries(prev => [...prev, newDelivery]);
  };
  
  return (
    <AppModeContext.Provider value={{
      mode,
      setMode,
      activeEventId,
      setActiveEventId,
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      upcomingEvent,
      daysToUpcomingEvent,
      dailyOrders,
      addDailyOrder,
      updateDailyOrder,
      deleteDailyOrder,
      fulfillOrder,
      coolerInventory,
      updateInventoryQuantity,
      expectedDeliveries,
      markDeliveryReceived,
      addExpectedDelivery,
    }}>
      {children}
    </AppModeContext.Provider>
  );
}

export function useAppMode() {
  const context = useContext(AppModeContext);
  if (!context) {
    throw new Error('useAppMode must be used within AppModeProvider');
  }
  return context;
}

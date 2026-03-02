
# Dashboard Layout Improvement

## Problem
The current dashboard has three tall, narrow cards (Upcoming Orders, Available Inventory, Shopping List) in a `5/3/4` column grid layout. On desktop they sit side-by-side but are visually cramped; on mobile they stack vertically making three long cards in a row.

## Solution
Reorganize the grid into a **2-row layout**:
- **Top row**: Upcoming Orders (span 7 cols) + Available Inventory (span 5 cols) -- side by side
- **Bottom row**: Shopping List spans the full 12 columns as a **horizontal card** with a more compact, multi-column list layout inside

This gives the Shopping List breathing room and breaks the monotony of three vertical cards.

## Changes

### 1. Update Dashboard grid layout (`src/pages/Dashboard.tsx`)
- Change the grid from a single 3-column row to a 2-row layout:
  - Row 1: Upcoming Orders (`lg:col-span-7`) + Available Inventory (`lg:col-span-5`)
  - Row 2: Shopping List (`lg:col-span-12`) -- full width

### 2. Update Shopping List component (`src/components/dashboard/ShoppingList.tsx`)
- When rendered full-width, display the shopping list items in a **2 or 3 column grid** instead of a single vertical list
- Keep the header/actions bar horizontal across the top
- This makes the card feel intentionally horizontal rather than just stretched

These are minimal changes -- only the grid classes in `Dashboard.tsx` and the inner list layout in `ShoppingList.tsx` need updating.

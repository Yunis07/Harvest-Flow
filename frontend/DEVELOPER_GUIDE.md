# Harvest-Log — Developer Guide

> A complete reference for customizing every page, component, and feature in the Harvest-Log platform.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Auth / Sign-In Page](#auth--sign-in-page)
3. [Landing Page](#landing-page)
4. [Marketplace Page (Buyer)](#marketplace-page-buyer)
5. [Dashboard Page](#dashboard-page)
6. [Live Tracking Page (Order & Track)](#live-tracking-page-order--track)
7. [Seller Inventory Page](#seller-inventory-page)
8. [Seller Orders Page](#seller-orders-page)
9. [Transporter Earnings Page](#transporter-earnings-page)
10. [Ugly Produce / Flash Deals Page](#ugly-produce--flash-deals-page)
11. [Risk Engine Page](#risk-engine-page)
12. [Layout & Navigation](#layout--navigation)
13. [Role Switcher](#role-switcher)
14. [Auth Context (Roles & Users)](#auth-context-roles--users)
15. [Location Tracking Hook](#location-tracking-hook)
16. [Order System Hook](#order-system-hook)
17. [Group Chat Hook & Component](#group-chat-hook--component)
18. [Map Component](#map-component)
19. [Design System (Colors, Fonts, Themes)](#design-system-colors-fonts-themes)
20. [Mock Data](#mock-data)
21. [Routing](#routing)

---

## Project Structure

```
src/
├── assets/             ← Static images (auth background, logos, etc.)
├── components/
│   ├── layout/         ← AppLayout (sidebar, header, navigation)
│   ├── marketplace/    ← ProductCard
│   ├── order/          ← OrderChat, OrderStatusBar
│   ├── shared/         ← MapComponent, RoleSwitcher
│   └── ui/             ← shadcn/ui primitives (Button, Input, etc.)
├── contexts/           ← AuthContext (roles, login, register)
├── data/               ← mockData.ts (demo products, sellers)
├── hooks/              ← useLocationTracking, useOrderSystem, useGroupChat, useOsrmRoutes
├── lib/                ← firebase.ts, geo.ts, utils.ts
├── pages/              ← All page components
└── types/              ← TypeScript type definitions
```

---

## Auth / Sign-In Page

**File:** `src/pages/AuthPage.tsx`

### Change the background image

1. Replace the file at **`src/assets/auth-bg.png`** with your new image.
2. The import at the top of `AuthPage.tsx` will automatically use it:
   ```tsx
   import authBg from '@/assets/auth-bg.png';
   ```
3. If your new image has a different extension (e.g., `.jpg`), update the import path.

### Adjust the overlay opacity

In `AuthPage.tsx`, find the overlay `<div>`:
```tsx
<div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
```
- Change `bg-background/80` to `/60` for more image visibility, or `/90` for less.
- Remove `backdrop-blur-sm` to disable the blur effect.

### Change the left branding panel

The left half (green gradient with logo and features) is in the same file under the comment `{/* Left Panel - Branding */}`. Edit:
- **Logo text:** Search for `Harvest-Log` and `Agri-FinTech Platform`
- **Headline:** Search for `Connecting Farms`
- **Feature pills:** Search for `['Real-time GPS', 'Smart Routes', ...]`
- **Gradient:** The class `bg-gradient-hero` is defined in `src/index.css`

### Change demo login roles

Edit the `ROLE_OPTIONS` array and the `handleQuickDemo` function in the same file.

### Change form fields

All form fields (Name, Email, Password, Phone) are standard `<Input>` components in the `<form>` block.

---

## Landing Page

**File:** `src/pages/LandingPage.tsx`

- Edit hero text, CTA buttons, and feature sections directly in this file.
- Styling uses Tailwind classes with design tokens from `index.css`.

---

## Marketplace Page (Buyer)

**File:** `src/pages/MarketplacePage.tsx`

### Change product data

- **Mock products:** Edit `src/data/mockData.ts` — the `MOCK_PRODUCTS` or similar array.
- **Product card UI:** Edit `src/components/marketplace/ProductCard.tsx`.

### Change delivery fee calculation

Search for the delivery fee logic (distance-based formula):
```tsx
Math.max(30, Math.round(avgCartDistance * 10))
```
Adjust the base fee (`30`) or multiplier (`10`) as needed.

### Change distance filtering radius

Edit `src/lib/geo.ts` — the `DEFAULT_RADIUS_KM` or the Haversine filter functions.

---

## Dashboard Page

**File:** `src/pages/DashboardPage.tsx`

- This page renders different content based on the user's role (Buyer, Seller, Transporter).
- Each role section is conditionally rendered. Search for `user?.role` checks.
- **Transporter Nearby Requests:** Accept/Reject buttons and logic are in this file.

---

## Live Tracking Page (Order & Track)

**File:** `src/pages/LiveTrackingPage.tsx`

- Map rendering, marker placement, and OSRM route drawing happen here.
- Uses `useLocationTracking` hook for GPS data.
- Uses `useOrderSystem` hook for order lifecycle.
- **Order status bar:** `src/components/order/OrderStatusBar.tsx`
- **Chat panel:** `src/components/order/OrderChat.tsx`

### Change marker colors

Search for marker creation code — colors are set as hex strings (Red for Buyer, Blue for Seller, Green for Transporter).

### Change route styling

Search for `addLayer` calls — route line colors and widths are set there.

---

## Seller Inventory Page

**File:** `src/pages/SellerInventoryPage.tsx`

- Product CRUD (add, edit, delete) is managed here.
- **Categories:** Search for the category array (`Vegetables`, `Fruits`, `Grains`, `Dairy`, etc.) to add/remove categories.
- **Ugly Produce toggle:** Search for `ugly` or `isUgly` to modify the toggle behavior.
- **Freshness indicator:** Edit the freshness field and its UI rendering.

---

## Seller Orders Page

**File:** `src/pages/SellerOrdersPage.tsx`

- Displays orders placed by Buyers for this Seller.
- Order status updates and tracking integration are here.

---

## Transporter Earnings Page

**File:** `src/pages/TransporterEarningsPage.tsx`

- Trip history, payout summaries, and earnings charts.
- Edit mock earnings data or connect to real data source here.

---

## Ugly Produce / Flash Deals Page

**File:** `src/pages/UglyProducePage.tsx`

- Displays products marked as "ugly" or discounted by Sellers.
- To rename this section, update:
  1. The page title in this file
  2. The navigation label in `src/components/layout/AppLayout.tsx`
  3. The route path in `src/App.tsx`

---

## Risk Engine Page

**File:** `src/pages/RiskEnginePage.tsx`

- AI-powered credit risk assessment UI.
- Edit scoring criteria, form fields, and result display here.

---

## Layout & Navigation

**File:** `src/components/layout/AppLayout.tsx`

### Add a new navigation item

1. Find the navigation items array (role-specific arrays for Buyer, Seller, Transporter).
2. Add a new object with `label`, `icon`, `path`.
3. Create the corresponding page in `src/pages/`.
4. Add the route in `src/App.tsx`.

### Change sidebar styling

Edit the Tailwind classes in `AppLayout.tsx`. The sidebar uses design tokens from `index.css`.

### Change header content

The top header bar (with role switcher, notifications) is in the same file.

---

## Role Switcher

**File:** `src/components/shared/RoleSwitcher.tsx`

- Controls demo role switching (Buyer ↔ Seller ↔ Transporter).
- To add a new role: update `ROLE_CONFIG`, add the role to `UserRole` type in `AuthContext.tsx`.

---

## Auth Context (Roles & Users)

**File:** `src/contexts/AuthContext.tsx`

### Add a new role

1. Update the `UserRole` type: `export type UserRole = 'buyer' | 'seller' | 'transporter' | 'your_role';`
2. Add a demo user in the `DEMO_USERS` record.
3. Update role-specific UI in `AppLayout.tsx`, `DashboardPage.tsx`, etc.

### Change demo user data

Edit the `DEMO_USERS` object — names, emails, locations, etc.

### Change login behavior

Edit the `login` callback to connect to a real auth backend.

---

## Location Tracking Hook

**File:** `src/hooks/useLocationTracking.ts`

- Handles real GPS fetching and demo entity placement.
- **Demo offsets:** Search for `SELLER_OFFSET` / `TRANSPORT_OFFSET` to change how far demo entities spawn from the Buyer.
- **Watch options:** Adjust `enableHighAccuracy`, `timeout`, `maximumAge` for GPS precision.

---

## Order System Hook

**File:** `src/hooks/useOrderSystem.ts`

- Manages the full order lifecycle state machine.
- **Order statuses:** `CREATED → PLACED → ACCEPTED → PICKED_UP → IN_TRANSIT → DELIVERED → COMPLETED`
- To add a new status, update the status type and the transition logic.

---

## Group Chat Hook & Component

**Files:**
- Hook: `src/hooks/useGroupChat.ts`
- UI: `src/components/order/OrderChat.tsx`

- System messages are auto-injected on order events.
- To add new system message triggers, edit the hook's event handlers.
- To change chat bubble styling, edit `OrderChat.tsx`.

---

## Map Component

**File:** `src/components/shared/MapComponent.tsx`

- Uses Leaflet (react-leaflet) for map rendering.
- Tile layer, default zoom, and attribution are configured here.
- **Change map tiles:** Update the `TileLayer` URL (e.g., switch to Mapbox, CartoDB, etc.).

---

## Design System (Colors, Fonts, Themes)

**Files:**
- CSS tokens: `src/index.css`
- Tailwind config: `tailwind.config.ts`

### Change the primary color

1. Open `src/index.css`
2. Find `:root { --primary: ... }` and update the HSL values.
3. Dark mode colors are under `.dark { ... }`.

### Change fonts

1. Update the `font-family` declarations in `index.css`.
2. Update `fontFamily` in `tailwind.config.ts`.

### Change gradient definitions

Search for `--gradient-` custom properties in `index.css`.

---

## Mock Data

**File:** `src/data/mockData.ts`

- All demo products, sellers, and sample data live here.
- To add new demo products, append to the arrays in this file.
- Products added here will appear in the Marketplace automatically.

---

## Routing

**File:** `src/App.tsx`

### Add a new page

1. Create the page component in `src/pages/YourPage.tsx`.
2. Import it in `App.tsx`.
3. Add a `<Route path="/your-path" element={<YourPage />} />` inside the router.
4. Add a navigation link in `AppLayout.tsx`.

### Change the default route

Update the `<Route index element={...} />` or the redirect logic.

---

## Quick Reference: Common Changes

| I want to...                          | File to edit                              |
|---------------------------------------|-------------------------------------------|
| Change sign-in background image       | Replace `src/assets/auth-bg.png`          |
| Change sign-in overlay opacity        | `src/pages/AuthPage.tsx` (overlay div)    |
| Change brand name                     | `src/pages/AuthPage.tsx`, `index.html`    |
| Add a product category                | `src/pages/SellerInventoryPage.tsx`       |
| Change delivery fee formula           | `src/pages/MarketplacePage.tsx`           |
| Add a new navigation item             | `src/components/layout/AppLayout.tsx`     |
| Change demo user names                | `src/contexts/AuthContext.tsx`            |
| Change primary color                  | `src/index.css`                           |
| Add a new page                        | `src/pages/` + `src/App.tsx`              |
| Change map tiles                      | `src/components/shared/MapComponent.tsx`  |
| Change distance radius                | `src/lib/geo.ts`                          |
| Change demo entity spawn distance     | `src/hooks/useLocationTracking.ts`        |

---

*Last updated: February 2026*

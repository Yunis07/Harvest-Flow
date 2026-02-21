import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppStateProvider } from "@/contexts/AppStateContext";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { DashboardPage } from "./pages/DashboardPage";
import { UglyProducePage } from "./pages/UglyProducePage";
import { RiskEnginePage } from "./pages/RiskEnginePage";
import { LiveTrackingPage } from "./pages/LiveTrackingPage";
import { SellerInventoryPage } from "./pages/SellerInventoryPage";
import { SellerOrdersPage } from "./pages/SellerOrdersPage";
import { TransporterEarningsPage } from "./pages/TransporterEarningsPage";
import { NearbyContactsPage } from "./pages/NearbyContactsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/marketplace" /> : <LandingPage />
        }
      />

      <Route
        path="/auth"
        element={
          isAuthenticated ? <Navigate to="/marketplace" /> : <AuthPage />
        }
      />

      {/* Protected Routes */}
      <Route
        path="/marketplace"
        element={
          <ProtectedRoute>
            <MarketplacePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <MarketplacePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ugly-produce"
        element={
          <ProtectedRoute>
            <UglyProducePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <SellerOrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <SellerInventoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/active-ride"
        element={
          <ProtectedRoute>
            <LiveTrackingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/live-tracking"
        element={
          <ProtectedRoute>
            <LiveTrackingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/earnings"
        element={
          <ProtectedRoute>
            <TransporterEarningsPage />
          </ProtectedRoute>
        }
      />

      {/* Risk Analysis Page */}
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <RiskEnginePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/nearby-contacts"
        element={
          <ProtectedRoute>
            <NearbyContactsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppStateProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </AppStateProvider>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

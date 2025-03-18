
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SecurityProvider } from "./context/SecurityContext";
import Index from "./pages/Index";
import NetworkScanner from "./pages/NetworkScanner";
import PasswordManager from "./pages/PasswordManager";
import SystemMonitor from "./pages/SystemMonitor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SecurityProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/network-scanner" element={<NetworkScanner />} />
            <Route path="/password-manager" element={<PasswordManager />} />
            <Route path="/system-monitor" element={<SystemMonitor />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SecurityProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

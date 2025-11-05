import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SurveyorDashboard from "./pages/SurveyorDashboard";
import RespondentDashboard from "./pages/RespondentDashboard";
import CreateSurvey from "./pages/CreateSurvey";
import EditSurvey from "./pages/EditSurvey";
import TakeSurvey from "./pages/TakeSurvey";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Rutas protegidas por rol */}
            <Route path="/admin/dashboard" element={
              <RoleProtectedRoute allowedRoles={['administrador']}>
                <AdminDashboard />
              </RoleProtectedRoute>
            } />
            
            <Route path="/surveys/dashboard" element={
              <RoleProtectedRoute allowedRoles={['encuestador']}>
                <SurveyorDashboard />
              </RoleProtectedRoute>
            } />
            
            <Route path="/encuestas" element={
              <RoleProtectedRoute allowedRoles={['respondiente']}>
                <RespondentDashboard />
              </RoleProtectedRoute>
            } />
            
            {/* Rutas para encuestadores y administradores */}
            <Route path="/create-survey" element={
              <RoleProtectedRoute allowedRoles={['encuestador', 'administrador']}>
                <CreateSurvey />
              </RoleProtectedRoute>
            } />
            
            <Route path="/edit-survey/:id" element={
              <RoleProtectedRoute allowedRoles={['encuestador', 'administrador']}>
                <EditSurvey />
              </RoleProtectedRoute>
            } />
            
            <Route path="/reports/:id" element={
              <RoleProtectedRoute allowedRoles={['encuestador', 'administrador']}>
                <Reports />
              </RoleProtectedRoute>
            } />
            
            {/* Rutas para todos los usuarios autenticados */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/take-survey/:id" element={<ProtectedRoute><TakeSurvey /></ProtectedRoute>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

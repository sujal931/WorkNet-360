
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Employees from "@/pages/employees/Employees";
import Tasks from "@/pages/tasks/Tasks";
import Attendance from "@/pages/attendance/Attendance";
import LeaveApply from "@/pages/leave/LeaveApply";
import LeaveRequests from "@/pages/leave/LeaveRequests";
import LeaveHistory from "@/pages/leave/LeaveHistory";
import Payroll from "@/pages/payroll/Payroll";
import JobPostings from "@/pages/recruitment/JobPostings";
import Applications from "@/pages/recruitment/Applications";
import InternalJobs from "@/pages/recruitment/InternalJobs";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import Unauthorized from "@/pages/Unauthorized";

// Import HR specific pages
import HRDashboard from "@/pages/hr/HRDashboard";
import CompleteEmploymentInfo from "@/pages/hr/CompleteEmploymentInfo";

// Import Admin Dashboard
import AdminDashboard from "@/pages/admin/AdminDashboard";
import HRLeaveRequests from "@/pages/admin/HRLeaveRequests";
import PayrollOverview from "@/pages/admin/PayrollOverview";
import UserManagement from "@/components/admin/UserManagement";
import JobOutcomes from "@/pages/admin/JobOutcomes";
import EmployeeAnalytics from "@/pages/admin/EmployeeAnalytics";

const queryClient = new QueryClient();

// Helper component to redirect based on user role
const DashboardRouter = () => {
  const { user } = useAuth();
  
  // Redirect different user roles to their appropriate dashboards
  if (user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user?.role === "hr") {
    return <Navigate to="/hr/dashboard" replace />;
  } else {
    return <Navigate to="/dashboard/employee" replace />;  // Redirect regular employees
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Protected routes - all user types */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              
              {/* Dashboard router - redirects based on role */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardRouter />} />
              </Route>

              {/* Employee specific routes */}
              <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
                <Route path="/dashboard/employee" element={<Dashboard />} />
                <Route path="/leave/apply" element={<LeaveApply />} />
              </Route>
              
              {/* HR specific routes */}
              <Route element={<ProtectedRoute allowedRoles={["hr"]} />}>
                <Route path="/hr/dashboard" element={<HRDashboard />} />
                <Route path="/hr/complete-employment-info" element={<CompleteEmploymentInfo />} />
                <Route path="/leave/requests" element={<LeaveRequests />} />
                <Route path="/payroll" element={<Payroll />} />
                <Route path="/recruitment/jobs" element={<JobPostings />} />
                <Route path="/recruitment/applications" element={<Applications />} />
              </Route>

              {/* Admin only routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/hr-leave-requests" element={<HRLeaveRequests />} />
                <Route path="/admin/payroll-overview" element={<PayrollOverview />} />
                <Route path="/admin/user-management" element={<UserManagement />} />
                <Route path="/admin/job-outcomes" element={<JobOutcomes />} />
                <Route path="/admin/analytics" element={<EmployeeAnalytics />} />
              </Route>
              
              {/* Admin and HR shared routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin", "hr"]} />}>
                <Route path="/employees" element={<Employees />} />
              </Route>

              {/* All user routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin", "hr", "employee"]} />}>
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/leave/history" element={<LeaveHistory />} />
                <Route path="/recruitment/internal" element={<InternalJobs />} />
              </Route>
              
              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

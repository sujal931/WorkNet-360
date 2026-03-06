
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import AdminSummaryCards from "@/components/admin/AdminSummaryCards";
import TaskOverview from "@/components/admin/TaskOverview";
import LeaveRequestsOverview from "@/components/admin/LeaveRequestsOverview"; 
import JobApplicationsOverview from "@/components/admin/JobApplicationsOverview";
import PayrollSummary from "@/components/admin/PayrollSummary";
import AddUserDialog from "@/components/admin/AddUserDialog";
import UserManagement from "@/components/admin/UserManagement";
import LeaveManagement from "@/components/admin/LeaveManagement";
import PayrollManagement from "@/components/admin/PayrollManagement";
import TaskManagement from "@/components/admin/TaskManagement";
import JobApplicationManagement from "@/components/admin/JobApplicationManagement";

const AdminDashboard = () => {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  const handleAddUser = (userData: any) => {
    console.log("New user data:", userData);
    toast.success(`User ${userData.name} has been created successfully`);
    setIsAddUserDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Complete system management</p>
        </div>
        <Button className="btn-gradient" onClick={() => setIsAddUserDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="leaves">Leaves</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="applications">Job Applications</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Row 1 - Summary Cards */}
          <AdminSummaryCards />

          {/* Row 2 - Task & Leave Overview */}
          <div className="grid gap-6 md:grid-cols-2">
            <TaskOverview />
            <LeaveRequestsOverview />
          </div>

          {/* Row 3 - Job Applications & Payroll */}
          <div className="grid gap-6 md:grid-cols-2">
            <JobApplicationsOverview />
            <PayrollSummary />
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        {/* Leaves Tab */}
        <TabsContent value="leaves">
          <LeaveManagement />
        </TabsContent>

        {/* Payroll Tab */}
        <TabsContent value="payroll">
          <PayrollManagement />
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <TaskManagement />
        </TabsContent>

        {/* Job Applications Tab */}
        <TabsContent value="applications">
          <JobApplicationManagement />
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <AddUserDialog
        open={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
        onSave={handleAddUser}
      />
    </div>
  );
};

export default AdminDashboard;

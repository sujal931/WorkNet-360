
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import EmployeeDialog from "@/pages/employees/EmployeeDialog";
import SummaryCards from "@/components/hr/SummaryCards";
import TasksOverview from "@/components/hr/TasksOverview";
import LeaveRequestsOverview from "@/components/hr/LeaveRequestsOverview";
import JobApplicationsOverview from "@/components/hr/JobApplicationsOverview";
import PayrollOverview from "@/components/hr/PayrollOverview";

const HRDashboard = () => {
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);

  const handleAddEmployee = (employeeData: any) => {
    console.log("New employee data:", employeeData);
    toast.success(`Employee ${employeeData.name} has been created successfully`);
    setIsAddEmployeeDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your HR dashboard</p>
        </div>
        <Button className="btn-gradient" onClick={() => setIsAddEmployeeDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Employee
        </Button>
      </div>

      {/* Row 1 - Summary Cards */}
      <SummaryCards />

      {/* Row 2 - Task & Leave Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <TasksOverview />
        <LeaveRequestsOverview />
      </div>

      {/* Row 3 - Employee Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <JobApplicationsOverview />
        <PayrollOverview />
      </div>

      {/* Employee Creation Dialog */}
      <EmployeeDialog
        open={isAddEmployeeDialogOpen}
        onOpenChange={setIsAddEmployeeDialogOpen}
        onSave={handleAddEmployee}
      />
    </div>
  );
};

export default HRDashboard;

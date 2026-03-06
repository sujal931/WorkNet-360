
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Calendar, FileText, DollarSign, Briefcase } from "lucide-react";

const AdminSummaryCards = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold">48</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total HRs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold">4</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pending Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold">12</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold">25</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payroll</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold">14</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Job Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold">8</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSummaryCards;

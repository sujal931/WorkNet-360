
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, DollarSign } from "lucide-react";

const SummaryCards = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
          <CardTitle className="text-sm font-medium text-muted-foreground">Pending Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold">5</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pending Task Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold">12</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payroll Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold">8</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;

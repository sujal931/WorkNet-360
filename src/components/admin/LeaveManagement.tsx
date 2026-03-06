
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";

// Mock data
const mockLeaves = [
  { id: 1, employee: "John Doe", department: "Engineering", type: "Vacation", from: "2025-05-20", to: "2025-05-25", status: "pending" },
  { id: 2, employee: "Sarah Williams", department: "HR", type: "Sick Leave", from: "2025-05-19", to: "2025-05-19", status: "pending" },
  { id: 3, employee: "Mike Johnson", department: "Marketing", type: "Personal", from: "2025-05-22", to: "2025-05-23", status: "approved" },
  { id: 4, employee: "Lisa Brown", department: "Finance", type: "Vacation", from: "2025-05-25", to: "2025-05-30", status: "pending" },
  { id: 5, employee: "Alex Chen", department: "Engineering", type: "Family Emergency", from: "2025-05-18", to: "2025-05-21", status: "rejected" }
];

const LeaveManagement = () => {
  const handleApproveLeave = (id: number) => {
    toast.success(`Leave request #${id} has been approved`);
  };
  
  const handleRejectLeave = (id: number) => {
    toast.success(`Leave request #${id} has been rejected`);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Leave Management</CardTitle>
        <CardDescription>Manage leave requests from all employees</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by employee name, department..."
            className="pl-8"
          />
        </div>
        
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">From</TableHead>
                <TableHead className="hidden md:table-cell">To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLeaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell className="font-medium">{leave.employee}</TableCell>
                  <TableCell>{leave.department}</TableCell>
                  <TableCell>{leave.type}</TableCell>
                  <TableCell className="hidden md:table-cell">{leave.from}</TableCell>
                  <TableCell className="hidden md:table-cell">{leave.to}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        leave.status === "approved" ? "outline" :
                        leave.status === "rejected" ? "destructive" : "secondary"
                      }
                    >
                      {leave.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {leave.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-green-500 text-green-500 hover:bg-green-50"
                          onClick={() => handleApproveLeave(leave.id)}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-red-500 text-red-500 hover:bg-red-50"
                          onClick={() => handleRejectLeave(leave.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Processed</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveManagement;

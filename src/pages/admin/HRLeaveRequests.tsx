
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Mock data for demonstration
const mockLeaveRequests = [
  { id: 1, employee: "Jane Smith", role: "HR", type: "Vacation", days: 5, from: "2025-06-10", to: "2025-06-15", status: "Pending" },
  { id: 2, employee: "Michael Brown", role: "HR", type: "Sick Leave", days: 2, from: "2025-05-25", to: "2025-05-26", status: "Pending" },
  { id: 3, employee: "Sarah Johnson", role: "HR", type: "Personal Leave", days: 1, from: "2025-06-01", to: "2025-06-01", status: "Pending" },
];

const HRLeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests);
  
  const handleApproveLeave = (id: number) => {
    setLeaveRequests(leaveRequests.map(request => 
      request.id === id ? { ...request, status: "Approved" } : request
    ));
    toast.success(`Leave request #${id} has been approved`);
  };
  
  const handleRejectLeave = (id: number) => {
    setLeaveRequests(leaveRequests.map(request => 
      request.id === id ? { ...request, status: "Rejected" } : request
    ));
    toast.success(`Leave request #${id} has been rejected`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HR Leave Requests</h1>
        <p className="text-muted-foreground">Manage leave requests from HR staff</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>HR Leave Requests</CardTitle>
          <CardDescription>Review and approve leave requests from HR staff members</CardDescription>
        </CardHeader>
        <CardContent>
          {leaveRequests.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>HR Staff</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.employee}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>{request.from}</TableCell>
                      <TableCell>{request.to}</TableCell>
                      <TableCell>{request.days}</TableCell>
                      <TableCell>
                        <Badge variant={
                          request.status === "Approved" ? "default" :
                          request.status === "Rejected" ? "destructive" : "outline"
                        }>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {request.status === "Pending" && (
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleApproveLeave(request.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-destructive" 
                              onClick={() => handleRejectLeave(request.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No leave requests from HR staff at this time
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HRLeaveRequests;

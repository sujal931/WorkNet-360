
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Mock data
const mockLeaveRequests = [
  { id: 1, employee: "John Doe", type: "Sick Leave", days: 2, from: "2025-05-20", status: "pending" },
  { id: 2, employee: "Emily Brown", type: "Vacation", days: 5, from: "2025-06-10", status: "pending" },
  { id: 3, employee: "Sarah Chen", type: "Personal Leave", days: 1, from: "2025-05-18", status: "pending" }
];

const LeaveRequestsOverview = () => {
  const navigate = useNavigate();
  
  const handleApproveLeave = (id: number) => {
    toast.success(`Leave request #${id} has been approved`);
  };
  
  const handleRejectLeave = (id: number) => {
    toast.success(`Leave request #${id} has been rejected`);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Recent Leave Requests</CardTitle>
        <CardDescription>Recent employee leave requests requiring your approval</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden sm:table-cell">Days</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLeaveRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.employee}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell className="hidden sm:table-cell">{request.days}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-8" 
                        onClick={() => handleApproveLeave(request.id)}>
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" className="h-8"
                        onClick={() => handleRejectLeave(request.id)}>
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-right">
          <Button variant="link" size="sm" onClick={() => navigate("/leave/requests")}>
            View All Leave Requests
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveRequestsOverview;


import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data
const mockLeaveRequests = [
  { id: 1, employee: "John Smith", department: "Engineering", type: "Vacation", from: "2025-05-20", to: "2025-05-25", status: "pending" },
  { id: 2, employee: "Sarah Williams", department: "HR", type: "Sick Leave", from: "2025-05-19", to: "2025-05-19", status: "pending" },
  { id: 3, employee: "Mike Johnson", department: "Marketing", type: "Personal", from: "2025-05-22", to: "2025-05-23", status: "pending" }
];

const LeaveRequestsOverview = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Leave Requests</CardTitle>
        <CardDescription>Recent leave requests pending approval</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead className="hidden sm:table-cell">Department</TableHead>
                <TableHead className="text-right">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLeaveRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.employee}</TableCell>
                  <TableCell className="hidden sm:table-cell">{request.department}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">
                      {request.type}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-right">
          <Button variant="link" size="sm" onClick={() => navigate("/leave/requests")}>
            View All Requests
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveRequestsOverview;

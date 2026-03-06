
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Clock, FileText } from "lucide-react";
import { toast } from "sonner";
import { apiService } from "@/services/api";

interface LeaveRequest {
  _id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedDate: string;
  processedDate?: string;
  approvedBy?: {
    name: string;
    email: string;
  };
  comments?: string;
}

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const fetchLeaveHistory = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.leaves.getHistory();
      setLeaves(data);
    } catch (error) {
      console.error("Error fetching leave history:", error);
      // Error is handled by API service already
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelLeave = async (id: string) => {
    if (window.confirm("Are you sure you want to cancel this leave request?")) {
      try {
        await apiService.leaves.cancel(id);
        toast.success("Leave request cancelled successfully");
        fetchLeaveHistory(); // Refresh the data
      } catch (error) {
        console.error("Error cancelling leave request:", error);
        // Error is handled by API service already
      }
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Leave History</h1>
          <p className="text-muted-foreground">
            View and manage your leave requests
          </p>
        </div>
        <Button onClick={() => navigate("/leave/apply")} className="btn-gradient">
          Apply for Leave
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Leave Requests</CardTitle>
          <CardDescription>
            Track the status of your leave applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : leaves.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="hidden md:table-cell">Days</TableHead>
                    <TableHead className="hidden lg:table-cell">Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaves.map((leave) => (
                    <TableRow key={leave._id}>
                      <TableCell className="font-medium">{leave.leaveType}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {format(new Date(leave.startDate), "MMM dd")} - {format(new Date(leave.endDate), "MMM dd, yyyy")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{leave.days}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>
                            {format(new Date(leave.submittedDate), "MMM dd, yyyy")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{renderStatusBadge(leave.status)}</TableCell>
                      <TableCell className="text-right">
                        {leave.status === "Pending" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleCancelLeave(leave._id)}
                          >
                            Cancel
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>You have not applied for any leave yet.</p>
              <Button 
                variant="link" 
                onClick={() => navigate("/leave/apply")}
                className="mt-2"
              >
                Apply for your first leave
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveHistory;

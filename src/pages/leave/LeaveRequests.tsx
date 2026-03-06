
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Search, Check, X, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LeaveRequestDialog from "@/pages/leave/LeaveRequestDialog";

// Mock leave request data
const mockLeaveRequests = [
  {
    id: 1,
    employee: {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      department: "Engineering"
    },
    leaveType: "Vacation",
    startDate: new Date("2025-05-20"),
    endDate: new Date("2025-05-24"),
    days: 5,
    reason: "Annual family vacation",
    status: "Pending",
    appliedDate: new Date("2025-05-10")
  },
  {
    id: 2,
    employee: {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      department: "Marketing"
    },
    leaveType: "Sick",
    startDate: new Date("2025-05-15"),
    endDate: new Date("2025-05-16"),
    days: 2,
    reason: "Doctor appointment and recovery",
    status: "Approved",
    appliedDate: new Date("2025-05-08"),
    approvedBy: "Admin User",
    approvedDate: new Date("2025-05-09")
  },
  {
    id: 3,
    employee: {
      id: 3,
      name: "Emily Brown",
      email: "emily.b@example.com",
      department: "Finance"
    },
    leaveType: "Personal",
    startDate: new Date("2025-05-18"),
    endDate: new Date("2025-05-18"),
    days: 1,
    reason: "Personal matters",
    status: "Pending",
    appliedDate: new Date("2025-05-12")
  },
  {
    id: 4,
    employee: {
      id: 4,
      name: "Michael Johnson",
      email: "michael.j@example.com",
      department: "Human Resources"
    },
    leaveType: "Bereavement",
    startDate: new Date("2025-05-22"),
    endDate: new Date("2025-05-24"),
    days: 3,
    reason: "Family funeral",
    status: "Pending",
    appliedDate: new Date("2025-05-11")
  },
  {
    id: 5,
    employee: {
      id: 5,
      name: "Robert Wilson",
      email: "robert.w@example.com",
      department: "Operations"
    },
    leaveType: "Vacation",
    startDate: new Date("2025-06-01"),
    endDate: new Date("2025-06-07"),
    days: 7,
    reason: "Summer vacation",
    status: "Rejected",
    appliedDate: new Date("2025-05-05"),
    approvedBy: "Admin User",
    approvedDate: new Date("2025-05-06"),
    rejectionReason: "High workload during that period"
  },
];

const LeaveRequests = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  
  // Filter leave requests based on search and tab
  const filteredRequests = mockLeaveRequests.filter(request => {
    const matchesSearch = 
      request.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      (activeTab === "pending" && request.status === "Pending") ||
      (activeTab === "approved" && request.status === "Approved") ||
      (activeTab === "rejected" && request.status === "Rejected") ||
      (activeTab === "all");
    
    return matchesSearch && matchesTab;
  });
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };
  
  const handleApproveRequest = (id: number) => {
    toast.success(`Leave request #${id} approved successfully`);
  };
  
  const handleRejectRequest = (id: number) => {
    toast.success(`Leave request #${id} rejected successfully`);
  };
  
  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge variant="outline">Pending</Badge>;
      case "Approved":
        return <Badge variant="default">Approved</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leave Requests</h1>
        <p className="text-muted-foreground mt-1">
          Manage employee leave requests
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-4 w-full md:w-[400px]">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search requests..."
            className="pl-8 w-full md:w-[260px]"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      <Card className="card-gradient">
        <CardHeader className="pb-2">
          <CardTitle>Leave Requests</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead className="hidden md:table-cell">Leave Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className="hidden lg:table-cell">Applied</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(request.employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{request.employee.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {request.employee.department}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="hidden md:table-cell">
                      {request.leaveType}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm">
                          {format(request.startDate, "MMM d")} 
                          {request.startDate.getTime() !== request.endDate.getTime() && (
                            <> - {format(request.endDate, "MMM d")}</>
                          )}
                          <span className="ml-1 text-muted-foreground">
                            ({request.days} day{request.days !== 1 ? 's' : ''})
                          </span>
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {format(request.appliedDate, "MMM d, yyyy")}
                    </TableCell>
                    
                    <TableCell className="hidden sm:table-cell">
                      {getStatusBadge(request.status)}
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {request.status === "Pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-500 hover:text-green-700 hover:bg-green-100"
                              onClick={() => handleApproveRequest(request.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleRejectRequest(request.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewRequest(request)}
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No leave requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <LeaveRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        request={selectedRequest}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
      />
    </div>
  );
};

export default LeaveRequests;

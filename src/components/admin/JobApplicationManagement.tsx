
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

// Mock data for demonstration
const mockApplications = [
  { id: 1, position: "Senior Developer", employee: "Alex Chen", department: "Engineering", currentPosition: "Developer", status: "pending" },
  { id: 2, position: "Team Lead", employee: "Jessica Wong", department: "Customer Support", currentPosition: "Senior Support Specialist", status: "pending" },
  { id: 3, position: "HR Manager", employee: "David Kim", department: "Human Resources", currentPosition: "HR Specialist", status: "accepted" },
  { id: 4, position: "Project Manager", employee: "Lisa Thompson", department: "Engineering", currentPosition: "Technical Lead", status: "rejected" },
  { id: 5, position: "Marketing Director", employee: "John Lewis", department: "Marketing", currentPosition: "Marketing Manager", status: "pending" }
];

const JobApplicationManagement = () => {
  const [filter, setFilter] = useState("all");
  
  // Filter applications based on status
  const filteredApplications = mockApplications.filter(application => {
    return filter === "all" || application.status === filter;
  });
  
  const handleAcceptApplication = (id: number, employee: string) => {
    toast.success(`Application from ${employee} has been accepted`);
  };
  
  const handleRejectApplication = (id: number, employee: string) => {
    toast.success(`Application from ${employee} has been rejected`);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Job Application Management</CardTitle>
        <CardDescription>Review and manage internal job applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              className="pl-8"
            />
          </div>
          <Select
            value={filter}
            onValueChange={setFilter}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead className="hidden md:table-cell">Current Position</TableHead>
                <TableHead className="hidden lg:table-cell">Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.position}</TableCell>
                  <TableCell>{application.employee}</TableCell>
                  <TableCell className="hidden md:table-cell">{application.currentPosition}</TableCell>
                  <TableCell className="hidden lg:table-cell">{application.department}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        application.status === "accepted" ? "outline" :
                        application.status === "rejected" ? "destructive" : "secondary"
                      }
                      className={application.status === "accepted" ? "border-green-500 text-green-700" : ""}
                    >
                      {application.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {application.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-green-500 text-green-500 hover:bg-green-50"
                          onClick={() => handleAcceptApplication(application.id, application.employee)}
                        >
                          Accept
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-red-500 text-red-500 hover:bg-red-50"
                          onClick={() => handleRejectApplication(application.id, application.employee)}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm"
                      >
                        View Details
                      </Button>
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

export default JobApplicationManagement;

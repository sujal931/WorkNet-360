
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Mock data
const mockJobApplications = [
  { id: 1, employee: "Michael Roberts", position: "Senior Developer", department: "Engineering", status: "pending" },
  { id: 2, employee: "Lisa Wang", position: "Marketing Specialist", department: "Marketing", status: "pending" }
];

const JobApplicationsOverview = () => {
  const navigate = useNavigate();
  
  const handleApproveApplication = (id: number) => {
    toast.success(`Job application #${id} has been approved`);
  };
  
  const handleRejectApplication = (id: number) => {
    toast.success(`Job application #${id} has been rejected`);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Internal Job Applications</CardTitle>
        <CardDescription>Recent internal job applications requiring your review</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead className="hidden sm:table-cell">Position</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockJobApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.employee}</TableCell>
                  <TableCell className="hidden sm:table-cell">{application.position}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-8"
                        onClick={() => handleApproveApplication(application.id)}>
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" className="h-8"
                        onClick={() => handleRejectApplication(application.id)}>
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
          <Button variant="link" size="sm" onClick={() => navigate("/recruitment/applications")}>
            View All Applications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobApplicationsOverview;
